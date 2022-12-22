const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataPath = "./db/formEmail.json";
const postsPath = "./db/posts-db.json";
process.env.TZ = "europe/warsaw";

const date = new Date();

const addDate = (time) => {
    let day = time.getDate().toString().padStart(2, "0");
    let month = (time.getMonth() + 1).toString().padStart(2, "0");
    let year = time.getFullYear();
    let hours = time.getHours().toString().padStart(2, "0");
    let minutes = time.getMinutes().toString().padStart(2, "0");
    let seconds = time.getSeconds().toString().padStart(2, "0");

    let actualTime = `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}`;
    return actualTime;
};

const saveEmail = (data) => {
    const stringifyData = JSON.stringify(data, null, 2);
    console.log(stringifyData);
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
    let emailObj = {
        added_at: addDate(date),
        content: req.body,
    };
    existEmail[newEmailId] = emailObj;
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
    let postObj = {
        added_at: addDate(date),
        postContent: req.body,
    };
    existPosts[newPostId] = postObj;
    savePost(existPosts);
    res.send({ success: true, msg: "Post added." });
});

app.get("/posts", (req, res) => {
    const data = getPost();
    res.send(data);
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
