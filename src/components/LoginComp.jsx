import React, { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleLogin() {
        console.log('this shit ran');

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((users) => {
                const user = users.find(
                    (u) => u.username === username && u.password === password
                );

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "/dashboard";
                } else {
                    setError("Invalid credentials");
                }
            });
    }

    return (
        <div>
            <h1>Login</h1>
            <label>
                Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
                Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <br />
            <button onClick={() => handleLogin()}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

