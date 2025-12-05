import { connection } from "./configDB.js";

export class AuthModel {
	static async consultarUsuario({ email }) {
		const [usuario, info] = await connection.execute(
			"Call consultar_usuario(?)",
			[email]
		);
		return usuario[0];
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
}
