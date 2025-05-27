import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json(
                { error: "File key is required" },
                { status: 400 }
            );
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        return NextResponse.json({
            downloadUrl: signedUrl
        });
    } catch (error) {
        console.error("Error generating download link:", error);
        return NextResponse.json(
            { error: "Failed to generate download link" },
            { status: 500 }
        );
    }
}