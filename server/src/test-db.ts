import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/googlebooks')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
