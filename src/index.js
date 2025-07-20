const express = require("express");
const Collection=require("./mongoose.js")


const path = require("path");

const app = express();
const jwt= require("jsonwebtoken")
const cookieParser= require("cookie-parser")
const bcryptjs= require("bcryptjs")

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

// Corrected paths
const templatePath = path.join(__dirname, "../template");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", templatePath); 


app.use(express.static(publicPath)); 


app.get("/", (req, res) => {
  res.render("index"); 
});


app.post("/",async (req,res)=> {
    try{
        const check=await Collection.findOne({name:req.body.name})

        if(check){
            res.send("user already exist")
        }
        else{

            const token=JsonWebTokenError.sign({name:req.body.name},"eddededededeknkrgnigigtitnirgnitgitnitgtijhhguh")
            const data={
                name:req.body.name,
                password:req.body.password,
                token:token
            }
            await Collection.insertMany([data])
        }


    }
    catch{
        res.send("wrong details")
    }
    
})





app.listen(3000, () => {
  console.log("port connected");
});




