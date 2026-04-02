import { UserActions } from "../db/queries.js";
import bcrypt from "bcryptjs";

const userQueries = new UserActions();

class UserController {
    async createUser(payload) {
        try{
            let result = {};
            const processedUserData = await processUserData(payload);
            if(processedUserData) {
                const existingEmail = await checkForExistingEmail(processedUserData.email);
                const existingUsername = await checkForExistingUsername(processedUserData.username);
                if(existingEmail){
                    result.isSuccess = false;
                    result.message = `There is already an account for the email address ${processedUserData.email}!`;
                } else if (existingUsername){
                    result.isSuccess = false;
                    result.message = `The username ${processedUserData.username} already exists!`;
                } else {
                    const newUser = await userQueries.createUser(processedUserData);
                    result.isSuccess = true;
                    result.newUser = newUser;
                }
            }
            return result;
        } catch(err){
            throw new Error(`Error when creating user: ${err.message}`);
        }
    }

    async updateUser(userId, updateData) {
        const updateObj = {};
        if (updateData.displayName) updateObj.displayName = updateData.displayName;
        if (updateData.email) updateObj.email = updateData.email;
        const updatedUser = await userQueries.updateUser(userId, updateData);
        return updatedUser;
    }

    async deleteUser(userId){
        const existingUser = await userQueries.getUserById(userId);
        if(existingUser){
            const removedUser = await userQueries.removeUser(userId);
            return {
                isSuccess: true,
                removedUser
            }
        } else {
            return {
                isSuccess: false,
                message: `Could not find any user having ID ${userId}`
            };
        }
    }

    async getUserDetails(userObj){
        let userDetails = null;
        let response = {
            isSuccess: false,
            message: "No user found!"
        }
        if(userObj.userId){
            userDetails = await userQueries.getUserById(userObj.userId);
        } else if (userObj.username){
            userDetails = await userQueries.getUserByUsername(userObj.username)
        } else if (userObj.email){
            userDetails = await userQueries.getUserByEmail(userObj.email)
        }
        if(userDetails){
            return userDetails
        }
        return response;
    }

    async getUsersListPaginated(cursor){
        let result = await userQueries.getUsersPaginated(cursor);
        return result;
    }

    async loginUser(userData){
        let result = null;
        userData = await processUserData(userData);
        if(userData.username && userData.password){
            let userDetails = await userQueries.getUserByEmailOrUsername(userData.username.trim());
            if(userDetails){
                let isPasswordCorrect = await bcrypt.compare(userData.password, userDetails.password);
                result = { isPasswordCorrect };
                if(isPasswordCorrect){
                    result.userDetails = userDetails;
                }
            } else {
                // din nou, aici nu ar trebui sa aruncam eroare, ci doar sa afisam un mesaj in interfata. De vazut cum facem asta (cel mai probabil res.send(fisier pagina login cu mesaj))
                throw new Error(`No user found for the given details!`);
            }
        } else {
            // aici ar trebui sa afisam un mesaj de eroare, nu sa aruncam o exceptie - in cazul unui throw new Error crapa aplicatia si nu vrem asta pt login
            throw new Error(`Both username and password fields must be filled!`);
        }
        return result
    }
}

async function processUserData(userData){
    console.log("=== Processing User Data ===");
    let processingResult = {}
    const stringFields = ['username', 'email', 'displayName'];
    const secureFields = ['password', 'confirm_password'];
    const booleanFields = ['isAuthorized'];
    const processed = {...userData};

    for(const field of stringFields){
        if(processed[field] !== null && typeof processed[field] == "string"){
            processed[field] = processed[field].trim();
        }
    }

    for(const field of booleanFields){
        if(Number(processed[field])){
            processed[field] = true 
        } else processed[field] = false;
    }

    if(processed.password == processed.confirmPassword){
        const hashedPassword = await hashPassword(processed.password);
        processed.password = hashedPassword;
        processed.confirmPassword = hashedPassword;
    } else {
        processingResult.isSuccess = false;
        processingResult.errorMessage = `Password and password confirmation fields must be identical!`;
        return processingResult;
    }

    console.log("=== Finished Processing User Data ===");
    processingResult = processed;
    processingResult.isSuccess = true;
    return processingResult;
}

async function hashPassword(password){
    let hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function checkForExistingUsername(username){
    let response = true;
    const existingUsername = await userQueries.getUserByUsername(username);
    if(!existingUsername){
        response = false;
    }
    return response;
}

    async function checkForExistingEmail(email){
    let response = true;
    const existingEmail = await userQueries.getUserByEmail(email);
    if(!existingEmail){
        response = false;
    }
    return response;
}

export {UserController}