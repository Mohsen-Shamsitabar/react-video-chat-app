import { Header } from "@client/components/common/index.ts";
import "normalize.css";
import { Provider as ReduxProvider } from "react-redux";
import { Route, Routes } from "react-router";
import reduxStore from "./redux/store.ts";
import { LoginPage, NotFoundPage } from "./views/index.ts";

const App = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <Header />

      <Routes>
        <Route
          index
          element={<LoginPage />}
        />

        {/* Other Routes... */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </ReduxProvider>
  );
};

export default App;
