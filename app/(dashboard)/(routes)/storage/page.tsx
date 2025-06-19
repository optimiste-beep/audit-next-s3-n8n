'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useOrganization } from '@clerk/nextjs';

interface Document {
    name: string;
    url: string;
    folder: string;
    key: string;
}

export default function StoragePage() {
    const { user } = useUser();
    const { organization } = useOrganization();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/documents?userId=${user?.id}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            setDocuments(data);
            setStatusMessage(null);
        } catch (error) {
            setStatusMessage('Error fetching documents. Please try again.');
            console.error('Error fetching documents:', error);
        }
        setLoading(false);
    }, [user?.id]); // Only add dependencies that are used inside the function

    useEffect(() => {
        if (user && organization) fetchDocuments();
    }, [fetchDocuments, user, organization]); // Include fetchDocuments in the array


    const handleDelete = async (key: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                const response = await fetch('/api/documents', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key }),
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                setStatusMessage(`${name} deleted successfully.`);
                await fetchDocuments();
            } catch {
                setStatusMessage('Error deleting file. Please try again.');
            }
        }
    };

    // Filter by folder
    const questionnaires = documents.filter(doc => doc.folder.includes('/Questionnaires/'));
    const references = documents.filter(doc => doc.folder.includes('/Documents/'));

    if (!user || !organization) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <div className="text-center py-8">
                    <p>Loading organization information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <main className="flex-1 p-10">
                {statusMessage && (
                    <div className={`mb-4 p-3 rounded ${statusMessage.includes('Error')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                        }`}>
                        {statusMessage}
                    </div>
                )}

                {/* Uploaded Questionnaires */}
                <section className="mb-10 mt-10">
                    <div className="mb-2 text-gray-900 font-medium text-xl">Uploaded Questionnaires</div>
                    <div className="space-y-2 bg-white shadow rounded-xl p-4">
                        {loading ? (
                            <span>Loading...</span>
                        ) : questionnaires.length === 0 ? (
                            <span className="text-gray-400">No files uploaded</span>
                        ) : (
                            questionnaires.map(doc => (
                                <div key={doc.key} className="flex items-center justify-between bg-gray-50 shadow-sm rounded p-3">
                                    <span className="truncate max-w-xs">{doc.name}</span>
                                    <div className="flex space-x-2">
                                        <a
                                            href={doc.url}
                                            download={doc.name}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Download
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc.key, doc.name)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Uploaded Reference Resources */}
                <section className="mb-10">
                    <div className="mb-2 text-gray-900 font-medium text-xl">Uploaded Reference Resources</div>
                    <div className="space-y-2 bg-white shadow rounded-xl p-4">
                        {loading ? (
                            <span>Loading...</span>
                        ) : references.length === 0 ? (
                            <span className="text-gray-400">No files uploaded</span>
                        ) : (
                            references.map(doc => (
                                <div key={doc.key} className="flex items-center justify-between bg-gray-50 shadow-sm rounded p-3">
                                    <span className="truncate max-w-xs">{doc.name}</span>
                                    <div className="flex space-x-2">
                                        <a
                                            href={doc.url}
                                            download={doc.name}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Download
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc.key, doc.name)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
