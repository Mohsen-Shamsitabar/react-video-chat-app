import "normalize.css";
import { Route, Routes } from "react-router";
import { Header, NotFoundPage } from "./components/common/index.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import AuthLayout from "./layouts/auth-layout.tsx";
import { CHATROOM_PARAM_NAME, PAGE_ROUTES } from "./lib/constants.ts";
import ChatroomPage from "./pages/chatroom/chatroom-page.tsx";
import DashboardPage from "./pages/dashboard/dashboard-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import TestComponent from "./TestComponent.tsx";

const App = () => {
  return (
    <div className="app-override">
      <Header />

      <Toaster
        position="top-center"
        duration={1500}
      />

      <Routes>
        <Route
          path={PAGE_ROUTES.HOMEPAGE}
          element={<LoginPage />}
        />

        <Route
          path="test"
          element={<TestComponent />}
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
    </div>
  );
};

export default App;
