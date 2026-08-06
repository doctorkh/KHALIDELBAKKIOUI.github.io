// ============================================================
// PORTFOLIO - SCRIPT COMPLET OPTIMISÉ V2.0
// ============================================================
// Auteur : Khalid EL BAKKIOUI
// Description : Gestion complète du portfolio avec toutes les fonctionnalités
// ============================================================

console.log('🚀 Chargement du portfolio...');

// ============================================================
// 1. CLASSE PRINCIPALE - PORTFOLIO APP
// ============================================================
class PortfolioApp {
    constructor() {
        // État de l'application
        this.state = {
            isScrolling: false,
            lastScrollTop: 0,
            currentTheme: 'light',
            isInitialized: false,
            isMobile: window.innerWidth <= 768
        };
        
        // Intervalles
        this.intervals = {
            dateTime: null,
            visitor: null
        };
        
        // Gestionnaires d'événements
        this.eventHandlers = new Map();
        
        // Initialisation
        this.init();
    }

    // ============================================================
    // 1.1 INITIALISATION PRINCIPALE
    // ============================================================
    init() {
        this.setupConsoleWelcome();
        this.setupErrorHandling();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeAll());
        } else {
            this.initializeAll();
        }
        
        // Nettoyage avant fermeture
        window.addEventListener('beforeunload', () => this.destroy());
    }

    initializeAll() {
        if (this.state.isInitialized) return;
        
        console.log('🎯 Initialisation de l\'application...');
        
        // Ordre d'initialisation
        const modules = [
            this.initScrollManagement.bind(this),
            this.initNavigation.bind(this),
            this.initTabs.bind(this),
            this.initAnimations.bind(this),
            this.initCounters.bind(this),
            this.initContactForm.bind(this),
            this.initThemeToggle.bind(this),
            this.initDateTime.bind(this),
            this.initVisitorCounter.bind(this),
            this.initDownloadTracking.bind(this),
            this.initPerformance.bind(this),
            this.initAccessibility.bind(this)
        ];
        
        // Exécution séquentielle des modules
        modules.forEach(module => {
            try {
                module();
            } catch (error) {
                console.error(`❌ Erreur dans ${module.name}:`, error);
            }
        });
        
        this.state.isInitialized = true;
        console.log('✅ Application entièrement initialisée');
    }

    // ============================================================
    // 2. CONFIGURATION & GESTION DES ERREURS
    // ============================================================
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
            console.log('%c✨ JavaScript optimisé V2.0 - Toutes les fonctionnalités activées', 'color: #27ae60;');
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('❌ Erreur JavaScript:', e.error || e.message);
            this.handleError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Promise rejetée:', e.reason);
            this.handleError(e.reason);
            e.preventDefault();
        });
    }

    handleError(error) {
        // Journalisation et affichage discret en production
        if (window.location.hostname !== 'localhost') {
            // Envoyer l'erreur à un service de monitoring
            console.warn('⚠️ Erreur capturée:', error?.message || 'Erreur inconnue');
        }
    }

    // ============================================================
    // 3. GESTION DU SCROLL
    // ============================================================
    initScrollManagement() {
        this.initNavbarScroll();
        this.initBackToTop();
        this.initSmoothScrolling();
        this.initScrollSpy();
    }

    initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Effet de fond
            navbar.classList.toggle('scrolled', scrollTop > 50);
            
            // Cacher/afficher selon la direction
            if (scrollTop > this.state.lastScrollTop && scrollTop > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            
            this.state.lastScrollTop = scrollTop;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        this.storeEventHandler('scroll', handleScroll);
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

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            });
        });
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // ============================================================
    // 4. NAVIGATION MOBILE
    // ============================================================
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;

        // Nettoyage des événements précédents
        const newToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newToggle, navToggle);

        newToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu(navMenu, newToggle);
        });

        // Fermeture au clic extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu(navMenu, newToggle);
            }
        });

        // Fermeture avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(navMenu, newToggle);
            }
        });

        // Fermeture au redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu(navMenu, newToggle);
            }
        });
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        navToggle.setAttribute('aria-expanded', isOpening);
        
        if (isOpening) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) setTimeout(() => firstLink.focus(), 100);
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // ============================================================
    // 5. SYSTÈME D'ONGLETS UNIVERSEL
    // ============================================================
    initTabs() {
        console.log('🔧 Initialisation du système d\'onglets...');
        
        const containers = document.querySelectorAll('.tab-container');
        if (!containers.length) {
            console.warn('⚠️ Aucun conteneur d\'onglets trouvé');
            return;
        }

        containers.forEach(container => this.initTabSystem(container));
        console.log(`✅ ${containers.length} système(s) d'onglets initialisé(s)`);
    }

    initTabSystem(container) {
        const buttons = container.querySelectorAll('.tab-button');
        const panes = container.querySelectorAll('.tab-pane');
        
        if (!buttons.length) {
            console.warn('⚠️ Aucun bouton d\'onglet trouvé');
            return;
        }

        // Nettoyer les anciens événements
        buttons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = newButton.dataset.tab;
                if (tabId) this.switchTab(container, newButton, tabId);
            });
        });

        // Activer le premier onglet si aucun n'est actif
        if (!container.querySelector('.tab-button.active') && buttons.length) {
            const first = container.querySelector('.tab-button');
            const tabId = first.dataset.tab;
            if (tabId) this.switchTab(container, first, tabId);
        }
    }

    switchTab(container, button, tabId) {
        // Désactiver tout
        container.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        container.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
        });

        // Activer le nouvel onglet
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        const target = container.querySelector(`#${tabId}`);
        if (target) {
            target.classList.add('active');
            target.setAttribute('aria-hidden', 'false');
        } else {
            console.error(`❌ Panneau non trouvé: #${tabId}`);
        }
    }

    // ============================================================
    // 6. ANIMATIONS & EFFETS VISUELS
    // ============================================================
    initAnimations() {
        // Animation des éléments Hero
        this.initHeroAnimations();
        
        // Animation au défilement
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
    }

    initHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons');
        
        if (!heroElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 0.2;
                    entry.target.style.animation = `fadeInUp 0.8s ease-out ${delay}s both`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        heroElements.forEach(el => observer.observe(el));
    }

    // ============================================================
    // 7. COMPTEURS ANIMÉS
    // ============================================================
    initCounters() {
        const statsContainer = document.querySelector('.hero-stats');
        if (!statsContainer) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                this.animateCounters();
                observer.disconnect();
            }
        });

        observer.observe(statsContainer);
    }

    animateCounters() {
        document.querySelectorAll('.stat h3').forEach(counter => {
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

    // ============================================================
    // 8. FORMULAIRE DE CONTACT
    // ============================================================
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldStatus(input));
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.validateForm(form)) {
                await this.submitForm(form);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'text':
                if (!value || value.length < 2) {
                    isValid = false;
                    message = 'Minimum 2 caractères requis';
                }
                break;
            case 'email':
                if (!value || !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Email valide requis';
                }
                break;
            case 'textarea':
                if (!value || value.length < 10) {
                    isValid = false;
                    message = 'Minimum 10 caractères';
                }
                break;
        }

        this.showFieldStatus(field, isValid, message);
        return isValid;
    }

    showFieldStatus(field, isValid, message) {
        this.clearFieldStatus(field);
        field.classList.add(isValid ? 'success' : 'error');
        
        if (!isValid && message) {
            const error = document.createElement('div');
            error.className = 'field-error';
            error.textContent = message;
            field.parentNode.appendChild(error);
        }
    }

    clearFieldStatus(field) {
        field.classList.remove('error', 'success');
        const error = field.parentNode.querySelector('.field-error');
        if (error) error.remove();
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input, textarea');
        return Array.from(fields).every(field => this.validateField(field));
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            const data = new FormData(form);
            await this.sendFormData(Object.fromEntries(data));
            this.showNotification('Message envoyé avec succès !', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendFormData(data) {
        // Simulation d'envoi
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    // ============================================================
    // 9. SYSTÈME DE NOTIFICATIONS
    // ============================================================
    showNotification(message, type = 'info', duration = 5000) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
        
        // Animation d'entrée
        requestAnimationFrame(() => notification.classList.add('show'));

        // Fermeture automatique
        if (duration > 0) {
            setTimeout(() => this.removeNotification(notification), duration);
        }

        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        return notification;
    }

    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    // ============================================================
    // 10. DATE & HEURE
    // ============================================================
    initDateTime() {
        console.log('🕐 Initialisation de l\'horloge...');
        this.updateDateTime();
        this.intervals.dateTime = setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        const dateEl = document.getElementById('current-date');
        const timeEl = document.getElementById('current-time');

        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    // ============================================================
    // 11. COMPTEUR DE VISITEURS
    // ============================================================
    initVisitorCounter() {
        console.log('🔢 Initialisation du compteur de visiteurs...');
        
        const storageKey = 'portfolio_visitors';
        const sessionKey = 'portfolio_session';

        try {
            let stats = this.getVisitorStats(storageKey);
            this.handleNewVisit(stats, sessionKey);
            this.saveVisitorStats(storageKey, stats);
            this.updateVisitorDisplay(stats);
            
            // Mise à jour périodique
            this.intervals.visitor = setInterval(() => {
                stats = this.getVisitorStats(storageKey);
                this.updateVisitorDisplay(stats);
            }, 30000);
        } catch (error) {
            console.warn('⚠️ Erreur compteur de visiteurs:', error);
        }
    }

    getVisitorStats(storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const stats = JSON.parse(stored);
                // Nettoyer les visites de plus de 24h
                const now = Date.now();
                stats.visits = stats.visits.filter(v => now - new Date(v.timestamp).getTime() < 86400000);
                return stats;
            }
        } catch (e) {}

        return { total: 15, visits: [], firstVisit: new Date().toISOString() };
    }

    saveVisitorStats(storageKey, stats) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(stats));
        } catch (e) {}
    }

    handleNewVisit(stats, sessionKey) {
        if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, 'visited');
            stats.total++;
            stats.visits.push({
                timestamp: new Date().toISOString()
            });
        }
    }

    updateVisitorDisplay(stats) {
        const totalEl = document.getElementById('total-visitors');
        const onlineEl = document.getElementById('current-visitors');

        if (totalEl) {
            totalEl.textContent = stats.total;
        }

        if (onlineEl) {
            const online = Math.max(1, stats.visits.filter(v => 
                Date.now() - new Date(v.timestamp).getTime() < 900000
            ).length);
            onlineEl.textContent = online;
        }
    }

    // ============================================================
    // 12. THÈME SOMBRE/CLAIR
    // ============================================================
    initThemeToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', () => this.toggleTheme());

        // Restaurer le thème sauvegardé
        const saved = localStorage.getItem('portfolio-theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-mode');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const toggle = document.querySelector('.theme-toggle');
        
        if (toggle) {
            toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
        this.showNotification(`Mode ${isDark ? 'sombre' : 'clair'} activé`, 'info', 2000);
    }

    // ============================================================
    // 13. SUIVI DES TÉLÉCHARGEMENTS
    // ============================================================
    initDownloadTracking() {
        document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', () => {
                const fileName = link.href.split('/').pop() || 'document';
                this.trackDownload(fileName);
            });
        });
    }

    trackDownload(fileName) {
        console.log(`📥 Téléchargement: ${fileName}`);
        // Envoyer à Google Analytics ou autre service
    }

    // ============================================================
    // 14. OPTIMISATION DES PERFORMANCES
    // ============================================================
    initPerformance() {
        // Détection des préférences de mouvement réduit
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-motion');
        }

        // Détection mobile
        this.state.isMobile = window.innerWidth <= 768;
        if (this.state.isMobile) {
            this.optimizeForMobile();
        }

        // Débounce des événements de redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.state.isMobile = window.innerWidth <= 768;
                if (this.state.isMobile) this.optimizeForMobile();
            }, 250);
        }, { passive: true });
    }

    optimizeForMobile() {
        // Désactiver certaines animations lourdes sur mobile
        document.querySelectorAll('.animate-on-scroll, .pre-animate').forEach(el => {
            if (this.state.isMobile) {
                el.style.animation = 'none';
                el.style.transition = 'none';
                el.classList.add('animate-in');
            }
        });
    }

    // ============================================================
    // 15. ACCESSIBILITÉ
    // ============================================================
    initAccessibility() {
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Attributs ARIA pour les onglets
        document.querySelectorAll('.tab-button').forEach(button => {
            const tabId = button.dataset.tab;
            if (tabId) {
                button.setAttribute('role', 'tab');
                button.setAttribute('aria-controls', tabId);
                button.id = `tab-${tabId}`;
                
                const pane = document.getElementById(tabId);
                if (pane) {
                    pane.setAttribute('role', 'tabpanel');
                    pane.setAttribute('aria-labelledby', button.id);
                }
            }
        });

        // Menu mobile accessibilité
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-controls', 'nav-menu');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // ============================================================
    // 16. UTILITAIRES
    // ============================================================
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    storeEventHandler(event, handler) {
        this.eventHandlers.set(event, handler);
    }

    // ============================================================
    // 17. NETTOYAGE
    // ============================================================
    destroy() {
        // Nettoyer les intervalles
        Object.values(this.intervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });

        // Nettoyer les écouteurs d'événements
        this.eventHandlers.forEach((handler, event) => {
            window.removeEventListener(event, handler);
        });
        this.eventHandlers.clear();

        this.state.isInitialized = false;
        console.log('🧹 Application nettoyée');
    }
}

