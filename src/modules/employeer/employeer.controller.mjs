import { employerRegisterSchema } from "../../configs/validators.mjs";
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
            company_name,
            company_url,
            mobile_no,
            telephone_no,
        } = req.body;

        try {
            const value = await employerRegisterSchema.validate(
                {
                    first_name: first_name,
                    last_name: last_name,
                    middle_name: middle_name,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                    company_name: company_name,
                    company_url: company_url,
                    telephone_no: telephone_no,
                    mobile_no: mobile_no,
                },
                { abortEarly: false }
            );

            await registerEmployeer(value);

            res.json({ msg: "Success register Employeee", success: true });
        } catch (e) {
            const error = checkErrors(e);
            console.log(error);
            res.status(422).json({
                msg: "Failed to create employeer",
                error: error,
                success: false,
            });
        }
    },
};

export { CONTROLLER };
