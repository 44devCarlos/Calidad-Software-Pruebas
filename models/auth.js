import { connection } from "./configDB.js";

export class AuthModel {
	static async consultarUsuario({ email }) {
		const [usuario, info] = await connection.execute(
			"Call consultar_usuario(?)",
			[email]
		);
		return usuario[0][0];
	}

	static async actualizarUsuario(usuario) {
		const [usuarioActualizado, info] = await connection.execute(
			"Call actualizar_usuario(?, ?, ?, ?, ?, ?)",
			[
				usuario.id_usuario,
				usuario.email,
				usuario.contrasena,
				usuario.locked,
				usuario.failed_attempt,
				usuario.token,
			]
		);
		return usuarioActualizado[0];
	}

	static async guardarTokenRecuperacion({
		id_usuario,
		token_reset,
		token_expira,
	}) {
		const [resultado, info] = await connection.execute(
			"Call guardar_token_recuperacion(?, ?, ?)",
			[id_usuario, token_reset, token_expira]
		);
		return resultado;
	}

	static async actualizarUsuarioCompleto(usuario) {
		const [usuarioActualizado, info] = await connection.execute(
			"Call actualizar_usuario_completo(?, ?, ?, ?, ?, ?, ?)",
			[
				usuario.id_usuario,
				usuario.contrasena,
				usuario.locked,
				usuario.failed_attempts,
				usuario.token,
				usuario.token_reset,
				usuario.token_expira,
			]
		);
		return usuarioActualizado[0];
	}

	static async actualizarTokenLogout(usuario) {
		const [resultado, info] = await connection.execute(
			"Call actualizar_token_logout(?)",
			[usuario.id_usuario]
		);
		return resultado;
	}
}
