import Head from "next/head";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <>
      <Head>
        <title>Client Onboard Chatbot</title>
      </Head>
      <div>
        <Navbar />
      </div>
      <main className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md h-7/10 bg-white shadow-lg rounded-lg overflow-hidden">
          <ChatBox />
        </div>
      </main>
    </>
  );
}
