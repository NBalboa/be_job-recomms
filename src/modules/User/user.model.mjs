import { connection } from "../../configs/database.mjs";

function userCredentials(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(query, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        reject(result);
                    }
                    resolve(result);
                }
            });
        });
    });
}

function userToken(token, id) {
    const query = "UPDATE users SET token = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(query, [token, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

function unToken(id) {
    const query = "UPDATE users SET token = '' WHERE id = ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }

            connection.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

function totalUsers() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(
                "SELECT count(*) as total_users FROM users",
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

function userRefreshToken(email) {
    const query = "SELECT token FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            connection.query(query, [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length > 0) {
                        resolve(result[0].token);
                    }
                    reject("Forbidden");
                }
            });
        });
    });
}

export { userCredentials, userToken, unToken, totalUsers, userRefreshToken };
