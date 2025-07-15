import Header from "@/components/common/header.tsx";
import { LoginPage, NotFoundPage } from "@/views/index.ts";
import "normalize.css";
import { Route, Routes } from "react-router";

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
