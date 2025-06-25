import Navbar from './Navbar';
import FlashMessages from './FlashMessages';
import Header from './Header';

export default function Layout({ children, flashMessages = [], showHeaderImage = false }) {
    return (
        <div id="body" className="flex flex-col min-h-screen transition-all duration-700 ease-in-out">
            <Navbar />
            <FlashMessages messages={flashMessages} />
            <main className="bg-[#2e1e45] flex-grow w-full transition-all duration-700 ease-in-out">
                {showHeaderImage && <Header />}
                <div className="md:max-w-4xl lg:max-w-7xl mx-auto px-5 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}