import express from "express";
import {  internshipApply} from "../Controller/user.js";

let applyRouter = express.Router();

applyRouter.post('/' , internshipApply);

export default applyRouter;