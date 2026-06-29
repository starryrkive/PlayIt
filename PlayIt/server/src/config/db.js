import mongoose from "mongoose"; // Import Mongoose for MongoDB connection

// Asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use new URL string parser
      useUnifiedTopology: true, // Use new server discovery and monitoring engine
    });

    // Log a success message with the host of the connected database
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error message and exit the process with failure code
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the app if database connection fails
  }
};

export default connectDB; // Export the function for use in the main server file

