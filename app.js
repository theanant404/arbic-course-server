import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import {rateLimit} from "express-rate-limit";
import {createServer} from "http";
import requestIp from "request-ip";
import {ApiError} from "./src/utils/ApiError.js";

const app=express();
const httpServer=createServer(app);
app.use(
    cors({
        origin:process.env.CORS_ORIGIN==="*"?"*":process.env.CORS_ORIGIN?.split(","),
        credentials:true,
    })
)
app.use(requestIp.mw());
const limiter=rateLimit({
    windowMs:10*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    keyGenerator:(req,res)=>{
        return req.clientIp;
    },
    handler:(_,__,___,options)=>{
        throw new ApiError(
            options.statusCode||500,
            options.message||"Too many requests from this IP, plzzzz try again later",
            {
                statusCode:options.statusCode||500,
                message:options.message||"Too many requests from this IP, please try again later",
            }
        )
    }
})
app.use(limiter);
app.use(express.json({limit:"50kb"}));
app.use(express.urlencoded({extended:true,limit:"50kb"}));
app.use(express.static("public"));
app.use(cookieParser());
import { errorHandler } from "./src/middlewares/error.middlewares.js";


app.use(errorHandler);
import userRouter  from "./src/routes/auth/user.route.js"
import adminRouter from "./src/routes/admin/admin.route.js";
app.use("/api/v1/auth",userRouter);
app.use("/api/v1/admin",adminRouter);
export {httpServer};