import { useState, useEffect } from "react";
import { Navigate } from "react-router";

// ProtectedRoute component verifies that a valid user is logged in before allowing access to child components
function ProtectedRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValidating(false);
        return;
      }

      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const resp = await fetch("/api/auth/verify", options);
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        setAuthorized(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, []);

  if (!isValidating && !authorized) {
    return <Navigate to="/login" />;
  }

  if (isValidating) {
    return <h2>Loading...</h2>;
  }

  return children;
}

export default ProtectedRoute;
