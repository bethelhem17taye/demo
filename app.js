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

// category

app.get("/categories",async(req,res)=>{

    let category = await Category.find();
    res.send(category);  

});

app.post("/categories",async(req,res)=>{
    let name = req.body.name;

    let category = new Category({name});
    await category.save();
    res.send("category created ");
});


app.put("/categories",async(req,res)=>{
    let name = req.body.name;

    let category = new Category(name);
    try {
        await category.save();   
    } catch (error) {
        res.send("error "+error.message)
    }
   
    res.send("category created ");
});
app.delete("/categories/:id",async(req,res)=>{
 
    let category = await Category.findById(req.params.id);
    if(category){
        await category.deleteOne({_id:category._id});
        res.send("category deleted ");
    }else{
        res.send("categorydoes not exist");
    }
});

//review
app.get("/reviews",async(req,res)=>{

    let review = await Review.find();
    res.send(review);  

});

app.post("/reviews",async(req,res)=>{
    let reviewerName = req.body.reviewerName;
    let productId = req.body.productId;
    let comment = req.body.comment;
    let rating = req.body.rating;

    let review = new Review({reviewerName,productId,comment,rating});
    await review.save();
    res.send("user review created");
});

app.put("/reviews",async(req,res)=>{
    let reviewerName = req.body.reviewerName;
    let productId = req.body.productId;
    let comment = req.body.comment;
    let rating = req.body.rating;

    let review = new Review({reviewerName,productId,comment,rating});
    try {
        await review.save();   
    } catch (error) {
        res.send("error "+error.message)
    }
    res.send("user review created");
});

app.delete("/reviews/:id",async(req,res)=>{
 
    let review = await Review.findById(req.params.id);
    if(review){
        await review.deleteOne({_id:review._id});
        res.send("review deleted ");
    }else{
        res.send("review does not exist");
    }
});

//product
app.get("/products",async(req,res)=>{

    let product = await Product.find();
    res.send(product);  

});

app.post("/products",async(req,res)=>{
    let review = req.body.review;
    let image = req.body.image;
    let name = req.body.name;
    let category = req.body.category;
    let rating = req.body.rating;
    let description = req.body.description;
    let city = req.body.city;
    let overallRating = req.body.overallRating;

    let product = new Product({review, image,name,category,rating,description,city,overallRating});
    await product.save();
    res.send("PRODUCT created");
});

app.post("/products",async(req,res)=>{
    let review = req.body.review;
    let image = req.body.image;
    let name = req.body.name;
    let category = req.body.category;
    let rating = req.body.rating;
    let description = req.body.description;
    let city = req.body.city;
    let overallRating = req.body.overallRating;

    let product = new Product({review, image,name,category,rating,description,city,overallRating});
    try {
        await product.save();   
    } catch (error) {
        res.send("error "+error.message)
    }
    res.send("PRODUCT created");
});

app.delete("/products/:id",async(req,res)=>{
 
    let product = await Product.findById(req.params.id);
    if(product){
        await product.deleteOne({_id:product._id});
        res.send("product deleted ");
    }else{
        res.send("product does not exist");
    }
});

app.listen(3000)