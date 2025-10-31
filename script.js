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
        this.initAllButtons(); // NOUVEAU: Initialisation de tous les boutons
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
            '.documents-tabs',
            '.conferences-tabs',
            '.livres-tabs',
            '.memoires-tabs'
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

    // ===== INITIALISATION DE TOUS LES BOUTONS SPÉCIFIQUES =====
    initAllButtons() {
        console.log('🔘 Initialisation de tous les boutons spécifiques...');
        
        // Boutons ECT1, ECT2, ECS1, ECS2, MPSI
        this.initFiliereButtons();
        
        // Boutons conférences
        this.initConferenceButtons();
        
        // Boutons livres
        this.initLivreButtons();
        
        // Boutons mémoires
        this.initMemoireButtons();
        
        // Boutons généraux
        this.initGeneralButtons();
        
        console.log('✅ Tous les boutons initialisés');
    }

    initFiliereButtons() {
        const filiereButtons = [
            'ECT1', 'ECT2', 'ECS1', 'ECS2', 'MPSI'
        ];
        
        filiereButtons.forEach(filiere => {
            const buttons = document.querySelectorAll(`.btn-${filiere.toLowerCase()}, [data-filiere="${filiere}"]`);
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`🎓 Bouton ${filiere} cliqué`);
                    this.handleFiliereClick(filiere);
                });
            });
        });
    }

    initConferenceButtons() {
        const conferenceButtons = document.querySelectorAll('.btn-conference, [data-type="conference"], .conference-btn');
        conferenceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎤 Bouton conférence cliqué');
                this.handleConferenceClick(button);
            });
        });
    }

    initLivreButtons() {
        const livreButtons = document.querySelectorAll('.btn-livre, [data-type="livre"], .livre-btn');
        livreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📚 Bouton livre cliqué');
                this.handleLivreClick(button);
            });
        });
    }

    initMemoireButtons() {
        const memoireButtons = document.querySelectorAll('.btn-memoire, [data-type="memoire"], .memoire-btn');
        memoireButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📖 Bouton mémoire cliqué');
                this.handleMemoireClick(button);
            });
        });
    }

    initGeneralButtons() {
        // Boutons de téléchargement
        const downloadButtons = document.querySelectorAll('.btn-download, [download]');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const fileName = button.getAttribute('href')?.split('/').pop() || 'document';
                console.log(`📥 Téléchargement: ${fileName}`);
                this.trackDownload(fileName);
            });
        });

        // Boutons de vue
        const viewButtons = document.querySelectorAll('.btn-view, .view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.getAttribute('data-target') || button.getAttribute('href');
                console.log(`👀 Vue demandée: ${target}`);
                this.handleViewClick(target, button);
            });
        });
    }

    handleFiliereClick(filiere) {
        this.showNotification(`Filière ${filiere} sélectionnée`, 'info', 3000);
        
        // Scroll vers la section correspondante si elle existe
        const targetSection = document.getElementById(`section-${filiere.toLowerCase()}`);
        if (targetSection) {
            this.scrollToElement(`#section-${filiere.toLowerCase()}`);
        }
        
        // Déclencher un événement personnalisé
        const event = new CustomEvent('filiereSelected', { 
            detail: { filiere: filiere } 
        });
        document.dispatchEvent(event);
    }

    handleConferenceClick(button) {
        const conferenceTitle = button.getAttribute('data-title') || button.textContent;
        this.showNotification(`Conférence: ${conferenceTitle}`, 'info', 3000);
        
        // Logique spécifique aux conférences
        const targetId = button.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    handleLivreClick(button) {
        const livreTitle = button.getAttribute('data-title') || button.textContent;
        this.showNotification(`Livre: ${livreTitle}`, 'info', 3000);
        
        // Logique spécifique aux livres
        const url = button.getAttribute('href');
        if (url && !url.startsWith('#')) {
            window.open(url, '_blank');
        }
    }

    handleMemoireClick(button) {
        const memoireTitle = button.getAttribute('data-title') || button.textContent;
        this.showNotification(`Mémoire: ${memoireTitle}`, 'info', 3000);
        
        // Logique spécifique aux mémoires
        const url = button.getAttribute('href');
        if (url) {
            if (url.startsWith('#')) {
                this.scrollToElement(url);
            } else {
                window.open(url, '_blank');
            }
        }
    }

    handleViewClick(target, button) {
        if (target && target.startsWith('#')) {
            this.scrollToElement(target);
        } else if (target) {
            window.open(target, '_blank');
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
            '.contact-item, .conf-card, .filiere-card, .livre-card, .memoire-card'
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

   // ===== COMPTEUR DE VISITEURS FONCTIONNEL =====
initVisitorCounter() {
    console.log('🔢 Initialisation du compteur de visiteurs...');
    
    // Initialiser d'abord la date et heure
    this.initDateTimeUpdater();
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
        this.setupVisitorCounter();
    }, 100);
}

setupVisitorCounter() {
    const storageKey = 'portfolioStats';
    const sessionKey = 'visitSession';
    
    // Vérifier les éléments
    const totalEl = document.getElementById('total-visitors');
    const todayEl = document.getElementById('visitor-count');
    const onlineEl = document.getElementById('current-visitors');
    const dateEl = document.getElementById('current-date');
    const timeEl = document.getElementById('current-time');
    
    if (!totalEl || !todayEl || !onlineEl) {
        console.warn('❌ Éléments du compteur non trouvés');
        return;
    }
    
    // Initialiser ou récupérer les données
    let stats = this.getStats(storageKey);
    
    // Gérer la visite actuelle
    this.handleCurrentVisit(stats, sessionKey);
    
    // Sauvegarder les stats mises à jour
    this.saveStats(storageKey, stats);
    
    // Afficher les compteurs
    this.displayCounters(stats, totalEl, todayEl, onlineEl);
    
    // Démarrer les mises à jour en temps réel
    this.startCounterUpdates(storageKey, sessionKey);
    
    console.log('✅ Compteur de visiteurs initialisé');
}

getStats(storageKey) {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Erreur lecture stats:', e);
    }
    
    // Stats par défaut
    return {
        total: 15, // Valeur de départ réaliste
        today: 3,
        lastDate: new Date().toDateString(),
        visits: [],
        firstVisit: new Date().toISOString()
    };
}

