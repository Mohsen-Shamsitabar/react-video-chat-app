import * as React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { SocketProvider } from "./providers/socket-provider.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import reduxStore from "./redux/store.ts";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element found.");

const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ReduxProvider store={reduxStore}>
          <SocketProvider socket={null}>
            <App />
          </SocketProvider>
        </ReduxProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
