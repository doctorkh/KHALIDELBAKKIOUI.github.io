// Script JavaScript complet avec toutes les fonctionnalités améliorées
class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.scrollDirection = 'down';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeAll();
            this.setupConsoleWelcome();
            this.setupErrorHandling();
        });
    }

    initializeAll() {
        this.initNavigation();
        this.initTabs();
        this.initSmoothScrolling();
        this.initBackToTop();
        this.initAnimations();
        this.initContactForm();
        this.initCounters();
        this.initScrollEffects();
        this.initDownloadTracking();
        this.initThemeToggle();
        this.initPerformanceOptimizations();
        this.initDateTimeUpdater();
        this.initVisitorCounter();
        this.initImageLazyLoading();
        this.initPrintStyles();
        this.initKeyboardNavigation();
        this.initParticleEffects();
    }

    setupConsoleWelcome() {
        const styles = [
            'background: linear-gradient(135deg, #667eea, #764ba2)',
            'color: white',
            'padding: 12px 24px',
            'border-radius: 8px',
            'font-size: 16px',
            'font-weight: bold',
            'text-shadow: 1px 1px 2px rgba(0,0,0,0.3)'
        ].join(';');
        
        const subtitleStyles = [
            'color: #2c3e50',
            'font-size: 14px',
            'font-weight: 500',
            'padding: 4px 0'
        ].join(';');

        console.log('%c🎓 Bienvenue sur le portfolio de Dr. Khalid EL BAKKIOUI', styles);
        console.log('%cMathématicien • Enseignant CPGE • Chercheur en Probabilités', subtitleStyles);
        console.log('%c✨ Site optimisé avec des animations fluides et un design moderne', 'color: #27ae60; font-size: 12px;');
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            this.showNotification('Une erreur est survenue. Veuillez rafraîchir la page.', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
            e.preventDefault();
        });
    }

    // Navigation Mobile améliorée
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

        // Empêcher la fermeture lors du clic dans le menu
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Fermer le menu lors du redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Animation de la navbar au scroll
        if (navbar) {
            window.addEventListener('scroll', () => {
                this.handleNavbarScroll(navbar);
            });
        }
    }

    toggleMobileMenu(navMenu, navToggle) {
        const isOpening = !navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animation smooth
        if (isOpening) {
            navMenu.style.transform = 'translateY(0)';
            navMenu.style.opacity = '1';
        } else {
            navMenu.style.transform = 'translateY(-20px)';
            navMenu.style.opacity = '0';
        }
        
        // Empêcher le scroll du body quand le menu est ouvert
        document.body.style.overflow = isOpening ? 'hidden' : '';
    }

    closeMobileMenu(navMenu, navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleNavbarScroll(navbar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
            
            // Direction du scroll pour l'animation
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

    // Système d'onglets amélioré
    initTabs() {
        const tabContainers = document.querySelectorAll('.experience-tabs, .research-tabs, .documents-tabs, .filiere-tabs');
        
        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabPanes = container.querySelectorAll('.tab-pane');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.switchTab(container, button, tabButtons, tabPanes);
                });
                
                // Navigation au clavier
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.switchTab(container, button, tabButtons, tabPanes);
                    }
                });
            });
        });
    }

    switchTab(container, button, tabButtons, tabPanes) {
        const tabId = button.getAttribute('data-tab');
        if (!tabId) return;
        
        // Animation de transition
        container.style.opacity = '0.7';
        
        setTimeout(() => {
            // Retirer la classe active de tous les boutons et panneaux
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.setAttribute('aria-hidden', 'true');
            });
            
            // Ajouter la classe active au bouton et panneau actuels
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            const activePane = container.querySelector(`#${tabId}`);
            if (activePane) {
                activePane.classList.add('active');
                activePane.setAttribute('aria-hidden', 'false');
                
                // Animation d'apparition
                activePane.style.animation = 'fadeInUp 0.6s ease-out';
            }
            
            container.style.opacity = '1';
            
            // Animation des compteurs si nécessaire
            if (tabId === 'publications' || tabId === 'conferences') {
                this.animateCounters();
            }
            
            // Track dans l'URL (optionnel)
            this.updateUrlHash(tabId);
        }, 150);
    }

    updateUrlHash(tabId) {
        // Optionnel: mettre à jour l'URL sans recharger la page
        if (history.pushState) {
            const newUrl = `${window.location.pathname}#${tabId}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    // Smooth Scrolling amélioré
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                this.scrollToElement(targetId);
            });
        });
    }

    scrollToElement(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Mettre à jour l'URL
            if (history.pushState) {
                const newUrl = `${window.location.pathname}${targetId}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
            
            this.closeMobileMenu(
                document.querySelector('.nav-menu'),
                document.querySelector('.nav-toggle')
            );
        }
    }

    // Back to Top Button amélioré
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const toggleBackToTop = () => {
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
        
        // Animation au hover
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.transform = 'scale(1)';
            }
        });
        
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
    }

    // Navigation Active State améliorée
    initScrollEffects() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        const setActiveNav = () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                    
                    // Animation du soulignement
                    link.style.setProperty('--underline-width', '100%');
                } else {
                    link.style.setProperty('--underline-width', '0%');
                }
            });
        };

        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                window.requestAnimationFrame(() => {
                    setActiveNav();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }
        });

        setActiveNav();
    }

    // Animations au Scroll avancées
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll(
            '.profile-card, .pub-card, .doc-card, .exp-card, .competence-category, .timeline-item, .stat, .ressource-item'
        );
        
        elementsToAnimate.forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
        });

        // Animation du hero
        this.animateHero();
    }

    animateElement(element) {
        element.classList.add('fade-in', 'loaded');
        
        // Animation spécifique selon le type d'élément
        if (element.classList.contains('stat')) {
            this.animateCounterElement(element.querySelector('h3'));
        }
        
        if (element.classList.contains('profile-card')) {
            this.animateProfileCard(element);
        }
    }

    animateHero() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-contact, .hero-stats, .hero-buttons');
        
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
        });
    }

    animateProfileCard(card) {
        const icon = card.querySelector('.profile-icon');
        if (icon) {
            icon.style.animation = 'bounceIn 1s ease-out';
        }
    }

    // Compteurs animés améliorés
    initCounters() {
        this.animateCounters = () => {
            const stats = document.querySelectorAll('.stat h3');
            
            stats.forEach(stat => {
                const text = stat.textContent.replace('+', '');
                const target = parseInt(text) || 0;
                if (target === 0) return;

                let current = 0;
                const duration = 2000; // 2 secondes
                const increment = target / (duration / 16); // 60fps
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    
                    current = target * easeOutQuart;
                    
                    if (progress < 1) {
                        stat.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(animate);
                    } else {
                        stat.textContent = target + '+';
                    }
                };

                requestAnimationFrame(animate);
            });
        };

        // Démarrer l'animation quand les stats sont visibles
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(this.animateCounters, 500);
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
    }

    animateCounterElement(counter) {
        // Animation spécifique pour un compteur individuel
        counter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 300);
    }

    // Formulaire de Contact amélioré
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
                this.clearFieldError(input);
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
                if (field.name === 'name' && value.length < 2) {
                    isValid = false;
                    message = 'Le nom doit contenir au moins 2 caractères';
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Veuillez entrer une adresse email valide';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    message = 'Le message doit contenir au moins 10 caractères';
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
        this.clearFieldError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    showFieldSuccess(field) {
        this.clearFieldError(field);
        field.classList.add('success');
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async submitForm(form) {
        const formData = new FormData(form);
        const data = {
            name: this.sanitizeInput(formData.get('name') || form.querySelector('input[type="text"]')?.value),
            email: this.sanitizeInput(formData.get('email') || form.querySelector('input[type="email"]')?.value),
            subject: this.sanitizeInput(formData.get('subject') || form.querySelectorAll('input[type="text"]')[1]?.value),
            message: this.sanitizeInput(formData.get('message') || form.querySelector('textarea')?.value)
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Animation de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        try {
            // Simulation d'envoi (remplacer par une vraie requête API)
            await this.simulateApiCall(data);
            
            this.showNotification('🎉 Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
            form.reset();
            
            // Réinitialiser les styles des champs
            form.querySelectorAll('input, textarea').forEach(field => {
                this.clearFieldError(field);
            });
            
        } catch (error) {
            this.showNotification('❌ Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateApiCall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulation de succès (toujours réussir pour la démo)
                console.log('Données du formulaire:', data);
                resolve({ success: true });
                
                // Pour simuler une erreur, décommentez la ligne suivante:
                // reject(new Error('Erreur de connexion'));
            }, 2000);
        });
    }

    // Système de notifications amélioré
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        
        const colors = {
            success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            info: 'linear-gradient(135deg, #3498db, #2980b9)',
            warning: 'linear-gradient(135deg, #f39c12, #e67e22)'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Fermer la notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: colors[type] || colors.info,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.3)';
            this.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
            this.style.transform = 'scale(1)';
        });
        
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove après la durée spécifiée
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
        
        return notification;
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Gestion des téléchargements avec analytics
    initDownloadTracking() {
        document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', (e) => {
                const fileName = link.getAttribute('href')?.split('/').pop();
                const fileType = fileName?.split('.').pop();
                
                if (fileName) {
                    console.log(`📥 Téléchargement: ${fileName} (${fileType})`);
                    
                    // Analytics simulation
                    this.trackDownload(fileName, fileType);
                    
                    // Notification de téléchargement
                    this.showNotification(`Téléchargement de ${fileName}`, 'info', 3000);
                }
            });
        });
    }

    trackDownload(fileName, fileType) {
        // Ici vous pourriez intégrer Google Analytics ou autre système de tracking
        const downloadEvent = {
            event: 'file_download',
            file_name: fileName,
            file_type: fileType,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Tracking download:', downloadEvent);
        
        // Exemple avec localStorage pour le suivi
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
        downloads.push(downloadEvent);
        localStorage.setItem('downloads', JSON.stringify(downloads));
    }

    // Mode sombre/clair amélioré
    initThemeToggle() {
        if (document.querySelector('.theme-toggle')) return;

        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.title = 'Changer le thème';
        themeToggle.setAttribute('aria-label', 'Changer le thème');
        
        Object.assign(themeToggle.style, {
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '50px',
            height: '50px',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(10px)'
        });
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme(themeToggle);
        });
        
        // Charger la préférence sauvegardée
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.style.background = 'var(--gradient-warning)';
        }
        
        // Animation au hover
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.1) rotate(15deg)';
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1) rotate(0)';
        });
    }

    toggleTheme(themeToggle) {
        const isDark = document.body.classList.toggle('dark-mode');
        
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.style.background = isDark ? 'var(--gradient-warning)' : 'var(--gradient-primary)';
        
        // Animation
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Notification
        this.showNotification(
            `Mode ${isDark ? 'sombre' : 'clair'} activé`, 
            'info', 
            2000
        );
    }

    // Mise à jour de la date et heure en temps réel
    initDateTimeUpdater() {
        const updateDateTime = () => {
            const now = new Date();
            
            // Format de la date
            const optionsDate = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateString = now.toLocaleDateString('fr-FR', optionsDate);
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                dateElement.textContent = dateString;
                dateElement.style.setProperty('--pulse-animation', 'pulse 2s infinite');
            }
            
            // Format de l'heure
            const timeString = now.toLocaleTimeString('fr-FR');
            const timeElement = document.getElementById('current-time');
            if (timeElement) {
                timeElement.textContent = timeString;
                timeElement.style.animation = 'pulse 2s infinite';
            }
        };
        
        setInterval(updateDateTime, 1000);
        updateDateTime();
    }
    // Compteur de visiteurs avec statistiques - VERSION CORRIGÉE
