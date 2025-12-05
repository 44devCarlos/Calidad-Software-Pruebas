import mysql from "mysql2/promise";
import { DB_PASSWORD } from "../config.js";

const configDB = {
	host: "localhost",
	user: "root",
	port: 3306,
	password: DB_PASSWORD,
	database: "pruebas_curso",
};

export const connection = await mysql.createConnection(configDB);
