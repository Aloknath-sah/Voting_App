const express = require('express');
const router  = express.Router();
const User = require('../models/users');
const {jwtAuthMiddleware, generateToken} = require('../jwt');

router.post('/signUp', async (req, res) => {
    try{
        //Assuming the request body contains User data
        const data = req.body;

        //check if there is already an admin user
        const adminUser = await User.findOne({role: 'admin'});
        if(data.role === 'admin' && adminUser) {
            return res.status(400).json({error: 'Admin user already exist'});
        }

        //create a new user document using the mongoose model
        const newUser = new User(data);

        //save the new user to the database
        const response  = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("token is", token);
        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.post('/login', async (req, res) => {
    try{
        //Extract adhar number and password from req body
        const {aadharCardNumber, password} = req.body;

        //find the user by adharcard number
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        //if the user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid user or password'});
        }

        //generate token
        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        //console.log("token is", token);
        res.status(200).json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }
    catch(err) {
        console.log(err)
        res.status(400).json({error: 'Internal server error'})
    }
})

module.exports = router;