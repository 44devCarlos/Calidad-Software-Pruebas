import cors from "cors";
import express from "express";
import { PORT } from "./config.js";

const createApp = () => {
	const app = express();
	app.use(cors());
	app.use(express.json());

	app.use((req, res) => {
		res.status(404).json({ error: "Recurso no encontrado" });
	});

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
	return app;
};
createApp();
