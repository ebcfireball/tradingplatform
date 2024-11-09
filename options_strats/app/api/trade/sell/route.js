import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import prisma from '/home/ebcfireball/js_projs/option_strats/options_strats/app/lib/prisma'

export async function POST(req) {
    const { symbol } = await req.json();
    const { user } = await getSession();
    if (!user) {
        return NextResponse.json({error: "not authenticated"})
    }
    try {
        const email = user.email
        const userInfo = await prisma.user.findFirst({
            where: {
                email: email
            }, include: {
                positions: true
            }
        })
        let hasStock=false
        for (let position of userInfo.positions){
            if (position.symbol == symbol){
                hasStock = true
            }
        }
        if (hasStock==false){
            throw("you don't own that stock")
        }
        const stock = await prisma.stock.findFirst({
            where: {
                symbol: symbol
            }
        })
        
        const ref = await prisma.trade.findFirst({
            where:{
                symbol: symbol,
                makerId: userInfo.userId
            }
        })

        const trade = await prisma.trade.delete({
            where:{
                symbol: symbol,
                ref_id: ref.ref_id,
            }
        })

        const upUser = await prisma.user.update({
            where: {
                email: email
            }, data: {
                cash: userInfo.cash + stock.price
            }, include: {
                positions: true
            }
        })
        //console.log(trade, user)
        //return NextResponse.json({ trade, user })
        return NextResponse.json({stock, trade,upUser })
    } catch (error) {
        return NextResponse.json({ error, "er": "more error" })
    }
}

