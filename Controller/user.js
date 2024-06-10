import User from "../Model/user.js";
import Internship from "../Model/internship.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'





let homePage = async (req, res) => {
  try {
    let data = await Internship.find();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

let login = async (req, res) => {
  console.log("login")
  try {
    let data = req.body;

    let {password , email } = data ;

    let user = await User.findOne( { email: data.email });

    if(user == null ) {  return res.send({msg : "User not exist " , res : false })};
    
    let userPassword = password;
    let hashedPassword = user.password;
    

    let result = await bcrypt.compare(userPassword, hashedPassword);
    console.log(result)
    if(result == true ){
      let token = jwt.sign({email : email }, process.env.SECRET_KEY); //JWT token
   
      return res.send({msg : "Authentication Sucess" , res : true  , Token : token});
    }else{
      return res.send({msg : "Email/Password is wrong " , res : false });
    }
    
  } catch (err) {
    console.log(err)
    res.send({msg : "" , res : false });
  }


};

let signup = async (req, res) => {
  console.log("signup")
  try {
    let userData = req.body;
    let {  email , password } = userData;

    let salt = await bcrypt.genSalt(10); // Generating the salt
    let hashPassword = await bcrypt.hash(password, salt); // generating the hashed password
    userData.password = hashPassword;

    let user = new User(userData); // This is only to create the USER
    let data = await user.save(); // THis is to save in DB

    let token = jwt.sign({email : email }, process.env.SECRET_KEY); //JWT token 
    console.log(token)
    
    res.send({msg : data , res : true , Token : token });

  } catch (err) {
    console.log(err);
    res.send({msg : "User exist " , res : false });
  }
};

let internshipApply = async (req, res) => {
  res.send({msg : "sucess" , user : req.user  , res:true })
};

let addInternship = async ( req, res )=>{
  let {user , _id } = req.body ;
  let data = await User.findOneAndUpdate({email : user.email}, {internshipIds : [...user.internshipIds , _id ]} , {new : true })
  res.send(data);
}

export { homePage, login, signup, internshipApply ,addInternship};
