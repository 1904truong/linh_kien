const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/infrastructure/database/models/Product');

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});

    const dummyProducts = [
      {
        name: 'Bugi Toyota Vios 2018',
        price: 150000,
        category: 'Engine',
        brand: 'Denso',
        oemCode: 'DENSO-VIO-001',
        specifications: { material: 'Iridium', gap: '1.1mm' },
        compatibility: [
          { brand: 'Toyota', model: 'Vios', year: 2018 },
          { brand: 'Toyota', model: 'Vios', year: 2019 }
        ],
        inventory: 50
      },
      {
        name: 'Lọc gió Honda City 2020',
        price: 200000,
        category: 'Filter',
        brand: 'Honda Genuine',
        oemCode: 'HON-CIT-888',
        specifications: { type: 'Paper' },
        compatibility: [
          { brand: 'Honda', model: 'City', year: 2020 },
          { brand: 'Honda', model: 'City', year: 2021 }
        ],
        inventory: 100
      },
      {
        name: 'Má phanh Toyota Camry 2022',
        price: 850000,
        category: 'Brake',
        brand: 'Brembo',
        oemCode: 'BREM-CAM-555',
        specifications: { position: 'Front' },
        compatibility: [
          { brand: 'Toyota', model: 'Camry', year: 2022 }
        ],
        inventory: 20
      }
    ];

    await Product.insertMany(dummyProducts);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
