import { NextResponse } from "next/server";
import { listS3Files, deleteFileFromS3 } from "../../lib/s3";

// GET all documents (excluding output files)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        console.log(searchParams)
        // Get all documents
        const allFiles = await listS3Files();

        // Filter out output files
        const documents = allFiles.filter(file => !file.folder.includes('/output/'));

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Error listing documents:", error);
        return NextResponse.json(
            { error: "Failed to list documents" },
            { status: 500 }
        );
    }
}

// DELETE document
export async function DELETE(req: Request) {
    try {
        const { key } = await req.json();

        if (!key) {
            return NextResponse.json(
                { error: "File key is required" },
                { status: 400 }
            );
        }

        await deleteFileFromS3(key);

        return NextResponse.json({
            message: "File deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json(
            { error: "Failed to delete document" },
            { status: 500 }
        );
    }
}
