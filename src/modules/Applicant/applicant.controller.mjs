import {
    applicantAddressSchema,
    applicantEducationSchema,
    applicantExperienceSchema,
    arraysDataSchema,
    registerSchema,
} from "../../configs/validators.mjs";
// import { errorMessagesObject } from "../../configs/errorMessages.mjs";
import {
    checkErrors,
    filterArray,
    formatMonthAndYearToSQL,
    formatYearToSQL,
} from "../../configs/utils.mjs";
import {
    registerApplicant,
    deleteApplicant,
    getApplicantUserId,
    allApplicants,
    applicantById,
    registerApplicantCurrentAddress,
    registerApplicantPermanentAddress,
    registerApplicantEducation,
    registerApplicantExperience,
    registerSkills,
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
            const value = await registerSchema.validate(
                {
                    first_name: first_name,
                    last_name: last_name,
                    middle_name: middle_name,
                    email: email,
                    password: password,
                    password_confirmation: password_confirmation,
                },
                { abortEarly: false }
            );

            await registerApplicant(value);
            res.json({
                message: "Successfully created an account",
                success: true,
            });
        } catch (e) {
            const error = checkErrors(e);
            res.status(422).json({
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

    current_address: async (req, res) => {
        const {
            street,
            purok,
            barangay,
            municipality,
            province,
            same_address,
        } = req.body;
        const { applicantId } = req.params;
        try {
            const value = await applicantAddressSchema.validate(
                {
                    street: street,
                    purok: purok,
                    barangay: barangay,
                    municipality: municipality,
                    province: province,
                },
                { abortEarly: false }
            );
            if (same_address) {
                await registerApplicantPermanentAddress(value, applicantId);
            }
            await registerApplicantCurrentAddress(value, applicantId);

            res.status(200).json({
                msg: "Successfully created an address",
                success: true,
            });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(422).json({
                message: "Failed to create an address",
                error: errors,
                success: false,
            });
        }
    },
    permanent_address: async (req, res) => {
        const {
            street,
            purok,
            barangay,
            municipality,
            province,
            same_address,
        } = req.body;
        const { applicantId } = req.params;
        try {
            const value = await applicantAddressSchema.validate(
                {
                    street: street,
                    purok: purok,
                    barangay: barangay,
                    municipality: municipality,
                    province: province,
                },
                { abortEarly: false }
            );

            await registerApplicantPermanentAddress(value, applicantId);

            res.status(200).json({
                msg: "Successfully created an address",
                success: true,
            });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(422).json({
                message: "Failed to create an address",
                error: errors,
                success: false,
            });
        }
    },
    education: async (req, res) => {
        const { school, course, description, start_year, end_year } = req.body;

        const formattedStartYear = formatYearToSQL(start_year);
        const formattedEndYear = formatYearToSQL(end_year);

        const { applicantId } = req.params;
        try {
            const value = await applicantEducationSchema.validate(
                {
                    school: school,
                    course: course,
                    description: description,
                    start_year: formattedStartYear,
                    end_year: formattedEndYear,
                },
                { abortEarly: false }
            );

            await registerApplicantEducation(value, applicantId);
            res.status(200).json({
                msg: "Successfully created an Education",
                success: true,
            });
        } catch (e) {
            const errors = checkErrors(e);
            res.status(422).json({
                msg: "Failed to create education",
                error: errors,
                success: false,
            });
        }
    },
    experience: async (req, res) => {
        const { title, company, description, start_date, end_date } = req.body;
        const { applicantId } = req.params;
        const formattedStartDate = formatMonthAndYearToSQL(start_date);
        const formmattedEndDate = formatMonthAndYearToSQL(end_date);

        try {
            const value = await applicantExperienceSchema.validate(
                {
                    title: title,
                    company: company,
                    description: description,
                    start_date: formattedStartDate,
                    end_date: formmattedEndDate,
                },
                { abortEarly: false }
            );
            await registerApplicantExperience(value, applicantId);

            res.status(200).json({
                mgs: "Successfully created an Experience",
                success: true,
            });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(422).json({
                msg: "Failed to create Experience",
                error: errors,
                success: false,
            });
        }
    },

    skills: async (req, res) => {
        const { skills } = req.body;
        const { applicantId } = req.params;

        const filtered = filterArray(skills);
        // res.send("Test");
        try {
            const value = await arraysDataSchema.validate(
                { descriptions: filtered },
                { abortEarly: false }
            );
            await registerSkills(value.descriptions, applicantId);

            res.status(200).json({
                mgs: "Successfully created an skills",
                success: true,
            });
        } catch (e) {
            const errors = checkErrors(e);

            res.status(422).json({
                msg: "Failed to create skills",
                error: errors,
                success: false,
            });
        }
    },
};
