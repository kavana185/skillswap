const API_BASE = "http://localhost:5000/api/auth"; // Adjust API base if needed

// Auto-redirect if logged in
window.onload = () => {
    const token = localStorage.getItem("token");
    if (token) {
        if (window.location.pathname.includes("index.html")) {
            window.location.href = "dashboard.html"; // Redirect if already logged in
        } else {
            showUserData(); // Show user info if already logged in
        }
    }
};

// Signup Function
async function signup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message || "Signup failed!");
}

// Login Function
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard.html"; // Redirect to Dashboard
    } else {
        alert("Invalid credentials");
    }
}

// Show User Data After Login
function showUserData() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    document.getElementById("signup").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("userData").style.display = "block";

    document.getElementById("userName").innerText = user.name;
    document.getElementById("userEmail").innerText = user.email;

    // Handle undefined skills gracefully
    document.getElementById("skillsOffered").innerText = user.skillsOffered ? user.skillsOffered.join(", ") : "None";
    document.getElementById("skillsWanted").innerText = user.skillsWanted ? user.skillsWanted.join(", ") : "None";
}

// Logout Function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html"; // Redirect to login page
}
