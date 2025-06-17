// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'
import Image from "next/image"

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mr-4 mt-5 mb-5">
                    <Image
                        alt="Logo"
                        src="/logo.png"
                        width={75}
                        height={75}
                    />
                </div>
                <SignUp
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
