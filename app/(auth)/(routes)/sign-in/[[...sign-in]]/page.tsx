// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'
import Image from "next/image"

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mr-4 mb-10">
                    <Image
                        alt="Logo"
                        src="/logo.png"
                        width={75}
                        height={75}
                    />
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-lg border border-gray-200",
                        }
                    }}
                />
            </div>
        </div>
    )
}
