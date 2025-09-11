const mongoose=require("mongoose")

// Use MongoDB Atlas or other cloud database for production
const mongoURI = process.env.MONGODB_URI || process.env.DB_URI || "mongodb://localhost:27017/AUTH";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("✅ MongoDB connected successfully")
})
.catch((error)=>{
    console.error("❌ MongoDB connection error:", error.message)
})

// User Schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
       password:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

       token:{
        type:String,
        required:true
    }
})

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Collection=new mongoose.model("authcollections",userSchema)
const Blog = new mongoose.model("blogs", blogSchema)

module.exports = { Collection, Blog }



