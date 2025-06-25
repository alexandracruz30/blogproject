import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    // Si en el futuro quieres condicionar algo según login:
    const { isAuthenticated } = useAuth();

    return (
        <div>
            <div className="flex items-center relative w-full">
                <img src="/wallpaper2.jpg" alt="Header" className="w-full object-cover" />
                <div className="text-white absolute flex flex-col items-center justify-center inset-0">
                    <h2 className="text-7xl font-bold mb-2 text-center font-hitake px-6">
                        Sumérgete en el universo del anime y manga
                    </h2>
                    <div className="p-4 flex justify-between space-x-4">
                        <button
                            onClick={() => {
                                document.getElementById('blog_list')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-white bg-[#ba3259] hover:bg-pink-950 dark:text-white font-medium py-2 px-4 rounded transition-all duration-500 ease-in-out"
                        >
                            Ver Blogs
                        </button>
                        <a
                            href="/add-blog"
                            className="text-white bg-[#ba3259] hover:bg-pink-950 dark:text-white font-medium py-2 px-4 rounded transition-all duration-500 ease-in-out"
                        >
                            Nuevo Blog
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}