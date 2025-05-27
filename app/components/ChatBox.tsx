"use client";
import React, { useState } from "react";
import Message from "./Message";
import { sendMessageToN8n } from "../lib/api";

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<{ content: string; sender: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { content: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await sendMessageToN8n(input);

            // Extract the bot message from n8n response
            // Adjust this based on how your n8n workflow structures the response
            const botMessage = response?.botResponse || response?.message || response?.response ||
                "Sorry, I couldn't process your request.";

            setMessages((prev) => [...prev, { content: botMessage, sender: "bot" }]);
        } catch (error) {
            console.error("Error communicating with n8n:", error);
            setMessages((prev) => [
                ...prev,
                { content: "An error occurred. Please try again later.", sender: "bot" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-grow overflow-y-auto">
                {messages.map((msg, index) => (
                    <Message key={index} content={msg.content} sender={msg.sender as "user" | "bot"} />
                ))}
                {isLoading && <div className="text-gray-500 text-sm italic">Bot is typing...</div>}
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-grow p-2 text-xs border rounded-l-lg"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-blue-500 text-white rounded-r-lg disabled:bg-blue-300"
                    disabled={isLoading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;