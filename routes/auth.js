import { Router } from "express";
import { ControladorAuth } from "../controllers/auth.js";

export const crearAuthRouter = ({ authModel }) => {
	const router = Router();

	const authControlador = new ControladorAuth({ authModel });

	router.post("/login", authControlador.loguearUsuarios);
	router.post("/recover", authControlador.solicitarRecuperacion);
	router.post("/reset-password", authControlador.resetearContrasena);
	router.post("/logout", authControlador.logoutUsuarios);

	return router;
};
