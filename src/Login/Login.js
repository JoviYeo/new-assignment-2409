import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('')

    async function loginUser(credentials) {
        return fetch('http://localhost:8080/authenticate/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            username,
            password
        });
        if (response && response.status === 'success') {
            setToken(response.token);
            localStorage.setItem('token', response.token)
        } else {
            setError(response.description);
        }
    }

    return (
        <div className="login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Control
                        placeholder='Username'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Control
                        placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {error ? <p>{error}</p> : null}
                <button className="login-button" type="submit">
                    Login
                </button>
            </Form>
        </div>
    );
}