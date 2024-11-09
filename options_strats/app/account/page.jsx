import PositionCard from "../components/PositionCard";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";

export default async function Account() {
    const { user } = await getSession();
    if (!user) {
        redirect("api/auth/login");
    }
    const getPositions = async () => {
        const currUser = await prisma.user.findFirst({
            where: {
                email: user.email,
            },
            include: {
                positions: true,
            },
        });
        return currUser;
    };
    const currUser = await getPositions();
    const positions = currUser.positions;
    const prices = await prisma.stock.findMany();
    const calcPositions = () => {
        let position = {};
        let compPrice = {};
        let oldVal = currUser.cash;
        let newVal = currUser.cash;
        for (let pos of positions) {
            const symbol = pos.symbol;
            compPrice[symbol] = pos.price;
            for (let comp of prices) {
                if (symbol == comp.symbol) {
                    position[symbol]
                        ? (position[symbol] += 1)
                        : (position[symbol] = 1);
                    oldVal += pos.price;
                    newVal += comp.price;
                }
            }
        }
        return [position, compPrice, oldVal, newVal];
    };
    const vals = calcPositions();
    console.log(vals);

    return (
        <div className="mx-auto w-4/5">
            <h1 className="text-center text-2xl font-bold my-6">
                Account Page
            </h1>
            <div className="flex gap-10">
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-semibold">Positions</h2>
                    {Object.keys(vals[0]).map((position, i) => (
                        <PositionCard
                            symbol={position}
                            quantity={vals[0][position]}
                            price={vals[1][position]}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-semibold">PNL</h2>
                    <p className="text-lg font-semibold">Original Value - ${vals[2]/100}</p>
                    <p className={`text-lg font-semibold ${vals[3]>vals[2]?'text-green-500':'text-red-500'}`}>Current Value - ${vals[3]/100}</p>
                    <p className={`text-lg font-semibold ${vals[3]>vals[2]?'text-green-500':'text-red-500'}`}>Percent Change - {((vals[3]/vals[2]-1)*100).toFixed(2)}%</p>
                </div>
            </div>
        </div>
    );
}
