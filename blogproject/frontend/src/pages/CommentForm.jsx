import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function CommentForm({ onSuccess }) {
    const { reviewId } = useParams();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!content.trim()) {
            setError("El comentario no puede estar vacío.");
            return;
        }
        setLoading(true);
        try {
            // Usamos la misma key que el login: "access_token"
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                `http://localhost:8000/api/reviews/${reviewId}/comments/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ content }),
                }
            );
            if (response.ok) {
                setContent("");
                if (onSuccess) onSuccess();
            } else {
                const data = await response.json();
                setError(data.detail || "Error al publicar el comentario.");
            }
        } catch {
            setError("Error de red.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Deja un comentario</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 transition-all duration-700 ease-in-out animate-fade-in"
            >
                <div className="space-y-2 transition-all duration-700 ease-in-out">
                    <div>
                        <label
                            htmlFor="comment-content"
                            className="block text-sm font-medium mb-1 text-gray-900 dark:text-white"
                        >
                            Comentario
                        </label>
                        <textarea
                            id="comment-content"
                            name="content"
                            rows={4}
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700 rounded transition-all duration-500 ease-in-out"
                    disabled={loading}
                >
                    {loading ? "Publicando..." : "Publicar"}
                </button>
            </form>
        </div>
    );
}