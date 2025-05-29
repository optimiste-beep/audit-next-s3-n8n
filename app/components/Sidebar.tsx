"use client";
import Link from "next/link";
import Image from "next/image"
import { PT_Sans } from "next/font/google";
import { useState } from "react";

import { cn } from "../lib/utils"
import { LayoutDashboard, FileUp, ListTodo, ChevronDown, ChevronUp, Database } from "lucide-react";
import { usePathname } from "next/navigation";

const ptSans = PT_Sans({
    weight: "400",
    subsets: ["latin"]
});

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-zinc-600"
    },
    {
        label: "Tasks",
        icon: ListTodo,
        href: "#",
        color: "text-zinc-600",
        submenu: true,
        subMenuItems: [
            { label: "Upload", path: "/tasks/upload", icon: FileUp },
            { label: "Storage", path: "/tasks/storage", icon: Database }
        ]
    }
];

const Sidebar = () => {
    const pathname = usePathname();
    const [isTasksOpen, setIsTasksOpen] = useState(false);

    // Automatically open Tasks submenu if we're on a tasks page
    useState(() => {
        if (pathname.includes('/tasks')) {
            setIsTasksOpen(true);
        }
    });

    const toggleTasksSubmenu = () => {
        setIsTasksOpen(!isTasksOpen);
    };

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#f1f5f2] text-black">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-10 h-10 mr-4">
                        <Image
                            alt="Logo"
                            src="/logo.png"
                            width={50}
                            height={50}
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold", ptSans.className)}>
                        Optimiste AI
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <div key={route.href || route.label}>
                            {route.submenu ? (
                                // Menu item with submenu
                                <div>
                                    <div
                                        onClick={toggleTasksSubmenu}
                                        className={cn(
                                            "text-md group flex p-3 w-full justify-start font-semibold cursor-pointer hover:text-zinc-400 hover:bg-white/10 rounded-lg transition",
                                            pathname.includes('/tasks') ? "text-zinc-600" : "text-zinc-500"
                                        )}
                                    >
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="flex items-center">
                                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                                {route.label}
                                            </div>
                                            {isTasksOpen ? (
                                                <ChevronUp className="h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Submenu */}
                                    {isTasksOpen && (
                                        <div className="pl-6 mt-1 space-y-1">
                                            {route.subMenuItems.map((subMenuItem, index) => (
                                                <Link
                                                    key={index}
                                                    href={subMenuItem.path}
                                                    className={cn(
                                                        "text-md group flex p-2 w-full justify-start font-medium cursor-pointer hover:text-zinc-400 hover:bg-white/10 rounded-lg transition",
                                                        pathname === subMenuItem.path ? "text-zinc-600 bg-white/10" : "text-zinc-500"
                                                    )}
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <subMenuItem.icon className="h-4 w-4 mr-2" />
                                                        {subMenuItem.label}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Regular menu item
                                <Link
                                    href={route.href}
                                    className={cn(
                                        "text-md group flex p-3 w-full justify-start font-semibold cursor-pointer hover:text-zinc-400 hover:bg-white/10 rounded-lg transition",
                                        pathname === route.href ? "text-zinc-600" : "text-zinc-500"
                                    )}
                                >
                                    <div className="flex items-center flex-1">
                                        <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                        {route.label}
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
