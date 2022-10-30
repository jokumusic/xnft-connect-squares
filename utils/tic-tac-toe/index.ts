import { useState, useEffect } from "react";
import ReactXnft, {
  LocalStorage,
  usePublicKey,
  useConnection,
  AnchorDom,
} from "react-xnft";
import { PublicKey, Connection } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { IDL as IDL_TIC_TAC_TOE, TicTacToe } from "./tic-tac-toe";

export const PID_TIC_TAC_TOE = new PublicKey("H5k95qzHVCoKJSDCE5WLJ9kcmfSWn89sw4gWkjGY76DB");

export enum GameState {
  Waiting,
  Active,
  Tie,
  Won,
}

export interface Game {
  bump: number,
  creator: PublicKey,
  state: GameState,
  rows: number,
  cols: number,
  min_players: number,
  max_players: number,
  moves: number,
  wager: number,
  pot: PublicKey,
  init_timestamp: number,
  last_move_slot: number,
  joined_players: number,
  current_player_index: number,
  board: [[number]],
  players: [PublicKey],
}

async function getGamePda() {
  const publicKey = usePublicKey();
  const [gamePda, gamePdaBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("game"), publicKey.toBuffer()],
    PID_TIC_TAC_TOE
  );

  return gamePda;
}

async function getPotPda(gamePda: PublicKey) {
  const publicKey = usePublicKey();
  const [potPda, potPdaBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("pot"), gamePda.toBuffer()],
    PID_TIC_TAC_TOE
  ); 

  return potPda;
}

// @param withReload is true if we want to poll for a constant refresh.
export function useOpenGames(withReload = true) {
  const publicKey = usePublicKey();
  const [[games, isLoading], setGamesIsLoading] = useState<[[Game], boolean]>([[], true]);

  useEffect(() => {
    const fetchOpenGames = async () => {
      try {
        const openGames = await getOpenGames()
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

export async function createGame(rows=3,cols=3,minPlayers=2,maxPlayers=2,wager=0.001) : Promise<Game> {
  const publicKey = usePublicKey();
  const client = tictactoeClient();
  const gamePda = await getGamePda();
  const potPda = await getPotPda(gamePda);
  const tx = await client.methods
  .gameInit(rows,cols, minPlayers,maxPlayers, wager)
  .accounts({
    creator: publicKey,
    game: gamePda,
    pot: potPda,     
  })
  .transaction();

  const connection = useConnection();
  console.log('getting latest blockhash');
  const { blockhash } = await connection!.getLatestBlockhash("recent");
  tx.recentBlockhash = blockhash;

  console.log('sending transaction');
  const txSignature = await window.xnft.send(tx);
  console.log("tx signature", txSignature);

  const txConfirmation = await connection!.confirmTransaction(txSignature,'finalized');
        
  let game = await client.account.game.fetch(gamePda);
  return {...game, address: gamePda} as Game;  
}


export async function getOpenGames(): Promise<[Game]> {
  const connection = useConnection();
  const publicKey = usePublicKey();
  const url = connection.rpcEndpoint;
  const cacheKey = `${url}:OpenGames:${publicKey.toString()}`;
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

  const newResp = await getGameAccounts([{
      memcmp: {
          offset: 41,
          bytes: GameState.Waiting.toString(),
      }
  }]);

  LocalStorage.set(
    cacheKey,
    JSON.stringify({
      ts: Date.now(),
      value: newResp,
    })
  );
  return newResp;
}

async function getGameAccounts(filters?: Buffer | web3.GetProgramAccountsFilter[]) : Promise<[Game]> {
  return new Promise<any>(async (resolve, reject) => {
      const list = [];
      const client = tictactoeClient();
      const games = await client.account.game
          .all(filters)
          .catch(err=>reject(err.toString()));
      if(!games)
        return;

      const gameObjects = games.map(g=>{
        return {...g.account, address: g.publicKey};
      });

      resolve(gameObjects);
  });
}
