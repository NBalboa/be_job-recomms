import { DateTime } from "luxon";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./secrets.mjs";
import { yupErrorsMap } from "./errorMessages.mjs";
const getCurrentDateTime = () => {
    return DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
};

function formatDateToSQLDateTime(date) {
    return DateTime.fromISO(date).toFormat("yyyy-MM-dd HH:mm:ss");
}

function checksValidDate(date) {
    const luxonDate = DateTime.fromISO(date);
    return new Promise((resolve, reject) => {
        if (luxonDate.isValid) {
            resolve(luxonDate);
        } else {
            reject({ invalidDate: "Invalid Date" });
        }
    });
}
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
        const currentDate = DateTime.now().toLocaleString().replaceAll("/", "");
        const generateId = `${user_type}-${currentDate}${formattedId}`;
        resolve(generateId);
    });
}

function checkErrors(errors) {
    if (errors.inner?.length > 0) {
        return yupErrorsMap(errors);
    } else if (errors.hasOwnProperty("errno") && errors.errno === 1062) {
        return { used_email: "Email Already in used" };
    } else if (errors.register) {
        return errors;
    } else {
        return errors;
    }
}

export {
    getCurrentDateTime,
    hashPassword,
    unHashPassword,
    generateID,
    checkErrors,
    formatDateToSQLDateTime,
    checksValidDate,
};
