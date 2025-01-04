const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwttoken');

const createUser = asyncHandler(async (req, res) => {
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
    }else{
        throw new Error('User already exists');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json(
            {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            }
        )
        res.status(200).send("User logged in successfully").json(user);
    }
    else{

        throw new Error('Invalid email or password');
    }

});

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        throw new Error('No users found');
    }
});

const getaUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        throw new Error('No user found');
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message: 'User removed successfully'});
    } catch (error) {
        throw new Error('User not found');
    }
});

const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.firstname = req?.body.firstname;
        user.lastname = req?.body.lastname;
        user.email = req?.body.email;
        user.mobile = req?.body.mobile;
        user.password = req?.body.password;
        user.role = req?.body.role;
        await user.save();
        res.status(200).json({message: 'User updated successfully'});
    } catch (error) {
        throw new Error('User not found');
    }
});

const blockUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = true;
        await user.save();
        res.status(200).json({message: 'User blocked successfully'});
    } catch (error) {
        throw new Error('User not found');
    }
});
const unblockUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = false;
        await user.save();
        res.status(200).json({message: 'User unblocked successfully'});
    } catch (error) {
        throw new Error('User not found');
    }
});



module.exports = {
    createUser,
    loginUser,
    getUsers,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser
};