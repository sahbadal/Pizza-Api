import User from '../models/user.js'
import bcrypt from 'bcryptjs'
export const getUsers = async (req,res,next) =>{

    let users ;

    try {
        users = await User.find();
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }

    if(!users){
        res.status(404).json({message:'No user found'})
    }
    res.status(200).json({users})

}

//register user 

export const registerUser = async (req,res,next) =>{
    const{name,email,password} = req.body;
    let existUser;

    try {
        existUser = await User.findOne({email})
    } catch (error) {
        return console.log(`Error: ${error.message}`);
    }
    if(existUser){
        return  res.status(400).json({message:'User is Already Registered ! Please Login'})
    }
   
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password,saltRounds)
    const user = await new User({
        name,
        email,
        password:hashPassword,
    });
    try {
       await user.save()
    } catch (error) {
       return console.log(`Error: ${error.message}`);
    }
    return res.status(201).json({user})
}

//login user 

export const loginUser = async (req,res,next) =>{
    const{email,password} = req.body;

    let existUser;

    try {
        existUser = await User.findOne({email})
    } catch (error) {
        return console.log(`Error: ${error.message}`);
    }
    if(!existUser){
        return  res.status(404).json({message:'Could not find user With this Email'})
    }
   
    const isPasswordCorrect = bcrypt.compareSync(password,existUser.password);
    if(!isPasswordCorrect){
       return res.status(400).json({message:"Password Incorrect"})
    }
    return res.status(200).json({message:"Login Succesfully"})

}