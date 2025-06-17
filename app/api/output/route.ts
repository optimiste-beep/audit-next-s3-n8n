import { NextResponse } from "next/server";
import { listOutputFiles } from "../../lib/s3";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = searchParams.get('orgId');
        const userId = searchParams.get('userId');
        const sessionId = searchParams.get('sessionId');

        if (!orgId || !userId || !sessionId) {
            return NextResponse.json(
                { error: "Organization ID, User ID, and Session ID are required" },
                { status: 400 }
            );
        }

        const outputFiles = await listOutputFiles(orgId, userId, sessionId);

        return NextResponse.json(outputFiles);
    } catch (error) {
        console.error("Error listing output documents:", error);
        return NextResponse.json(
            { error: "Failed to list output documents" },
            { status: 500 }
        );
    }
}