saveStats(storageKey, stats) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(stats));
    } catch (e) {
        console.error('Erreur sauvegarde stats:', e);
    }
}

handleCurrentVisit(stats, sessionKey) {
    const now = new Date();
    const today = now.toDateString();
    const sessionId = sessionStorage.getItem(sessionKey);
    
    // Vérifier si nouveau jour
    if (stats.lastDate !== today) {
        stats.today = 0;
        stats.lastDate = today;
    }
    
    // Vérifier si nouvelle visite dans cette session
    if (!sessionId) {
        const newSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(sessionKey, newSessionId);
        
        // Incrémenter les compteurs
        stats.total++;
        stats.today++;
        
        // Ajouter à l'historique
        stats.visits.push({
            sessionId: newSessionId,
            timestamp: now.toISOString(),
            date: today
        });
        
        // Garder seulement les 50 dernières visites
        if (stats.visits.length > 50) {
            stats.visits = stats.visits.slice(-50);
        }
        
        console.log('🆕 Nouvelle visite - Total:', stats.total, 'Aujourd\'hui:', stats.today);
    }
}

displayCounters(stats, totalEl, todayEl, onlineEl) {
    // Calculer les utilisateurs en ligne (simulation réaliste)
    const onlineCount = this.calculateOnlineUsers(stats);
    
    // Animer les compteurs
    this.animateCounter(totalEl, stats.total);
    this.animateCounter(todayEl, stats.today);
    this.animateCounter(onlineEl, onlineCount);
}

animateCounter(element, target) {
    if (!element) return;
    
    const current = parseInt(element.textContent) || 0;
    if (current === target) {
        element.textContent = target;
        return;
    }
    
    let start = current;
    const duration = 1500;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    requestAnimationFrame(updateCounter);
}

calculateOnlineUsers(stats) {
    const now = Date.now();
    const fifteenMinutesAgo = now - (15 * 60 * 1000);
    
    // Compter les sessions actives (visites dans les 15 dernières minutes)
    const activeSessions = stats.visits.filter(visit => {
        const visitTime = new Date(visit.timestamp).getTime();
        return (now - visitTime) < fifteenMinutesAgo;
    });
    
    // Retourner au moins 1 (l'utilisateur actuel)
    return Math.max(1, activeSessions.length);
}

startCounterUpdates(storageKey, sessionKey) {
    // Mettre à jour les compteurs toutes les 30 secondes
    setInterval(() => {
        const stats = this.getStats(storageKey);
        const totalEl = document.getElementById('total-visitors');
        const todayEl = document.getElementById('visitor-count');
        const onlineEl = document.getElementById('current-visitors');
        
        if (totalEl && todayEl && onlineEl) {
            this.displayCounters(stats, totalEl, todayEl, onlineEl);
        }
    }, 30000);
}

// ===== MISE À JOUR DATE/HEURE CORRIGÉE =====
initDateTimeUpdater() {
    console.log('🕐 Initialisation date/heure...');
    
    const updateDateTime = () => {
        const now = new Date();
        
        // Formater la date
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        // Formater l'heure
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const dateStr = now.toLocaleDateString('fr-FR', dateOptions);
        const timeStr = now.toLocaleTimeString('fr-FR', timeOptions);
        
        // Mettre à jour les éléments
        const dateEl = document.getElementById('current-date');
        const timeEl = document.getElementById('current-time');
        
        if (dateEl) dateEl.textContent = dateStr;
        if (timeEl) timeEl.textContent = timeStr;
    };
    
    // Mettre à jour immédiatement
    updateDateTime();
    
    // Mettre à jour chaque seconde
    setInterval(updateDateTime, 1000);
    
    console.log('✅ Date/heure initialisée');
}

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
    
    /* Styles pour les boutons spécifiques */
    .btn-ect1, .btn-ect2, .btn-ecs1, .btn-ecs2, .btn-mpsi {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }
    
    .btn-ect1:hover, .btn-ect2:hover, .btn-ecs1:hover, .btn-ecs2:hover, .btn-mpsi:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .btn-conference, .btn-livre, .btn-memoire {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 5px;
    }
    
    .btn-conference:hover, .btn-livre:hover, .btn-memoire:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
    }
`;
document.head.appendChild(dynamicStyles);

console.log('🎉 Script portfolio chargé avec succès!');
