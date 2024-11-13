import prisma from "../../../lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";


export async function POST(req) {
    const { user } = await getSession();
    if (!user) {
        return NextResponse.json({ "error": "not authenticated" }, { status: 401 })
    }

    const { type, quantity,contractSymbol,symbol,strike } = await req.json()

    if (type != 0) {
        return NextResponse.json({ "can't": "exercise a sold contract" }, {status: 401})
    }

    try {
        const email = user.email
        let userInfo = await prisma.user.findFirst({
            where: {
                email
            }, include: {
                positions: true,
                optiontrade: true
            }
        })
        let cp = contractSymbol.slice(5,)
        //buy or sell check
        let ty = 'c'
        //check to make sure you have enough shares to sell
        let refsell = []
        if (cp.includes("P")) {
            ty = 'p'
            let pos_count = 0
            for (let pos of userInfo.positions) {
                if (pos.symbol == symbol) {
                    pos_count += 1
                    refsell.push(pos.ref_id)
                }
            }
            if (pos_count < 100 * quantity) {
                return NextResponse.json({ "not enought ": "stock" },{status:302})
            }
        }

        let ref 
        for (let optPos of userInfo.optiontrade){
            if (optPos.contractSymbol == contractSymbol){
                ref = optPos.ref_id
                break
            }
        }

        for (let i = 0; i < quantity; i++) {
            //check if the person has enough money to make the trade or if it is a put which already has been checked
            if ((userInfo.cash > strike * 100 * 100 && ty=='c') || ty=='p') {
                //delete option contract
                await prisma.optiontrade.delete({
                    where: {
                        ref_id: ref
                    }
                })
                console.log('i deleted an option')
                //deduct cash for buying
                userInfo = await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        cash: ty == 'c' ? userInfo.cash - strike * 100 * 100 : userInfo.cash + strike * 100 * 100
                    }
                })
                console.log('i updated the user')
                //sell or buy 100 of the underlying stock
                for (let i = 0; i < 100; i++) {
                    if (ty == 'c') {
                        await prisma.trade.create({
                            data: {
                                symbol: symbol,
                                bs: 0,
                                makerId: userInfo.userId,
                                price: strike * 100
                            }
                        })
                    } else {
                        await prisma.trade.delete({
                            where: {
                                ref_id: refsell.pop()
                            }
                        })
                    }
                }
                console.log('i bought or sold stock')
            }
        }
        return NextResponse.json({ userInfo })
    } catch (err) {
        return NextResponse.json({ err },{status:404})
    }

}