const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default:[],
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    address:
    [{type:mongoose.Schema.Types.ObjectId},{ref:'Address'}],
    wishList:
    [{type:mongoose.Schema.Types.ObjectId},{ref:'Product'}],
    refreshToken:{
        type:String,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpire:{
        type:Date,
    },
    passwordChangedAt:{
        type:Date,
    },
},
{timestamps:true}
);

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createresetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


//Export the model
module.exports = mongoose.model('User', userSchema);