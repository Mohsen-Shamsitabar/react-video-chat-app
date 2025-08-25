import "normalize.css";
import { Route, Routes } from "react-router";
import { Header } from "./components/common/index.ts";
import AuthLayout from "./layouts/auth-layout.tsx";
import { CHATROOM_PARAM_NAME, PAGE_ROUTES } from "./lib/constants.ts";
import ChatroomPage from "./pages/chatroom/chatroom-page.tsx";
import DashboardPage from "./pages/dashboard/dashboard-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import NotFoundPage from "./pages/not-found-page.tsx";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path={PAGE_ROUTES.HOMEPAGE}
          element={<LoginPage />}
        />

        <Route element={<AuthLayout />}>
          <Route
            path={PAGE_ROUTES.DASHBOARD}
            element={<DashboardPage />}
          />

          <Route
            path={`${PAGE_ROUTES.CHATROOM}/:${CHATROOM_PARAM_NAME}`}
            element={<ChatroomPage />}
          />
        </Route>

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
