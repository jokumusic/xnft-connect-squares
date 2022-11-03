import React, { useState, useEffect } from "react";
import ReactXnft from "react-xnft";
import { Text, useNavigation, View, Image, Button, TextField,
  Table,TableRow,TableHead,
  BalancesTable, BalancesTableHead, BalancesTableRow, BalancesTableCell, BalancesTableContent,
  usePublicKey, useConnection, useSolanaConnection,
} from "react-xnft";
import * as xnft from "react-xnft";
import {useOpenGames, GameState, Game, createGame, getOpenGames, getGameAccounts, joinGame, } from "../utils/tic-tac-toe";
import {tableRowStyle,tableCellStyle, buttonStyle} from "../styles";

const LAMPORTS_PER_SOL = 1000000000;

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

export function ScreenTicTacToeGameList() {
  const nav = useNavigation();
  const connection = useSolanaConnection();
  const wallet = usePublicKey();
  //const [[openGames, isLoading]] = useState<[[Game], boolean]>([mockGames,false]);
  const [games, isLoading] = useOpenGames(connection, wallet, true);
  //const [games, setGames] = useState<[Game]>([]);
  const [createGameFormIsVisible, setCreateGameFormIsVisible] = useState(false);
  //const [newGameSettings, setNewGameSettings] = useState(defaultNewGameSettings);
  const [newGameWager, setNewGameWager] = useState(defaultNewGameSettings.wager);
  const [newGameRows, setNewGameRows] = useState(defaultNewGameSettings.rows);
  const [newGameCols, setNewGameCols] = useState(defaultNewGameSettings.cols);
  const [newGameConnect, setNewGameConnect] = useState(defaultNewGameSettings.connect);
  const [newGameMaxPlayers, setNewGameMaxPlayers] = useState(defaultNewGameSettings.maxPlayers);  
  const [debugText, setDebugText] = useState("");
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
        nav.push("screen-tictactoe-game", {game: createdGame});
      }

    setShowLoadingImage(false);
  }

  async function onJoinGameClick(game: Game) {
    console.log('ttt joining game:', game.address.toBase58());
    setShowLoadingImage(true);

    /*if(!(game.state?.active || game.state?.waiting)) {
      console.log('ttt unable to enter game, because game state is ', game.state);
      return;
    }*/

    console.log('ttt players: ', game.players);
    const isInGame = game.players.findIndex(p=>{
      console.log('ttt p: ', p.toBase58());
      return wallet.equals(p);
    });

    console.log('ttt isInGame: ', isInGame);

    if(isInGame> -1) {
      console.log('ttt already an active player. entering game...');      
      nav.push("screen-tictactoe-game", {game});
    } 
    else if(game.state?.waiting) {
      const joinedGame = await joinGame(connection, wallet, game.address)
        .catch(err=>console.log('ttt: ', err.toString()));
      
      if(joinedGame)
          nav.push("screen-tictactoe-game", {game: joinedGame});
    } else {
      console.log('ttt unable to join game');
    }  
    
    setShowLoadingImage(false);
  }

  return (
    <View style={{display:'flex', flexDirection:'column'}}>
      <Text>{debugText}</Text>
      
      { !createGameFormIsVisible &&
      <>
      <Button style={buttonStyle} onClick={()=>onConfigureNewGameClick()}>Create Game</Button>
      
      <BalancesTable>
      <BalancesTableHead title={"Available Games To Join"}>
        <BalancesTableRow style={tableRowStyle}>
          <BalancesTableCell title={"Wager"}/>
          <BalancesTableCell title={"Layout"}/>
          <BalancesTableCell title={"Connect"}/>
          <BalancesTableCell title={"Created"}/>
        </BalancesTableRow>
      </BalancesTableHead>
      <BalancesTableContent>
      { games.map((game:Game, index)=>(
        <BalancesTableRow
          key={"game_" + index.toString()}
          style={[tableRowStyle]}
          onClick={()=>onJoinGameClick(game)}>
          <BalancesTableCell style={tableCellStyle} title={(game.wager/LAMPORTS_PER_SOL).toFixed(3).toString()}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.rows}x${game.cols}`}/>
          <BalancesTableCell style={tableCellStyle} title={game.connect.toString()}/>
          <BalancesTableCell style={tableCellStyle} title={new Date(game.initTimestamp * 1000).toLocaleString()}/>
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
            onChange={(e) => setNewGameWager(e.target.value)}
            placeholder={"enter amount to wager"}/>
        </View>
        <View>
          <Text>Rows:</Text>
          <TextField
            value={newGameRows?.toString()}
            onChange={(e) => setNewGameRows(e.target.value)}            
            placeholder={"enter number of grid rows"}/>
        </View>
        <View>
          <Text>Columns:</Text>
          <TextField
            value={newGameCols?.toString()}
            onChange={(e) => setNewGameCols(e.target.value)}            
            placeholder={"enter number of grid columns"}/>
        </View>
        
        <View>
          <Text>Connections To Win:</Text>
          <TextField
            value={newGameConnect.toString()}            
            onChange={(e) => setNewGameConnect(e.target.value)}            
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

      { showLoadingImage &&
        <Image src={loadingImageUri} style={{position: 'absolute', alignSelf: 'center',  bottom: '-5%'}}/>
      }
    
    </View>
  );
}

