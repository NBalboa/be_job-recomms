import { registerSchema } from "../../configs/validators.mjs";
import { checkErrors } from "../../configs/utils.mjs";
import { registerAdmin } from "./admin.model.mjs";

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
        // await registerAdmin("value");
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
            const error = checkErrors(e);
            res.json({
                msg: "Failed to create admin",
                error: error,
                success: false,
            });
        }

        // res.json({ msg: "Hi admin" });
    },
};
