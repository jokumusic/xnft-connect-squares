import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, {createContext, useCallback, useEffect, useRef, useState} from 'react';
import { usePublicKey, useSolanaConnection } from 'react-xnft';

export interface GlobalProvider {
    connection: Connection,
    wallet: PublicKey,
    walletBalance: number,
    refreshWalletBalance() : Promise<void>,
    navPush(s:string),
}

export interface refreshWalletBalanceFunc {
    async () : Promise<void>,
}

export const GlobalContext = createContext<GlobalProvider>({});

export function GlobalProvider(props) {
    const connection = useSolanaConnection();
    const wallet = usePublicKey();
    const [walletBalance,setWalletBalance] = useState(0);

    async function refreshWalletBalance () {
        const balance = await connection.getBalance(wallet) / LAMPORTS_PER_SOL;
        setWalletBalance(balance);
         //console.log('ttt: got balance ', balance.toFixed(3));
    }

    useEffect(()=>{
        /* //NOT WORKING
          connection.onAccountChange(wallet,
            (accountInfo,context) => {
              console.log('ttt balance: ', accountInfo);
              setWalletBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
            });
        */
    
        refreshWalletBalance();
        const timer = setInterval(()=>refreshWalletBalance(), 30 * 1000);
        return ()=>{
            clearInterval(timer);
        };

    },[]);
    
    return (
        <GlobalContext.Provider value={{
            connection,
            wallet,
            walletBalance,
            refreshWalletBalance,
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}