initVisitorCounter() {
    try {
        const today = new Date().toDateString();
        
        // Charger ou initialiser les statistiques
        let stats = JSON.parse(localStorage.getItem('visitorStats') || '{}');
        
        // CORRECTION : Initialiser proprement les valeurs
        if (!stats.total || typeof stats.total !== 'number') {
            stats.total = 0;
        }
        if (!stats.daily || typeof stats.daily !== 'number') {
            stats.daily = 0;
        }
        
        // CORRECTION : Incrémenter TOUJOURS le total
        stats.total = stats.total + 1;
        
        // Gestion des visites quotidiennes
        if (stats.lastVisit !== today) {
            stats.daily = 1; // Nouveau jour = recommencer à 1
        } else {
            stats.daily = stats.daily + 1; // Même jour = incrémenter
        }
        
        stats.lastVisit = today;
        
        // Sauvegarder
        localStorage.setItem('visitorStats', JSON.stringify(stats));
        
        // Mettre à jour l'affichage
        const visitorElement = document.getElementById('visitor-count');
        const totalElement = document.getElementById('total-visitors');
        const currentElement = document.getElementById('current-visitors');
        
        if (visitorElement) visitorElement.textContent = stats.daily.toLocaleString('fr-FR');
        if (totalElement) totalElement.textContent = stats.total.toLocaleString('fr-FR');
        if (currentElement) currentElement.textContent = '1';
        
    } catch (error) {
        console.error('Erreur compteur visiteurs:', error);
    }
}

    // Chargement différé des images
    initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
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

    // Styles d'impression
    initPrintStyles() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .nav-toggle, .theme-toggle, .back-to-top,
                .hero-buttons, .notification {
                    display: none !important;
                }
                
                .hero {
                    background: white !important;
                    color: black !important;
                }
                
                .section {
                    break-inside: avoid;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }

    // Navigation au clavier
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape pour fermer les modals/menus
            if (e.key === 'Escape') {
                this.closeMobileMenu(
                    document.querySelector('.nav-menu'),
                    document.querySelector('.nav-toggle')
                );
            }
            
            // Tab pour la navigation
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Effets de particules pour le hero (optionnel)
    initParticleEffects() {
        // Simple effet de particules pour le hero
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                pointer-events: none;
            `;
            
            hero.appendChild(particle);
            
            // Animation aléatoire
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            
            Object.assign(particle.style, {
                left: startX + 'px',
                top: startY + 'px',
                animation: `float ${5 + Math.random() * 10}s linear infinite`
            });
            
            // Supprimer après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 15000);
        };
        
        // Créer quelques particules
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 300);
        }
    }

    // Optimisation des performances
    initPerformanceOptimizations() {
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 250);
        });

        // Gestion des erreurs de ressources
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Image non chargée:', e.target.src);
                e.target.style.opacity = '0';
            }
        }, true);

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            // Ajouter les ressources critiques ici
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    // Utilitaires
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
}

// Initialiser l'application
new PortfolioApp();

// Ajout des styles CSS pour les animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
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
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.3) !important;
    }
    
    .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary) !important;
        outline-offset: 2px !important;
    }
    
    .loading {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .loaded {
        opacity: 1;
        transform: translateY(0);
    }
    
    .fade-in {
        animation: fadeInUp 0.8s ease-out both;
    }
    
    /* Styles pour le mode sombre amélioré */
    .dark-mode {
        --primary: #3b82f6;
        --primary-dark: #2563eb;
        --secondary: #8b5cf6;
        --light: #1e293b;
        --dark: #f8fafc;
        --text: #e2e8f0;
        --text-muted: #94a3b8;
        --border: #334155;
        background: #0f172a;
        color: #e2e8f0;
    }
    
    .dark-mode .section.bg-light {
        background: linear-gradient(135deg, #1e293b, #334155);
    }
    
    .dark-mode .profile-card,
    .dark-mode .competence-category,
    .dark-mode .timeline-content,
    .dark-mode .doc-card,
    .dark-mode .pub-card,
    .dark-mode .exp-card,
    .dark-mode .contact-form,
    .dark-mode .ressource-category,
    .dark-mode .tab-button,
    .dark-mode .contact-item {
        background: #1e293b;
        color: #e2e8f0;
        border-color: #334155;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    
    .dark-mode .nav-menu a {
        color: #e2e8f0;
    }
    
    .dark-mode .form-group input,
    .dark-mode .form-group textarea {
        background: #1e293b;
        border-color: #334155;
        color: #e2e8f0;
    }
    
    .dark-mode .form-group input:focus,
    .dark-mode .form-group textarea:focus {
        background: #1e293b;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
    
    .dark-mode .footer {
        background: #1e293b;
    }
    
    .dark-mode #navbar {
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(20px);
    }
    
    .dark-mode .hero-info-bar {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Styles de validation de formulaire */
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
    
    /* Amélioration de l'accessibilité */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(additionalStyles);

// Service Worker pour PWA (optionnel)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ ServiceWorker enregistré avec succès');
            })
            .catch((err) => {
                console.log('❌ Échec de l\'enregistrement du ServiceWorker: ', err);
            });
    });
}
// Exemple : changer la couleur au clic
document.querySelector('.nav-logo').addEventListener('click', function() {
    this.style.color = '#e74c3c';
});
