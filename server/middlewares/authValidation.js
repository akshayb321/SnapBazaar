import Joi from "joi";

export const signupValidation =(req,res,next)=>{
    const schema =Joi.object({
        name:Joi.string().min(3).max(100).required().messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
            "any.required": "Name is required"
        }),
        email:Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),
        password:Joi.string().min(6).max(100).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        })
    });
    const {error} =schema.validate(req.body);
    if (error){
        return res.status(400).json({
            message:error.details[0].message
        });
    }
    next();
}

export const loginValidation =(req,res,next)=>{
    const schema =Joi.object({
        email:Joi.string().email().required().messages({
            "string.email": "Please enter a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),
        password:Joi.string().min(6).max(100).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        })
    });
    const {error} =schema.validate(req.body);
    if (error){
        return res.status(400).json({
            message:error.details[0].message
        });
    }
    next();
}