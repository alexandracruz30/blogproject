import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BlogStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/blogs/stats/")
        .then(res => res.json())
        .then(data => {
            setStats(data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-white mb-6">Estadísticas del Blog</h1>
            <p className="text-white">Cargando...</p>
        </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Estadísticas del Blog</h1>

        {/* Blogs con más reseñas */}
        <h2 className="text-xl text-cyan-400 font-semibold mb-2">💬 Blogs con más reseñas</h2>
        <ul className="text-white mb-6">
            {stats && stats.blogs_con_mas_reviews.length > 0 ? (
            stats.blogs_con_mas_reviews.map(blog => (
                <li className="mb-2" key={blog.id}>
                <strong>
                    <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-400 hover:underline"
                    >
                    {blog.title}
                    </Link>
                </strong>
                {" – "}
                {blog.num_reviews
                    ? `${blog.num_reviews} reseña${blog.num_reviews !== 1 ? "s" : ""}`
                    : "0 reseñas"}
                </li>
            ))
            ) : (
            <li>No hay reseñas aún.</li>
            )}
        </ul>

        {/* Blogs mejor puntuados */}
        <h2 className="text-xl text-green-400 font-semibold mb-2">⭐ Blogs mejor puntuados</h2>
        <ul className="text-white">
            {stats && stats.blogs_mejor_puntuados.length > 0 ? (
            stats.blogs_mejor_puntuados.map(blog => (
                <li className="mb-2" key={blog.id}>
                <strong>
                    <Link
                    to={`/blog/${blog.id}`}
                    className="text-green-300 hover:underline"
                    >
                    {blog.title}
                    </Link>
                </strong>
                {" – Promedio: "}
                {blog.promedio_puntuacion
                    ? Number(blog.promedio_puntuacion).toFixed(1)
                    : "aún sin calificación"}
                </li>
            ))
            ) : (
            <li>No hay calificaciones aún.</li>
            )}
        </ul>
        </div>
    );
}

export default BlogStats;