import React, { useContext } from "react";
import { Stack, View } from "react-xnft";
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
        titleStyle={{display: 'flex', justifyContent: 'start', fontSize: 18}}
        options={
          ({ route }) => {
          switch (route.name) {
            case "screen-connectsquares-game":
              return {
                title: `${globalContext.walletBalance.toFixed(3)} Balance`,
              };
            case "screen-connectsquares-gamelist":
              return {
                title: `${globalContext.walletBalance.toFixed(3)} Balance`,
              };
            case "screen-donate":
              return {
                title: `${globalContext.walletBalance.toFixed(3)} Balance`
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
