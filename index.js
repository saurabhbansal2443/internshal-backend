import express from "express";
import "dotenv/config";
import userRouter from "./Router/user.js";
import ApplyRouter from "./Router/applyRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./Model/user.js"

let server = express();
let port = process.env.PORT || 3030;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log("Headers:", req.headers);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.send({ msg: "User not logged in", res: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let userObj = await User.findOne({email: decoded.email});
    req.user = userObj;
    console.log(userObj)
    next();
  } catch (err) {
    res.send({ msg: "Invalid token", res: false });
  }
};

// middlewares
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
server.use(express.json()); // This will help us to read Body of request
server.use(cookieParser());
server.use("/", userRouter);
server.use("/apply", verifyToken, ApplyRouter);

// DB connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connected ");
}

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
