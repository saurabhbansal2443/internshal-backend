import express from "express";
import { addInternship, homePage, login, signup } from "../Controller/user.js";

let userRouter = express.Router();

userRouter.get("/allInternship", homePage).post("/login", login).post("/signup", signup).post('/addinternship',addInternship)


export default userRouter;
