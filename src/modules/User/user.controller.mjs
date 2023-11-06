import jwt from "jsonwebtoken";
import {
    unToken,
    userCredentials,
    userRefreshToken,
    userToken,
} from "./user.model.mjs";
import { unHashPassword } from "../../configs/utils.mjs";
import { adminByUserId } from "../admin/admin.model.mjs";
import { loginSchema } from "../../configs/validators.mjs";
import { checkErrors } from "../../configs/utils.mjs";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../configs/secrets.mjs";
import { employeerByUserId } from "../employeer/employeer.model.mjs";
import { applicantByUserId } from "../applicant/applicant.model.mjs";

export const CONTROLLER = {
    login: async (req, res) => {
        const { email, password } = req.body;
        console.log(email, password);
        try {
            const value = await loginSchema.validate(
                {
                    email: email,
                    password: password,
                },
                { abortEarly: false }
            );

            const user_details = await userCredentials(email);
            const isMatch = await unHashPassword(
                password,
                user_details[0].password
            );
            if (user_details.length === 0) {
                return res.json({ msg: "Register", success: false });
            } else if (isMatch) {
                const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN, {
                    expiresIn: "30m",
                });

                const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN, {
                    expiresIn: "1d",
                });

                await userToken(refreshToken, user_details[0].id);
                if (user_details[0].role === "admin") {
                    const user = await adminByUserId(user_details[0].id);
                    return res.status(200).json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                } else if (user_details[0].role === "applicant") {
                    console.log("Hi");
                    const user = await applicantByUserId(user_details[0].id);
                    console.log(user);
                    return res.status(200).json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                } else {
                    const user = await employeerByUserId(user_details[0].id);
                    return res.status(200).json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                }
            } else {
                res.status(422).json({
                    msg: "Invalid Email or Password",
                    success: false,
                });
            }
        } catch (e) {
            const errors = checkErrors(e);
            if (errors.length === 0) {
                res.status(422).json({
                    msg: "Invalid Email or Password",
                    success: false,
                });
            } else {
                res.status(422).json({
                    msg: "Failed to Login",
                    error: errors,
                    success: false,
                });
            }
        }
    },

    logout: async (req, res) => {
        const { id } = req.params;
        console.log(id);

        try {
            await unToken(id);
        } catch (e) {
            console.log(e);
        }

        res.json({ mgs: "logout" });
    },

    refreshToken: async (req, res) => {
        const { email } = req.body;

        try {
            const refreshToken = await userRefreshToken(email);

            if (!refreshToken || !email) {
                res.status(403);
            } else {
                jwt.verify(refreshToken, REFRESH_TOKEN, (err, decoded) => {
                    if (err || decoded.email !== email) {
                        res.status(403);
                    }

                    const accessToken = jwt.sign(
                        { email: email },
                        ACCESS_TOKEN,
                        {
                            expiresIn: "30m",
                        }
                    );

                    res.status(200).json({ accessToken: accessToken });
                });
            }
        } catch (e) {
            console.log(e);
            const errors = checkErrors(e);
            res.status(422).json({ error: errors });
        }
    },
};
