import PositionCard from "../components/PositionCard";
import OptionPosition from "../components/OptionPosition";
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
                optiontrade: true,
            },
        });
        return currUser;
    };
    const today = Date.now();
    let toDel = [];
    const currUser = await getPositions();
    const positions = currUser.positions;
    const optionPositions = currUser.optiontrade;
    let opts = {};
    //keep track of number of each same contract and delete if expired
    for (let opt of optionPositions) {
        if (opt.expiration < today) {
            toDel.push(opt.ref_id);
        } else if (opt.contractSymbol in opts) {
            opts[opt.contractSymbol].quantity += 1;
        } else {
            opts[opt.contractSymbol] = {
                option: opt,
                quantity: 1,
            };
        }
    }
    //delete all expired contracts
    while (toDel.length > 0) {
        await prisma.optiontrade.delete({
            where: {
                ref_id: toDel.pop(),
            },
        });
    }
    let currOpts = {};

    const prices = await prisma.stock.findMany({
        include: { calls: true, puts: true },
    });
    for (let comp of prices) {
        for (let call of comp.calls) {
            if (call.contractSymbol in opts) {
                currOpts[call.contractSymbol] = call.lastPrice;
            }
        }
        for (let put of comp.puts) {
            if (put.contractSymbol in opts) {
                currOpts[put.contractSymbol] = put.lastPrice;
            }
        }
    }
    const calcPositions = () => {
        let position = {};
        let compPrice = {};
        let oldVal = currUser.cash;
        let newVal = currUser.cash;
        //calculate stocks position
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
        //calculate options position value
        for (let comp of prices) {
            for (let call of comp.calls) {
                if (call.contractSymbol in opts) {
                    newVal +=
                        call.lastPrice *
                        100 *
                        opts[call.contractSymbol].quantity *
                        100;
                    oldVal +=
                        opts[call.contractSymbol].quantity *
                        100 *
                        opts[call.contractSymbol].option.contrPrice *
                        100;
                }
            }
            for (let put of comp.puts) {
                if (put.contractSymbol in opts) {
                    newVal +=
                        put.lastPrice *
                        100 *
                        opts[put.contractSymbol].quantity *
                        100;
                    oldVal +=
                        opts[put.contractSymbol].quantity *
                        100 *
                        opts[put.contractSymbol].option.contrPrice *
                        100;
                }
            }
        }
        return [position, compPrice, oldVal, newVal];
    };
    const vals = calcPositions();

    return (
        <div className="mx-auto w-4/5 mb-4">
            <h1 className="text-center text-2xl font-bold my-6">
                Account Page
            </h1>
            <div className="flex flex-col gap-10">
                <h2 className="text-xl font-semibold">PNL</h2>
                <div className="grid grid-cols-3">
                    <p className="text-lg font-semibold">
                        Original Value - ${vals[2] / 100}
                    </p>
                    <p
                        className={`text-lg font-semibold ${
                            vals[3] > vals[2]
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        Current Value - ${vals[3] / 100}
                    </p>
                    <p
                        className={`text-lg font-semibold ${
                            vals[3] > vals[2]
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        Percent Change -{" "}
                        {((vals[3] / vals[2] - 1) * 100).toFixed(2)}%
                    </p>
                </div>
                <h2 className="text-xl font-semibold">Stock Positions</h2>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-1">
                    {Object.keys(vals[0]).map((position, i) => (
                        <PositionCard
                            key={i}
                            symbol={position}
                            quantity={vals[0][position]}
                            price={vals[1][position]}
                        />
                    ))}
                </div>
                <h2 className="text-xl font-semibold">Option Positions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {Object.keys(opts).map((option, i) => (
                        <OptionPosition
                            key={i}
                            data={opts[option]}
                            opts={currOpts}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
