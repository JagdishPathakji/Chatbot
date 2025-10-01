import bcrypt from "bcrypt"
import usercollection from "../Database/userSchema.js"

async function verifyCredentials(reqBody) {

    // Check whether the user exists in the database or not
    const data = await usercollection.findOne({email: reqBody.email})

    // If no such user exists
    if (!data)
    throw new Error("No such user exists")

    // If no such user exists
    if (data.email !== reqBody.email)
    throw new Error("Invalid Credentials")

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(reqBody.password, data.password)

    if (!isPasswordCorrect)
    throw new Error("Invalid Credentials")
}

export default verifyCredentials