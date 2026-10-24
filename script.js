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
//  • styles dynamiques déplacés dans style.css (sections 25 à 28).
//
// Version 3 :
//  • TOUS les fichiers PDF du site sont désormais réservés (comme les corrigés) ;
//  • un seul paramètre (DRIVE_PRIVE) pour le dossier Google Drive par défaut,
//    et un interrupteur (tousLesPdfReserves) qui couvre aussi les futurs PDF ;
//  • texte « accès réservé » lisible par les lecteurs d'écran sur chaque lien protégé.
//
// Version 4 — LECTURE SEULE (modes libre ET privé) :
//  • chaque PDF s'ouvre dans une visionneuse intégrée au site (fenêtre modale) :
//    plus aucun lien de téléchargement direct, attributs « download » retirés,
//    icônes et libellés « Télécharger » remplacés par « Lire » automatiquement ;
//  • documents Google Drive affichés via l'aperçu intégré de Drive (/preview),
//    dans un cadre isolé (sandbox) qui bloque les téléchargements et l'impression
//    lancés depuis le cadre ; dossiers affichés via la vue de dossier intégrée ;
//  • PDF hébergés sur le site (édition PHP) dessinés page par page avec PDF.js,
//    sans barre d'outils (ni bouton de téléchargement, ni bouton d'impression) ;
//  • Ctrl/Cmd+P, Ctrl/Cmd+S, clic droit et glisser-déposer bloqués dans la
//    visionneuse ; impression de la page remplacée par un message (style.css §29) ;
//  • correction d'une erreur de syntaxe (apostrophes non échappées) dans
//    l'indicateur de mode, qui empêchait tout le script de s'exécuter.
//
// IMPORTANT : le verrou RÉEL contre le téléchargement et l'impression est le
// réglage Google Drive de chaque fichier (décocher l'option qui permet aux
// lecteurs de télécharger, imprimer et copier). Ce script ajoute une couche
// dissuasive côté site ; aucun site web ne peut empêcher une capture d'écran.

'use strict';

// ╔═════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION DU SITE (édition GitHub Pages) — SEULE PARTIE À MODIFIER ║
// ╚═════════════════════════════════════════════════════════════════════╝
//
// 1) MODE D'ACCÈS : une seule ligne active (sans // devant).
//    Changer de mode = modifier cette ligne ET le partage des dossiers
//    Google Drive (voir la procédure). Ici, le mode règle l'affichage
//    (cadenas, indicateur) ; la protection réelle est assurée par Google Drive.
//    Dans les DEUX modes, les documents sont en LECTURE SEULE.
//
//    • 'libre' : ACCÈS LIBRE — tout le monde lit les documents.
//                Dans Google Drive : Partager → « Tous les utilisateurs disposant du lien » (Lecteur).
//    • 'prive' : ACCÈS PRIVÉ AVEC AUTORISATION (par défaut) — seuls les comptes
//                Google que vous avez ajoutés lisent les documents.
//                Dans Google Drive : Partager → « Accès limité » + ajout des adresses autorisées (Lecteur).
const MODES_ACTIFS = [];
    MODES_ACTIFS.push('libre');       // ← ACCÈS LIBRE
  // MODES_ACTIFS.push('prive');    // ← ACCÈS PRIVÉ AVEC AUTORISATION (par défaut)

// 2) DOSSIER GOOGLE DRIVE PRIVÉ PAR DÉFAUT — paramètre unique.
//    Tous les PDF y sont envoyés, sauf si une règle plus précise (plus bas)
//    désigne un autre dossier.
const DRIVE_PRIVE = 'https://drive.google.com/drive/folders/1XwHYqd2GRfHaytLJQdtU2Rj3Cn44BGTy';

// Liens des sous-dossiers Google Drive : collez chaque lien entre les apostrophes.
// Tant qu'un lien est vide (''), la rubrique utilise DRIVE_PRIVE (jamais un lien cassé).
const DRIVE_DOSSIERS = {
    mpsiCorriges:   'https://drive.google.com/drive/folders/1XwHYqd2GRfHaytLJQdtU2Rj3Cn44BGTy',
    mpCorriges:     'https://drive.google.com/drive/folders/1B8WLaxfi4fsxyBo0AZg8r3ltOO5a-zHM',
    psiCorriges:    'https://drive.google.com/drive/folders/17QnMx0OGD_QKvMWvIsfTePKMOkY18D1_',
    mpsi:           'https://drive.google.com/drive/folders/1dE5SCOa904pde49jbUNT7f4nL8QbyGv0',
    mp:             'https://drive.google.com/drive/folders/1MljR-N760Gvrxdi1lQwWZGb2gggXcKTg',
    psi:            'https://drive.google.com/drive/folders/15-kJXd3L39QbPBBblA9C5KAoIoYhEJbL',
    publications:   'https://drive.google.com/drive/folders/1_QCeLCspOWAEKgy6mYxIhSYA3-fXH94X',
    communications: 'https://drive.google.com/drive/folders/1r7WaclJveWk-I6RIc3ksb0BuIl5LOaXn',
    these:          'https://drive.google.com/drive/folders/1O98TDaQY8ljQSMQ-KKT9tMBU8dzON9kr',
    memoires:       'https://drive.google.com/drive/folders/1X3E3C1OoKs8BIuJD_6CyLFl4SMSLyNv4',
    cv:             'https://drive.google.com/drive/folders/1-cZQhstww5jqHICpvdYiTZH8K4GnFCgy'
};
const lienDrive = (cle) => DRIVE_DOSSIERS[cle] || DRIVE_PRIVE;

