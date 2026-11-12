// ===== APPLICATION PORTFOLIO — SCRIPT COMPLET CORRIGÉ, ORGANISÉ ET DÉDUPLIQUÉ =====
// Toutes les fonctionnalités des versions précédentes ont été conservées.
// En cas de doublons, seule la version la plus complète/la plus récente a été gardée.
//
// Version 2 :
//  • connexion au serveur (api.php) : compteur de visites réel et partagé,
//    statut de connexion, mode d'accès (libre / privé), cadenas sur les liens réservés ;
//  • formulaire de contact réellement transmis (repli : messagerie de l'utilisateur) ;
//  • suppression des clonages d'éléments qui annulaient des écouteurs entre eux ;
//  • onglets accessibles au clavier (flèches, Début, Fin) sans piéger la touche Tab ;
//  • styles dynamiques déplacés dans style.css.
//
// Version 3 : tous les PDF réservés ; texte « accès réservé » pour lecteurs d'écran.
//
// Version 4 : lecture seule (visionneuse intégrée, raccourcis d'impression bloqués).
//
// Version 5 (novembre 2026) — SITE AUTONOME, SANS GOOGLE DRIVE :
//  • Google Drive et GoatCounter entièrement retirés (plus aucune redirection externe) ;
//  • chaque document s'ouvre d'un clic dans la visionneuse du site (PDF.js), identique
//    dans les modes libre et privé : pages affichées à la demande, navigation page par
//    page, zoom, plein écran, aucune commande de téléchargement ni d'impression ;
//  • les fichiers ne sont jamais servis par leur adresse : api.php délivre une
//    autorisation de lecture signée et doc.php vérifie les droits CÔTÉ SERVEUR ;
//  • filigrane nominatif (nom, e-mail, date) sur les documents réservés ;
//  • statistiques réelles côté serveur (base SQLite), fuseau Africa/Casablanca ;
//  • page de lecture partageable lire.php?d=… ; masquage des rubriques vides ;
//  • PDF.js 4 (module ES) ; isEvalSupported:false conservé (faille CVE-2024-4367 des versions < 4.2.67).
//
// RAPPEL HONNÊTE : la visionneuse empêche le téléchargement et l'impression proposés
// par l'interface et dissuade la copie ; elle ne peut pas empêcher une capture d'écran,
// une photographie de l'écran ni la récupération du flux par un utilisateur autorisé
// expert. Le contrôle d'accès, lui, est réel : il est fait par le serveur.

'use strict';

// ╔═════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION CÔTÉ NAVIGATEUR — le MODE D'ACCÈS se règle UNIQUEMENT ║
// ║  dans prive/config.php (serveur), jamais ici.                        ║
// ╚═════════════════════════════════════════════════════════════════════╝
const PORTFOLIO_CONFIG = {
    apiUrl: 'api.php',                      // backend PHP (même dossier que index.html)
    heartbeatMs: 60000,                     // rafraîchissement « en ligne » (1 min)
    forcerHautDePage: true,                 // page affichée en haut à chaque chargement
    debug: ['localhost', '127.0.0.1'].includes(window.location.hostname),
    tabContainers: '.research-tabs-compact, .documents-tabs-compact, .filiere-tabs',
    lecteur: {
        // PDF.js (Mozilla) : bibliothèque d'affichage, chargée seulement à la première lecture.
        // Pour l'héberger chez vous : copiez pdf.min.mjs et pdf.worker.min.mjs dans js/pdfjs/
        // et remplacez ces deux adresses par 'js/pdfjs/pdf.min.mjs' et 'js/pdfjs/pdf.worker.min.mjs'.
        pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs',
        pdfjsWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs',
        zoomMin: 0.5,
        zoomMax: 3,
        zoomPas: 0.25,
        largeurMax: 1000                    // largeur maximale d'une page à 100 % (px)
    }
};

const log = (...args) => { if (PORTFOLIO_CONFIG.debug) console.log(...args); };

log('🚀 Chargement du script portfolio...');

