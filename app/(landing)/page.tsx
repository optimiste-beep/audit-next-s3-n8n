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
import Image from "next/image"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/get-started')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center min-h-screen py-12">
          <div className="flex justify-center items-center mr-4">
            <Image
              alt="Logo"
              src="/logo.png"
              width={75}
              height={75}
            />
          </div>
          <div className="text-center">
            <p className="mt-6 max-w-2xl mx-auto block text-4xl text-blue-900">
              Automate complex disclosures and compliance with AI
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                href="/sign-in"
                className="inline-flex items-center px-6 py-3 border border-blue-300 text-base font-medium text-md rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

