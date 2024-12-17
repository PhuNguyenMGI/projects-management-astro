import React, { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle Registration
    const handleRegister = () => {
        if (!username || !password) {
            setError("Username and Password are required!");
            return;
        }

        // Create a new user object
        const newUser = {
            id: Date.now(),
            username,
            password,
            role,
        };

        // Send the user data to json-server
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        })
            .then((res) => {
                if (res.ok) {
                    setSuccess("Registration successful!");
                    setError("");
                    setUsername("");
                    setPassword("");
                    setRole("user");
                } else {
                    setError("Failed to register user.");
                }
            })
            .catch(() => setError("Error connecting to the server."));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        style={{ marginLeft: "10px" }}
                    />
                </label>
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{ marginLeft: "14px" }}
                    />
                </label>
            </div>

            <div style={{ marginTop: "10px" }}>
                <label>
                    Role:
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ marginLeft: "47px" }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            </div>

            <button
                onClick={handleRegister}
                style={{
                    marginTop: "15px",
                    padding: "5px 10px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Register
            </button>
        </div>
    );
}
