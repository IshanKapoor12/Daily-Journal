import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

export {postSchema, Post};