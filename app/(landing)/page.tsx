// import Head from "next/head";
// import ChatBox from "../components/ChatBox";
// import Navbar from "../components/Navbar"

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Client Onboard Chatbot</title>
//       </Head>
//       <div>
//         <Navbar />
//       </div>
//       <main className="h-screen flex items-center justify-center bg-gray-100">
//         <div className="w-full max-w-md h-7/10 bg-white shadow-lg rounded-lg overflow-hidden">
//           <ChatBox />
//         </div>
//       </main>
//     </>
//   );
// }


// app/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center min-h-screen py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Document Management
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Upload, process, and manage your documents with AI-powered analysis.
              Secure storage with AWS S3 and intelligent document processing.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

