


const newUserValidator = (req) => {
    const { name, username, email, password, bio, organization, designation } = req.body;
    const file = req.file;

    if(!name || !email || !username || !password){
        console.log('New User Validation Failed');
        return {
            success: false,
            message: "Please Fill all Fields",
        }
    }

    if(!file){
        return {
            success: false,
            message: "Please select single file",
        }
    }

    return {success: true};
}

const loginValidator = (req) => {
    const { email, password } = req.body;

    if(!email || !password){
        console.log('Login Validation Failed');
        return {
            success: false,
            message: "Please fill required fields",
        }
    }

    return {success: true};
}



export {
    newUserValidator,
    loginValidator,
}