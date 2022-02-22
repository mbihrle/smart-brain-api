const jwt = require("jsonwebtoken");

const signToken = (email) => {
    const jwtPayload = { email };
    return (token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "2 days",
    }));
};

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (res, user) => {
    //JWT token, return user data
    const { id, email } = user;
    console.log("id, email: ", id, " ", email);
    const token = signToken(email);
    console.log("iam in createSessions, token:", token);
    return setToken(token, id)
        .then(() => {
            res.json({ success: "true", userId: id, token });
        })
        .catch(console.log);
};

const handleRegister = (req, res, db, bcrypt) => {
    const user = req.body;
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email,
        })
            .into("logins")
            .returning("email")
            .then((loginEmail) => {
                return trx("users")
                    .returning("*")
                    .insert({
                        // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
                        // loginEmail[0] --> this used to return the email
                        // TO
                        // loginEmail[0].email --> this now returns the email
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date(),
                    })
                    .then((user) => {
                        console.log(user[0]);
                        createSessions(res, user[0]);
                    });
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
    handleRegister: handleRegister,
};
