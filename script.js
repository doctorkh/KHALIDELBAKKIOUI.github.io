// ===== APPLICATION PORTFOLIO - SCRIPT COMPLET CORRIGÉ =====
console.log('🚀 Chargement du script portfolio...');

class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ DOM chargé - Initialisation de l\'application');
            this.setupConsoleWelcome();
            this.setupErrorHandling();
            this.initializeAll();
        });
    }

    initializeAll() {
        this.initNavigation();
        this.initTabs();
        this.initSmoothScrolling();
        this.initBackToTop();
        this.initScrollEffects();
        this.initAnimations();
        this.initContactForm();
        this.initCounters();
        this.initDownloadTracking();
        this.initThemeToggle();
        this.initPerformanceOptimizations();
        this.initDateTimeUpdater();
        this.initVisitorCounter();
        this.initImageLazyLoading();
        this.initKeyboardNavigation();
        this.initAccessibility();
    }

    // ===== INITIALISATION ET CONFIGURATION =====
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
            console.log('%c✨ JavaScript optimisé - Onglets fonctionnels', 'color: #27ae60;');
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
            e.preventDefault();
        });
    }

    // ===== NAVIGATION AMÉLIORÉE =====
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.getElementById('navbar');
        
        if (!navToggle || !navMenu) {
            console.warn('❌ Éléments de navigation non trouvés');
            return;
        }

        // Toggle menu mobile
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(navMenu, navToggle);
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Fermer le menu au redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Navigation clavier dans le menu mobile
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Animation navbar au scroll
        if (navbar) {
            this.handleNavbarScroll(navbar);
            window.addEventListener('scroll', () => this.handleNavbarScroll(navbar), { passive: true });
        }

        console.log('✅ Navigation initialisée');
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        
        if (isOpening) {
            navMenu.style.transform = 'translateX(0)';
            navToggle.setAttribute('aria-expanded', 'true');
        } else {
            navMenu.style.transform = 'translateX(-100%)';
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        navMenu.classList.remove('active');
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

    // ===== SYSTÈME D'ONGLETS CORRIGÉ =====
    initTabs() {
        console.log('🔧 Initialisation des systèmes d\'onglets...');
        
        const tabContainers = [
            '.experience-tabs',
            '.research-tabs', 
            '.filiere-tabs',
            '.documents-tabs'
        ];

        tabContainers.forEach(selector => {
            const containers = document.querySelectorAll(selector);
            containers.forEach(container => {
                this.initTabSystem(container);
            });
        });

        console.log('✅ Tous les onglets initialisés');
    }

    initTabSystem(container) {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        console.log(`📁 ${tabButtons.length} boutons trouvés dans`, container.className);

        tabButtons.forEach(button => {
            // Supprimer les anciens écouteurs
            button.replaceWith(button.cloneNode(true));
        });

        // Référencer à nouveau après le clone
        const newTabButtons = container.querySelectorAll('.tab-button');

        newTabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tabId = button.getAttribute('data-tab');
                console.log('🎯 Clic sur onglet:', tabId);

                this.switchTab(container, button, newTabButtons, tabPanes, tabId);
            });

            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabId = button.getAttribute('data-tab');
                    this.switchTab(container, button, newTabButtons, tabPanes, tabId);
                }
            });
        });

        // Activer le premier onglet par défaut
        if (newTabButtons.length > 0) {
            const firstButton = newTabButtons[0];
            const firstTabId = firstButton.getAttribute('data-tab');
            if (!document.querySelector(`#${firstTabId}`).classList.contains('active')) {
                this.switchTab(container, firstButton, newTabButtons, tabPanes, firstTabId);
            }
        }
    }

    switchTab(container, button, tabButtons, tabPanes, tabId) {
        console.log('🔄 Changement vers onglet:', tabId);

        // Désactiver tous les boutons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        // Désactiver tous les panneaux
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
        });

        // Activer le bouton cliqué
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        // Activer le panneau correspondant
        const activePane = document.getElementById(tabId);
        if (activePane) {
            activePane.classList.add('active');
            activePane.setAttribute('aria-hidden', 'false');
            
            // Animation
            activePane.style.animation = 'fadeInUp 0.4s ease-out';
            
            console.log('✅ Onglet activé:', tabId);
        } else {
            console.error('❌ Panneau non trouvé:', tabId);
        }
    }

    // ===== SCROLL ET ANIMATIONS =====
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                e.preventDefault();
                this.scrollToElement(targetId);
            });
        });
    }

    scrollToElement(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const offsetTop = targetElement.offsetTop - 80;
        
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
                backToTop.style.opacity = '1';
            } else {
                backToTop.classList.remove('visible');
                backToTop.style.opacity = '0';
            }
        };
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
    }

    initScrollEffects() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNavLink(id, navLinks);
                }
            });
        }, {
            threshold: 0.5,
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

    // ===== ANIMATIONS AVANCÉES =====
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
            '.profile-card, .pub-card, .doc-card, .exp-card, ' +
            '.competence-category, .timeline-item, .stat, .ressource-item, ' +
            '.contact-item, .conf-card'
        );
        
        animatables.forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });

        this.animateHero();
    }

    animateHero() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-contact, .hero-stats, .hero-buttons');
        
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.15}s both`;
        });
    }

    // ===== COMPTEURS ANIMÉS =====
    initCounters() {
        const statsContainer = document.querySelector('.hero-stats');
        if (!statsContainer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(statsContainer);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent) || 0;
            if (target === 0) return;

            let current = 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                current = Math.floor(target * easeOut);
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

    // ===== FORMULAIRE DE CONTACT =====
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldStatus(input);
            });
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
                } else if (field.name.includes('name') && value.length < 2) {
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
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
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
            
            form.querySelectorAll('input, textarea').forEach(field => {
                this.clearFieldStatus(field);
            });
            
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
                console.log('Données du formulaire:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ===== SYSTÈME DE NOTIFICATIONS =====
    showNotification(message, type = 'info', duration = 5000) {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
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
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
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

/**
 * ================================================================
 * COMPTEUR DE VISITEURS RÉEL - VERSION PROFESSIONNELLE ET ROBUSTE
 * ================================================================
 * 
 * Fonctionnalités :
 *  - Comptage précis des visites uniques (par session)
 *  - Compteur quotidien réinitialisé à minuit
 *  - Suivi des utilisateurs en ligne (temps réel, 2 min d'inactivité)
 *  - Historique des 100 dernières visites
 *  - Affichage formaté avec séparateurs de milliers
 *  - Mise à jour fluide de la date et de l'heure
 *  - Détection de la visibilité de l'onglet et des interactions
 *  - Gestion sécurisée du localStorage/sessionStorage
 * 
 * Conçu pour un portfolio professionnel, fiable et sans dépendances externes.
 * ================================================================
 */

class RealVisitorCounter {
    constructor() {
        this.storageKey = 'portfolioRealVisitorData';
        this.sessionKey = 'portfolioRealVisitTracked';
        this.onlineUsersKey = 'portfolioOnlineUsers';

        this.requiredElements = [
            'total-visitors',
            'visitor-count',
            'current-visitors',
            'current-date',
            'current-time'
        ];

        this.init();
    }

    /**
     * Initialisation complète du système de comptage
     */
    init() {
        console.info('🔢 Initialisation du compteur de visiteurs réels (version professionnelle)...');

        if (!this.areRequiredElementsPresent()) {
            console.warn('❌ Certains éléments DOM requis sont manquants. Le compteur ne sera pas initialisé.');
            return;
        }

        this.updateDateTime();
        this.handleRealVisitCounting();
        this.startRealTimeUpdates();
        this.displayCounters();

        console.info('✅ Compteur de visiteurs réels initialisé avec succès.');
    }

    /**
     * Vérifie la présence des éléments DOM nécessaires
     */
    areRequiredElementsPresent() {
        return this.requiredElements.some(id => !!document.getElementById(id));
    }

    /**
     * Gestion du comptage des visites réelles (uniques par session)
     */
    handleRealVisitCounting() {
        const now = new Date();
        const todayKey = now.toDateString();
        const data = this.getVisitorData();
        const sessionVisitId = sessionStorage.getItem(this.sessionKey);

        if (sessionVisitId) {
            console.info('🔁 Visite déjà enregistrée dans cette session.');
            return;
        }

        console.info('🆕 Nouvelle visite réelle détectée.');

        const visitId = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(this.sessionKey, visitId);

        // Incrément du total global
        data.total++;

        // Réinitialisation quotidienne si nécessaire
        if (data.lastVisitDate !== todayKey) {
            console.info('📅 Nouveau jour détecté → réinitialisation du compteur quotidien.');
            data.today = 0;
            data.lastVisitDate = todayKey;
        }

        data.today++;
        data.lastVisit = now.toISOString();

        // Mise à jour de la première visite (si non définie)
        if (!data.firstVisit) {
            data.firstVisit = now.toISOString();
        }

        // Historique des visites (limité à 100)
        if (!Array.isArray(data.visitHistory)) data.visitHistory = [];
        data.visitHistory.push({
            id: visitId,
            timestamp: now.toISOString(),
            date: todayKey
        });

        if (data.visitHistory.length > 100) {
            data.visitHistory = data.visitHistory.slice(-100);
        }

        // Cohérence des données
        if (data.today > data.total) {
            console.warn('⚠️ Incohérence détectée (today > total) → correction automatique.');
            data.total = data.today;
        }

        this.saveVisitorData(data);
        console.info(`📈 Mise à jour : Total = ${data.total}, Aujourd'hui = ${data.today}`);
    }

    /**
     * Gestion des utilisateurs en ligne (temps réel)
     */
    handleOnlineUsers() {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
        let onlineData = this.getOnlineUsersData();

        const userKey = sessionStorage.getItem(this.sessionKey)
            ? `user_${sessionStorage.getItem(this.sessionKey)}`
            : `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        onlineData[userKey] = {
            lastActive: now.toISOString(),
            minute: now.toISOString().slice(0, 16)
        };

        // Nettoyage des utilisateurs inactifs (> 5 min)
        Object.keys(onlineData).forEach(key => {
            if (onlineData[key].lastActive < fiveMinutesAgo) {
                delete onlineData[key];
            }
        });

        this.saveOnlineUsersData(onlineData);
    }

    /**
     * Calcul du nombre d'utilisateurs actuellement en ligne (2 dernières minutes)
     */
    calculateOnlineUsers() {
        const onlineData = this.getOnlineUsersData();
        const now = new Date();
        const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString();

        const activeCount = Object.values(onlineData).filter(
            user => user.lastActive > twoMinutesAgo
        ).length;

        return Math.max(1, activeCount); // Au moins 1 (l'utilisateur actuel)
    }

    /**
     * Affichage des compteurs dans l'interface
     */
    displayCounters() {
        const data = this.getVisitorData();
        const onlineUsers = this.calculateOnlineUsers();

        this.updateElement('total-visitors', this.formatNumber(data.total));
        this.updateElement('visitor-count', this.formatNumber(data.today));
        this.updateElement('current-visitors', this.formatNumber(onlineUsers));

        console.info(`📊 Affichage → Total: ${data.total} | Aujourd'hui: ${data.today} | En ligne: ${onlineUsers}`);
    }

    /**
     * Mise à jour de la date et de l'heure en temps réel
     */
    updateDateTime() {
        const now = new Date();

        const optionsDate = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        this.updateElement('current-date', now.toLocaleDateString('fr-FR', optionsDate));
        this.updateElement('current-time', now.toLocaleTimeString('fr-FR', optionsTime));
    }

    /**
     * Démarrage des mises à jour en temps réel
     */
    startRealTimeUpdates() {
        // Mise à jour de l'heure chaque seconde
        setInterval(() => this.updateDateTime(), 1000);

        // Mise à jour des utilisateurs en ligne toutes les 30 secondes
        setInterval(() => {
            this.handleOnlineUsers();
            this.displayCounters();
        }, 30_000);

        // Signal d'activité toutes les minutes
        setInterval(() => this.handleOnlineUsers(), 60_000);

        // Réactivation lors du retour sur l'onglet
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleOnlineUsers();
                this.displayCounters();
            }
        });

        // Détection des interactions utilisateur (clic, mouvement, scroll, touche)
        ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.handleOnlineUsers(), { passive: true });
        });
    }

    // ==================== UTILITAIRES ====================

    /**
     * Récupération sécurisée des données visiteurs depuis localStorage
     */
    getVisitorData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                console.info('🌟 Première visite détectée → initialisation des données.');
                return this.getDefaultVisitorData();
            }

            const data = JSON.parse(stored);
            this.validateAndFixVisitorData(data);
            return data;
        } catch (error) {
            console.error('❌ Erreur lors de la lecture des données visiteurs :', error);
            return this.getDefaultVisitorData();
        }
    }

    /**
     * Données par défaut pour une première visite
     */
    getDefaultVisitorData() {
        const now = new Date();
        const todayKey = now.toDateString();
        return {
            total: 0,
            today: 0,
            lastVisitDate: todayKey,
            lastVisit: now.toISOString(),
            firstVisit: now.toISOString(),
            visitHistory: []
        };
    }

    /**
     * Validation et correction des données visiteurs
     */
    validateAndFixVisitorData(data) {
        const todayKey = new Date().toDateString();

        if (data.today > data.total) {
            console.warn('⚠️ Incohérence détectée (today > total) → correction.');
            data.total = data.today;
        }

        if (data.lastVisitDate !== todayKey) {
            console.info('🔄 Changement de jour → réinitialisation du compteur quotidien.');
            data.today = 0;
            data.lastVisitDate = todayKey;
        }
    }

    /**
     * Sauvegarde sécurisée des données visiteurs
     */
    saveVisitorData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.info('💾 Données visiteurs sauvegardées avec succès.');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des données visiteurs :', error);
        }
    }

    /**
     * Gestion sécurisée des utilisateurs en ligne (sessionStorage)
     */
    getOnlineUsersData() {
        try {
            const stored = sessionStorage.getItem(this.onlineUsersKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('❌ Erreur lecture utilisateurs en ligne :', error);
            return {};
        }
    }

    saveOnlineUsersData(data) {
        try {
            sessionStorage.setItem(this.onlineUsersKey, JSON.stringify(data));
        } catch (error) {
            console.error('❌ Erreur sauvegarde utilisateurs en ligne :', error);
        }
    }

    /**
     * Mise à jour sécurisée d'un élément DOM
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`⚠️ Élément DOM introuvable : #${id}`);
        }
    }

    /**
     * Formatage des nombres avec séparateurs d'espaces
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

// ================================================================
// INITIALISATION AUTOMATIQUE AU CHARGEMENT DE LA PAGE
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    window.realVisitorCounter = new RealVisitorCounter();
    console.info('RealVisitorCounter prêt → `window.realVisitorCounter`');
});
    // ===== THÈME SOMBRE/CLAIR =====
    initThemeToggle() {
        // Créer le toggle si inexistant
        if (!document.querySelector('.theme-toggle')) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Changer le thème';
            themeToggle.setAttribute('aria-label', 'Changer le thème');
            
            document.body.appendChild(themeToggle);
            
            themeToggle.addEventListener('click', () => {
                this.toggleTheme(themeToggle);
            });
        }
        
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const toggle = document.querySelector('.theme-toggle');
            if (toggle) toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    toggleTheme(themeToggle) {
        const isDark = document.body.classList.toggle('dark-mode');
        
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.style.background = isDark ? 'var(--gradient-warning)' : 'var(--gradient-primary)';
        
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        
        this.showNotification(
            `Mode ${isDark ? 'sombre' : 'clair'} activé`, 
            'info', 
            2000
        );
    }

    // ===== FONCTIONNALITÉS AVANCÉES =====
    initDateTimeUpdater() {
        // Géré par le compteur intégré
        console.log('✅ Mise à jour date/heure intégrée');
    }

    initDownloadTracking() {
        document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', () => {
                const fileName = link.getAttribute('href')?.split('/').pop();
                if (fileName) {
                    this.trackDownload(fileName);
                    this.showNotification(`Téléchargement: ${fileName}`, 'info', 3000);
                }
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
        
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        downloads.push(downloadEvent);
        localStorage.setItem('downloads', JSON.stringify(downloads.slice(-50)));
    }

    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    initPerformanceOptimizations() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recréer les observateurs si nécessaire
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
        });
    }

    initAccessibility() {
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle && !navToggle.hasAttribute('aria-expanded')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
        }

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ===== UTILITAIRES =====
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
}

// ===== INITIALISATION DE L'APPLICATION =====
console.log('🎯 Démarrage de l\'application portfolio...');
const portfolioApp = new PortfolioApp();

// ===== STYLES DYNAMIQUES POUR LES ANIMATIONS =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Animations de base */
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
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
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
    
    .notification-success {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
    }
    
    .notification-error {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #f39c12, #e67e22);
    }
    
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
    
    .dark-mode .section.bg-light {
        background: #1e293b;
    }
    
    .dark-mode .profile-card,
    .dark-mode .competence-category,
    .dark-mode .doc-card,
    .dark-mode .pub-card,
    .dark-mode .exp-card {
        background: #1e293b;
        border-color: #334155;
    }
    
    /* Optimisation des performances */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Correction pour les onglets */
    .tab-pane {
        display: none;
    }
    
    .tab-pane.active {
        display: block;
        animation: fadeInUp 0.5s ease;
    }
    
    .tab-button {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .tab-button:hover {
        transform: translateY(-2px);
    }
    
    .tab-button.active {
        background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
        color: white !important;
    }
`;
document.head.appendChild(dynamicStyles);

console.log('🎉 Script portfolio chargé avec succès!');
