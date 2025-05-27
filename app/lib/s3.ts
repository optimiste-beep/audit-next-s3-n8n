// // lib/s3.ts
// import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, ObjectCannedACL } from "@aws-sdk/client-s3";

// // Initialize S3 client
// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//     },
// });

// const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

// // Upload file to S3
// export async function uploadFileToS3(file: Buffer, fileName: string, contentType: string) {
//     const params = {
//         Bucket: bucketName,
//         Key: fileName,
//         Body: file,
//         ContentType: contentType,
//         ACL: ObjectCannedACL.public_read  // Use the enum instead of string
//     };

//     try {
//         await s3Client.send(new PutObjectCommand(params));
//         return {
//             success: true,
//             url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
//         };
//     } catch (error) {
//         console.error("Error uploading to S3:", error);
//         throw error;
//     }
// }

// // Delete file from S3
// export async function deleteFileFromS3(fileName: string) {
//     const params = {
//         Bucket: bucketName,
//         Key: fileName,
//     };

//     try {
//         await s3Client.send(new DeleteObjectCommand(params));
//         return { success: true };
//     } catch (error) {
//         console.error("Error deleting from S3:", error);
//         throw error;
//     }
// }

// // List all files in the S3 bucket
// export async function listS3Files() {
//     const params = {
//         Bucket: bucketName,
//     };

//     try {
//         const data = await s3Client.send(new ListObjectsV2Command(params));

//         if (!data.Contents) {
//             return [];
//         }

//         return data.Contents.map(file => ({
//             name: file.Key || '',
//             url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
//         }));
//     } catch (error) {
//         console.error("Error listing S3 files:", error);
//         throw error;
//     }
// }


// lib/s3.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, ObjectCannedACL } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

// Upload file to S3 with folder structure
export async function uploadFileToS3(file: Buffer, sessionId: string, documentType: string, fileName: string, contentType: string) {
    // Create path based on session ID and document type
    const key = `${sessionId}/${documentType}/${fileName}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: ObjectCannedACL.public_read,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return {
            success: true,
            key: key,
            url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}

// Delete file from S3
export async function deleteFileFromS3(key: string) {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
        return { success: true };
    } catch (error) {
        console.error("Error deleting from S3:", error);
        throw error;
    }
}

// List all files in the S3 bucket with optional prefix
export async function listS3Files(prefix: string = '') {
    const params = {
        Bucket: bucketName,
        Prefix: prefix,
    };

    try {
        const data = await s3Client.send(new ListObjectsV2Command(params));

        if (!data.Contents) {
            return [];
        }

        // Filter out folder paths and parse document info
        return data.Contents
            .filter(item => item.Key && !item.Key.endsWith('/') && item.Size && item.Size > 0)
            .map(file => {
                const key = file.Key || '';
                const name = key.split('/').pop() || key;
                const folder = key.substring(0, key.lastIndexOf('/') + 1);

                return {
                    name,
                    key,
                    folder,
                    url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
                };
            });
    } catch (error) {
        console.error("Error listing S3 files:", error);
        throw error;
    }
}

// List output files for a specific session
export async function listSessionOutputFiles(sessionId: string) {
    return listS3Files(`${sessionId}/output/`);
}
