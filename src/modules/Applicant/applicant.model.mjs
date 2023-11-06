import { connection } from "../../configs/database.mjs";
import {
    generateID,
    getCurrentDateTime,
    transformArrayToSqlData,
} from "../../configs/utils.mjs";
import { hashPassword } from "../../configs/utils.mjs";
import { totalUsers } from "../user/user.model.mjs";

async function registerApplicant(data) {
    const role = "applicant";
    const [total_applicants, total_users, password] = await Promise.all([
        totalApplicants(),
        totalUsers(),
        hashPassword(data.password),
    ]);
    const [applicant_id, user_id] = await Promise.all([
        generateID(total_applicants, "applicant"),
        generateID(total_users[0].total_users, "user"),
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
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                const userSQL =
                    "INSERT INTO users (id,email, password, role, created_at, updated_at) VALUES(?,?,?,?,?,?)";
                const applicantSQL =
                    "INSERT INTO applicants (id, user_id, first_name, last_name, middle_name, created_at, updated_at) VALUES (?,?,?,?,?,?,?)";

                connection.query(userSQL, userData, (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    } else {
                        // console.log(err, result);
                        const applicantData = [
                            applicant_id,
                            user_id,
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
                                                reject(err);
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
    });
}

async function registerApplicantCurrentAddress(data, applicant_id) {
    const total = await totalCurrentAddress();
    const current_address_id = await generateID(total, "current-address");
    const current_date_time = getCurrentDateTime();

    const current_address_sql =
        "INSERT INTO current_addresses (id, applicant_id, street, purok, barangay, municipality, province, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)";
    const currents_address_data = [
        current_address_id,
        applicant_id,
        data.street,
        data.purok,
        data.barangay,
        data.municipality,
        data.province,
        current_date_time,
        current_date_time,
    ];

    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(
                        current_address_sql,
                        currents_address_data,
                        (err, result) => {
                            if (err) {
                                connection.rollback(() => {
                                    reject(err);
                                });
                            }
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        reject(err);
                                    });
                                }
                                resolve(result);
                            });
                        }
                    );
                }
            });
        });
    });
}

async function registerApplicantPermanentAddress(data, applicant_id) {
    const total = await totalPermanentAddress();
    const permanent_address_id = await generateID(total, "permanent-address");
    const current_date_time = getCurrentDateTime();

    const current_address_sql =
        "INSERT INTO permanent_addresses (id, applicant_id, street, purok, barangay, municipality, province, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)";
    const currents_address_data = [
        permanent_address_id,
        applicant_id,
        data.street,
        data.purok,
        data.barangay,
        data.municipality,
        data.province,
        current_date_time,
        current_date_time,
    ];

    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(
                        current_address_sql,
                        currents_address_data,
                        (err, result) => {
                            if (err) {
                                connection.rollback(() => {
                                    reject(err);
                                });
                            }
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        reject(err);
                                    });
                                }
                                resolve(result);
                            });
                        }
                    );
                }
            });
        });
    });
}

async function registerApplicantEducation(data, applicant_id) {
    const total = await totalEducation();
    const education_id = await generateID(total, "education");
    const current_date_time = getCurrentDateTime();
    const educationSQL =
        "INSERT INTO educations (id, applicant_id, school, course, description, start_year, end_year, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)";
    const educationData = [
        education_id,
        applicant_id,
        data.school,
        data.course,
        data.description,
        data.start_year,
        data.end_year,
        current_date_time,
        current_date_time,
    ];

    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }

            connection.connect((err) => {
                if (err) {
                    reject(ee);
                }

                connection.query(educationSQL, educationData, (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    } else {
                        connection.commit((err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(result);
                        });
                    }
                });
            });
        });
    });
}

async function registerApplicantExperience(data, applicant_id) {
    const [total, current_date_time] = await Promise.all([
        totalExperience(),
        getCurrentDateTime(),
    ]);
    const experience_id = await generateID(total, "experience");
    const experienceSQL =
        "INSERT INTO experiences (id, applicant_id, title,company, description, start_date,end_date, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)";

    const experienceData = [
        experience_id,
        applicant_id,
        data.title,
        data.company,
        data.description,
        data.start_date,
        data.end_date,
        current_date_time,
        current_date_time,
    ];

    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            connection.connect((err) => {
                if (err) {
                    reject(err);
                }
                connection.query(
                    experienceSQL,
                    experienceData,
                    (err, result) => {
                        if (err) {
                            connection.rollback(() => {
                                reject(err);
                            });
                        } else {
                            connection.commit((err) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve(result);
                            });
                        }
                    }
                );
            });
        });
    });
}

async function registerSkills(data, applicant_id) {
    const [total, current_date_time] = await Promise.all([
        totalSkill(),
        getCurrentDateTime(),
    ]);

    const skillData = await transformArrayToSqlData(
        total,
        current_date_time,
        applicant_id,
        data,
        "skill"
    );

    const skillsSQL =
        "INSERT INTO skills (id, applicant_id, description, created_at, updated_at) VALUES ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                connection.query(skillsSQL, [skillData], (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                    }
                    connection.commit((err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    });
                });
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

function totalApplicants() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_applicants FROM applicants",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_applicants);
                    }
                }
            );
        });
    });
}

function applicantByUserId(id) {
    const query =
        "SELECT applicants.id, applicants.user_id, applicants.first_name, applicants.last_name, applicants.middle_name, users.email, users.role FROM applicants LEFT JOIN users ON applicants.user_id = users.id WHERE applicants.user_id = ?";
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

function totalCurrentAddress() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_current_addresses FROM current_addresses",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_current_addresses);
                    }
                }
            );
        });
    });
}

function totalEducation() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_educations FROM educations",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_educations);
                    }
                }
            );
        });
    });
}

function totalExperience() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_experiences FROM experiences",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_experiences);
                    }
                }
            );
        });
    });
}

function totalSkill() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_skills FROM skills",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_skills);
                    }
                }
            );
        });
    });
}

function totalPermanentAddress() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_permanent_address FROM permanent_addresses",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_permanent_address);
                    }
                }
            );
        });
    });
}

export {
    registerApplicant,
    deleteApplicant,
    getApplicantUserId,
    allApplicants,
    applicantById,
    applicantByUserId,
    registerApplicantCurrentAddress,
    registerApplicantPermanentAddress,
    registerApplicantEducation,
    registerApplicantExperience,
    registerSkills,
    totalApplicants,
};
