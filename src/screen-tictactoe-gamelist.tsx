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

const mockGames : [Game] =[
{wager: 0.001, rows: 3, cols: 3, joinedPlayers: 1, initTimestamp: 1111111222, maxPlayers: 2 },
{wager: 0.01, rows: 3, cols: 3, joinedPlayers: 1, initTimestamp: 1111111111, maxPlayers: 2 },
];

const defaultNewGameSettings = {
  wager: 0.001,
  rows: 3,
  cols: 3,
  maxPlayers: 2
};

ReactXnft.events.on("connect", () => {
  console.log('ttt: connected');
});


export function ScreenTicTacToeGameList() {
  const nav = useNavigation();
  const connection = useSolanaConnection();
  const wallet = usePublicKey();
  //const [[openGames, isLoading]] = useState<[[Game], boolean]>([mockGames,false]);
  const [openGames, isLoading] = useOpenGames(connection, wallet, true);
  //const [openGames, setOpenGames] = useState<[Game]>([]);
  const [createGameFormIsVisible, setCreateGameFormIsVisible] = useState(false);
  const [newGameSettings, setNewGameSettings] = useState(defaultNewGameSettings);
  const [debugText, setDebugText] = useState("");
/*
  useEffect(()=>{
    (async ()=>{
      const games = await getOpenGames(connection, wallet)
        .catch(err=>setDebugText(debugText + err.toString() + "\n"));
      if(games)
        setOpenGames(games);
    })();

  },[]);

  async function viewGames() {
    console.log('ttt: ' + JSON.stringify(window?.xnft));
    
    const games = await getGameAccounts()
      .catch(err=>{
        console.log('ttt: ' + err.toString());
        setDebugText(debugText + err.toString() + "\n")
      });
  
    console.log('ttt games: ', games);
    if(games)
      setOpenGames(games);
    
  }
*/
  async function onConfigureNewGameClick() {
    console.log('configuring new game...');
    setNewGameSettings(defaultNewGameSettings);
    setCreateGameFormIsVisible(true);
  }
  
  async function onCreateGameClick() {
    const createdGame = await createGame(connection, wallet, newGameSettings.rows, newGameSettings.cols, newGameSettings.maxPlayers, 
      newGameSettings.maxPlayers, newGameSettings.wager)
      .catch(err=>setDebugText(debugText + err.toString() + "\n"));
    
    setCreateGameFormIsVisible(false);
  }

  async function onJoinGameClick(game: Game) {
    console.log('ttt joining game:', game.address.toBase58());

    if(!(game.state?.active || game.state?.waiting)) {
      console.log('ttt unable to enter game, because game state is ', game.state);
      return;
    }

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
    
  }

  return (
    <View>
      <Text>{debugText}</Text>
      {/*<Button style={buttonStyle} onClick={()=>viewGames()}>View Games</Button>*/}
      { !createGameFormIsVisible &&
      <>
      <Button style={buttonStyle} onClick={()=>onConfigureNewGameClick()}>Create Game</Button>
      
      <BalancesTable>
      <BalancesTableHead title={"Available Games To Join"}>
        <BalancesTableRow style={tableRowStyle}>
          <BalancesTableCell title={""}/>
          <BalancesTableCell title={"Wager"} subtitle={"wager"}/>
          <BalancesTableCell title={"Layout"}/>
          <BalancesTableCell title={"Players"}/>
          <BalancesTableCell title={"Created"}/>
        </BalancesTableRow>
      </BalancesTableHead>
      <BalancesTableContent>
      { openGames.map((game:Game)=>(
        <BalancesTableRow 
          style={[tableRowStyle]}
          onClick={()=>onJoinGameClick(game)}>
          <BalancesTableCell style={tableCellStyle} title={"join"} />
          <BalancesTableCell style={tableCellStyle} title={game.wager.toString()}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.rows}x${game.cols}`}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.joinedPlayers}/${game.maxPlayers}`}/>
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
        <View>
          <Text>Wager:</Text>
          <TextField
            value={newGameSettings?.wager?.toString()}
            onChange={(e) => setNewGameSettings({...newGameSettings, wager: e.target.value})}            
            placeholder={"enter amount to wager"}/>
        </View>
        <View>
          <Text>Rows:</Text>
          <TextField
            value={newGameSettings?.rows?.toString()}
            onChange={(e) => setNewGameSettings({...newGameSettings, rows: e.target.value})}            
            placeholder={"enter number of grid rows"}/>
        </View>
        <View>
          <Text>Columns:</Text>
          <TextField
            value={newGameSettings?.cols?.toString()}
            onChange={(e) => setNewGameSettings({...newGameSettings, cols: e.target.value})}            
            placeholder={"enter number of grid cols"}/>
        </View>
        <View>
          <Text>Players:</Text>
          <TextField
            value={newGameSettings?.maxPlayers?.toString()}
            onChange={(e) => setNewGameSettings({...newGameSettings, maxPlayers: e.target.value})}            
            placeholder={"enter number of players"}/>
        </View>
        <View style={{display:'flex', flexDirection:'row', alignContent:'center'}}>
          <Button style={buttonStyle} onClick={()=>onCreateGameClick()}>Submit</Button>
          <Button style={buttonStyle} onClick={()=>setCreateGameFormIsVisible(false)}>Cancel</Button>
        </View>
      </>
      }
    
    </View>
  );
}

