'use client';
import Image from "next/image"

const integrations = [
    {
        name: 'MS Excel',
        logo: '/excel.jpeg',
        description: 'Seamlessly import and export spreadsheets for advanced data analysis and reporting.',
    },
    {
        name: 'Adobe PDF',
        logo: '/pdf.png',
        description: 'Automate PDF generation, parsing, and secure document management.',
    },
    {
        name: 'MS Word',
        logo: '/word.png',
        description: 'Integrate with Word docs for automated content creation and editing.',
    },
    {
        name: 'Google Drive',
        logo: '/google-drive.png',
        description: 'Connect to Google Drive for secure cloud storage and collaboration.',
    },
    {
        name: 'Confluence',
        logo: '/confluence.png',
        description: 'Sync with Confluence to keep your knowledge base and compliance docs up to date.',
    },
    {
        name: 'Dropbox',
        logo: '/Dropbox.png',
        description: 'Manage, share, and automate files with Dropbox integration.',
    },
    {
        name: 'MS SharePoint',
        logo: '/SharePoint.jpeg',
        description: 'Automate workflows and document management with SharePoint.',
    },
];

export default function IntegrationsPage() {
    return (
        <main className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Integrations</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app) => (
                    <div
                        key={app.name}
                        className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
                    >
                        <Image
                            src={app.logo}
                            alt={app.name}
                            width={60}
                            height={60}
                            className="w-14 h-14 object-contain mb-4"
                            style={{ background: 'white', borderRadius: 8 }}
                        />
                        <div className="font-semibold text-lg mb-2">{app.name}</div>
                        <div className="text-gray-600 text-sm">{app.description}</div>
                    </div>
                ))}
            </div>
        </main>
    );
}
