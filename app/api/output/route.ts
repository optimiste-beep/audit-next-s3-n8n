import { NextResponse } from "next/server";
import { listSessionOutputFiles } from "../../lib/s3";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        const outputFiles = await listSessionOutputFiles(sessionId);

        return NextResponse.json(outputFiles);
    } catch (error) {
        console.error("Error listing output documents:", error);
        return NextResponse.json(
            { error: "Failed to list output documents" },
            { status: 500 }
        );
    }
}
