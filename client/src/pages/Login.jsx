import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import AppContext from "../shared/AppContext";


function Login() {
  const emailInput = useRef(document.querySelector("#email"));
  const passwordInput = useRef(document.querySelector("#password"));
  const { errorMessage, setErrorMessage } = useContext(AppContext);
  const navigate = useNavigate();

  const [workingEmail, setWorkingEmail] = useState("");
  const [workingPassword, setWorkingPassword] = useState("");

  const login = async () => {
    const payload = {
      email: workingEmail,
      password: workingPassword,
    };

    console.log(payload);

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    };

    console.log(options);

    let respData = null;

    try {
      const resp = await fetch("/api/auth/login", options);
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
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const newToken = await login(event);
    if (newToken) {
      localStorage.setItem("token", newToken);
      navigate("/dashboard");
    }
  };

  return (
    <>
      <h2>Login</h2>
      <p>{errorMessage}</p>
      <form onSubmit={(event) => handleLogin(event)}>
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
        <button onSubmit={(event) => handleLogin(event)}>Login</button>
      </form>
      <Link to={"/register"}>Register</Link>
    </>
  );
}

export default Login;
