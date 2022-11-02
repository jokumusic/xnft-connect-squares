import React, { useState } from "react";
import { Text, useNavigation, View, Image } from "react-xnft";
import { gameTileStyle } from "../styles";


export function ScreenHome() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  return (
    <View>
      <View
        style={gameTileStyle}
        onClick={() => {
          nav.push("screen-tictactoe-gamelist", {});
        }}
      >
       Grid Wars
       <Image src={"https://i.stack.imgur.com/eLJZO.gif"} style={{width:100,height:100}}/>
      </View>
    </View>
  );
}
