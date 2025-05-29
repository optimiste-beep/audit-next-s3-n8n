// app/(dashboard)/(routes)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function DashboardPage() {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId) {
        return null
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}!
                </h1>
                <p className="mt-2 text-gray-600">Manage your documents and AI processing workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/tasks/upload" className="group">
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                                        Upload Documents
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Upload questionnaires and evidence documents
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/tasks/storage" className="group">
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                                        Document Storage
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        View and manage uploaded documents
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    AI Processing
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Automated document analysis and insights
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Quick Stats</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-gray-500">Documents Uploaded</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-gray-500">Documents Processed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-gray-500">Storage Used (MB)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
