import { registerSchema } from "../../configs/validators.mjs";
import { errorMessagesObject } from "../../configs/errorMessages.mjs";
import { registerEmployeer } from "./employeer.model.mjs";
import { checkErrors } from "../../configs/utils.mjs";
const CONTROLLER = {
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

            await registerEmployeer(value);

            res.json({ msg: "Success register Employeee", success: true });
        } catch (e) {
            const error = checkErrors(e);
            res.json({
                msg: "Failed to create employeer",
                error: error,
                success: false,
            });
        }
    },
};

export { CONTROLLER };
