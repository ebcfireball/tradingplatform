import { getSession } from "@auth0/nextjs-auth0";
import PriceCard from "../components/PriceCard";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";


export default async function Trade() {
    const session = await getSession();
    if (!session.user){
        redirect('/api/auth/login')
    }
    let ses = session.user
    const user = await prisma.user.upsert({
        where:{
            email: ses.email,
        },create:{
            email: ses.email,
        },update:{},include:{
            positions: true
        }
    })
    return (
        <div className="w-4/5 mx-auto">
            <h1 className="text-2xl font-bold text-center">Trade Page</h1>
            <div className="grid-cols-2 grid gap-6 mt-10">
                <PriceCard name='AAPL' user={user} />
                <PriceCard name='GOOG' user={user} />
                <PriceCard name='TSLA' user={user} />
                <PriceCard name='NVDA' user={user} />
            </div>
        </div>
    );
}
