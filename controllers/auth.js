import { AuthModel } from "../models/auth.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
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
		const usuario = await this.authModel.consultarUsuario({ email });

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
			updatedUser: { token: usuario.token, email: usuario.email },
		});
	};

	solicitarRecuperacion = async (req, res) => {
		try {
			const { email } = req.body;

			// 1. Validar email
			if (!email) {
				return res.status(400).json({ message: "Email requerido" });
			}

			// 2. Buscar usuario
			const usuario = await this.authModel.consultarUsuario({ email });

			if (!usuario) {
				return res.status(200).json({
					message:
						"Si el email existe, se enviará un enlace de recuperación.",
				});
			}

			// 3. Generar token seguro de recuperación
			const token_reset = crypto.randomBytes(32).toString("hex");
			const token_expira = new Date(Date.now() + 15 * 60000); // 15 minutos

			// 4. Guardar token en la base de datos
			await this.authModel.guardarTokenRecuperacion({
				id_usuario: usuario.id_usuario,
				token_reset,
				token_expira,
			});

			// 5. Respuesta (segura y genérica)
			return res.status(200).json({
				message:
					"Si el email existe, se enviará un enlace de recuperación.",
			});
		} catch (error) {
			console.error("Error en /recover:", error);
			return res
				.status(500)
				.json({ message: "Error interno del servidor" });
		}
	};

	resetearContrasena = async (req, res) => {
		try {
			const { email, newPassword } = req.body;

			// 1. Validar campos obligatorios
			if (!newPassword) {
				return res.status(400).json({
					message: "Nueva contraseña es requerida",
				});
			}

			// 2. Buscar usuario por email
			const usuario = await this.authModel.consultarUsuario({
				email,
			});

			if (!usuario) {
				return res.status(400).json({ message: "Email inválido" });
			}

			// 3. Verificar expiración del token
			const ahora = new Date();
			const expira = new Date(usuario.token_expira);

			if (ahora > expira) {
				return res.status(400).json({ message: "Token expirado" });
			}

			// 4. Validar longitud mínima (técnica de valores límite)
			if (newPassword.length < 8) {
				return res.status(400).json({
					message: "La contraseña debe tener al menos 8 caracteres",
				});
			}

			// 5. Actualizar usuario
			usuario.contrasena = newPassword;
			usuario.failed_attempts = 0;
			usuario.locked = 0;
			usuario.token = null;
			usuario.token_reset = null;
			usuario.token_expira = null;

			await this.authModel.actualizarUsuarioCompleto(usuario);

			// 7. Respuesta exitosa
			return res.status(200).json({
				message: "Contraseña restablecida exitosamente",
			});
		} catch (error) {
			console.error("Error en reset-password:", error);
			return res
				.status(500)
				.json({ message: "Error interno del servidor" });
		}
	};

	logoutUsuarios = async (req, res) => {
		try {
			// 1. Obtener el token del header
			const authHeader = req.headers.authorization;

			if (!authHeader) {
				return res.status(401).json({ message: "Token requerido" });
			}

			const token = authHeader.split(" ")[1];

			if (!token) {
				return res.status(401).json({ message: "Token inválido" });
			}

			// 2. Verificar el token para extraer email / id
			const data = jwt.verify(token, process.env.SECRET);

			// 3. Buscar usuario por email
			const usuario = await this.authModel.consultarUsuario({
				email: data.email,
			});

			if (!usuario) {
				return res
					.status(404)
					.json({ message: "Usuario no encontrado" });
			}

			// 4. Invalidar token (borrarlo de BD)
			usuario.token = null;

			await this.authModel.actualizarTokenLogout(usuario);

			// 5. Respuesta OK
			return res.status(200).json({
				message: "Logout OK",
			});
		} catch (error) {
			console.error("Error en logout:", error);
			return res
				.status(500)
				.json({ message: "Error interno del servidor" });
		}
	};
}
