import * as React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { ActiveUserProvider } from "./providers/active-user-provider.tsx";
import { PeerProvider } from "./providers/peer-provider.tsx";
import { SocketProvider } from "./providers/socket-provider.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No root element found.");

const reactRoot = ReactDOM.createRoot(rootElement);

reactRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ActiveUserProvider username={null}>
          <PeerProvider peer={null}>
            <SocketProvider socket={null}>
              <App />
            </SocketProvider>
          </PeerProvider>
        </ActiveUserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
