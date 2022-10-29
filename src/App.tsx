import React from "react";
import { Image, Stack, View } from "react-xnft";
import { ScreenHome } from "./screen-home";
import { ScreenTicTacToeGame } from "./screen-tictactoe-game";
import { ScreenTicTacToeGameList } from "./screen-tictactoe-gamelist";


export function App() {
  return (
    <View style={{ background: "black", height: "100%" }}>
      <Stack.Navigator
        initialRoute={{ name: "screen-home" }}
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
        options={({ route }) => {
          switch (route.name) {
            case "screen-home":
              return {
                title: "Home",
              };
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
          name={"screen-home"}
          component={(props: any) => <ScreenHome {...props} />}
        />
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
