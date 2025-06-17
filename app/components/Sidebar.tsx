"use client";
import Link from "next/link";
import Image from "next/image"
import { PT_Sans } from "next/font/google";
// import { useState } from "react";

import { cn } from "../lib/utils"
// import { LayoutDashboard, FileUp, ListTodo, ChevronDown, ChevronUp, Database } from "lucide-react";
import { FileUp, CircleHelp, Database } from "lucide-react";
// import { usePathname } from "next/navigation";

const ptSans = PT_Sans({
    weight: "400",
    subsets: ["latin"]
});

const routes = [
    // {
    //     label: "Dashboard",
    //     icon: LayoutDashboard,
    //     href: "/dashboard",
    //     color: "text-zinc-600"
    // },
    {
        label: "Upload",
        icon: FileUp,
        href: "/upload",
        color: "text-zinc-600"
    },
    {
        label: "Storage",
        icon: Database,
        href: "/storage",
        color: "text-zinc-600"
    },
    {
        label: "Help",
        icon: CircleHelp,
        href: "/help",
        color: "text-zinc-600"
    }

    // {
    //     label: "Tasks",
    //     icon: ListTodo,
    //     href: "#",
    //     color: "text-zinc-600",
    //     submenu: true,
    //     subMenuItems: [
    //         { label: "Upload", path: "/tasks/upload", icon: FileUp },
    //         { label: "Storage", path: "/tasks/storage", icon: Database }
    //     ]
    // }
];

const Sidebar = () => {

    return (
        <aside className="space-y-4 py-4 flex flex-col h-full bg-[#f1f5f2] text-black">
            <div>
                <div className="flex justify-center items-center mr-4">
                    <Link href="/upload" className="flex items-center pl-3 mb-14">
                        <div className="relative h-10 mr-4">
                            <Image
                                alt="Logo"
                                src="/logo.png"
                                width={60}
                                height={60}
                            />
                        </div>
                        <h1 className={cn("text-2xl font-bold mt-5", ptSans.className)}>
                            Optimiste AI
                        </h1>
                    </Link>
                </div>
            </div>
            <nav className="flex flex-col space-y-6 w-full text-left px-4">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className="flex items-center gap-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <route.icon className={`w-5 h-5 ${route.color}`} />
                        <span>{route.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
