import { AuthModel } from "../models/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class ControladorAuth {
	constructor() {
		this.authModel = AuthModel;
	}

	loguearUsuarios = async (req, res) => {
		const { email, contrasena } = req.body;

		// 1. Validar que vengan los datos
		if (!email || !contrasena) {
			return res
				.status(400)
				.json({ message: "Email y contraseña son requeridos" });
		}
		// 2. Buscar usuario
		const usuarios = await this.authModel.consultarUsuario({ email });
		const usuario = usuarios[0];
		if (!usuario) {
			return res.status(401).json({ message: "Credenciales inválidas" });
		}
		// 3. Validar si está bloqueado
		if (usuario.locked != 0) {
			return res.status(403).json({ message: "Cuenta bloqueada" });
		}

		// 4. Comparar contraseñas (texto plano)
		const match = contrasena === usuario.contrasena;

		if (!match) {
			usuario.failed_attempt += 1;
			if (usuario.failed_attempt >= 5) {
				usuario.locked = 1;
				return res.status(403).json({
					message: "Cuenta bloqueada por intentos fallidos",
				});
			}
			await this.authModel.actualizarUsuario(usuario);
			return res.status(401).json({ message: "Credenciales inválidas" });
		}

		// 5. Si es válido, reiniciar intentos fallidos
		usuario.failed_attempt = 0;

		// 6. Generar JWT
		const token = jwt.sign({ email: usuario.email }, process.env.SECRET, {
			expiresIn: "10m",
		});

		usuario.token = token;
		const updatedUser = await this.authModel.actualizarUsuario(usuario);

		// 7. Respuesta exitosa
		return res.status(200).json({
			message: "Login exitoso",
			updatedUser,
		});
	};
}
