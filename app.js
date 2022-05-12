const express = require('express');
const mongoose = require('mongoose');
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const prsDB = 'mongodb://127.0.0.1/prs';

mongoose.connect(prsDB, {
useNewUrlParser: true,
useUnifiedTopology: true
});
 
var db = mongoose.connection;

db.on('open', ()=> {
    console.log('database connected!')
});

//schema
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    fname: String,
    lname:String,
    email: String,
    password: String,
});
const productSchema = new mongoose.Schema({
    name: String,
    image:[{
        type: String
    }],
    category: [{ type: Schema.Types.ObjectId, ref: 'category' }],
    overallRating: Number,
    description: String,
    city: String,
    review:[{ type: Schema.Types.ObjectId, ref: 'review' }]
});

const reviewSchema = new mongoose.Schema({
    user: [{ type: Schema.Types.ObjectId}],
    productId:{
          type: Schema.Types.ObjectId
    },
    comment: String,
    rating: Number,
 
});

const categorySchema = new mongoose.Schema({
    name: String,
 
});

var User= mongoose.model('User', userSchema);
var Product= mongoose.model('Product', productSchema);
var Review= mongoose.model('Review', reviewSchema);
var Category= mongoose.model('Category', categorySchema);
 
//rest api
app.get("/users",async(req,res)=>{

    let user = await User.find({});
    res.send(user);  


});
app.post("/users",async(req,res)=>{
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;

    let user = new User({fname,lname,email,password});
    await user.save();
    res.send("user created ");
});
app.put("/users",async(req,res)=>{
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;

    let user = new User({fname,lname,email,password});
    try {
        await user.save();   
    } catch (error) {
        res.send("error "+error.message)
    }
   
    res.send("user created ");
});
app.delete("/users/:id",async(req,res)=>{
 
    let user = await User.findById(req.params.id);
    if(user){
        await user.deleteOne({_id:user._id});
        res.send("user deleted ");
    }else{
        res.send("user does not exist");
    }
});
app.listen(3000)