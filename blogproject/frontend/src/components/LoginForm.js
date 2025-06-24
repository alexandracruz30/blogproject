import React, { useState } from "react";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
        if (data.access_token) {
            setSuccessMsg("¡Inicio de sesión exitoso!");
            localStorage.setItem('access_token', data.access_token);
            setError('');
        } else {
            setError("No se pudo iniciar sesión: " + (data.error || JSON.stringify(data)));
            setSuccessMsg('');
        }
        })
        .catch(err => setError("Error: " + err));
    };

    return (
        <form onSubmit={handleLogin}>
        <h2>Iniciar sesión</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required/>
        <button type="submit">Entrar</button>
        {successMsg && <div style={{color: 'green'}}>{successMsg}</div>}
        {error && <div style={{color: 'red'}}>{error}</div>}
        </form>
    );
}

export default LoginForm;