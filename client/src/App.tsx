import { Header } from "@client/components/common/index.ts";
import "normalize.css";
import { Provider as ReduxProvider } from "react-redux";
import { Route, Routes } from "react-router";
import { PAGE_ROUTES } from "./lib/constants.ts";
import { SocketProvider } from "./providers/socket-provider.tsx";
import reduxStore from "./redux/store.ts";
import { ChatroomsPage, LoginPage, NotFoundPage } from "./views/index.ts";

const App = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <SocketProvider socket={null}>
        <Header />

        <Routes>
          <Route
            index
            element={<LoginPage />}
          />

          <Route
            path={PAGE_ROUTES.CHATROOMS}
            element={<ChatroomsPage />}
          />

          {/* Other Routes... */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </SocketProvider>
    </ReduxProvider>
  );
};

export default App;
