// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;

// Form Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    let isValid = true;

    // Clear previous error messages
    document.querySelectorAll('.error').forEach(error => error.remove());

    // Validate Name Field
    const nameField = document.querySelector('#contact-form input[type="text"]');
    if (!nameField.value.trim()) {
      isValid = false;
      showError(nameField, 'Please enter your name.');
    }

    // Validate Email Field
    const emailField = document.querySelector('#contact-form input[type="email"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim() || !emailPattern.test(emailField.value)) {
      isValid = false;
      showError(emailField, 'Please enter a valid email address.');
    }

    // Validate Message Field
    const messageField = document.querySelector('#contact-form textarea');
    if (!messageField.value.trim()) {
      isValid = false;
      showError(messageField, 'Please enter a message.');
    }

    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault();
    } else {
      alert('Thank you for your message!'); // Optional success message
    }
  });
}

// Helper Function to Display Error Messages
function showError(field, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.textContent = message;
  errorElement.style.color = 'red';
  errorElement.style.fontSize = '0.9rem';
  field.parentNode.insertBefore(errorElement, field.nextSibling);
}

document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Handle navigation clicks
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('target') !== '_blank') {
                e.preventDefault();
                const destination = this.getAttribute('href');
                if (destination === window.location.pathname) return;
                window.location.href = destination;
            }
        });
    });

    // Add number counter animation
    const countUpElement = document.querySelector('.count-up');
    if (countUpElement) {
        const targetValue = parseInt(countUpElement.dataset.value);
        animateNumber(countUpElement, 0, targetValue, 2); // 2 seconds duration
    }

    // Add typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const professions = [
            'Developer',
            'Designer',
            'Creator'
            // Add more professions as needed
        ];
        typeText(typingElement, professions);
    }

    // Folder interaction
    const folders = document.querySelectorAll('.folder');
    
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            folder.classList.toggle('open');
        });
    });

    if (document.querySelector('.circular-gallery')) {
        initCircularGallery();
    }

    const decryptText = document.querySelector('.decrypt-text');
    if (decryptText) {
        initDecryptedText(decryptText, {
            speed: 50,
            sequential: true,
            revealDirection: 'center',
            animateOn: 'hover'
        });
    }

    initNavbarScroll();
});

// Optional: Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    sessionStorage.setItem('animationDirection', 'left');
});

function animateNumber(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration * 60); // 60fps
    const startTime = performance.now();

    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed < duration * 1000) {
            current += increment;
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }

    requestAnimationFrame(update);
}

// Typing animation for profession
function typeText(element, texts, typingSpeed = 100, pauseDuration = 2000) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, pauseDuration);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(type, typingSpeed);
        }
    }

    type();
}

function initCircularGallery() {
    const container = document.querySelector('.gallery-container');
    const items = document.querySelectorAll('.gallery-item');
    const radius = 400; // Adjust this value to change the circle size
    const angleStep = (2 * Math.PI) / items.length;
    let currentAngle = 0;
    
    function positionItems() {
        items.forEach((item, index) => {
            const angle = currentAngle + (index * angleStep);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            item.style.transform = `translate3d(${x}px, 0, ${z}px)`;
        });
    }
    
    let isDragging = false;
    let startX;
    let startAngle;
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startAngle = currentAngle;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        currentAngle = startAngle + (deltaX * 0.01);
        positionItems();
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Initial positioning
    positionItems();
}

// Add this function for the decryption effect
function initDecryptedText(element, options = {}) {
    const {
        speed = 50,
        maxIterations = 10,
        sequential = false,
        revealDirection = 'start',
        useOriginalCharsOnly = false,
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
        animateOn = 'hover'
    } = options;

    const originalText = element.textContent;
    let interval;
    let currentIteration = 0;
    let isScrambling = false;
    let revealedIndices = new Set();

    function getNextIndex(revealedSet) {
        const textLength = originalText.length;
        switch (revealDirection) {
            case 'start':
                return revealedSet.size;
            case 'end':
                return textLength - 1 - revealedSet.size;
            case 'center': {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealedSet.size / 2);
                const nextIndex = revealedSet.size % 2 === 0
                    ? middle + offset
                    : middle - offset - 1;
                return nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)
                    ? nextIndex
                    : Array.from({ length: textLength }).findIndex((_, i) => !revealedSet.has(i));
            }
            default:
                return revealedSet.size;
        }
    }

    function shuffleText(text, currentRevealed) {
        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
            : characters.split('');

        return text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return text[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
        }).join('');
    }

    function startScramble() {
        isScrambling = true;
        interval = setInterval(() => {
            if (sequential) {
                if (revealedIndices.size < originalText.length) {
                    const nextIndex = getNextIndex(revealedIndices);
                    revealedIndices.add(nextIndex);
                    element.textContent = shuffleText(originalText, revealedIndices);
                } else {
                    clearInterval(interval);
                    isScrambling = false;
                }
            } else {
                element.textContent = shuffleText(originalText, revealedIndices);
                currentIteration++;
                if (currentIteration >= maxIterations) {
                    clearInterval(interval);
                    isScrambling = false;
                    element.textContent = originalText;
                }
            }
        }, speed);
    }

    function stopScramble() {
        clearInterval(interval);
        element.textContent = originalText;
        revealedIndices = new Set();
        isScrambling = false;
        currentIteration = 0;
    }

    if (animateOn === 'hover') {
        element.addEventListener('mouseenter', startScramble);
        element.addEventListener('mouseleave', stopScramble);
    } else if (animateOn === 'view') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isScrambling) {
                    startScramble();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(element);
    }

    return () => {
        element.removeEventListener('mouseenter', startScramble);
        element.removeEventListener('mouseleave', stopScramble);
        clearInterval(interval);
    };
}

// Update the navbar scroll behavior function
function initNavbarScroll() {
    const navbar = document.querySelector('.timeline-nav');
    const footer = document.querySelector('footer');
    let lastScroll = 0;
    let scrollTimeout;
    let isNearFooter = false;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if we're near the footer
        isNearFooter = footerRect.top <= viewportHeight + 100;

        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Show navbar when:
        // 1. Scrolling up
        // 2. Near the footer
        // 3. At the very top of the page
        if (currentScroll < lastScroll || 
            isNearFooter || 
            currentScroll < 50) {
            navbar.classList.add('show');
            navbar.style.transition = 'bottom 0.3s ease';
        } else {
            navbar.classList.remove('show');
        }

        // Only set hide timeout if we're not near the footer
        if (!isNearFooter) {
            scrollTimeout = setTimeout(() => {
                navbar.classList.remove('show');
            }, 2000);
        }

        lastScroll = currentScroll;
    }

    // Optimize scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Show navbar on hover
    navbar.addEventListener('mouseenter', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        navbar.classList.add('show');
    });

    // Only hide on mouse leave if we're not near footer
    navbar.addEventListener('mouseleave', () => {
        if (!isNearFooter) {
            navbar.classList.remove('show');
        }
    });
}