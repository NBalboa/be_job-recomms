import { connection } from "../../configs/database.mjs";
import {
    getCurrentDateTime,
    generateID,
    transformArrayToSqlData,
} from "../../configs/utils.mjs";

async function registerJobs(hiringManagerId, data) {
    const currentDateTime = getCurrentDateTime();
    const total_jobs = await totalJobs();
    const jobsId = await generateID(total_jobs, "job");
    const jobsData = [
        jobsId,
        hiringManagerId,
        data.position,
        data.description,
        data.nature_of_work,
        data.place_of_work,
        data.salary,
        data.vacancies,
        data.posting_date,
        data.valid_until,
        currentDateTime,
        currentDateTime,
    ];
    return new Promise((resolve, reject) => {
        const jobsSQL =
            "INSERT INTO jobs (id, hiring_manager_id, positon, description, nature_of_work, place_of_work, salary, vacancies, posting_date, valid_until, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.connect((err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                connection.query(jobsSQL, jobsData, (err, result) => {
                    if (err) {
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
            });
        });
    });
}

async function registerQualifications(jobsId, data) {
    let total = await totalQualifications();
    const currentDateTime = getCurrentDateTime();

    const qualificationsData = await transformArrayToSqlData(
        total,
        currentDateTime,
        jobsId,
        data,
        "qualification"
    );

    const qualificationsSQL =
        "INSERT INTO qualifications (id, job_id, description, created_at, updated_at) VALUES ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                connection.query(
                    qualificationsSQL,
                    [qualificationsData],
                    (err, result) => {
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
                    }
                );
            });
        });
    });
}

async function registerRequirements(jobsId, data) {
    const [total, current_date_time] = await Promise.all([
        totalRequirements(),
        getCurrentDateTime(),
    ]);

    const requirementData = await transformArrayToSqlData(
        total,
        current_date_time,
        jobsId,
        data,
        "requirement"
    );

    const requirementSQL =
        "INSERT INTO requirements (id, job_id, description, created_at, updated_at) VALUES ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }
                connection.query(
                    requirementSQL,
                    [requirementData],
                    (err, result) => {
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
                    }
                );
            });
        });
    });
}

function totalJobs() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_jobs FROM jobs",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_jobs);
                    }
                }
            );
        });
    });
}

function allJobs() {
    const jobsQuery =
        "SELECT jobs.id, hiring_manager_id, jobs.positon, jobs.description, jobs.nature_of_work, jobs.place_of_work, jobs.salary, CONCAT(hiring_managers.first_name, ' ', hiring_managers.last_name) as employer, hiring_managers.company_name, company_url, jobs.created_at, jobs.updated_at FROM jobs LEFT JOIN hiring_managers ON jobs.hiring_manager_id = hiring_managers.id WHERE CURDATE() BETWEEN posting_date AND valid_until";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(jobsQuery, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

function jobById(id) {
    const jobsQuery =
        "SELECT jobs.* , CONCAT(hiring_managers.first_name, ' ', hiring_managers.last_name) as employer, hiring_managers.company_name, company_url, hiring_managers.telephone_no, hiring_managers.mobile_no, jobs.created_at, jobs.updated_at FROM jobs LEFT JOIN hiring_managers ON jobs.hiring_manager_id = hiring_managers.id WHERE jobs.id = ?";
    const data = [id];

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(jobsQuery, data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

function totalQualifications() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_qualifications FROM qualifications",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_qualifications);
                    }
                }
            );
        });
    });
}

function totalRequirements() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_requirements FROM requirements",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_requirements);
                    }
                }
            );
        });
    });
}

function qualificationByJobId(id) {
    const qualificationQuery = "SELECT * FROM qualifications WHERE job_id = ?";
    const data = [id];

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(qualificationQuery, data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

export {
    registerJobs,
    registerQualifications,
    allJobs,
    jobById,
    qualificationByJobId,
    registerRequirements,
    totalJobs,
};
