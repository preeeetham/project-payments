const router = experss.Router();

const express = require('express');
const zod = require('zod');
const {User} = require("../db");
const jwt= require("jsonwebtoken");
const {JWT_SECRET} = require("../config");


//signup
const signupBody= zod.object({
    username:    zod.string().email(),
    firstname:   zod.string(),
    lastname:    zod.string(),
    password:    zod.string()

})

router.post("/signup",async(req,res)=>{
    const {success} = signupBody.safeParse(req.body)
    if(!success){
        return res.status(404).json({
            message: "email invalid"
        })
    }

    const existingUser =  await User.findOne({
        username: req.body.usename
    })
    if(existingUser){
        return res.status(411).json({
            message: "email already in usee"
        })
    }

    const user = await User.create({
        username: req.body.usename,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    })
    const userId= user._id;

    const token =jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token 
    })
})

//signin 

const signinBody = zod.object({
    username: zod.string().email(),
    password : zod.string()
})

router.post("/signin", async(req,res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "invalid inputs"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET);

        res.json({
            token : token

        })
        return ;

    }
    res.status(411).json({
        message: "Error while logging in"
    })


})



module.exports = router;
