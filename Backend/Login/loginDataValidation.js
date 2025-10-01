import validator from "validator"
function validateLoginData(data) {

    // Check if all required fields are given by user or not
    const requiredFields = ["email","password"]
    const allFieldsGiven = requiredFields.every((field)=> Object.keys(data).includes(field))

    if(!allFieldsGiven) 
    throw new Error("Please fill all the required fields")

    // Validate email
    if(!(validator.isEmail(data.email)))
    throw new Error("Email is Invalid")
}

export default validateLoginData