// components/Navigation.tsx
'use client'

import { UserButton, useUser } from '@clerk/nextjs'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

export default function Navigation() {
    const { isSignedIn, user } = useUser()
    // const pathname = usePathname()

    if (!isSignedIn) return null

    // const navigation = [
    //     { name: 'Dashboard', href: '/dashboard' },
    //     { name: 'Upload', href: '/dashboard/tasks/upload' },
    //     { name: 'Storage', href: '/dashboard/tasks/storage' },
    // ]

    return (
        <nav className="bg-white shadow border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">DocManager</h1>
                        </div>
                        {/* <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${pathname === item.href
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div> */}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Welcome, {user?.username || user?.emailAddresses[0]?.emailAddress}
                        </span>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}
