import jwt from "jsonwebtoken";
import { userCredentials, userToken } from "./user.model.mjs";
import { unHashPassword } from "../../configs/utils.mjs";
import { adminByUserId } from "../Admin/admin.model.mjs";
import { loginSchema } from "../../configs/validators.mjs";
import { errorMessagesObject } from "../../configs/errorMessages.mjs";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../configs/secrets.mjs";

export const CONTROLLER = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const value = await loginSchema.validateAsync({
                email: email,
                password: password,
            });
            const user_details = await userCredentials(email);
            console.log(user_details);
            const isMatch = await unHashPassword(
                password,
                user_details[0].password
            );
            if (isMatch) {
                const user = await adminByUserId(user_details[0].id);

                const accessToken = jwt.sign({ email: email }, ACCESS_TOKEN, {
                    expiresIn: "30m",
                });

                const refreshToken = jwt.sign({ email: email }, REFRESH_TOKEN, {
                    expiresIn: "1d",
                });

                if ((user_details[0].role = "admin")) {
                    res.json({
                        user: user[0],
                        accessToken: accessToken,
                        msg: "Login Successfully",
                        success: true,
                    });
                }
            } else {
                res.json({ msg: "Invalid Email or Passowrd", success: false });
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
};
