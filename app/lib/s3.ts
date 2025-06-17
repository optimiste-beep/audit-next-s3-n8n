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

// Upload file to S3 with organized folder structure
export async function uploadFileToS3(
    file: Buffer,
    orgId: string,
    userId: string,
    sessionId: string,
    documentType: string,
    fileName: string,
    contentType: string
) {
    // Create path: orgId/userId/sessionId/Documents or Questionnaires/filename
    const folderName = documentType === 'evidence' ? 'Documents' : 'Questionnaires';
    const key = `${orgId}/${userId}/${sessionId}/${folderName}/${fileName}`;

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

// List files with organized structure
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

// List output files for a specific org/user/session
export async function listOutputFiles(orgId: string, userId: string, sessionId: string) {
    return listS3Files(`${orgId}/${userId}/${sessionId}/Results/`);
}

// List all files for an organization
export async function listOrgFiles(orgId: string) {
    return listS3Files(`${orgId}/`);
}

// List all files for a specific user in an organization
export async function listUserFiles(orgId: string, userId: string) {
    return listS3Files(`${orgId}/${userId}/`);
}
