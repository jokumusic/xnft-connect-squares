import React, { useState } from "react";
import { Text, useNavigation, View } from "react-xnft";
import { buttonStyle } from "../styles";


export function ScreenHome() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  return (
    <View>
      <View
        style={buttonStyle}
        onClick={() => {
          nav.push("screen-tictactoe-gamelist", {});
        }}
      >
       Tic-Tac-Toe
      </View>

      <View
        style={buttonStyle}
        onClick={() => {
          nav.push("screen-tictactoe-game", {});
        }}
      >
        Demo
      </View>
    </View>
  );
}
