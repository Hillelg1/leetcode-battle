import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/index";
import BattleLoader from "./pages/BattleLoader";
import Leaderboard from "./pages/Leaderboard/index";
import Login from "./pages/Login/index";
import User from "./pages/CreateUser/index";
import Layout from "./Components/Layout";
import Admin from "./pages/Admin/index";
import MatchHistory from "./pages/MatchHistory/index";``

function App() {
    return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/battle" element={<BattleLoader />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path = "/history" element = {<MatchHistory />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/createUser" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
