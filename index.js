const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = 4000;
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataPath = "./db/formEmail.json";
const postsPath = "./db/posts-db.json";

const saveEmail = (data) => {
    const stringifyData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataPath, stringifyData);
};

const getEmail = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

const savePost = (data) => {
    const stringifyData = JSON.stringify(data, null, 2);
    fs.writeFileSync(postsPath, stringifyData);
};

const getPost = () => {
    const jsonData = fs.readFileSync(postsPath);
    return JSON.parse(jsonData);
};

app.post("/api/email", (req, res) => {
    const existEmail = getEmail();
    const newEmailId = Math.floor(10000 + Math.random() * 10000);
    existEmail[newEmailId] = req.body;
    saveEmail(existEmail);
    res.send({ success: true, msg: "Email send." });
});

app.get("/emails", (req, res) => {
    const data = getEmail();
    res.send(data);
});

app.post("/posts", (req, res) => {
    const existPosts = getPost();
    const newPostId = Math.floor(10000 + Math.random() * 10000);
    existPosts[newPostId] = req.body;
    savePost(existPosts);
    res.send({ success: true, msg: "Post added." });
});

app.get("/posts", (req, res) => {
    const data = getPost();
    res.send(data);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
