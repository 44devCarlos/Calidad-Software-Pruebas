const API_URL = "http://localhost:3305/auth/recover"; // Ajusta tu ruta real
document
	.getElementById("restablecercuentaForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = document.getElementById("email").value;

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			// Guardamos el correo (lo necesitaremos para el paso 2)
			localStorage.setItem("email_recover", email);

			if (response.ok) {
				alert(
					"Si el email existe, accederas al siguiente paso para restablecer tu contraseña."
				);
				window.location.href = "./restablecer_contrasenia.html";
			} else {
				alert(data.message || "Error al solicitar recuperación.");
			}
		} catch (error) {
			console.error(error);
			alert("Error en la conexión con el servidor");
		}
	});
