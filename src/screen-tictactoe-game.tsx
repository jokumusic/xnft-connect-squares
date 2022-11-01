import React, { useState, useEffect } from "react";
import { Text, useNavigation, View, Image} from "react-xnft";


const viewHeight = 500;
const xImgUri = "https://media.istockphoto.com/vectors/dirty-grunge-hand-drawn-with-brush-strokes-cross-x-vector-isolated-vector-id1201202836?k=20&m=1201202836&s=612x612&w=0&h=0ib7KQaJXonfKN0-tGNaMUIw2Hre9sJjd4hTsc3QwBc=";
const oImgUri = "https://us.123rf.com/450wm/rondale/rondale1701/rondale170100555/69948558-fire-letter-o-of-burning-blue-flame-flaming-burn-font-or-bonfire-alphabet-text-with-sizzling-smoke-a.jpg?ver=6";

const mockGame = {rows:5,cols:5};

export function ScreenTicTacToeGame() {
  const nav = useNavigation();
  const [game] = useState(nav.activeRoute.props?.game);
  const [cellsize] = useState(1/game.rows * viewHeight);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [matrix, setMatrix] = useState(Array.from({length: game.rows},()=> Array.from({length: game.cols}, () => null)));


  function getCellImage(row,col) {
    const state = matrix[row][col];
    if(state === null)
      return (<></>);

    return (<Image src={state ? oImgUri : xImgUri} style={{width:'90%',height:'90%', alignSelf: 'center'}}/>);
  }

  function onCellClick(row,col) {
    const val = matrix[row][col];
    if(val != null)
      return;

    let copy = [...matrix];
    copy[row][col] = playerTurn;
    setMatrix(copy);
    setPlayerTurn(playerTurn ? 0 : 1);
  }

  function getRow(cols: number, row: number) {
    const elements: Element[] = [];
    for(let col=0;col<cols;col++)
      elements.push(
        <View 
          style={{border: '1px solid red', color: 'white', width: cellsize, height: cellsize, alignContent: 'center', alignItems: 'center', justifyContent:'center'}}
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

  async function refreshGrid() {

  }

  return (
    <View>
      { 
          getTable(game.rows,game.cols)
      }
    </View>
  );
}

