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

export const PID_TIC_TAC_TOE = new PublicKey("HY4XdrKZmvXx2PRRFHX6sQbuj1ky2RvqqxDkbMFXeELv");

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
  nonce: number,
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

export interface Tile{
  row: number,
  column: number,
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
export function useOpenGames(connection: Connection, wallet: PublicKey, withReload = true) : [[Game],boolean]{
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


    fetchOpenGames();
    if (withReload) {
      let timer = setInterval(() => fetchOpenGames(), 10 * 1000);
      
      return ()=> {
        clearInterval(timer);
      };
    }
  }, []);

  return [games, isLoading];
}

export function useGame(gameAddress: PublicKey) : [Game,boolean] {
  const [[game, isLoading], setGameIsLoading] = useState<[Game, boolean]>([{}, true]);
  
  useEffect(()=>{
    //subscribeToGame(game.address, ()=>{});
    const fetchGame = async ()=>{
      const updatedGame = await getGameByAddress(gameAddress)
        .catch(err=>console.error(err));
      
      console.log('ttt updatedGame: ', updatedGame);
      if(updatedGame){
        setGameIsLoading([updatedGame,false]);        
      }
    };
    
    fetchGame();
    let timer = setInterval(()=>fetchGame(), 5 * 1000);

    return ()=>{
      clearInterval(timer);
    };  
  },[]);
  
  return [game, isLoading];
}

export function tictactoeClient(): Program<TicTacToe> {
  return new Program<TicTacToe>(IDL_TIC_TAC_TOE, PID_TIC_TAC_TOE, window.xnft);
}

export async function createGame(connection: Connection, creator:PublicKey, rows=3,cols=3,minPlayers=2,maxPlayers=2,wager=0.001) : Promise<Game> {
  const client = tictactoeClient();
  let gameNonce = 0;
  let gamePda = null;
  let gamePdaBump = null;

  do {
    gameNonce = Math.floor(Math.random() * Math.pow(2,32));
    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), creator.toBuffer(), new anchor.BN(gameNonce).toArrayLike(Buffer, 'be', 4)],
      PID_TIC_TAC_TOE
    );

    const existingGame = await client.account.game.fetchNullable(pda);
    if(!existingGame){
      gamePda = pda;
      gamePdaBump = bump;
    }

  } while(gamePda == null);

  const potPda = await getPotPda(gamePda);
  const tx = await client.methods
  .gameInit(gameNonce, rows,cols, minPlayers,maxPlayers, wager)
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
  const cacheKey = `${url}:OpenGames:${wallet.toBase58()}`;
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


  const waitingGamesPromise = getGameAccounts([
    { memcmp: { offset: 45, bytes: anchor.utils.bytes.bs58.encode(Buffer.from([0])) }},
  ]);

  const activeGamesPromise = getGameAccounts([
    { memcmp: { offset: 45, bytes: anchor.utils.bytes.bs58.encode(Buffer.from([1])) }},
  ]);

  const queriedGames = await Promise.all([waitingGamesPromise, activeGamesPromise]).catch(err=>console.log(err));
  const activeGames = queriedGames[1] as [Game];
  const currentWalletActiveGames = activeGames.filter(g=>g.players.findIndex(p=>wallet.equals(p)) >= 0);

  const newResp = [
    ...currentWalletActiveGames.sort((a,b)=>{return a.initTimestamp - b.initTimestamp}),
    ...queriedGames[0].sort((a,b)=>{ return a.initTimestamp - b.initTimestamp})
  ];

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
        return {...g.account,
          address: new PublicKey(g.publicKey),
          lastMoveSlot: g.account.lastMoveSlot.toNumber(),
          initTimestamp: g.account.initTimestamp.toNumber()};
        });

      resolve(gameObjects);
  });
}

export async function getGameByAddress(gameAddress: PublicKey) {
  const client = tictactoeClient();
  let game = await client.account.game.fetch(gameAddress, 'confirmed');
  return {...game,
    address: gameAddress,
    lastMoveSlot: game.lastMoveSlot.toNumber(),
    initTimestamp: game.initTimestamp.toNumber()} as Game;
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

export async function gamePlay(connection: Connection, player:PublicKey, gameAddress: PublicKey, tile: Tile) {
  const client = tictactoeClient();
  const potAddress = await getPotPda(gameAddress);

  const tx = await client.methods
    .gamePlay(tile)
    .accounts({
      player: player,
      game: gameAddress,
      pot:potAddress,
    })
    .transaction();

  
  console.log('getting latest blockhash');
  const { blockhash } = await connection.getLatestBlockhash().catch(err=>console.log('ttt: ' + err));
  tx.recentBlockhash = blockhash;
  tx.feePayer = player;

  console.log('sending transaction');
  const txSignature = await window.xnft.solana.send(tx);
  console.log("ttt gamePlay tx signature", txSignature);

  //const txConfirmation = await connection!.confirmTransaction(txSignature,'finalized');
  return getGameByAddress(gameAddress);
}

export function subscribeToGame(gameAddress: PublicKey, fn) {
  if(!gameAddress) {
    //reject("gameAddress must be specified");
    return;
  }

  const client = tictactoeClient();
  const eventEmitter = client.account
    .game
    .subscribe(gameAddress, 'confirmed');

    eventEmitter.addListener('change',(g)=>{
      console.log('ttt change: ', g);
    });

    /*
    .on('change', (g)=>{
      console.log('ttt change: ', g);
      //fn(g);
    });
    */
}