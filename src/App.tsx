import React from "react";
import { Stack, View } from "react-xnft";
import { ScreenTicTacToeGame } from "./screen-tictactoe-game";
import { ScreenTicTacToeGameList } from "./screen-tictactoe-gamelist";


export function App() {
  return (
    <View style={{ background: "black", height: "100%" }}>
      <Stack.Navigator
        initialRoute={{ name: "screen-tictactoe-gamelist" }}
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
        options={({ route }) => {
          switch (route.name) {
            case "screen-tictactoe-game":
              return {
                title: "Live Game",
              };
            case "screen-tictactoe-gamelist":
              return {
                title: "Open Games",
              };
            default:
              throw new Error("unknown route");
          }
        }}
      >
        <Stack.Screen
          name={"screen-tictactoe-game"}
          component={(props: any) => <ScreenTicTacToeGame {...props} />}
        />
        <Stack.Screen
          name={"screen-tictactoe-gamelist"}
          component={(props: any) => <ScreenTicTacToeGameList {...props} />}
        />

      </Stack.Navigator>
    </View>
  );
}
