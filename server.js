import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import {getDay,getDate} from "./date.js";
import {Post} from './model.js';

const homeStartingContent = "Welcome to Your Daily Journal, your digital haven for self-reflection, personal growth, and mindful living.Here, we invite you to embark on a transformative journey of self-discovery, one day at a time. Your journal is more than just a collection of words, it's a sacred space where you can uncover your deepest thoughts, emotions, and desires. Embrace the power of daily journaling as you explore your inner world, gain clarity, and nourish your soul. Witness the positive impact it has on your overall well-being as you cultivate gratitude, set intentions, and celebrate your accomplishments.Your Daily Journal is here to accompany you every step of the way. Set aside a few moments each day to honor yourself, to embrace vulnerability, and to nurture your innermost desires. Let your words flow freely, unburdened by judgment or expectation. Welcome to Your Daily Journal, where the pages become a reflection of your beautiful journey.";
const aboutContent = "Welcome to your personal Daily Journal website! We are delighted to accompany you on your journey of self-reflection, growth, and personal development. We believe in the transformative power of journaling for individuals seeking self-discovery and self-expression. Our mission is to provide you with a dedicated space where you can embark on a daily practice of introspection and gain valuable insights into your inner world. We understand that journaling is a deeply personal experience. It's a private sanctuary where you can freely explore your thoughts, emotions, and aspirations. Our platform is designed to cater to your unique needs and preferences, allowing you to create a journaling practice that aligns with your individual style. We understand the importance of consistency, so we encourage you to establish a daily writing habit. Embrace the power of journaling, and let your words become a testament to your growth and inner wisdom.";

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  const day = getDate();
  Post.find({})
    .then(result=>{
      res.render("home", {
        blogTitle: day,
        startingContent1: homeStartingContent, 
        Posts: result
      })
      posts = result;
    })
    .catch(err=>res.sendStatus(404));
});

app.get("/about", function(req, res){
  res.render("about", {startingContent2: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.route("/compose")

.get(function(req, res){
  res.render("compose");
})

.post(function(req, res){
  const post = new Post({
    title: _.lowerCase(req.body.postTitle),
    content: req.body.postBody
  });
  post.save();
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postTitle", function(req, res){
  const requestedPostId = _.lowerCase(req.params.postTitle);
    
  Post.findOne({title: requestedPostId})
    .then(result=>{
      res.render("post", {
        title: result.title,
        content: result.content
      })
      posts = result;
    })
    .catch(err=>res.sendStatus(404));
});

app.route("/update/:posttitle")

.get(function(req, res){
  const requestedPostId = _.lowerCase(req.params.postTitle);
    
  Post.findOne({title: requestedPostId})
    .then(result=>{
      res.render("update", {
        title: result.title,
        content: result.content
      })
      posts = result;
    })
    .catch(err=>res.sendStatus(404));
})

.put(function(req, res){
  Post.findOne({title: req.params.postTitle})
      .then(result=>{
          result.title = req.body.title;
          result.content = req.body.content;
          result.save()
          .then(r=>res.sendStatus(200))
          .catch(e=>res.sendStatus(500));
      })
      .catch(err=>res.sendStatus(404));
})

.patch(function(req, res){
  Post.findOne({title: req.params.postTitle})
      .then(result=>{
          if(!!req.body.title){
              result.title=req.body.title;
          }
          else if(!!req.body.content){
              result.content=req.body.content;
          }
          result.save()
          .then(r=>res.sendStatus(200))
          .catch(e=>res.sendStatus(500));
      })
      .catch(err=>res.sendStatus(404));
});

/*app.get("/update/:title", (req, res) => {
  const requestedPostId = req.params.title;
  console.log(req.body);

  Post.findOneAndUpdate({title: requestedPostId})
  .then(result=>{
    res.render("update", {
      title: result.title,
      content: result.content
    })
    posts = result;
  })
  .catch(err=>res.sendStatus(404));
});

app.post("/update/:title", (req, res) => {
  const requestedPostId = req.params.title;
  console.log(req.body);

  Post.findOneAndUpdate({title: requestedPostId})
  .then(result=>{
    res.render("update", {
      title: result.title,
      content: result.content
    })
    posts = result;
  })
  .catch(err=>res.sendStatus(404));
});*/

app.post("/delete/:title", function(req,res){
  Post.deleteOne({title: req.params.title})
  .then(result=>res.redirect("/"))
  .catch(err=>console.log("Err"));
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});