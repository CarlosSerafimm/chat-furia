import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Auth from "./pages/login/Auth";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
