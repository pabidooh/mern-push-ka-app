import React from "react"; //главная стр public
import { BrowserRouter, Routes, Route } from "react-router-dom"; //вытаскиваем маршруты  
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
export default function App() {
  return ( //передаём маршрутизатор браузера (2) //индивидуальные маршруты
    <BrowserRouter>
      <Routes> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  ); //внутри этого маршрутизатора будет определяться компонент маршрутов
}
