require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const categories = [
    { name: 'Technology', description: 'Tech-related posts' },
    { name: 'Travel', description: 'Travel adventures' },
    { name: 'Food', description: 'Food and recipes' },
    { name: 'Lifestyle', description: 'Lifestyle tips' },
    { name: 'Business', description: 'Business and entrepreneurship' },
    { name: 'Health', description: 'Health and wellness' }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Insert new categories
        await Category.insertMany(categories);
        console.log('Categories seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}