export interface N8nResponse {
    botResponse?: string;
    message?: string;
    response?: string;
    success?: boolean;
    // Replace any with a more specific index signature type
    [key: string]: string | boolean | number | object | undefined;
}