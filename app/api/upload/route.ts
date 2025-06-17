import { NextResponse } from "next/server";
import { uploadFileToS3 } from "../../lib/s3";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("documents") as File[];
        const orgId = formData.get("orgId") as string;
        const userId = formData.get("userId") as string;
        const sessionId = formData.get("sessionId") as string;
        const documentType = formData.get("documentType") as string;

        if (!files.length || !orgId || !userId || !sessionId || !documentType) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Validate document type
        if (!['evidence', 'questionnaire'].includes(documentType)) {
            return NextResponse.json(
                { error: "Invalid document type" },
                { status: 400 }
            );
        }

        const uploadedFiles = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());

            const result = await uploadFileToS3(
                buffer,
                orgId,
                userId,
                sessionId,
                documentType,
                file.name,
                file.type
            );

            uploadedFiles.push({
                name: file.name,
                url: result.url,
                key: result.key
            });
        }

        return NextResponse.json({
            message: "Files uploaded successfully",
            files: uploadedFiles
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json(
            { error: "Failed to upload files" },
            { status: 500 }
        );
    }
}
