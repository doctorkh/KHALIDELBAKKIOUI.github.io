// Script JavaScript complet avec toutes les fonctionnalités
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeAll();
            this.setupConsoleWelcome();
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
    }

    setupConsoleWelcome() {
        console.log(`%cBienvenue sur le portfolio de Dr. Khalid EL BAKKIOUI`, 
            'color: #3498db; font-size: 16px; font-weight: bold;');
        console.log(`%cMathématicien • Enseignant CPGE • Chercheur en Probabilités`, 
            'color: #2c3e50; font-size: 14px;');
    }

    // Navigation Mobile
    initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Empêcher la fermeture lors du clic dans le menu
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Système d'onglets
    initTabs() {
        const tabContainers = document.querySelectorAll('.experience-tabs, .research-tabs, .documents-tabs, .filiere-tabs');
        
        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabPanes = container.querySelectorAll('.tab-pane');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.getAttribute('data-tab');
                    if (!tabId) return;
                    
                    // Retirer la classe active de tous les boutons et panneaux
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    
                    // Ajouter la classe active au bouton et panneau actuels
                    button.classList.add('active');
                    const activePane = container.querySelector(`#${tabId}`);
                    if (activePane) {
                        activePane.classList.add('active');
                    }
                    
                    // Animation des compteurs si nécessaire
                    if (tabId === 'publications' || tabId === 'conferences') {
                        this.animateCounters();
                    }
                });
            });
        });
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Fermer le menu mobile si ouvert
                    this.closeMobileMenu();
                }
            });
        });
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        const toggleBackToTop = () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Vérifier l'état initial
    }

    // Navigation Active State
    initScrollEffects() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const navbar = document.getElementById('navbar');
        
        if (!sections.length || !navLinks.length || !navbar) return;

        let lastScrollY = window.scrollY;
        
        const setActiveNav = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        const handleNavbarScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', () => {
            setActiveNav();
            handleNavbarScroll();
        });

        setActiveNav(); // Définir l'état initial
    }

    // Animations au Scroll
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Animation spécifique pour les barres de compétences
                    if (entry.target.classList.contains('chart-fill')) {
                        this.animateSkills();
                    }
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        const elementsToAnimate = document.querySelectorAll(
            'section, .profile-card, .pub-card, .doc-card, .exp-card, .competence-category, .timeline-item'
        );
        
        elementsToAnimate.forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
            
            // Simuler le chargement
            setTimeout(() => {
                el.classList.add('loaded');
            }, 100);
        });
    }

    // Animation des compétences
    animateSkills() {
        const chartFills = document.querySelectorAll('.chart-fill');
        
        chartFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            if (width) {
                fill.style.width = width + '%';
            }
        });
    }

    // Compteurs animés
    initCounters() {
        const stats = document.querySelectorAll('.stat h3');
        if (!stats.length) return;

        this.animateCounters = () => {
            stats.forEach(stat => {
                const text = stat.textContent.replace('+', '');
                const target = parseInt(text) || 0;
                if (target === 0) return;

                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, 30);
            });
        };

        // Démarrer l'animation des compteurs après un délai
        setTimeout(this.animateCounters, 1000);
    }

    // Formulaire de Contact
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupération des données du formulaire de manière sécurisée
            const formData = new FormData(contactForm);
            const data = {
                name: this.sanitizeInput(formData.get('name') || contactForm.querySelector('input[type="text"]')?.value),
                email: this.sanitizeInput(formData.get('email') || contactForm.querySelector('input[type="email"]')?.value),
                subject: this.sanitizeInput(formData.get('subject') || contactForm.querySelectorAll('input[type="text"]')[1]?.value),
                message: this.sanitizeInput(formData.get('message') || contactForm.querySelector('textarea')?.value)
            };
            
            // Validation des données
            if (!this.validateFormData(data)) {
                this.showNotification('Veuillez remplir tous les champs correctement.', 'error');
                return;
            }

            // Simulation d'envoi
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Simulation de succès
                this.showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Sanitisation des entrées
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Validation des données du formulaire
    validateFormData(data) {
        if (!data.name || data.name.length < 2) return false;
        if (!data.email || !this.isValidEmail(data.email)) return false;
        if (!data.subject || data.subject.length < 3) return false;
        if (!data.message || data.message.length < 10) return false;
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Système de notifications
    showNotification(message, type = 'info') {
        // Nettoyer les anciennes notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Fermer la notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Styles de notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.3rem',
            borderRadius: '50%',
            transition: 'background 0.3s ease'
        });
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });
        
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove après 5 secondes
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };
        return colors[type] || '#3498db';
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Gestion des téléchargements
    initDownloadTracking() {
        document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', (e) => {
                const fileName = link.getAttribute('href')?.split('/').pop();
                if (fileName) {
                    console.log(`Téléchargement de: ${fileName}`);
                    // Ici vous pourriez ajouter Google Analytics ou autre système de tracking
                }
            });
        });
    }

    // Mode sombre/clair
    initThemeToggle() {
        // Vérifier si le toggle existe déjà
        if (document.querySelector('.theme-toggle')) return;

        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.title = 'Changer le thème';
        themeToggle.setAttribute('aria-label', 'Changer le thème');
        
        Object.assign(themeToggle.style, {
            position: 'fixed',
            bottom: '90px',
            right: '30px',
            width: '50px',
            height: '50px',
            background: 'var(--secondary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Sauvegarder la préférence
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        
        // Charger la préférence sauvegardée
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Mise à jour de la date et heure
    initDateTimeUpdater() {
        const updateDateTime = () => {
            const now = new Date();
            
            // Format de la date
            const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('fr-FR', optionsDate);
            const dateElement = document.getElementById('current-date');
            if (dateElement) dateElement.textContent = dateString;
            
            // Format de l'heure
            const timeString = now.toLocaleTimeString('fr-FR');
            const timeElement = document.getElementById('current-time');
            if (timeElement) timeElement.textContent = timeString;
        };
        
        // Mettre à jour l'heure toutes les secondes
        setInterval(updateDateTime, 1000);
        updateDateTime(); // Appel initial
    }

    // Compteur de visiteurs
    initVisitorCounter() {
        let visitorCount = localStorage.getItem('visitorCount') || 0;
        visitorCount = parseInt(visitorCount) + 1;
        localStorage.setItem('visitorCount', visitorCount);
        
        const visitorElement = document.getElementById('visitor-count');
        if (visitorElement) {
            visitorElement.textContent = visitorCount.toLocaleString('fr-FR');
        }
    }

    // Optimisation des performances
    initPerformanceOptimizations() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });

        // Gestion des erreurs de chargement d'images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.style.display = 'none';
                console.warn('Image failed to load:', e.target.src);
            }
        }, true);

        // Service Worker pour PWA (optionnel)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch((err) => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2) !important;
    }
    
    .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
    }

    /* Styles pour le mode sombre */
    .dark-mode {
        --primary: #3498db;
        --secondary: #ecf0f1;
        --light: #2c3e50;
        --dark: #ecf0f1;
        --text: #ecf0f1;
        background: #34495e;
        color: #ecf0f1;
    }
    
    .dark-mode .section.bg-light {
        background: #2c3e50;
    }
    
    .dark-mode .profile-card,
    .dark-mode .competence-category,
    .dark-mode .timeline-content,
    .dark-mode .doc-card,
    .dark-mode .pub-card,
    .dark-mode .exp-card,
    .dark-mode .contact-form,
    .dark-mode .ressource-category,
    .dark-mode .tab-button {
        background: #2c3e50;
        color: #ecf0f1;
        border-color: #34495e;
    }
    
    .dark-mode .nav-menu a {
        color: #ecf0f1;
    }
    
    .dark-mode .form-group input,
    .dark-mode .form-group textarea {
        background: #2c3e50;
        border-color: #34495e;
        color: #ecf0f1;
    }
    
    .dark-mode .footer {
        background: #2c3e50;
    }
    
    .dark-mode #navbar {
        background: #2c3e50;
    }
`;
document.head.appendChild(additionalStyles);