import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

function BlogDetail() {
    const { id } = useParams();
    const location = useLocation();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        setLoading(true);
        setBlog(null);
        setError("");
        
        fetch(`http://localhost:8000/api/blogs/${id}/`)
        .then(res => res.json())
        .then(data => {
            setBlog(data);
            setLoading(false);
        })
        .catch(() => {
            setError("No se pudo cargar el blog");
            setLoading(false);
        });
    }, [id, location.pathname]); // Se ejecuta cuando cambia el id o cuando regresa de otra página

    if (loading) return <div className="text-center text-white">Cargando...</div>;
    if (error) return <div className="text-center text-red-400">{error}</div>;
    if (!blog) return null;

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('http://localhost:8000/static/assets/images/fond2.jpg')" }}
        >
            <div className="bg-[#160c24]/90 p-6 rounded-lg shadow-lg transition-all duration-700 ease-in-out text-white animate-fade-in max-w-3xl w-full">
                <article>
                    <h1 className="font-hitake text-3xl font-bold mb-2 text-[#ff695c]">{blog.title}</h1>
                    <p className="text-gray-300 mb-4">{blog.content}</p>
                    <p className="text-sm text-gray-400">Por {blog.author?.username} - {blog.created_at}</p>
                    {/* Categoría */}
                    {blog.category && (
                        <p className="text-sm text-gray-500">
                            Categoría:{" "}
                            <Link
                                to={`/blogs/categoria/${blog.category.slug}`}
                                className="text-blue-400 hover:underline"
                            >
                                {blog.category.name}
                            </Link>
                        </p>
                    )}
                    {/* Etiquetas */}
                    {blog.tags && blog.tags.length > 0 && (
                        <p className="text-sm text-gray-500">
                            Etiquetas:{" "}
                            {blog.tags.map((tag, idx) => (
                                <span key={tag.slug}>
                                    <Link
                                        to={`/blogs/tag/${tag.slug}`}
                                        className="text-blue-400 hover:underline"
                                    >
                                        {tag.name}
                                    </Link>
                                    {idx !== blog.tags.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                    )}
                    {/* Promedio de puntuación */}
                    <p className="text-lg mt-2 text-gray-200 font-semibold">
                        Promedio de puntuación:{" "}
                        {blog.average_rating ? (
                            <>
                                {blog.average_rating.toFixed(1)} / 5 ⭐
                            </>
                        ) : (
                            <>No hay puntuaciones aún</>
                        )}
                    </p>
                    {/* Imagen */}
                    {blog.image && (
    <img
        src={
            blog.image.startsWith("http")
                ? blog.image
                : `http://localhost:8000${blog.image}`
        }
        alt={blog.title}
        className="w-full h-auto rounded-xl mb-4 mt-2"
    />
)}
                </article>

                {/* Reseñas */}
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
                    {blog.reviews && blog.reviews.length > 0 ? (
                        blog.reviews.map((review) => (
                            <div key={review.id} className="bg-[#130920] p-4 rounded-lg mb-4 transition-all duration-700 ease-in-out dark:text-white text-gray-900 animate-fade-in">
                                <p className="text-[#ff695c] font-medium">
                                    {review.reviewer?.username} - {review.rating}/5 ⭐
                                </p>
                                <div
                                className="text-gray-300 prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: review.comment }}
                                 ></div>
                                {/* Agregar comentario a la review */}
                                <Link
                                    to={`/blogs/${blog.id}/reviews/${review.id}/add-comment`}
                                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 inline-block"
                                >
                                    Añadir comentario
                                </Link>
                                {/* Comentarios a la review */}
                                {review.comments && review.comments.length > 0 && (
                                    <ul className="mt-2 list-disc ml-6 text-gray-400">
                                        {review.comments.map((comment) => (
                                            <li key={comment.id}>
                                                <span className="font-semibold text-gray-900 dark:text-white">{comment.commenter?.username}</span>: {comment.content}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No hay reseñas... Sé el primero en brindar una!.</p>
                    )}
                    {/* Botón para añadir reseña */}
                    <Link
                        to={`/blogs/${blog.id}/add-review`}
                        className="mt-4 inline-block bg-[#ba3259] hover:bg-pink-950 text-white px-4 py-2 rounded transition-colors"
                    >
                        Añadir reseña
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default BlogDetail;