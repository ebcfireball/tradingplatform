'use client'
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Navbar(){
    const {user,error, isLoading} = useUser();
    return (
        <div className="h-10">
            <ul className="w-[80%] mx-auto place-content-between flex">
                <li className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 hover:text-3xl transition-all duration-500"><Link href={'/'}>Logo</Link></li>
                <ul className="flex gap-4">
                    {user && (<li className="text-xl font-semibold hover:text-blue-500 hover:text-2xl transition-all duration-500 "><Link href={'/trade'}>Trade</Link></li>)}
                    {user && (<li className="text-xl font-semibold hover:text-blue-500 hover:text-2xl transition-all duration-500"><Link href={'/account'}>Account</Link></li>)}
                    {user && (<li className="text-xl font-semibold hover:text-blue-500 hover:text-2xl transition-all duration-500"><Link href={'/options'}>Options</Link></li>)}
                    <li className="text-xl font-semibold hover:text-blue-500 hover:text-2xl transition-all duration-500">{(!user) && (<Link href={'/api/auth/login'}>Login</Link>)}{user && (<Link href={'/api/auth/logout'}>Logout</Link>)}</li>
                </ul>
            </ul>
        </div>
    );
}