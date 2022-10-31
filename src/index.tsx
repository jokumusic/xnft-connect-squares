import ReactXnft, { AnchorDom } from "react-xnft";
import { App } from "./App";
import {GamePouchProvider} from "../components/GamePouchProvider";


ReactXnft.render(
  <AnchorDom>
    <GamePouchProvider>
      <App />
    </GamePouchProvider>
  </AnchorDom>
);
