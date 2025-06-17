'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useOrganization } from '@clerk/nextjs';
import Link from 'next/link';

interface Document {
    name: string;
    url: string;
    key: string;
}

export default function UploadPage() {
    const { user } = useUser();
    const { sessionId } = useAuth();
    const { organization } = useOrganization();

    const [uploadStep, setUploadStep] = useState<number>(1); // 1=evidence, 2=questionnaire, 3=view output
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [outputDocuments, setOutputDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);

    // Poll for output documents
    useEffect(() => {
        if (!user?.id || !sessionId || !organization?.id) return;

        const fetchOutputDocuments = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/output?orgId=${organization.id}&userId=${user.id}&sessionId=${sessionId}`);
                if (!response.ok) throw new Error(`Error: ${response.status}`);

                const data = await response.json();
                setOutputDocuments(data);
            } catch (error) {
                console.error('Error fetching output documents:', error);
            }
            setLoading(false);
        };

        // Initial fetch
        fetchOutputDocuments();

        // Set up polling every 10 seconds
        const interval = setInterval(fetchOutputDocuments, 10000);
        return () => clearInterval(interval);
    }, [user?.id, sessionId, organization?.id]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
            setUploadStatus(null);
        }
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            setUploadStatus('Please select files to upload.');
            return;
        }

        if (!user?.id || !sessionId || !organization?.id) {
            setUploadStatus('User authentication required.');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('documents', file));
        formData.append('orgId', organization.id);
        formData.append('userId', user.id);
        formData.append('sessionId', sessionId);
        formData.append('documentType', uploadStep === 1 ? 'evidence' : 'questionnaire');

        setIsUploading(true);
        setUploadStatus(`Uploading ${uploadStep === 1 ? 'evidence' : 'questionnaire'} files...`);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            setUploadStatus(`Successfully uploaded ${result.files.length} ${uploadStep === 1 ? 'evidence' : 'questionnaire'} files!`);

            // Move to next step or complete
            if (uploadStep < 3) {
                setUploadStep(uploadStep + 1);
            }

            setFiles([]);

            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Error uploading files. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetUpload = () => {
        setUploadStep(1);
        setFiles([]);
        setUploadStatus(null);
    };

    const downloadFile = async (key: string, fileName: string) => {
        try {
            const response = await fetch(`/api/download?key=${encodeURIComponent(key)}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const { downloadUrl } = await response.json();

            // Create temporary anchor to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            alert("Error downloading file. Please try again.");
        }
    };

    // Show loading if user data is not available
    if (!user || !organization) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p>Loading user information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto mt-10">
            {/* <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Document Upload</h1>
                <div className="text-sm text-gray-600">
                    <p>Organization: <span className="font-medium">{organization.name}</span></p>
                    <p>User: <span className="font-medium">{user.firstName} {user.lastName}</span></p>
                    <p>Session: <span className="font-medium">{sessionId}</span></p>
                </div>
            </div> */}

            {/* Progress indicator */}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <div className={`flex-none h-8 w-8 rounded-full flex items-center justify-center ${uploadStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>1</div>
                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                        <div className={`h-1 ${uploadStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ width: uploadStep >= 2 ? '100%' : '0%' }}></div>
                    </div>
                    <div className={`flex-none h-8 w-8 rounded-full flex items-center justify-center ${uploadStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>2</div>
                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                        <div className={`h-1 ${uploadStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}
                            style={{ width: uploadStep >= 3 ? '100%' : '0%' }}></div>
                    </div>
                    <div className={`flex-none h-8 w-8 rounded-full flex items-center justify-center ${uploadStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>3</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Upload A Reference Resource</span>
                    <span>Upload A Questionnaire</span>
                    <span>Download Results</span>
                </div>
            </div>

            {/* Upload Evidence Step */}
            {uploadStep === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-8">
                    <h2 className="text-xl font-semibold mb-4">Upload A Reference Resource</h2>
                    <p className="text-gray-600 mb-4">Please upload your reference resources. You can select multiple files.</p>

                    <div className="mb-4">
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="border p-2 rounded w-full"
                            disabled={isUploading}
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                        />
                        {files.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected {files.length} file(s): {files.map(f => f.name).join(', ')}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || files.length === 0}
                        className={`w-full ${isUploading || files.length === 0
                            ? 'bg-gray-400'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white px-4 py-2 rounded transition`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Reference Resource & Continue'}
                    </button>

                    {uploadStatus && (
                        <p className={`mt-2 text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
                            }`}>
                            {uploadStatus}
                        </p>
                    )}
                </div>
            )}

            {/* Upload Questionnaire Step */}
            {uploadStep === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Upload A Questionnaire</h2>
                    <p className="text-gray-600 mb-4">Now, please upload your questionnaire. You can select multiple files.</p>

                    <div className="mb-4">
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="border p-2 rounded w-full"
                            disabled={isUploading}
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                        />
                        {files.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                Selected {files.length} file(s): {files.map(f => f.name).join(', ')}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || files.length === 0}
                        className={`w-full ${isUploading || files.length === 0
                            ? 'bg-gray-400'
                            : 'bg-blue-500 hover:bg-blue-600'
                            } text-white px-4 py-2 rounded transition`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Questionnaire & Complete'}
                    </button>

                    {uploadStatus && (
                        <p className={`mt-2 text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
                            }`}>
                            {uploadStatus}
                        </p>
                    )}
                </div>
            )}

            {/* Completed Step */}
            {uploadStep === 3 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Upload Complete</h2>
                    <p className="text-gray-600 mb-4">
                        Your questionnaire and evidence documents have been uploaded successfully.
                        They will be processed automatically, and results will appear below once available.
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={resetUpload}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            Upload New Documents
                        </button>
                        <Link
                            href="/dashboard/tasks/storage"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition inline-block"
                        >
                            View All Documents
                        </Link>
                    </div>
                </div>
            )}

            {/* Output Documents Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Processed Results</h2>
                {loading ? (
                    <p className="text-center py-4">Loading processed documents...</p>
                ) : (
                    <>
                        {outputDocuments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2 text-left">Document Name</th>
                                            <th className="border border-gray-300 p-2">Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outputDocuments.map((doc) => (
                                            <tr key={doc.key}>
                                                <td className="border border-gray-300 p-2">
                                                    {doc.name}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    <button
                                                        onClick={() => downloadFile(doc.key, doc.name)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-4 text-gray-500">
                                No processed documents available yet. After uploading and processing, results will appear here.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

