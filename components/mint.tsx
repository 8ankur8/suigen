import { useState, SyntheticEvent } from "react";
import Link from "next/link";
import Image from 'next/image';
import {    useWallet   } from '@suiet/wallet-kit';
import { TransactionBlock } from "@mysten/sui.js";
import axios from "axios";
//import { toast } from "react-toastify";

type PromptForm = {
    prompt: string;
  };


export default function Mint() {
  
    const [mintingStatus, setMintingStatus] = useState<
      "progress" | "error" | "ready" | "idle" | "minted"
    >("idle");
    const [generateStatus, setGenerateStatus] = useState<
      "progress" | "error" | "generated" | "idle"
    >("idle");
 
    const [generateProgress, setGenerateProgress] = useState(0);

    const [description, setDescription] = useState("");
    const [image, setImage] = useState("https://th.bing.com/th/id/R.1f3d759e9ee1a99bbba8cac811872a6f?rik=DanuKBggDWUnkA&riu=http%3a%2f%2fhotemoji.com%2fimages%2femoji%2fh%2f1xbdigi1k6hokh.png&ehk=K9Ktd6Y4X1dGOCCLdMimSbQ03%2bDWMpl9gKz3nBBYguk%3d&risl=&pid=ImgRaw&r=0");
    


    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault();
    
        if (description === "") {
          window.alert("Please provide a name and description");
          return;
        }
    
        createImg(description)

      };

      const createImg = async (description: string) => {
        setGenerateStatus("progress");
        let result = { data: [], error: false };

        const timer = setInterval(() => {
            setGenerateProgress((oldProgress) => {
              if (oldProgress === 90) {
                if (result.data.length === 0) {
                  let progresses = [70, 75, 80];
                  oldProgress = progresses[Math.floor(Math.random() * 3)];
                }
              }
              if (oldProgress === 100) {
                clearInterval(timer);
                return 0;
              }
      
              if (result.error) {
                clearInterval(timer);
                setGenerateStatus("error");
                return 0;
              }
      
              return oldProgress + 1;
            });
          }, 1);

        const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`
        const response = await axios({
            url: URL,
            method: 'POST',
            headers: {
              Authorization: `Bearer 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`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              inputs: description, options: { wait_for_model: true },
            }),
            responseType: 'arraybuffer',
          })

        const type = response.headers['content-type']
        const data = response.data
      
        const base64data = Buffer.from(data).toString('base64')  
    
        const img = `data:${type};base64,` + base64data
        setGenerateStatus("generated")
        setImage(img)
      };

     function createMintNftTxnBlock(description:string , imgUrl:string) {
         // define a programmable transaction block
         const txb = new TransactionBlock();
      
        // note that this is a devnet contract address
         const contractAddress =
           "0x3e1ec433cdd6b39b92f43c8099eb6d9b87a4dff5a3aeaacfdd03ee019c7324db";
         const contractModule = "suigen";
         const contractMethod = "mint_to_sender";
      
         const nftName = "SuiGen";
         const nftDescription = description;
         const nftImgUrl = imgUrl
      
         txb.moveCall({
           target: `${contractAddress}::${contractModule}::${contractMethod}`,
           arguments: [
             txb.pure(nftName),
             txb.pure(nftDescription),
           ],
         });
      
         return txb;
       }
    
    const wallet = useWallet();
      
    async function mintNft() {
        //   if (!wallet.connected){
        //     alert("Please connect your wallet first");
        //   } 
        //   return;
          console.log("call")
          setMintingStatus("progress");

          const txb = createMintNftTxnBlock(description , image);
          
          try {
            // call the wallet to sign and execute the transaction
            const res = await wallet.signAndExecuteTransactionBlock({
              transactionBlock: txb,
            });
            console.log("nft minted successfully!", res);
            alert("Congrats! your nft is minted!");
            setMintingStatus("ready")
          } catch (e) {
            alert("Oops, nft minting failed");
            console.error("nft mint failed", e);
            setMintingStatus("error")
          }
        }
  
    return (
      <div className="w-3/4 lg:w-[48rem] flex flex-col gap-4">
        <form onSubmit={submitHandler}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            🔮
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/40 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your prompt"
              disabled={generateStatus === "progress"}
              onChange={(e) => setDescription(e.target.value)}  
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {generateStatus === "progress" ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
        {generateStatus === "error" && (
          <div className="bg-red-400 text-black text-base lg:text-lg font-semibold px-4 py-[0.85rem] w-full rounded-md outline-none">
            Error generating image. Please refresh the page and try again.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 mt-3">
          <div className="flex flex-col gap-4">
            {generateStatus === "generated" && image ? (
              <div className="flex flex-col gap-4">
                <Image
                  src={`${image}`}
                  alt="generated image"
                  className="h-64 md:h-80 rounded-lg"
                />
              </div>
            ) : (
              <div className="relative mb-4 w-full h-64 md:h-80 bg-gray-800/30 rounded-lg ">
                <div
                className="h-64 md:h-80 bg-gray-700/20 rounded-lg"
                style={{ width: Math.floor(generateProgress) + "%" }}
                ></div>
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">
                {`${Math.floor(generateProgress)}%`}
                </p>
              </div>
            )}
  
          </div>
  
          <div className="flex flex-col gap-2">
            {/* <h1 className="text-2xl font-semibold mt-5">The space collection</h1> */}
            <p className="text-lg">watch</p>
            <p className="font-semibold text-xl mt-3">Details</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Minted</p>
                <p className="text-lg text-gray-400">
                  {mintingStatus === "minted"
                    ? new Date().toISOString().split("T")[0]
                    : "Not minted yet"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Owned by</p>
                <p className="text-lg text-gray-400">
                  {mintingStatus === "minted" ? "You" : "No one"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Listed</p>
                <p className="text-lg text-gray-400">Not listed yet</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Network</p>
                <p className="text-lg text-gray-400">{wallet.chain?.name}</p>
              </div>
            </div>
            {mintingStatus === "minted" ? (
              <>
                <Link href={"/owned"}>
                  <div className="mt-4 border border-blue-400 text-blue-400 flex justify-center items-center gap-2 font-semibold px-4 py-3 rounded-md outline-none hover:bg-blue-400 hover:text-black cursor-pointer">
                    <span>View owned NFTs</span>
                  </div>
                </Link>
              </>
            ) : mintingStatus === "progress" ? (
              <button className="mt-4 bg-blue-400 text-black font-semibold px-4 py-3 rounded-md outline-none hover:bg-white">
                Minting...
              </button>
            ) : (
              <button
                type="submit"
                //disabled={mintingStatus !== "ready"}
                className={`mt-4 bg-blue-400 text-black font-semibold px-4 py-3 rounded-md outline-none hover:bg-white ${""
                //   mintingStatus !== "ready" ? "cursor-not-allowed" : ""
                }`}
                onClick={mintNft}
              >
                Mint SuiGen NFT
              </button>
            )}
            {mintingStatus === "error" && (
              <div className="bg-red-400 text-black text-base lg:text-lg font-semibold px-4 py-[0.85rem] w-full rounded-md outline-none">
                Error minting NFT. Please refresh the page and try again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