class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.currentTheme = 'light';
        this.dateTimeInterval = null;
        this.visitorInterval = null;
        this.resizeTimeout = null;
        this.isInitialized = false;
        this.server = null;          // état renvoyé par api.php (null = serveur indisponible)
        this.serverReady = null;     // promesse résolue quand le serveur a répondu (ou non)
        this.regexCache = new Map(); // motifs déjà convertis en expressions régulières
        this.reader = null;          // éléments de la visionneuse
        this.readerToken = 0;        // invalide les rendus en cours à la fermeture
        this.readerDoc = null;       // document PDF.js ouvert
        this.readerTask = null;
        this.readerPages = [];
        this.readerZoom = 1;
        this.readerObservers = [];
        this.readerObjectUrl = null;
        this.pdfjsPromise = null;
        this.readerReturnFocus = null;
        this.pageMode = false;       // true sur lire.php (visionneuse en pleine page)
        this.init();
    }

    // =====================================================================
    // 1. INITIALISATION GÉNÉRALE
    // =====================================================================

    init() {
        const start = () => {
            log('✅ DOM chargé — Initialisation de l\'application');
            this.setupConsoleWelcome();
            this.setupErrorHandling();
            this.initializeAll();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    }

    initializeAll() {
        if (this.isInitialized) return;

        // Chaque module est isolé : une erreur dans l'un n'empêche pas les autres.
        const modules = [
            // Navigation & structure de page
            'initNavigation', 'initSmoothScrolling', 'initBackToTop', 'initScrollEffects',
            'initKeyboardNavigation', 'initAccessibility', 'initEmptyGroups', 'initPlaceholderLinks',
            // Contenu dynamique / onglets
            'initTabs', 'initAllButtons', 'initResourceCards', 'initBooksSection',
            // Animations
            'initHeroAnimations', 'initAnimations', 'initCounters',
            // Formulaire de contact
            'initContactForm',
            // Widgets d'information
            'initDateTimeUpdater',
            // Fonctionnalités techniques
            'initDownloadLinks', 'initThemeToggle', 'initImageLazyLoading', 'initPerformanceOptimizations',
            // Visionneuse intégrée (modes libre ET privé)
            'initReader',
            // Serveur : visites, compte, mode d'accès, cadenas
            'initServerConnection',
            // Page lire.php : ouverture automatique du document
            'initReaderPage'
        ];

        modules.forEach(name => {
            try {
                const result = this[name]();
                if (result && typeof result.catch === 'function') {
                    result.catch(error => console.error(`❌ Erreur dans ${name}:`, error));
                }
            } catch (error) {
                console.error(`❌ Erreur dans ${name}:`, error);
            }
        });

        this.isInitialized = true;
        log('🎯 Application portfolio complètement initialisée');
    }

    setupConsoleWelcome() {
        if (!PORTFOLIO_CONFIG.debug) return;
        const styles = [
            'background: linear-gradient(135deg, #14243f, #2b5fd9)', 'color: white', 'padding: 12px 24px',
            'border-radius: 8px', 'font-size: 16px', 'font-weight: bold'
        ].join(';');
        console.log('%c🎓 Portfolio Dr. Khalid EL BAKKIOUI', styles);
        console.log('%cMathématicien • Enseignant CPGE • Chercheur en Probabilités', 'color: #14243f; font-weight: 500;');
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => console.error('❌ Erreur JavaScript:', e.error || e.message));
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Promise rejetée:', e.reason);
            e.preventDefault();
        });
    }

    // =====================================================================
    // 2. NAVIGATION
    // =====================================================================

    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.getElementById('navbar');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(navMenu, navToggle);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) this.closeMobileMenu(navMenu, navToggle);
        });

        // Même seuil que la media query CSS du menu mobile (992 px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) this.closeMobileMenu(navMenu, navToggle);
        }, { passive: true });

        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(navMenu, navToggle);
                navToggle.focus();
            }
        });

        if (navbar) {
            let ticking = false;
            this.handleNavbarScroll(navbar);
            window.addEventListener('scroll', () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    this.handleNavbarScroll(navbar);
                    ticking = false;
                });
            }, { passive: true });
        }
        log('✅ Navigation initialisée');
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('open');
        navMenu.classList.toggle('open', isOpening);
        navToggle.classList.toggle('active', isOpening);
        navToggle.setAttribute('aria-expanded', String(isOpening));
        document.body.style.overflow = isOpening ? 'hidden' : '';
        if (isOpening) {
            navMenu.querySelector('a')?.focus();
        } else {
            navToggle.focus();
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        if (!navMenu || !navToggle || !navMenu.classList.contains('open')) return;
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleNavbarScroll(navbar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const menuOpen = navbar.querySelector('.nav-menu.open');

        if (scrollTop > 80) {
            navbar.classList.add('scrolled');
            const hide = !menuOpen && scrollTop > this.lastScrollTop && scrollTop > 200;
            navbar.style.transform = hide ? 'translateY(-100%)' : 'translateY(0)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        this.lastScrollTop = Math.max(0, scrollTop);
    }

    // =====================================================================
    // 3. SCROLL (ancrage fluide, retour en haut, scrollspy)
    // =====================================================================

    initSmoothScrolling() {
        // Délégation : un seul écouteur pour tous les liens internes (y compris futurs).
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                e.preventDefault();          // liens « # » provisoires : pas de saut en haut de page
                return;
            }
            if (!document.querySelector(this.safeSelector(targetId))) return;
            e.preventDefault();
            this.scrollToElement(targetId);
        });
    }

    safeSelector(hash) {
        try {
            return '#' + CSS.escape(decodeURIComponent(hash.replace(/^#/, '')));
        } catch (e) {
            return hash;
        }
    }

    scrollToElement(targetId) {
        const targetElement = document.querySelector(this.safeSelector(targetId));
        if (!targetElement) return;
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 56;
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 6;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        this.closeMobileMenu(document.querySelector('.nav-menu'), document.querySelector('.nav-toggle'));
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        const toggleVisibility = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            backToTop.classList.toggle('visible', scrollTop > 300);
        };
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
    }

    initScrollEffects() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.setActiveNavLink(entry.target.getAttribute('id'), navLinks);
            });
        }, { threshold: 0, rootMargin: '-35% 0px -60% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    setActiveNavLink(activeId, navLinks) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // =====================================================================
    // 4. ANIMATIONS
    // =====================================================================

    initHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-contact, .hero-buttons');
        if (heroElements.length === 0 || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out both';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Sécurité : si l'observateur ne se déclenche pas, le contenu reste lisible.
        setTimeout(() => heroElements.forEach(el => {
            if (!el.style.animation) el.style.opacity = '';
        }), 2500);
    }

    initAnimations() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll(
            '.profile-card, .pub-item-compact, .conf-item-compact, .these-item-compact, ' +
            '.memoire-item-compact, .livre-item-compact, .ressource-category, ' +
            '.contact-item-compact, .carte-niveau, .carte-document'
        ).forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
    }

    initCounters() {
        const counterElement = document.querySelector('.hero-stats');
        if (!counterElement || !('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(counterElement);
    }

    animateCounters() {
        document.querySelectorAll('.stat h3').forEach(counter => {
            const target = parseInt(counter.textContent, 10) || 0;
            if (target === 0) return;
            const duration = 2000;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * easeOut) + '+';
                if (progress < 1) requestAnimationFrame(animate);
                else counter.textContent = target + '+';
            };
            requestAnimationFrame(animate);
        });
    }

    // =====================================================================
    // 5. SYSTÈME D'ONGLETS (unifié)
    // =====================================================================

    initTabs() {
        const allTabContainers = document.querySelectorAll(PORTFOLIO_CONFIG.tabContainers);
        allTabContainers.forEach(container => this.initSingleTabSystem(container));
        log(`✅ ${allTabContainers.length} système(s) d'onglets initialisé(s)`);
    }

    initSingleTabSystem(container) {
        const tabButtons = container.querySelectorAll('.tab-button');
        if (tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(container, button, container.querySelectorAll('.tab-button'),
                    container.querySelectorAll('.tab-pane'), button.getAttribute('data-tab'));
            });
        });

        // Si aucun onglet n'est actif, activer le premier
        const activeButton = container.querySelector('.tab-button.active') || tabButtons[0];
        this.switchTab(container, activeButton, tabButtons, container.querySelectorAll('.tab-pane'), activeButton.getAttribute('data-tab'));
    }

    switchTab(container, activeButton, tabButtons, tabPanes, tabId) {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        // Seuls les panneaux directement rattachés à ce système d'onglets sont concernés.
        tabPanes.forEach(pane => {
            if (pane.closest(PORTFOLIO_CONFIG.tabContainers) !== container) return;
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
        });

        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        activeButton.setAttribute('tabindex', '0');

        const targetPane = container.querySelector(this.safeSelector(tabId));
        if (targetPane) {
            targetPane.classList.add('active');
            targetPane.setAttribute('aria-hidden', 'false');
        } else {
            console.error('❌ Panneau non trouvé pour l\'ID:', tabId);
        }
    }

    handleTabKeyboardNavigation(currentTab, direction) {
        const tabContainer = currentTab.closest(PORTFOLIO_CONFIG.tabContainers);
        if (!tabContainer) return;
        const tabs = Array.from(tabContainer.querySelectorAll('.tab-button'));
        const currentIndex = tabs.indexOf(currentTab);
        const nextIndex = {
            first: 0,
            last: tabs.length - 1,
            next: (currentIndex + 1) % tabs.length,
            previous: (currentIndex - 1 + tabs.length) % tabs.length
        }[direction];
        const nextTab = tabs[nextIndex];
        this.switchTab(tabContainer, nextTab, tabs, tabContainer.querySelectorAll('.tab-pane'), nextTab.getAttribute('data-tab'));
        nextTab.focus();
    }

    // =====================================================================
    // 6. BOUTONS SPÉCIFIQUES
    // =====================================================================

    initAllButtons() {
        this.initFiliereButtons();
        this.initConferenceButtons();
        this.initLivreButtons();
        this.initMemoireButtons();
        this.initGeneralButtons();
    }

    /** Si l'élément désigne un document du site, l'ouvre dans la visionneuse. */
    openIfDocument(element) {
        if (element && element.dataset && element.dataset.doc) {
            this.openReader(element);
            return true;
        }
        return false;
    }

    initFiliereButtons() {
        const filiereButtons = ['ECT1', 'ECT2', 'ECS1', 'ECS2', 'MPSI', 'MP'];
        filiereButtons.forEach(filiere => {
            document.querySelectorAll(
                `.btn-${filiere.toLowerCase()}, [data-filiere="${filiere}"], .btn-${filiere.toLowerCase()}-button`
            ).forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleFiliereClick(filiere);
                });
            });
        });
    }

    handleFiliereClick(filiere) {
        const filiereNames = {
            'ECT1': 'ECT 1ère année', 'ECT2': 'ECT 2ème année', 'ECS1': 'ECS 1ère année',
            'ECS2': 'ECS 2ème année', 'MPSI': 'MPSI', 'MP': 'MP'
        };
        this.showNotification(`Filière ${filiereNames[filiere] || filiere} sélectionnée`, 'info', 3000);

        const key = filiere.toLowerCase();
        const targetId = document.getElementById(`section-${key}`) ? `section-${key}` : key;
        if (document.getElementById(targetId)) {
            const filiereTabsContainer = document.querySelector('.filiere-tabs');
            const targetButton = filiereTabsContainer?.querySelector(`[data-tab="${targetId}"]`);
            if (targetButton) {
                this.switchTab(filiereTabsContainer, targetButton, filiereTabsContainer.querySelectorAll('.tab-button'),
                    filiereTabsContainer.querySelectorAll('.tab-pane'), targetId);
            }
            this.scrollToElement(`#${targetId}`);
        }
        document.dispatchEvent(new CustomEvent('filiereSelected', { detail: { filiere } }));
    }

    initConferenceButtons() {
        document.querySelectorAll('.btn-conference, [data-type="conference"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleConferenceClick(button);
            });
        });
    }

    handleConferenceClick(button) {
        if (this.openIfDocument(button)) return;
        this.showNotification(`Conférence: ${button.getAttribute('data-title') || button.textContent.trim() || 'Conférence'}`, 'info', 3000);
        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) window.open(url, '_blank', 'noopener,noreferrer');
    }

    initLivreButtons() {
        document.querySelectorAll('.btn-livre, [data-type="livre"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLivreClick(button);
            });
        });
    }

    handleLivreClick(button) {
        if (this.openIfDocument(button)) return;
        this.showNotification(`Livre: ${button.getAttribute('data-title') || button.textContent.trim() || 'Livre'}`, 'info', 3000);
        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) window.open(url, '_blank', 'noopener,noreferrer');
    }

    initMemoireButtons() {
        document.querySelectorAll('.btn-memoire, [data-type="memoire"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMemoireClick(button);
            });
        });
    }

    handleMemoireClick(button) {
        if (this.openIfDocument(button)) return;
        this.showNotification(`Mémoire: ${button.getAttribute('data-title') || button.textContent.trim() || 'Mémoire'}`, 'info', 3000);
        const url = button.getAttribute('href');
        if (url) {
            if (url.startsWith('#')) this.scrollToElement(url);
            else window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    initGeneralButtons() {
        document.querySelectorAll('.btn-view, .view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.openIfDocument(button)) return;
                this.handleViewClick(button.getAttribute('data-target') || button.getAttribute('href'));
            });
        });
    }

    handleViewClick(target) {
        if (target && target.startsWith('#')) this.scrollToElement(target);
        else if (target) window.open(target, '_blank', 'noopener,noreferrer');
    }

    // =====================================================================
    // 7. RESSOURCES, LIVRES, RUBRIQUES VIDES, LIENS PROVISOIRES
    // =====================================================================

    initResourceCards() {
        log(`📄 ${document.querySelectorAll('.ressource-item-compact').length} ressources pédagogiques`);
    }

    initBooksSection() {
        document.querySelectorAll('.livre-cover').forEach(img => {
            const hide = () => { img.classList.add('cover-absente'); };
            img.addEventListener('error', hide);
            if (img.complete && img.naturalWidth === 0) hide();
        });

        // Sécurité pour les liens externes
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.hasAttribute('rel')) link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    /** Masque les sous-rubriques dont tous les éléments sont encore en commentaire. */
    initEmptyGroups() {
        document.querySelectorAll('.ressources-list-compact').forEach(list => {
            if (list.querySelector('.ressource-item-compact')) return;
            list.classList.add('liste-vide');
            const header = list.previousElementSibling;
            if (header && header.classList.contains('section-header')) header.classList.add('liste-vide');
        });
        document.querySelectorAll('.ressource-category').forEach(cat => {
            if (cat.querySelector('.ressource-item-compact') || cat.querySelector(':scope > p')) return;
            cat.classList.add('categorie-vide');
            const p = document.createElement('p');
            p.className = 'categorie-vide-texte';
            p.textContent = 'Ressources en préparation.';
            cat.appendChild(p);
        });
    }

    /** Liens de profils encore au format modèle (« votre-profil ») : masqués aux visiteurs. */
    initPlaceholderLinks() {
        document.querySelectorAll('a[href*="votre-profil"], a[href*="votre-id"]').forEach(a => { a.hidden = true; });
        document.querySelectorAll('a[aria-disabled="true"]').forEach(a => {
            a.addEventListener('click', (e) => e.preventDefault());
        });
    }

    // =====================================================================
    // 8. SUIVI DES LECTURES (local, pour l'utilisateur) ET LIENS « download » RÉSIDUELS
    // =====================================================================

    initDownloadLinks() {
        // Plus aucun lien de téléchargement dans le site. Si un lien [download] est
        // ajouté plus tard vers un document du site, il est converti en lecture.
        document.querySelectorAll('a[download]').forEach(link => {
            const path = this.relativePath(link.getAttribute('href'));
            if (path && path.startsWith('documents/')) {
                link.removeAttribute('download');
                link.dataset.doc = path;
                link.href = `lire.php?d=${encodeURI(path)}`;
            }
        });
    }

    trackDownload(fileName, event = 'lecture') {
        const entry = { event, file: fileName, timestamp: new Date().toISOString() };
        log('📥 Suivi :', entry);
        try {
            const items = JSON.parse(localStorage.getItem('portfolioDownloads') || '[]');
            items.push(entry);
            localStorage.setItem('portfolioDownloads', JSON.stringify(items.slice(-50)));
        } catch (e) { /* stockage indisponible */ }
    }

    // =====================================================================
    // 9. FORMULAIRE DE CONTACT
    // =====================================================================

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.querySelectorAll('input:not([name="website"]), textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldStatus(input));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Champ piège rempli = robot : on simule un succès sans rien envoyer.
            if (contactForm.querySelector('[name="website"]')?.value) {
                contactForm.reset();
                return;
            }
            if (this.validateForm(contactForm)) {
                await this.submitForm(contactForm);
            } else {
                contactForm.querySelector('.error')?.focus();
            }
        });
    }

    validateField(field) {
        if (field.name === 'website') return true;
        const value = field.value.trim();
        let message = '';
        const type = field.tagName === 'TEXTAREA' ? 'textarea' : field.type;

        if (type === 'text') {
            if (!value) message = 'Ce champ est requis';
            else if (field.name === 'name' && value.length < 2) message = 'Minimum 2 caractères';
        } else if (type === 'email') {
            if (!value) message = 'Email requis';
            else if (!this.isValidEmail(value)) message = 'Email invalide';
        } else if (type === 'textarea') {
            if (!value) message = 'Message requis';
            else if (value.length < 10) message = 'Minimum 10 caractères';
        }

        if (message) this.showFieldError(field, message);
        else this.showFieldSuccess(field);
        return !message;
    }

    validateForm(form) {
        let isValid = true;
        form.querySelectorAll('input:not([name="website"]), textarea').forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldStatus(field);
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.id = `err-${field.name || Math.random().toString(36).slice(2)}`;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.setAttribute('aria-describedby', errorDiv.id);
    }

    showFieldSuccess(field) {
        this.clearFieldStatus(field);
        field.classList.add('success');
    }

    clearFieldStatus(field) {
        field.classList.remove('error', 'success');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        field.parentNode.querySelector('.field-error')?.remove();
    }

    async submitForm(form) {
        const formData = new FormData(form);
        const data = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            subject: String(formData.get('subject') || '').trim(),
            message: String(formData.get('message') || '').trim(),
            website: String(formData.get('website') || '')
        };
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            await this.sendFormData(data);
            this.showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            form.querySelectorAll('input, textarea').forEach(field => this.clearFieldStatus(field));
        } catch (error) {
            if (error && error.fallback) this.openMailFallback(data);
            else this.showNotification(error?.message || 'Erreur lors de l\'envoi.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendFormData(data) {
        if (this.serverReady) await this.serverReady;
        if (!this.server) {
            const err = new Error('Serveur indisponible');
            err.fallback = true;
            throw err;
        }
        const response = await this.apiRequest('contact', data);
        if (!response.ok) throw new Error(response.error || 'Erreur lors de l\'envoi.');
        return response;
    }

    /** Repli sans serveur : ouverture de la messagerie de l'utilisateur. */
    openMailFallback(data) {
        const address = (document.querySelector('.contact-item-compact.email .ci-value')?.textContent || '').trim();
        if (!address) {
            this.showNotification('Erreur lors de l\'envoi.', 'error');
            return;
        }
        const body = `${data.message}\n\n— ${data.name} <${data.email}>`;
        window.location.href = `mailto:${address}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        this.showNotification('Votre logiciel de messagerie s\'ouvre pour envoyer le message.', 'info', 6000);
    }

    // =====================================================================
    // 10. NOTIFICATIONS
    // =====================================================================

    showNotification(message, type = 'info', duration = 5000, action = null) {
        document.querySelectorAll('.notification').forEach(n => {
            if (n.dataset.message === message) this.removeNotification(n);
        });

        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };

        // Construction sans innerHTML : aucun risque d'injection via le message.
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.dataset.message = message;
        notification.setAttribute('role', type === 'error' ? 'alert' : 'status');

        const content = document.createElement('div');
        content.className = 'notification-content';
        const icon = document.createElement('i');
        icon.className = `fas ${icons[type] || icons.info}`;
        icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span');
        text.textContent = message;
        content.append(icon, text);

        if (action && action.href) {
            const link = document.createElement('a');
            link.href = action.href;
            link.textContent = action.label || 'Ouvrir';
            content.append(' ', link);
        }

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        closeBtn.addEventListener('click', () => this.removeNotification(notification));

        notification.append(content, closeBtn);
        document.body.appendChild(notification);
        requestAnimationFrame(() => setTimeout(() => notification.classList.add('show'), 10));
        if (duration > 0) setTimeout(() => this.removeNotification(notification), duration);
        return notification;
    }

    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    // =====================================================================
    // 11. CONNEXION AU SERVEUR : VISITES, COMPTE, MODE D'ACCÈS
    // =====================================================================

    async apiRequest(action, body = null) {
        const options = {
            method: body === null ? 'GET' : 'POST',
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        };
        if (options.method === 'POST') {
            options.headers['Content-Type'] = 'application/json';
            if (this.server?.csrf) options.headers['X-CSRF-Token'] = this.server.csrf;
            options.body = JSON.stringify(body || {});
        }
        const controller = 'AbortController' in window ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
        if (controller) options.signal = controller.signal;

        try {
            const response = await fetch(`${PORTFOLIO_CONFIG.apiUrl}?action=${encodeURIComponent(action)}`, options);
            const type = response.headers.get('content-type') || '';
            if (!type.includes('application/json')) throw new Error('Réponse non JSON (backend PHP absent ?)');
            const json = await response.json();
            if (!response.ok && json.ok !== false) json.ok = false;
            json.status = response.status;
            return json;
        } finally {
            if (timer) clearTimeout(timer);
        }
    }

    initServerConnection() {
        this.serverReady = (async () => {
            if (window.location.protocol === 'file:') {
                this.initVisitorCounter();   // ouverture locale du fichier : compteur local
                return;
            }
            try {
                const data = await this.apiRequest('hello', {});
                if (!data || data.ok !== true) throw new Error(data?.error || 'Réponse invalide');
                this.server = data;
                log('🛰️ Serveur connecté — mode :', data.mode);
                this.applyServerState(data);
                this.displayServerCounters(data.visites);
                this.startHeartbeat();
            } catch (error) {
                log('ℹ️ Backend indisponible, fonctionnement autonome :', error.message);
                this.server = null;
                // Hébergement statique (GitHub Pages…) : pas de serveur PHP, tout est en accès libre.
                this.updateModeIndicator('libre');
                this.initVisitorCounter();   // compteur local de secours
            }
        })();
        return this.serverReady;
    }

    applyServerState(data) {
        this.updateAccountNav(data);
        this.updateModeIndicator(data.mode);
        this.markProtectedLinks();

        if (data.user && data.user.mustChange) {
            this.showNotification('Votre mot de passe temporaire doit être remplacé.', 'warning', 0,
                { href: 'compte.php?vue=mdp', label: 'Changer maintenant' });
        }
        if (Array.isArray(data.configErreurs) && data.configErreurs.length && data.urls?.admin) {
            this.showNotification(`Configuration à corriger (${data.configErreurs.length} problème(s)).`, 'warning', 0,
                { href: data.urls.admin, label: 'Administration' });
        }
    }

    updateAccountNav(data) {
        const item = document.querySelector('.nav-account-item');
        const link = document.getElementById('nav-account');
        if (!item || !link) return;
        const label = link.querySelector('.nav-account-label');
        const icon = link.querySelector('i');
        const user = data.user;
        const admin = user && user.role === 'admin';
        link.href = admin && data.urls.admin ? data.urls.admin : data.urls.compte;
        if (label) label.textContent = user ? (admin ? 'Administration' : user.name) : 'Connexion';
        if (icon) icon.className = user ? (admin ? 'fas fa-user-shield' : 'fas fa-user-check') : 'fas fa-user';
        link.title = user ? `Connecté : ${user.name}` : 'Se connecter ou demander un accès';
        item.hidden = false;
    }

    updateModeIndicator(mode) {
        const indicator = document.getElementById('access-mode');
        if (!indicator) return;
        indicator.replaceChildren();
        const icon = document.createElement('i');
        icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span');
        if (mode === 'libre' || mode === 'prive') {
            const libre = mode === 'libre';
            indicator.className = `info-item access-mode-indicator ${libre ? 'mode-libre' : 'mode-prive'}`;
            icon.className = `fas ${libre ? 'fa-lock-open' : 'fa-lock'}`;
            text.textContent = libre ? 'Accès libre — lecture en ligne' : 'Accès privé — documents réservés aux comptes autorisés';
            indicator.title = libre
                ? 'Les documents publics se lisent en ligne, sans compte, dans la visionneuse du site.'
                : 'Les documents réservés se lisent après connexion d\'un compte approuvé.';
        } else {
            indicator.className = 'info-item access-mode-indicator mode-hors-ligne';
            icon.className = 'fas fa-plug';
            text.textContent = 'Serveur indisponible — documents temporairement inaccessibles';
        }
        indicator.append(icon, text);
        indicator.hidden = false;
    }

    displayServerCounters(visites) {
        if (!visites) return;
        const totalEl = document.getElementById('total-visitors');
        this.animateCounter(totalEl, visites.total);
        this.animateCounter(document.getElementById('current-visitors'), visites.online);
        this.animateCounter(document.getElementById('today-visitors'), visites.today);
        if (totalEl) totalEl.title = `Depuis l'ouverture du site — journée comptée selon le fuseau ${visites.tz}`;
    }

    startHeartbeat() {
        clearInterval(this.visitorInterval);
        this.visitorInterval = setInterval(async () => {
            if (document.hidden) return;
            try {
                const data = await this.apiRequest('ping', {});
                if (data.ok) this.displayServerCounters(data.visites);
            } catch (e) {
                log('ℹ️ Ping impossible :', e.message);
            }
        }, PORTFOLIO_CONFIG.heartbeatMs);
    }

    // =====================================================================
    // 12. CADENAS SUR LES DOCUMENTS RÉSERVÉS (indication visuelle — contrôle réel côté serveur)
    // =====================================================================

    globToRegex(pattern) {
        if (this.regexCache.has(pattern)) return this.regexCache.get(pattern);
        const escaped = pattern.replace(/[.+^${}()|[\]\\?]/g, '\\$&').replace(/\*/g, '.*');
        const regex = new RegExp(`^${escaped}$`, 'i');
        this.regexCache.set(pattern, regex);
        return regex;
    }

    /** Chemin relatif au site d'une URL interne, ou null si externe. */
    relativePath(href) {
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return null;
            const base = new URL('.', window.location.href).pathname;
            const path = decodeURIComponent(url.pathname);
            return path.startsWith(base) ? path.slice(base.length) : null;
        } catch (e) {
            return null;
        }
    }

    /** Même logique que acces_document() dans prive/noyau.php (affichage seulement). */
    isAccessible(path) {
        const s = this.server;
        if (!s || !path) return true;
        const user = s.user;
        if (user && user.role === 'admin') return true;
        const rule = (s.regles || []).find(r => r.motif && this.globToRegex(r.motif).test(path))
            || { niveau: 'prive', groupes: [] };
        if (rule.niveau === 'public' || (rule.niveau === 'prive' && s.mode === 'libre')) return true;
        if (!user) return false;
        const g = user.groupes || [];
        return g.includes('tout') || (rule.groupes || []).some(x => g.includes(x));
    }

    /** Ajoute (une seule fois) le cadenas visuel et le texte pour lecteurs d'écran. */
    addLockMarker(link) {
        if (link.querySelector('.acces-verrou')) return;
        const lock = document.createElement('span');
        lock.className = 'acces-verrou';
        lock.setAttribute('aria-hidden', 'true');
        lock.innerHTML = '<i class="fas fa-lock"></i>';
        const sr = document.createElement('span');
        sr.className = 'visually-hidden acces-verrou-texte';
        sr.textContent = ' (accès réservé)';
        link.append(lock, sr);
        const label = link.getAttribute('aria-label');
        if (label && !label.endsWith('(accès réservé)')) link.setAttribute('aria-label', `${label} (accès réservé)`);
    }

    removeLockMarker(link) {
        link.querySelector('.acces-verrou')?.remove();
        link.querySelector('.acces-verrou-texte')?.remove();
        const label = link.getAttribute('aria-label');
        if (label) link.setAttribute('aria-label', label.replace(' (accès réservé)', ''));
    }

    markProtectedLinks() {
        let n = 0;
        document.querySelectorAll('a[data-doc]').forEach(link => {
            if (!this.isAccessible(link.dataset.doc)) {
                n++;
                link.classList.add('lien-protege');
                link.dataset.protege = '1';
                if (!link.dataset.originalTitle) link.dataset.originalTitle = link.title || '';
                link.title = 'Réservé aux comptes autorisés — connexion requise';
                this.addLockMarker(link);
            } else if (link.dataset.protege) {
                delete link.dataset.protege;
                link.classList.remove('lien-protege');
                link.title = link.dataset.originalTitle || '';
                this.removeLockMarker(link);
            }
        });
        log(`🔐 ${n} document(s) réservé(s) pour ce visiteur`);
    }

    // =====================================================================
    // 13. VISIONNEUSE INTÉGRÉE (identique en mode libre et en mode privé)
    // =====================================================================
    //
    // 1. clic sur un document → api.php?action=jeton : le SERVEUR vérifie les droits ;
    // 2. si autorisé : adresse signée doc.php?…, valable pour cette session seulement ;
    // 3. PDF.js dessine les pages (images) à la demande, sans barre d'outils native :
    //    ni téléchargement, ni impression, ni sélection de texte ;
    // 4. sinon : message « connexion requise » ou « autorisation manquante ».

    initReader() {
        // Clic (y compris Ctrl/Cmd/Maj + clic) sur un document → visionneuse.
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-doc]');
            if (!link || e.defaultPrevented) return;
            e.preventDefault();
            this.openReader(link);
        });

        // Clic molette : visionneuse au lieu d'un nouvel onglet.
        document.addEventListener('auxclick', (e) => {
            const link = e.target.closest('a[data-doc]');
            if (link && e.button === 1) {
                e.preventDefault();
                this.openReader(link);
            }
        });

        // Raccourcis gérés tant que la visionneuse est ouverte (phase de capture).
        document.addEventListener('keydown', (e) => {
            if (!this.isReaderOpen()) return;
            const key = (e.key || '').toLowerCase();
            if ((e.ctrlKey || e.metaKey) && ['p', 's'].includes(key)) {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification('Document en lecture seule : impression et téléchargement désactivés.', 'warning', 3000);
                return;
            }
            if (e.target.closest && e.target.closest('.lecteur-page-saisie')) return;
            if (e.key === 'Escape') { e.preventDefault(); this.closeReader(); }
            else if (e.key === 'Tab') this.trapFocus(e);
            else if (['PageDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); this.goToPage(this.currentPage() + 1); }
            else if (['PageUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); this.goToPage(this.currentPage() - 1); }
            else if (e.key === '+' || e.key === '=') { e.preventDefault(); this.setZoom(this.readerZoom + PORTFOLIO_CONFIG.lecteur.zoomPas); }
            else if (e.key === '-') { e.preventDefault(); this.setZoom(this.readerZoom - PORTFOLIO_CONFIG.lecteur.zoomPas); }
        }, true);

        // Clic droit, glisser-déposer, sélection et copie bloqués dans la visionneuse.
        ['contextmenu', 'dragstart', 'selectstart', 'copy'].forEach(type => {
            document.addEventListener(type, (e) => {
                if (e.target.closest && e.target.closest('.lecteur-corps')) e.preventDefault();
            });
        });

        window.addEventListener('resize', () => {
            if (!this.isReaderOpen() || !this.readerDoc) return;
            clearTimeout(this.readerResize);
            this.readerResize = setTimeout(() => this.setZoom(this.readerZoom, true), 250);
        }, { passive: true });
    }

    /** lire.php : ouvre directement le document demandé, en pleine page. */
    async initReaderPage() {
        const doc = document.body.dataset.lectureDoc;
        if (document.body.classList.contains('page-lecteur')) {
            this.pageMode = true;
            if (doc) await this.openReader({ doc, titre: '' });
        }
    }

    buildReader() {
        if (this.reader) return this.reader;

        const el = (tag, cls, attrs = {}, html = '') => {
            const node = document.createElement(tag);
            if (cls) node.className = cls;
            Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
            if (html) node.innerHTML = html;
            return node;
        };
        const btn = (cls, label, icon) => el('button', `lecteur-btn ${cls}`, { type: 'button', 'aria-label': label, title: label },
            `<i class="fas ${icon}" aria-hidden="true"></i>`);

        const root = el('div', 'lecteur', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'lecteur-titre' });
        root.hidden = true;
        const fond = el('div', 'lecteur-fond');
        fond.addEventListener('click', () => this.closeReader());

        const boite = el('div', 'lecteur-boite');
        const barre = el('div', 'lecteur-barre');
        const titre = el('h2', 'lecteur-titre', { id: 'lecteur-titre' });
        const badge = el('span', 'lecteur-badge', {}, '<i class="fas fa-lock" aria-hidden="true"></i> Lecture seule');

        const nav = el('div', 'lecteur-groupe lecteur-nav', { role: 'group', 'aria-label': 'Pages' });
        const prec = btn('lecteur-prec', 'Page précédente', 'fa-chevron-up');
        const saisie = el('input', 'lecteur-page-saisie', { type: 'number', min: '1', value: '1', inputmode: 'numeric', 'aria-label': 'Numéro de page' });
        const total = el('span', 'lecteur-total', {}, '/ –');
        const suiv = btn('lecteur-suiv', 'Page suivante', 'fa-chevron-down');
        nav.append(prec, saisie, total, suiv);

        const zoom = el('div', 'lecteur-groupe lecteur-zoom', { role: 'group', 'aria-label': 'Zoom' });
        const moins = btn('', 'Réduire', 'fa-minus');
        const niveau = el('button', 'lecteur-btn lecteur-niveau', { type: 'button', title: 'Ajuster à la largeur', 'aria-label': 'Ajuster à la largeur' }, '100 %');
        const plus = btn('', 'Agrandir', 'fa-plus');
        zoom.append(moins, niveau, plus);

        const ecran = btn('lecteur-ecran', 'Plein écran', 'fa-expand');
        const fermer = btn('lecteur-fermer', 'Fermer la visionneuse', 'fa-times');
        barre.append(titre, badge, nav, zoom, ecran, fermer);

        const aide = el('p', 'lecteur-aide', { role: 'status' });
        const corps = el('div', 'lecteur-corps', { tabindex: '0', 'aria-label': 'Pages du document' });
        boite.append(barre, aide, corps);
        root.append(fond, boite);
        document.body.appendChild(root);

        prec.addEventListener('click', () => this.goToPage(this.currentPage() - 1));
        suiv.addEventListener('click', () => this.goToPage(this.currentPage() + 1));
        saisie.addEventListener('change', () => this.goToPage(parseInt(saisie.value, 10) || 1));
        saisie.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.goToPage(parseInt(saisie.value, 10) || 1); });
        moins.addEventListener('click', () => this.setZoom(this.readerZoom - PORTFOLIO_CONFIG.lecteur.zoomPas));
        plus.addEventListener('click', () => this.setZoom(this.readerZoom + PORTFOLIO_CONFIG.lecteur.zoomPas));
        niveau.addEventListener('click', () => this.setZoom(1));
        ecran.addEventListener('click', () => this.toggleFullscreen());
        fermer.addEventListener('click', () => this.closeReader());

        let ticking = false;
        corps.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { this.updatePageIndicator(); ticking = false; });
        }, { passive: true });

        this.reader = { root, boite, titre, badge, nav, zoom, saisie, total, niveau, ecran, fermer, aide, corps };
        return this.reader;
    }

    /** Titre lisible du document à partir de la carte qui contient le lien. */
    linkContextTitle(link) {
        if (link.dataset?.titre) return link.dataset.titre;
        const ctx = link.closest?.('[class*="-item-compact"], .carte-document')
            ?.querySelector('.pub-title, .chap-title, .ri-title, .these-title, .memoire-title, .livre-title, .conf-title, .conf-name');
        if (ctx) {
            const t = (ctx.firstChild?.textContent || '').trim() || ctx.textContent.trim();
            if (t) return t.replace('(accès réservé)', '').trim();
        }
        const own = (link.textContent || '').replace('(accès réservé)', '').trim();
        return own.length > 3 && !/^(lire|télécharger|pdf|ouvrir|corrigé|voir|énoncé)$/i.test(own) ? own : '';
    }

    async openReader(source) {
        const r = this.buildReader();
        const doc = source.dataset ? source.dataset.doc : source.doc;
        if (!doc) return;
        const token = ++this.readerToken;
        this.resetReaderContent();

        let fichier = doc.split('/').pop() || '';
        try { fichier = decodeURIComponent(fichier); } catch (e) { /* déjà décodé */ }
        const contexte = source.dataset ? this.linkContextTitle(source) : source.titre;
        const extra = source.textContent && /corrig/i.test(source.textContent) ? ' — Corrigé' : '';
        r.titre.textContent = (contexte ? contexte + extra : '') || fichier || 'Document';
        r.root.dataset.type = 'chargement';
        this.showReader();
        this.setReaderStatus('Chargement du document…', 'fa-spinner fa-spin');
        this.trackDownload(fichier, 'lecture');

        if (this.serverReady) await this.serverReady;
        if (token !== this.readerToken) return;

        let info;
        if (this.server) {
            try {
                info = await this.apiRequest('jeton', { doc });
            } catch (e) {
                info = { ok: false, code: 'reseau', error: 'Connexion au serveur impossible. Vérifiez votre connexion et réessayez.' };
            }
        } else if (window.location.protocol !== 'file:') {
            // Hébergement sans PHP : affichage direct, sans contrôle d'accès (signalé).
            info = { ok: true, url: encodeURI(doc), type: /\.pdf$/i.test(doc) ? 'pdf' : 'image', direct: true };
            log('ℹ️ Pas de serveur PHP : affichage direct du fichier, sans contrôle d\'accès.');
        } else {
            info = { ok: false, code: 'local', error: 'Ouverture locale (file://) : la visionneuse nécessite le site en ligne ou un serveur local (php -S localhost:8000).' };
        }
        if (token !== this.readerToken) return;

        if (!info.ok) {
            this.showReaderMessage(info);
            return;
        }
        r.badge.innerHTML = info.reserve
            ? '<i class="fas fa-user-lock" aria-hidden="true"></i> Réservé · lecture seule'
            : '<i class="fas fa-lock" aria-hidden="true"></i> Lecture seule';

        if (info.type === 'pdf') await this.renderPdf(info, token);
        else await this.renderImage(info, token);
    }

    setReaderStatus(text, icon = 'fa-info-circle') {
        const corps = this.reader.corps;
        corps.replaceChildren();
        const p = document.createElement('div');
        p.className = 'lecteur-statut';
        p.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
        const span = document.createElement('span');
        span.textContent = text;
        p.appendChild(span);
        corps.appendChild(p);
    }

    /** Accès refusé ou erreur : message clair + action utile. */
    showReaderMessage(info) {
        const r = this.reader;
        r.root.dataset.type = 'message';
        const boxes = {
            connexion: ['fa-user-lock', 'Document réservé', [[info.compte || 'compte.php', 'Se connecter', 'fa-sign-in-alt'], ['compte.php?vue=inscription', 'Demander un accès', 'fa-user-plus']]],
            autorisation: ['fa-ban', 'Autorisation manquante', [['index.html#contact', 'Contacter l\'enseignant', 'fa-envelope'], ['compte.php', 'Mon compte', 'fa-user']]],
            introuvable: ['fa-file-circle-xmark', 'Document introuvable', []]
        };
        const [icon, titre, actions] = boxes[info.code] || ['fa-exclamation-triangle', 'Lecture impossible', []];
        const box = document.createElement('div');
        box.className = 'lecteur-message';
        box.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i><h3></h3><p></p><div class="lecteur-actions"></div>`;
        box.querySelector('h3').textContent = titre;
        box.querySelector('p').textContent = info.error || 'Ce document ne peut pas être affiché.';
        actions.forEach(([href, label, ic]) => {
            const a = document.createElement('a');
            a.href = href;
            a.className = 'btn btn-primary';
            a.innerHTML = `<i class="fas ${ic}" aria-hidden="true"></i> `;
            a.append(label);
            if (href.startsWith('index.html#')) a.addEventListener('click', () => this.closeReader());
            box.querySelector('.lecteur-actions').appendChild(a);
        });
        r.corps.replaceChildren(box);
    }

    loadPdfJs() {
        const existing = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (existing) return Promise.resolve(existing);
        if (this.pdfjsPromise) return this.pdfjsPromise;

        const opts = PORTFOLIO_CONFIG.lecteur;
        const configure = (lib) => {
            if (!lib || !lib.getDocument) throw new Error('PDF.js introuvable');
            lib.GlobalWorkerOptions.workerSrc = new URL(opts.pdfjsWorker, window.location.href).href;
            window.pdfjsLib = lib;
            return lib;
        };
        if (/\.mjs($|\?)/.test(opts.pdfjs)) {
            // Module ES (PDF.js 4 et suivants)
            this.pdfjsPromise = import(new URL(opts.pdfjs, window.location.href).href).then(configure);
        } else {
            // Ancien format (PDF.js 3, script classique)
            this.pdfjsPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = opts.pdfjs;
                s.async = true;
                s.crossOrigin = 'anonymous';
                s.referrerPolicy = 'no-referrer';
                s.onload = () => { try { resolve(configure(window.pdfjsLib || window['pdfjs-dist/build/pdf'])); } catch (e) { reject(e); } };
                s.onerror = () => reject(new Error('PDF.js indisponible'));
                document.head.appendChild(s);
            });
        }
        this.pdfjsPromise.catch(() => { this.pdfjsPromise = null; });
        return this.pdfjsPromise;
    }

    async renderPdf(info, token) {
        const r = this.reader;
        try {
            const lib = await this.loadPdfJs();
            if (token !== this.readerToken) return;
            this.readerTask = lib.getDocument({
                url: new URL(info.url, window.location.href).href,
                httpHeaders: info.direct ? {} : { 'X-Lecteur': '1' },
                withCredentials: true,
                isEvalSupported: false,          // protection CVE-2024-4367
                enableXfa: false,
                disableAutoFetch: true,          // gros PDF : seules les pages lues sont chargées
                rangeChunkSize: 262144
            });
            const task = this.readerTask;
            const pdf = await task.promise;
            if (token !== this.readerToken) { task.destroy?.(); return; }
            this.readerDoc = pdf;
            this.readerFiligrane = info.filigrane || null;

            const first = await pdf.getPage(1);
            const base = first.getViewport({ scale: 1 });
            r.corps.replaceChildren();
            r.corps.style.setProperty('--page-ratio', `${base.width} / ${base.height}`);
            r.root.dataset.type = 'pdf';
            r.total.textContent = `/ ${pdf.numPages}`;
            r.saisie.max = String(pdf.numPages);

            this.readerPages = [];
            const frag = document.createDocumentFragment();
            for (let n = 1; n <= pdf.numPages; n++) {
                const page = document.createElement('div');
                page.className = 'lecteur-page';
                page.dataset.n = String(n);
                page.setAttribute('role', 'img');
                page.setAttribute('aria-label', `Page ${n} sur ${pdf.numPages}`);
                frag.appendChild(page);
                this.readerPages.push(page);
            }
            r.corps.appendChild(frag);
            this.setZoom(1, true);
            this.setupPageObservers();
            this.updatePageIndicator();
        } catch (error) {
            if (token !== this.readerToken) return;
            console.error('❌ Affichage PDF impossible :', error);
            const refus = [401, 403].includes(error?.status) || /403|401|Unexpected server response/i.test(String(error?.message || ''));
            this.showReaderMessage({
                code: refus ? 'expire' : 'erreur',
                error: refus
                    ? 'Le serveur a refusé la lecture (autorisation expirée ou accès retiré). Fermez puis rouvrez le document.'
                    : 'Impossible d\'afficher ce document. Vérifiez votre connexion et réessayez.'
            });
        }
    }

    async renderImage(info, token) {
        const r = this.reader;
        try {
            const res = await fetch(info.url, { headers: info.direct ? {} : { 'X-Lecteur': '1' }, credentials: 'same-origin', cache: 'no-store' });
            if (!res.ok) throw new Error(String(res.status));
            const blob = await res.blob();
            if (token !== this.readerToken) return;
            this.readerObjectUrl = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.className = 'lecteur-image';
            img.alt = r.titre.textContent;
            img.draggable = false;
            img.src = this.readerObjectUrl;
            r.root.dataset.type = 'image';
            r.corps.replaceChildren(img);
        } catch (e) {
            if (token === this.readerToken) this.showReaderMessage({ code: 'erreur', error: 'Image impossible à afficher.' });
        }
    }

    /** Pages dessinées à l'approche, libérées quand elles s'éloignent (mémoire maîtrisée). */
    setupPageObservers() {
        this.readerObservers.forEach(o => o.disconnect());
        const corps = this.reader.corps;
        const proche = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) this.renderPage(entry.target); });
        }, { root: corps, rootMargin: '900px 0px' });
        const loin = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (!entry.isIntersecting) this.releasePage(entry.target); });
        }, { root: corps, rootMargin: '4000px 0px' });
        this.readerPages.forEach(p => { proche.observe(p); loin.observe(p); });
        this.readerObservers = [proche, loin];
    }

    async renderPage(div) {
        if (div.dataset.etat || !this.readerDoc) return;
        div.dataset.etat = 'rendu';
        const token = this.readerToken;
        try {
            const page = await this.readerDoc.getPage(Number(div.dataset.n));
            if (token !== this.readerToken || div.dataset.etat !== 'rendu') return;
            const base = page.getViewport({ scale: 1 });
            div.style.aspectRatio = `${base.width} / ${base.height}`;
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            const cssWidth = div.clientWidth || this.readerWidth;
            const viewport = page.getViewport({ scale: (cssWidth / base.width) * ratio });

            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext('2d', { alpha: false });
            div._task = page.render({ canvas, canvasContext: ctx, viewport });
            await div._task.promise;
            div._task = null;
            if (token !== this.readerToken || div.dataset.etat !== 'rendu') return;
            if (this.readerFiligrane) this.drawWatermark(ctx, canvas.width, canvas.height, this.readerFiligrane);
            div.replaceChildren(canvas);
            div.dataset.etat = 'ok';
            page.cleanup();
        } catch (error) {
            if (error?.name !== 'RenderingCancelledException') console.warn('Page non rendue :', error);
            if (div.dataset.etat === 'rendu') delete div.dataset.etat;
        }
    }

    releasePage(div) {
        if (div._task) { div._task.cancel(); div._task = null; }
        if (div.dataset.etat) {
            div.replaceChildren();
            delete div.dataset.etat;
        }
    }

    /** Filigrane nominatif sur les documents réservés (dissuasif, non amovible de l'image). */
    drawWatermark(ctx, w, h, texte) {
        ctx.save();
        const fs = Math.max(12, Math.round(w / 42));
        ctx.font = `600 ${fs}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(20, 36, 63, 0.10)';
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-Math.PI / 6);
        const pas = ctx.measureText(texte).width + fs * 4;
        for (let y = -h; y < h; y += fs * 6) {
            for (let x = -w - ((y / (fs * 6)) % 2) * pas / 2; x < w; x += pas) ctx.fillText(texte, x, y);
        }
        ctx.restore();
    }

    setZoom(value, force = false) {
        if (!this.readerDoc || !this.readerPages.length) return;
        const o = PORTFOLIO_CONFIG.lecteur;
        const zoom = Math.min(o.zoomMax, Math.max(o.zoomMin, Math.round(value * 100) / 100));
        if (zoom === this.readerZoom && !force) return;
        const current = this.currentPage();
        this.readerZoom = zoom;
        const corps = this.reader.corps;
        const fit = Math.min((corps.clientWidth || window.innerWidth) - 24, o.largeurMax);
        this.readerWidth = Math.max(240, Math.round(fit * zoom));
        corps.style.setProperty('--page-largeur', `${this.readerWidth}px`);
        this.reader.niveau.textContent = `${Math.round(zoom * 100)} %`;
        this.readerPages.forEach(p => this.releasePage(p));
        this.setupPageObservers();
        if (!force || current > 1) this.goToPage(current, false);
    }

    currentPage() {
        return parseInt(this.reader?.saisie.value, 10) || 1;
    }

    updatePageIndicator() {
        if (!this.readerPages.length) return;
        const corps = this.reader.corps;
        const limite = corps.getBoundingClientRect().top + corps.clientHeight * 0.3;
        let n = 1;
        for (const p of this.readerPages) {
            if (p.getBoundingClientRect().top <= limite) n = Number(p.dataset.n);
            else break;
        }
        if (document.activeElement !== this.reader.saisie) this.reader.saisie.value = String(n);
    }

    goToPage(n, smooth = true) {
        if (!this.readerPages.length) return;
        const page = this.readerPages[Math.min(Math.max(1, n), this.readerPages.length) - 1];
        this.reader.corps.scrollTo({ top: page.offsetTop - 8, behavior: smooth ? 'smooth' : 'auto' });
        this.reader.saisie.value = page.dataset.n;
    }

    toggleFullscreen() {
        const boite = this.reader.boite;
        if (document.fullscreenElement) document.exitFullscreen?.();
        else boite.requestFullscreen?.().catch(() => boite.classList.toggle('plein-ecran'));
        if (!boite.requestFullscreen) boite.classList.toggle('plein-ecran');
    }

    showReader() {
        const r = this.reader;
        if (!this.isReaderOpen()) this.readerReturnFocus = document.activeElement;
        r.root.hidden = false;
        document.body.classList.add('lecteur-ouvert');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => r.root.classList.add('show'));
        r.fermer.focus();
    }

    resetReaderContent() {
        const r = this.reader;
        this.readerObservers.forEach(o => o.disconnect());
        this.readerObservers = [];
        this.readerPages.forEach(p => { if (p._task) p._task.cancel(); });
        this.readerPages = [];
        // La tâche de chargement libère aussi le document (API PDF.js stable de la v3 à la v6).
        try { (this.readerTask || this.readerDoc?.loadingTask)?.destroy?.(); } catch (e) { /* déjà libéré */ }
        this.readerTask = null;
        this.readerDoc = null;
        if (this.readerObjectUrl) { URL.revokeObjectURL(this.readerObjectUrl); this.readerObjectUrl = null; }
        this.readerZoom = 1;
        this.readerFiligrane = null;
        if (r) {
            r.corps.replaceChildren();
            r.aide.textContent = '';
            r.total.textContent = '/ –';
            r.saisie.value = '1';
            r.niveau.textContent = '100 %';
        }
    }

    closeReader() {
        const r = this.reader;
        if (!r || r.root.hidden) return;
        if (this.pageMode) {               // lire.php : retour au site
            window.location.href = 'index.html';
            return;
        }
        this.readerToken++;                 // interrompt un rendu en cours
        if (document.fullscreenElement) document.exitFullscreen?.();
        r.boite.classList.remove('plein-ecran');
        this.resetReaderContent();
        r.root.classList.remove('show');
        r.root.hidden = true;
        document.body.classList.remove('lecteur-ouvert');
        document.body.style.overflow = '';
        if (this.readerReturnFocus && typeof this.readerReturnFocus.focus === 'function') this.readerReturnFocus.focus();
    }

    isReaderOpen() {
        return !!(this.reader && !this.reader.root.hidden);
    }

    /** Garde le focus clavier à l'intérieur de la visionneuse. */
    trapFocus(e) {
        const items = [...this.reader.root.querySelectorAll('a[href], button, input, [tabindex="0"]')]
            .filter(node => !node.hidden && node.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    // =====================================================================
    // 14. COMPTEUR DE VISITEURS LOCAL (secours sans serveur)
    // =====================================================================
    // Limite : ne compte que les visites de CE navigateur ; utilisé seulement si
    // api.php ne répond pas. Les statistiques officielles sont celles du serveur.

    initVisitorCounter() {
        setTimeout(() => this.setupVisitorCounter(), 100);
    }

    setupVisitorCounter() {
        const storageKey = 'portfolioVisitorStats';
        const totalEl = document.getElementById('total-visitors');
        const onlineEl = document.getElementById('current-visitors');
        if (!totalEl || !onlineEl) return;

        const stats = this.getVisitorStats(storageKey);
        this.handleNewVisit(stats, 'portfolioVisitSession');
        this.saveVisitorStats(storageKey, stats);
        this.displayVisitorCounters(stats, totalEl, onlineEl);
        this.startVisitorCounterUpdates(storageKey);
        [totalEl, onlineEl].forEach(el => { el.title = 'Compteur local (serveur de statistiques indisponible)'; });
    }

    getVisitorStats(storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const stats = JSON.parse(stored);
                const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                const visits = Array.isArray(stats.visits) ? stats.visits : [];
                return {
                    total: Number.parseInt(stats.total, 10) || 0,
                    visits: visits.filter(visit => new Date(visit.timestamp).getTime() >= oneDayAgo),
                    firstVisit: stats.firstVisit || new Date().toISOString()
                };
            }
        } catch (e) { /* stockage indisponible */ }
        return { total: 0, visits: [], firstVisit: new Date().toISOString() };
    }

    saveVisitorStats(storageKey, stats) {
        try { localStorage.setItem(storageKey, JSON.stringify(stats)); } catch (e) { /* ignoré */ }
    }

    handleNewVisit(stats, sessionKey) {
        let sessionId = null;
        try { sessionId = sessionStorage.getItem(sessionKey); } catch (e) { /* navigation privée stricte */ }
        if (sessionId) return;
        const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
        try { sessionStorage.setItem(sessionKey, newSessionId); } catch (e) { /* ignoré */ }
        stats.total++;
        stats.visits.push({
            sessionId: newSessionId,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR')
        });
        if (stats.visits.length > 100) stats.visits = stats.visits.slice(-100);
    }

    displayVisitorCounters(stats, totalEl, onlineEl) {
        this.animateCounter(totalEl, stats.total);
        this.animateCounter(onlineEl, this.calculateOnlineUsers(stats));
        const todayEl = document.getElementById('today-visitors');
        if (todayEl) {
            const today = new Date().toLocaleDateString('fr-FR');
            this.animateCounter(todayEl, stats.visits.filter(v => v.date === today).length);
        }
    }

    animateCounter(element, target) {
        if (!element || !Number.isFinite(target)) return;
        const current = Number.parseInt(element.textContent.replace(/\s/g, ''), 10) || 0;
        if (current === target) {
            element.textContent = this.formatNumber(target);
            return;
        }
        const duration = 900;
        const startTime = performance.now();
        const animate = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            element.textContent = this.formatNumber(Math.floor(current + (target - current) * easeOut));
            if (progress < 1) requestAnimationFrame(animate);
            else element.textContent = this.formatNumber(target);
        };
        requestAnimationFrame(animate);
    }

    calculateOnlineUsers(stats) {
        const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
        try {
            return Math.max(1, stats.visits.filter(v => new Date(v.timestamp).getTime() > fifteenMinutesAgo).length);
        } catch (e) {
            return 1;
        }
    }

    startVisitorCounterUpdates(storageKey) {
        clearInterval(this.visitorInterval);
        this.visitorInterval = setInterval(() => {
            const totalEl = document.getElementById('total-visitors');
            const onlineEl = document.getElementById('current-visitors');
            if (totalEl && onlineEl) this.displayVisitorCounters(this.getVisitorStats(storageKey), totalEl, onlineEl);
        }, 30000);
    }

    // =====================================================================
    // 15. DATE / HEURE (fuseau du navigateur du visiteur)
    // =====================================================================

    initDateTimeUpdater() {
        this.startDateTimeUpdates();
    }

    startDateTimeUpdates() {
        const dateEl = document.getElementById('current-date');
        const timeEl = document.getElementById('current-time');
        if (!dateEl && !timeEl) return;
        timeEl?.setAttribute('aria-live', 'off');

        const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        let lastDate = '';

        const updateDateTime = () => {
            const now = new Date();
            const dateStr = this.capitalizeFirst(dateFormatter.format(now));
            if (dateEl && dateStr !== lastDate) {
                dateEl.textContent = dateStr;
                dateEl.setAttribute('aria-label', `Date actuelle: ${dateStr}`);
                lastDate = dateStr;
            }
            if (timeEl) timeEl.textContent = timeFormatter.format(now);
        };

        updateDateTime();
        clearInterval(this.dateTimeInterval);
        this.dateTimeInterval = setInterval(updateDateTime, 1000);
    }

    capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    }

    // =====================================================================
    // 16. THÈME SOMBRE / CLAIR
    // =====================================================================

    initThemeToggle() {
        let themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.type = 'button';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
            themeToggle.title = 'Changer le thème';
            themeToggle.setAttribute('aria-label', 'Changer le thème');
            document.body.appendChild(themeToggle);
        }
        themeToggle.addEventListener('click', () => this.toggleTheme(themeToggle));

        let savedTheme = null;
        try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (e) { /* ignoré */ }
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
            this.currentTheme = 'dark';
        }
        themeToggle.setAttribute('aria-pressed', String(this.currentTheme === 'dark'));
    }

    toggleTheme(themeToggle) {
        const isDark = document.body.classList.toggle('dark-mode');
        this.currentTheme = isDark ? 'dark' : 'light';
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
        themeToggle.setAttribute('aria-pressed', String(isDark));
        try { localStorage.setItem('portfolio-theme', this.currentTheme); } catch (e) { /* ignoré */ }
        this.showNotification(`Mode ${isDark ? 'sombre' : 'clair'} activé`, 'info', 2000);
    }

    // =====================================================================
    // 17. IMAGES, PERFORMANCE, CLAVIER, ACCESSIBILITÉ
    // =====================================================================

    initImageLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    initPerformanceOptimizations() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => document.dispatchEvent(new CustomEvent('resizeEnd')), 250);
        }, { passive: true });

        // Pause des mises à jour quand l'onglet du navigateur est masqué
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.dateTimeInterval);
                this.dateTimeInterval = null;
            } else if (!this.dateTimeInterval) {
                this.startDateTimeUpdates();
            }
        });
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(document.querySelector('.nav-menu'), document.querySelector('.nav-toggle'));
            }
            // Onglets : flèches, Début et Fin (motif ARIA « tabs »).
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('tab-button')) {
                const keyMap = { ArrowRight: 'next', ArrowDown: 'next', ArrowLeft: 'previous', ArrowUp: 'previous', Home: 'first', End: 'last' };
                const direction = keyMap[e.key];
                if (direction) {
                    e.preventDefault();
                    this.handleTabKeyboardNavigation(activeElement, direction);
                }
            }
        });
    }

    initAccessibility() {
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle && !navToggle.hasAttribute('aria-expanded')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
        }

        document.querySelectorAll('.tab-button').forEach((button, index) => {
            const tabId = button.getAttribute('data-tab');
            const pane = document.getElementById(tabId);
            if (!button.id) button.id = `${tabId || 'tab'}-tab-${index}`;
            if (pane) {
                button.setAttribute('aria-controls', tabId);
                pane.setAttribute('aria-labelledby', button.id);
            }
        });

        // Icônes décoratives masquées aux lecteurs d'écran ; libellés pour les liens « icône seule ».
        document.querySelectorAll('i.fas, i.far, i.fab').forEach(icon => icon.setAttribute('aria-hidden', 'true'));
        const labels = [
            ['fa-eye', 'Lire'], ['fa-external-link-alt', 'Ouvrir le lien externe'],
            ['fa-file-pdf', 'Lire le PDF'], ['fa-shopping-cart', 'Acheter'], ['fa-check-circle', 'Corrigé']
        ];
        document.querySelectorAll('a').forEach(link => {
            const visible = [...link.childNodes].some(n => (n.nodeType === 3 && n.textContent.trim()) || (n.nodeType === 1 && n.tagName !== 'I' && n.textContent.trim()));
            if (link.hasAttribute('aria-label')) return;
            const match = labels.find(([cls]) => link.querySelector(`i.${cls}`));
            if (!match) return;
            const context = link.closest('[class*="-item-compact"]')
                ?.querySelector('.pub-title, .chap-title, .ri-title, .these-title, .memoire-title, .livre-title, .conf-name');
            const contextText = context ? (context.firstChild?.textContent?.trim() || context.textContent.trim()) : '';
            if (!visible || link.textContent.trim().length < 8) {
                const own = link.textContent.trim();
                link.setAttribute('aria-label', [own || match[1], contextText].filter(Boolean).join(' : '));
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        });
        document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-navigation'));
    }

    // =====================================================================
    // 18. UTILITAIRES
    // =====================================================================

    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // =====================================================================
    // 19. NETTOYAGE
    // =====================================================================

    destroy() {
        if (this.dateTimeInterval) clearInterval(this.dateTimeInterval);
        if (this.visitorInterval) clearInterval(this.visitorInterval);
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        if (!this.pageMode) this.closeReader();
        this.isInitialized = false;
    }
}

