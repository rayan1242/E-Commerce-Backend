const {mongoose} = require('mongoose');
require('dotenv').config();
const dbConnect = async () =>  {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed');
    }
}

module.exports = dbConnect;