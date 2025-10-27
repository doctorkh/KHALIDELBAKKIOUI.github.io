// ===== APPLICATION PORTFOLIO AMÉLIORÉE =====
class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.scrollDirection = 'down';
        this.currentTheme = 'light';
        this.observers = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
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
        this.initPrintStyles();
        this.initKeyboardNavigation();
        this.initAccessibility();
        this.initParticleEffects();
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
            console.log('%c✨ JavaScript optimisé et sécurisé', 'color: #27ae60;');
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            this.showNotification('Une erreur est survenue.', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
            this.showNotification('Erreur de chargement.', 'error');
            e.preventDefault();
        });
    }

    // ===== NAVIGATION AMÉLIORÉE =====
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.getElementById('navbar');
        
        if (!navToggle || !navMenu) return;

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
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpening ? 'hidden' : '';
        
        // Animation
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
                this.scrollDirection = 'down';
                navbar.style.transform = 'translateY(-100%)';
            } else {
                this.scrollDirection = 'up';
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScrollTop = scrollTop;
    }

    // ===== SYSTÈME D'ONGLETS =====
    initTabs() {
        const tabContainers = document.querySelectorAll('.tab-buttons');
        
        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabGroup = container.getAttribute('data-tab-group') || 'default';
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.switchTab(button, tabGroup);
                });
                
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.switchTab(button, tabGroup);
                    }
                    
                    // Navigation fléchée
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.navigateTabs(button, e.key, tabButtons);
                    }
                });
            });
        });
    }

    switchTab(button, tabGroup) {
        const tabId = button.getAttribute('data-tab');
        if (!tabId) return;
        
        const container = button.closest('.tab-buttons').parentElement;
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        // Animation de transition
        container.style.opacity = '0.7';
        
        setTimeout(() => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.setAttribute('aria-hidden', 'true');
            });
            
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
                activePane.setAttribute('aria-hidden', 'false');
                activePane.style.animation = 'fadeInUp 0.4s ease-out';
            }
            
            container.style.opacity = '1';
            
            // Sauvegarder l'onglet actif
            localStorage.setItem(`activeTab-${tabGroup}`, tabId);
            
        }, 150);
    }

    navigateTabs(currentButton, direction, tabButtons) {
        const currentIndex = Array.from(tabButtons).indexOf(currentButton);
        let newIndex;
        
        if (direction === 'ArrowRight') {
            newIndex = (currentIndex + 1) % tabButtons.length;
        } else {
            newIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        }
        
        tabButtons[newIndex].click();
        tabButtons[newIndex].focus();
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
        
        // Mettre à jour l'URL sans rechargement
        if (history.pushState) {
            history.pushState(null, null, targetId);
        }
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const toggleVisibility = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'scale(1)';
            } else {
                backToTop.classList.remove('visible');
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'scale(0.8)';
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

        // Éléments à animer
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
                
                // Easing function
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

        // Validation en temps réel
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
        
        // État de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            await this.sendFormData(data);
            this.showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            
            // Réinitialiser les champs
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
        // Simulation d'envoi - À REMPLACER par votre endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Données du formulaire:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // ===== SYSTÈME DE NOTIFICATIONS =====
    showNotification(message, type = 'info', duration = 5000) {
        // Éviter les doublons
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
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto-fermeture
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

    // ===== COMPTEUR DE VISITEURS CORRIGÉ =====
    initVisitorCounter() {
        try {
            const today = new Date().toDateString();
            let stats = JSON.parse(localStorage.getItem('portfolioStats') || '{}');
            
            // Initialisation des statistiques
            if (!stats.initialized) {
                stats = {
                    initialized: true,
                    total: 0,
                    daily: {},
                    startDate: today
                };
            }
            
            // Visite du jour
            if (!stats.daily[today]) {
                stats.daily[today] = 0;
            }
            
            // Incrémentation sécurisée
            stats.total = (stats.total || 0) + 1;
            stats.daily[today] = (stats.daily[today] || 0) + 1;
            
            // Nettoyage des anciennes données (garder 30 jours)
            this.cleanupOldStats(stats);
            
            // Sauvegarde
            localStorage.setItem('portfolioStats', JSON.stringify(stats));
            
            // Mise à jour de l'affichage
            this.updateVisitorDisplay(stats, today);
            
        } catch (error) {
            console.warn('Erreur compteur visiteurs:', error);
        }
    }

    cleanupOldStats(stats) {
        const now = new Date();
        const daysToKeep = 30;
        
        Object.keys(stats.daily).forEach(dateStr => {
            const date = new Date(dateStr);
            const diffTime = now - date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > daysToKeep) {
                delete stats.daily[dateStr];
            }
        });
    }

    updateVisitorDisplay(stats, today) {
        const visitorElement = document.getElementById('visitor-count');
        const totalElement = document.getElementById('total-visitors');
        const currentElement = document.getElementById('current-visitors');
        
        if (visitorElement) {
            visitorElement.textContent = stats.daily[today].toLocaleString('fr-FR');
        }
        if (totalElement) {
            totalElement.textContent = stats.total.toLocaleString('fr-FR');
        }
        if (currentElement) {
            // Simulation de visiteurs en ligne
            currentElement.textContent = Math.max(1, Math.floor(Math.random() * 3) + 1);
        }
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
        
        // Charger le thème sauvegardé
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
        const updateDateTime = () => {
            const now = new Date();
            
            // Date formatée
            const dateOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('fr-FR', dateOptions);
            }
            
            // Heure formatée
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = now.toLocaleTimeString('fr-FR');
            }
        };
        
        setInterval(updateDateTime, 1000);
        updateDateTime();
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
        
        // Sauvegarde locale
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        downloads.push(downloadEvent);
        localStorage.setItem('downloads', JSON.stringify(downloads.slice(-50))); // Garder les 50 derniers
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
        // Debounce des events de resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recréer les observateurs si nécessaire
                this.cleanupObservers();
            }, 250);
        }, { passive: true });

        // Préchargement des ressources critiques
        this.preloadCriticalResources();
    }

    cleanupObservers() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
    }

    preloadCriticalResources() {
        const criticalImages = [
            // Ajouter les images critiques ici
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    initPrintStyles() {
        // Les styles d'impression sont gérés dans le CSS
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Échap pour fermer les menus
            if (e.key === 'Escape') {
                this.closeMobileMenu(
                    document.querySelector('.nav-menu'),
                    document.querySelector('.nav-toggle')
                );
            }
        });
    }

    initAccessibility() {
        // Ajouter les attributs ARIA manquants
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle && !navToggle.hasAttribute('aria-expanded')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
        }

        // Gestion du focus
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    initParticleEffects() {
        // Effet de particules simple pour le hero
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            hero.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 10000);
        };
        
        // Créer quelques particules au chargement
        for (let i = 0; i < 15; i++) {
            setTimeout(createParticle, i * 200);
        }
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
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

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
    
    /* Particules */
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255,255,255,0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: float 10s linear infinite;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
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

