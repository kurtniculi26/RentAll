import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import HomeScreen from "./pages/HomeScreen";
import ProfileScrreen from "./pages/ProfileScreen";
import NotificationScreen from "./pages/NotificationScreen";
import InboxScreen from "./pages/InboxScreen";
import RegisterScreen from "./pages/RegisterScreen";
import Header from "./components/Header";

function AppContent() {
  const [search, setSearch] = useState(""); // ✅ global search state
  const location = useLocation();

  // ✅ hide headers
  const hideHeader = ["/", "/register"].includes(location.pathname);


  return (
    <>
      {!hideHeader && <Header search={search} setSearch={setSearch} />}

      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen search={search} />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/profile" element={<ProfileScrreen />} />
        <Route path="/inbox" element={<InboxScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;