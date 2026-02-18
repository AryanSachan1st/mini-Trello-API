import mongoose from "mongoose"

// Database Connection Logic
// 1. Attempts to connect to MongoDB using Mongoose.
// 2. Uses async/await because database connections take time.
const connectDB = async () => {
    try {
        const connection_instance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n MongoDB connected !! DB HOST: ${connection_instance.connection.host}`);
    } catch (error) {
        // ERROR HANDLING STEP 1: Log the error locally so we know exactly where it happened.
        console.log("MONGODB connection FAILED ", error);
        
        // ERROR HANDLING STEP 2: Re-throw the error.
        // Why? Because 'connectDB' is an async function, it returns a Promise.
        // If we catch the error but don't throw it, the Promise resolves successfully (with undefined).
        // By throwing, we reject the Promise, allowing the caller (index.js) to catch it in .catch().
        throw error 
    }
}

export { connectDB }