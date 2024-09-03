import mongoose from 'mongoose'
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log("connectDB OK")
    }
  } catch (error) {
    throw new Error()
  }
}
export default connectDB