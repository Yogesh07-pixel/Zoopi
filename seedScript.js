import 'dotenv/config'
import mongoose from 'mongoose'
import { Category , Product } from './src/models/index.js'
import { categories, products } from './seedData.js';


async function seedDatabase () {
    try {

        
        // await Product.deleteMany({});
        // await Category.deleteMany({});
        
        const categoryDocs = await Category.insertMany(categories);
        
        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        },{});


        const productWithCategoryIds = products.map((product) => ({
            ...product,
            category: categoryMap[product.category],
        }));

        await Product.insertMany(productWithCategoryIds);


        console.log("DATA SEEDED SUCCESSFULLY...");



    } catch (error) {
        console.log("Error Seeding Database", error);
        mongoose.connection.close();
    }
};

seedDatabase();