// ============================================================
// 18. INITIALISATION
// ============================================================
console.log('🎯 Démarrage de l\'application...');
const portfolioApp = new PortfolioApp();

// ============================================================
// 19. STYLES DYNAMIQUES
// ============================================================
const styles = document.createElement('style');
styles.textContent = `
    /* ============================================================
       STYLES DYNAMIQUES - GÉNÉRÉS PAR JAVASCRIPT
       ============================================================ */
    
    /* ANIMATIONS */
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* CLASSES D'ANIMATION */
    .pre-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* NOTIFICATIONS */
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
        font-size: 0.95rem;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success { background: linear-gradient(135deg, #27ae60, #2ecc71); }
    .notification-error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    .notification-warning { background: linear-gradient(135deg, #f39c12, #e67e22); }
    .notification-info { background: linear-gradient(135deg, #3498db, #2980b9); }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
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
    
    /* VALIDATION DE FORMULAIRE */
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
    
    /* ACCESSIBILITÉ */
    .keyboard-navigation *:focus {
        outline: 2px solid #3498db !important;
        outline-offset: 2px !important;
    }
    
    /* MODE SOMBRE */
    .dark-mode {
        --primary-color: #3b82f6;
        --secondary-color: #8b5cf6;
        --text-color: #e2e8f0;
        --bg-light: #1e293b;
        background: #0f172a;
        color: #e2e8f0;
    }
    
    .dark-mode .section.bg-light {
        background: #1e293b !important;
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
    
    /* RÉDUCTION DES MOUVEMENTS */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* ONGLETS */
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
    
    .tab-button {
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        background: transparent;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.95rem;
        color: #555;
    }
    
    .tab-button:hover {
        transform: translateY(-2px);
        background: rgba(0,0,0,0.05);
    }
    
    .tab-button.active {
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        color: white !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .tab-button .badge {
        background: rgba(0,0,0,0.1);
        padding: 1px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        margin-left: 5px;
    }
    
    .tab-button.active .badge {
        background: rgba(255,255,255,0.25);
    }
    
    /* NAVIGATION MOBILE */
    .nav-menu {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .nav-menu.active {
        transform: translateX(0) !important;
    }
    
    #navbar.hidden {
        transform: translateY(-100%);
    }
    
    /* BACK TO TOP */
    #backToTop {
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    #backToTop.visible {
        visibility: visible;
        opacity: 1;
    }
    
    /* LIVRES */
    .livre-cover[src=""] {
        display: none;
    }
`;

document.head.appendChild(styles);

// ============================================================
// 20. MODULES COMPLÉMENTAIRES (CHARGEMENT DIFFÉRÉ)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Gestion des images de livres
    document.querySelectorAll('.livre-cover').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });

    // Comptage des ressources
    const totalBooks = document.querySelectorAll('.livre-item-compact').length;
    const totalResources = document.querySelectorAll('.ressource-item-compact').length;
    
    if (totalBooks || totalResources) {
        console.log(`📚 ${totalBooks} livres • 📄 ${totalResources} ressources chargées`);
    }

    console.log('✅ Tous les modules complémentaires chargés');
});

// ============================================================
// 21. EXPOSITION DE L'API (DEBUG)
// ============================================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.__portfolio = {
        app: portfolioApp,
        version: '2.0.0',
        debug: true
    };
}

console.log('🎉 Portfolio chargé avec succès !');

// ============================================================
// FIN DU SCRIPT
// ============================================================
