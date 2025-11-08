// Recipe Page JavaScript

class RecipePage {
    constructor() {
        this.currentRecipe = null;
        this.cookMode = false;
        this.shoppingList = [];
        this.init();
    }

    init() {
        this.loadRecipeData();
        this.setupEventListeners();
        this.setupIngredientCheckboxes();
        this.setupCookMode();
        this.setupPrintFunctionality();
        this.setupShareButton();
        this.renderRelatedRecipes(); // ✅ This is here
        this.setupNutritionToggle();
        this.setupVideoModal();
    }

    loadRecipeData() {
        // Get recipe name from URL
        const path = window.location.pathname;
        const recipeName = path.split('/').pop().replace('.html', '');
        
        // Find recipe in data - handle different naming patterns
        const findRecipe = () => {
            // Try exact match first
            let recipe = recipes.find(r => 
                r.title.toLowerCase().replace(/\s+/g, '-') === recipeName ||
                r.title.toLowerCase().replace(/\s+/g, '') === recipeName
            );
            
            // Try partial matches
            if (!recipe) {
                recipe = recipes.find(r => 
                    recipeName.includes(r.title.toLowerCase().replace(/\s+/g, '')) ||
                    r.title.toLowerCase().includes(recipeName.replace(/-/g, ''))
                );
            }
            
            return recipe;
        };

        this.currentRecipe = findRecipe();
        
        if (!this.currentRecipe) {
            // Fallback to egusi if no match found
            this.currentRecipe = recipes.find(r => r.id === 1);
        }

        // Update page title and meta
        this.updatePageMeta();
    }

    updatePageMeta() {
        if (!this.currentRecipe) return;
        
        document.title = `${this.currentRecipe.title} Recipe - Authentic Nigerian Cuisine | Odin Recipes`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = `Learn to make authentic Nigerian ${this.currentRecipe.title} with step-by-step instructions, ingredients, and cooking tips.`;
        }
        
