import PriceBody from './PriceBody'

export default async function PriceCard({name, user}){
    const res = await(await fetch(`http:localhost:3000/api/trade/price/${name}`)).json()
    return(
        <div className="w-[200px] h-[100px] shadow-md bg-slate-100 rounded-md p-2 mx-auto">
            <PriceBody symbol={name} price={res?.price} user={user} />
        </div>
    );
}