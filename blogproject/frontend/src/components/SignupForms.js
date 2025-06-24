import React, { useState } from "react";

function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
        if (data.access_token) {
            setSuccessMsg("¡Registro exitoso!");
            localStorage.setItem('access_token', data.access_token);
            setError('');
        } else {
            setError("No se pudo registrar: " + JSON.stringify(data));
            setSuccessMsg('');
        }
        })
        .catch(err => setError("Error: " + err));
    };

    return (
        <form onSubmit={handleSignup}>
        <h2>Registro</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required/>
        <button type="submit">Registrarse</button>
        {successMsg && <div style={{color: 'green'}}>{successMsg}</div>}
        {error && <div style={{color: 'red'}}>{error}</div>}
        </form>
    );
    }

export default SignupForm;