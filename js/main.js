// Main Application JavaScript

class OdinRecipes {
    constructor() {
        this.currentRecipe = null;
        this.searchResults = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderRecipes();  // This was missing!
        this.setupScrollReveal();
        this.setupNavigation();
        this.loadFromURL();
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = $('.nav-toggle');
        const navMenu = $('.nav-menu');
        
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        $$('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                
                if (target.startsWith('#')) {
                    const element = document.querySelector(target);
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    window.location.href = target;
                }
                
                // Close mobile menu
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                
                // Update active link
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Window scroll events
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 100));
    }

    // THIS WAS MISSING - ADD THIS METHOD
    renderRecipes() {
        const recipeGrid = document.getElementById('recipeGrid');
        if (!recipeGrid) return;

        const recipeCards = recipes.map(recipe => this.createRecipeCard(recipe));
        recipeGrid.innerHTML = '';
        recipeCards.forEach(card => recipeGrid.appendChild(card));
    }

    // THIS WAS MISSING - ADD THIS METHOD
    createRecipeCard(recipe) {
        const difficultyClass = `difficulty-${recipe.difficulty}`;
        const difficultyText = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
        
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-image">
                <span>${recipe.emoji}</span>
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <div class="recipe-time">
                        <span>⏱️</span>
                        <span>${recipe.cookTime}</span>
                    </div>
                    <span class="recipe-difficulty ${difficultyClass}">${difficultyText}</span>
                </div>
            </div>
        `;
        
        // Make card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const recipeUrl = recipe.title.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '') + '.html';
            window.location.href = `recipes/${recipeUrl}`;
        });
        
        return card;
    }

    setupScrollReveal() {
        // Add reveal class to elements
        const revealElements = document.querySelectorAll('.recipe-card, .section-title, .section-subtitle');
        revealElements.forEach(el => el.classList.add('reveal'));

        // Initial reveal check
        utils.scroll.reveal();

        // Reveal on scroll
        window.addEventListener('scroll', utils.throttle(() => {
            utils.scroll.reveal();
        }, 100));
    }

    setupNavigation() {
        // Update active navigation on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    handleScroll() {
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 248, 231, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 248, 231, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    loadFromURL() {
        // Handle direct recipe links
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('recipe');
        
        if (recipeId) {
            const recipe = utils.recipeUtils.getById(recipeId);
            if (recipe) {
                this.openRecipeModal(recipe);
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new OdinRecipes();
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}