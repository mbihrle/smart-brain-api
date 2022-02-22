const signoutHandler = (req, res) => {
    const { authorization } = req.headers;
    console.log("touch down");
    console.log("authorization: ", authorization);

    // const currentID = redisClient.get(authorization, (err, reply) => {
    //     if (err || !reply) {
    //         console.log("did not work");
    //     } else {
    //         console.log(reply.toString());
    //     }
    // });

    redisClient.del(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json("key not existing");
        }
        return res.json("success");
    });
};

module.exports = {
    signoutHandler: signoutHandler,
};
