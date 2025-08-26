// ---- backend/middleware/authMiddleware.js ----
const jwt = require('jsonwebtoken');
const JWT_SECRET = "YOUR_SUPER_SECRET_JWT_KEY";
module.exports = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided!' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized!' });
        req.userId = decoded.id;
        next();
    });
};