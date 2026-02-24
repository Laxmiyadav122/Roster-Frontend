const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://roster-backend.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!data.success) {
        alert(data.message);
        return;
      }
      localStorage.setItem("token", data.jwtToken);

      localStorage.setItem("currentUser", JSON.stringify({
        name: data.name,
        email: email,
        role: data.role
      }));

      alert("Login Successful");

      if (data.role && data.role.toLowerCase() === "admin") {
    window.location.href = "admin-dashboard.html";
} else {
    window.location.href = "user-dashboard.html";
}
      console.log("Login Response:", data);

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong");
    }
  });
}
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("https://roster-backend.vercel.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      console.log("Signup Response:", data);

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Signup successful");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong");
    }
  });
}