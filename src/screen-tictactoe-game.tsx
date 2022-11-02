import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState, useEffect } from "react";
import { Text, useNavigation, View, Image, useConnection, usePublicKey} from "react-xnft";
import { Game, gamePlay, getGameByAddress, subscribeToGame, Tile, useGame } from "../utils/tic-tac-toe";


const viewHeight = 500;
const xImgUri = "https://media.istockphoto.com/vectors/dirty-grunge-hand-drawn-with-brush-strokes-cross-x-vector-isolated-vector-id1201202836?k=20&m=1201202836&s=612x612&w=0&h=0ib7KQaJXonfKN0-tGNaMUIw2Hre9sJjd4hTsc3QwBc=";
const oImgUri = "https://us.123rf.com/450wm/rondale/rondale1701/rondale170100555/69948558-fire-letter-o-of-burning-blue-flame-flaming-burn-font-or-bonfire-alphabet-text-with-sizzling-smoke-a.jpg?ver=6";
const loadingCellUri = 'https://media.tenor.com/wpSo-8CrXqUAAAAj/loading-loading-forever.gif';

const mockGame = {rows:5,cols:5};
const SLOTS_PER_TURN = 240;

export function ScreenTicTacToeGame() {
  const nav = useNavigation();
  const connection = useConnection();
  const wallet = usePublicKey();
  const [game, setGame] = useState<Game>(nav.activeRoute.props?.game);
  const [cellsize] = useState(1/game.rows * viewHeight);
  const [playerTurn, setPlayerTurn] = useState(game.currentPlayerIndex);
  const [matrix, setMatrix] = useState(game.board); //Array.from({length: game.rows},()=> Array.from({length: game.cols}, () => null)));
  const [message,setMessage] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [loadingCell, setLoadingCell] = useState<Tile|null>();
  const [turnSlotsRemaining, setTurnSlotRemaining] = useState(SLOTS_PER_TURN);

  useEffect(()=>{
    //subscribeToGame(game.address, ()=>{});
    const fetchGame = async ()=>{
      const updatedGame = await getGameByAddress(game.address).catch(err=>console.error(err));
      console.log('ttt updatedGame: ', updatedGame);
      if(updatedGame){
        setGame(updatedGame);        
      }
    };
    
    fetchGame();
    const timer = setInterval(()=>fetchGame(), 5 * 1000);

    return ()=>{
      clearInterval(timer);
    };
    
  },[]);

  function calculateCurrentPlayerIndex(currentSlot: number) {    
    const slotDifference = currentSlot - game.lastMoveSlot;
    const turnsPassed = Math.floor(slotDifference / SLOTS_PER_TURN);
    let adder = turnsPassed;
    if(turnsPassed >= game.joinedPlayers)
      adder = turnsPassed % game.joinedPlayers;
    
    let playerIndex = game.currentPlayerIndex + adder;
    if(playerIndex >= game.joinedPlayers)
      playerIndex = 0;

    console.log(`ttt gameslot=${game.lastMoveSlot}, slot=${currentSlot}, slotDiff=${slotDifference}, turnsPassed:${turnsPassed}, playerIndex:${playerIndex}`);
    return playerIndex;
  }

  useEffect(()=>{    
    const f = async ()=>{
      setMatrix(game.board);

      if(game.state?.won) {
        if(game.state.won?.winner?.equals(wallet)){
          setMessage("YOU WON! Exiting game...");
        }
        else {
          setMessage("YOU LOST! Exiting game...");
        }

        //const exitTimer = setInterval(()=>{nav.pop(); clearInterval(exitTimer);}, 5000);
        //return ()=>{
        //  clearInterval(exitTimer);
        // }
      } else if(game.state?.active) {
        const currentSlot = await connection.getSlot();
        const currentPlayerIndex = calculateCurrentPlayerIndex(currentSlot);
      
        if(currentPlayerIndex != playerTurn){
          setPlayerTurn(currentPlayerIndex);
          setIsMyTurn(wallet.equals(game.players[currentPlayerIndex]));
          setTurnSlotRemaining(SLOTS_PER_TURN);
        } else {        
          const slotDiff = (currentSlot - game.lastMoveSlot);
          setTurnSlotRemaining(slotDiff <= SLOTS_PER_TURN ? SLOTS_PER_TURN - slotDiff : SLOTS_PER_TURN - (slotDiff % SLOTS_PER_TURN));
        }
      }
    };

  f();

  },[game]);

  function getCellImage(row,col) {
    const state = matrix[row][col];
    let isLoadingCell = false;
    
    if(loadingCell && loadingCell?.row == row && loadingCell?.column == col)
      isLoadingCell = true;

    
    if(state === null) {    
      if(isLoadingCell) {
        return (<Image key={`cellimg_${row}_${col}`} src={loadingCellUri} style={{width:'90%',height:'90%', alignSelf: 'center'}}/>);
      } else {
        return (<></>);
      }
    } else {
      
    }

    if(isLoadingCell)
      setLoadingCell(null);

    return (<Image key={`cellimg_${row}_${col}`} src={state ? oImgUri : xImgUri} style={{width:'90%',height:'90%', alignSelf: 'center'}}/>);
  }

  async function onCellClick(row: number,col:number) {
    if(!isMyTurn || !game.state?.active) {
      return;
    }

    setLoadingCell({row, column: col});
    const updatedGame = await gamePlay(connection, wallet, game.address, {row,column:col})
        .catch(err=>{
          setLoadingCell(null);
          console.log('ttt: ', err.toString());
        });
      
      if(updatedGame) {
          setGame(updatedGame);
      } else {
        setLoadingCell(null);
      }

    /*      
    const val = matrix[row][col];
    if(val != null)
      return;

    let copy = [...matrix];
    copy[row][col] = playerTurn;
    setMatrix(copy);
    setPlayerTurn(playerTurn ? 0 : 1);
    */
  }

  function getRow(cols: number, row: number) {
    const elements : [JSX.Element] = [];
    for(let col=0;col<cols;col++)
      elements.push(
        <View
          key={`cell_${row}_${col}`}
          style={{border: isMyTurn ? '1px solid green' : '1px solid red', color: 'white', width: cellsize, height: cellsize, alignContent: 'center', alignItems: 'center', justifyContent:'center'}}
          onClick={()=>onCellClick(row,col)}
        >
          { 
            getCellImage(row,col)
          }
        </View>);
  
    return (<View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>{elements}</View>);
  }
  
  function getTable(rows: number, cols: number) {
    const elements = [];
    for(let row=0;row<rows; row++)
      elements.push(getRow(cols,row));
  
    return (<View style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>{elements}</View>);
  }


  return (
    <View>
      
      {message &&
        <Text style={{color:'red'}}>{message}</Text>
      }

      <View style={{display:'flex', flexDirection:'row'}}>
        <Text style={{marginLeft:10}}>Wager: {(game.wager/LAMPORTS_PER_SOL).toFixed(3).toString()}</Text>
        <Text style={{marginLeft:10}}>Players: {`${game.joinedPlayers}/${game.maxPlayers}`}</Text>
        <Text style={{marginLeft:10}}>Turn: {wallet.equals(game.players[playerTurn]) ? 'YOURS!' : `Player ${playerTurn +1}`}</Text>
        <Text style={{marginLeft:10}}>Timer: {Math.ceil(turnSlotsRemaining / 2).toString()}</Text>
      </View>
      
      { 
        getTable(game.rows,game.cols)
      }
    </View>
  );
}

