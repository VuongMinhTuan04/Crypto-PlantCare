import { jwtDecode } from "jwt-decode";
import { Fragment, useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import VideoBackground from "./components/backgroundvideo";
import LayoutWebsite from "./DefaultLayouts/LayoutWebsite";
import ProtectedRoute from "./routes/protectedroutes";
import { privateRoutes, publicRoutes } from "./routes/routes";

const App = () => {
  useEffect(() => {
    checkTokenExpiration();
    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("tokenGoogle");

    try {
      const parsedToken = JSON.parse(token);
      const decodedToken = jwtDecode(parsedToken);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        localStorage.removeItem("tokenGoogle");
        return <Navigate to="/game-login" replace />;
      }
    } catch (error) {
      localStorage.removeItem("tokenGoogle");
      return <Navigate to="/game-login" replace />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = route.layout || LayoutWebsite;
            Layout = Layout === null ? Fragment : Layout;
            return (
              <Route
                key={`public-${index}`}
                path={route.path}
                element={
                  <VideoBackground>
                    <Layout>
                      <Page />
                    </Layout>
                  </VideoBackground>
                }
              />
            );
          })}

          {/* Private Routes */}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = route.layout || LayoutWebsite;
            Layout = Layout === null ? Fragment : Layout;
            return (
              <Route
                key={`public-${index}`}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <VideoBackground>
                      <Layout>
                        <Page />
                      </Layout>
                    </VideoBackground>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
