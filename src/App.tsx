import React, { useContext } from "react";
import { Button, Stack, useNavigation, View } from "react-xnft";
import { GlobalContext } from "./GlobalProvider";
import { ScreenConnectSquaresGame } from "./screen-connectsquares-game";
import { ScreenConnectSquaresGameList } from "./screen-connectsquares-gamelist";
import { ScreenDonate } from "./screen-donate";


export function App() {
    const globalContext = useContext(GlobalContext);

    return (
    <View style={{ background: "black", height: "100%" }}>
      <Stack.Navigator
        initialRoute={{ name: "screen-connectsquares-gamelist" }}
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
                title: `Balance: ${globalContext.walletBalance.toFixed(3)}`,
              };
            case "screen-connectsquares-gamelist":
              return {
                title: `Balance: ${globalContext.walletBalance.toFixed(3)}`
              };
            case "screen-donate":
              return {
                title: `Balance: ${globalContext.walletBalance.toFixed(3)}`
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
        <Stack.Screen
          name={"screen-donate"}
          component={(props: any) => <ScreenDonate {...props} />}
        />

      </Stack.Navigator>
    </View>
  );
}
