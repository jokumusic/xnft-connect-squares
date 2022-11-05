import React, { useContext } from "react";
import { Button, Stack, View } from "react-xnft";
import { GlobalContext } from "./GlobalProvider";
import { ScreenConnectSquaresGame } from "./screen-connectsquares-game";
import { ScreenConnectSquaresGameList } from "./screen-connectsquares-gamelist";


export function App() {
    const globalContext = useContext(GlobalContext);

    return (
    <View style={{ background: "black", height: "100%" }}>
      <Stack.Navigator
        initialRoute={{ name: "screen-connectsquares-gamelist" }}
        navButtonRight={"wallet balance"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: 'center',
        }}
        options={
          ({ route }) => {
          switch (route.name) {
            case "screen-connectsquares-game":
              return {
                title: `Balance: ${globalContext.walletBalance.toFixed(3)} SOL`,
              };
            case "screen-connectsquares-gamelist":
              return {
                title: `Balance: ${globalContext.walletBalance.toFixed(3)} SOL`
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
          options={{title: 'scren option'}}
        />

      </Stack.Navigator>
    </View>
  );
}
