import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {ConnectButton} from '@suiet/wallet-kit';

export type NavigationPageType = "create" | "marketplace" | "owned" | "/";



export default function Header() {

    const [page, setPage] = useState<NavigationPageType>();
    const router = useRouter();

    const get_page = (): NavigationPageType => {
        switch (router.asPath) {
          case "/create":
            return "create";
          case "/marketplace":
            return "marketplace";
          case "/owned":
            return "owned";
          default:
            return "/";
        }
      };
    
      useEffect(() => {
        const page = get_page();
        if (page) {
          setPage(page);
        }
      }, [router.asPath]);  

    return (
      <div className="sticky top-0 z-10 flex justify-center mb-3">
        <div className="justify-self-center flex justify-between items-center px-6 sm:px-12 py-6 w-full max-w-screen-xl">
          <div className="flex items-center text-2xl">
            <Link href="/" legacyBehavior>
              <h1>
              🌌Sui<span className="text-blue-500">Gen</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-lg">
          <Link href="/create">
              <div
                className={
                  page === "create"
                    ? "text-blue-400"
                    : "text-white-800"
                }
              >
                Create
              </div>
            </Link>
            <Link href="marketplace">
              <div
                className={
                  page === "marketplace"
                    ? " text-blue-400"
                    : " text-white-800"
                }
              >
                Marketplace
              </div>
            </Link>
            <Link href="owned">
              <div
                className={
                  page === "owned"
                    ? " text-blue-400"
                    : " text-white-800"
                }
              >
                Owned
              </div>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }