import { PrismaClient } from "@prisma/client";
import yahooFinance from "yahoo-finance2";

const prisma = new PrismaClient()

const cleanOptionDb = async()=>{
    let calls = await prisma.call.findMany()
    let puts = await prisma.put.findMany()
    for (let call of calls){
        if (call.expiration < Date.now()){
            await prisma.call.delete({
                where:{
                    callId: call.callId
                }
            })
        }
    }
    for (let put of puts){
        if (put.expiration < Date.now()){
            await prisma.put.delete({
                where:{
                    putId: put.putId
                }
            })
        }
    }
}

const getStocks = async () => {
    let res = await yahooFinance.quote(['AAPL', 'GOOG', 'MSFT', 'TSLA', 'NVDA','SPY'])
    for (let comp of res) {
        const stock = await prisma.stock.upsert({
            create: {
                symbol: comp.symbol,
                price: comp.regularMarketPrice * 100
            },
            update: {
                price: comp.regularMarketPrice * 100
            },
            where: {
                symbol: comp.symbol
            }
        })
        console.log(stock, comp.symbol, comp.regularMarketPrice)
    }
}

const getOptions = async () => {
    const comps = ['AAPL', 'GOOG', 'MSFT', 'TSLA', 'NVDA','SPY']
    for (let comp of comps) {
        const queryOptions = { lang: 'en-US', formatted: false, region: 'US' }
        let res = await yahooFinance.options(comp, queryOptions)
        for (let expiration of res.expirationDates.slice(1,4)) {
            let queryOpts = { lang: 'en-US', formatted: false, region: 'US', date: expiration }
            let res = (await yahooFinance.options(comp, queryOpts)).options
            for (let call of res[0].calls) {
                const option = await prisma.call.upsert({
                    where:{
                        contractSymbol: call.contractSymbol
                    },
                    create:{
                        symbol: comp,
                        contractSymbol: call.contractSymbol,
                        strike: call.strike,
                        expiration: call.expiration,
                        impliedVol: call.impliedVolatility,
                        lastPrice: call.lastPrice,
                        bid: call.bid,
                        ask: call.ask,
                        vol: call.volume
                    },
                    update:{
                        impliedVol: call.impliedVolatility,
                        lastPrice: call.lastPrice,
                        bid: call.bid,
                        ask: call.ask,
                        vol: call.volume
                    }
                })
            }
            for (let put of res[0].puts) {
                const option = await prisma.put.upsert({
                    where:{
                        contractSymbol: put.contractSymbol
                    },
                    create:{
                        symbol: comp,
                        strike: put.strike,
                        contractSymbol: put.contractSymbol,
                        expiration: put.expiration,
                        impliedVol: put.impliedVolatility,
                        lastPrice: put.lastPrice,
                        bid: put.bid,
                        ask: put.ask,
                        vol: put.volume

                    },
                    update:{
                        impliedVol: put.impliedVolatility,
                        lastPrice: put.lastPrice,
                        bid: put.bid,
                        ask: put.ask,
                        vol: put.volume
                    }
                })
            }
        }
    }
}

const main = async () => {
    //setInterval(async () => {
        //getStocks()
        //getOptions()
    //}, (3000))
    //getStocks()
    //getOptions()
    await cleanOptionDb()
}

main().then(async () => { await prisma.$disconnect() })