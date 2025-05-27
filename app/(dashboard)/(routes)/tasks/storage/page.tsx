// app/(dashboard)/(routes)/dashboard/tasks/storage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
// import Link from 'next/link';

interface Document {
    name: string;
    url: string;
    folder: string;
    key: string;
}

export default function StoragePage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'questionnaire' | 'evidence'>('all');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/documents');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setDocuments(data);
            setStatusMessage(null);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setStatusMessage('Error fetching documents from S3. Please try again.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (key: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                const response = await fetch('/api/documents', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ key }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                setStatusMessage(`${name} deleted successfully.`);
                await fetchDocuments();
            } catch (error) {
                console.error('Delete error:', error);
                setStatusMessage('Error deleting file. Please try again.');
            }
        }
    };

    // Filter documents based on active tab
    const filteredDocuments = documents.filter(doc => {
        if (activeTab === 'all') return true;
        return doc.folder.includes(`/${activeTab}/`);
    });

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Document Storage</h1>
                <button
                    onClick={fetchDocuments}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                    Refresh
                </button>
            </div>

            {statusMessage && (
                <div className={`mb-4 p-3 rounded ${statusMessage.includes('Error')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                    }`}>
                    {statusMessage}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-4 border-b">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'all'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        All Documents
                    </button>
                    <button
                        onClick={() => setActiveTab('questionnaire')}
                        className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'questionnaire'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Questionnaires
                    </button>
                    <button
                        onClick={() => setActiveTab('evidence')}
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'evidence'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Evidence
                    </button>
                </nav>
            </div>

            {/* Documents Table */}
            <div className="bg-white shadow rounded-lg p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <p>Loading documents...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left">Document Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Type</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.length > 0 ? (
                                    filteredDocuments.map((doc) => (
                                        <tr key={doc.key}>
                                            <td className="border border-gray-300 p-2">
                                                {doc.name}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {doc.folder.includes('/questionnaire/') ? 'Questionnaire' :
                                                    doc.folder.includes('/evidence/') ? 'Evidence' : 'Other'}
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc.key, doc.name)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="border border-gray-300 p-4 text-center text-gray-500">
                                            No documents found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
