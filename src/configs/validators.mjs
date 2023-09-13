import joi from "joi";

const registerSchema = joi
    .object({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        middle_name: joi.string(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        password_confirmation: joi.ref("password"),
    })
    .options({ abortEarly: false });

const loginSchema = joi
    .object({
        email: joi.string().required(),
        password: joi.string().required(),
    })
    .options({ abortEarly: false });

export { registerSchema, loginSchema };
