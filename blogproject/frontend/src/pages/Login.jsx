import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

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
                setError('');
                login(data.access_token); // Actualizar contexto
                localStorage.setItem("access_token", data.access_token);
                setTimeout(() => {
                    navigate("/");
                }, 500); // Redirige tras 0.5s (ajusta si prefieres)
            } else {
                setError("No se pudo iniciar sesión: " + (data.error || JSON.stringify(data)));
                setSuccessMsg('');
            }
        })
        .catch(err => setError("Error: " + err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('http://localhost:8000/static/assets/images/fond2.jpg')" }}>
            <div className="bg-[#0B0C2A]/90 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de login */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Inicio de sesión</h2>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="text-white block text-sm mb-1">Usuario</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="bg-white/80 text-gray-900 px-4 py-2 rounded-lg w-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-white block text-sm mb-1">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="bg-white/80 text-gray-900 px-4 py-2 rounded-lg w-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contraseña"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}

                        <button
                            type="submit"
                            className="bg-[#ba3259] hover:bg-pink-950 text-white font-bold py-2 px-4 rounded w-full mt-4"
                        >
                            Acceder
                        </button>
                        <a href="#" className="block text-center mt-2 text-white text-sm hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </form>
                </div>
                {/* Registro */}
                <div className="flex flex-col justify-center items-center text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">¿No tienes una cuenta?</h3>
                    <Link to="/signup" className="bg-[#ba3259] hover:bg-pink-950 text-white font-bold py-2 px-6 rounded">
                        Regístrate ahora
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;