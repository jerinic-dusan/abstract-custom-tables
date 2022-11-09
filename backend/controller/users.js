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
            const response = utils.mapResponse("All input is required");
            return res.status(400).json(response);
        }

        // Checking if the user already exists
        const user = await User.findOne({username});

        if (user && (await bcrypt.compare(password, user.password))) {
            // Creating a new token and assigning it to the user
            user.token = createToken(username, user._id);

            const response = utils.mapResponse("Successful log in", {username: username, token: user.token});
            return res.status(200).json(response);
        }
        const response = utils.mapResponse("Invalid credentials");
        res.status(400).json(response);
    } catch (error) {
        const response = utils.mapResponse("Invalid credentials");
        return res.status(401).json(response);
    }
}

exports.register = async function (req, res) {
    try {
        // Parsing user input
        const {username, email, password} = req.body;

        // Validating user input
        if (!(email && password && username)) {
            const response = utils.mapResponse("All input is required");
            return res.status(400).json(response);
        }

        // Checking if the user already exists
        const oldUser = await User.findOne({username});

        if (oldUser) {
            const response = utils.mapResponse("User already exists");
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

        const response = utils.mapResponse("Successful registration", {username: username, token: user.token});
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(`Oops, something went wrong: ${error.message}`);
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