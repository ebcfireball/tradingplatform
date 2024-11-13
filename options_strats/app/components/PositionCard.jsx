
export default async function PositionCard({symbol, quantity, price}){
    return (
        <div className="w-[125px] bg-gradient-to-r from-blue-500 to-purple-500 hover:w-[150px] transition-all duration-500 rounded-lg p-1">
            <p>{symbol} - {quantity}</p>
            <p>Value - ${quantity*price/100}</p>
        </div>
    );
}