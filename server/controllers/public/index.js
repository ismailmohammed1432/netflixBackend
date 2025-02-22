import express from "express"
import config from "config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../../models/Users/Users.js"
import sendMail from "../../utils/sendMail.js"
import sendSMS from "../../utils/sendSMS.js"

const router = express.Router()
const JWT_SECRET = config.get("JWT_SECRET")
const URL = config.get("SERVER_URL")


router.post("/register",async(req,res)=>{
    try {
        let {fullName, email, phone, password, age} = req.body

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({msg:"THe User is already registered!!"})
        }
        let hashPassword = await bcrypt.hash(password, 10)

        const emailToken = Math.random().toString(36).substring(2)
        const phoneToken = Math.random().toString(36).substring(2)

        const superUser = {
            fullName,
            email,
            phone,
            password : hashPassword,
            age,
            userVerifyToken:{
                email:emailToken,
                phone: phoneToken
            }
        }

        await userModel.create(superUser)

        await sendMail({
            to: email,
            subject: "Email verification link",
            html: `<p>Verify your email using the link below:</p>
            <a href= "${URL}/api/public/verifyemail/${emailToken}">Click on me</a>`,
        })

        console.log(`${URL}/api/public/emailVerify/${emailToken}`);
        console.log(`${URL}/api/public/users/phoneverify/${phoneToken}`);

        await sendSMS({
            to: phone,
            body: `Verify: ${URL}/api/public/verifyphone/${phoneToken}`,
          });


          res.status(201).json({msg: "User Registered Successfully.. Please verify your email and phone"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error,err:"Error"})
    }
})


router.get("/emailVerify/:",async (req,res)=>{
    try {
        const {token} = req.params
        const user = await userModel.findOne({"userVerifyEmail":token})

        if(!user){
            return res.status(400).json({msg: "Invalid Email Verification token"})
        }
        user.userVerified.email
        user.userVerifyToken.email = null
        await user.save(

        res.status(200).json({msg: "Email verified Successfully"})
        )
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/phoneverify/:token",async(req,res)=>{
    try {
        let token = req.params.token
        let user = await userModel.findOne({"userVerifyToken.phone":token}) 
        if(!user){
          return res.status(400).json({msg:"invalid phone, please check"})    
        }
        user.userVerified.phone = true;
        user.userVerifyToken.phone= null
        await user.save();
  
         res.status(200).json({msg:"phone verified Successfully"}) 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
})


router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    
      if (!user.userVerified.email) {
        return res.status(400).json({ msg: "Email is not verified, Please check your inbox📧" });
      }
  
  
      if (!user.userVerified.phone) {
        return res.status(400).json({ msg: "Phone is not verified, Please check your inbox✉️" });
      }
  
  
      let check = await bcrypt.compare(password, user.password);
  
      if (!check) {
        return res.status(400).json({ msg: "Invalid credentials, password is not matching❌" });
      }
  
      const jwtsecret = config.get("JWT_SECRET")
      const token = jwt.sign({user},jwtsecret,{expiresIn:"1d"});
      res.status(200).json({ msg: "LoggedIn successfully! And the token is", token});
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error });
    }
  });           


export default router