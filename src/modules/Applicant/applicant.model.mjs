import { connection } from "../../configs/database.mjs";
import { getCurrentDateTime } from "../../configs/utils.mjs";
import { hashPassword } from "../../configs/utils.mjs";

async function registerApplicant(data) {
    const role = "applicant";

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
            const applicantSQL =
                "INSERT INTO applicants (user_id, first_name, last_name, middle_name, created_at, updated_at) VALUES (?,?,?,?,?,?)";

            connection.query(userSQL, userData, (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        reject(err);
                    });
                } else {
                    console.log(err, result);
                    const applicantData = [
                        result.insertId,
                        data.first_name,
                        data.last_name,
                        data.middle_name,
                        getCurrentDateTime(),
                        getCurrentDateTime(),
                    ];

                    connection.query(
                        applicantSQL,
                        applicantData,
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

async function deleteApplicant(user_id, applicant_id) {
    const applicantSQL = "DELETE FROM applicants WHERE id = ?";
    const userSQL = "DELETE FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.beginTransaction((err) => {
                connection.query(
                    applicantSQL,
                    [applicant_id],
                    (err, result) => {
                        if (err) {
                            connection.rollback(() => {
                                reject(err);
                            });
                        }
                        connection.query(userSQL, [user_id], (err, result) => {
                            if (err) {
                                connection.rollback(() => {
                                    reject(err);
                                });
                            }
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        reject({
                                            error: err,
                                        });
                                    });
                                }
                                resolve({
                                    message:
                                        "Successfully deleted an applicant",
                                });
                            });
                        });
                    }
                );
            });
        });
    });
}

function getApplicantUserId(id) {
    const applicantSQL = "SELECT user_id FROM applicants WHERE id = ?";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject({ errors: err });
            }
            connection.query(applicantSQL, [id], (err, result) => {
                if (result.length === 0) {
                    reject({ noExist: "Applicant doesn't exist" });
                } else if (err) {
                    reject({ errors: err });
                } else {
                    resolve(result);
                }
            });
        });
    });
}

function allApplicants() {
    const query = "SELECT * FROM applicants";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
}

function applicantById(id) {
    const query =
        "SELECT applicants.id, applicants.first_name, applicants.last_name, applicants.middle_name, users.email FROM applicants LEFT JOIN users ON applicants.user_id = users.id WHERE applicants.id = ?";

    const applicant_id = id;
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else if (result.length <= 0) {
                    reject({ noExist: "Applicants doesn't exist" });
                } else {
                    resolve(result);
                }
            });
        });
    });
}

export {
    registerApplicant,
    deleteApplicant,
    getApplicantUserId,
    allApplicants,
    applicantById,
};