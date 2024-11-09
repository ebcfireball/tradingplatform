import PriceCard from "./components/PriceCard";

export default function Home() {
    return (
        <div className="flex flex-col w-4/5 mx-auto gap-6">
            <h1 className="mx-auto font-bold text-2xl">Trading System</h1>
            <p className="font-medium text-xl text-center my-6">
                The new evolution of trading has come. Trade options, stocks,
                crypto, and more on here.
            </p>
            <div className="flex place-content-evenly">
                <PriceCard name={'AAPL'} />
                <PriceCard name={'MSFT'} />
            </div>
        </div>
    );
}
