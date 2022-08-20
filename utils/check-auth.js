const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load .env file

module.exports = (context) => {
    const auth = context.req.headers.authorization;
    if (auth) {
        const token = auth.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                return user;
            } catch (err) {
                throw new Error('Invalid /  Expired Token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization Heaaader must be Provided');
}