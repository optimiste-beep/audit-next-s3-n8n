import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const N8N_URL = process.env.N8N_URL;
        const WEBHOOK_ID = process.env.WEBHOOK_ID;

        console.log("API Route received request:", body);
        console.log("Attempting to connect to:", `${N8N_URL}/webhook-test/${WEBHOOK_ID}`);

        // Check if environment variables are properly configured
        if (!N8N_URL || !WEBHOOK_ID) {
            console.error("Missing environment variables: N8N_URL or WEBHOOK_ID");
            return NextResponse.json(
                { message: "Server configuration error: Missing environment variables" },
                { status: 500 }
            );
        }

        const response = await fetch(`${N8N_URL}/webhook-test/${WEBHOOK_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            // Add timeout to prevent hanging if n8n is unreachable
            signal: AbortSignal.timeout(10000)
        });

        console.log("n8n response status:", response.status);

        if (!response.ok) {
            throw new Error(`n8n responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("n8n response data:", data);

        return NextResponse.json(data);
    } catch (error: unknown) {
        // More detailed error logging
        console.error('Error in API route:', error);

        // Provide more specific error messages
        let errorMessage = 'Error communicating with n8n';
        const statusCode = 500;

        // Type check and handle the error appropriately
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Connection to n8n timed out';
            } else if (error.message.includes('ECONNREFUSED')) {
                errorMessage = 'Could not connect to n8n server';
            } else if (error.message.includes('status')) {
                errorMessage = error.message;
            }

            return NextResponse.json(
                { message: errorMessage, error: error.message },
                { status: statusCode }
            );
        }

        // Handle non-Error objects
        return NextResponse.json(
            { message: errorMessage, error: String(error) },
            { status: statusCode }
        );
    }
}