import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Secreg from "./containers/Secreg";
import Agreement from "./containers/Agreement/Agreement";
import Dashboard from "./containers/Dashboard";
import Category from "./containers/Category/Category";
import SkillYatraVideos from "./containers/SkillYatraVideos/SkillYatraVideos";
import Jobs from "./containers/Jobs/Jobs";
import Permission from "./containers/Permissions/Permissions";
import CoursePermissions from "./containers/Permissions/CoursePermissions";
import SectionPermission from "./containers/section-permission/sectionpermission";
import Section from "./containers/section-permission/Section";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserTable from "./containers/section-permission/UserTable";
import Index from "./containers/HomePage/Index";
import ECategory from "./containers/category/ECategory";
import BankDetails from "./containers/BankDetails";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="flex-1">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/agreement" element={<Agreement />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/secreg" element={<Secreg />} />
            <Route exact path="/" element={<Index />}>

            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/category" element={<Category />} />
            <Route exact path="/jobs" element={<Jobs />} />
            <Route exact path="/coursepermissions" element={<CoursePermissions />} />
            <Route exact path="/permissions" element={<Permission />} />
            <Route exact path="/EmployeePermission" element={<Section />} />
            <Route exact path="/sectionpermission" element={<Section />} />
            <Route exact path="/spermissions" element={<SectionPermission />} />
            <Route exact path="/skillyatravideos" element={<SkillYatraVideos />} />
            <Route exact path="/usertable" element={<UserTable />} />

            </Route>
            <Route exact path="/bank-details" element={<BankDetails />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;