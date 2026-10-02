import mongoose from 'mongoose';


//this is db connection 
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventviewz';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;