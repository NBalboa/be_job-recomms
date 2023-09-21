import moment from "moment";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./secrets.mjs";
import { errorMessagesObject } from "./errorMessages.mjs";
const getCurrentDateTime = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
};

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function unHashPassword(password, hashPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function generateID(id, user_type) {
    id++;
    return new Promise((resolve) => {
        const formattedId = id.toString().padStart(5, "0");
        const generateId = `PAGA-${user_type}-${formattedId}`;
        resolve(generateId);
    });
}

function checkErrors(e) {
    console.log(e);
    if (e.hasOwnProperty("details")) {
        const errors = errorMessagesObject(e.details);
        return errors;
    } else if (e.hasOwnProperty("errno") && e.errno === 1062) {
        return "Email Already in used";
    } else {
        return e;
    }
}

export {
    getCurrentDateTime,
    hashPassword,
    unHashPassword,
    generateID,
    checkErrors,
};
