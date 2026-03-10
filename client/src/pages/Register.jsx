import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import AppContext from "../shared/AppContext";

// Register component creates a register page for new users to create a user account and access the dashboard
function Register() {
  const usernameInput = useRef(document.querySelector("#username"));
  const emailInput = useRef(document.querySelector("#email"));
  const passwordInput = useRef(document.querySelector("#password"));
  const { errorMessage, setErrorMessage } = useContext(AppContext);
  const navigate = useNavigate();

  const [workingUsername, setWorkingUsername] = useState("");
  const [workingEmail, setWorkingEmail] = useState("");
  const [workingPassword, setWorkingPassword] = useState("");

  const register = async () => {
    const payload = {
      name: workingUsername,
      email: workingEmail,
      password: workingPassword,
    };

    console.log(payload);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    console.log(options);

    let respData = null;

    try {
      const resp = await fetch("/api/auth/register", options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      setErrorMessage("");
      return respData.token;
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const newToken = await register(event);
    if (newToken) {
      localStorage.setItem("token", newToken);
      navigate("/");
    }
  };

  return (
    <>
      <h2>Register</h2>
      <p>{errorMessage}</p>
      <form onSubmit={(event) => handleRegister(event)}>
        <label htmlFor="name">Username:</label>
        <input
          id="username"
          ref={usernameInput}
          type="text"
          value={workingUsername}
          onChange={(event) => setWorkingUsername(event.target.value)}
        ></input>
        <label htmlFor="email">Email Address:</label>
        <input
          id="email"
          ref={emailInput}
          type="text"
          value={workingEmail}
          onChange={(event) => setWorkingEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          ref={passwordInput}
          type="text"
          value={workingPassword}
          onChange={(event) => setWorkingPassword(event.target.value)}
        ></input>
        <button onSubmit={(event) => handleRegister(event)}>Register</button>
      </form>
      <Link to={"/login"}>Login</Link>
    </>
  );
}

export default Register;
