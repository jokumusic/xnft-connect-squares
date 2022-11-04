import React from "react";
import { Stack, View } from "react-xnft";
import { ScreenConnectSquaresGame } from "./screen-connectsquares-game";
import { ScreenConnectSquaresGameList } from "./screen-connectsquares-gamelist";


export function App() {
  return (
    <View style={{ background: "black", height: "100%" }}>
      <Stack.Navigator
        initialRoute={{ name: "screen-connectsquares-gamelist" }}
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
        options={({ route }) => {
          switch (route.name) {
            case "screen-connectsquares-game":
              return {
                title: "Live Game",
              };
            case "screen-connectsquares-gamelist":
              return {
                title: "Open Games",
              };
            default:
              throw new Error("unknown route");
          }
        }}
      >
        <Stack.Screen
          name={"screen-connectsquares-game"}
          component={(props: any) => <ScreenConnectSquaresGame {...props} />}
        />
        <Stack.Screen
          name={"screen-connectsquares-gamelist"}
          component={(props: any) => <ScreenConnectSquaresGameList {...props} />}
        />

      </Stack.Navigator>
    </View>
  );
}