        // Update OpenGraph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) ogTitle.content = `Authentic Nigerian ${this.currentRecipe.title} Recipe`;
        if (ogDesc) ogDesc.content = this.currentRecipe.description;
    }

    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');
        });

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Add all ingredients button
        const addAllBtn = document.querySelector('.add-all-ingredients');
        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => {
                this.addAllIngredientsToShoppingList();
            });
        }

        // Window scroll for back to top button
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 100));

        // Smooth scrolling for anchor links
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
    }

    setupIngredientCheckboxes() {
        const checkboxes = document.querySelectorAll('.ingredient-item input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const listItem = e.target.closest('.ingredient-item');
                const ingredientName = e.target.dataset.ingredient;
                
                if (e.target.checked) {
                    listItem.style.opacity = '0.6';
                    this.addToShoppingList(ingredientName);
                } else {
                    listItem.style.opacity = '1';
                    this.removeFromShoppingList(ingredientName);
                }
            });
        });
    }

    addAllIngredientsToShoppingList() {
        if (!this.currentRecipe) return;
        
        this.currentRecipe.ingredients.forEach(ingredient => {
            this.addToShoppingList(ingredient);
        });
        
        utils.toast.show('All ingredients added to shopping list!', 'success');
    }

    addToShoppingList(ingredient) {
        if (!this.shoppingList.includes(ingredient)) {
            this.shoppingList.push(ingredient);
            utils.shoppingList.add(ingredient, this.currentRecipe.title);
        }
    }

    removeFromShoppingList(ingredient) {
        const index = this.shoppingList.indexOf(ingredient);
        if (index > -1) {
            this.shoppingList.splice(index, 1);
        }
    }

    setupCookMode() {
        const cookModeToggle = document.querySelector('.cook-mode-toggle');
        if (!cookModeToggle) return;

        cookModeToggle.addEventListener('click', () => {
            this.toggleCookMode();
        });

        // Check if cook mode was previously enabled
        const savedCookMode = utils.storage.get('cookMode');
        if (savedCookMode) {
            this.enableCookMode();
        }
    }

    toggleCookMode() {
        if (this.cookMode) {
            this.disableCookMode();
        } else {
            this.enableCookMode();
        }
    }

    enableCookMode() {
        this.cookMode = true;
        document.body.classList.add('cook-mode');
        utils.storage.set('cookMode', true);
        
        // Increase font sizes for better readability
        document.documentElement.style.fontSize = '18px';
        
        // Hide non-essential elements
        const nonEssential = document.querySelectorAll('.footer, .related-recipes, .nutrition-section');
        nonEssential.forEach(el => {
            el.style.display = 'none';
        });
        
        // Make instructions more prominent
        const instructions = document.querySelector('.recipe-instructions');
        if (instructions) {
            instructions.style.fontSize = '1.125rem';
            instructions.style.lineHeight = '1.8';
        }
        
        utils.toast.show('Cook mode enabled! Screen optimized for kitchen use.', 'info', 3000);
    }

    disableCookMode() {
        this.cookMode = false;
        document.body.classList.remove('cook-mode');
        utils.storage.set('cookMode', false);
        
        // Reset font sizes
        document.documentElement.style.fontSize = '16px';
        
        // Show all elements
        const hidden = document.querySelectorAll('.footer, .related-recipes, .nutrition-section');
        hidden.forEach(el => {
            el.style.display = '';
        });
        
        // Reset instructions
        const instructions = document.querySelector('.recipe-instructions');
        if (instructions) {
            instructions.style.fontSize = '';
            instructions.style.lineHeight = '';
        }
        
        utils.toast.show('Cook mode disabled.', 'info');
    }

    setupPrintFunctionality() {
        // Add print-specific styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .navbar, .recipe-actions, .footer, #backToTop { display: none !important; }
                .recipe-main { padding: 0; }
                .recipe-image { height: 200px; }
                body { background: white !important; color: black !important; }
                .recipe-ingredients, .recipe-instructions, .recipe-notes {
                    box-shadow: none !important; border: 1px solid #ddd !important;
                }
            }
        `;
        document.head.appendChild(printStyles);

        // Handle print button
        const printBtn = document.querySelector('.print-recipe');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                // Add recipe-specific info to print
                const printInfo = document.createElement('div');
                printInfo.className = 'print-info';
                printInfo.innerHTML = `
                    <h1>${this.currentRecipe?.title || 'Recipe'}</h1>
                    <p>From Odin Recipes - odinrecipes.com</p>
                    <p>Printed on: ${new Date().toLocaleDateString()}</p>
                `;
                printInfo.style.display = 'none';
                document.body.appendChild(printInfo);
                
                window.print();
                
                // Clean up after print
                setTimeout(() => printInfo.remove(), 1000);
            });
        }
    }

    setupShareButton() {
        const shareBtn = document.querySelector('.share-recipe');
        if (!shareBtn || !navigator.share) {
            // Fallback for browsers without native sharing
            if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                    this.fallbackShare();
                });
            }
            return;
        }

        shareBtn.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: `${this.currentRecipe.title} Recipe - Odin Recipes`,
                    text: this.currentRecipe.description,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing:', err);
                this.fallbackShare();
            }
        });
    }

    fallbackShare() {
        // Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            utils.toast.show('Recipe link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback: create temporary input
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            utils.toast.show('Recipe link copied to clipboard!', 'success');
        });
    }

    renderRelatedRecipes() {
        const relatedGrid = document.getElementById('relatedGrid');
        if (!relatedGrid || !this.currentRecipe) return;

        // Get recipes with similar tags (excluding current)
        const relatedRecipes = recipes.filter(recipe => 
            recipe.id !== this.currentRecipe.id &&
            recipe.tags.some(tag => this.currentRecipe.tags.includes(tag))
        ).slice(0, 4);

        // If not enough related, fill with random recipes
        if (relatedRecipes.length < 4) {
            const additional = recipes
                .filter(recipe => 
                    recipe.id !== this.currentRecipe.id &&
                    !relatedRecipes.includes(recipe)
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 4 - relatedRecipes.length);
            
            relatedRecipes.push(...additional);
        }

        relatedGrid.innerHTML = relatedRecipes.map(recipe => `
            <div class="related-card" onclick="window.location.href='${recipe.title.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}.html'">
                <div class="related-image">
                    <span>${recipe.emoji}</span>
                </div>
                <div class="related-content">
                    <h3 class="related-title">${recipe.title}</h3>
                    <div class="related-meta">
                        <span>⏱️ ${recipe.cookTime}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupNutritionToggle() {
        // Add interactive nutrition calculator
        const nutritionItems = document.querySelectorAll('.nutrition-item');
        nutritionItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showNutritionDetail(item);
            });
        });
    }

    showNutritionDetail(item) {
        const label = item.querySelector('.nutrition-label').textContent;
        const value = item.querySelector('.nutrition-value').textContent;
        
        // Create tooltip or modal with detailed info
        const detail = document.createElement('div');
        detail.className = 'nutrition-detail';
        detail.innerHTML = `
            <div class="nutrition-detail-content">
                <h3>${label}</h3>
                <p><strong>${value}</strong> per serving</p>
                <p>This value is calculated based on standard serving sizes and may vary depending on specific ingredients used.</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(detail);
        
        // Auto-remove after 5 seconds
        setTimeout(() => detail.remove(), 5000);
    }

    setupVideoModal() {
        // Add video support if available
        const videoBtn = document.querySelector('.video-tutorial');
        if (!videoBtn) return;

        videoBtn.addEventListener('click', () => {
            this.openVideoModal();
        });
    }

    openVideoModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="video-modal-content">
                <button class="video-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <div class="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/XeZJlXAsP18 " 
                            title="Egusi Soup Tutorial" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    handleScroll() {
        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Sticky ingredient checklist on mobile
        if (window.innerWidth <= 768) {
            const ingredientsSection = document.querySelector('.recipe-ingredients');
            if (ingredientsSection) {
                const rect = ingredientsSection.getBoundingClientRect();
                if (rect.bottom < 0) {
                    this.showFloatingIngredients();
                } else {
                    this.hideFloatingIngredients();
                }
            }
        }
    }

    showFloatingIngredients() {
        if (document.querySelector('.floating-ingredients')) return;
        
        const floating = document.createElement('div');
        floating.className = 'floating-ingredients';
        floating.innerHTML = `
            <button class="floating-ingredients-toggle">📝 Ingredients</button>
            <div class="floating-ingredients-panel">
                <h3>Ingredients Checklist</h3>
                <div class="floating-ingredients-list">
                    ${this.currentRecipe.ingredients.map(ing => `
                        <label>
                            <input type="checkbox" data-ingredient="${ing}">
                            <span>${ing}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(floating);
        
        // Toggle panel
        floating.querySelector('.floating-ingredients-toggle').addEventListener('click', () => {
            floating.classList.toggle('open');
        });
    }

    hideFloatingIngredients() {
        const floating = document.querySelector('.floating-ingredients');
        if (floating) {
            floating.remove();
        }
    }
}

// Initialize recipe page
document.addEventListener('DOMContentLoaded', () => {
    new RecipePage();
});

// Additional utility functions for recipe page
const recipePageUtils = {
    // Convert cooking time to minutes
    timeToMinutes: (timeString) => {
        const match = timeString.match(/(\d+)\s*(hour|min|minute)s?/i);
        if (!match) return 0;
        
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        return unit.includes('hour') ? value * 60 : value;
    },
    
    // Scale recipe ingredients
    scaleRecipe: (servings, originalServings, ingredients) => {
        const scaleFactor = servings / originalServings;
        return ingredients.map(ingredient => {
            // Simple scaling - in real app, you'd need more sophisticated parsing
            const match = ingredient.match(/(\d+(?:\.\d+)?)\s*(.*)/);
            if (match) {
                const amount = parseFloat(match[1]);
                const unit = match[2];
                return `${(amount * scaleFactor).toFixed(1)} ${unit}`;
            }
            return ingredient;
        });
    },
    
    // Generate shopping list text
    generateShoppingListText: (ingredients) => {
        return ingredients.map((ing, index) => `${index + 1}. ${ing}`).join('\n');
    }
};

// Export for use in other files
window.recipePageUtils = recipePageUtils;