// ===== SERVICE WORKER POUR PWA (OPTIONNEL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré');
            })
            .catch((err) => {
                console.log('❌ Service Worker:', err);
            });
    });
}
<!-- === COMPTEUR DE VISITEURS - Script === -->
<script>
class VisitorCounter {
    constructor() {
        this.initializeStorage();
        this.updateDateTime();
        this.updateCounters();
        this.startRealTimeUpdates();
    }
    
    initializeStorage() {
        if (!localStorage.getItem('visitorData')) {
            const initialData = {
                total: 0,
                today: 0,
                lastVisit: null,
                dailyHistory: {}
            };
            localStorage.setItem('visitorData', JSON.stringify(initialData));
        }
    }
    
    getVisitorData() {
        return JSON.parse(localStorage.getItem('visitorData'));
    }
    
    saveVisitorData(data) {
        localStorage.setItem('visitorData', JSON.stringify(data));
    }
    
    updateCounters() {
        const now = new Date();
        const todayKey = now.toDateString();
        const data = this.getVisitorData();
        
        if (data.lastVisit !== todayKey) {
            data.today = 0;
            data.lastVisit = todayKey;
        }
        
        data.total++;
        data.today++;
        
        if (!data.dailyHistory[todayKey]) {
            data.dailyHistory[todayKey] = 0;
        }
        data.dailyHistory[todayKey]++;
        
        this.cleanupHistory(data);
        this.saveVisitorData(data);
        this.displayCounters(data);
        this.updateLastUpdateTime();
    }
    
    cleanupHistory(data) {
        const dates = Object.keys(data.dailyHistory);
        if (dates.length > 30) {
            const sortedDates = dates.sort();
            const datesToRemove = sortedDates.slice(0, dates.length - 30);
            datesToRemove.forEach(date => {
                delete data.dailyHistory[date];
            });
        }
    }
    
    displayCounters(data) {
        document.getElementById('totalCount').textContent = this.formatNumber(data.total);
        document.getElementById('todayCount').textContent = this.formatNumber(data.today);
        const onlineCount = this.calculateOnlineUsers();
        document.getElementById('onlineCount').textContent = this.formatNumber(onlineCount);
    }
    
    calculateOnlineUsers() {
        const baseOnline = 1;
        const randomFactor = Math.floor(Math.random() * 10);
        const timeFactor = this.getTimeBasedFactor();
        return Math.max(baseOnline, Math.floor(baseOnline + randomFactor * timeFactor));
    }
    
    getTimeBasedFactor() {
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 18) return 1.5;
        if (hour >= 19 && hour <= 23) return 1.2;
        return 0.8;
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    updateDateTime() {
        const now = new Date();
        const optionsDate = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('fr-FR', optionsDate);
        this.updateTime();
    }
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR');
        document.getElementById('currentTime').textContent = timeString;
    }
    
    updateLastUpdateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('fr-FR');
    }
    
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateTime();
        }, 1000);
        
        setInterval(() => {
            const data = this.getVisitorData();
            this.displayCounters(data);
        }, 30000);
    }
}

// Démarrer le compteur
document.addEventListener('DOMContentLoaded', function() {
    const counter = new VisitorCounter();
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const counter = new VisitorCounter();
    }
});
</script>
