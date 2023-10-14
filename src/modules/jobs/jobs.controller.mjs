import { checkErrors, checksValidDate } from "../../configs/utils.mjs";
import {
    jobRegisterSchema,
    qualificationsSchema,
} from "../../configs/validators.mjs";
import { spawn } from "child_process";
import {
    allJobs,
    registerJobs,
    registerQualifications,
} from "./jobs.model.mjs";
import { checkEmployerById } from "../employeer/employeer.model.mjs";
// import { DateTime } from "luxon";

// function executeJobRecommendation(script, args) {
//     const argument = args.map((arg) => arg.toString());

//     const python = spawn(script, [script, ...arguments]);
// }

export const CONTROLLER = {
    register: async (req, res) => {
        const {
            position,
            description,
            nature_of_work,
            place_of_work,
            salary,
            vacancies,
            posting_date,
            valid_until,
        } = req.body;
        const { hiringManagerId } = req.params;

        try {
            await checkEmployerById(hiringManagerId);
            const [value, posting_check, valid_check] = await Promise.all([
                jobRegisterSchema.validate(
                    {
                        position: position,
                        description: description,
                        nature_of_work: nature_of_work,
                        place_of_work: place_of_work,
                        salary: salary,
                        vacancies: vacancies,
                        posting_date: posting_date,
                        valid_until: valid_until,
                    },
                    { abortEarly: false }
                ),
                checksValidDate(posting_date),
                checksValidDate(valid_until),
            ]);
            await registerJobs(hiringManagerId, value);
            res.status(200).json({ msg: "Successfully added a job" });
        } catch (e) {
            const errors = checkErrors(e);
            res.status(422).json({ error: errors });
        }
    },

    registerQualifications: async (req, res) => {
        const { descriptions } = req.body;
        const { jobId } = req.params;
        try {
            const value = await qualificationsSchema.validate(
                { descriptions: descriptions },
                {
                    abortEarly: false,
                }
            );
            await registerQualifications(jobId, value.descriptions);
            res.status(200).json({ msg: "Successfully added qualifications" });
        } catch (e) {
            const errors = checkErrors(e);
            console.log(errors);
            res.status(422).json({
                msg: "Can't add qualifications",
                error: errors,
            });
        }
    },
    jobs: async (req, res) => {
        try {
            const jobs = await allJobs();

            res.status(200).json({ jobs: jobs });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(404).json({
                msg: "Something went wrong",
                error: errors,
            });
        }
    },
};
