const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let jsonDataArray = [];
let jsonEmailArray = [];
const emailPath = "./db/formEmail.json";
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
    fs.writeFileSync(emailPath, stringifyData);
};

const getEmail = () => {
    const jsonData = fs.readFileSync(emailPath);
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
        id: newEmailId,
        added_at: addDate(date),
        content: req.body,
    };

    jsonEmailArray.push(...existEmail, emailObj);
    saveEmail(jsonEmailArray);
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
        id: newPostId,
        added_at: addDate(date),
        postContent: req.body,
    };
    jsonDataArray.push(...existPosts, postObj);
    savePost(jsonDataArray);
    res.send({ success: true, msg: "Post added." });
});

app.get("/posts", (req, res) => {
    const data = getPost();
    res.send(data);
});

app.delete("/posts/:id", (req, res) => {
    const idToDelete = req.params.id;
    fs.readFile(postsPath, "utf-8", (err, posts) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }

        const allPosts = JSON.parse(posts);
        const postId = allPosts.findIndex((singlePost) => singlePost.id.toString() === idToDelete);

        if (postId >= 0) {
            allPosts.splice(postId, 1);
        }

        fs.writeFile(postsPath, JSON.stringify(allPosts, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
                return;
            } else {
                res.json(allPosts);
            }

            console.log("Post deleted successfully");
            res.status(200).send("Post deleted successfully");
        });
    });
});

app.delete("/emails/:id", (req, res) => {
    const idToDelete = req.params.id;
    fs.readFile(emailPath, "utf-8", (err, email) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }

        const allEmails = JSON.parse(email);
        const emailId = allEmails.findIndex((singleEmail) => singleEmail.id.toString() === idToDelete);

        if (emailId >= 0) {
            allEmails.splice(emailId, 1);
        }

        fs.writeFile(emailPath, JSON.stringify(allEmails, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
                return;
            } else {
                res.json(allEmails);
            }

            console.log("Email deleted successfully");
            res.status(200).send("Email deleted successfully");
        });
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
