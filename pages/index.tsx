import Image from 'next/image'
import { Inter } from 'next/font/google'
import {ConnectButton,useWallet} from '@suiet/wallet-kit';
import { TransactionBlock } from "@mysten/sui.js";
import Header from '@/components/header';
import Footer from '@/components/footer';
import Mint from '@/components/mint';


// const wallet = useWallet();
  
// async function handleSignAndExecuteTx() {
//   console.log("Transacting")
//       if (!wallet.connected) {
//         alert("wallet not connected");
//         return
//       }
//   try {
//     const resData = await wallet.signAndExecuteTransaction({
//       transaction: {
//         kind: 'moveCall',
//         data: {
//           packageObjectId: '0x2',
//           module: 'devnet_nft',
//           function: 'mint',
//           typeArguments: [],
//           arguments: [
//             "CapyWompus",
//             "This is CapyWompus",
//             "https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop"
//           ],
//           gasBudget: 10000,
//         }
//       }
//     });
//     console.log('nft minted successfully!', resData);
//     if (resData.EffectsCert) // if it's Suiet wallet 
//       alert('congrats, a cute capybara comes to you!\nSui object ID:\n'+ resData?.EffectsCert?.effects?.effects?.created[0]?.reference?.objectId) 
//     else // if it's Ethos and maybe others?
//       alert('congrats, a cute capybara comes to you!\nSui object ID:\n'+ resData?.effects?.created[0]?.reference?.objectId) 
//   } catch (e) {
//     console.error('nft mint failed', e);
//   }
// }


const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  return (
    <main className="font-mono ">
      <Header />
      <div  className="flex flex-col items-center mx-3 gap-6 pb-8 pt-6 md:py-10">
      {/* <div className="z-10 justify-between items-center text-sm flex-col">
      <code className="font-bold">{wallet.status}</code> 
      {wallet?.account && (
        <div>
          <p>Connected Account: {wallet.account.address}</p>
          {wallet.chain?.id}
        </div>
        
      )} 
      {wallet.status === "connected" && (
        <button onClick={mintNft}>Mint Your NFT !</button>
      )}
      </div> */}
      <Mint />
      <Footer />
      </div>
    
    </main>
  )
}
