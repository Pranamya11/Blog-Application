const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/AUTH")
.then(()=>{
    console.log("mongo connected")

})
.catch(()=>{
    console.log("error")
})

const Schema=new mongoose.Schema({
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

const Collection=new mongoose.model("authcollections",Schema)

module.exports=Collection


