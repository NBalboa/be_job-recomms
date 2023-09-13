import { connection } from "../../configs/database.mjs";
import { hashPassword, getCurrentDateTime } from "../../configs/utils.mjs";

async function registerAdmin(data) {
    const role = "admin";

    const password = await hashPassword(data.password);

    const userData = [
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
                "INSERT INTO users (email, password, role, created_at, updated_at) VALUES(?,?,?,?,?)";
            const adminSQL =
                "INSERT INTO admins (user_id, first_name, last_name, middle_name, created_at, updated_at) VALUES (?,?,?,?,?,?)";

            connection.query(userSQL, userData, (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        reject(err);
                    });
                } else {
                    console.log(err, result);
                    const adminData = [
                        result.insertId,
                        data.first_name,
                        data.last_name,
                        data.middle_name,
                        getCurrentDateTime(),
                        getCurrentDateTime(),
                    ];

                    connection.query(adminSQL, adminData, (err, result) => {
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
                    });
                }
            });
        });
    });
}

function adminByUserId(id) {
    const query =
        "SELECT admins.id, admins.user_id, admins.first_name, admins.last_name, admins.middle_name, users.email, users.role FROM admins LEFT JOIN users ON admins.user_id = users.id WHERE admins.user_id = ?";
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

export { registerAdmin, adminByUserId };
