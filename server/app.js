import express from "express"
import config from "config"
import publicRouter from "./controllers/public/index.js"
import userRouter from "./controllers/users/index.js"
import "./utils/dbConnect.js"
const app = express()
const PORT = config.get("PORT")

app.use(express.json())
app.get("/",(req,res)=>{
    try {
     res.status(200).json({msg:"hello world!"})
    } catch (error) {
        res.status(500).json({error})
    }
})

app.use("/api/public", publicRouter)
app.use("/api/private", userRouter)

app.listen(PORT,()=>{
    console.log(`The server is up and running on ${PORT}`);
})