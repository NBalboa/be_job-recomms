import moment from "moment";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./secrets.mjs";
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

export { getCurrentDateTime, hashPassword };
