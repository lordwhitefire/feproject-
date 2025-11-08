// Recipe Data
const recipes = [
    {
        id: 1,
        title: "Egusi Soup",
        description: "A rich, hearty soup made with ground melon seeds, vegetables, and your choice of meat. A true Nigerian classic.",
        difficulty: "medium",
        cookTime: "45 mins",
        servings: "6-8",
        emoji: "🥣",
        image: "egusi-soup",
        tags: ["soup", "melon seeds", "vegetables"],
        ingredients: [
            "2 cups egusi seeds",
            "1kg assorted meat",
            "2 cups fresh spinach",
            "1 cup palm oil",
            "2 stock cubes",
            "1 onion",
            "3 fresh peppers"
        ],
        steps: [
            "Grind egusi seeds into powder",
            "Boil meat with seasonings until tender",
            "Heat palm oil and fry egusi",
            "Add meat stock and vegetables",
            "Simmer for 15 minutes"
        ]
    },
    {
        id: 2,
        title: "Jollof Rice",
        description: "The legendary one-pot rice dish with rich tomato sauce. A party favorite across West Africa.",
        difficulty: "medium",
        cookTime: "40 mins",
        servings: "6-8",
        emoji: "🍚",
        image: "jollof-rice",
        tags: ["rice", "tomato", "party"],
        ingredients: [
            "4 cups long grain rice",
            "6 large tomatoes",
            "2 red bell peppers",
            "1 onion",
            "3 cups chicken stock",
            "1 cup vegetable oil"
        ],
        steps: [
            "Blend tomatoes and peppers",
            "Fry tomato mixture until thick",
            "Add rice and stock",
            "Cook on low heat until done",
            "Stir and serve hot"
        ]
    },
    {
        id: 3,
        title: "Ogbono Soup",
        description: "A draw soup made from wild mango seeds, known for its unique texture and rich flavor.",
        difficulty: "easy",
        cookTime: "30 mins",
        servings: "4-6",
        emoji: "🍲",
        image: "ogbono-soup",
        tags: ["soup", "mango seeds", "draw soup"],
        ingredients: [
            "2 handfuls ogbono seeds",
            "500g assorted meat",
            "2 cups ugwu leaves",
            "1 cup palm oil",
            "2 stock cubes",
            "1 onion"
        ],
        steps: [
            "Grind ogbono seeds",
            "Boil meat until tender",
            "Dissolve ogbono in palm oil",
            "Add meat stock and vegetables",
            "Simmer until thick"
        ]
    },
    {
        id: 4,
        title: "Okra Soup",
        description: "Fresh okra soup with a viscous texture, packed with nutrients and flavor.",
        difficulty: "easy",
        cookTime: "25 mins",
        servings: "4-6",
        emoji: "🥒",
        image: "okra-soup",
        tags: ["soup", "okra", "vegetables"],
        ingredients: [
            "30 pieces fresh okra",
            "500g assorted meat",
            "1 cup palm oil",
            "2 cups spinach",
            "2 stock cubes",
            "1 onion"
        ],
        steps: [
            "Chop or blend okra",
            "Boil meat with seasonings",
            "Add palm oil and okra",
            "Add vegetables",
            "Simmer for 10 minutes"
        ]
    },
    {
        id: 5,
        title: "Garri",
        description: "Cassava flakes that can be enjoyed as a drink or made into eba. A versatile staple.",
        difficulty: "easy",
        cookTime: "5 mins",
        servings: "2-4",
        emoji: "🥤",
        image: "garri",
        tags: ["cassava", "staple", "drink"],
        ingredients: [
            "2 cups garri",
            "Water",
            "Sugar (optional)",
            "Milk (optional)",
            "Groundnuts (optional)"
        ],
        steps: [
            "Sieve garri to remove lumps",
            "Add cold water gradually",
            "Stir to desired consistency",
            "Add sugar and milk if desired",
            "Enjoy with groundnuts"
        ]
    },
    {
        id: 6,
        title: "Yam Porridge",
        description: "Hearty yam cooked in a rich pepper sauce with vegetables. Comfort food at its best.",
        difficulty: "medium",
        cookTime: "35 mins",
        servings: "4-6",
        emoji: "🍠",
        image: "yam-porridge",
        tags: ["yam", "porridge", "vegetables"],
        ingredients: [
            "1kg yam",
            "4 large tomatoes",
            "2 red bell peppers",
            "1 onion",
            "2 cups spinach",
            "1 cup palm oil"
        ],
        steps: [
            "Peel and cut yam into chunks",
            "Blend tomatoes and peppers",
            "Cook yam with tomato mixture",
            "Add palm oil and seasonings",
            "Add vegetables and simmer"
        ]
    },
    {
        id: 7,
        title: "Vegetable Sauce",
        description: "Mixed vegetable sauce that pairs perfectly with rice, yam, or plantain.",
        difficulty: "easy",
        cookTime: "20 mins",
        servings: "4-6",
        emoji: "🥘",
        image: "vegetable-sauce",
        tags: ["sauce", "vegetables", "healthy"],
        ingredients: [
            "1 whole chicken",
            "2 cups mixed vegetables",
            "4 plum tomatoes",
            "2 carrots",
            "1 cabbage",
            "2 bell peppers"
        ],
        steps: [
            "Cut and season chicken",
            "Chop all vegetables",
            "Cook chicken with onions",
            "Add vegetables in order",
            "Simmer until tender"
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = recipes;
}