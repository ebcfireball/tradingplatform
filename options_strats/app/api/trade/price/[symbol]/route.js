import { NextResponse } from "next/server";
//import prisma from "@/app/lib/prisma";
import prisma from "/home/ebcfireball/js_projs/option_strats/options_strats/app/lib/prisma"

export async function GET(req, { params }) {
    let symbol = (await params).symbol
    try {
        let price = (await prisma.stock.findFirst({ where: { symbol: symbol } })).price / 100
        return NextResponse.json({ price: price })
    } catch (err) {
        return NextResponse.json({ err })
    }
}