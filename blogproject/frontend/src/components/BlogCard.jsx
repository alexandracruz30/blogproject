import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  // Cálculos para stats
    const reviewCount = blog.num_reviews ?? (blog.reviews?.length ?? 0);
    const averageRating = blog.average_rating
        ? Number(blog.average_rating).toFixed(1)
        : "--";

    return (
        <div className="bg-white/10 rounded-xl shadow-lg p-6 text-white flex flex-col">
        {/* Imagen */}
        {blog.image && (
            <img
            src={
                blog.image.startsWith("http")
                ? blog.image
                : `http://localhost:8000${blog.image}`
            }
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t mb-4"
            />
        )}

        {/* Título */}
        <h2 className="text-2xl font-bold mb-1 line-clamp-2">{blog.title}</h2>

        {/* Categoría */}
        {blog.category && (
            <span className="text-sm text-blue-400 mb-1 block">
            <Link to={`/category/${blog.category.slug}`} className="hover:underline">
                {blog.category.name}
            </Link>
            </span>
        )}

        {/* Etiquetas */}
        {blog.tags && blog.tags.length > 0 && (
            <div className="text-xs text-cyan-300 mb-2 flex flex-wrap gap-1">
            {blog.tags.map(tag => (
                <Link
                to={`/tag/${tag.slug}`}
                key={tag.slug}
                className="bg-cyan-900/50 px-2 py-1 rounded hover:underline"
                >
                #{tag.name}
                </Link>
            ))}
            </div>
        )}

        {/* Descripción/corto del contenido */}
            {blog.description ? (
            <p className="mb-2 text-gray-200 line-clamp-3">
                {blog.description}
            </p>
            ) : blog.content ? (
            <div
                className="mb-2 text-gray-200 line-clamp-3"
                dangerouslySetInnerHTML={{
                __html: blog.content.slice(0, 200) + "..."
                }}
            ></div>
            ) : null}

        {/* Stats: puntuación y reseñas */}
        <div className="flex items-center gap-4 mb-2">
            <span className="text-yellow-300 font-semibold flex items-center">
            ⭐ {averageRating} / 5
            </span>
            <span className="text-gray-400 text-sm">
            💬 {reviewCount} reseña{reviewCount !== 1 ? "s" : ""}
            </span>
        </div>

        {/* Autor */}
        <span className="text-sm text-gray-400 mb-2">
            {blog.author?.username || "Anónimo"}
        </span>

        <div className="flex-1"></div>
        <div className="flex justify-end items-end mt-4">
            <Link
            to={`/blog/${blog.id}`}
            className="bg-[#ba3259] hover:bg-pink-950 px-4 py-2 rounded text-white font-semibold transition"
            >
            Leer más
            </Link>
        </div>
        </div>
    );
}