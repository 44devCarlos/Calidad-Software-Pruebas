const API_URL = "http://localhost:3305/auth/login"; // Ajusta tu ruta real

document.getElementById("loginForm").addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("email").value.trim();
	const contrasena = document.getElementById("contrasena").value.trim();

	// --- VALIDACIONES DE CAMPOS (TC-08) ---
	if (!validarEmail(email)) {
		alert("Email inválido");
		return;
	}
	// --- ENVÍO DE PETICIÓN AL BACKEND ---
	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, contrasena }),
		});

		const data = await response.json();

		// --- MANEJO DE CÓDIGOS Y MENSAJES ESPERADOS SEGÚN TCs ---

		if (response.status === 200) {
      console.log(data);
			// TC-01 Login válido
			localStorage.setItem("token", data.updatedUser.token);
			localStorage.setItem("email", data.updatedUser.email);
			alert("Inicio de sesión exitoso");
			window.location.href = "home.html";
			return;
		}

		if (response.status === 400) {
			// Email inválido o mal formato — TC-08
			alert(data.message || "Email inválido");
			return;
		}

		if (response.status === 401) {
			// Credenciales incorrectas — TC-02
			alert("Credenciales inválidas");
			return;
		}

		if (response.status === 403) {
			// Usuario bloqueado — TC-03, TC-04
			alert(data.message || "Cuenta bloqueada");
			return;
		}

		// Otro error genérico
		alert("Error inesperado");
	} catch (error) {
		alert("No se pudo conectar con el servidor");
	}
});

// -------- VALIDACIÓN DE EMAIL --------
function validarEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}
