const jwt = require('jsonwebtoken');

//Validate token (protected routes)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({
            error: 'Acceso denegado'
        })
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next() //If is the same user we continue
    } catch (error) {
        res.status(400).json({
            error: 'Token invalido.'
        })
    }
}

module.exports = verifyToken;