const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    //first check request headers has authorization token or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'unauthorized'});

    //Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unautorised'});
    
    try{
        //verify the JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1h' });

        //Attach user information to the request object
        req.user = decoded
        next();
    }
    catch(err) {
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
}

//Function to generate JWT token
const generateToken = (userData) => {
    //Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};