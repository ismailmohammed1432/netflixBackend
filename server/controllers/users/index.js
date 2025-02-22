import express from "express"
import config from "config"
import userModel from "../../models/Users/Users.js"

const router = express.Router()

router.get("/getallusers",async(req,res)=>{
    try {
        const users = await userModel.find({})

        if(!users || users.length === 0){
            res.status(404).json({msg:"users not found"})
}
res.status(200).json({users})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})


    router.get("/getoneuser/:id",async(req,res)=>{
        try {
            let userId = req.params.id
            let userData = await userModel.findOne({_id:userId})
        res.status(200).json({userData})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error})
        }
    })


    router.put("/updateuser/:email",async(req,res)=>{
        try {
            let userEmail = req.params.email
            let userData = req.body

        await userModel.findOneAndUpdate({email:userEmail},{$set:userData},{new:true})
    res.status(200).json({userData})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error})
        }
    })

    router.put("/updateuser/:email",async(req,res)=>{
        try {
            let userEmail = req.params.email
            let userData = req.body

        await userModel.findOneAndUpdate({email:userEmail},{$set:userData},{new:true})
    res.status(200).json({userData})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error})
        }
    })
    router.delete("/deleteOne/:id",async(req,res)=>{
        try {
    let userParams = req.params.id
    await userModel.deleteOne({_id:userParams})
    res.status(200).json({msg: "User Deleted Successfully"})
        } catch (error) {
            res.status(500).json({msg:error})
        }
    })
    router.delete("/deleteallusers",async(req,res)=>{
        try {
    await userModel.deleteMany({})
    res.status(200).json({users})
        } catch (error) {
            res.status(500).json({msg:error})
        }
    })
export default router

