const User = require('../model/userModel');

const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email });
    if(!findUser){
        const user = new User(req.body);
        try {
            await user.save();
            console.log(user);
            res.status(201).send("User created successfully");
        } catch (error) {
            res.status(400).send(error);
        }
    }
};

module.exports = {
    createUser
};