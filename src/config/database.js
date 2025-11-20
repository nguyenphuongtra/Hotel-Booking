const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB đã kết nối thành công');
  } catch (error) {
    console.error('Kết nối MongoDB không thành công:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;