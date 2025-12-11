function logout() {
	fetch("http://localhost:3305/auth/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	});

	alert("Sesión cerrada correctamente.");
}

document.getElementById("userEmail").innerText = localStorage.getItem("email");
