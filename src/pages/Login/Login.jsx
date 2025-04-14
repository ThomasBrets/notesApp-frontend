import React, { useState } from "react";
// react-router
import { Link, useNavigate } from "react-router-dom";
// components
import Navbar from "../../components/Navbar/Navbar.jsx";
import PasswordInput from "../../components/Input/PasswordInput";
// Utils
import { validateEmail } from "../../utils/helper";
// Axios
import axiosInstance from "../../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Para redirigir después de un login exitoso

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validar password
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(""); // Limpiar errores si hay alguno

    try {
      // Llamada a la API de login
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("Login successful", response.data);
      
      // Opcionalmente, redirige a otra página tras el login exitoso
      navigate('/'); // Puedes cambiar la ruta según sea necesario
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      {/* Formulario */}
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Mostrar errores si los hay */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            {/* Enlace para crear una cuenta */}
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/auth/register" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