const CONFIG_SITE = {
    // 3) COMPTEUR DE VISITES RÉEL (GoatCounter, gratuit).
    goatcounterCode: 'elbakkioui',
    visitesAnterieures: 0,
    fuseauHoraire: 'Africa/Casablanca',

    // 4) TOUS LES PDF RÉSERVÉS.
    //    true  = tout lien vers un fichier .pdf du site est redirigé vers Google Drive.
    //    false = seuls les fichiers désignés dans « documentsReserves » sont réservés.
    tousLesPdfReserves: true,

    // 5) DOCUMENTS RÉSERVÉS, HÉBERGÉS SUR GOOGLE DRIVE.
    //    Retirez ces fichiers de GitHub (tout ce qui est sur GitHub est public et
    //    téléchargeable par son adresse directe, quel que soit ce script).
    //    Jokers : * = n'importe quelle suite de caractères (y compris des sous-dossiers).
    //    La PREMIÈRE règle qui correspond l'emporte : gardez les plus précises en haut.
    documentsReserves: [
        // --- Corrigés (règles d'origine) ---
        { motif: 'documents/enseignement/mpsi/corrige*',     drive: lienDrive('mpsiCorriges'), libelle: 'Corrigés MPSI' },
        { motif: 'documents/enseignement/mpsi/Corrige*',     drive: lienDrive('mpsiCorriges'), libelle: 'Corrigés MPSI' },
        { motif: 'documents/enseignement/mpsi/BIS_Corrige*', drive: lienDrive('mpsiCorriges'), libelle: 'Corrigés MPSI' },
        { motif: 'documents/enseignement/psi/corrige*',      drive: lienDrive('psiCorriges'),  libelle: 'Corrigés PSI' },
        { motif: 'documents/enseignement/mp/corrige*',       drive: lienDrive('mpCorriges'),   libelle: 'Corrigés MP' },

        // --- Tous les autres PDF, par thème ---
        { motif: 'documents/enseignement/mpsi/*.pdf',  drive: lienDrive('mpsi'),           libelle: 'Ressources MPSI' },
        { motif: 'documents/enseignement/mp/*.pdf',    drive: lienDrive('mp'),             libelle: 'Ressources MP' },
        { motif: 'documents/enseignement/psi/*.pdf',   drive: lienDrive('psi'),            libelle: 'Ressources PSI' },
        { motif: 'documents/enseignement/*.pdf',       drive: DRIVE_PRIVE,                 libelle: 'Ressources pédagogiques' },
        { motif: 'documents/publications/*.pdf',       drive: lienDrive('publications'),   libelle: 'Publications' },
        { motif: 'documents/communications/*.pdf',     drive: lienDrive('communications'), libelle: 'Communications' },
        { motif: 'documents/these/*.pdf',              drive: lienDrive('these'),          libelle: 'Thèse' },
        { motif: 'documents/memoires/*.pdf',           drive: lienDrive('memoires'),       libelle: 'Mémoires' },
        { motif: 'documents/cv-khalid-elbakkioui.pdf', drive: lienDrive('cv'),             libelle: 'CV' },
    ],
    // Facultatif mais RECOMMANDÉ : lien Drive propre à un fichier. Le document
    // s'affiche alors directement dans la visionneuse (au lieu de la liste du dossier).
    // Lien d'un fichier : clic droit sur le fichier dans Drive → Partager → Copier le lien
    // (forme https://drive.google.com/file/d/.../view).
    liensDriveFichiers: {
        // 'documents/enseignement/mpsi/corrige-td1-mpsi.pdf': 'https://drive.google.com/file/d/IDENTIFIANT_DU_FICHIER/view',
    },

    // 6) LECTURE SEULE — s'applique dans les deux modes (libre et privé).
    lectureSeule: {
        actif: true,                   // true = tous les PDF s'ouvrent dans la visionneuse
        // Cadre isolé pour Google Drive : bloque téléchargements et impression
        // lancés depuis le cadre. Si l'aperçu Drive ne s'affiche plus, mettez false.
        sandboxDrive: true,
        // En mode privé, certains navigateurs (Safari, Firefox) n'affichent pas la
        // session Google dans un cadre intégré. true = ouvrir directement Drive dans
        // un nouvel onglet en mode privé (toujours en lecture seule grâce au réglage Drive).
        ouvertureDirecteEnPrive: false,
        // PDF.js : affichage des PDF hébergés sur le site, sans barre d'outils.
        pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        pdfjsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }
};
const PORTFOLIO_CONFIG = {
    backendPhp: false,                      // false sur GitHub Pages (pas de PHP)
    apiUrl: 'api.php',                      // backend PHP (même dossier que index.html)
    heartbeatMs: 60000,                     // rafraîchissement « en ligne » (1 min)
    debug: ['localhost', '127.0.0.1'].includes(window.location.hostname),
    tabContainers: '.research-tabs-compact, .documents-tabs-compact, .filiere-tabs'
};

