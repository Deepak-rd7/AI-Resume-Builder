import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Resume from "../models/ResumeModel.js";

//token generation
function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
}

//controller for user registration
//POST:/api/users/register
export async function registerUser(req, res) {
  try {
    
    
    const { name, email, password } = req.body

    //check if required fields r present
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    //check if user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    
    

    //return success message
    const token = generateToken(newUser._id);

    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

//controller for user login
//POST:/api/users/login

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    //check if user already exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //check password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

 
    //return success message
    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(201).json({
      message: "User Logined successfully",
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

//controller for getting user by id
// GET: api/users/data

export async function getUserById(req, res) {
  try {
    const userId = req.userId;

    //check if user exists

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User nor found",
      });
    }

    // return user
    user.password = undefined;

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


//controller for getting user resumes
//GET:/api/users/resumes

export async function getUserResumes(req,res) {
  try {
    const userId=req.userId;
    
    
    //return user resumes

    const resumes=await Resume.find({userId});

    return res.status(200).json({
      resumes
    })
  } catch (error) {
    return res.status(400).json({
      message:error.message
    })
  }
}