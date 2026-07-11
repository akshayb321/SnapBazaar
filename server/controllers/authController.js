import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signUp =async(req,res)=>{
    try {
        const {name,email,password} =req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message:"An account with this email already exists."
            });
        }
        const hashedPassword= await bcrypt.hash( password , 10);
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            message:"User registered successfully."
        });

    } catch (error) {
        res.status(500).json({
            message:"Internal server error."
        });
    }
}

export const login =async(req,res)=>{
    try {
        const {email,password} =req.body;
        const existingUser =await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                message:"Invalid email or password."
            });
        }
        const isPassMatch= await bcrypt.compare( password , existingUser.password);
        if(!isPassMatch){
            return res.status(401).json({
                message:"Invalid email or password."
            });
        }

        const jwtToken =jwt.sign(
            {email:existingUser.email, _id:existingUser._id},
            process.env.JWT_SECRETE,
            {expiresIn: '24h'}
        )
        return res.status(200).json({
            message:"Login successfully.",
            name:existingUser.name,
            email:existingUser.email,
            jwtToken
        });

    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        });
    }
}