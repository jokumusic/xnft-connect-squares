import React, { useState, useEffect } from "react";
import { Text, useNavigation, View, Image, Button, TextField,
  Table,TableRow,TableHead,
  BalancesTable, BalancesTableHead, BalancesTableRow, BalancesTableCell, BalancesTableContent,
} from "react-xnft";
import * as xnft from "react-xnft";
import {useOpenGames, GameState, Game, createGame, } from "../utils/tic-tac-toe";
import {tableRowStyle,tableCellStyle, buttonStyle} from "../styles";

const mockGames : [Game] =[
{wager: 0.001, rows: 3, cols: 3, joined_players: 1, init_timestamp: 1111111222, max_players: 2 },
{wager: 0.01, rows: 3, cols: 3, joined_players: 1, init_timestamp: 1111111111, max_players: 2 },
];

const defaultNewGameSettings = {
  wager: 0.001,
  rows: 3,
  cols: 3,
  maxPlayers: 2
};

export function ScreenTicTacToeGameList() {
  const nav = useNavigation();
  const [[openGames, isLoading]] = useState<[[Game], boolean]>([mockGames,false]);//useOpenGames(true);
  const [createGameFormIsVisible, setCreateGameFormIsVisible] = useState(false);
  const [newGameSettings, setNewGameSettings] = useState(defaultNewGameSettings);

  async function onConfigureNewGameClick() {
    setNewGameSettings(defaultNewGameSettings);
    setCreateGameFormIsVisible(true);
  }
  
  async function onCreateGameClick() {
    //const createdGame = await createGame(newGameSettings.rows, newGameSettings.cols, newGameSettings.maxPlayers, 
    //  newGameSettings.maxPlayers, newGameSettings.wager);
    
    setCreateGameFormIsVisible(false);
  }

  return (
    <View>
      { !createGameFormIsVisible &&
      <>
      <Button style={buttonStyle} onClick={()=>onConfigureNewGameClick()}>Create Game</Button>
      
      <BalancesTable>
      <BalancesTableHead title={"Available Games To Join"}>
        <BalancesTableRow style={tableRowStyle}>
          <BalancesTableCell title={"Wager"} subtitle={"wager"}/>
          <BalancesTableCell title={"Layout"}/>
          <BalancesTableCell title={"Players"}/>
          <BalancesTableCell title={"Created"}/>
        </BalancesTableRow>
      </BalancesTableHead>
      <BalancesTableContent>
      { openGames.map((game:Game)=>(
        <BalancesTableRow style={tableRowStyle}>
          <BalancesTableCell style={tableCellStyle} title={game.wager.toString()}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.rows}x${game.cols}`}/>
          <BalancesTableCell style={tableCellStyle} title={`${game.joined_players}/${game.max_players}`}/>
          <BalancesTableCell style={tableCellStyle} title={new Date(game.init_timestamp * 1000).toLocaleString()}/>
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

