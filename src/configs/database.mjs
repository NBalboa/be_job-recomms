import mysql2 from "mysql2";
import { DB_HOST, DB_PASS, DATABASE, DB_USER } from "./secrets.mjs";

const connection = mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DATABASE,
});

function testConnection() {
    connection.connect((err) => {
        if (err) throw err;
        console.log("database connected");
    });
}

export { connection, testConnection };
