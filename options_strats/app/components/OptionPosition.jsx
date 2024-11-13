"use client";
import { useState } from "react";

export default function OptionPosition({ data, opts }) {
    const [quantity, setQuantity] = useState(1);
    const cont = data.option.contractSymbol.slice(4);

    const exercise = async () => {
        const res = await fetch("/api/trade/earlyexercise", {
            method: "POST",
            headers: {
                "Content-type": "application.json",
            },
            body: JSON.stringify({
                type: data.option.type,
                contractSymbol: data.option.contractSymbol,
                symbol: data.option.symbol,
                quantity: quantity,
                strike: data.option.strike
            }),
        });
        if (res.ok) {
            console.log("early exercised");
            window.location.reload()
        }
    };
    return (
        <div className="bg-gradient-to-r from-blue-300 to-purple-300 p-1 rounded-lg hover:from-blue-400 hover:to-purple-400 flex flex-col">
            <div className="font-semibold flex gap-4">
                <h2 className="font-bold">{data.option.symbol}</h2>
                {cont.includes("P") ? <p>Put</p> : <p>Call</p>}
                <p
                    className={`${
                        data.option.contrPrice <=
                        opts[data.option.contractSymbol]
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    Current Contract Value - ${opts[data.option.contractSymbol]}{" "}
                    -{" "}
                    {(
                        data.option.contrPrice /
                            opts[data.option.contractSymbol] -
                        1
                    ).toFixed(2)}
                    %
                </p>
            </div>
            <div className="grid grid-cols-5">
                <p className="font-semibold">Strike</p>
                <p className="font-semibold">Expiration</p>
                <p className="font-semibold">Buy/Sell</p>
                <p className="font-semibold">Contract</p>
                <p className="font-semibold">Quantity</p>
                <p>${data.option.strike}</p>
                <p>
                    {data.option.expiration
                        .toLocaleDateString("en-US")
                        .slice(0, 15)}
                </p>
                <p>{data.option.type == 0 ? "Buy" : "Sell"}</p>
                <p>${data.option.contrPrice}</p>
                <p className="font-semibold">{data.quantity}</p>
            </div>
            {data.option.type == 0 && (
                <div className="flex place-content-center my-1 gap-2">
                    <button
                        onClick={() => {
                            if (quantity > data.quantity || quantity < 1) {
                                console.log(quantity);
                                console.log("woah");
                                return;
                            } else {
                                exercise();
                            }
                        }}
                        className="rounded-lg bg-red-300 p-1 w-[70px] hover:bg-red-400 hover:w-[100px] transition-all duration-300"
                    >
                        Exercise
                    </button>
                    <input
                        onChange={(e) => {
                            setQuantity(e.target.value);
                        }}
                        className="bg-transparent rounded-lg w-[50px] font-bold text-lg"
                        max={data.quantity}
                        min={1}
                        type="number"
                        name=""
                        id=""
                        placeholder="qty"
                    />
                </div>
            )}
        </div>
    );
}
