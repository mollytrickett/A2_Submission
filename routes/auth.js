const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/validation');

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);

    if (error) { 
        return res.status(400).json({ message: error.details[0].message })
    }

    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })

    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send({message:err});
    }
})

router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error){ 
        return res.status(400).json({ message: error.details[0].message });
    }

    
    const user = await User.findOne({ email: req.body.email });
    if (!user){ 
        return res.status(400).json({ message: 'Email or password is wrong' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword){
        return res.status(400).json({ message: 'Email or password is wrong' }); 
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).json({ token });
});

module.exports = router;