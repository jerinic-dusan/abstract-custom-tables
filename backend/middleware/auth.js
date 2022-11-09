const jwt = require("jsonwebtoken");
const utils = require('../utils/utils');
const config = process.env;

module.exports = (req, res, next) => {
    const token = req.get("Authorization");
    let decodedToken;

    try {
        decodedToken = jwt.verify(token.substring(7), config.TOKEN_KEY);
        if(!decodedToken){
            const response = utils.mapResponse("Invalid token");
            res.status(401).json(response);
        } else{
            req.userId = decodedToken.userId;
            req.username = decodedToken.username;
            next();
        }
    } catch (error) {
        const response = utils.mapResponse("Invalid token");
        res.status(401).json(response);
    }
};