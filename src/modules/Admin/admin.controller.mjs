import { registerSchema } from "../../configs/validators.mjs";
import { checkErrors } from "../../configs/utils.mjs";
import { registerAdmin } from "./admin.model.mjs";
import { totalEmployeers } from "../employeer/employeer.model.mjs";
import { totalJobs } from "../jobs/jobs.model.mjs";
import { totalApplicants } from "../applicant/applicant.model.mjs";

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
            const value = await registerSchema.validate(
                {
                    first_name: first_name,
                    last_name: last_name,
                    middle_name: middle_name,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                },
                { abortEarly: false, strict: true }
            );

            await registerAdmin(value);

            res.json({ msg: "Admin was created successfully", success: true });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(422).json({
                msg: "Failed to create admin",
                error: errors,
                success: false,
            });
        }
    },
    dashboard: async (req, res) => {
        try {
            const total_employeers = await totalEmployeers();
            const total_jobs = await totalJobs();
            const total_applicants = await totalApplicants();

            res.status(200).json({
                total: {
                    employeers: total_employeers,
                    jobs: total_jobs,
                    applicants: total_applicants,
                },
            });
        } catch (e) {
            const error = checkErrors(e);
            res.status(404).json({
                msg: "Failed to fetch data",
                errors: error,
            });
        }
    },
};
