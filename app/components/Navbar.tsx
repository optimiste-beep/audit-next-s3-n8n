import Image from 'next/image';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white h-12 flex items-center justify-between px-4">
            <div className="">
                <Link href="/">
                    <div className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Optimiste AI Logo"
                            width={40}
                            height={40}
                            className="mr-2"
                        />
                        <span className="text-lg font-semibold">Optimiste AI</span>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
