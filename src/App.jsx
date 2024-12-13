import { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import VideoBackground from "./components/backgroundvideo";
import LayoutWebsite from "./DefaultLayouts/LayoutWebsite";
import ProtectedRoute from "./routes/protectedroutes";
import { privateRoutes, publicRoutes } from "./routes/routes";

const App = () => {
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
