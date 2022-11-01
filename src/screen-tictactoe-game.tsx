import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState, useEffect } from "react";
import { Text, useNavigation, View, Image, useConnection, usePublicKey} from "react-xnft";
import { Game, gamePlay, getGameByAddress, subscribeToGame, useGame } from "../utils/tic-tac-toe";


const viewHeight = 500;
const xImgUri = "https://media.istockphoto.com/vectors/dirty-grunge-hand-drawn-with-brush-strokes-cross-x-vector-isolated-vector-id1201202836?k=20&m=1201202836&s=612x612&w=0&h=0ib7KQaJXonfKN0-tGNaMUIw2Hre9sJjd4hTsc3QwBc=";
const oImgUri = "https://us.123rf.com/450wm/rondale/rondale1701/rondale170100555/69948558-fire-letter-o-of-burning-blue-flame-flaming-burn-font-or-bonfire-alphabet-text-with-sizzling-smoke-a.jpg?ver=6";

const mockGame = {rows:5,cols:5};

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

  useEffect(()=>{
    setIsMyTurn(wallet.equals(game.players[game.currentPlayerIndex]));
    setMatrix(game.board);

    if(game.state?.won) {
      if(game.state.won?.winner?.equals(wallet)){
        setMessage("YOU WON! Exiting game...");
      }
      else {
        setMessage("YOU LOST! Exiting game...");
      }

      const exitTimer = setInterval(()=>{nav.pop(); clearInterval(exitTimer);}, 5000);
      return ()=>{
        clearInterval(exitTimer);
      }
    }

  },[game]);

  function getCellImage(row,col) {
    const state = matrix[row][col];
    if(state === null)
      return (<></>);

    return (<Image key={`cellimg_${row}_${col}`} src={state ? oImgUri : xImgUri} style={{width:'90%',height:'90%', alignSelf: 'center'}}/>);
  }

  async function onCellClick(row: number,col:number) {
    const updatedGame = await gamePlay(connection, wallet, game.address, {row,column:col})
        .catch(err=>console.log('ttt: ', err.toString()));
      
      if(updatedGame) {
          setGame(updatedGame);
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
        <Text style={{marginLeft:10}}>Wager: {Math.floor(game.wager/LAMPORTS_PER_SOL).toString()}</Text>
        <Text style={{marginLeft:10}}>Players: {`${game.joinedPlayers}/${game.maxPlayers}`}</Text>
        <Text style={{marginLeft:10}}>Turn: {wallet.equals(game.players[game.currentPlayerIndex]) ? 'YOURS!' : `Player ${game.currentPlayerIndex +1}`}</Text>
      </View>

      { 
        getTable(game.rows,game.cols)
      }
    </View>
  );
}

