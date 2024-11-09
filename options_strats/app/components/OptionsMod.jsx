"use client";
import { useState } from "react";

export default function OptionsMod({ data }) {
    const [vis, setVis] = useState(false);
    const [callVis, setCallVis] = useState(true);
    const [currExp, setCurrExp] = useState(0);
    let callOpts = {};
    let putOpts = {};
    for (let call of data.calls) {
        let expiration = call.expiration;
        expiration in callOpts
            ? callOpts[expiration].push(call)
            : (callOpts[expiration] = [call]);
    }
    for (let put of data.puts) {
        let expiration = put.expiration;
        expiration in putOpts
            ? putOpts[expiration].push(put)
            : (putOpts[expiration] = [put]);
    }

    const buy = async()=>{
        console.log('buy')
    }
    
    const sell = async()=>{
        console.log('sell')
    }
    return (
        <div className="bg-slate-200 rounded-md p-2 my-4 w-1/2 place-items-center">
            <h2 className="text-xl font-semibold mb-2">{data.symbol}</h2>
            <button
                onClick={() => setVis(!vis)}
                className="p-2 bg-blue-400 rounded-full w-[120px] hover:w-[150px] hover:bg-blue-600 transition-all duration-500"
            >
                Trade Options
            </button>
            {vis && (
                <div className="absolute bg-slate-300 rounded-md w-1/2 h-3/4 left-[25%] top-0 mt-20 p-4">
                    <div className="flex place-content-between">
                        <h2 className="text-xl font-semibold p-2">
                            {data.symbol} : {data.price / 100}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                className={`p-2 ${
                                    callVis ? "bg-green-400" : "bg-cyan-400"
                                } rounded-full w-[120px] hover:w-[150px] hover:bg-green-600 transition-all duration-500`}
                                onClick={() => setCallVis(true)}
                            >
                                Call
                            </button>
                            <button
                                className={`p-2 ${
                                    !callVis ? "bg-red-400" : "bg-cyan-400"
                                } rounded-full w-[120px] hover:w-[150px] hover:bg-red-600 transition-all duration-500`}
                                onClick={() => setCallVis(false)}
                            >
                                Put
                            </button>
                        </div>
                        <button
                            onClick={() => setVis(!vis)}
                            className="font-bold text-xl"
                        >
                            X
                        </button>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {callVis &&
                            Object.keys(callOpts).map((exp, ind) => (
                                <button
                                    onClick={() => setCurrExp(ind)}
                                    className={`${
                                        ind == currExp && "bg-cyan-800"
                                    } rounded-full bg-cyan-500 p-2 w-[140px] hover:w-[150px] transition-all duration-500 hover:bg-cyan-700`}
                                    key={ind}
                                >
                                    {exp.slice(0, 15)}
                                </button>
                            ))}
                        {!callVis &&
                            Object.keys(putOpts).map((exp, ind) => (
                                <button
                                    onClick={() => setCurrExp(ind)}
                                    className={`${
                                        ind == currExp && "bg-cyan-800"
                                    } rounded-full bg-cyan-500 p-2 w-[140px] hover:w-[150px] transition-all duration-500 hover:bg-cyan-700`}
                                    key={ind}
                                >
                                    {exp.slice(0, 15)}
                                </button>
                            ))}
                    </div>
                    <ul className="flex flex-col max-h-[500px] mt-4 overflow-y-auto overflow-x-auto ">
                        <li className="grid grid-cols-5 underline underline-offset-2 text-lg p-2">
                            <p>Strike</p>
                            <p>Last Price</p>
                            <p>Bid</p>
                            <p>Ask</p>
                        </li>
                        {callVis &&
                            callOpts[Object.keys(callOpts)[currExp]].map(
                                (call, ind) => (
                                    <li
                                        key={ind}
                                        className="grid grid-cols-5 hover:bg-slate-200 p-2 rounded-md"
                                    >
                                        <p>{call.strike}</p>
                                        <p>{call.lastPrice}</p>
                                        <p>{call.bid}</p>
                                        <p>{call.ask}</p>
                                        <div className="flex gap-1">
                                            <button onClick={()=>buy()} className="bg-green-200 rounded-lg w-10 hover:bg-green-400 transition-all duration-500 hover:w-12">
                                                Buy
                                            </button>
                                            <button onClick={()=>sell()} className="bg-red-200 rounded-lg w-10 hover:bg-red-400 transition-all duration-500 hover:w-12">
                                                Sell
                                            </button>
                                        </div>
                                    </li>
                                )
                            )}
                        {!callVis &&
                            putOpts[Object.keys(putOpts)[currExp]].map(
                                (put, ind) => (
                                    <li
                                        key={ind}
                                        className="grid grid-cols-5 hover:bg-slate-200 p-2 rounded-md"
                                    >
                                        <p>{put.strike}</p>
                                        <p>{put.lastPrice}</p>
                                        <p>{put.bid}</p>
                                        <p>{put.ask}</p>
                                        <div className="flex gap-1">
                                            <button onClick={()=>buy()} className="bg-green-200 rounded-lg w-10 hover:bg-green-400 transition-all duration-500 hover:w-12">
                                                Buy
                                            </button>
                                            <button onClick={()=>sell()} className="bg-red-200 rounded-lg w-10 hover:bg-red-400 transition-all duration-500 hover:w-12">
                                                Sell
                                            </button>
                                        </div>
                                    </li>
                                )
                            )}
                    </ul>
                </div>
            )}
        </div>
    );
}
