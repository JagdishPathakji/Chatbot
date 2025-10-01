import validator from "validator"
import usercollection from "../Database/userSchema.js"
import bcrypt from "bcrypt"

const register = async (body)=> {

    // Check if all required fields are given by user or not
    const requiredFields = ["firstname","email","password"]
    const allFieldsGiven = requiredFields.every((field)=> Object.keys(body).includes(field))

    if(!allFieldsGiven) 
    throw new Error("Please fill all the required fields")

    // Validate email
    if(!(validator.isEmail(body.email)))
    throw new Error("Email is Invalid")
    
    // check if user already exists
    const checkUserPresence = await usercollection.findOne({email:body.email})
    if(checkUserPresence)
    throw new Error("User already exists, please login")

    // Validate password
    if(!(validator.isStrongPassword(body.password)))
    throw new Error("Password is Weak")

    // Check if firstName length is between 3 and 20
    if(!validator.isLength(body.firstname, {min: 3, max: 20}))
    throw new Error("Length of firstName should be >=3 and <=20")

    // Gender 
    if(body.gender)
    body.gender = body.gender.toLowerCase()

    // Store password in form of hashcode
    const hashcode = await bcrypt.hash(body.password,10)
    body.password = hashcode

    const newUser = new usercollection(body)
    await newUser.save()
}

export default register