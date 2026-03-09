import { useState, useEffect } from "react";
import { Router, Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoute"
import TransactionForm from "./shared/TransactionForm";
import TransactionListItem from "./TransactionListItem";
import AppContext from "./shared/AppContext";

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={
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
      </Routes>
    </>
  );
}

export default App;
