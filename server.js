process.title = "HTTP Server";

require("dotenv").config({
    path: "./.env",
});
// require("dotenv").config({
//     path: __dirname + "./../../../.configs/smart-brain.env",
// });
// console.log(process.env);

const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const getDatabaseConnection = () => {
    // Check if Docker-Database is available
    return process.env.POSTGRES_DOCKER_URI
        ? process.env.POSTGRES_DOCKER_URI
        : process.env.DB_URI;

    // if (process.env.POSTGRES_DOCKER_URI) {
    //     return process.env.POSTGRES_DOCKER_URI;
    // }
    // console.log(process.env.DB_URI);
    // return process.env.DB_URI;
};

const db = knex({
    // connect to your own database here:
    client: "pg",
    connection: getDatabaseConnection(),
});

const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!
console.log("its working now");

app.get("/", (req, res) => {
    res.send(db.users);
});
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", (req, res) => {
    register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
    profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
    image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
    image.handleApiCall(req, res);
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});
