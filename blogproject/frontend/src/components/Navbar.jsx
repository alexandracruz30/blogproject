import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-[#2e1e45] shadow-md py-4 px-6 transition-colors">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl font-semibold tracking-wider transition-colors text-[#ff695c] font-hitake"
                >
                    Zona Anime
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/add-blog"
                                className="text-white bg-[#ba3259] hover:bg-pink-950 font-medium py-2 px-4 rounded transition-all duration-500 ease-in-out"
                            >
                                Nuevo Blog
                            </Link>
                            <Link
                                to="/stats"
                                className="bg-green-700 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-all duration-300"
                            >
                                Estadísticas
                            </Link>
                            <button
                                onClick={logout}
                                className="px-2.5 text-white hover:underline transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-white bg-[#ba3259] hover:bg-pink-950 font-medium py-2 px-4 rounded transition-all duration-500 ease-in-out"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/signup"
                                className="text-white bg-[#ba3259] hover:bg-pink-950 font-medium py-2 px-4 rounded transition-all duration-500 ease-in-out"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}