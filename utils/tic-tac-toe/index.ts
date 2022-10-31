import { useState, useEffect} from "react";
import ReactXnft, {
  LocalStorage,
  AnchorDom,
} from "react-xnft";
import { PublicKey, Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Program, utils } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { IDL as IDL_TIC_TAC_TOE, TicTacToe } from "./tic-tac-toe";

export const PID_TIC_TAC_TOE = new PublicKey("H5k95qzHVCoKJSDCE5WLJ9kcmfSWn89sw4gWkjGY76DB");

export const GameState = {
  waiting:{},
  active:{},
  tie:{},
  won:{}
};

export interface Game {
  address: PublicKey,
  bump: number,
  creator: PublicKey,
  state: typeof GameState,
  rows: number,
  cols: number,
  minPlayers: number,
  maxPlayers: number,
  moves: number,
  wager: number,
  pot: PublicKey,
  initTimestamp: number,
  lastMoveSlot: number,
  joinedPlayers: number,
  currentPlayerIndex: number,
  board: [[number]],
  players: [PublicKey],
}

async function getGamePda(wallet: PublicKey) {
  const [gamePda, gamePdaBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("game"), wallet.toBuffer()],
    PID_TIC_TAC_TOE
  );

  return gamePda;
}

async function getPotPda(gamePda: PublicKey) {
  const [potPda, potPdaBump] = PublicKey.findProgramAddressSync( 
    [Buffer.from("pot"), gamePda.toBuffer()],
    PID_TIC_TAC_TOE
  );

  console.log('ttt potpdabump: ', potPdaBump);

  return potPda;
}

// @param withReload is true if we want to poll for a constant refresh.
export function useOpenGames(connection: Connection, wallet: PublicKey, withReload = true) {
  const [[games, isLoading], setGamesIsLoading] = useState<[[Game], boolean]>([[], true]);

  useEffect(() => {
    const fetchOpenGames = async () => {
      try {
        const openGames = await getOpenGames(connection, wallet)
        setGamesIsLoading([openGames, false]);
      } catch (err) {
        console.error(err);
        setGamesIsLoading([[], false]);
      }
    };

    // Fetch the farmer account every 10 seconds to get state updates.
    fetchOpenGames();
    if (withReload) {
      setInterval(() => fetchOpenGames(), 10 * 1000);
    }
  }, []);

  return [games, isLoading];
}

export function tictactoeClient(): Program<TicTacToe> {
  return new Program<TicTacToe>(IDL_TIC_TAC_TOE, PID_TIC_TAC_TOE, window.xnft);
}

export async function createGame(connection: Connection, creator:PublicKey, rows=3,cols=3,minPlayers=2,maxPlayers=2,wager=0.001) : Promise<Game> {
  const client = tictactoeClient();
  const gamePda = await getGamePda(creator);
  const potPda = await getPotPda(gamePda);
  const tx = await client.methods
  .gameInit(rows,cols, minPlayers,maxPlayers, wager)
  .accounts({
    creator: creator,
    game: gamePda,
    pot: potPda,
  })
  .transaction();
  
  console.log('getting latest blockhash');
  const { blockhash } = await connection.getLatestBlockhash().catch(err=>console.log('ttt: ' + err));
  tx.recentBlockhash = blockhash;
  tx.feePayer = creator;

  console.log('sending transaction');
  const txSignature = await window.xnft.solana.send(tx);
  console.log("tx signature", txSignature);

  const txConfirmation = await connection!.confirmTransaction(txSignature,'finalized');
        
  return getGameByAddress(gamePda);
}


export async function getOpenGames(connection:Connection, wallet: PublicKey): Promise<[Game]> {
  const url = connection.rpcEndpoint;
  const cacheKey = `${url}:OpenGames:${wallet.toString()}`;
  const val = await LocalStorage.get(cacheKey);

  //
  // Only fetch this once every 10 seconds.
  //
  if (val) {
    const resp = JSON.parse(val);
    if (
      Object.keys(resp.value).length > 0 &&
      Date.now() - resp.ts < 1000 * 10
    ) {
      return await resp.value;
    }
  }


  const newResp = await getGameAccounts([
    //{ memcmp: { offset: 41, bytes: anchor.utils.bytes.bs58.encode(Buffer.from([0])) }},
  ]);


  LocalStorage.set(
    cacheKey,
    JSON.stringify({
      ts: Date.now(),
      value: newResp,
    })
  );
  return newResp;
}

export async function getGameAccounts(filters?: Buffer | web3.GetProgramAccountsFilter[]) : Promise<[Game]> {
  return new Promise<any>(async (resolve, reject) => {
      const list = [];
      const client = tictactoeClient();
      const games = await client.account.game
          .all(filters)
          .catch(err=>reject(err.toString()));
      if(!games)
        return;

      const gameObjects = games.map(g=>{
        return {...g.account, address: new PublicKey(g.publicKey)};
      });

      resolve(gameObjects);
  });
}

export async function getGameByAddress(gameAddress: PublicKey) {
  const client = tictactoeClient();
  let game = await client.account.game.fetch(gameAddress);
  return {...game, address: gameAddress} as Game;
}

export async function joinGame(connection: Connection, player:PublicKey, gameAddress: PublicKey) {
  const client = tictactoeClient();
  const potAddress = await getPotPda(gameAddress);
  console.log('ttt pot join: ', potAddress.toBase58());
  console.log('ttt player join:', player.toBase58());
  const tx = await client.methods
  .gameJoin()
  .accounts({
    player,
    game: gameAddress,
    pot: potAddress,
  })
  .transaction();
  
  console.log('getting latest blockhash');
  const { blockhash } = await connection.getLatestBlockhash().catch(err=>console.log('ttt: ' + err));
  tx.recentBlockhash = blockhash;
  tx.feePayer = player;

  console.log('sending transaction');
  const txSignature = await window.xnft.solana.send(tx);
  console.log("tx signature", txSignature);

  const txConfirmation = await connection!.confirmTransaction(txSignature,'finalized');
  return getGameByAddress(gameAddress);
}
