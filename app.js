
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Connecting to  DB

mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);

// Setting up the API

app.get("/articles", function(req,res){
    Article.find({},function(err,foundArticles){
        if(err){
            console.log(err);
        }else{
            res.send(foundArticles);
        }
    })
});


app.post("/articles", function(req,res){
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully added the data.");
        }
    });
});

app.delete("/articles", function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all the articles.");
        }else{
            res.send(err);
        }
    })
});

// Requests for specific ids

app.get("/articles/:articleTitle", function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(err){
            res.send("No articles matching the  title were found");
        }else{
            res.send(foundArticle);
        }
    })
})

app.put("/articles/:articleTitle", function(req,res){
    Article.update({title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite:true},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Successfully updated the article.");
            }
        }
    );
});

app.patch("/articles/:articleTitle",  function(req,res){
    Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(err){
                    res.send(err);
                }else{
                    res.send("Successfully updated the database.");
                }
            }
        )
})

app.delete("/articles/:articleTitle",function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Successfully deleted the article.");
            }
        }
    )
});


app.listen(3000, function(){
    console.log("Server started");
})
