import { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import VideoBackground from "./components/backgroundvideo";
import LayoutWebsite from "./DefaultLayouts/LayoutWebsite";
import { publicRoutes } from "./routes/routes";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