// ===== INITIALISATION DE L'APPLICATION =====
const portfolioApp = new PortfolioApp();

// ===== STYLES =====
// Tous les styles sont dans style.css (la visionneuse : section 30).

// ===== GESTIONNAIRES D'ÉVÉNEMENTS GLOBAUX =====
// « pagehide » remplace « beforeunload », qui empêche le cache de retour arrière.
window.addEventListener('pagehide', () => {
    if (portfolioApp) portfolioApp.destroy();
});

// ===== FORCER LE SCROLL EN HAUT AU CHARGEMENT =====
// (désactivable : PORTFOLIO_CONFIG.forcerHautDePage = false)
(function ensureTopScroll() {
    'use strict';
    if (!PORTFOLIO_CONFIG.forcerHautDePage || document.body?.classList.contains('page-lecteur')) return;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    function scrollToTop() {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    scrollToTop();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scrollToTop);
    } else {
        scrollToTop();
    }

    window.addEventListener('load', function () {
        scrollToTop();
        setTimeout(scrollToTop, 100);
        setTimeout(scrollToTop, 300);
    });

    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        setTimeout(scrollToTop, 50);
    }

    window.addEventListener('hashchange', function () {
        if (window.location.hash === '' || window.location.hash === '#') scrollToTop();
    });
})();

log('✅ Script portfolio entièrement chargé et prêt !');
