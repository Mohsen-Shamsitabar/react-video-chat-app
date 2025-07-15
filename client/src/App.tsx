import { Header } from "@client/components/common/index.ts";
import "normalize.css";
import { Route, Routes } from "react-router";
import { LoginPage, NotFoundPage } from "./views/index.ts";

const App = () => {
  return (
    <>
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
    </>
  );
};

export default App;
