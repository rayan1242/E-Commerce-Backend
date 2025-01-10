const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwttoken');
const generateRefreshToken = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { text } = require('body-parser');
const { sendEmail } = require('./emailController');

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
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'none'
        });

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

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new Error('No token found');
    }
    const newuser = await User.findOne({refreshToken});
    if(!newuser){
        throw new Error('No user found');
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, user) => {
        if(err || newuser.id !== user.id){
            throw new Error('Invalid token');
        }
        const accessToken = generateToken({id: user.id});
        newuser.refreshToken = refreshToken;
        await newuser.save();
        res.json({accessToken});
    });
});

const logoutHandler = asyncHandler(async (req, res) => {
    if(!req.cookies.refreshToken){
        throw new Error('No token found');
    }
    const user= await User.findOne({refreshToken: req.cookies.refreshToken});
    if(!user){
        user.refreshToken = '';
        res.clearCookie('refreshToken');
        throw new Error('No user found');
    }
    await user.save();
    res.clearCookie('refreshToken');
    res.removeHeader('Authorization');
    res.status(200).json({message: 'Logged out successfully'});
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

const updatePassword = asyncHandler(async (req, res) => {
    try {
        validateMongoId(req.params.id);
        const user = await User.findById(req.params.id);
        user.password = req?.body.password;
        await user.save();
        res.status(200).json({message: 'Password updated successfully'});
    } catch (error) {
        throw new Error('User not found');
    }
});

const forgotpasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new Error('No user found');
    }
    try{
        const resetToken = await User.createresetPasswordToken();
        await user.save({validateBeforeSave: false});
        const resetUrl = `Hi please follow this link to reset your password.This link will be valid for 10 min from now <a href='http://localhost:3000/api/auth/forgotpassword/${token}'></a>`
        const data={
            to:email,
            text:'hello',
            subject:'Password reset token',
            htm:resetUrl,

        }
        sendEmail(data);
        res.status(200).json({message: 'Email sent successfully'},resetToken);
    }catch(error){
        throw new Error('Email not sent');
    }

});

const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {resetToken} = req.params.resetToken;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user  = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: {$gt: Date.now()}
    });
    if(!user){
        throw new Error('Invalid token');
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({message: 'Password reset successfully'});
});

module.exports = {
    createUser,
    loginUser,
    getUsers,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    refreshToken,
    logoutHandler,
    updatePassword,
    forgotpasswordToken,
    resetPassword
}