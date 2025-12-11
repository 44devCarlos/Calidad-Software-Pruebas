const API_URL = "http://localhost:3305/auth/reset-password"; // Ajusta tu ruta real
document.getElementById("resetPassForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pass1 = document.getElementById("pass1").value;
    const pass2 = document.getElementById("pass2").value;

    // Validación de longitud
    if (pass1.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    // Validar que coincidan
    if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const email = localStorage.getItem("email_recover");

    if (!email) {
        alert("No hay correo asociado a la recuperación.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                newPassword: pass1
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Contraseña restablecida correctamente.");
            window.location.href = "./login.html";
        } else {
            alert(data.message || "Error al restablecer la contraseña.");
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    }
});

