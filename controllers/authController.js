const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // validation
        if (!name || !email || !password) {
           return res.status(400).json({ message: "All feilds are required" });
        }

        // check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        // password hash 
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user 
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        // Generate JWT token
        const token = jwt.sign({
            userId: user._id,role:user.role
        },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE}
    )
    res.status(201).json({message:"Signup successfull",token,user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
    })
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

module.exports = {signup};