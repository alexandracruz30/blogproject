import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        // Validación rápida en frontend, opcional
        if (password !== password2) {
            setError("Las contraseñas no coinciden.");
            setSuccessMsg('');
            return;
        }
        fetch('http://localhost:8000/api/signup/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password, password2 })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access_token) {
                setSuccessMsg("¡Registro exitoso!");
                localStorage.setItem('access_token', data.access_token);
                setError('');
            } else {
                // Mostrar errores más amigables si es posible
                let msg = "No se pudo registrar: ";
                if (data.password2) msg += data.password2.join(" ");
                else msg += JSON.stringify(data);
                setError(msg);
                setSuccessMsg('');
            }
        })
        .catch(err => setError("Error: " + err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('http://localhost:8000/static/assets/images/fond3.jpg')" }}>
            <div className="bg-[#0B0C2A]/90 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de registro */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Regístrate</h2>
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-white text-sm mb-1" htmlFor="username">Usuario</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded bg-white/80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm mb-1" htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded bg-white/80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contraseña"
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm mb-1" htmlFor="password2">Confirmar contraseña</label>
                            <input
                                id="password2"
                                type="password"
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded bg-white/80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirma tu contraseña"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                        {successMsg && <p className="text-green-400 text-sm mt-1">{successMsg}</p>}
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full mt-4"
                        >
                            Registrarse
                        </button>
                    </form>
                </div>
                {/* Iniciar sesión */}
                <div className="flex flex-col justify-center items-center text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">¿Ya tienes una cuenta?</h3>
                    <Link
                        to="/login"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                    >
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;