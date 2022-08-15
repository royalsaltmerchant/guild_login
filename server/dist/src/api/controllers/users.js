"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mail = require('../smtp/index');
const { getUserByIdQuery, getAllUsersQuery, getUserByUsernameQuery, getUserByEmailQuery, registerUserQuery, editUserQuery, editUserPasswordQuery } = require('../queries/users');
const { getContributionsByUserIdQuery, getAllContributionsQuery } = require('../queries/contributions');
const { getAllContributedAssetsQuery } = require('../queries/contributedAssets');
function generateAccessToken(id, expires) {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: expires });
}
function sendResetEmail(user, token) {
    mail.sendMessage({
        user: user,
        title: "Reset Password",
        message: `Visit the following link to reset your password: <a href="https://app.sfaudioguild.com/reset_password/${token}">Reset Password</a>`
    });
}
function verifyUserByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.verify(token, process.env.SECRET_KEY, (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return null;
            const userData = yield getUserByIdQuery(user.id);
            if (userData.rows.length === 0)
                return null;
            return userData;
        }));
    });
}
function getUserByToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['x-access-token'] ? req.headers['x-access-token'].split(' ')[1] : null;
            if (token) {
                const userData = yield verifyUserByToken(token);
                if (!userData)
                    return res.status(400).json({ message: "Cannot get user by token" });
                const contributionData = yield getContributionsByUserIdQuery(userData.rows[0].id);
                const contributedAssetData = yield getAllContributedAssetsQuery();
                for (var contribution of contributionData.rows) {
                    contribution.contributed_assets = contributedAssetData.rows.filter(asset => asset.contribution_id === contribution.id);
                }
                const data = userData.rows[0];
                data.contributions = contributionData.rows;
                res.send(data);
            }
            else
                return res.status(400).json({ message: "No token sent in headers" });
        }
        catch (err) {
            next(err);
        }
    });
}
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersData = yield getAllUsersQuery();
            const contributionsData = yield getAllContributionsQuery();
            const data = [];
            usersData.rows.forEach(user => {
                user.contributions = contributionsData.rows.filter(contribution => contribution.user_id === user.id);
                data.push(user);
            });
            res.send(data);
        }
        catch (err) {
            next(err);
        }
    });
}
function getUserById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield getUserByIdQuery(req.body.id);
            const contributionData = yield getContributionsByUserIdQuery(userData.rows[0].id);
            const data = userData.rows[0];
            data.contributions = contributionData.rows;
            res.send(data);
        }
        catch (err) {
            next(err);
        }
    });
}
function getUserByUsername(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield getUserByUsernameQuery(req.body.username);
            const contributionData = yield getContributionsByUserIdQuery(userData.rows[0].id);
            const data = userData.rows[0];
            data.contributions = contributionData.rows;
            res.send(data);
        }
        catch (err) {
            next(err);
        }
    });
}
function registerUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, first_name, last_name, password } = req.body;
            // hash password
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            const userData = yield registerUserQuery({
                username,
                email: email.toLowerCase(),
                first_name: first_name.toLowerCase(),
                last_name: last_name.toLowerCase(),
                password: hashedPassword
            });
            const data = userData.rows[0];
            res.status(201).json(data);
        }
        catch (err) {
            next(err);
        }
    });
}
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.body.username_or_email;
            const email = req.body.username_or_email.toLowerCase();
            const password = req.body.password;
            let user;
            const userNameData = yield getUserByUsernameQuery(username);
            if (userNameData.rows.length !== 0) {
                user = userNameData.rows[0];
            }
            else {
                const userEmailData = yield getUserByEmailQuery(email);
                if (userEmailData.rows.length !== 0) {
                    user = userEmailData.rows[0];
                }
                else
                    return res.status(400).json({ message: "Incorrect, Account, Information" });
            }
            if (user) {
                const validPassword = yield bcrypt.compare(password, user.password);
                if (validPassword) {
                    const token = generateAccessToken(user.id, '30d');
                    res.send({ token: token });
                }
                else
                    return res.status(400).json({ message: "Invalid Password" });
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function verifyJwt(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['x-access-token'] ? req.headers['x-access-token'].split(' ')[1] : null;
            if (token) {
                const userData = verifyUserByToken(token);
                if (!userData)
                    return res.status(400).json({ message: "Can't find user by token" });
                res.send({ message: "Token validated" });
            }
            else
                return res.status(400).json({ message: "No token sent in headers" });
        }
        catch (err) {
            next(err);
        }
    });
}
function editUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.coins) {
                const userData = yield getUserByIdQuery(req.body.user_id);
                const coins = userData.rows[0].coins;
                req.body.coins += coins;
            }
            if (req.body.approved_asset_count) {
                const userData = yield getUserByIdQuery(req.body.user_id);
                const approvedAssetCount = userData.rows[0].approved_asset_count;
                req.body.approved_asset_count += approvedAssetCount;
            }
            const userEditData = yield editUserQuery(req.body);
            res.send(userEditData.rows[0]);
        }
        catch (err) {
            next(err);
        }
    });
}
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.body.token;
            const password = req.body.password;
            const userData = yield verifyUserByToken(token);
            if (userData) {
                // hash password
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const user = yield editUserPasswordQuery(userData.rows[0].id, hashedPassword);
                res.send({ message: `Reset password success for user: ${user.rows[0].id}` });
            }
            else
                res.status(400).json({ message: "Invalid Token" });
        }
        catch (err) {
            next(err);
        }
    });
}
function requestResetEmail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield getUserByEmailQuery(req.body.email.toLowerCase());
            if (userData.rows.length !== 0) {
                const user = userData.rows[0];
                const token = generateAccessToken(user.id, '30m');
                sendResetEmail(userData.rows[0], token);
                res.send({ message: 'Email has been sent' });
            }
            else
                return res.status(400).json({ message: 'No user found by this email' });
        }
        catch (err) {
            next(err);
        }
    });
}
module.exports = {
    getUserByToken,
    getAllUsers,
    getUserById,
    getUserByUsername,
    registerUser,
    loginUser,
    verifyJwt,
    editUser,
    resetPassword,
    requestResetEmail
};
