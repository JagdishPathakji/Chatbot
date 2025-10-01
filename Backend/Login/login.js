import verifyCredentials from "./verifyCred.js"
import validateLoginData from "./loginDataValidation.js"

const login = async (body)=> {

    try {
        validateLoginData(body)
        await verifyCredentials(body)

        return {"success": "Validation and verification successfull"}
    }
    catch(error) {
        return {"error": error.message}
    }
}

export default login