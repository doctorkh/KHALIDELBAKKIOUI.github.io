// ===== APPLICATION PORTFOLIO — SCRIPT COMPLET CORRIGÉ, ORGANISÉ ET DÉDUPLIQUÉ =====
// Toutes les fonctionnalités des versions précédentes ont été conservées.
// En cas de doublons, seule la version la plus complète/la plus récente a été gardée.
console.log('🚀 Chargement du script portfolio...');

class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.currentTheme = 'light';
        this.dateTimeInterval = null;
        this.visitorInterval = null;
        this.resizeTimeout = null;
        this.isInitialized = false;
        this.init();
    }

    // =====================================================================
    // 1. INITIALISATION GÉNÉRALE
    // =====================================================================

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ DOM chargé — Initialisation de l\'application');
                this.setupConsoleWelcome();
                this.setupErrorHandling();
                this.initializeAll();
            });
        } else {
            console.log('✅ DOM déjà chargé — Initialisation immédiate');
            this.setupConsoleWelcome();
            this.setupErrorHandling();
            this.initializeAll();
        }
    }

    initializeAll() {
        if (this.isInitialized) return;

        // Navigation & structure de page
        this.initNavigation();
        this.initSmoothScrolling();
        this.initBackToTop();
        this.initScrollEffects();
        this.initKeyboardNavigation();
        this.initAccessibility();

        // Contenu dynamique / onglets
        this.initTabs();
        this.initAllButtons();
        this.initResourceCards();
        this.initBooksSection();

        // Animations
        this.initHeroAnimations();
        this.initAnimations();
        this.initCounters();

        // Formulaire de contact
        this.initContactForm();

        // Widgets d'information
        this.initDateTimeUpdater();
        this.initVisitorCounter();

        // Fonctionnalités techniques
        this.initDownloadLinks();
        this.initThemeToggle();
        this.initImageLazyLoading();
        this.initPerformanceOptimizations();

        this.isInitialized = true;
        console.log('🎯 Application portfolio complètement initialisée');
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

        // Réinitialiser les événements (évite les doublons de listeners)
        const newNavToggle = navToggle.cloneNode(true);
        const newNavMenu = navMenu.cloneNode(true);
        navToggle.parentNode.replaceChild(newNavToggle, navToggle);
        navMenu.parentNode.replaceChild(newNavMenu, navMenu);

        newNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(newNavMenu, newNavToggle);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu(newNavMenu, newNavToggle);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu(newNavMenu, newNavToggle);
            }
        });

        newNavMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(newNavMenu, newNavToggle);
            }
        });

        if (navbar) {
            this.handleNavbarScroll(navbar);
            window.addEventListener('scroll', () => this.handleNavbarScroll(navbar), { passive: true });
        }

        console.log('✅ Navigation initialisée');
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('open');

        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';

        if (isOpening) {
            navToggle.setAttribute('aria-expanded', 'true');
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleNavbarScroll(navbar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');

            if (scrollTop > this.lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = scrollTop;
    }

    // =====================================================================
    // 3. SCROLL (ancrage fluide, retour en haut, scrollspy)
    // =====================================================================

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            const newAnchor = anchor.cloneNode(true);
            anchor.parentNode.replaceChild(newAnchor, anchor);

            newAnchor.addEventListener('click', (e) => {
                const targetId = newAnchor.getAttribute('href');
                if (!targetId || targetId === '#') return;

                e.preventDefault();
                this.scrollToElement(targetId);
            });
        });
    }

    scrollToElement(targetId) {
        const targetElement = document.querySelector(targetId);
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

            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
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

        if (!sections.length || !navLinks.length) return;

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
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // =====================================================================
    // 4. ANIMATIONS
    // =====================================================================

    initHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-contact, .hero-buttons');

        if (heroElements.length === 0) {
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
    }

    initAnimations() {
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
        if (!counterElement) return;

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
            const target = parseInt(counter.textContent) || 0;
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
        console.log('🔧 Initialisation du système d\'onglets universel...');

        const allTabContainers = document.querySelectorAll(
            '.research-tabs-compact, .documents-tabs-compact, .filiere-tabs'
        );

        if (allTabContainers.length === 0) {
            console.warn('⚠️ Aucun conteneur d\'onglets trouvé');
            return;
        }

        allTabContainers.forEach(container => this.initSingleTabSystem(container));

        console.log(`✅ ${allTabContainers.length} système(s) d'onglets initialisé(s)`);
    }

    initSingleTabSystem(container) {
        const tabButtons = container.querySelectorAll('.tab-button');

        if (tabButtons.length === 0) {
            console.warn('⚠️ Aucun bouton d\'onglet trouvé dans', container.className);
            return;
        }

        // Réinitialiser les événements en clonant les boutons
        tabButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const tabId = newButton.getAttribute('data-tab');
                const freshButtons = container.querySelectorAll('.tab-button');
                const freshPanes = container.querySelectorAll('.tab-pane');

                this.switchTab(container, newButton, freshButtons, freshPanes, tabId);
            });
        });

        // Si aucun onglet n'est actif, activer le premier
        const hasActive = container.querySelector('.tab-button.active');
        if (!hasActive) {
            const firstButton = container.querySelector('.tab-button');
            if (firstButton) {
                const tabId = firstButton.getAttribute('data-tab');
                const freshButtons = container.querySelectorAll('.tab-button');
                const freshPanes = container.querySelectorAll('.tab-pane');
                this.switchTab(container, firstButton, freshButtons, freshPanes, tabId);
            }
        }
    }

    switchTab(container, activeButton, tabButtons, tabPanes, tabId) {
        console.log('🎯 Activation de l\'onglet:', tabId);

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
            pane.style.display = 'none';
        });

        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');

        const targetPane = container.querySelector(`#${tabId}`);
        if (targetPane) {
            targetPane.classList.add('active');
            targetPane.setAttribute('aria-hidden', 'false');
            targetPane.style.display = 'block';
            console.log('✅ Onglet activé:', tabId);
        } else {
            console.error('❌ Panneau non trouvé pour l\'ID:', tabId);
        }
    }

    handleTabKeyboardNavigation(currentTab, direction) {
        const tabContainer = currentTab.closest(
            '.research-tabs-compact, .documents-tabs-compact, .filiere-tabs'
        );
        if (!tabContainer) return;

        const tabs = Array.from(tabContainer.querySelectorAll('.tab-button'));
        const currentIndex = tabs.indexOf(currentTab);
        let nextIndex;

        if (direction === 'next') {
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
        console.log('🔘 Initialisation de tous les boutons spécifiques...');

        this.initFiliereButtons();
        this.initConferenceButtons();
        this.initLivreButtons();
        this.initMemoireButtons();
        this.initGeneralButtons();

        console.log('✅ Tous les boutons initialisés');
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
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);

                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🎓 Bouton ${filiere} cliqué`);
                    this.handleFiliereClick(filiere);
                });
            });
        });

        console.log(`✅ ${filiereButtons.length} filières initialisées`);
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

        const targetId = `section-${filiere.toLowerCase()}`;
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            this.scrollToElement(`#${targetId}`);

            const filiereTabsContainer = document.querySelector('.filiere-tabs');
            if (filiereTabsContainer) {
                const targetButton = filiereTabsContainer.querySelector(`[data-tab="${targetId}"]`);
                if (targetButton) {
                    const tabButtons = filiereTabsContainer.querySelectorAll('.tab-button');
                    const tabPanes = filiereTabsContainer.querySelectorAll('.tab-pane');
                    this.switchTab(filiereTabsContainer, targetButton, tabButtons, tabPanes, targetId);
                }
            }
        } else {
            console.warn(`⚠️ Section non trouvée: ${targetId}`);
        }

        document.dispatchEvent(new CustomEvent('filiereSelected', { detail: { filiere } }));
    }

    initConferenceButtons() {
        const conferenceButtons = document.querySelectorAll('.btn-conference, [data-type="conference"]');
        conferenceButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎤 Bouton conférence cliqué');
                this.handleConferenceClick(newButton);
            });
        });
    }

    handleConferenceClick(button) {
        const conferenceTitle = button.getAttribute('data-title') || button.textContent || 'Conférence';
        this.showNotification(`Conférence: ${conferenceTitle}`, 'info', 3000);

        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    initLivreButtons() {
        const livreButtons = document.querySelectorAll('.btn-livre, [data-type="livre"]');
        livreButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 Bouton livre cliqué');
                this.handleLivreClick(newButton);
            });
        });
    }

    handleLivreClick(button) {
        const livreTitle = button.getAttribute('data-title') || button.textContent || 'Livre';
        this.showNotification(`Livre: ${livreTitle}`, 'info', 3000);

        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    initMemoireButtons() {
        const memoireButtons = document.querySelectorAll('.btn-memoire, [data-type="memoire"]');
        memoireButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📖 Bouton mémoire cliqué');
                this.handleMemoireClick(newButton);
            });
        });
    }

    handleMemoireClick(button) {
        const memoireTitle = button.getAttribute('data-title') || button.textContent || 'Mémoire';
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
        const viewButtons = document.querySelectorAll('.btn-view, .view-btn');
        viewButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                const target = newButton.getAttribute('data-target') || newButton.getAttribute('href');
                console.log(`👀 Vue demandée: ${target}`);
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
        const ressourceItems = document.querySelectorAll('.ressource-item-compact');
        if (!ressourceItems.length) return;

        ressourceItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.borderLeftColor = '#ff6b6b';
            });
            item.addEventListener('mouseleave', function () {
                this.style.borderLeftColor = '#6c63ff';
            });
        });
    }

    initBooksSection() {
        const covers = document.querySelectorAll('.livre-cover');

        covers.forEach(img => {
            img.addEventListener('error', function () {
                this.style.display = 'none';
            });

            if (!img.complete) {
                img.addEventListener('load', function () {
                    this.style.display = 'block';
                });
            } else if (img.naturalWidth === 0) {
                img.style.display = 'none';
            }
        });

        // Sécurité pour les liens externes des livres
        document.querySelectorAll('.livre-actions a').forEach(link => {
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // =====================================================================
    // 8. TÉLÉCHARGEMENTS
    // =====================================================================

    initDownloadLinks() {
        const downloadLinks = document.querySelectorAll('[download], .download-link');

        downloadLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', () => {
                const fileName = newLink.getAttribute('href')?.split('/').pop() || 'document';

                // Retour visuel
                const originalIcon = newLink.innerHTML;
                newLink.style.pointerEvents = 'none';
                const iconEl = newLink.querySelector('i');
                if (iconEl) iconEl.className = 'fas fa-spinner fa-spin';

                this.trackDownload(fileName);
                this.showNotification(`Téléchargement: ${fileName}`, 'info', 2000);

                setTimeout(() => {
                    newLink.innerHTML = originalIcon;
                    newLink.style.pointerEvents = 'auto';
                }, 1500);
            });
        });
    }

    trackDownload(fileName) {
        const downloadEvent = {
            event: 'download',
            file: fileName,
            timestamp: new Date().toISOString()
        };

        console.log('📥 Téléchargement:', downloadEvent);

        try {
            const downloads = JSON.parse(localStorage.getItem('portfolioDownloads') || '[]');
            downloads.push(downloadEvent);
            localStorage.setItem('portfolioDownloads', JSON.stringify(downloads.slice(-50)));
        } catch (e) {
            console.error('❌ Erreur suivi téléchargement:', e);
        }
    }

    // =====================================================================
    // 9. FORMULAIRE DE CONTACT
    // =====================================================================

    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);

            newInput.addEventListener('blur', () => this.validateField(newInput));
            newInput.addEventListener('input', () => this.clearFieldStatus(newInput));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (await this.validateForm(contactForm)) {
                await this.submitForm(contactForm);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
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
        const fields = form.querySelectorAll('input, textarea');
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

        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    showFieldSuccess(field) {
        this.clearFieldStatus(field);
        field.classList.add('success');
    }

    clearFieldStatus(field) {
        field.classList.remove('error', 'success');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }

    async submitForm(form) {
        const formData = new FormData(form);
        const data = {
            name: this.sanitizeInput(formData.get('name') || ''),
            email: this.sanitizeInput(formData.get('email') || ''),
            subject: this.sanitizeInput(formData.get('subject') || ''),
            message: this.sanitizeInput(formData.get('message') || '')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            await this.sendFormData(data);
            this.showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            form.querySelectorAll('input, textarea').forEach(field => this.clearFieldStatus(field));
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendFormData(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📧 Données du formulaire:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // =====================================================================
    // 10. NOTIFICATIONS
    // =====================================================================

    showNotification(message, type = 'info', duration = 5000) {
        // Supprimer les notifications en double
        document.querySelectorAll('.notification').forEach(notification => {
            if (notification.textContent.includes(message)) {
                this.removeNotification(notification);
            }
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

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
    // 11. COMPTEUR DE VISITEURS
    // =====================================================================

    initVisitorCounter() {
        console.log('🔢 Initialisation du compteur de visiteurs...');
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

        console.log('✅ Compteur de visiteurs initialisé');
    }

    getVisitorStats(storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const stats = JSON.parse(stored);
                const now = Date.now();
                const oneDayAgo = now - (24 * 60 * 60 * 1000);
                stats.visits = stats.visits.filter(visit => {
                    const visitTime = new Date(visit.timestamp).getTime();
                    return (now - visitTime) < oneDayAgo || (now - visitTime) < 0;
                });

                return {
                    total: parseInt(stats.total) || 15,
                    visits: Array.isArray(stats.visits) ? stats.visits : [],
                    firstVisit: stats.firstVisit || new Date().toISOString()
                };
            }
        } catch (e) {
            console.error('❌ Erreur lecture stats visiteurs:', e);
        }

        return {
            total: 15,
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
        const sessionId = sessionStorage.getItem(sessionKey);

        if (!sessionId) {
            const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(sessionKey, newSessionId);

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

            console.log('🆕 Nouvelle visite enregistrée — Total:', stats.total);
        }
    }

    displayVisitorCounters(stats, totalEl, onlineEl) {
        const onlineCount = this.calculateOnlineUsers(stats);
        this.animateCounter(totalEl, stats.total);
        this.animateCounter(onlineEl, onlineCount);
    }

    animateCounter(element, target) {
        if (!element) return;

        const current = parseInt(element.textContent) || 0;
        if (current === target) return;

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(current + (target - current) * easeOut);

            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }

    calculateOnlineUsers(stats) {
        const now = Date.now();
        const fifteenMinutesAgo = now - (15 * 60 * 1000);

        try {
            const activeSessions = stats.visits.filter(visit => {
                const visitTime = new Date(visit.timestamp).getTime();
                return visitTime > fifteenMinutesAgo;
            });

            return Math.max(1, activeSessions.length);
        } catch (e) {
            console.error('❌ Erreur calcul utilisateurs en ligne:', e);
            return 1;
        }
    }

    startVisitorCounterUpdates(storageKey) {
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
    // 12. DATE / HEURE
    // =====================================================================

    initDateTimeUpdater() {
        console.log('🕐 Initialisation date/heure...');
        this.startDateTimeUpdates();
    }

    startDateTimeUpdates() {
        const updateDateTime = () => {
            const now = new Date();

            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

            const dateStr = this.capitalizeFirst(now.toLocaleDateString('fr-FR', dateOptions));
            const timeStr = now.toLocaleTimeString('fr-FR', timeOptions);

            const dateEl = document.getElementById('current-date');
            const timeEl = document.getElementById('current-time');

            if (dateEl) {
                dateEl.textContent = dateStr;
                dateEl.setAttribute('aria-label', `Date actuelle: ${dateStr}`);
            }
            if (timeEl) {
                timeEl.textContent = timeStr;
                timeEl.setAttribute('aria-label', `Heure actuelle: ${timeStr}`);
            }
        };

        updateDateTime();
        this.dateTimeInterval = setInterval(updateDateTime, 1000);

        console.log('✅ Date/heure initialisée');
    }

    capitalizeFirst(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    // =====================================================================
    // 13. THÈME SOMBRE / CLAIR
    // =====================================================================

    initThemeToggle() {
        let themeToggle = document.querySelector('.theme-toggle');

        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Changer le thème';
            themeToggle.setAttribute('aria-label', 'Changer le thème');
            document.body.appendChild(themeToggle);
        }

        themeToggle.addEventListener('click', () => this.toggleTheme(themeToggle));

        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    toggleTheme(themeToggle) {
        const isDark = document.body.classList.toggle('dark-mode');

        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');

        this.showNotification(`Mode ${isDark ? 'sombre' : 'clair'} activé`, 'info', 2000);
    }

    // =====================================================================
    // 14. IMAGES, PERFORMANCE, CLAVIER, ACCESSIBILITÉ
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
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(
                    document.querySelector('.nav-menu'),
                    document.querySelector('.nav-toggle')
                );
            }

            if (e.key === 'Tab') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('tab-button')) {
                    e.preventDefault();
                    this.handleTabKeyboardNavigation(activeElement, e.shiftKey ? 'previous' : 'next');
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

            if (pane) {
                button.setAttribute('aria-controls', tabId);
                pane.setAttribute('aria-labelledby', button.id || `tab-${index}`);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // =====================================================================
    // 15. UTILITAIRES
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
    // 16. NETTOYAGE
    // =====================================================================

    destroy() {
        if (this.dateTimeInterval) clearInterval(this.dateTimeInterval);
        if (this.visitorInterval) clearInterval(this.visitorInterval);
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.isInitialized = false;
    }
}

// ===== INITIALISATION DE L'APPLICATION =====
console.log('🎯 Démarrage de l\'application portfolio...');
const portfolioApp = new PortfolioApp();

// ===== STYLES DYNAMIQUES =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Animations de base */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* Classes d'animation */
    .pre-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Notifications */
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2c3e50, #34495e);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification-success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
    .notification-error   { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    .notification-warning { background: linear-gradient(135deg, #f39c12, #e67e22); }
    .notification-info    { background: linear-gradient(135deg, #3498db, #2980b9); }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .notification-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.1);
    }

    /* Validation de formulaire */
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }

    .form-group input.success,
    .form-group textarea.success {
        border-color: #27ae60 !important;
        box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1) !important;
    }

    .field-error {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: fadeInUp 0.3s ease;
    }

    /* Accessibilité */
    .keyboard-navigation *:focus {
        outline: 2px solid #3498db !important;
        outline-offset: 2px !important;
    }

    /* Mode sombre */
    .dark-mode {
        --primary-color: #3b82f6;
        --secondary-color: #8b5cf6;
        --text-color: #e2e8f0;
        --bg-light: #1e293b;
        background: #0f172a;
        color: #e2e8f0;
    }

    .dark-mode .section.bg-light { background: #1e293b !important; }

    .dark-mode .carte-niveau,
    .dark-mode .carte-document,
    .dark-mode .pub-item-compact,
    .dark-mode .conf-item-compact,
    .dark-mode .ressource-item-compact {
        background: #1e293b;
        border-color: #334155;
        color: #e2e8f0;
    }

    /* Onglets */
    .tab-pane {
        display: none !important;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .tab-pane.active {
        display: block !important;
        opacity: 1;
        animation: fadeIn 0.5s ease;
    }

    /* Optimisation des performances */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(dynamicStyles);

// ===== GESTIONNAIRES D'ÉVÉNEMENTS GLOBAUX =====
window.addEventListener('beforeunload', () => {
    if (portfolioApp) portfolioApp.destroy();
});

console.log('🎉 Script portfolio chargé avec succès!');

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
        history.replaceState(null, null, ' ');
        setTimeout(scrollToTop, 50);
    }

    window.addEventListener('hashchange', function () {
        if (window.location.hash === '' || window.location.hash === '#') {
            scrollToTop();
        }
    });

    console.log('✅ Page forcée en haut au chargement');
})();

console.log('✅ Script portfolio entièrement chargé et prêt !');
