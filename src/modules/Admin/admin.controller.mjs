import { registerSchema } from "../../configs/validators.mjs";
import { registerAdmin } from "./admin.model.mjs";
import { errorMessagesObject } from "../../configs/errorMessages.mjs";

export const CONTROLLER = {
    register: async (req, res) => {
        const {
            first_name,
            last_name,
            middle_name,
            email,
            password,
            password_confirmation,
        } = req.body;

        try {
            const value = await registerSchema.validateAsync({
                first_name: first_name,
                last_name: last_name,
                middle_name: middle_name,
                email: email,
                password: password,
                password_confirmation: password_confirmation,
            });

            await registerAdmin(value);

            res.json({ msg: "Admin was created successfully", success: true });
        } catch (e) {
            if (e.hasOwnProperty("details")) {
                const errors = errorMessagesObject(e.details);
                res.json({
                    message: "Admin wasn't created",
                    errors: errors,
                    success: false,
                });
            } else if (e.hasOwnProperty("errno") && e.errno === 1062) {
                res.json({ errors: "Email already in used", success: false });
            } else {
                console.log(e);
                res.json({
                    message: "Admin wasn't created",
                    errors: e,
                    success: false,
                });
            }
        }

        // res.json({ msg: "Hi admin" });
    },
};
