export class ControladorAuth {
	constructor({ authControlador }) {
		this.authControlador = authControlador;
	}

	loguearUsuarios = async (req, res) => {
		const usuarios = await this.authControlador.loguearUsuarios(req.body);
		return res.json(usuarios);
	};
}
