import OptionsMod from '../components/OptionsMod'
import prisma from '../lib/prisma'


export default async function Options(){
    const aplData = await prisma.stock.findFirst({where:{symbol:"AAPL"},include:{calls:true,puts:true}})
    const msftData = await prisma.stock.findFirst({where:{symbol:"MSFT"},include:{calls:true,puts:true}})
    const spyData = await prisma.stock.findFirst({where:{symbol:"SPY"},include:{calls:true,puts:true}})
    const nvdaData = await prisma.stock.findFirst({where:{symbol:"NVDA"},include:{calls:true,puts:true}})
    return (
        <div className="w-4/5 mx-auto flex flex-col">
            <h1 className="text-2xl font-bold text-center my-10">Options Page</h1>
            <div className="grid grid-cols-2 gap-4 place-items-center">
                <OptionsMod data={aplData} />
                <OptionsMod data={msftData} />
                <OptionsMod data={spyData} />
                <OptionsMod data={nvdaData} />
            </div>
        </div>
    )
}