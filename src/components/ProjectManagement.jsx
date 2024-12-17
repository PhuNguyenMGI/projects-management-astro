import React, { useEffect, useState } from "react";

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [taskName, setTaskName] = useState("");
    const [accordionOpen, setAccordionOpen] = useState({});

    // Fetch projects and users
    useEffect(() => {
        fetch("http://localhost:3000/projects")
            .then((res) => res.json())
            .then(setProjects);

        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then(setUsers);
    }, []);

    // Add new project
    function addProject() {
        const newProject = { name, completed: false, assignedUsers: [], tasks: [] };
        fetch("http://localhost:3000/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProject),
        }).then(() => window.location.reload());
    }

    // Assign user to project
    function assignUserToProject() {
        const project = projects.find((p) => p.id === selectedProject);
        if (project) {
            const updatedUsers = [...new Set([...project.assignedUsers, selectedUser])];

            fetch(`http://localhost:3000/projects/${selectedProject}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedUsers: updatedUsers }),
            }).then(() => window.location.reload());
        }
    }

    // Remove user from project
    function removeUserFromProject(projectId, userId) {
        const project = projects.find((p) => p.id === projectId);
        const updatedUsers = project.assignedUsers.filter((id) => id !== userId);

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignedUsers: updatedUsers }),
        }).then(() => window.location.reload());
    }

    // Add task to project
    function addTask(projectId) {
        const project = projects.find((p) => p.id === projectId);
        const newTask = { id: Date.now(), name: taskName };
        const updatedTasks = [...project.tasks, newTask];

        fetch(`http://localhost:3000/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: updatedTasks }),
        }).then(() => {
            setTaskName("");
            window.location.reload();
        });
    }

    // Toggle accordion
    function toggleAccordion(projectId) {
        setAccordionOpen((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
    }

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <strong>{project.name}</strong> -{" "}
                        {project.completed ? "Done" : "In Progress"}
                        <br />
                        <strong>Assigned Users:</strong>
                        <ul>
                            {project.assignedUsers.map((userId) => {
                                const user = users.find((u) => u.id === userId);
                                return user ? (
                                    <li key={user.id}>
                                        {user.username}{" "}
                                        <button onClick={() => removeUserFromProject(project.id, user.id)}>
                                            Remove
                                        </button>
                                    </li>
                                ) : null;
                            })}
                        </ul>
                        <button onClick={() => toggleAccordion(project.id)}>
                            {accordionOpen[project.id] ? "Hide Tasks" : "Show Tasks"}
                        </button>
                        {accordionOpen[project.id] && (
                            <div style={{ marginLeft: "20px" }}>
                                <h4>Tasks:</h4>
                                <ul>
                                    {project.tasks.map((task) => (
                                        <li key={task.id}>{task.name}</li>
                                    ))}
                                </ul>
                                <input
                                    type="text"
                                    placeholder="Task Name"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                                <button onClick={() => addTask(project.id)}>Add Task</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <h2>Add Project</h2>
            <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={addProject}>Add</button>

            <h2>Assign User to Project</h2>
            <select
                onChange={(e) => setSelectedProject(e.target.value)}
                value={selectedProject}
            >
                <option value="">Select Project</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>

            <select
                onChange={(e) => setSelectedUser(e.target.value)}
                value={selectedUser}
            >
                <option value="">Select User</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username}
                    </option>
                ))}
            </select>

            <button onClick={assignUserToProject}>Assign User</button>
        </div>
    );
}
