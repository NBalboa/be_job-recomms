import jwt from "jsonwebtoken";
import { unToken, userCredentials, userToken } from "./user.model.mjs";
import { unHashPassword } from "../../configs/utils.mjs";
import { adminByUserId } from "../admin/admin.model.mjs";
import { loginSchema } from "../../configs/validators.mjs";
import { errorMessagesObject } from "../../configs/errorMessages.mjs";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../configs/secrets.mjs";
import { employeerByUserId } from "../employeer/employeer.model.mjs";
import { applicantByUserId } from "../applicant/applicant.model.mjs";

export const CONTROLLER = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const value = await loginSchema.validateAsync({
                email: email,
                password: password,
            });
            const user_details = await userCredentials(email);
            const isMatch = await unHashPassword(
                password,
                user_details[0].password
            );

            if (isMatch) {
                const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN, {
                    expiresIn: "30m",
                });

                const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN, {
                    expiresIn: "1d",
                });

                await userToken(refreshToken, user_details[0].id);
                if (user_details[0].role === "admin") {
                    const user = await adminByUserId(user_details[0].id);
                    res.json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                } else if (user_details[0].role === "applicant") {
                    const user = await applicantByUserId(user_details[0].id);
                    console.log(user);
                    res.json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                } else if (user_details[0].role === "employeer") {
                    const user = await employeerByUserId(user_details[0].id);
                    res.json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                }
            } else {
                res.json({ msg: "Invalid Email or Password", success: false });
            }
        } catch (e) {
            if (e.hasOwnProperty("details")) {
                const errors = errorMessagesObject(e.details);
                res.json({ errors: errors, success: false });
            } else {
                res.json({
                    msg: e,
                    success: false,
                });
            }
        }
    },

    logout: async (req, res) => {
        const { id } = req.params;

        try {
            await unToken(id);
        } catch (e) {
            console.log(e);
        }

        res.json({ mgs: "logout" });
    },
};
