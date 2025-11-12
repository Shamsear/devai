// ===== FORM VALIDATION & SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('waitlistForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const roleSelect = document.getElementById('role');
    const companyInput = document.getElementById('company');
    const updatesCheckbox = document.getElementById('updates');
    const termsCheckbox = document.getElementById('terms');
    const submitButton = form.querySelector('.form-submit');
    const successMessage = document.getElementById('formSuccess');
    const waitlistCount = document.getElementById('waitlistCount');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const roleError = document.getElementById('roleError');
    const termsError = document.getElementById('termsError');

    // Validation rules
    const validators = {
        name: (value) => {
            if (!value.trim()) {
                return 'Name is required';
            }
            if (value.trim().length < 2) {
                return 'Name must be at least 2 characters';
            }
            if (value.trim().length > 50) {
                return 'Name must be less than 50 characters';
            }
            if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                return 'Name can only contain letters, spaces, hyphens, and apostrophes';
            }
            return null;
        },

        email: (value) => {
            if (!value.trim()) {
                return 'Email address is required';
            }
            // RFC 5322 compliant email regex (simplified)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Must be a valid email address';
            }
            // Additional checks
            if (value.length > 254) {
                return 'Email address is too long';
            }
            // Check for common typos
            const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
            const domain = value.split('@')[1];
            if (domain && domain.includes('..')) {
                return 'Email address contains consecutive dots';
            }
            return null;
        },

        role: (value) => {
            if (!value) {
                return 'Please select your role';
            }
            return null;
        },

        terms: (checked) => {
            if (!checked) {
                return 'You must agree to the Terms of Service and Privacy Policy';
            }
            return null;
        }
    };

    // Real-time validation function
    const validateField = (input, errorElement, validatorFn) => {
        const value = input.type === 'checkbox' ? input.checked : input.value;
        const error = validatorFn(value);
        
        if (error) {
            input.classList.add('error');
            errorElement.textContent = error;
            return false;
        } else {
            input.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    };

    // Add real-time validation listeners
    nameInput.addEventListener('input', () => {
        validateField(nameInput, nameError, validators.name);
    });

    nameInput.addEventListener('blur', () => {
        validateField(nameInput, nameError, validators.name);
    });

    emailInput.addEventListener('input', () => {
        // Only validate on blur or when @ is typed for better UX
        if (emailInput.value.includes('@')) {
            validateField(emailInput, emailError, validators.email);
        }
    });

    emailInput.addEventListener('blur', () => {
        validateField(emailInput, emailError, validators.email);
    });

    roleSelect.addEventListener('change', () => {
        validateField(roleSelect, roleError, validators.role);
    });

    termsCheckbox.addEventListener('change', () => {
        validateField(termsCheckbox, termsError, validators.terms);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput, nameError, validators.name);
        const isEmailValid = validateField(emailInput, emailError, validators.email);
        const isRoleValid = validateField(roleSelect, roleError, validators.role);
        const isTermsValid = validateField(termsCheckbox, termsError, validators.terms);

        // Check if all validations passed
        if (isNameValid && isEmailValid && isRoleValid && isTermsValid) {
            // Disable submit button
            submitButton.disabled = true;
            submitButton.querySelector('.submit-text').textContent = 'Submitting...';

            // Simulate API call
            setTimeout(() => {
                // Get form data
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    role: roleSelect.value,
                    company: companyInput.value.trim() || null,
                    updates: updatesCheckbox.checked,
                    timestamp: new Date().toISOString()
                };

                // Log to console (in production, this would be an API call)
                console.log('Form submitted:', formData);

                // Store in localStorage (for demo purposes)
                const existingData = JSON.parse(localStorage.getItem('waitlistSubmissions') || '[]');
                existingData.push(formData);
                localStorage.setItem('waitlistSubmissions', JSON.stringify(existingData));

                // Hide form, show success message
                form.querySelector('.form-step').style.display = 'none';
                submitButton.style.display = 'none';
                successMessage.classList.add('active');

                // Update waitlist count
                const currentCount = parseInt(waitlistCount.textContent.replace(/[^0-9]/g, ''));
                const newCount = currentCount + 1;
                waitlistCount.textContent = `${newCount.toLocaleString()} developers waiting`;

                // Trigger confetti effect
                createConfetti();
            }, 1500);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // ===== INTERACTIVE FEATURES =====

    // Smooth scroll for CTA button
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards and testimonials
    document.querySelectorAll('.feature-card, .testimonial').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Add fade in animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Dynamic waitlist count animation
    let baseCount = 12547;
    setInterval(() => {
        if (Math.random() > 0.7) {
            baseCount += Math.floor(Math.random() * 3) + 1;
            waitlistCount.textContent = `${baseCount.toLocaleString()} developers waiting`;
            waitlistCount.style.animation = 'none';
            setTimeout(() => {
                waitlistCount.style.animation = 'pulse 0.5s';
            }, 10);
        }
    }, 8000);

    // Confetti effect on successful submission
    function createConfetti() {
        const colors = ['#00ff88', '#ff4d00', '#ffffff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3 + 2;
            const endX = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { 
                    transform: 'translateY(0) translateX(0) rotate(0deg)',
                    opacity: 1 
                },
                { 
                    transform: `translateY(100vh) translateX(${endX}px) rotate(${Math.random() * 360}deg)`,
                    opacity: 0 
                }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }

    // Input focus effects
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateX(5px)';
            input.parentElement.style.transition = 'transform 0.2s';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateX(0)';
        });
    });

    // Floating cards animation enhancement
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateY(-10px) rotate(${index % 2 === 0 ? 5 : -5}deg) scale(1.05)`;
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex = '';
        });
    });

    // Feature card interactive enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Email validation helper - suggest corrections
    emailInput.addEventListener('blur', () => {
        const value = emailInput.value.toLowerCase();
        const suggestions = {
            'gmail.con': 'gmail.com',
            'gmail.co': 'gmail.com',
            'gmial.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'outlok.com': 'outlook.com'
        };
        
        const domain = value.split('@')[1];
        if (domain && suggestions[domain]) {
            const correctedEmail = value.split('@')[0] + '@' + suggestions[domain];
            emailError.textContent = `Did you mean ${correctedEmail}?`;
            emailError.style.color = '#00ff88';
            emailError.style.cursor = 'pointer';
            emailError.onclick = () => {
                emailInput.value = correctedEmail;
                validateField(emailInput, emailError, validators.email);
                emailError.style.color = '';
                emailError.style.cursor = '';
                emailError.onclick = null;
            };
        }
    });

    // Character counter for name field
    nameInput.addEventListener('input', () => {
        const length = nameInput.value.length;
        const maxLength = 50;
        
        if (length > maxLength * 0.8) {
            nameError.textContent = `${maxLength - length} characters remaining`;
            nameError.style.color = length >= maxLength ? '#ff3366' : '#888888';
        }
    });

    // Keyboard navigation enhancement
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
            e.preventDefault();
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            if (nextElement && nextElement.type !== 'submit') {
                nextElement.focus();
            }
        }
    });

    // Add visual feedback for checkbox interactions
    const checkboxLabels = document.querySelectorAll('.checkbox-label');
    checkboxLabels.forEach(label => {
        label.addEventListener('mouseenter', () => {
            label.style.transform = 'translateX(3px)';
        });
        label.addEventListener('mouseleave', () => {
            label.style.transform = '';
        });
    });

    // Prevent form resubmission
    window.addEventListener('beforeunload', (e) => {
        if (submitButton.disabled && !successMessage.classList.contains('active')) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Debug mode - log validation state (remove in production)
    if (window.location.search.includes('debug=true')) {
        form.addEventListener('input', () => {
            console.log('Form state:', {
                name: validators.name(nameInput.value),
                email: validators.email(emailInput.value),
                role: validators.role(roleSelect.value),
                terms: validators.terms(termsCheckbox.checked)
            });
        });
    }

    // ===== EXPERIMENTAL VISUAL EFFECTS =====

    // Custom cursor effect on interactive elements
    const interactiveElements = document.querySelectorAll('.cta-button, .form-submit, .feature-card, .logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.style.cursor = 'none';
            createCustomCursor(el);
        });
        el.addEventListener('mouseleave', () => {
            document.body.style.cursor = 'auto';
            removeCustomCursor();
        });
    });

    function createCustomCursor(element) {
        const cursor = document.createElement('div');
        cursor.id = 'customCursor';
        cursor.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 2px solid #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.15s ease;
        `;
        document.body.appendChild(cursor);

        element.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 15 + 'px';
            cursor.style.top = e.clientY - 15 + 'px';
        });
    }

    function removeCustomCursor() {
        const cursor = document.getElementById('customCursor');
        if (cursor) cursor.remove();
    }

    // RGB split effect on title hover
    const heroTitle = document.querySelector('.hero-title');
    let isGlitching = false;

    heroTitle.addEventListener('mouseenter', () => {
        if (!isGlitching) {
            isGlitching = true;
            applyRGBSplit();
        }
    });

    function applyRGBSplit() {
        const titleLines = document.querySelectorAll('.title-line');
        let count = 0;
        const interval = setInterval(() => {
            titleLines.forEach(line => {
                const offset = Math.random() * 4 - 2;
                line.style.textShadow = `
                    ${offset}px 0 0 rgba(255, 0, 0, 0.7),
                    ${-offset}px 0 0 rgba(0, 255, 255, 0.7),
                    3px 3px 0 rgba(255, 77, 0, 0.3),
                    -2px -2px 0 rgba(0, 255, 136, 0.3)
                `;
            });
            count++;
            if (count > 10) {
                clearInterval(interval);
                titleLines.forEach(line => {
                    line.style.textShadow = '';
                });
                isGlitching = false;
            }
        }, 50);
    }

    // Random glitch effect on page load
    setTimeout(() => {
        triggerRandomGlitch();
    }, 2000);

    function triggerRandomGlitch() {
        const glitchElements = document.querySelectorAll('.feature-card, .badge, .stat-number');
        const randomEl = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        randomEl.style.animation = 'none';
        setTimeout(() => {
            randomEl.style.animation = '';
        }, 10);

        // Schedule next random glitch
        setTimeout(() => {
            triggerRandomGlitch();
        }, Math.random() * 10000 + 5000);
    }

    // Add noise texture overlay on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollDiff = Math.abs(window.scrollY - lastScrollY);
        if (scrollDiff > 50) {
            createNoiseFlash();
            lastScrollY = window.scrollY;
        }
    });

    function createNoiseFlash() {
        const noise = document.createElement('div');
        noise.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
            pointer-events: none;
            z-index: 9998;
            animation: noiseFlash 0.2s ease-out;
        `;
        document.body.appendChild(noise);
        setTimeout(() => noise.remove(), 200);
    }

    // Add CSS for noise flash animation
    const noiseStyle = document.createElement('style');
    noiseStyle.textContent = `
        @keyframes noiseFlash {
            0% { opacity: 0.2; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(noiseStyle);

    // Parallax effect on floating cards
    const floatingCardsContainer = document.querySelector('.hero-visual');
    if (floatingCardsContainer) {
        document.addEventListener('mousemove', (e) => {
            const cards = floatingCardsContainer.querySelectorAll('.floating-card');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            cards.forEach((card, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Typing effect on hero subtitle (runs once on load)
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < text.length) {
                subtitle.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, 30);
            }
        }

        setTimeout(typeChar, 500);
    }

    // Stats counter animation on scroll into view
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const cleanText = text.replace(/[^0-9.]/g, '');
        const target = parseFloat(cleanText);
        
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue;
            if (target >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            } else {
                displayValue = Math.floor(current).toString();
            }
            
            if (hasPlus) displayValue += '+';
            if (hasPercent) displayValue += '%';
            
            element.textContent = displayValue;
        }, 30);
    }
});

// Add page transition effect
window.addEventListener('load', () => {
    document.body.style.animation = 'pageLoad 0.5s ease-out';
    
    const pageLoadStyle = document.createElement('style');
    pageLoadStyle.textContent = `
        @keyframes pageLoad {
            0% { 
                opacity: 0;
                filter: blur(10px);
            }
            100% { 
                opacity: 1;
                filter: blur(0);
            }
        }
    `;
    document.head.appendChild(pageLoadStyle);
});

// ===== UTILITY FUNCTIONS =====

// Email domain validator (can be extended)
const commonEmailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'
];

// Detect if email is from a business domain
function isBusinessEmail(email) {
    const domain = email.split('@')[1];
    return domain && !commonEmailDomains.includes(domain.toLowerCase());
}

// Form data export (for testing)
function exportFormData() {
    const data = localStorage.getItem('waitlistSubmissions');
    if (data) {
        console.log('Waitlist submissions:', JSON.parse(data));
        return JSON.parse(data);
    }
    return [];
}

// Make export function available globally
window.exportWaitlistData = exportFormData;
