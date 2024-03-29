import React, { useState, useEffect, useContext } from "react";
import ReactXnft from "react-xnft";
import { Text, useNavigation, View, Image, Button, TextField,
  BalancesTable, BalancesTableHead, BalancesTableRow, BalancesTableCell, BalancesTableContent,
  usePublicKey, useSolanaConnection,
} from "react-xnft";
import {useOpenGames, GameState, Game, createGame, getOpenGames, getGameAccounts, joinGame, } from "../utils/connect-squares";
import {tableRowStyle,tableCellStyle, buttonStyle, tableHeaderRowStyle, donateButtonStyle} from "../styles";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {loadingImgUri} from "../assets";

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


export function ScreenConnectSquaresGameList() {
  //const globalContext = useContext(GlobalContext);
  const nav = useNavigation();
  const connection = useSolanaConnection();
  const wallet = usePublicKey();
  //const [[openGames, isLoading]] = useState<[[Game], boolean]>([mockGames,false]);
  const [games, isLoading] = useOpenGames(connection, wallet, true);
  //const [games, setGames] = useState<[Game]>([]);
  const [createGameFormIsVisible, setCreateGameFormIsVisible] = useState(false);
  const [newGameSettings, setNewGameSettings] = useState(defaultNewGameSettings);
  const [message, setMessage] = useState("");
  const [createGameMessage, setCreateGameMessage] = useState("");
  const [showLoadingImage, setShowLoadingImage] = useState(false);

  useEffect(()=>{
    nav.setNavButtonRight(()=>(
      <Button
       style={donateButtonStyle}
       onClick={()=>{ nav.push("screen-donate")}}
      >
        Donate!
      </Button>
    ));
  },[]);

  async function onConfigureNewGameClick() {
    console.log('configuring new game...');
    setCreateGameMessage("");
    setNewGameSettings(defaultNewGameSettings);
    setCreateGameFormIsVisible(true);
  }
  
  async function onCreateGameClick() {
    const wager = Number(newGameSettings.wager);
    if(Number.isNaN(wager)){
      setCreateGameMessage("Wager is not a valid number");
      return;
    }
    if(wager < 0) {
      setCreateGameMessage("Wager must be greater than or equal to 0");
      return;
    }    
    if(newGameSettings.rows < 3) {
      setCreateGameMessage("Rows must be greater than 2");
      return;
    }
    if(newGameSettings.cols < 3) {
      setCreateGameMessage("Columns must be greater than 2");
      return;
    }
    if(newGameSettings.maxPlayers < 2) {
      setCreateGameMessage("Max Players must be greater than 2");
      return;
    }   
    if(newGameSettings.connect < 3) {
      setCreateGameMessage("Connections to win must be greater than 2");
      return;
    }
    if(newGameSettings.connect > newGameSettings.rows) {
      setCreateGameMessage("Connections to win cannot be greater than grid rows");
      return;
    }
    if(newGameSettings.connect > newGameSettings.cols) {
      setCreateGameMessage("Connections to win cannot be greater than grid columns");
      return;
    }

    setShowLoadingImage(true);
    const createdGame = await createGame(connection, wallet, newGameSettings.rows, newGameSettings.cols, newGameSettings.connect, newGameSettings.maxPlayers, 
      newGameSettings.maxPlayers, Math.floor(wager * LAMPORTS_PER_SOL))
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
        <Image src={loadingImgUri} style={{ alignSelf: 'center'}}/>
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
          <BalancesTableCell style={tableCellStyle} title={(()=>
            game.state.waiting ? wallet.equals(game.creator) && 'waiting' || 'open'
            : game.state.active ? 'live' 
            : game.state.cancelled ? 'cancelled'
            : game.state.tie ? 'tie'
            : game.state.won ? 'finished'
            : 'unknown')()
          }/>
        </BalancesTableRow>
        ))
      }        
      </BalancesTableContent>
      </BalancesTable>
      </>
      }               
     

      {createGameFormIsVisible &&
      <View style={{marginLeft: 5, marginRight: 5}}>
        <Text style={{color:'red'}}>{createGameMessage}</Text>
        <View>
          <Text>Wager:</Text>
          <TextField
            value={newGameSettings.wager.toString()}
            onChange={(e) =>{setNewGameSettings({...newGameSettings, wager: e.target.value})}}
            placeholder={"enter amount to wager"}/>
        </View>
        <View>
          <Text>Rows:</Text>
          <TextField
            value={newGameSettings.rows.toString()}
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameSettings({...newGameSettings, rows: n})}}
            placeholder={"enter number of grid rows"}/>
        </View>
        <View>
          <Text>Columns:</Text>
          <TextField
            value={newGameSettings.cols.toString()}
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameSettings({...newGameSettings, cols: n})}}
            placeholder={"enter number of grid columns"}/>
        </View>
        
        <View>
          <Text>Connections To Win:</Text>
          <TextField
            value={newGameSettings.connect.toString()}          
            onChange={(e) =>{const n = Number(e.target.value); Number.isNaN(n) || setNewGameSettings({...newGameSettings, connect: n})}}
            placeholder={"number of connections to win"}/>
        </View>
      
        <View style={{display:'flex', flexDirection:'row', alignContent:'center', alignSelf:'center', justifyContent: 'center'}}>
          { showLoadingImage ||
          <>
            <Button style={buttonStyle} onClick={()=>onCreateGameClick()}>Submit</Button>
            <Button style={buttonStyle} onClick={()=>setCreateGameFormIsVisible(false)}>Cancel</Button>
          </>
          }
        </View>
      </View>
      }

    </View>
  );
}

