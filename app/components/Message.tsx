import React from "react";

interface MessageProps {
    content: string;
    sender: "user" | "bot";
}

const Message: React.FC<MessageProps> = ({ content, sender }) => {
    const isUser = sender === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`p-3 rounded-lg text-xs max-w-xs ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                {content}
            </div>
        </div>
    );
};

export default Message;

