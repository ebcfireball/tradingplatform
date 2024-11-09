import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import prisma from '/home/ebcfireball/js_projs/option_strats/options_strats/app/lib/prisma'

export async function POST(req) {
    const {symbol} = await req.json()
    const { user } = await getSession();
    console.log('made it here')
    if (!user) {
        return NextResponse.json({ error: "not authenticated" }, { status: 401 })
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
        const stock = await prisma.stock.findFirst({
            where: {
                symbol: symbol
            }
        })
        if (stock.price / 100 < userInfo.cash) {
            const trade = await prisma.trade.create({
                data: {
                    bs: 0,
                    price: stock.price,
                    symbol: symbol,
                    makerId: userInfo.userId
                }
            })
            const user = await prisma.user.update({
                where:{
                    email:email
                },data:{
                    cash: userInfo.cash-stock.price
                },include:{
                    positions:true
                }
            })
            console.log(trade, user)
            return NextResponse.json({trade, user})
        }
        return NextResponse.json({"insufficient":"funds"})
    } catch (error) {
        return NextResponse.json({ error})
    }
}
