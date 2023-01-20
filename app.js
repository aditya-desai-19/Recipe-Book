const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

mongoose.connect("mongodb+srv://admin-aditya:aditya2k@mycluster.5vcyp72.mongodb.net/myDb");

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    const recipe = req.body.recipe;
    const url = "https://api.spoonacular.com/recipes/complexSearch?query="+recipe+"&addRecipeInformation=true&apiKey=08d1fe5e72d94467ae6ae06b38acbbc9";
    const chunks = [];

    https.get(url, function(response){
        response.on("data", function(data){
            chunks.push(data);
        });

        response.on("end", function () {
            const body1 = Buffer.concat(chunks);
            const info = JSON.parse(body1);
            const title = info.results[0].title;
            const img = info.results[0].image;
            const summary = info.results[0].summary;
            res.write("<h1>"+title+"</h1>");
            res.write("<img src="+img+">");
            res.write("<p>"+summary+"</p>");
            res.send();
        });
    });

    
});

const messageSchema = {
    name: String,
    email: String,
    message: String
};

const Message = new mongoose.model("message", messageSchema);

app.post("/message", function(req, res){
    const name1 = req.body.name;
    const email1 = req.body.email;
    const msg = req.body.message;

    const message = new Message({
        name: name1,
        email: email1,
        message: msg
    });

    message.save();
    console.log("Message submitted successfully");
    res.redirect("/");
});


app.listen(5000, function(){
    console.log("Server is running on port 5000");
});