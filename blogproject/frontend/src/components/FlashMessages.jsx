export default function FlashMessages({ messages = [] }) {
    if (!messages.length) return null;
    return (
        <div className="container mx-auto mt-4">
        {messages.map((msg, idx) => (
            <div
            key={idx}
            className={`p-4 mb-4 rounded-lg text-white ${
                msg.type === "error"
                ? "bg-red-500"
                : msg.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            >
            {msg.text}
            </div>
        ))}
        </div>
    );
}