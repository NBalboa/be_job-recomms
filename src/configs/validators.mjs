import yup from "yup";

const registerSchema = yup.object().shape({
    first_name: yup.string().required("Please Enter First Name"),
    last_name: yup.string().required("Please Enter Last Name"),
    middle_name: yup.string(),
    email: yup
        .string()
        .email("Please Enter Valid Email")
        .required("Please Enter Email"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
    password_confirmation: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password"), null], "Passwords must be match"),
    otp: yup.string().required("OTP is required"),
});

const registerAdminSchema = yup.object().shape({
    first_name: yup.string().required("Please Enter First Name"),
    last_name: yup.string().required("Please Enter Last Name"),
    middle_name: yup.string(),
    email: yup
        .string()
        .email("Please Enter Valid Email")
        .required("Please Enter Email"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
    password_confirmation: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password"), null], "Passwords must be match"),
});

const employerRegisterSchema = yup.object().shape({
    first_name: yup.string().required("Please Enter First Name"),
    last_name: yup.string().required("Please Enter Last Name"),
    middle_name: yup.string(),
    email: yup
        .string()
        .email("Please Enter Valid Email")
        .required("Please Enter Email"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long"),
    password_confirmation: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password"), null], "Passwords must be match"),
    company_name: yup.string().required("Company name required"),
    company_url: yup.string(),
    mobile_no: yup.string().required("Mobile No. required"),
    telephone_no: yup.string().required("Telephone No. required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().required("Please Enter  Email").email("Invalid Email"),
    password: yup.string().required("Please Enter Password"),
});

const companyRegisterSchema = yup.object().shape({
    owner_name: yup
        .string()
        .required("President's/Owner's name of the Company is Required "),
    bussiness_name: yup.string().required("Bussiness is is Required"),
    trade_name: yup.string(),
    tin: yup.string().required("Company's TIN is Required"),
    acronym: yup
        .string()
        .required("Acronym/Abbreviations of the Company is Required"),
    employer_type: yup.string().required("Employer Type is Required"),
    total_workforce: yup.string().required("Total Work Force is Required"),
    major_industry_group: yup.string().required("Major Industry is Required"),
    street: yup.string().required("Street is Required"),
    barangay: yup.string().required("Barangay is Required"),
    municipality: yup.string().required("City/Municipality is Required"),
    province: yup.string().required("Province is Required"),
});

const jobRegisterSchema = yup.object().shape({
    position: yup.string().required("Position required"),
    description: yup.string().required("Description required"),
    nature_of_work: yup.string().required("Nature of Work Required"),
    place_of_work: yup.string().required("Place of Work Required"),
    salary: yup
        .number("Must be a number")
        .required("Salary is Required")
        .positive(),
    vacancies: yup
        .number("Must be a number")
        .required("Vacancies is required")
        .positive()
        .integer(),
    posting_date: yup.date("Invalid date").required("Posting date is required"),
    valid_until: yup.date("Invalid date").required("Valid until is required"),
});

yup.addMethod(yup.array, "arrayOfStrings", function (customErrorMessage) {
    const defaultErrorMsg =
        "${path} must not be empty and contain only strings";
    const errorMsg = customErrorMessage || defaultErrorMsg;
    return this.test({
        name: "arrayOfStrings",
        message: errorMsg,
        test: function (value) {
            if (!Array.isArray(value) || value.length === 0) {
                return false;
            }
            return value.every((element) => typeof element === "string");
        },
    });
});

const arraysDataSchema = yup.object().shape({
    descriptions: yup
        .array()
        .arrayOfStrings(
            "Qualifications must be not empty and contain only strings"
        ),
});

const applicantSkillsSchema = yup.object().shape({
    descriptions: yup
        .array()
        .arrayOfStrings(
            "Qualifications must be not empty and contain only strings"
        ),
});

const applicantAddressSchema = yup.object().shape({
    street: yup.string().required("House No./Street is required"),
    purok: yup.string().required("Purok is required"),
    barangay: yup.string().required("Barangay is required"),
    municipality: yup.string().required("City/Municipality is required"),
    province: yup.string(),
});

const applicantEducationSchema = yup.object().shape({
    school: yup.string().required("School is required"),
    course: yup.string(),
    description: yup.string(),
    start_year: yup.string().required("Start Year is required"),
    end_year: yup.string().required("Start Year is Required"),
});

const applicantExperienceSchema = yup.object().shape({
    title: yup.string().required("Title is Required"),
    company: yup.string().required("Company is Required"),
    description: yup.string(),
    start_date: yup.string().required("Start Date is Required"),
    end_date: yup.string().required("Start Date is Required"),
});

const otpSchema = yup.object().shape({
    email: yup.string().required("Email is Required"),
});

export {
    otpSchema,
    applicantAddressSchema,
    applicantEducationSchema,
    applicantExperienceSchema,
    registerSchema,
    loginSchema,
    companyRegisterSchema,
    employerRegisterSchema,
    jobRegisterSchema,
    arraysDataSchema,
    applicantSkillsSchema,
    registerAdminSchema,
};
