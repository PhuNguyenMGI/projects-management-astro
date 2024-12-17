import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            window.location.href = "/login";
        }
    }, []);

    function logout() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <div>
            <h1>Welcome, {user?.username}</h1>
            <button onClick={logout}>Logout</button>
            <ul>
                <li>
                    <a href="/users">User Management</a>
                </li>
                <li>
                    <a href="/projects">Project Management</a>
                </li>
            </ul>
        </div>
    );
}
