import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { main } from "./index";


async function checkPriceAndSell(){

  const check = setInterval(async()=>{
    const api = await fetch("https://price.jup.ag/v4/price?ids=GCYhY3C53feC1HC4R326fseb6iUJbqKgE4B53eV8cFHR")
    const apiJson = await api.json()
    let price = apiJson.data["GCYhY3C53feC1HC4R326fseb6iUJbqKgE4B53eV8cFHR"].price
    console.log(price);
    if(parseFloat(price) >= 0.0015){
        console.log("swap başlıyor");
        clearInterval(check)
       await main("So11111111111111111111111111111111111111112","GCYhY3C53feC1HC4R326fseb6iUJbqKgE4B53eV8cFHR", 85360.78 * LAMPORTS_PER_SOL)
    }
  },100)
}

checkPriceAndSell()