const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const utils = require('../utils/utils');

exports.login = async function (req, res) {
    try {
        // Parsing user input
        const {username, password} = req.body;

        // Validating user input
        if (!(username && password)) {
            const response = utils.mapResponse(400, "All input is required");
            return res.status(400).json(response);
        }

        // Checking if the user already exists
        const user = await User.findOne({username}).populate('cart', '-__v -details');

        if (user && (await bcrypt.compare(password, user.password))) {
            // Creating a new token and assigning it to the user
            user.token = createToken(username, user._id);

            const response = utils.mapResponse(200, "Successful log in", {username: username, email: user.email, token: user.token, cart: user.cart});
            return res.status(200).json(response);
        }
        const response = utils.mapResponse(403, "Invalid credentials");
        res.status(403).json(response);
    } catch (error) {
        const response = utils.mapResponse(401, "Invalid credentials");
        return res.status(401).json(response);
    }
}

exports.register = async function (req, res) {
    try {
        // Parsing user input
        const {username, email, password} = req.body;

        // Validating user input
        if (!(email && password && username)) {
            const response = utils.mapResponse(400, "All input is required");
            return res.status(400).json(response);
        }

        // Checking if the user already exists
        const oldUser = await User.findOne({username});

        if (oldUser) {
            const response = utils.mapResponse(409, "User already exists");
            return res.status(409).json(response);
        }

        //Encrypting user password
        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Creating a new token and assigning it to the user
        user.token = createToken(username, user._id);

        const response = utils.mapResponse(200, "Successful registration", {username: username, email: user.email, token: user.token});
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.reload = async function(req, res) {
    try {
        const {username} = req;

        const user = await User.findOne({username}).populate('cart', '-__v -details');

        if (user) {
            const response = utils.mapResponse(200, "Reloading user", {username: user.username, email: user.email, token: user.token, cart: user.cart});
            return res.status(200).json(response);
        }
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

function createToken(username, userId) {
    return jwt.sign(
        {
            username: username,
            userId: userId
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
}