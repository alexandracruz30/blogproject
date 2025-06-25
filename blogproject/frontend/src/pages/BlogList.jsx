import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8000/api/blogs/")
        .then(res => res.json())
        .then(data => {
            // Soporta respuesta paginada o array directa
            const blogList = Array.isArray(data) ? data : data.results || [];
            setBlogs(blogList);

            // Extraer categorías únicas
            const uniqueCategories = [];
            const seenCategories = new Set();
            blogList.forEach(blog => {
                if (blog.category && !seenCategories.has(blog.category.slug)) {
                    uniqueCategories.push(blog.category);
                    seenCategories.add(blog.category.slug);
                }
            });
            setCategories(uniqueCategories);

            // Extraer etiquetas únicas
            const uniqueTags = [];
            const seenTags = new Set();
            blogList.forEach(blog => {
                if (Array.isArray(blog.tags)) {
                    blog.tags.forEach(tag => {
                        if (tag && !seenTags.has(tag.slug)) {
                            uniqueTags.push(tag);
                            seenTags.add(tag.slug);
                        }
                    });
                }
            });
            setTags(uniqueTags);

            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    return (
        <div className="mx-4 lg:mx-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Últimos blogs</h1>
            <p className="text-white text-2xl text-center mb-8">
                Entérate de las últimas noticias sobre el anime y manga. ¡Anímate a escribir tus propias opiniones al respecto!
            </p>
            {/* Categorías */}
            <div className="mt-8 mb-4">
                <h2 className="text-xl font-semibold text-white">Categorías</h2>
                <ul className="flex flex-wrap gap-4 mt-2">
                    {categories.map(category => (
                        <li key={category.slug}>
                            <Link to={`/blogs/categoria/${category.slug}`} className="text-blue-400 hover:underline">
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Etiquetas */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-white">Etiquetas</h2>
                <ul className="flex flex-wrap gap-4 mt-2">
                    {tags.map(tag => (
                        <li key={tag.slug}>
                            <Link to={`/blogs/tag/${tag.slug}`} className="text-green-400 hover:underline">
                                {tag.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Grid de blogs */}
            <div id="blog_list" className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pb-3">
                {loading ? (
                    <div className="text-white text-center col-span-full">Cargando blogs...</div>
                ) : blogs.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">No hay nada por aquí...</p>
                ) : (
                    blogs.map(blog => <BlogCard blog={blog} key={blog.id || blog.pk} />)
                )}
            </div>
        </div>
    );
}