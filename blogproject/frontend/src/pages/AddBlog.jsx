import React, { useState } from "react";

function AddBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple
        if (!title || !content) {
        setErrors({ form: "Título y contenido son obligatorios." });
        return;
        }
        setErrors({});

        // Construir formData para enviar archivo
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image) formData.append("image", image);
        formData.append("category", category);
        formData.append("tags", tags);

        // Recuperar el token JWT guardado al hacer login
        const token = localStorage.getItem("access_token");

        try {
        const res = await fetch("http://localhost:8000/api/blogs/create/", {
            method: "POST",
            body: formData,
            headers: {
            Authorization: `Bearer ${token}`
            // No pongas 'Content-Type' aquí, fetch lo maneja con FormData
            }
        });
        if (res.ok) {
            setSuccess("¡Blog publicado exitosamente!");
            setTitle("");
            setContent("");
            setImage(null);
            setCategory("");
            setTags("");
        } else {
            const data = await res.json();
            setErrors(data);
        }
        } catch (err) {
        setErrors({ form: "Error de red." });
        }
    };

    return (
        <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('http://localhost:8000/static/assets/images/fondo_blog_form.avif')" }}
        >
        <div className="bg-[#0B0C2A]/90 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-5xl">
            <h1 className="text-3xl font-extrabold mb-8 text-white text-center">Crea un nuevo blog</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8" encType="multipart/form-data">
            {/* Título */}
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-white">Título del blog</label>
                <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            {/* Contenido */}
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-white">Contenido</label>
                <textarea
                className="w-full min-h-[300px] rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Escribe el contenido del blog aquí..."
                />
                {/* Si quieres usar CKEditor en vez de textarea, aquí va el componente CKEditor */}
            </div>
            {/* Imagen */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Imagen</label>
                <input
                type="file"
                accept="image/*"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleImageChange}
                />
            </div>
            {/* Categoría */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Categoría</label>
                <input
                type="text"
                name="category"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe una categoría o selecciona una existente"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                />
            </div>
            {/* Etiquetas */}
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-white">Etiquetas</label>
                <input
                type="text"
                name="tags"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe etiquetas separadas por comas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                />
            </div>
            {/* Errores y éxito */}
            <div className="md:col-span-2">
                {errors.form && <div className="text-red-400 mb-2">{errors.form}</div>}
                {success && <div className="text-green-400 mb-2">{success}</div>}
            </div>
            {/* Botón de envío */}
            <div className="pt-4 md:col-span-2">
                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                Publicar Blog
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}

export default AddBlog;