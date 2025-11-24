import express from "express"
import "dotenv/config"
import cors from "cors"
import multer from "multer"
import mongoose from "mongoose"
import ImageKit from "imagekit"
import Image from "./Image.js"

const app = express()

app.use(express.json())
app.use(cors({origin:'http://localhost:5173'}))

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.listen(process.env.PORT || 3000, async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Server is working")
})

app.post("/upload", upload.single("profilePic"), async (req, res) => {
    const profilePic = req.file
    try {
        if(!profilePic) {
            return res.status(400).json({message:"File is required"})
        }

        const imageKit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL
        })

        const result = await imageKit.upload({
            file:profilePic.buffer,
            fileName:profilePic.originalname
        })

        await Image.create({url:result.url})

        return res.status(201).json({message:"Image uploaded"})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

app.get("/upload", async (req, res) => {
    try {
        const data = await Image.find({})
        return res.status(201).json({message:data})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})