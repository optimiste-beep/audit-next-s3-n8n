import { N8nResponse } from "../types/n8n";

export const sendMessageToN8n = async (input: string): Promise<N8nResponse> => {
    try {
        console.log("Sending input to API:", input);

        // Structure the payload according to n8n webhook expectations
        const payload = {
            message: input,
            timestamp: new Date().toISOString()
        };

        // Call our Next.js API route
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            // The server returned an error with details in the response
            throw new Error(data.message || `Failed with status: ${response.status}`);
        }

        console.log("API Response:", data);
        return data;
    } catch (error) {
        console.error("Error in sendMessageToN8n:", error);
        throw error;
    }
};