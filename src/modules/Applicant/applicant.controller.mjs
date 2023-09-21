import { registerSchema } from "../../configs/validators.mjs";
import { errorMessagesObject } from "../../configs/errorMessages.mjs";
import { checkErrors } from "../../configs/utils.mjs";
import {
    registerApplicant,
    deleteApplicant,
    getApplicantUserId,
    allApplicants,
    applicantById,
} from "./applicant.model.mjs";

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

            await registerApplicant(value);
            res.json({
                message: "Successfully created an account",
                success: true,
            });
        } catch (e) {
            const error = checkErrors(e);
            res.json({
                msg: "Failed to create an account",
                error: error,
                success: false,
            });
        }
    },
    delete: async (req, res) => {
        const { applicant_id } = req.params;

        try {
            const user_id = await getApplicantUserId(applicant_id);
            const result = await deleteApplicant(
                user_id[0].user_id,
                applicant_id
            );

            console.user_id;

            res.json({ message: result.message, success: true });
        } catch (e) {
            if (e.hasOwnProperty("noExist")) {
                res.json({ error: e.noExist, success: false });
            } else {
                res.json({
                    message: "Failed to delete an applicant",
                    success: false,
                });
            }
        }
    },

    all: async (req, res) => {
        try {
            const data = await allApplicants();

            res.json({ datas: data, success: true });
        } catch (e) {
            console.log(e);

            res.json({ error: "Failed to get applicants", success: false });
        }
    },
    applicant: async (req, res) => {
        const { id } = req.params;
        console.log(id);
        // console.log("applicants");

        try {
            const data = await applicantById(id);

            res.json({ datas: data[0], success: true });
        } catch (e) {
            if (e.hasOwnProperty("noExist")) {
                res.json({ error: e.noExist, success: false });
            } else {
                res.json({ error: "Something went wrong", success: false });
            }
        }
    },
};
