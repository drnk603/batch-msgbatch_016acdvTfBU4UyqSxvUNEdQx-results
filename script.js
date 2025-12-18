(function() {
    'use strict';

    window.__app = window.__app || {};

    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    function initBurgerMenu() {
        if (window.__app.burgerInitialized) return;
        window.__app.burgerInitialized = true;

        var toggle = document.querySelector('.c-nav__toggle, .navbar-toggler');
        var nav = document.querySelector('#main-nav');
        var body = document.body;

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var isOpen = nav.classList.contains('show');
            
            if (isOpen) {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            } else {
                nav.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
            }
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('show')) {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });

        var navLinks = nav.querySelectorAll('.nav-link');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        }

        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth >= 1024 && nav.classList.contains('show')) {
                nav.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        }, 250));
    }

    function initScrollEffects() {
        if (window.__app.scrollEffectsInitialized) return;
        window.__app.scrollEffectsInitialized = true;

        var sections = document.querySelectorAll('section[id], .l-section');
        var cards = document.querySelectorAll('.card');
        var images = document.querySelectorAll('img:not(.c-logo__img)');
        var buttons = document.querySelectorAll('.btn, .c-button');

        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(section);
        });

        cards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out ' + (index * 0.1) + 's, transform 0.6s ease-out ' + (index * 0.1) + 's';
            observer.observe(card);
        });

        images.forEach(function(img) {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(img);
        });

        buttons.forEach(function(btn) {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    function initRippleEffect() {
        if (window.__app.rippleInitialized) return;
        window.__app.rippleInitialized = true;

        var elements = document.querySelectorAll('.btn, .c-button, .nav-link, .card');

        elements.forEach(function(element) {
            element.style.position = 'relative';
            element.style.overflow = 'hidden';

            element.addEventListener('click', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple-animation 0.6s ease-out';

                this.appendChild(ripple);

                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        });

        var style = document.createElement('style');
        style.textContent = '@keyframes ripple-animation { from { transform: scale(0); opacity: 1; } to { transform: scale(2); opacity: 0; } }';
        document.head.appendChild(style);
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInitialized) return;
        window.__app.scrollSpyInitialized = true;

        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        var sections = [];

        navLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && href !== '#' && href !== '#!') {
                var section = document.querySelector(href);
                if (section) {
                    sections.push({ link: link, section: section });
                }
            }
        });

        function updateActiveLink() {
            var scrollPos = window.scrollY + 100;

            sections.forEach(function(item) {
                var sectionTop = item.section.offsetTop;
                var sectionBottom = sectionTop + item.section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    });
                    item.link.classList.add('active');
                    item.link.setAttribute('aria-current', 'page');
                }
            });
        }

        window.addEventListener('scroll', throttle(updateActiveLink, 100));
        updateActiveLink();
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInitialized) return;
        window.__app.smoothScrollInitialized = true;

        document.addEventListener('click', function(e) {
            var target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            if (!target) return;

            var href = target.getAttribute('href');
            if (!href || !href.startsWith('#') || href === '#' || href === '#!') return;

            var element = document.querySelector(href);
            if (!element) return;

            e.preventDefault();

            var header = document.querySelector('.l-header');
            var headerHeight = header ? header.offsetHeight : 80;
            var targetPosition = element.offsetTop - headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        });
    }

    function initCountUp() {
        if (window.__app.countUpInitialized) return;
        window.__app.countUpInitialized = true;

        var countElements = document.querySelectorAll('[data-count]');

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    var target = parseInt(entry.target.dataset.count);
                    var duration = 2000;
                    var start = 0;
                    var increment = target / (duration / 16);
                    var current = start;

                    var timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 16);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    function initFormValidation() {
        if (window.__app.formValidationInitialized) return;
        window.__app.formValidationInitialized = true;

        var forms = document.querySelectorAll('.c-form, form');

        var validators = {
            text: function(value, fieldName) {
                if (!value || value.trim().length < 2) {
                    return fieldName + ' muss mindestens 2 Zeichen enthalten';
                }
                if (!/^[a-zA-ZÀ-ÿs-']{2,50}$/.test(value)) {
                    return fieldName + ' enthält ungültige Zeichen';
                }
                return null;
            },
            email: function(value) {
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
                }
                return null;
            },
            tel: function(value) {
                if (!value || !/^[\d\s\+\(\)\-]{10,20}$/.test(value)) {
                    return 'Bitte geben Sie eine gültige Telefonnummer ein';
                }
                return null;
            },
            message: function(value) {
                if (!value || value.trim().length < 10) {
                    return 'Die Nachricht muss mindestens 10 Zeichen enthalten';
                }
                return null;
            },
            checkbox: function(checked) {
                if (!checked) {
                    return 'Dieses Feld muss aktiviert werden';
                }
                return null;
            }
        };

        function showError(field, message) {
            field.classList.add('is-invalid');
            var errorDiv = field.parentElement.querySelector('.invalid-feedback');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback d-block';
                field.parentElement.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function clearError(field) {
            field.classList.remove('is-invalid');
            var errorDiv = field.parentElement.querySelector('.invalid-feedback');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        }

        function validateField(field) {
            var value = field.value;
            var type = field.type;
            var id = field.id;
            var name = field.name;
            var fieldName = field.previousElementSibling ? field.previousElementSibling.textContent : name;
            var error = null;

            if (field.hasAttribute('required') && !value && type !== 'checkbox') {
                error = fieldName + ' ist erforderlich';
            } else if (value) {
                if (type === 'email' || id === 'email') {
                    error = validators.email(value);
                } else if (type === 'tel' || id === 'phone') {
                    error = validators.tel(value);
                } else if (id === 'message') {
                    error = validators.message(value);
                } else if (type === 'text' && (id === 'firstName' || id === 'lastName' || id === 'name')) {
                    error = validators.text(value, fieldName);
                }
            }

            if (type === 'checkbox' && field.hasAttribute('required')) {
                error = validators.checkbox(field.checked);
            }

            if (error) {
                showError(field, error);
                return false;
            } else {
                clearError(field);
                return true;
            }
        }

        forms.forEach(function(form) {
            var fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(function(field) {
                field.addEventListener('blur', function() {
                    validateField(this);
                });

                field.addEventListener('input', debounce(function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                }, 300));
            });

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var isValid = true;
                var firstInvalidField = null;

                fields.forEach(function(field) {
                    if (!validateField(field)) {
                        isValid = false;
                        if (!firstInvalidField) {
                            firstInvalidField = field;
                        }
                    }
                });

                if (!isValid) {
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                var submitBtn = form.querySelector('button[type="submit"]');
                var originalText = submitBtn ? submitBtn.textContent : '';

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;"></span>Wird gesendet...';
                }

                var style = document.createElement('style');
                style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                if (!document.querySelector('style[data-spin]')) {
                    style.setAttribute('data-spin', '');
                    document.head.appendChild(style);
                }

                setTimeout(function() {
                    window.location.href = 'thank_you.html';
                }, 1500);
            });
        });
    }

    function initScrollToTop() {
        if (window.__app.scrollToTopInitialized) return;
        window.__app.scrollToTopInitialized = true;

        var button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Nach oben scrollen');
        button.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));color:#fff;border:none;font-size:24px;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.15);';

        document.body.appendChild(button);

        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        }, 100));

        button.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.1)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    }

    function initCardAnimations() {
        if (window.__app.cardAnimationsInitialized) return;
        window.__app.cardAnimationsInitialized = true;

        var cards = document.querySelectorAll('.card');

        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        });
    }

    function initImageAnimations() {
        if (window.__app.imageAnimationsInitialized) return;
        window.__app.imageAnimationsInitialized = true;

        var images = document.querySelectorAll('img:not(.c-logo__img)');

        images.forEach(function(img) {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.4s ease-out';
            });

            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    function initAccordionAnimations() {
        if (window.__app.accordionInitialized) return;
        window.__app.accordionInitialized = true;

        var accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var target = document.querySelector(this.dataset.bsTarget || this.getAttribute('aria-controls'));
                if (!target) return;

                var isExpanded = this.getAttribute('aria-expanded') === 'true';

                if (!isExpanded) {
                    target.style.maxHeight = target.scrollHeight + 'px';
                    this.classList.remove('collapsed');
                    this.setAttribute('aria-expanded', 'true');
                    target.classList.add('show');
                } else {
                    target.style.maxHeight = '0';
                    this.classList.add('collapsed');
                    this.setAttribute('aria-expanded', 'false');
                    target.classList.remove('show');
                }
            });
        });
    }

    window.__app.init = function() {
        if (window.__app.initialized) return;
        window.__app.initialized = true;

        initBurgerMenu();
        initScrollEffects();
        initRippleEffect();
        initScrollSpy();
        initSmoothScroll();
        initCountUp();
        initFormValidation();
        initScrollToTop();
        initCardAnimations();
        initImageAnimations();
        initAccordionAnimations();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }

})();
# CSS Additions (append to style.css)

.navbar-collapse {
  height: calc(100vh - var(--header-height));
}

@media (max-width: 1023px) {
  .navbar-collapse {
    height: calc(100vh - var(--header-height-mobile));
  }
}

.u-no-scroll {
  overflow: hidden;
}

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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.scroll-to-top:active {
  transform: translateY(-2px) scale(1.05) !important;
}

.card {
  animation: fadeInUp 0.6s ease-out forwards;
}

img:not(.c-logo__img) {
  animation: fadeInScale 0.8s ease-out forwards;
}

.btn:active,
.c-button:active {
  transform: scale(0.98) !important;
}

.nav-link {
  transition: all 0.3s ease-in-out;
}

.nav-link:hover {
  transform: translateY(-2px);
}

.form-control:focus,
.form-select:focus,
.c-input:focus {
  transform: scale(1.01);
}

.accordion-collapse {
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
  max-height: 0;
}

.accordion-collapse.show {
  max-height: 1000px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
