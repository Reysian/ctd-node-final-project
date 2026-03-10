import { useState } from "react";
import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./pages/ProtectedRoute"
import AppContext from "./shared/AppContext";

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <Routes>
        <Route path="/" element={
          <AppContext.Provider value={{
            errorMessage,
            setErrorMessage
          }}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </AppContext.Provider>
        }/>
        <Route path="/login" element={
          <AppContext.Provider value={{
            errorMessage,
            setErrorMessage
          }}>
            <Login />
          </AppContext.Provider>
        }/>
        <Route path="/register" element={
          <AppContext.Provider value={{
            errorMessage,
            setErrorMessage
          }}>
            <Register />
          </AppContext.Provider>
        }/>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
