import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Secreg from "./containers/Secreg";
import Agreement from "./containers/Agreement/Agreement";
import Dashboard from "./containers/Dashboard";
import Category from "./containers/Category/Category";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="Secreg" element={<Secreg/>}/>
          <Route exact path="dashboard" element={<Dashboard />} />
          <Route exact path="agreement" element={<Agreement />} />
          <Route exact path="category" element={<Category />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;