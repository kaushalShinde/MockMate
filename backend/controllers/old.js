
const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        const validationResult = loginValidator(req);
        if(!validationResult?.success){
            return res.status(404).json(validationResult);
        }

        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Username"
            })
        }

        const isPasswordMatched = await comparePassword(password, user?.password);
        if(!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }
        
        const jwtData = {
            _id: user?._id,
        }
        const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('auth-token', token, {maxAge: 24 * 60 * 60 * 1000});
        res.status(200).json({
            user,
            token,
            success: true,
            message: `Welcome Back, ${user.name}`,
        })
    }
    catch(error) {
        console.log('loginRoute: ', error);
        return res.status(500).json({
            success: false,
            message:  "Internal Server Error Login",
        })
    }
}