import { totalUsers } from "../user/user.model.mjs";
import {
    hashPassword,
    generateID,
    getCurrentDateTime,
} from "../../configs/utils.mjs";
import { connection } from "../../configs/database.mjs";

async function registerEmployeer(data) {
    const role = "employeer";
    const [total_employeers, total_users, password] = await Promise.all([
        totalEmployeers(),
        totalUsers(),
        hashPassword(data.password),
    ]);

    const [user_id, employeer_id] = await Promise.all([
        generateID(total_users[0].total_users, "USER"),
        generateID(total_employeers[0].total_employeers, "EMPLOYEER"),
    ]);

    const userData = [
        user_id,
        data.email,
        password,
        role,
        getCurrentDateTime(),
        getCurrentDateTime(),
    ];

    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            const userSQL =
                "INSERT INTO users (id,email, password, role, created_at, updated_at) VALUES(?,?,?,?,?,?)";
            const employeerSQL =
                "INSERT INTO hiring_managers (id ,user_id, first_name, last_name, middle_name, created_at, updated_at) VALUES (?,?,?,?,?,?,?)";

            connection.query(userSQL, userData, (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        reject(err);
                    });
                    console.log(result);
                } else {
                    console.log(err, result);
                    const employeerData = [
                        employeer_id,
                        user_id,
                        data.first_name,
                        data.last_name,
                        data.middle_name,
                        getCurrentDateTime(),
                        getCurrentDateTime(),
                    ];

                    connection.query(
                        employeerSQL,
                        employeerData,
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                connection.rollback(() => {
                                    reject(err);
                                });
                            } else {
                                connection.commit((err) => {
                                    if (err) {
                                        connection.rollback(() => {
                                            reject({
                                                error: err,
                                            });
                                        });
                                    }
                                    resolve(result);
                                });
                            }
                        }
                    );
                }
            });
        });
    });
}

function totalEmployeers() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_employeers FROM hiring_managers",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    });
}

function employeerByUserId(id) {
    const query =
        "SELECT hiring_managers.id, hiring_managers.user_id, hiring_managers.first_name, hiring_managers.last_name, hiring_managers.middle_name, users.email, users.role FROM hiring_managers LEFT JOIN users ON hiring_managers.user_id = users.id WHERE hiring_managers.user_id = ?";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    });
}

export { registerEmployeer, employeerByUserId };
