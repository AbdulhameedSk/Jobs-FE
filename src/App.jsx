import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Secreg from "./containers/Secreg";
import Agreement from "./containers/Agreement/Agreement";
import Dashboard from "./containers/Dashboard";
import Category from "./containers/Category/Category";
import SideBarMenu from './components/Boilers/SideBarMenu';
import SkillYatraVideos from "./containers/SkillYatraVideos/SkillYatraVideos";
import Jobs from "./containers/Jobs/Jobs";
import Permission from "./containers/Permissions/Permissions";
import CoursePermissions from "./containers/Permissions/CoursePermissions";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/secreg" element={<Secreg />} />

          <Route
            path="*"
            element={
              <div className="flex">
                <div className="w-60 bg-gray-800 h-screen">
                  <SideBarMenu />
                </div>

                <div className="flex-1">
                  <Routes>
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/agreement" element={<Agreement />} />
                    <Route exact path="/category" element={<Category />} />
                    <Route exact path="/jobs" element={<Jobs />} />
                    <Route exact path="/coursepermissions" element={<CoursePermissions />} />
                    <Route exact path="/permissions" element={<Permission />} />
                    <Route
              exact
              path="skillyatravideos"
              element={<SkillYatraVideos />}
            />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App;
