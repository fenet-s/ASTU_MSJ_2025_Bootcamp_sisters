import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // We use ! to tell TypeScript that we know MONGO_URI exists
    const conn = await mongoose.connect(process.env.MONGO_URI!);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error('❌ An unknown error occurred while connecting to MongoDB');
    }
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;