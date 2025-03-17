"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between px-4 py-4">
            {/* Logo on the left */}
            <div className="flex-shrink-0">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Lock Chun Chinese Cuisine"
                        width={300}
                        height={40}
                        priority
                    />
                </Link>
            </div>
            
            {/* Centered navigation items */}
            <div className="flex-grow flex justify-center">
                <div className="space-x-8 text-xl">
                    <Link href="/" className={`${pathname === '/' ? 'font-bold underline' : ''}`}>
                        Home
                    </Link>
                    <Link href="/menu" className={`${pathname === '/menu' ? 'font-bold underline' : ''}`}>
                        Menu
                    </Link>
                    <Link href="/location" className={`${pathname === '/location' ? 'font-bold underline' : ''}`}>
                        Location
                    </Link>
                </div>
            </div>
            
            {/* Empty div to balance the layout NEEDS TO MATCH LOGO WIDTH */}
            <div className="flex-shrink-0 w-[300px]"></div>
        </nav>
    );
}