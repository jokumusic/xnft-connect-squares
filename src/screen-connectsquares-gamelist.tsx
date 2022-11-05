import React, { useState, useEffect, useContext } from "react";
import ReactXnft from "react-xnft";
import { Text, useNavigation, View, Image, Button, TextField,
  Table,TableRow,TableHead,
  BalancesTable, BalancesTableHead, BalancesTableRow, BalancesTableCell, BalancesTableContent,
  usePublicKey, useConnection, useSolanaConnection,
} from "react-xnft";
import * as xnft from "react-xnft";
import {useOpenGames, GameState, Game, createGame, getOpenGames, getGameAccounts, joinGame, } from "../utils/connect-squares";
import {tableRowStyle,tableCellStyle, buttonStyle, tableHeaderRowStyle} from "../styles";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { GlobalContext } from "./GlobalProvider";

const defaultNewGameSettings = {
  wager: 0.001,
  rows: 5,
  cols: 3,
  connect: 3,
  maxPlayers: 2
};

/*
ReactXnft.events.on("connect", () => {
  console.log('ttt: connected');
});
*/
const loadingImageUri = 'https://media.tenor.com/wpSo-8CrXqUAAAAj/loading-loading-forever.gif';

export function ScreenConnectSquaresGameList() {
  //const globalContext = useContext(GlobalContext);
  const nav = useNavigation();
  const connection = useSolanaConnection();
  const wallet = usePublicKey();
  //const [[openGames, isLoading]] = useState<[[Game], boolean]>([mockGames,false]);
  const [games, isLoading] = useOpenGames(connection, wallet, true);
  //const [games, setGames] = useState<[Game]>([]);
  const [createGameFormIsVisible, setCreateGameFormIsVisible] = useState(false);
  //const [newGameSettings, setNewGameSettings] = useState(defaultNewGameSettings);
  const [newGameWager, setNewGameWager] = useState<number>(defaultNewGameSettings.wager);
  const [newGameRows, setNewGameRows] = useState<number>(defaultNewGameSettings.rows);
  const [newGameCols, setNewGameCols] = useState<number>(defaultNewGameSettings.cols);
  const [newGameConnect, setNewGameConnect] = useState<number>(defaultNewGameSettings.connect);
  const [newGameMaxPlayers, setNewGameMaxPlayers] = useState<number>(defaultNewGameSettings.maxPlayers);  
  const [message, setMessage] = useState("");
  const [createGameMessage, setCreateGameMessage] = useState("");
  const [showLoadingImage, setShowLoadingImage] = useState(false);

  async function onConfigureNewGameClick() {
    console.log('configuring new game...');
    setCreateGameMessage("");
    setNewGameCols(defaultNewGameSettings.cols);
    setNewGameRows(defaultNewGameSettings.cols);
    setNewGameWager(defaultNewGameSettings.wager);
    setNewGameMaxPlayers(defaultNewGameSettings.maxPlayers);
    //setNewGameSettings(defaultNewGameSettings);
    setCreateGameFormIsVisible(true);
  }
  
  async function onCreateGameClick() {
    if(newGameRows < 2) {
      setCreateGameMessage("Rows must be greater than 2");
      return;
    }
    if(newGameCols < 2) {
      setCreateGameMessage("Columns must be greater than 2");
      return;
    }
    if(newGameMaxPlayers < 2) {
      setCreateGameMessage("Max Players must be greater than 2");
      return;
    }
    if(newGameWager < 0) {
      setCreateGameMessage("Wager must be greater than or equal to 0");
      return;
    }
    if(newGameConnect < 3) {
      setCreateGameMessage("Connections to win must be greater than 2");
      return;
    }
    if(newGameConnect > newGameRows) {
      setCreateGameMessage("Connections to win cannot be greater than grid rows");
      return;
    }
    if(newGameConnect > newGameCols) {
      setCreateGameMessage("Connections to win cannot be greater than grid columns");
      return;
    }

    setShowLoadingImage(true);
    const createdGame = await createGame(connection, wallet, newGameRows, newGameCols, newGameConnect, newGameMaxPlayers, 
      newGameMaxPlayers, Math.floor(newGameWager * LAMPORTS_PER_SOL))
      .catch(err=>setCreateGameMessage(err.toString()));

      if(createdGame) {
        setCreateGameMessage("");
        setCreateGameFormIsVisible(false);
        nav.push("screen-connectsquares-game", {game: createdGame});
      }

    setShowLoadingImage(false);
  }

  async function onJoinGameClick(game: Game) {
    setShowLoadingImage(true);
    setMessage("joining game...");

    /*if(!(game.state?.active || game.state?.waiting)) {
      console.log('ttt unable to enter game, because game state is ', game.state);
      return;
    }*/

    const isInGame = game.players.findIndex(p=>{
      return wallet.equals(p);
    });

    if(isInGame> -1) {     
      nav.push("screen-connectsquares-game", {game});
    } 
    else if(game.state?.waiting) {
      const joinedGame = await joinGame(connection, wallet, game.address)
        .catch(err=>setMessage(err.toString()));
      
      if(joinedGame)
        nav.push("screen-connectsquares-game", {game: joinedGame});
    } else {
        setMessage('unable to join game :(');
    }  
    
    setShowLoadingImage(false);
  }

  return (
    <View style={{display:'flex', flexDirection:'column'}}>
      
      <Text>{message}</Text>
      { showLoadingImage &&
        <Image src={loadingImageUri} style={{ alignSelf: 'center'}}/>
      }

      { !createGameFormIsVisible && !showLoadingImage &&
      <>
      <Button style={buttonStyle} onClick={()=>onConfigureNewGameClick()}>Create Game</Button>
      
      <BalancesTable>
      <BalancesTableHead title={"Available Games To Join"}>
      </BalancesTableHead>
      <BalancesTableContent>
        <BalancesTableRow style={tableHeaderRowStyle}>
          <BalancesTableCell title={"Wager"} />
          <BalancesTableCell title={"Layout"}/>
          <BalancesTableCell title={"Connect"}/>
          <BalancesTableCell title={"Status"}/>
        </BalancesTableRow>
      { games.map((game:Game, index)=>(
        <BalancesTableRow
          key={"game_" + index.toString()}
          style={[tableRowStyle]}
          onClick={()=>onJoinGameClick(game)}>
          <BalancesTableCell style={tableCellStyle} title={(game.wager/LAMPORTS_PER_SOL).toFixed(3).toString()}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.rows}x${game.cols}`}/>
          <BalancesTableCell style={tableCellStyle} title={game.connect.toString()}/>
          {game.state.waiting && wallet.equals(game.creator) &&
            <BalancesTableCell style={tableCellStyle} title={"waiting"}/>
          }
          {game.state.waiting && !wallet.equals(game.creator) &&
            <BalancesTableCell style={tableCellStyle} title={"open"}/>
          }
          {game.state.active &&
            <BalancesTableCell style={tableCellStyle} title={"live"}/>
          }
                {/* putting the following in BalanceTableCell.title doesn't work. It doesn't show the changed value after the first render
            game.state.waiting ? wallet.equals(game.creator) && 'waiting' || 'open'
            : game.state.active ? 'live' 
            : game.state.cancelled ? 'cancelled'
            : game.state.tie ? 'tie'
            : game.state.won ? 'finished'
        : 'unknown'*/}
        </BalancesTableRow>
        ))
      }        
      </BalancesTableContent>
      </BalancesTable>
      </>
      }               
     

      {createGameFormIsVisible &&
      <>
        <Text style={{color:'red'}}>{createGameMessage}</Text>
        <View>
          <Text>Wager:</Text>
          <TextField
            value={newGameWager.toString()}
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameWager(n)}}
            placeholder={"enter amount to wager"}/>
        </View>
        <View>
          <Text>Rows:</Text>
          <TextField
            value={newGameRows?.toString()}
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameRows(n)}}
            placeholder={"enter number of grid rows"}/>
        </View>
        <View>
          <Text>Columns:</Text>
          <TextField
            value={newGameCols?.toString()}
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameCols(n)}}
            placeholder={"enter number of grid columns"}/>
        </View>
        
        <View>
          <Text>Connections To Win:</Text>
          <TextField
            value={newGameConnect.toString()}          
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameConnect(n)}}
            placeholder={"number of connections to win"}/>
        </View>
      
        <View style={{display:'flex', flexDirection:'row', alignContent:'center'}}>
          { showLoadingImage ||
          <>
            <Button style={buttonStyle} onClick={()=>onCreateGameClick()}>Submit</Button>
            <Button style={buttonStyle} onClick={()=>setCreateGameFormIsVisible(false)}>Cancel</Button>
          </>
          }
        </View>
      </>
      }

    </View>
  );
}

