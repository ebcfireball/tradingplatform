
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import prisma from '/home/ebcfireball/js_projs/option_strats/options_strats/app/lib/prisma'

export async function POST(req) {
    const { user } = await getSession();
    if (!user) {
        return NextResponse.json({ "error": "not authenticated" },{status:401})
    }

    const { symbol, contractSymbol, expiration, type, strike, contrPrice } = await req.json();
    try {
        const makerEmail = user.email;
        const userInfo = await prisma.user.findFirst({
            where:{
                email: makerEmail
            },include:{
                positions:true,
                optiontrade: true
            }
        })

        if (contrPrice*100<userInfo.cash/100){
            const opttrade = await prisma.optiontrade.create({
                data:{
                    symbol,type,contractSymbol,expiration,strike,contrPrice,makerEmail
                }
            })
            const  userup = await prisma.user.update({
                where:{
                    email: makerEmail
                },data:{
                    cash : type==0?userInfo.cash-(contrPrice*100*100):userInfo.cash+(contrPrice*100*100)
                }, include:{
                    positions: true,
                    optiontrade: true
                }
            })
            return NextResponse.json({opttrade,userup})
        }
        return NextResponse.json({'insufficient funds': 'need more money'})
    } catch (err) {
        return NextResponse.json({ err },{status:401})
    }

}