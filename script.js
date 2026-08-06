/*
 * ============================================================================
 * Portfolio Dr. Khalid EL BAKKIOUI — script.js
 * Version consolidée, corrigée, organisée et renforcée
 *
 * Fonctionnalités conservées :
 * - navigation mobile + navbar au scroll
 * - défilement doux + retour en haut + activation du lien courant
 * - onglets recherche/documents/expérience/filières
 * - navigation clavier et accessibilité
 * - animations Hero / sections / compteurs
 * - formulaire de contact et validation
 * - notifications
 * - date/heure en temps réel
 * - compteur de visiteurs local (simulation côté navigateur)
 * - thème clair/sombre
 * - suivi des téléchargements
 * - lazy-loading des images
 * - ressources compactes : feedback, aperçu, sections pliables, recherche API
 * - gestion des livres et images manquantes
 * - optimisation mobile et gestion des erreurs
 * - styles dynamiques nécessaires au fonctionnement
 *
 * IMPORTANT : le compteur de visiteurs et l'envoi du formulaire restent
 * locaux/simulés tant qu'un backend/API réel n'est pas configuré.
 * ============================================================================
 */

'use strict';

(() => {
    const SELECTORS = {
        navToggle: '.nav-toggle, #nav-toggle',
        navMenu: '.nav-menu, #nav-menu',
        navbar: '#navbar',
        tabs: '.research-tabs-compact, .documents-tabs-compact, .experience-tabs, .filiere-tabs',
        tabButton: '.tab-button',
        tabPane: '.tab-pane'
    };

    const STORAGE = {
        theme: 'portfolio-theme',
        visitorStats: 'portfolioVisitorStats',
        visitSession: 'portfolioVisitSession',
        downloads: 'portfolioDownloads',
        sectionState: 'sectionState'
    };

    const prefersReducedMotion = () =>
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    class PortfolioApp {
        constructor() {
            this.isInitialized = false;
            this.lastScrollTop = 0;
            this.currentTheme = 'light';
            this.dateTimeInterval = null;
            this.visitorInterval = null;
            this.boundHandlers = [];
            this.init();
        }

        init() {
            const start = () => {
                this.setupConsoleWelcome();
                this.setupErrorHandling();
                this.initializeAll();
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', start, { once: true });
            } else {
                start();
            }
        }

        initializeAll() {
            if (this.isInitialized) return;

            this.injectDynamicStyles();
            this.initNavigation();
            this.initTabs();
            this.initSmoothScrolling();
            this.initBackToTop();
            this.initScrollEffects();
            this.initAnimations();
            this.initHeroAnimations();
            this.initContactForm();
            this.initCounters();
            this.initDownloadTracking();
            this.initThemeToggle();
            this.initDateTimeUpdater();
            this.initVisitorCounter();
            this.initImageLazyLoading();
            this.initKeyboardNavigation();
            this.initAccessibility();
            this.initAllButtons();
            this.initResourceFeatures();
            this.initBookFeatures();
            this.optimizeForMobile();
            this.checkRequiredElements();
            this.ensureTopScroll();

            this.isInitialized = true;
            console.log('🎯 Application portfolio complètement initialisée');
        }

        // ====================================================================
        // CONFIGURATION / ERREURS
        // ====================================================================

        setupConsoleWelcome() {
            if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) return;

            const styles = [
                'background: linear-gradient(135deg, #667eea, #764ba2)',
                'color: white',
                'padding: 12px 24px',
                'border-radius: 8px',
                'font-size: 16px',
                'font-weight: bold'
            ].join(';');

            console.log('%c🎓 Portfolio Dr. Khalid EL BAKKIOUI', styles);
            console.log(
                '%cMathématicien • Enseignant CPGE • Chercheur en Probabilités',
                'font-weight:500'
            );
        }

        setupErrorHandling() {
            window.addEventListener('error', (event) => {
                console.error(
                    '❌ Erreur JavaScript:',
                    event.error || event.message
                );
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error(
                    '❌ Promise rejetée:',
                    event.reason
                );
            });
        }

        checkRequiredElements() {
            const required = ['navbar', 'accueil'];
            const missing = required.filter(
                id => !document.getElementById(id)
            );

            if (missing.length) {
                console.warn(
                    '⚠️ Éléments requis manquants:',
                    missing.join(', ')
                );
            }
        }

        // ====================================================================
        // NAVIGATION
        // ====================================================================

        initNavigation() {
            const navToggle = document.querySelector(SELECTORS.navToggle);
            const navMenu = document.querySelector(SELECTORS.navMenu);
            const navbar = document.querySelector(SELECTORS.navbar);

            if (!navToggle || !navMenu) {
                console.warn('⚠️ Éléments de navigation non trouvés');
                return;
            }

            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute(
                'aria-controls',
                navMenu.id || 'nav-menu'
            );

            this.on(navToggle, 'click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleMobileMenu(navMenu, navToggle);
            });

            navMenu.querySelectorAll('a').forEach(link => {
                this.on(link, 'click', () =>
                    this.closeMobileMenu(navMenu, navToggle)
                );
            });

            this.on(document, 'click', (event) => {
                if (
                    !navMenu.contains(event.target) &&
                    !navToggle.contains(event.target)
                ) {
                    this.closeMobileMenu(navMenu, navToggle);
                }
            });

            this.on(document, 'keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeMobileMenu(navMenu, navToggle);
                }
            });

            this.on(
                window,
                'resize',
                this.debounce(() => {
                    if (window.innerWidth > 768) {
                        this.closeMobileMenu(navMenu, navToggle);
                    }

                    this.optimizeForMobile();
                }, 150)
            );

            if (navbar) {
                this.handleNavbarScroll(navbar);

                this.on(
                    window,
                    'scroll',
                    () => this.handleNavbarScroll(navbar),
                    { passive: true }
                );
            }

            console.log('✅ Navigation initialisée');
        }

        toggleMobileMenu(navMenu, navToggle) {
            if (!navMenu || !navToggle) return;

            const opening = !navMenu.classList.contains('active');

            navMenu.classList.toggle('active', opening);
            navToggle.classList.toggle('active', opening);

            navToggle.setAttribute(
                'aria-expanded',
                String(opening)
            );

            document.body.style.overflow = opening ? 'hidden' : '';

            if (opening) {
                const firstLink = navMenu.querySelector('a');
                firstLink?.focus({ preventScroll: true });
            } else {
                navToggle.focus({ preventScroll: true });
            }
        }

        closeMobileMenu(navMenu, navToggle) {
            if (!navMenu || !navToggle) return;

            navMenu.classList.remove('active');
            navToggle.classList.remove('active');

            navToggle.setAttribute(
                'aria-expanded',
                'false'
            );

            document.body.style.overflow = '';
        }

        handleNavbarScroll(navbar) {
            if (!navbar) return;

            const scrollTop = Math.max(
                0,
                window.scrollY ||
                document.documentElement.scrollTop
            );

            const goingDown = scrollTop > this.lastScrollTop;

            navbar.classList.toggle(
                'scrolled',
                scrollTop > 50
            );

            navbar.classList.toggle(
                'hidden',
                goingDown && scrollTop > 120
            );

            navbar.style.transform = '';

            this.lastScrollTop = scrollTop;
        }

        // ====================================================================
        // ONGLETS
        // ====================================================================

        initTabs() {
            const containers = document.querySelectorAll(
                SELECTORS.tabs
            );

            containers.forEach(container =>
                this.initTabSystem(container)
            );

            if (containers.length) {
                console.log(
                    `✅ ${containers.length} système(s) d'onglets initialisé(s)`
                );
            }
        }

        initTabSystem(container) {
            const buttons = Array.from(
                container.querySelectorAll(SELECTORS.tabButton)
            );

            const panes = Array.from(
                container.querySelectorAll(SELECTORS.tabPane)
            );

            if (!buttons.length) return;

            buttons.forEach((button, index) => {
                const tabId = button.dataset.tab;

                if (!tabId) return;

                button.setAttribute('role', 'tab');
                button.setAttribute('aria-selected', 'false');
                button.setAttribute('tabindex', '-1');
                button.setAttribute('aria-controls', tabId);

                if (!button.id) {
                    button.id = `tab-${tabId}-${index}`;
                }

                const pane = this.getElementByIdSafe(tabId);

                if (pane) {
                    pane.setAttribute('role', 'tabpanel');
                    pane.setAttribute(
                        'aria-labelledby',
                        button.id
                    );
                    pane.setAttribute('aria-hidden', 'true');
                }

                this.on(button, 'click', (event) => {
                    event.preventDefault();

                    this.switchTab(
                        container,
                        button,
                        tabId
                    );
                });

                this.on(button, 'keydown', (event) => {
                    const keys = [
                        'ArrowRight',
                        'ArrowDown',
                        'ArrowLeft',
                        'ArrowUp',
                        'Home',
                        'End',
                        'Enter',
                        ' '
                    ];

                    if (!keys.includes(event.key)) return;

                    event.preventDefault();

                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {
                        this.switchTab(
                            container,
                            button,
                            tabId
                        );

                        return;
                    }

                    const current = buttons.indexOf(button);
                    let next = current;

                    if (
                        event.key === 'ArrowRight' ||
                        event.key === 'ArrowDown'
                    ) {
                        next =
                            (current + 1) %
                            buttons.length;
                    }

                    if (
                        event.key === 'ArrowLeft' ||
                        event.key === 'ArrowUp'
                    ) {
                        next =
                            (current - 1 + buttons.length) %
                            buttons.length;
                    }

                    if (event.key === 'Home') next = 0;
                    if (event.key === 'End') {
                        next = buttons.length - 1;
                    }

                    buttons[next].focus();

                    this.switchTab(
                        container,
                        buttons[next],
                        buttons[next].dataset.tab
                    );
                });
            });

            const active =
                buttons.find(button =>
                    button.classList.contains('active')
                ) || buttons[0];

            this.switchTab(
                container,
                active,
                active.dataset.tab,
                false
            );
        }

        switchTab(
            container,
            activeButton,
            tabId,
            focus = false
        ) {
            if (
                !container ||
                !activeButton ||
                !tabId
            ) {
                return;
            }

            const buttons = Array.from(
                container.querySelectorAll(
                    SELECTORS.tabButton
                )
            );

            const panes = Array.from(
                container.querySelectorAll(
                    SELECTORS.tabPane
                )
            );

            const targetPane =
                this.getElementByIdSafe(tabId);

            buttons.forEach(button => {
                const active =
                    button === activeButton;

                button.classList.toggle(
                    'active',
                    active
                );

                button.setAttribute(
                    'aria-selected',
                    String(active)
                );

                button.setAttribute(
                    'tabindex',
                    active ? '0' : '-1'
                );
            });

            panes.forEach(pane => {
                const active =
                    pane === targetPane;

                pane.classList.toggle(
                    'active',
                    active
                );

                pane.setAttribute(
                    'aria-hidden',
                    String(!active)
                );
            });

            if (focus) {
                activeButton.focus();
            }

            if (!targetPane) {
                console.warn(
                    `⚠️ Panneau d'onglet introuvable: ${tabId}`
                );
            }
        }

        // ====================================================================
        // SCROLL / RETOUR EN HAUT / SECTIONS
        // ====================================================================

        initSmoothScrolling() {
            document
                .querySelectorAll('a[href^="#"]')
                .forEach(anchor => {
                    this.on(anchor, 'click', (event) => {
                        const href =
                            anchor.getAttribute('href');

                        if (!href || href === '#') return;

                        const target =
                            this.getElementByIdSafe(
                                href.slice(1)
                            );

                        if (!target) return;

                        event.preventDefault();

                        this.scrollToElement(target);
                    });
                });
        }

        scrollToElement(target) {
            if (typeof target === 'string') {
                target =
                    target.startsWith('#')
                        ? this.getElementByIdSafe(
                            target.slice(1)
                        )
                        : document.querySelector(target);
            }

            if (!target) return;

            const navbar =
                document.querySelector(
                    SELECTORS.navbar
                );

            const offset =
                (navbar?.offsetHeight || 80) + 8;

            const top = Math.max(
                0,
                target.getBoundingClientRect().top +
                window.scrollY -
                offset
            );

            window.scrollTo({
                top,
                behavior: prefersReducedMotion()
                    ? 'auto'
                    : 'smooth'
            });

            this.closeMobileMenu(
                document.querySelector(
                    SELECTORS.navMenu
                ),
                document.querySelector(
                    SELECTORS.navToggle
                )
            );
        }

        initBackToTop() {
            const button =
                document.getElementById('backToTop');

            if (!button) return;

            const update = () => {
                const visible =
                    window.scrollY > 300;

                button.classList.toggle(
                    'visible',
                    visible
                );

                button.setAttribute(
                    'aria-hidden',
                    String(!visible)
                );
            };

            this.on(button, 'click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion()
                        ? 'auto'
                        : 'smooth'
                });
            });

            this.on(
                window,
                'scroll',
                update,
                { passive: true }
            );

            update();
        }

        initScrollEffects() {
            const sections =
                Array.from(
                    document.querySelectorAll(
                        'section[id]'
                    )
                );

            const links =
                Array.from(
                    document.querySelectorAll(
                        '.nav-menu a[href^="#"], .nav-link[href^="#"]'
                    )
                );

            if (
                !sections.length ||
                !links.length ||
                !('IntersectionObserver' in window)
            ) {
                return;
            }

            const observer =
                new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                this.setActiveNavLink(
                                    entry.target.id,
                                    links
                                );
                            }
                        });
                    },
                    {
                        threshold: 0.25,
                        rootMargin:
                            '-20% 0px -55% 0px'
                    }
                );

            sections.forEach(section =>
                observer.observe(section)
            );
        }

        setActiveNavLink(id, links) {
            links.forEach(link =>
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${id}`
                )
            );
        }

        ensureTopScroll() {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }

            const scrollTop = () =>
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'auto'
                });

            scrollTop();

            window.addEventListener(
                'load',
                () => {
                    if (!window.location.hash) {
                        scrollTop();
                    }
                },
                { once: true }
            );
        }

        // ====================================================================
        // ANIMATIONS
        // ====================================================================

        initHeroAnimations() {
            const elements =
                document.querySelectorAll(
                    '.hero-badge, .hero-title, .hero-subtitle, .hero-contact, .hero-buttons'
                );

            if (
                !elements.length ||
                !('IntersectionObserver' in window)
            ) {
                return;
            }

            if (prefersReducedMotion()) {
                elements.forEach(el => {
                    el.style.opacity = '1';
                });

                return;
            }

            const observer =
                new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.style.animation =
                                    'fadeInUp 0.8s ease-out both';

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        });
                    },
                    { threshold: 0.2 }
                );

            elements.forEach((el, index) => {
                el.style.animationDelay =
                    `${index * 0.15}s`;

                el.style.opacity = '0';

                observer.observe(el);
            });
        }

        initAnimations() {
            const elements =
                document.querySelectorAll(
                    '.profile-card, .pub-card, .doc-card, .exp-card, .competence-category, .timeline-item, .stat, .ressource-item, .ressource-item-compact, .contact-item, .conf-card'
                );

            if (
                !elements.length ||
                !('IntersectionObserver' in window)
            ) {
                return;
            }

            if (prefersReducedMotion()) return;

            const observer =
                new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add(
                                    'animate-in'
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        });
                    },
                    {
                        threshold: 0.1,
                        rootMargin:
                            '0px 0px -50px 0px'
                    }
                );

            elements.forEach(el => {
                el.classList.add(
                    'pre-animate'
                );

                observer.observe(el);
            });
        }

        initCounters() {
            const container =
                document.querySelector('.hero-stats');

            if (!container) return;

            if (
                !('IntersectionObserver' in window)
            ) {
                this.animateCounters();
                return;
            }

            const observer =
                new IntersectionObserver(
                    entries => {
                        if (
                            entries.some(
                                entry =>
                                    entry.isIntersecting
                            )
                        ) {
                            this.animateCounters();
                            observer.disconnect();
                        }
                    },
                    { threshold: 0.2 }
                );

            observer.observe(container);
        }

        animateCounters() {
            document
                .querySelectorAll('.stat h3')
                .forEach(counter => {
                    if (
                        counter.dataset.animated ===
                        'true'
                    ) {
                        return;
                    }

                    const raw =
                        counter.textContent.trim();

                    const target =
                        parseInt(
                            raw.replace(
                                /[^0-9]/g,
                                ''
                            ),
                            10
                        );

                    if (!Number.isFinite(target)) {
                        return;
                    }

                    counter.dataset.animated =
                        'true';

                    if (prefersReducedMotion()) {
                        counter.textContent =
                            `${target}+`;

                        return;
                    }

                    const start =
                        performance.now();

                    const duration = 1600;

                    const frame = now => {
                        const progress =
                            Math.min(
                                (now - start) /
                                duration,
                                1
                            );

                        const eased =
                            1 -
                            Math.pow(
                                1 - progress,
                                3
                            );

                        counter.textContent =
                            `${Math.floor(
                                target * eased
                            )}+`;

                        if (progress < 1) {
                            requestAnimationFrame(
                                frame
                            );
                        }
                    };

                    requestAnimationFrame(frame);
                });
        }

        // ====================================================================
        // FORMULAIRE
        // ====================================================================

        initContactForm() {
            const form =
                document.getElementById(
                    'contactForm'
                );

            if (!form) return;

            form.querySelectorAll(
                'input, textarea, select'
            ).forEach(field => {
                this.on(
                    field,
                    'blur',
                    () => this.validateField(field)
                );

                this.on(
                    field,
                    'input',
                    () => this.clearFieldStatus(field)
                );
            });

            this.on(
                form,
                'submit',
                async event => {
                    event.preventDefault();

                    if (
                        await this.validateForm(
                            form
                        )
                    ) {
                        await this.submitForm(
                            form
                        );
                    }
                }
            );
        }

        validateField(field) {
            if (
                !field ||
                field.disabled ||
                field.type === 'hidden'
            ) {
                return true;
            }

            const value =
                String(field.value || '').trim();

            const required =
                field.required ||
                ['name', 'email', 'message'].includes(
                    field.name
                );

            let message = '';

            if (required && !value) {
                message =
                    'Ce champ est requis';
            } else if (
                field.type === 'email' &&
                value &&
                !this.isValidEmail(value)
            ) {
                message =
                    'Email invalide';
            } else if (
                (field.name || '')
                    .toLowerCase()
                    .includes('name') &&
                value &&
                value.length < 2
            ) {
                message =
                    'Minimum 2 caractères';
            } else if (
                field.tagName.toLowerCase() ===
                    'textarea' &&
                value &&
                value.length < 10
            ) {
                message =
                    'Minimum 10 caractères';
            }

            if (message) {
                this.showFieldError(
                    field,
                    message
                );
            } else if (value) {
                this.showFieldSuccess(field);
            } else {
                this.clearFieldStatus(field);
            }

            return !message;
        }

        async validateForm(form) {
            let valid = true;

            form.querySelectorAll(
                'input, textarea, select'
            ).forEach(field => {
                if (!this.validateField(field)) {
                    valid = false;
                }
            });

            if (!valid) {
                this.showNotification(
                    'Veuillez corriger les champs indiqués.',
                    'warning'
                );
            }

            return valid;
        }

        showFieldError(field, message) {
            this.clearFieldStatus(field);

            field.classList.add('error');

            field.setAttribute(
                'aria-invalid',
                'true'
            );

            const error =
                document.createElement('div');

            error.className =
                'field-error';

            error.textContent =
                message;

            error.id =
                `${field.id || field.name || 'field'}-error`;

            field.setAttribute(
                'aria-describedby',
                error.id
            );

            field.parentElement?.appendChild(
                error
            );
        }

        showFieldSuccess(field) {
            this.clearFieldStatus(field);

            field.classList.add('success');

            field.setAttribute(
                'aria-invalid',
                'false'
            );
        }

        clearFieldStatus(field) {
            field.classList.remove(
                'error',
                'success'
            );

            field.removeAttribute(
                'aria-invalid'
            );

            const parent =
                field.parentElement;

            parent
                ?.querySelectorAll(
                    '.field-error'
                )
                .forEach(error =>
                    error.remove()
                );
        }

        async submitForm(form) {
            const formData =
                new FormData(form);

            const data =
                Object.fromEntries(
                    formData.entries()
                );

            Object.keys(data).forEach(
                key => {
                    data[key] =
                        this.sanitizeInput(
                            String(
                                data[key] ?? ''
                            )
                        );
                }
            );

            const button =
                form.querySelector(
                    'button[type="submit"], input[type="submit"]'
                );

            const original =
                button?.innerHTML;

            if (button) {
                button.disabled = true;

                if (
                    button.tagName ===
                    'BUTTON'
                ) {
                    button.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i> Envoi…';
                }
            }

            try {
                await this.sendFormData(
                    data,
                    form
                );

                this.showNotification(
                    'Message envoyé avec succès !',
                    'success'
                );

                form.reset();

                form.querySelectorAll(
                    'input, textarea, select'
                ).forEach(field =>
                    this.clearFieldStatus(
                        field
                    )
                );
            } catch (error) {
                console.error(
                    'Erreur formulaire:',
                    error
                );

                this.showNotification(
                    'Erreur lors de l’envoi du message.',
                    'error'
                );
            } finally {
                if (button) {
                    button.disabled = false;

                    if (
                        button.tagName ===
                        'BUTTON'
                    ) {
                        button.innerHTML =
                            original;
                    }
                }
            }
        }

        async sendFormData(data, form) {
            const endpoint =
                form?.dataset?.endpoint ||
                form?.getAttribute('action');

            if (
                endpoint &&
                endpoint !== '#' &&
                !endpoint.startsWith(
                    'mailto:'
                )
            ) {
                const response =
                    await fetch(
                        endpoint,
                        {
                            method:
                                form.method?.toUpperCase() ||
                                'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                'Accept':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    data
                                )
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }

                return response
                    .json()
                    .catch(() => ({}));
            }

            // Comportement d'origine :
            // simulation locale si aucun backend n'est configuré.
            console.log(
                '📨 Données du formulaire (simulation locale):',
                data
            );

            await new Promise(
                resolve =>
                    setTimeout(resolve, 600)
            );

            return {
                success: true,
                simulated: true
            };
        }

        // ====================================================================
        // NOTIFICATIONS
        // ====================================================================

        showNotification(
            message,
            type = 'info',
            duration = 5000
        ) {
            if (!document.body) return null;

            const safeType =
                [
                    'success',
                    'error',
                    'warning',
                    'info'
                ].includes(type)
                    ? type
                    : 'info';

            document
                .querySelectorAll(
                    '.notification'
                )
                .forEach(existing => {
                    if (
                        existing.dataset.message ===
                        message
                    ) {
                        this.removeNotification(
                            existing
                        );
                    }
                });

            const notification =
                document.createElement('div');

            notification.className =
                `notification notification-${safeType}`;

            notification.dataset.message =
                message;

            notification.setAttribute(
                'role',
                'status'
            );

            notification.setAttribute(
                'aria-live',
                'polite'
            );

            const icons = {
                success:
                    'fa-check-circle',

                error:
                    'fa-exclamation-circle',

                info:
                    'fa-info-circle',

                warning:
                    'fa-exclamation-triangle'
            };

            const content =
                document.createElement('div');

            content.className =
                'notification-content';

            const icon =
                document.createElement('i');

            icon.className =
                `fas ${icons[safeType]}`;

            const text =
                document.createElement('span');

            text.textContent =
                message;

            content.append(
                icon,
                text
            );

            const close =
                document.createElement('button');

            close.type = 'button';

            close.className =
                'notification-close';

            close.setAttribute(
                'aria-label',
                'Fermer'
            );

            close.innerHTML =
                '<i class="fas fa-times"></i>';

            close.addEventListener(
                'click',
                () =>
                    this.removeNotification(
                        notification
                    )
            );

            notification.append(
                content,
                close
            );

            document.body.appendChild(
                notification
            );

            requestAnimationFrame(
                () =>
                    notification.classList.add(
                        'show'
                    )
            );

            if (duration > 0) {
                setTimeout(
                    () =>
                        this.removeNotification(
                            notification
                        ),
                    duration
                );
            }

            return notification;
        }

        removeNotification(notification) {
            if (
                !notification?.isConnected
            ) {
                return;
            }

            notification.classList.remove(
                'show'
            );

            setTimeout(
                () => notification.remove(),
                prefersReducedMotion()
                    ? 0
                    : 300
            );
        }

        // ====================================================================
        // DATE / HEURE
        // ====================================================================

        initDateTimeUpdater() {
            this.startDateTimeUpdates();
        }

        startDateTimeUpdates() {
            if (this.dateTimeInterval) {
                clearInterval(
                    this.dateTimeInterval
                );
            }

            const update = () => {
                const now =
                    new Date();

                const date =
                    this.capitalizeFirst(
                        now.toLocaleDateString(
                            'fr-FR',
                            {
                                weekday:
                                    'long',
                                year:
                                    'numeric',
                                month:
                                    'long',
                                day:
                                    'numeric'
                            }
                        )
                    );

                const time =
                    now.toLocaleTimeString(
                        'fr-FR',
                        {
                            hour:
                                '2-digit',
                            minute:
                                '2-digit',
                            second:
                                '2-digit',
                            hour12:
                                false
                        }
                    );

                const dateEl =
                    document.getElementById(
                        'current-date'
                    );

                const timeEl =
                    document.getElementById(
                        'current-time'
                    );

                if (dateEl) {
                    dateEl.textContent =
                        date;

                    dateEl.setAttribute(
                        'aria-label',
                        `Date actuelle : ${date}`
                    );
                }

                if (timeEl) {
                    timeEl.textContent =
                        time;

                    timeEl.setAttribute(
                        'aria-label',
                        `Heure actuelle : ${time}`
                    );
                }
            };

            update();

            this.dateTimeInterval =
                setInterval(
                    update,
                    1000
                );
        }

        // ====================================================================
        // COMPTEUR VISITEURS — LOCAL / SIMULATION
        // ====================================================================

        initVisitorCounter() {
            const totalEl =
                document.getElementById(
                    'total-visitors'
                );

            const onlineEl =
                document.getElementById(
                    'current-visitors'
                );

            if (!totalEl || !onlineEl) {
                return;
            }

            const stats =
                this.getVisitorStats();

            this.handleNewVisit(stats);

            this.saveVisitorStats(stats);

            this.displayVisitorCounters(
                stats,
                totalEl,
                onlineEl
            );

            if (this.visitorInterval) {
                clearInterval(
                    this.visitorInterval
                );
            }

            this.visitorInterval =
                setInterval(
                    () => {
                        const fresh =
                            this.getVisitorStats();

                        this.displayVisitorCounters(
                            fresh,
                            totalEl,
                            onlineEl
                        );
                    },
                    30000
                );

            window.visitorCounter = {
                get totalVisitors() {
                    return Number(
                        localStorage.getItem(
                            STORAGE.visitorStats
                        )
                            ? JSON.parse(
                                localStorage.getItem(
                                    STORAGE.visitorStats
                                )
                            ).total
                            : 0
                    );
                },

                get currentVisitors() {
                    return (
                        document.getElementById(
                            'current-visitors'
                        )?.textContent ||
                        '0'
                    );
                }
            };
        }

        getVisitorStats() {
            const fallback = {
                total: 15,
                visits: [],
                firstVisit:
                    new Date().toISOString()
            };

            try {
                const stored =
                    JSON.parse(
                        localStorage.getItem(
                            STORAGE.visitorStats
                        ) || 'null'
                    );

                if (
                    !stored ||
                    typeof stored !==
                        'object'
                ) {
                    return fallback;
                }

                const visits =
                    Array.isArray(
                        stored.visits
                    )
                        ? stored.visits
                        : [];

                const cutoff =
                    Date.now() -
                    24 * 60 * 60 * 1000;

                return {
                    total:
                        Number.isFinite(
                            Number(
                                stored.total
                            )
                        )
                            ? Math.max(
                                0,
                                Number(
                                    stored.total
                                )
                            )
                            : fallback.total,

                    visits:
                        visits
                            .filter(v => {
                                const time =
                                    Date.parse(
                                        v?.timestamp ||
                                        ''
                                    );

                                return (
                                    Number.isFinite(
                                        time
                                    ) &&
                                    time >
                                        cutoff
                                );
                            })
                            .slice(-100),

                    firstVisit:
                        stored.firstVisit ||
                        fallback.firstVisit
                };
            } catch (error) {
                console.warn(
                    '⚠️ Lecture du compteur visiteurs impossible:',
                    error
                );

                return fallback;
            }
        }

        saveVisitorStats(stats) {
            try {
                localStorage.setItem(
                    STORAGE.visitorStats,
                    JSON.stringify(stats)
                );
            } catch (error) {
                console.warn(
                    '⚠️ Sauvegarde visiteurs impossible:',
                    error
                );
            }
        }

        handleNewVisit(stats) {
            try {
                if (
                    sessionStorage.getItem(
                        STORAGE.visitSession
                    )
                ) {
                    return;
                }

                const sessionId =
                    `sess_${Date.now()}_${Math.random()
                        .toString(36)
                        .slice(2, 11)}`;

                sessionStorage.setItem(
                    STORAGE.visitSession,
                    sessionId
                );

                stats.total += 1;

                stats.visits.push({
                    sessionId,
                    timestamp:
                        new Date().toISOString()
                });

                stats.visits =
                    stats.visits.slice(-100);
            } catch (error) {
                console.warn(
                    '⚠️ Session visiteur indisponible:',
                    error
                );
            }
        }

        calculateOnlineUsers(stats) {
            const cutoff =
                Date.now() -
                15 * 60 * 1000;

            const active =
                stats.visits.filter(
                    v =>
                        Date.parse(
                            v.timestamp
                        ) > cutoff
                ).length;

            return Math.max(
                1,
                active
            );
        }

        displayVisitorCounters(
            stats,
            totalEl,
            onlineEl
        ) {
            this.animateCounter(
                totalEl,
                stats.total
            );

            this.animateCounter(
                onlineEl,
                this.calculateOnlineUsers(
                    stats
                )
            );
        }

        animateCounter(
            element,
            target
        ) {
            if (!element) return;

            const numericTarget =
                Number(target) || 0;

            const current =
                parseInt(
                    element.textContent.replace(
                        /[^0-9]/g,
                        ''
                    ),
                    10
                ) || 0;

            if (
                current === numericTarget ||
                prefersReducedMotion()
            ) {
                element.textContent =
                    String(numericTarget);

                return;
            }

            const start =
                performance.now();

            const duration = 700;

            const frame = now => {
                const progress =
                    Math.min(
                        (now - start) /
                            duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );

                element.textContent =
                    String(
                        Math.floor(
                            current +
                            (numericTarget -
                                current) *
                                eased
                        )
                    );

                if (progress < 1) {
                    requestAnimationFrame(
                        frame
                    );
                }
            };

            requestAnimationFrame(frame);
        }

        // ====================================================================
        // THÈME
        // ====================================================================

        initThemeToggle() {
            let toggle =
                document.querySelector(
                    '.theme-toggle'
                );

            if (!toggle) {
                toggle =
                    document.createElement(
                        'button'
                    );

                toggle.type =
                    'button';

                toggle.className =
                    'theme-toggle';

                toggle.title =
                    'Changer le thème';

                document.body.appendChild(
                    toggle
                );
            }

            toggle.setAttribute(
                'aria-label',
                'Changer le thème'
            );

            const saved =
                localStorage.getItem(
                    STORAGE.theme
                );

            const systemDark =
                window.matchMedia?.(
                    '(prefers-color-scheme: dark)'
                ).matches;

            this.applyTheme(
                saved ||
                    (systemDark
                        ? 'dark'
                        : 'light'),
                toggle,
                false
            );

            this.on(
                toggle,
                'click',
                () =>
                    this.toggleTheme(toggle)
            );
        }

        applyTheme(
            theme,
            toggle,
            notify = true
        ) {
            const dark =
                theme === 'dark';

            this.currentTheme =
                dark
                    ? 'dark'
                    : 'light';

            document.body.classList.toggle(
                'dark-mode',
                dark
            );

            if (toggle) {
                toggle.innerHTML =
                    `<i class="fas fa-${dark ? 'sun' : 'moon'}"></i>`;

                toggle.setAttribute(
                    'aria-pressed',
                    String(dark)
                );
            }

            localStorage.setItem(
                STORAGE.theme,
                this.currentTheme
            );

            if (notify) {
                this.showNotification(
                    `Mode ${dark ? 'sombre' : 'clair'} activé`,
                    'info',
                    2000
                );
            }
        }

        toggleTheme(toggle) {
            this.applyTheme(
                this.currentTheme === 'dark'
                    ? 'light'
                    : 'dark',
                toggle
            );
        }

        // ====================================================================
        // TÉLÉCHARGEMENTS / BOUTONS
        // ====================================================================

        initDownloadTracking() {
            document
                .querySelectorAll(
                    'a[download], .download-link'
                )
                .forEach(link => {
                    this.on(
                        link,
                        'click',
                        () => {
                            const fileName =
                                (
                                    link.getAttribute(
                                        'href'
                                    ) || ''
                                )
                                    .split('/')
                                    .pop() ||
                                'document';

                            this.trackDownload(
                                fileName
                            );
                        }
                    );
                });
        }

        trackDownload(fileName) {
            try {
                const downloads =
                    JSON.parse(
                        localStorage.getItem(
                            STORAGE.downloads
                        ) || '[]'
                    );

                downloads.push({
                    event:
                        'download',
                    file:
                        fileName,
                    timestamp:
                        new Date().toISOString()
                });

                localStorage.setItem(
                    STORAGE.downloads,
                    JSON.stringify(
                        downloads.slice(-50)
                    )
                );
            } catch (error) {
                console.warn(
                    '⚠️ Impossible d’enregistrer le téléchargement:',
                    error
                );
            }

            console.log(
                `📥 Téléchargement: ${fileName}`
            );
        }

        initAllButtons() {
            this.initFiliereButtons();
            this.initConferenceButtons();
            this.initLivreButtons();
            this.initMemoireButtons();
            this.initGeneralButtons();
        }

        initFiliereButtons() {
            [
                'ECT1',
                'ECT2',
                'ECS1',
                'ECS2',
                'MPSI'
            ].forEach(filiere => {
                document
                    .querySelectorAll(
                        `.btn-${filiere.toLowerCase()}, [data-filiere="${filiere}"]`
                    )
                    .forEach(button => {
                        this.on(
                            button,
                            'click',
                            event => {
                                event.preventDefault();

                                this.handleFiliereClick(
                                    filiere
                                );
                            }
                        );
                    });
            });
        }

        initConferenceButtons() {
            document
                .querySelectorAll(
                    '.btn-conference, [data-type="conference"], .conference-btn'
                )
                .forEach(button => {
                    this.on(
                        button,
                        'click',
                        event => {
                            event.preventDefault();

                            this.handleConferenceClick(
                                button
                            );
                        }
                    );
                });
        }

        initLivreButtons() {
            document
                .querySelectorAll(
                    '.btn-livre, [data-type="livre"], .livre-btn'
                )
                .forEach(button => {
                    this.on(
                        button,
                        'click',
                        event => {
                            event.preventDefault();

                            this.handleLivreClick(
                                button
                            );
                        }
                    );
                });
        }

        initMemoireButtons() {
            document
                .querySelectorAll(
                    '.btn-memoire, [data-type="memoire"], .memoire-btn'
                )
                .forEach(button => {
                    this.on(
                        button,
                        'click',
                        event => {
                            event.preventDefault();

                            this.handleMemoireClick(
                                button
                            );
                        }
                    );
                });
        }

        initGeneralButtons() {
            document
                .querySelectorAll(
                    '.btn-view, .view-btn'
                )
                .forEach(button => {
                    this.on(
                        button,
                        'click',
                        event => {
                            event.preventDefault();

                            this.handleViewClick(
                                button.dataset.target ||
                                button.getAttribute(
                                    'href'
                                )
                            );
                        }
                    );
                });
        }

        handleFiliereClick(filiere) {
            this.showNotification(
                `Filière ${filiere} sélectionnée`,
                'info',
                3000
            );

            const target =
                this.getElementByIdSafe(
                    `section-${filiere.toLowerCase()}`
                );

            if (target) {
                this.scrollToElement(
                    target
                );
            }

            document.dispatchEvent(
                new CustomEvent(
                    'filiereSelected',
                    {
                        detail: {
                            filiere
                        }
                    }
                )
            );
        }

        handleConferenceClick(button) {
            const title =
                button.dataset.title ||
                button.textContent.trim();

            this.showNotification(
                `Conférence: ${title}`,
                'info',
                3000
            );

            const target =
                this.getElementByIdSafe(
                    button.dataset.target ||
                    ''
                );

            if (target) {
                this.scrollToElement(
                    target
                );
            }
        }

        handleLivreClick(button) {
            const title =
                button.dataset.title ||
                button.textContent.trim();

            this.showNotification(
                `Livre: ${title}`,
                'info',
                3000
            );

            this.openExternal(
                button.getAttribute(
                    'href'
                )
            );
        }

        handleMemoireClick(button) {
            const title =
                button.dataset.title ||
                button.textContent.trim();

            this.showNotification(
                `Mémoire: ${title}`,
                'info',
                3000
            );

            const url =
                button.getAttribute(
                    'href'
                );

            if (!url) return;

            if (url.startsWith('#')) {
                this.scrollToElement(
                    url
                );
            } else {
                this.openExternal(
                    url
                );
            }
        }

        handleViewClick(target) {
            if (!target) return;

            if (target.startsWith('#')) {
                this.scrollToElement(
                    target
                );
            } else {
                this.openExternal(
                    target
                );
            }
        }

        openExternal(url) {
            if (!url || url === '#') {
                return;
            }

            const opened =
                window.open(
                    url,
                    '_blank',
                    'noopener,noreferrer'
                );

            if (opened) {
                opened.opener = null;
            }
        }

        // ====================================================================
        // IMAGES / PERFORMANCE / ACCESSIBILITÉ
        // ====================================================================

        initImageLazyLoading() {
            const images =
                document.querySelectorAll(
                    'img[data-src]'
                );

            if (!images.length) return;

            const load = img => {
                if (img.dataset.src) {
                    img.src =
                        img.dataset.src;
                }

                if (img.dataset.srcset) {
                    img.srcset =
                        img.dataset.srcset;
                }

                img.removeAttribute(
                    'data-src'
                );

                img.removeAttribute(
                    'data-srcset'
                );

                img.classList.remove(
                    'lazy'
                );
            };

            if (
                !('IntersectionObserver' in window)
            ) {
                images.forEach(load);
                return;
            }

            const observer =
                new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (
                                entry.isIntersecting
                            ) {
                                load(
                                    entry.target
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        });
                    },
                    {
                        rootMargin:
                            '200px'
                    }
                );

            images.forEach(img =>
                observer.observe(img)
            );
        }

        optimizeForMobile() {
            document.documentElement.classList.toggle(
                'is-mobile',
                window.innerWidth <= 768
            );
        }

        initKeyboardNavigation() {
            this.on(
                document,
                'keydown',
                event => {
                    if (
                        event.key ===
                        'Escape'
                    ) {
                        this.closeMobileMenu(
                            document.querySelector(
                                SELECTORS.navMenu
                            ),
                            document.querySelector(
                                SELECTORS.navToggle
                            )
                        );
                    }
                }
            );

            this.on(
                document,
                'keyup',
                event => {
                    if (
                        event.key ===
                        'Tab'
                    ) {
                        document.body.classList.add(
                            'keyboard-navigation'
                        );
                    }
                }
            );

            this.on(
                document,
                'mousedown',
                () =>
                    document.body.classList.remove(
                        'keyboard-navigation'
                    )
            );
        }

        initAccessibility() {
            const navToggle =
                document.querySelector(
                    SELECTORS.navToggle
                );

            const navMenu =
                document.querySelector(
                    SELECTORS.navMenu
                );

            if (
                navToggle &&
                navMenu
            ) {
                navToggle.setAttribute(
                    'aria-expanded',
                    navToggle.getAttribute(
                        'aria-expanded'
                    ) || 'false'
                );

                navToggle.setAttribute(
                    'aria-controls',
                    navMenu.id ||
                    'nav-menu'
                );
            }

            document
                .querySelectorAll(
                    '.tab-button'
                )
                .forEach(
                    (button, index) => {
                        if (
                            !button.dataset.tab
                        ) {
                            return;
                        }

                        const pane =
                            this.getElementByIdSafe(
                                button.dataset.tab
                            );

                        if (!button.id) {
                            button.id =
                                `tab-${button.dataset.tab}-${index}`;
                        }

                        if (pane) {
                            pane.setAttribute(
                                'aria-labelledby',
                                button.id
                            );
                        }
                    }
                );
        }

        initPerformanceOptimizations() {
            // Conservé comme méthode publique
            // pour compatibilité avec l'ancien script.
            return this.debounce(
                () => {},
                150
            );
        }

        // ====================================================================
        // RESSOURCES COMPACTES
        // ====================================================================

        initResourceFeatures() {
            const downloadLinks =
                document.querySelectorAll(
                    '.download-link'
                );

            downloadLinks.forEach(link => {
                this.on(
                    link,
                    'click',
                    () => {
                        const original =
                            link.innerHTML;

                        link.innerHTML =
                            '<i class="fas fa-spinner fa-spin"></i>';

                        link.style.pointerEvents =
                            'none';

                        setTimeout(
                            () => {
                                link.innerHTML =
                                    original;

                                link.style.pointerEvents =
                                    '';
                            },
                            1500
                        );
                    }
                );
            });

            document
                .querySelectorAll(
                    '.btn-link.preview'
                )
                .forEach(link => {
                    this.on(
                        link,
                        'click',
                        event => {
                            const href =
                                link.getAttribute(
                                    'href'
                                );

                            if (!href) {
                                return;
                            }

                            event.preventDefault();

                            this.openExternal(
                                href
                            );
                        }
                    );
                });

            document
                .querySelectorAll(
                    '.ressource-category'
                )
                .forEach(category => {
                    const count =
                        category.querySelectorAll(
                            '.ressource-item-compact'
                        ).length;

                    const title =
                        category
                            .querySelector(
                                'h3'
                            )
                            ?.textContent
                            ?.trim() ||
                        'Catégorie';

                    console.log(
                        `📚 ${title} : ${count} ressource(s)`
                    );
                });

            document
                .querySelectorAll(
                    '.section-header'
                )
                .forEach(
                    header =>
                        this.initSectionToggle(
                            header
                        )
                );

            this.loadSectionState();
        }

        initSectionToggle(header) {
            const list =
                header.nextElementSibling;

            if (
                !list?.classList.contains(
                    'ressources-list-compact'
                )
            ) {
                return;
            }

            header.style.cursor =
                'pointer';

            let icon =
                header.querySelector(
                    '.toggle-icon'
                );

            if (!icon) {
                icon =
                    document.createElement(
                        'i'
                    );

                icon.className =
                    'fas fa-chevron-down toggle-icon';

                icon.style.marginLeft =
                    'auto';

                icon.style.fontSize =
                    '0.8rem';

                header.appendChild(
                    icon
                );
            }

            this.on(
                header,
                'click',
                () => {
                    const collapsed =
                        list.style.display ===
                        'none';

                    list.style.display =
                        collapsed
                            ? 'flex'
                            : 'none';

                    icon.className =
                        `fas fa-chevron-${collapsed ? 'down' : 'right'} toggle-icon`;

                    this.saveSectionState();
                }
            );
        }

        saveSectionState() {
            const state = {};

            document
                .querySelectorAll(
                    '.section-header'
                )
                .forEach(
                    (header, index) => {
                        const list =
                            header.nextElementSibling;

                        if (
                            list?.classList.contains(
                                'ressources-list-compact'
                            )
                        ) {
                            state[index] =
                                list.style.display !==
                                'none';
                        }
                    }
                );

            try {
                localStorage.setItem(
                    STORAGE.sectionState,
                    JSON.stringify(state)
                );
            } catch (_) {}
        }

        loadSectionState() {
            try {
                const state =
                    JSON.parse(
                        localStorage.getItem(
                            STORAGE.sectionState
                        ) || 'null'
                    );

                if (!state) return;

                document
                    .querySelectorAll(
                        '.section-header'
                    )
                    .forEach(
                        (header, index) => {
                            if (
                                state[index] ===
                                undefined
                            ) {
                                return;
                            }

                            const list =
                                header.nextElementSibling;

                            if (
                                !list?.classList.contains(
                                    'ressources-list-compact'
                                )
                            ) {
                                return;
                            }

                            list.style.display =
                                state[index]
                                    ? 'flex'
                                    : 'none';

                            const icon =
                                header.querySelector(
                                    '.toggle-icon'
                                );

                            if (icon) {
                                icon.className =
                                    `fas fa-chevron-${state[index] ? 'down' : 'right'} toggle-icon`;
                            }
                        }
                    );
            } catch (error) {
                console.warn(
                    '⚠️ État des sections illisible:',
                    error
                );
            }
        }

        countDownloads() {
            const total =
                document.querySelectorAll(
                    '.download-link[download], a[download]'
                ).length;

            console.log(
                `📥 Total des ressources téléchargeables : ${total}`
            );

            return total;
        }

        // ====================================================================
        // LIVRES
        // ====================================================================

        initBookFeatures() {
            document
                .querySelectorAll(
                    '.livre-cover'
                )
                .forEach(img => {
                    this.on(
                        img,
                        'error',
                        () => {
                            img.style.display =
                                'none';
                        }
                    );

                    if (
                        img.complete &&
                        img.naturalWidth === 0
                    ) {
                        img.style.display =
                            'none';
                    }
                });

            const totalBooks =
                document.querySelectorAll(
                    '.livre-item-compact'
                ).length;

            if (totalBooks) {
                console.log(
                    `📚 ${totalBooks} livres affichés dans la section`
                );
            }

            document
                .querySelectorAll(
                    '.livre-actions a'
                )
                .forEach(link => {
                    if (
                        !link.hasAttribute(
                            'rel'
                        )
                    ) {
                        link.setAttribute(
                            'rel',
                            'noopener noreferrer'
                        );
                    }
                });

            const tabPane =
                document.getElementById(
                    'livres'
                );

            if (
                tabPane &&
                !prefersReducedMotion()
            ) {
                tabPane.classList.add(
                    'livres-ready'
                );
            }
        }

        // ====================================================================
        // STYLES DYNAMIQUES
        // ====================================================================

        injectDynamicStyles() {
            if (
                document.getElementById(
                    'portfolio-dynamic-styles'
                )
            ) {
                return;
            }

            const style =
                document.createElement(
                    'style'
                );

            style.id =
                'portfolio-dynamic-styles';

            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                .pre-animate {
                    opacity: 0;
                    transform: translateY(30px);
                    transition:
                        opacity .6s ease,
                        transform .6s ease;
                }

                .animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }

                .tab-pane {
                    display: none !important;
                    opacity: 0;
                }

                .tab-pane.active {
                    display: block !important;
                    opacity: 1;
                    animation: fadeIn .35s ease;
                }

                .tab-button {
                    cursor: pointer;
                }

                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 10000;
                    max-width:
                        min(400px, calc(100vw - 40px));
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    color: #fff;
                    background:
                        linear-gradient(
                            135deg,
                            #2c3e50,
                            #34495e
                        );
                    box-shadow:
                        0 10px 30px
                        rgba(0,0,0,.25);
                    transform:
                        translateX(
                            calc(100% + 30px)
                        );
                    opacity: 0;
                    transition:
                        transform .3s ease,
                        opacity .3s ease;
                }

                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .notification-success {
                    background:
                        linear-gradient(
                            135deg,
                            #27ae60,
                            #2ecc71
                        );
                }

                .notification-error {
                    background:
                        linear-gradient(
                            135deg,
                            #e74c3c,
                            #c0392b
                        );
                }

                .notification-warning {
                    background:
                        linear-gradient(
                            135deg,
                            #f39c12,
                            #e67e22
                        );
                }

                .notification-info {
                    background:
                        linear-gradient(
                            135deg,
                            #3498db,
                            #2980b9
                        );
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: .5rem;
                    flex: 1;
                }

                .notification-close {
                    width: 32px;
                    height: 32px;
                    border: 0;
                    border-radius: 50%;
                    background:
                        rgba(255,255,255,.2);
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .form-group input.error,
                .form-group textarea.error,
                .form-group select.error {
                    border-color:
                        #e74c3c !important;

                    box-shadow:
                        0 0 0 3px
                        rgba(231,76,60,.1)
                        !important;
                }

                .form-group input.success,
                .form-group textarea.success,
                .form-group select.success {
                    border-color:
                        #27ae60 !important;

                    box-shadow:
                        0 0 0 3px
                        rgba(39,174,96,.1)
                        !important;
                }

                .field-error {
                    color: #e74c3c;
                    font-size: .8rem;
                    margin-top: .25rem;
                    animation:
                        fadeInUp .3s ease;
                }

                .keyboard-navigation *:focus {
                    outline:
                        2px solid #3498db !important;

                    outline-offset:
                        2px !important;
                }

                .dark-mode {
                    --primary-color: #3b82f6;
                    --secondary-color: #8b5cf6;
                    --text-color: #e2e8f0;
                    --bg-light: #1e293b;
                    background: #0f172a;
                    color: #e2e8f0;
                }

                .dark-mode .section.bg-light {
                    background:
                        #1e293b !important;
                }

                .dark-mode .profile-card,
                .dark-mode .competence-category,
                .dark-mode .doc-card,
                .dark-mode .pub-card,
                .dark-mode .exp-card {
                    background: #1e293b;
                    border-color: #334155;
                    color: #e2e8f0;
                }

                #backToTop {
                    transition:
                        opacity .3s ease,
                        visibility .3s ease;
                }

                #backToTop:not(.visible) {
                    visibility: hidden;
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration:
                            .01ms !important;

                        transition-duration:
                            .01ms !important;

                        scroll-behavior:
                            auto !important;
                    }

                    .pre-animate {
                        opacity: 1 !important;
                        transform: none !important;
                    }
                }
            `;

            document.head.appendChild(
                style
            );
        }

        // ====================================================================
        // UTILITAIRES / COMPATIBILITÉ
        // ====================================================================

        getElementByIdSafe(id) {
            if (!id) return null;

            try {
                return document.getElementById(
                    id
                );
            } catch (_) {
                return null;
            }
        }

        sanitizeInput(input) {
            if (
                typeof input !==
                'string'
            ) {
                return '';
            }

            const div =
                document.createElement(
                    'div'
                );

            div.textContent =
                input;

            return div.innerHTML;
        }

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    String(email).trim()
                );
        }

        formatNumber(num) {
            return Number(num).toLocaleString(
                'fr-FR'
            );
        }

        capitalizeFirst(value) {
            const str =
                String(value || '');

            return str
                ? str.charAt(0).toUpperCase() +
                    str.slice(1)
                : str;
        }

        debounce(
            fn,
            wait = 150
        ) {
            let timeout = null;

            return (...args) => {
                clearTimeout(timeout);

                timeout =
                    setTimeout(
                        () =>
                            fn(...args),
                        wait
                    );
            };
        }

        on(
            target,
            event,
            handler,
            options
        ) {
            target?.addEventListener?.(
                event,
                handler,
                options
            );

            if (
                target?.removeEventListener
            ) {
                this.boundHandlers.push({
                    target,
                    event,
                    handler,
                    options
                });
            }
        }

        destroy() {
            if (
                this.dateTimeInterval
            ) {
                clearInterval(
                    this.dateTimeInterval
                );
            }

            if (
                this.visitorInterval
            ) {
                clearInterval(
                    this.visitorInterval
                );
            }

            this.boundHandlers.forEach(
                ({
                    target,
                    event,
                    handler,
                    options
                }) => {
                    target.removeEventListener(
                        event,
                        handler,
                        options
                    );
                }
            );

            this.boundHandlers = [];

            document.body.style.overflow =
                '';

            this.isInitialized =
                false;
        }
    }

    // ========================================================================
    // INITIALISATION UNIQUE
    // ========================================================================

    console.log(
        '🚀 Chargement du script portfolio consolidé…'
    );

    const portfolioApp =
        new PortfolioApp();

    // API publique conservée pour le débogage et la compatibilité.
    window.portfolioApp =
        portfolioApp;

    window.websiteAPI = {
        updateDateTime: () =>
            portfolioApp.startDateTimeUpdates(),

        visitorCounter:
            window.visitorCounter,

        isMobile: () =>
            window.innerWidth <= 768,

        getTotalVisitors: () =>
            portfolioApp
                .getVisitorStats()
                .total,

        getCurrentVisitors: () =>
            portfolioApp.calculateOnlineUsers(
                portfolioApp.getVisitorStats()
            ),

        countDownloads: () =>
            portfolioApp.countDownloads(),

        showNotification: (
            message,
            type,
            duration
        ) =>
            portfolioApp.showNotification(
                message,
                type,
                duration
            )
    };

    window.addEventListener(
        'load',
        () => {
            // Mettre à jour la référence après
            // l'initialisation du compteur.
            window.websiteAPI.visitorCounter =
                window.visitorCounter;

            portfolioApp.countDownloads();

            console.log(
                '🎉 Script portfolio chargé avec succès !'
            );
        },
        { once: true }
    );

    window.addEventListener(
        'beforeunload',
        () => portfolioApp.destroy(),
        { once: true }
    );
})();