// Lien Google Drive accepté (dossier ou fichier).
const LIEN_DRIVE_VALIDE = /^https:\/\/(drive|docs)\.google\.com\//;

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
        this.accessRules = null;     // verrous à afficher
        this.regexCache = new Map(); // motifs déjà convertis en expressions régulières
        this.siteMode = null;        // 'libre' ou 'prive' (édition GitHub Pages)
        this.reader = null;          // éléments de la visionneuse PDF
        this.readerToken = 0;        // invalide les rendus en cours à la fermeture
        this.readerDoc = null;       // document PDF.js ouvert
        this.pdfjsPromise = null;
        this.readerReturnFocus = null;
        this.init();
    }

    // =====================================================================
    // 1. INITIALISATION GÉNÉRALE
    // =====================================================================

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                log('✅ DOM chargé — Initialisation de l\'application');
                this.setupConsoleWelcome();
                this.setupErrorHandling();
                this.initializeAll();
            });
        } else {
            log('✅ DOM déjà chargé — Initialisation immédiate');
            this.setupConsoleWelcome();
            this.setupErrorHandling();
            this.initializeAll();
        }
    }

    initializeAll() {
        if (this.isInitialized) return;

        // Chaque module est isolé : une erreur dans l'un n'empêche pas les autres.
        // L'ordre compte : accessibilité → lecture seule → serveur (redirection Drive).
        const modules = [
            // Navigation & structure de page
            'initNavigation', 'initSmoothScrolling', 'initBackToTop', 'initScrollEffects',
            'initKeyboardNavigation', 'initAccessibility',
            // Contenu dynamique / onglets
            'initTabs', 'initAllButtons', 'initResourceCards', 'initBooksSection',
            // Animations
            'initHeroAnimations', 'initAnimations', 'initCounters',
            // Formulaire de contact
            'initContactForm',
            // Widgets d'information
            'initDateTimeUpdater',
            // Fonctionnalités techniques
            'initDownloadLinks', 'initProtectedLinks', 'initThemeToggle', 'initImageLazyLoading',
            'initPerformanceOptimizations',
            // Lecture seule des PDF (avant la redirection vers Google Drive)
            'initReadOnlyViewer',
            // Serveur : visites, compte, mode d'accès
            'initServerConnection'
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
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const styles = [
                'background: linear-gradient(135deg, #667eea, #764ba2)',
                'color: white',
                'padding: 12px 24px',
                'border-radius: 8px',
                'font-size: 16px',
                'font-weight: bold',
                'text-shadow: 1px 1px 2px rgba(0,0,0,0.3)'
            ].join(';');

            console.log('%c🎓 Portfolio Dr. Khalid EL BAKKIOUI', styles);
            console.log('%cMathématicien • Enseignant CPGE • Chercheur en Probabilités', 'color: #2c3e50; font-weight: 500;');
            console.log('%c✨ JavaScript optimisé — Toutes les fonctionnalités activées', 'color: #27ae60;');
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('❌ Erreur JavaScript:', e.error || e.message);
        });

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

        if (!navToggle || !navMenu) {
            console.warn('❌ Éléments de navigation non trouvés');
            return;
        }

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(navMenu, navToggle);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Même seuil que la media query CSS du menu mobile (992 px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                this.closeMobileMenu(navMenu, navToggle);
            }
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
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            navToggle.focus();
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        if (!navMenu || !navToggle) return;
        if (!navMenu.classList.contains('open')) return;
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleNavbarScroll(navbar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const menuOpen = navbar.querySelector('.nav-menu.open');

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');

            if (!menuOpen && scrollTop > this.lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
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
        if (!targetElement) {
            console.warn(`❌ Élément non trouvé: ${targetId}`);
            return;
        }

        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        this.closeMobileMenu(
            document.querySelector('.nav-menu'),
            document.querySelector('.nav-toggle')
        );
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const toggleVisibility = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            backToTop.classList.toggle('visible', scrollTop > 300);
        };

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
    }

    initScrollEffects() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNavLink(id, navLinks);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });

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

        if (heroElements.length === 0 || !('IntersectionObserver' in window)) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeInUp 0.8s ease-out both`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
            el.style.opacity = '0';
            observer.observe(el);
        });

        // Sécurité : si l'observateur ne se déclenche pas, le contenu reste lisible.
        setTimeout(() => heroElements.forEach(el => {
            if (!el.style.animation) el.style.opacity = '';
        }), 3000);
    }

    initAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatables = document.querySelectorAll(
            '.profile-card, .pub-item-compact, .conf-item-compact, .these-item-compact, ' +
            '.memoire-item-compact, .livre-item-compact, .ressource-item-compact, ' +
            '.contact-item-compact, .carte-niveau, .carte-document'
        );

        animatables.forEach(el => {
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
        const counters = document.querySelectorAll('.stat h3');

        counters.forEach(counter => {
            const target = parseInt(counter.textContent, 10) || 0;
            if (target === 0) return;

            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);

                counter.textContent = current + '+';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target + '+';
                }
            };

            requestAnimationFrame(animate);
        });
    }

    // =====================================================================
    // 5. SYSTÈME D'ONGLETS (unifié)
    // =====================================================================

    initTabs() {
        log('🔧 Initialisation du système d\'onglets universel...');

        const allTabContainers = document.querySelectorAll(PORTFOLIO_CONFIG.tabContainers);

        if (allTabContainers.length === 0) {
            console.warn('⚠️ Aucun conteneur d\'onglets trouvé');
            return;
        }

        allTabContainers.forEach(container => this.initSingleTabSystem(container));

        log(`✅ ${allTabContainers.length} système(s) d'onglets initialisé(s)`);
    }

    initSingleTabSystem(container) {
        const tabButtons = container.querySelectorAll('.tab-button');

        if (tabButtons.length === 0) {
            console.warn('⚠️ Aucun bouton d\'onglet trouvé dans', container.className);
            return;
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.getAttribute('data-tab');
                this.switchTab(container, button, container.querySelectorAll('.tab-button'), container.querySelectorAll('.tab-pane'), tabId);
            });
        });

        // Si aucun onglet n'est actif, activer le premier
        const activeButton = container.querySelector('.tab-button.active') || tabButtons[0];
        this.switchTab(container, activeButton, tabButtons, container.querySelectorAll('.tab-pane'), activeButton.getAttribute('data-tab'));
    }

    switchTab(container, activeButton, tabButtons, tabPanes, tabId) {
        log('🎯 Activation de l\'onglet:', tabId);

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
            log('✅ Onglet activé:', tabId);
        } else {
            console.error('❌ Panneau non trouvé pour l\'ID:', tabId);
        }
    }

    handleTabKeyboardNavigation(currentTab, direction) {
        const tabContainer = currentTab.closest(PORTFOLIO_CONFIG.tabContainers);
        if (!tabContainer) return;

        const tabs = Array.from(tabContainer.querySelectorAll('.tab-button'));
        const currentIndex = tabs.indexOf(currentTab);
        let nextIndex;

        if (direction === 'first') {
            nextIndex = 0;
        } else if (direction === 'last') {
            nextIndex = tabs.length - 1;
        } else if (direction === 'next') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        const nextTab = tabs[nextIndex];
        const tabId = nextTab.getAttribute('data-tab');
        const tabPanes = tabContainer.querySelectorAll('.tab-pane');

        this.switchTab(tabContainer, nextTab, tabs, tabPanes, tabId);
        nextTab.focus();
    }

    // =====================================================================
    // 6. BOUTONS SPÉCIFIQUES
    // =====================================================================

    initAllButtons() {
        log('🔘 Initialisation de tous les boutons spécifiques...');

        this.initFiliereButtons();
        this.initConferenceButtons();
        this.initLivreButtons();
        this.initMemoireButtons();
        this.initGeneralButtons();

        log('✅ Tous les boutons initialisés');
    }

    /** Si l'élément est un PDF en lecture seule, l'ouvre dans la visionneuse. */
    openIfReadOnly(element) {
        if (element && element.dataset && element.dataset.lecture === '1') {
            this.openReader(element);
            return true;
        }
        return false;
    }

    initFiliereButtons() {
        const filiereButtons = ['ECT1', 'ECT2', 'ECS1', 'ECS2', 'MPSI', 'MP'];

        filiereButtons.forEach(filiere => {
            const buttons = document.querySelectorAll(
                `.btn-${filiere.toLowerCase()}, ` +
                `[data-filiere="${filiere}"], ` +
                `.btn-${filiere.toLowerCase()}-button`
            );

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    log(`🎓 Bouton ${filiere} cliqué`);
                    this.handleFiliereClick(filiere);
                });
            });
        });

        log(`✅ ${filiereButtons.length} filières initialisées`);
    }

    handleFiliereClick(filiere) {
        const filiereNames = {
            'ECT1': 'ECT 1ère année',
            'ECT2': 'ECT 2ème année',
            'ECS1': 'ECS 1ère année',
            'ECS2': 'ECS 2ème année',
            'MPSI': 'MPSI',
            'MP': 'MP'
        };
        const displayName = filiereNames[filiere] || filiere;
        this.showNotification(`Filière ${displayName} sélectionnée`, 'info', 3000);

        const key = filiere.toLowerCase();
        const targetId = document.getElementById(`section-${key}`) ? `section-${key}` : key;
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const filiereTabsContainer = document.querySelector('.filiere-tabs');
            if (filiereTabsContainer) {
                const targetButton = filiereTabsContainer.querySelector(`[data-tab="${targetId}"]`);
                if (targetButton) {
                    const tabButtons = filiereTabsContainer.querySelectorAll('.tab-button');
                    const tabPanes = filiereTabsContainer.querySelectorAll('.tab-pane');
                    this.switchTab(filiereTabsContainer, targetButton, tabButtons, tabPanes, targetId);
                }
            }
            this.scrollToElement(`#${targetId}`);
        } else {
            console.warn(`⚠️ Section non trouvée: ${targetId}`);
        }

        document.dispatchEvent(new CustomEvent('filiereSelected', { detail: { filiere } }));
    }

    initConferenceButtons() {
        document.querySelectorAll('.btn-conference, [data-type="conference"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                log('🎤 Bouton conférence cliqué');
                this.handleConferenceClick(button);
            });
        });
    }

    handleConferenceClick(button) {
        if (this.openIfReadOnly(button)) return;
        const conferenceTitle = button.getAttribute('data-title') || button.textContent.trim() || 'Conférence';
        this.showNotification(`Conférence: ${conferenceTitle}`, 'info', 3000);

        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    initLivreButtons() {
        document.querySelectorAll('.btn-livre, [data-type="livre"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                log('📚 Bouton livre cliqué');
                this.handleLivreClick(button);
            });
        });
    }

    handleLivreClick(button) {
        if (this.openIfReadOnly(button)) return;
        const livreTitle = button.getAttribute('data-title') || button.textContent.trim() || 'Livre';
        this.showNotification(`Livre: ${livreTitle}`, 'info', 3000);

        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    initMemoireButtons() {
        document.querySelectorAll('.btn-memoire, [data-type="memoire"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                log('📖 Bouton mémoire cliqué');
                this.handleMemoireClick(button);
            });
        });
    }

    handleMemoireClick(button) {
        if (this.openIfReadOnly(button)) return;
        const memoireTitle = button.getAttribute('data-title') || button.textContent.trim() || 'Mémoire';
        this.showNotification(`Mémoire: ${memoireTitle}`, 'info', 3000);

        const url = button.getAttribute('href');
        if (url) {
            if (url.startsWith('#')) {
                this.scrollToElement(url);
            } else {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }
    }

    initGeneralButtons() {
        document.querySelectorAll('.btn-view, .view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.openIfReadOnly(button)) return;
                const target = button.getAttribute('data-target') || button.getAttribute('href');
                log(`👀 Vue demandée: ${target}`);
                this.handleViewClick(target);
            });
        });
    }

    handleViewClick(target) {
        if (target && target.startsWith('#')) {
            this.scrollToElement(target);
        } else if (target) {
            window.open(target, '_blank', 'noopener,noreferrer');
        }
    }

    // =====================================================================
    // 7. RESSOURCES & LIVRES
    // =====================================================================

    initResourceCards() {
        // Le changement de couleur de bordure au survol est géré en CSS
        // (.ressource-item-compact:hover).
        const ressourceItems = document.querySelectorAll('.ressource-item-compact');
        log(`📄 ${ressourceItems.length} ressources pédagogiques`);
    }

    initBooksSection() {
        const covers = document.querySelectorAll('.livre-cover');

        covers.forEach(img => {
            const hide = () => { img.style.display = 'none'; };
            img.addEventListener('error', hide);

            if (!img.complete) {
                img.addEventListener('load', function () {
                    this.style.display = 'block';
                });
            } else if (img.naturalWidth === 0) {
                hide();
            }
        });

        // Sécurité pour les liens externes des livres
        document.querySelectorAll('.livre-actions a, a[target="_blank"]').forEach(link => {
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // =====================================================================
    // 8. TÉLÉCHARGEMENTS (fichiers autres que PDF)
    // =====================================================================

    initDownloadLinks() {
        // Délégation d'événement. Les PDF (data-lecture), les liens Google Drive
        // (data-drive) et les liens protégés (data-protege) ont leur propre traitement.
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[download], .download-link');
            if (!link || e.defaultPrevented) return;
            if (link.dataset.protege === '1' || link.dataset.drive || link.dataset.lecture === '1') return;

            const href = link.getAttribute('href') || '';
            if (!href || href.startsWith('#')) return;
            const fileName = decodeURIComponent(href.split('/').pop() || 'document');

            // Retour visuel
            const iconEl = link.querySelector('i');
            if (iconEl && !link.dataset.busy) {
                const originalClass = iconEl.className;
                link.dataset.busy = '1';
                link.setAttribute('aria-busy', 'true');
                iconEl.className = 'fas fa-spinner fa-spin';
                setTimeout(() => {
                    iconEl.className = originalClass;
                    delete link.dataset.busy;
                    link.removeAttribute('aria-busy');
                }, 1500);
            }

            this.trackDownload(fileName);
            this.showNotification(`Téléchargement: ${fileName}`, 'info', 2000);
        });
    }

    trackDownload(fileName, event = 'download') {
        const downloadEvent = {
            event,
            file: fileName,
            timestamp: new Date().toISOString()
        };

        log('📥 Suivi :', downloadEvent);

        try {
            const downloads = JSON.parse(localStorage.getItem('portfolioDownloads') || '[]');
            downloads.push(downloadEvent);
            localStorage.setItem('portfolioDownloads', JSON.stringify(downloads.slice(-50)));
        } catch (e) {
            console.error('❌ Erreur suivi:', e);
        }
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
            if (await this.validateForm(contactForm)) {
                await this.submitForm(contactForm);
            } else {
                contactForm.querySelector('.error')?.focus();
            }
        });
    }

    validateField(field) {
        if (field.name === 'website') return true;
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        const type = field.tagName === 'TEXTAREA' ? 'textarea' : field.type;

        switch (type) {
            case 'text':
                if (!value) {
                    isValid = false;
                    message = 'Ce champ est requis';
                } else if (field.name?.includes('name') && value.length < 2) {
                    isValid = false;
                    message = 'Minimum 2 caractères';
                }
                break;

            case 'email':
                if (!value) {
                    isValid = false;
                    message = 'Email requis';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Email invalide';
                }
                break;

            case 'textarea':
                if (!value) {
                    isValid = false;
                    message = 'Message requis';
                } else if (value.length < 10) {
                    isValid = false;
                    message = 'Minimum 10 caractères';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    async validateForm(form) {
        const fields = form.querySelectorAll('input:not([name="website"]), textarea');
        let isValid = true;

        for (const field of fields) {
            if (!this.validateField(field)) {
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldStatus(field);
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.id = `err-${field.name || Math.random().toString(36).slice(2)}`;
            errorDiv.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
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
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
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
            if (error && error.fallback) {
                this.openMailFallback(data);
            } else {
                this.showNotification(error?.message || 'Erreur lors de l\'envoi.', 'error');
            }
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendFormData(data) {
        if (!this.server) {
            const err = new Error('Serveur indisponible');
            err.fallback = true;
            throw err;
        }
        const response = await this.apiRequest('contact', { ...data, token: this.server.token });
        if (!response.ok) {
            throw new Error(response.error || 'Erreur lors de l\'envoi.');
        }
        log('📧 Message transmis au serveur');
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
        // Supprimer les notifications en double
        document.querySelectorAll('.notification').forEach(notification => {
            if (notification.dataset.message === message) {
                this.removeNotification(notification);
            }
        });

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

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

        if (duration > 0) {
            setTimeout(() => this.removeNotification(notification), duration);
        }

        return notification;
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // =====================================================================
    // 11. CONNEXION AU SERVEUR : VISITES, COMPTE, MODE D'ACCÈS
    // =====================================================================

    async apiRequest(action, body = null) {
        const options = {
            method: body === null && action === 'status' ? 'GET' : 'POST',
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        };
        if (options.method === 'POST') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body || {});
        }
        const controller = 'AbortController' in window ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 8000) : null;
        if (controller) options.signal = controller.signal;

        try {
            const response = await fetch(`${PORTFOLIO_CONFIG.apiUrl}?action=${encodeURIComponent(action)}`, options);
            const type = response.headers.get('content-type') || '';
            if (!type.includes('application/json')) {
                throw new Error('Réponse non JSON (backend PHP absent ?)');
            }
            const json = await response.json();
            if (!response.ok && json.ok !== false) json.ok = false;
            return json;
        } finally {
            if (timer) clearTimeout(timer);
        }
    }

    async initServerConnection() {
        if (!PORTFOLIO_CONFIG.backendPhp) {
            this.initStaticMode();       // GitHub Pages : Google Drive + GoatCounter
            return;
        }
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
            this.initVisitorCounter();   // compteur local de secours
        }
    }

    applyServerState(data) {
        this.updateAccountNav(data);
        this.updateModeIndicator(data.mode);
        this.accessRules = data.acces || null;
        this.markProtectedLinks();

        if (data.user && data.user.mustChange) {
            this.showNotification('Votre mot de passe temporaire doit être remplacé.', 'warning', 0,
                { href: data.urls.compte, label: 'Changer maintenant' });
        }
        if (Array.isArray(data.configErreurs) && data.configErreurs.length) {
            this.showNotification(`Configuration à corriger (${data.configErreurs.length} problème(s)) — voir l'administration.`, 'warning', 0,
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

        link.href = user && user.role === 'admin' && data.urls.admin ? data.urls.admin : data.urls.compte;
        if (label) label.textContent = user ? (user.role === 'admin' ? 'Administration' : user.name) : 'Connexion';
        if (icon) icon.className = user ? (user.role === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-check') : 'fas fa-user';
        link.title = user ? `Connecté : ${user.name}` : 'Se connecter ou demander un accès';
        item.hidden = false;
    }

    updateModeIndicator(mode) {
        const indicator = document.getElementById('access-mode');
        if (!indicator) return;
        const libre = mode === 'libre';
        indicator.className = `info-item access-mode-indicator ${libre ? 'mode-libre' : 'mode-prive'}`;
        indicator.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = `fas ${libre ? 'fa-lock-open' : 'fa-lock'}`;
        icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span');
        // Correction : guillemets doubles (les apostrophes de « l'approuve » cassaient la chaîne).
        text.textContent = libre
            ? "Accès libre aux documents"
            : "Accès privé aux documents sur demande pour mes étudiants — lecture seule";
        indicator.append(icon, text);
        indicator.title = libre
            ? 'Les documents sont consultables par tous, en lecture seule.'
            : 'Les documents PDF sont réservés aux comptes autorisés, en lecture seule.';
        indicator.hidden = false;
    }

    displayServerCounters(visites) {
        if (!visites) return;
        const totalEl = document.getElementById('total-visitors');
        const onlineEl = document.getElementById('current-visitors');
        const todayEl = document.getElementById('today-visitors');
        this.animateCounter(totalEl, visites.total);
        this.animateCounter(onlineEl, visites.online);
        this.animateCounter(todayEl, visites.today);
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
    // 12. LIENS PROTÉGÉS (indication visuelle — contrôle réel côté serveur)
    // =====================================================================

    globToRegex(pattern) {
        if (this.regexCache.has(pattern)) return this.regexCache.get(pattern);
        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
        const regex = new RegExp(`^${escaped}$`, 'i');
        this.regexCache.set(pattern, regex);
        return regex;
    }

    /** Chemin relatif au site d'une URL interne, ou null si externe. */
    relativePath(href) {
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return null;
            const base = new URL('.', new URL(PORTFOLIO_CONFIG.apiUrl, window.location.href)).pathname;
            const path = decodeURIComponent(url.pathname);
            return path.startsWith(base) ? path.slice(base.length) : null;
        } catch (e) {
            return null;
        }
    }

    isLocked(path) {
        const rules = this.accessRules;
        if (!rules || !path) return false;
        const matches = (p) => this.globToRegex(p).test(path);
        const locks = rules.verrous || [];
        if (locks.some(l => l.portee === 'toujours' && matches(l.motif))) return true;
        if ((rules.publics || []).some(matches)) return false;
        return locks.some(l => l.portee === 'prive' && matches(l.motif));
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
    }

    removeLockMarker(link) {
        link.querySelector('.acces-verrou')?.remove();
        link.querySelector('.acces-verrou-texte')?.remove();
    }

    markProtectedLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const path = this.relativePath(link.getAttribute('href'));
            const locked = this.isLocked(path);

            if (locked) {
                link.dataset.protege = '1';
                link.classList.add('lien-protege');
                if (!link.dataset.originalTitle) link.dataset.originalTitle = link.title || '';
                link.title = 'Réservé aux utilisateurs autorisés — connexion requise';
                this.addLockMarker(link);
            } else if (link.dataset.protege) {
                delete link.dataset.protege;
                link.classList.remove('lien-protege');
                link.title = link.dataset.originalTitle || '';
                this.removeLockMarker(link);
            }
        });
    }

    initProtectedLinks() {
        // Interception AVANT tout autre traitement (phase de capture).
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-protege="1"]');
            if (!link || !this.server) return;
            e.preventDefault();
            e.stopPropagation();

            const path = this.relativePath(link.getAttribute('href')) || '';
            const compte = this.server.urls.compte;
            if (this.server.user) {
                this.showNotification('Votre compte n\'a pas l\'autorisation d\'accéder à ce document.', 'warning', 6000,
                    { href: compte, label: 'Mon compte' });
            } else {
                window.location.href = `${compte}?raison=connexion&next=${encodeURIComponent(path)}`;
            }
        }, true);
    }

    // =====================================================================
    // 12 bis. ÉDITION GITHUB PAGES : MODE D'ACCÈS, GOOGLE DRIVE, GOATCOUNTER
    // =====================================================================

    /** Vérifie la configuration et renvoie le mode effectif. */
    validateSiteConfig() {
        const erreurs = [];
        const modes = [...new Set(MODES_ACTIFS)];
        let mode = 'prive';                         // fermeture par défaut si invalide
        if (MODES_ACTIFS.length !== 1 || modes.length !== 1) {
            erreurs.push(`Il faut exactement un mode actif (actuellement : ${MODES_ACTIFS.join(', ') || 'aucun'}).`);
        } else if (!['libre', 'prive'].includes(modes[0])) {
            erreurs.push(`Mode inconnu « ${modes[0]} » (valeurs possibles : libre, prive).`);
        } else {
            mode = modes[0];
        }

        if (CONFIG_SITE.tousLesPdfReserves && !LIEN_DRIVE_VALIDE.test(DRIVE_PRIVE)) {
            erreurs.push('DRIVE_PRIVE vide ou invalide : les PDF sans règle dédiée restent sur GitHub (téléchargeables par leur adresse).');
        }
        (CONFIG_SITE.documentsReserves || []).forEach((r, i) => {
            if (!r || !r.motif) erreurs.push(`Règle n°${i + 1} sans motif.`);
            else if (r.drive && !LIEN_DRIVE_VALIDE.test(r.drive)) erreurs.push(`Règle « ${r.motif} » : lien Google Drive invalide.`);
            else if (!r.drive) {
                erreurs.push(`Règle « ${r.motif} » : aucun lien Drive, ces documents restent sur GitHub (téléchargeables par leur adresse).`);
            }
        });
        Object.entries(CONFIG_SITE.liensDriveFichiers || {}).forEach(([fichier, url]) => {
            if (!LIEN_DRIVE_VALIDE.test(url)) erreurs.push(`Lien Drive invalide pour « ${fichier} ».`);
        });
        if (CONFIG_SITE.goatcounterCode && !/^[a-z0-9-]{2,50}$/.test(CONFIG_SITE.goatcounterCode)) {
            erreurs.push('Code GoatCounter invalide (lettres minuscules, chiffres, tirets).');
        }

        // Signalées dans la console (F12) pour ne pas gêner les visiteurs.
        erreurs.forEach(e => console.warn('⚠️ Configuration du site :', e));
        if (erreurs.length && PORTFOLIO_CONFIG.debug) {
            this.showNotification(`Configuration : ${erreurs.length} problème(s), voir la console (F12).`, 'warning', 8000);
        }
        return mode;
    }

    initStaticMode() {
        const mode = this.validateSiteConfig();
        this.siteMode = mode;
        this.updateModeIndicator(mode);
        this.applyDriveLinks(mode);
        this.initGoatCounter();
    }

    /**
     * Lien Google Drive applicable à un chemin, ou null.
     * Ordre : lien propre au fichier → première règle correspondante →
     * dossier privé par défaut pour tout autre PDF (si tousLesPdfReserves).
     */
    driveLinkFor(path) {
        if (!path) return null;
        const fichiers = CONFIG_SITE.liensDriveFichiers || {};
        if (fichiers[path] && LIEN_DRIVE_VALIDE.test(fichiers[path])) return { url: fichiers[path], libelle: '' };
        const regle = (CONFIG_SITE.documentsReserves || [])
            .find(r => r && r.motif && r.drive && LIEN_DRIVE_VALIDE.test(r.drive) && this.globToRegex(r.motif).test(path));
        if (regle) return { url: regle.drive, libelle: regle.libelle || '' };
        if (CONFIG_SITE.tousLesPdfReserves && /\.pdf$/i.test(path) && LIEN_DRIVE_VALIDE.test(DRIVE_PRIVE)) {
            return { url: DRIVE_PRIVE, libelle: 'Documents PDF' };
        }
        return null;
    }

    applyDriveLinks(mode) {
        const lecture = !!CONFIG_SITE.lectureSeule?.actif;
        let count = 0;
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.dataset.drive === '1') return;
            const path = this.relativePath(link.getAttribute('href'));
            const drive = this.driveLinkFor(path);
            if (!drive) return;

            count++;
            link.dataset.drive = '1';
            link.dataset.cheminOriginal = path;
            link.href = drive.url;
            link.removeAttribute('download');
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            if (lecture) {
                // Le lien n'est plus un fichier local : il s'ouvre dans la visionneuse.
                link.dataset.lecture = '1';
                delete link.dataset.local;
                this.toReadLabels(link);
            }

            const nom = drive.libelle ? ` (${drive.libelle})` : '';
            if (mode === 'prive') {
                link.classList.add('lien-protege');
                link.title = `Réservé${nom} — lecture seule, avec le compte Google autorisé`;
                this.addLockMarker(link);
            } else {
                link.title = `Lire en ligne${nom} — lecture seule`;
            }
        });

        log(`🔐 ${count} lien(s) redirigé(s) vers Google Drive (mode ${mode}, lecture seule : ${lecture})`);
    }

    /** Compteur réel via GoatCounter ; repli sur le compteur local. */
    async initGoatCounter() {
        const code = CONFIG_SITE.goatcounterCode;
        if (!code || !/^[a-z0-9-]{2,50}$/.test(code) || window.location.protocol === 'file:') {
            this.initVisitorCounter();
            return;
        }

        // Enregistrement de la visite (script officiel GoatCounter)
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://gc.zgo.at/count.js';
        s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
        document.head.appendChild(s);

        const base = `https://${code}.goatcounter.com/counter/TOTAL.json`;
        const parse = (data) => Number.parseInt(String(data?.count || '0').replace(/\D/g, ''), 10) || 0;
        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: CONFIG_SITE.fuseauHoraire || 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(new Date());   // AAAA-MM-JJ

        try {
            const [total, jour] = await Promise.all([
                fetch(base, { cache: 'no-store' }).then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status)))),
                fetch(`${base}?start=${today}`, { cache: 'no-store' }).then(r => (r.ok ? r.json() : { count: '0' })).catch(() => ({ count: '0' }))
            ]);
            const totalEl = document.getElementById('total-visitors');
            const todayEl = document.getElementById('today-visitors');
            this.animateCounter(totalEl, parse(total) + (Number(CONFIG_SITE.visitesAnterieures) || 0));
            this.animateCounter(todayEl, parse(jour));
            if (totalEl) totalEl.title = 'Visites depuis l\'ouverture du site (GoatCounter, mise à jour toutes les quelques heures)';

            // « En ligne » : GoatCounter ne le fournit pas → estimation locale conservée.
            const onlineEl = document.getElementById('current-visitors');
            if (onlineEl) this.animateCounter(onlineEl, this.calculateOnlineUsers(this.getVisitorStats('portfolioVisitorStats')));
        } catch (error) {
            log('ℹ️ GoatCounter indisponible :', error.message);
            this.initVisitorCounter();
        }
    }

    // =====================================================================
    // 12 ter. LECTURE SEULE : VISIONNEUSE PDF INTÉGRÉE (modes libre ET privé)
    // =====================================================================
    //
    // • Google Drive (fichier) : aperçu intégré /preview dans un cadre isolé.
    // • Google Drive (dossier) : vue de dossier intégrée ; chaque fichier s'ouvre
    //   dans la visionneuse Drive, où le réglage « lecture seule » s'applique.
    // • PDF hébergé sur le site : rendu page par page avec PDF.js (images, sans
    //   barre d'outils, donc sans bouton de téléchargement ni d'impression).
    // Le blocage des raccourcis est dissuasif ; le verrou réel est côté Google Drive.

    /** Mode effectif, quelle que soit l'édition (GitHub Pages ou PHP). */
    currentMode() {
        return this.siteMode || this.server?.mode || 'prive';
    }

    initReadOnlyViewer() {
        if (!CONFIG_SITE.lectureSeule?.actif) return;

        // Clic (y compris Ctrl/Cmd/Maj + clic) sur un PDF → visionneuse.
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-lecture="1"]');
            if (!link || e.defaultPrevented) return;
            e.preventDefault();
            this.openReader(link);
        });

        // Clic molette sur un PDF local : visionneuse au lieu d'un nouvel onglet brut.
        document.addEventListener('auxclick', (e) => {
            const link = e.target.closest('a[data-lecture="1"][data-local="1"]');
            if (link && e.button === 1) {
                e.preventDefault();
                this.openReader(link);
            }
        });

        // Raccourcis bloqués tant que la visionneuse est ouverte (phase de capture).
        document.addEventListener('keydown', (e) => {
            if (!this.isReaderOpen()) return;
            const key = (e.key || '').toLowerCase();
            if ((e.ctrlKey || e.metaKey) && (key === 'p' || key === 's')) {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification('Document en lecture seule : impression et téléchargement désactivés.', 'warning', 3000);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeReader();
            } else if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        }, true);

        // Clic droit, glisser-déposer et sélection bloqués dans la visionneuse.
        ['contextmenu', 'dragstart', 'selectstart', 'copy'].forEach(type => {
            document.addEventListener(type, (e) => {
                if (e.target.closest && e.target.closest('.pdf-lecteur-corps')) e.preventDefault();
            });
        });

        // Premier passage : PDF encore hébergés sur le site (avant redirection Drive).
        this.prepareReadOnlyLinks();
    }

    /** Marque tous les liens vers un PDF du site comme « lecture seule ». */
    prepareReadOnlyLinks() {
        let local = 0;
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.dataset.lecture === '1' || link.dataset.drive === '1') return;
            let url;
            try { url = new URL(link.getAttribute('href'), window.location.href); } catch (e) { return; }
            if (url.origin !== window.location.origin || !/\.pdf$/i.test(url.pathname)) return;

            link.dataset.lecture = '1';
            link.dataset.local = '1';
            link.removeAttribute('download');
            link.removeAttribute('target');
            this.toReadLabels(link);
            local++;
        });

        if (local && !PORTFOLIO_CONFIG.backendPhp) {
            log(`ℹ️ ${local} lien(s) PDF local(aux) en lecture seule (ceux qui ont une règle Drive seront redirigés).`);
        }
    }

    /** Remplace « Télécharger » par « Lire » (icône, texte, libellés). */
    toReadLabels(link) {
        link.querySelectorAll('i.fa-download, i.fa-file-download, i.fa-cloud-download-alt').forEach(icon => {
            icon.classList.remove('fa-download', 'fa-file-download', 'fa-cloud-download-alt');
            icon.classList.add('fa-eye');
        });

        const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (/[Tt]élécharger/.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(/Télécharger/g, 'Lire').replace(/télécharger/g, 'lire');
            }
        }

        const label = link.getAttribute('aria-label');
        if (label) link.setAttribute('aria-label', label.replace(/^Télécharger/, 'Lire'));
        if (!link.dataset.drive) link.title = 'Lire en ligne — lecture seule (ni téléchargement ni impression)';
    }

    /** Titre lisible du document à partir de la carte qui contient le lien. */
    linkContextTitle(link) {
        if (link.dataset.titre) return link.dataset.titre;
        const ctx = link.closest('[class*="-item-compact"], .carte-document')
            ?.querySelector('.pub-title, .chap-title, .ri-title, .these-title, .memoire-title, .livre-title, .conf-name');
        if (ctx) {
            const t = (ctx.firstChild?.textContent || '').trim() || ctx.textContent.trim();
            if (t) return t;
        }
        const own = link.textContent.replace('(accès réservé)', '').trim();
        return own.length > 3 && !/^(lire|télécharger|pdf|ouvrir|corrigé|voir)$/i.test(own) ? own : '';
    }

    /** Adresse intégrable d'un lien Google Drive (fichier ou dossier), ou null. */
    driveEmbed(url) {
        const dossier = url.match(/\/folders\/([\w-]+)/);
        if (dossier) {
            return { type: 'dossier', src: `https://drive.google.com/embeddedfolderview?id=${dossier[1]}#list` };
        }
        const fichier = url.match(/\/file\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
        if (fichier) {
            return { type: 'fichier', src: `https://drive.google.com/file/d/${fichier[1]}/preview` };
        }
        return null;
    }

    buildReader() {
        if (this.reader) return this.reader;

        const el = (tag, cls, attrs = {}) => {
            const node = document.createElement(tag);
            if (cls) node.className = cls;
            Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
            return node;
        };

        const root = el('div', 'pdf-lecteur', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'pdf-lecteur-titre' });
        root.hidden = true;

        const fond = el('div', 'pdf-lecteur-fond');
        fond.addEventListener('click', () => this.closeReader());

        const boite = el('div', 'pdf-lecteur-boite');
        const entete = el('div', 'pdf-lecteur-entete');
        const titre = el('h2', 'pdf-lecteur-titre', { id: 'pdf-lecteur-titre' });
        const badge = el('span', 'pdf-lecteur-badge');
        badge.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Lecture seule';
        const drive = el('a', 'pdf-lecteur-drive', { target: '_blank', rel: 'noopener noreferrer' });
        drive.innerHTML = '<i class="fab fa-google-drive" aria-hidden="true"></i> <span>Ouvrir dans Google Drive</span>';
        drive.hidden = true;
        const fermer = el('button', 'pdf-lecteur-fermer', { type: 'button', 'aria-label': 'Fermer la visionneuse' });
        fermer.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        fermer.addEventListener('click', () => this.closeReader());

        entete.append(titre, badge, drive, fermer);
        const aide = el('p', 'pdf-lecteur-aide');
        const corps = el('div', 'pdf-lecteur-corps');
        boite.append(entete, aide, corps);
        root.append(fond, boite);
        document.body.appendChild(root);

        this.reader = { root, titre, drive, fermer, aide, corps };
        return this.reader;
    }

    openReader(link) {
        const r = this.buildReader();
        const opts = CONFIG_SITE.lectureSeule || {};
        const token = ++this.readerToken;
        const prive = this.currentMode() === 'prive';

        const chemin = link.dataset.cheminOriginal || this.relativePath(link.getAttribute('href')) || '';
        let fichier = chemin.split('/').pop() || '';
        try { fichier = decodeURIComponent(fichier); } catch (e) { /* nom déjà décodé */ }
        const titre = this.linkContextTitle(link) || fichier || 'Document';

        r.titre.textContent = titre;
        r.corps.replaceChildren();
        r.aide.textContent = '';
        r.drive.hidden = true;
        this.trackDownload(fichier || titre, 'lecture');

        if (link.dataset.drive === '1') {
            const driveUrl = link.getAttribute('href');
            const embed = this.driveEmbed(driveUrl);
            const aide = [];
            if (embed?.type === 'dossier' && fichier) aide.push(`Ouvrez le fichier « ${fichier} » dans la liste.`);
            if (prive) {
                aide.push("Document réservé : connectez-vous avec le compte Google autorisé. Si rien ne s'affiche, utilisez « Ouvrir dans Google Drive ». Pas encore d'accès ? Demandez-le via le formulaire de contact.");
            }

            // Pas d'aperçu intégrable, ou mode privé avec ouverture directe : nouvel onglet Drive.
            if (!embed || (prive && opts.ouvertureDirecteEnPrive)) {
                window.open(driveUrl, '_blank', 'noopener,noreferrer');
                if (aide.length) this.showNotification(aide.join(' '), 'info', 9000);
                return;
            }

            r.aide.textContent = aide.join(' ');
            r.drive.href = driveUrl;
            r.drive.hidden = false;
            r.corps.appendChild(this.createDriveFrame(embed, titre, opts));
            this.showReader();
            return;
        }

        // PDF hébergé sur le site : rendu PDF.js (sans barre d'outils).
        this.showReader();
        this.renderLocalPdf(link.getAttribute('href'), r.corps, token);
    }

    createDriveFrame(embed, titre, opts) {
        const frame = document.createElement('iframe');
        frame.className = 'pdf-lecteur-cadre';
        frame.title = `Lecture seule : ${titre}`;
        frame.setAttribute('allow', 'fullscreen');
        frame.allowFullscreen = true;
        if (opts.sandboxDrive) {
            // Sans « allow-downloads » ni « allow-modals » : le cadre ne peut ni
            // télécharger ni ouvrir la boîte d'impression.
            frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms');
        }
        frame.src = embed.src;
        return frame;
    }

    loadPdfJs() {
        const existing = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (existing) return Promise.resolve(existing);
        if (this.pdfjsPromise) return this.pdfjsPromise;

        const opts = CONFIG_SITE.lectureSeule || {};
        this.pdfjsPromise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = opts.pdfjs;
            s.async = true;
            s.onload = () => {
                const lib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
                if (!lib) { reject(new Error('PDF.js introuvable')); return; }
                lib.GlobalWorkerOptions.workerSrc = opts.pdfjsWorker;
                resolve(lib);
            };
            s.onerror = () => {
                this.pdfjsPromise = null;
                reject(new Error('PDF.js indisponible'));
            };
            document.head.appendChild(s);
        });
        return this.pdfjsPromise;
    }

    async renderLocalPdf(href, corps, token) {
        const statut = document.createElement('p');
        statut.className = 'pdf-lecteur-statut';
        statut.textContent = 'Chargement du document…';
        corps.appendChild(statut);

        try {
            const lib = await this.loadPdfJs();
            const doc = await lib.getDocument({ url: new URL(href, window.location.href).href }).promise;
            if (token !== this.readerToken) { doc.destroy(); return; }
            this.readerDoc = doc;
            statut.remove();

            const largeur = Math.max(280, Math.min((corps.clientWidth || 800) - 24, 1000));
            const ratio = Math.min(window.devicePixelRatio || 1, 2);

            for (let n = 1; n <= doc.numPages; n++) {
                if (token !== this.readerToken) return;
                const page = await doc.getPage(n);
                const base = page.getViewport({ scale: 1 });
                const viewport = page.getViewport({ scale: (largeur / base.width) * ratio });

                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-lecteur-page';
                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);
                canvas.style.width = `${Math.floor(viewport.width / ratio)}px`;
                canvas.setAttribute('role', 'img');
                canvas.setAttribute('aria-label', `Page ${n} sur ${doc.numPages}`);
                corps.appendChild(canvas);

                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                page.cleanup();
            }
        } catch (error) {
            if (token !== this.readerToken) return;
            console.error('❌ Affichage PDF impossible :', error);
            statut.textContent = "Impossible d'afficher ce document (accès refusé ou fichier introuvable).";
            if (!statut.isConnected) corps.appendChild(statut);
        }
    }

    showReader() {
        const r = this.reader;
        if (!this.isReaderOpen()) this.readerReturnFocus = document.activeElement;
        r.root.hidden = false;
        document.body.classList.add('pdf-lecteur-ouvert');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => r.root.classList.add('show'));
        r.fermer.focus();
    }

    closeReader() {
        const r = this.reader;
        if (!r || r.root.hidden) return;
        this.readerToken++;                 // interrompt un rendu en cours
        r.root.classList.remove('show');
        r.root.hidden = true;
        r.corps.replaceChildren();          // retire le cadre ou les pages
        if (this.readerDoc) {
            this.readerDoc.destroy();
            this.readerDoc = null;
        }
        document.body.classList.remove('pdf-lecteur-ouvert');
        document.body.style.overflow = '';
        if (this.readerReturnFocus && typeof this.readerReturnFocus.focus === 'function') {
            this.readerReturnFocus.focus();
        }
    }

    isReaderOpen() {
        return !!(this.reader && !this.reader.root.hidden);
    }

    /** Garde le focus clavier à l'intérieur de la visionneuse. */
    trapFocus(e) {
        const items = [...this.reader.root.querySelectorAll('a[href], button, iframe')]
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
    // 13. COMPTEUR DE VISITEURS LOCAL (secours sans serveur)
    // =====================================================================

    initVisitorCounter() {
        log('🔢 Initialisation du compteur de visiteurs (mode local)...');
        setTimeout(() => this.setupVisitorCounter(), 100);
    }

    setupVisitorCounter() {
        const storageKey = 'portfolioVisitorStats';
        const sessionKey = 'portfolioVisitSession';

        const totalEl = document.getElementById('total-visitors');
        const onlineEl = document.getElementById('current-visitors');

        if (!totalEl || !onlineEl) {
            console.warn('❌ Éléments du compteur non trouvés');
            return;
        }

        const stats = this.getVisitorStats(storageKey);
        this.handleNewVisit(stats, sessionKey);
        this.saveVisitorStats(storageKey, stats);
        this.displayVisitorCounters(stats, totalEl, onlineEl);
        this.startVisitorCounterUpdates(storageKey);

        [totalEl, onlineEl].forEach(el => { el.title = 'Compteur local (serveur de statistiques indisponible)'; });
        log('✅ Compteur de visiteurs initialisé');
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
        } catch (e) {
            console.error('❌ Erreur lecture stats visiteurs:', e);
        }

        return {
            total: 0,
            visits: [],
            firstVisit: new Date().toISOString()
        };
    }

    saveVisitorStats(storageKey, stats) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(stats));
        } catch (e) {
            console.error('❌ Erreur sauvegarde stats visiteurs:', e);
        }
    }

    handleNewVisit(stats, sessionKey) {
        let sessionId = null;
        try {
            sessionId = sessionStorage.getItem(sessionKey);
        } catch (e) { /* stockage indisponible (navigation privée stricte) */ }

        if (!sessionId) {
            const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
            try { sessionStorage.setItem(sessionKey, newSessionId); } catch (e) { /* ignoré */ }

            stats.total++;
            stats.visits.push({
                sessionId: newSessionId,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('fr-FR'),
                time: new Date().toLocaleTimeString('fr-FR')
            });

            if (stats.visits.length > 100) {
                stats.visits = stats.visits.slice(-100);
            }

            log('🆕 Nouvelle visite enregistrée — Total:', stats.total);
        }
    }

    displayVisitorCounters(stats, totalEl, onlineEl) {
        const onlineCount = this.calculateOnlineUsers(stats);
        this.animateCounter(totalEl, stats.total);
        this.animateCounter(onlineEl, onlineCount);
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

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(current + (target - current) * easeOut);

            element.textContent = this.formatNumber(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target);
            }
        };

        requestAnimationFrame(animate);
    }

    calculateOnlineUsers(stats) {
        const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);

        try {
            const activeSessions = stats.visits.filter(visit => new Date(visit.timestamp).getTime() > fifteenMinutesAgo);
            return Math.max(1, activeSessions.length);
        } catch (e) {
            console.error('❌ Erreur calcul utilisateurs en ligne:', e);
            return 1;
        }
    }

    startVisitorCounterUpdates(storageKey) {
        clearInterval(this.visitorInterval);
        this.visitorInterval = setInterval(() => {
            const stats = this.getVisitorStats(storageKey);
            const totalEl = document.getElementById('total-visitors');
            const onlineEl = document.getElementById('current-visitors');

            if (totalEl && onlineEl) {
                this.displayVisitorCounters(stats, totalEl, onlineEl);
            }
        }, 30000);
    }

    // =====================================================================
    // 14. DATE / HEURE
    // =====================================================================

    initDateTimeUpdater() {
        log('🕐 Initialisation date/heure...');
        this.startDateTimeUpdates();
    }

    startDateTimeUpdates() {
        const dateEl = document.getElementById('current-date');
        const timeEl = document.getElementById('current-time');
        timeEl?.setAttribute('aria-live', 'off');

        const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        let lastDate = '';

        const updateDateTime = () => {
            const now = new Date();
            const dateStr = this.capitalizeFirst(dateFormatter.format(now));
            const timeStr = timeFormatter.format(now);

            if (dateEl && dateStr !== lastDate) {
                dateEl.textContent = dateStr;
                dateEl.setAttribute('aria-label', `Date actuelle: ${dateStr}`);
                lastDate = dateStr;
            }
            if (timeEl) {
                timeEl.textContent = timeStr;
            }
        };

        updateDateTime();
        clearInterval(this.dateTimeInterval);
        this.dateTimeInterval = setInterval(updateDateTime, 1000);

        log('✅ Date/heure initialisée');
    }

    capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    }

    // =====================================================================
    // 15. THÈME SOMBRE / CLAIR
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
    // 16. IMAGES, PERFORMANCE, CLAVIER, ACCESSIBILITÉ
    // =====================================================================

    initImageLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    initPerformanceOptimizations() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                document.dispatchEvent(new CustomEvent('resizeEnd'));
            }, 250);
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
                this.closeMobileMenu(
                    document.querySelector('.nav-menu'),
                    document.querySelector('.nav-toggle')
                );
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
            ['fa-download', 'Télécharger'], ['fa-eye', 'Aperçu'], ['fa-external-link-alt', 'Ouvrir le lien externe'],
            ['fa-file-pdf', 'Lire le PDF'], ['fa-shopping-cart', 'Acheter'], ['fa-check-circle', 'Corrigé']
        ];
        document.querySelectorAll('a').forEach(link => {
            if (link.textContent.trim() || link.hasAttribute('aria-label')) return;
            const match = labels.find(([cls]) => link.querySelector(`i.${cls}`));
            if (!match) return;
            const context = link.closest('[class*="-item-compact"]')
                ?.querySelector('.pub-title, .chap-title, .ri-title, .these-title, .memoire-title, .livre-title, .conf-name');
            const contextText = context ? context.firstChild?.textContent?.trim() || context.textContent.trim() : '';
            link.setAttribute('aria-label', contextText ? `${match[1]} : ${contextText}` : match[1]);
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // =====================================================================
    // 17. UTILITAIRES
    // =====================================================================

    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =====================================================================
    // 18. NETTOYAGE
    // =====================================================================

    destroy() {
        if (this.dateTimeInterval) clearInterval(this.dateTimeInterval);
        if (this.visitorInterval) clearInterval(this.visitorInterval);
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.closeReader();
        this.isInitialized = false;
    }
}

// ===== INITIALISATION DE L'APPLICATION =====
log('🎯 Démarrage de l\'application portfolio...');
const portfolioApp = new PortfolioApp();

// ===== STYLES DYNAMIQUES =====
// Les styles sont dans style.css (sections 25 à 29 ; la 29 concerne la visionneuse).

// ===== GESTIONNAIRES D'ÉVÉNEMENTS GLOBAUX =====
// « pagehide » remplace « beforeunload », qui empêche le cache de retour arrière.
window.addEventListener('pagehide', () => {
    if (portfolioApp) portfolioApp.destroy();
});

log('🎉 Script portfolio chargé avec succès!');

// ===== FORCER LE SCROLL EN HAUT AU CHARGEMENT =====
(function ensureTopScroll() {
    'use strict';

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

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
        if (window.location.hash === '' || window.location.hash === '#') {
            scrollToTop();
        }
    });

    log('✅ Page forcée en haut au chargement');
})();

log('✅ Script portfolio entièrement chargé et prêt !');
