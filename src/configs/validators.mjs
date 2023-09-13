import joi from "joi";

const registerSchema = joi
    .object({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        middle_name: joi.string(),
        email: joi.string().email().required(),
        password: joi.string(),
        password_confirmation: joi.ref("password"),
    })
    .options({ abortEarly: false });

export { registerSchema };
