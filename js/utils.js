// Utility Functions

// DOM Utilities
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Create element with attributes and children
const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.assign(element.dataset, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Local Storage Utilities
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Recipe Utilities
const recipeUtils = {
    // Get recipe by ID
    getById: (id) => recipes.find(recipe => recipe.id === parseInt(id)),
    
    // Get recipes by difficulty
    getByDifficulty: (difficulty) => recipes.filter(recipe => recipe.difficulty === difficulty),
    
    // Get recipes by tag
    getByTag: (tag) => recipes.filter(recipe => recipe.tags.includes(tag)),
    
    // Search recipes
    search: (query) => {
        const searchTerm = query.toLowerCase();
        return recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
        );
    },
    
    // Get random recipes
    getRandom: (count = 3) => {
        const shuffled = [...recipes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
};

// Animation Utilities
const animate = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const fade = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(fade);
            }
        };
        
        requestAnimationFrame(fade);
    },
    
    fadeOut: (element, duration = 300) => {
        let start = null;
        const fade = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(fade);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(fade);
    },
    
    slideIn: (element, direction = 'left', duration = 300) => {
        const transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
        element.style.transform = transform;
        element.style.transition = `transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 10);
    }
};

// Scroll Utilities
const scroll = {
    toTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    toElement: (selector) => {
        const element = $(selector);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },
    
    // Reveal on scroll
    reveal: () => {
        const reveals = $$('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
};

// Form Utilities
const form = {
    validate: (formElement) => {
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    },
    
    serialize: (formElement) => {
        const formData = new FormData(formElement);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
};

// Toast Notifications
const toast = {
    show: (message, type = 'info', duration = 3000) => {
        const toastElement = createElement('div', {
            className: `toast toast-${type}`,
            innerHTML: `
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            `
        });
        
        document.body.appendChild(toastElement);
        
        // Auto remove
        setTimeout(() => {
            animate.fadeOut(toastElement, 300);
            setTimeout(() => toastElement.remove(), 300);
        }, duration);
        
        // Manual close
        toastElement.querySelector('.toast-close').addEventListener('click', () => {
            animate.fadeOut(toastElement, 300);
            setTimeout(() => toastElement.remove(), 300);
        });
    }
};

// Shopping List Manager
const shoppingList = {
    items: storage.get('shoppingList') || [],
    
    add: (ingredient, recipe) => {
        const item = {
            id: Date.now(),
            ingredient,
            recipe,
            checked: false,
            added: new Date().toISOString()
        };
        
        shoppingList.items.push(item);
        storage.set('shoppingList', shoppingList.items);
        toast.show(`${ingredient} added to shopping list!`);
    },
    
    remove: (id) => {
        shoppingList.items = shoppingList.items.filter(item => item.id !== id);
        storage.set('shoppingList', shoppingList.items);
        toast.show('Item removed from shopping list');
    },
    
    toggle: (id) => {
        const item = shoppingList.items.find(item => item.id === id);
        if (item) {
            item.checked = !item.checked;
            storage.set('shoppingList', shoppingList.items);
        }
    },
    
    clear: () => {
        shoppingList.items = [];
        storage.set('shoppingList', []);
        toast.show('Shopping list cleared');
    }
};

// Export utilities
window.utils = {
    $, $$, createElement, debounce, throttle, storage,
    recipeUtils, animate, scroll, form, toast, shoppingList
};