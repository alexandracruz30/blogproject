import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function AddReview() {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ""
    });

    useEffect(() => {
        // Cargar información del blog

        fetch(`http://localhost:8000/api/blogs/${blogId}/`)
            .then(res => res.json())
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudo cargar el blog");
                setLoading(false);
            });
    }, [blogId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("Debes iniciar sesión para añadir una reseña");
                setSubmitting(false);
                return;
            }

            const response = await fetch(`http://localhost:8000/api/blogs/${blogId}/reviews/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess("Reseña añadida exitosamente");
                setTimeout(() => {
                    navigate(`/blogs/${blogId}`);
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Error al añadir la reseña");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingChange = (e) => {
        setFormData({
            ...formData,
            rating: parseInt(e.target.value)
        });
    };

    const handleCommentChange = (event, editor) => {
        const data = editor.getData();
        setFormData({
            ...formData,
            comment: data
        });
    };

    if (loading) return <div className="text-center text-white">Cargando...</div>;
    if (error && !blog) return <div className="text-center text-red-400">{error}</div>;

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('http://localhost:8000/static/assets/images/fond2.jpg')" }}
        >
            <div className="bg-[#160c24]/90 p-8 rounded-lg shadow-lg transition-all duration-700 ease-in-out text-white animate-fade-in max-w-4xl w-full mx-4">
                <div className="mb-6">
                    <h1 className="font-hitake text-3xl font-bold mb-2 text-[#ff695c]">
                        Añadir Reseña
                    </h1>
                    {blog && (
                        <p className="text-gray-300 text-lg">
                            Para: <span className="text-[#ff695c] font-semibold">{blog.title}</span>
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de Puntuación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Puntuación (1-5 estrellas)
                        </label>
                        <select
                            value={formData.rating}
                            onChange={handleRatingChange}
                            className="w-full px-4 py-3 bg-[#130920] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff695c] focus:border-transparent"
                            required
                        >
                            <option value={1}>⭐ 1 estrella</option>
                            <option value={2}>⭐⭐ 2 estrellas</option>
                            <option value={3}>⭐⭐⭐ 3 estrellas</option>
                            <option value={4}>⭐⭐⭐⭐ 4 estrellas</option>
                            <option value={5}>⭐⭐⭐⭐⭐ 5 estrellas</option>
                        </select>
                    </div>

                    {/* Campo de Comentario con CKEditor */}
                    <div>
                        <label className="block text-sm font-medium text-black-300 mb-2">
                            Comentario
                        </label>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.comment}
                                onChange={handleCommentChange}
                                config={{
                                    toolbar: [
                                        'heading',
                                        '|',
                                        'bold',
                                        'italic',
                                        'underline',
                                        '|',
                                        'bulletedList',
                                        'numberedList',
                                        '|',
                                        'blockQuote',
                                        'link',
                                        '|',
                                        'undo',
                                        'redo'
                                    ],
                                    placeholder: 'Escribe tu reseña aquí...',
                                    height: 300,
                                    // Forzar estilos de contenido para texto negro
                                    contentsCss: [
                                        'https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/styles.css',
                                        'body { color: #111 !important; background: #fff !important; }'
                                    ]
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            Comparte tu opinión sobre este blog.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(`/blogs/${blogId}`)}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                            disabled={submitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !formData.comment.trim()}
                            className="px-6 py-3 bg-[#ba3259] hover:bg-pink-950 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Enviando..." : "Publicar Reseña"}
                        </button>
                    </div>
                </form>

                {/* Vista previa del blog */}
                {blog && (
                    <div className="mt-8 pt-6 border-t border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">Vista previa del blog:</h3>
                        <div className="bg-[#130920] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#ff695c] mb-2">{blog.title}</h4>
                            <p className="text-gray-300 text-sm line-clamp-3">{blog.content}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Por {blog.author?.username} - {blog.created_at}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddReview;
