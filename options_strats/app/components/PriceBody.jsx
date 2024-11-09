"use client";

export default function PriceBody({ symbol, price, user }) {
    const buy = async (e) => {
        console.log("buy", symbol, price);
        try {
            const res = await fetch("/api/trade/buy", {
                method: "POST",
                headers: {
                    "Content-type": "application.json",
                },
                body: JSON.stringify({
                    symbol,
                }),
            });
            if (res.ok) {
                console.log("bought the stock");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sell = async (e) => {
        console.log("sell", symbol, price);
        try {
            const res = await fetch("/api/trade/sell", {
                method: "POST",
                headers: {
                    "Content-type": "application.json",
                },
                body: JSON.stringify({
                    symbol,
                }),
            });
            if (res.ok) {
                console.log("just sold");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <h2 className="text-center font-semibold">{symbol}</h2>
            <div>
                <p className="text-center">{price}</p>
            </div>
            <div className="flex place-content-evenly">
                <button
                    onClick={(e) => buy(e)}
                    className="p-2 bg-blue-500 rounded-full w-[70px] hover:w-[100px] hover:bg-purple-500 transition-all duration-500"
                >
                    Buy
                </button>
                <button
                    onClick={(e) => sell(e)}
                    className="p-2 bg-blue-500 rounded-full w-[70px] hover:w-[100px] hover:bg-purple-500 transition-all duration-500"
                >
                    Sell
                </button>
            </div>
        </>
    );
}
