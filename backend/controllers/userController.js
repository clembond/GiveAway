// ---- backend/controllers/userController.js ----
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.User;
const JWT_SECRET = "YOUR_SUPER_SECRET_JWT_KEY";

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, accountType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, accountType });
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).send({ message: 'User not found.' });
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ message: 'Invalid Password!' });
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};