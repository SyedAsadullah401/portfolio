/**
 * Main JavaScript file for Syed Asadullah's Portfolio
 * Handles theme switching, animations, WebGL background, and interactions
 */

class PortfolioApp {
    constructor() {
        this.projects = [];
        this.currentTheme = 'dark';
        this.webglScene = null;
        this.isWebGLEnabled = false;
        
        this.init();
    }
    
    async init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.setupContactForm();
        await this.loadProjects();
        this.setupWebGL();
        this.setupScrollEffects();
    }
    
    /**
     * Theme Management
     */
    setupTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.setTheme(savedTheme);
        
        const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleFooter');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        const themeIcons = document.querySelectorAll('.theme-toggle i, .theme-toggle-footer i');
        themeIcons.forEach(icon => {
            icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
        });
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a subtle animation
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    /**
     * Navigation Management
     */
    setupNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for fixed header
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            this.updateActiveNavItem();
            this.updateHeaderBackground();
        });
    }
    
    updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector(`a[href="#${sectionId}"]`)?.classList.add('active');
            }
        });
    }
    
    updateHeaderBackground() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }
    
    /**
     * Animation Management
     */
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Animate skill progress bars
                    if (entry.target.classList.contains('skill-item')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all animatable elements
        document.querySelectorAll('.glass-card, .skill-item, .project-card, .certificate-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.progress-bar');
        if (progressBar) {
            const skillLevel = skillItem.getAttribute('data-skill');
            setTimeout(() => {
                progressBar.style.width = `${skillLevel}%`;
            }, 300);
        }
    }
    
    /**
     * Projects Management
     */
    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            this.projects = await response.json();
            this.renderProjects();
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.renderFallbackProjects();
        }
    }
    
    renderProjects() {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';
        
        this.projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            container.appendChild(projectCard);
        });
    }
    
    createProjectCard(project, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';
        
        col.innerHTML = `
            <div class="project-card glass-card p-0">
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                    <div class="project-overlay">
                        <a href="${project.live}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View ${project.title} live demo">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </div>
                </div>
                <div class="p-4">
                    <h4 class="project-title">${project.title}</h4>
                    <p class="project-description">${project.description}</p>
                    <div class="project-buttons d-flex gap-2">
                        <a href="${project.live}" target="_blank" rel="noopener noreferrer" class="btn btn-gradient btn-sm">
                            <i class="bi bi-box-arrow-up-right me-1"></i>Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add entrance animation delay
        col.style.animationDelay = `${index * 0.1}s`;
        
        return col;
    }
    
    renderFallbackProjects() {
        const fallbackProjects = [
            {
                title: "JAVA IN MY STYLE",
                image: "./java.png",
                description: "Deep learning model for image classification using TensorFlow and CNN architecture.",
                
                live: "https://techinmystyle.com/java%20in%20my%20style/"
            },
            {
                title: "JAVASCRIPT INTERMEDIATE IN MY STYLE",
                image: "./JAVASCRIPT.png",
                description: "Interactive dashboard for data visualization and analytics using Python and Streamlit.",
                
                live: "https://techinmystyle.com/javascript%20in%20my%20style%20-%20intermediate/"
            },
            {
                title: "ML IN MY STYLE",
                image: "./ml.png",
                description: "Real-time object detection and recognition using OpenCV and YOLO algorithm.",
                
                live: "https://techinmystyle.com/ml%20in%20my%20style/"
            },
            {
                title: "AI IN MY STYLE",
                image: "./ai.png",
                description: "Real-time object detection and recognition using OpenCV and YOLO algorithm.",
                
                live: "https://techinmystyle.com/ai%20in%20my%20style/"
            }
        ];
        
        this.projects = fallbackProjects;
        this.renderProjects();
    }
    
    /**
     * Contact Form Management
     */
    setupContactForm() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.handleFormSubmission(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required.';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address.';
            }
        }
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = message;
            }
        }
        
        return isValid;
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const name = formData.get('contactName') || document.getElementById('contactName').value;
        const email = formData.get('contactEmail') || document.getElementById('contactEmail').value;
        const message = formData.get('contactMessage') || document.getElementById('contactMessage').value;
        
        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:syed.asadullah@example.com?subject=${subject}&body=${body}`;
        
        // Show toast notification
        this.showToast();
        
        // Open email client
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }
    
    showToast() {
        const toast = new bootstrap.Toast(document.getElementById('contactToast'));
        toast.show();
    }
    
    /**
     * WebGL Background
     */
    setupWebGL() {
        // Only enable WebGL on larger screens and capable devices
        if (window.innerWidth > 768 && this.isWebGLSupported()) {
            this.initWebGL();
            this.isWebGLEnabled = true;
        }
    }
    
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }
    
    initWebGL() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particle system
        this.createParticleSystem(scene);
        
        // Position camera
        camera.position.z = 30;
        
        // Animation loop
        const animate = () => {
            if (this.isWebGLEnabled) {
                requestAnimationFrame(animate);
                
                // Rotate particles slowly
                const particles = scene.getObjectByName('particles');
                if (particles) {
                    particles.rotation.x += 0.001;
                    particles.rotation.y += 0.002;
                }
                
                renderer.render(scene, camera);
            }
        };
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.isWebGLEnabled = false;
                canvas.style.display = 'none';
            } else if (!this.isWebGLEnabled && this.isWebGLSupported()) {
                this.isWebGLEnabled = true;
                canvas.style.display = 'block';
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
        
        this.webglScene = { scene, camera, renderer };
    }
    
    createParticleSystem(scene) {
        const particleCount = 150;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Random positions
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            // Gradient colors (purple to blue)
            const t = Math.random();
            colors[i * 3] = 0.4 + t * 0.2;     // R
            colors[i * 3 + 1] = 0.2 + t * 0.4; // G
            colors[i * 3 + 2] = 0.8 + t * 0.2; // B
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, material);
        particleSystem.name = 'particles';
        scene.add(particleSystem);
    }
    
    /**
     * Scroll Effects
     */
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
        
        // Update WebGL scene based on scroll
        if (this.webglScene && this.isWebGLEnabled) {
            const particles = this.webglScene.scene.getObjectByName('particles');
            if (particles) {
                particles.rotation.z = scrolled * 0.0001;
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Service Worker Registration (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could implement error reporting here
});

// Handle visibility changes (pause animations when tab is not visible)
document.addEventListener('visibilitychange', () => {
    const app = window.portfolioApp;
    if (app && app.isWebGLEnabled) {
        if (document.hidden) {
            app.isWebGLEnabled = false;
        } else {
            app.isWebGLEnabled = true;
        }
    }
});
