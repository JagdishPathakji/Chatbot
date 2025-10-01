import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import Handledeviceaccess from "./Middleware/Handledeviceaccess.js"
import Handlegooglesearch from "./Middleware/Handlegooglesearch.js"
import handlechat from "./Middleware/Handlechat.js"
import register from "./Register/registration.js"
import main from "./Database/connection.js"
import login from "./Login/login.js"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import usercollection from "./Database/userSchema.js"
// import saveChats from "./Database/saveChats.js"


const app = express()
const allowedOrigin = "https://chatbot-frontend-9o1s.onrender.com";
const port = process.env.PORT || 4000

app.use(cors({
    origin: allowedOrigin,        // exact frontend origin, no slash
    credentials: true,            // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(cookieParser())
app.use(express.json());

// Check whether token is valid or not
app.post("/api/verifytoken", async (req,res)=> {
    try {       
        const token = req.cookies.token
        if(!token) throw new Error("Login Required")
        
        const payload = jwt.verify(token,process.env.SECRET_KEY) // automatically throws error if doesn't verify
        const userEmail = payload.email

        const data = await usercollection.findOne({email: userEmail})
        
        if(!data)
        throw new Error("No such user exists, please register first")

        res.send({"reply":"Token verified","status":true})
    }
    catch(error) {
        res.status(401).send({"reply":error.message,"status":false})
    }
})

// Handling all queries
app.post("/api/chat", async (req, res)=> {    
    try {
        await handlechat(req,res)
    }
    catch(error) {
        res.send({"reply":error.message})
    }
})

// Device access
app.post("/api/deviceaccess", (req,res)=> {
    try {
        Handledeviceaccess(req,res)
    }
    catch(error) {
        res.send({"reply":error.message})
    }
})

// GoogleSearch
app.post("/api/googlesearch", async (req,res)=> {
    try {
        await Handlegooglesearch(req,res)
    }
    catch(error) {
        res.send({"reply":error.message})
    }
})

// Register a new user
app.post("/api/register", async (req,res)=> {
    
    const body = req.body
    
    try {
        await register(body)
        res.status(200).send({"reply":"Registration successfull","status":true})
    }
    catch(error) {
        res.status(500).send({"reply":error.message,"status":false})
    }
})

// Login a user
app.post("/api/login", async (req,res)=> {
    
    const body = req.body
    
    try {
        const isLoggedIn = await login(body)
        
        if(isLoggedIn.error)
        throw new Error(isLoggedIn.error)
        
        if(isLoggedIn.success) {
            // Generate JWT Token
           const token = jwt.sign(
              { email: body.email },
              process.env.SECRET_KEY,
              { expiresIn: "1d" }
            );
            
            res.cookie("token", token, {
                httpOnly: true,          // Not accessible via JS
                secure: true,            // ✅ Required for HTTPS
                sameSite: "none",        // ✅ Allow cross-origin
                maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
            });
            
            // Login the user
            res.status(200).send({"reply":"Login Successfull","status":true})
        }
    }
    catch(error) {
        res.status(500).send({"reply":error.message,"status":false})
    }
})

// Saving chats to DB
// app.post("/api/savetodb", async (req,res)=> {
//     try {
//         await saveChats(req,res)
//     }
//     catch(error) {
//         res.send({"reply":error.message})
//     }
// })

// Logout
app.post("/api/logout", async (req,res)=> {

    try {
        const {email} = req.body
        
        if(!email)
        throw new Error("No such email exists")
        
        res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
        res.send({ success: true, message: "Logged out" });
    }
    catch(error) {
        res.send({"success":false, message: error.message})
    }
})


// Port setup
main()
.then(()=> {
    app.listen(port , ()=> {})
})
.catch((error)=> {})
