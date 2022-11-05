import ReactXnft, { AnchorDom } from "react-xnft";
import { App } from "./App";
import { GlobalProvider } from "./GlobalProvider";


ReactXnft.render(
  <AnchorDom>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </AnchorDom>
);
