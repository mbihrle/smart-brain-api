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
const redis = require("redis");
const morgan = require("morgan");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const signout = require("./controllers/signout");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

//setup Redis:
redisClient = redis.createClient(process.env.REDIS_URI);

const auth = require("./middleware/authorization");
// const { redisClient } = require("./controllers/signin");

const getDatabaseConnection = () => {
    // Check if Docker-Database is available
    return process.env.POSTGRES_URI
        ? process.env.POSTGRES_URI
        : process.env.DB_URI;
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

app.get("/", (req, res) => {
    res.send(db.users);
});

app.post("/signin", signin.signinAuthentication(db, bcrypt));

app.post("/signout", (req, res) => {
    signout.signoutHandler(req, res);
});

app.post("/register", (req, res) => {
    register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", auth.requireAuth, (req, res) => {
    profile.handleProfileGet(req, res, db);
});
app.post("/profile/:id", auth.requireAuth, (req, res) => {
    profile.handleProfileUpdate(req, res, db);
});
app.put("/image", auth.requireAuth, (req, res) => {
    image.handleImage(req, res, db);
});
app.post("/imageurl", auth.requireAuth, (req, res) => {
    image.handleApiCall(req, res);
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});
