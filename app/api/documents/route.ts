// import { NextResponse } from "next/server";
// import { listOrgFiles, deleteFileFromS3 } from "../../lib/s3";
// import { auth } from "@clerk/nextjs/server";

// // GET all documents for the organization (excluding Results)
// export async function GET() {
//     try {
//         const { userId, orgId } = await auth();

//         if (!userId || !orgId) {
//             return NextResponse.json(
//                 { error: "Authentication required" },
//                 { status: 401 }
//             );
//         }

//         // Get all documents for the organization
//         const allFiles = await listOrgFiles(orgId);

//         // Filter out Results files, only show Documents and Questionnaires
//         const documents = allFiles.filter(file =>
//             !file.folder.includes('/Results/') &&
//             (file.folder.includes('/Documents/') || file.folder.includes('/Questionnaires/'))
//         );

//         return NextResponse.json(documents);
//     } catch (error) {
//         console.error("Error listing documents:", error);
//         return NextResponse.json(
//             { error: "Failed to list documents" },
//             { status: 500 }
//         );
//     }
// }

// // DELETE document
// export async function DELETE(req: Request) {
//     try {
//         const { userId, orgId } = await auth();

//         if (!userId || !orgId) {
//             return NextResponse.json(
//                 { error: "Authentication required" },
//                 { status: 401 }
//             );
//         }

//         const { key } = await req.json();

//         if (!key) {
//             return NextResponse.json(
//                 { error: "File key is required" },
//                 { status: 400 }
//             );
//         }

//         // Verify the file belongs to the user's organization
//         if (!key.startsWith(`${orgId}/`)) {
//             return NextResponse.json(
//                 { error: "Unauthorized access to file" },
//                 { status: 403 }
//             );
//         }

//         await deleteFileFromS3(key);

//         return NextResponse.json({
//             message: "File deleted successfully"
//         });
//     } catch (error) {
//         console.error("Error deleting document:", error);
//         return NextResponse.json(
//             { error: "Failed to delete document" },
//             { status: 500 }
//         );
//     }
// }



// app/api/documents/route.ts
import { NextResponse } from "next/server";
import { listS3Files, deleteFileFromS3 } from "../../lib/s3";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
        const { userId, orgId } = await auth();
        const { searchParams } = new URL(req.url);
        const requestUserId = searchParams.get('userId');

        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify requested user matches authenticated user
        if (requestUserId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 403 }
            );
        }

        // List files for this specific user
        const prefix = `${orgId}/${userId}/`;
        const allFiles = await listS3Files(prefix);

        // Filter out Results files
        const documents = allFiles.filter(file =>
            !file.folder.includes('/Results/') &&
            (file.folder.includes('/Documents/') || file.folder.includes('/Questionnaires/'))
        );

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Error listing documents:", error);
        return NextResponse.json(
            { error: "Failed to list documents" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { userId, orgId } = await auth();
        const { key } = await req.json();

        if (!userId || !orgId) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Verify the file belongs to this user
        if (!key.startsWith(`${orgId}/${userId}/`)) {
            return NextResponse.json(
                { error: "Unauthorized file access" },
                { status: 403 }
            );
        }

        await deleteFileFromS3(key);

        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json(
            { error: "Failed to delete document" },
            { status: 500 }
        );
    }
}

