/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, Fragment } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import axiosInstance from "../../config/AxiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarComponentNew from "../../components/sidebar/SidebarComponentNew";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { setAuthenticated, setUserRole } = useAuth();

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset any previous error messages
    setUsernameError("");
    setPasswordError("");

    // Validate username and password
    if (!username) {
      setUsernameError("Please enter your username");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/signin", {
        username,
        password,
      });

      localStorage.setItem("jwt", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const payload = decodeJWT(response.data.access);

      // axios.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer ${response.data.access}`;

      setAuthenticated(true);
      setUserRole(payload.user_scope);

      // Redirect to dashboard after successful login
      navigate("/exam/dashboard");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        setUsernameError("Invalid username or password");
      } else {
        console.log("Error:", error);
      }
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col lg:flex-row items-center justify-center lg:h-screen lg:gap-y-12">
        <div className="lg:w-full h-full relative">
          <div
            className="absolute inset-2 bg-cover bg-bottom rounded-lg"
            style={{
              backgroundImage: `url('../../../public/images/Experion.jfif')`,
            }}
          ></div>
        </div>

        <Card
          horizontal
          className="w-full lg:w-full md:max-w-screen-sm md:[&>*]:w-full md:[&>*]:p-16"
        >
          <div className="flex lg:my-0 text-sm">
            <span className="font-light item-center dark:text-white md:text-3xl text-center">
              Experion Asset Management
            </span>
          </div>
          <h1 className="font-display font-semi-bold dark:text-white md:text-3xl my-6 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-8 font-display">
              <Label htmlFor="username">Username:</Label>
              <TextInput
                id="username"
                name="username"
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <p className="text-red-500">{usernameError}</p>}
            </div>
            <div className="mb-8">
              <Label htmlFor="password">Password:</Label>
              <TextInput
                id="password"
                name="password"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
            <div className="mb-6">
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-700 font-display"
              >
                Login
              </Button>
              <div className="my-5 text-center">
                <hr></hr>
              </div>
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-700 font-display"
                  onClick={() => window.location.href = "http://localhost:8000/auth/sign_in"}
                >
                  <img
                    src="../../../public/images/Microsoft logo.png"
                    alt="Microsoft logo"
                    className="w-30 h-6 ml-2 mx-3" // Adjust width and height as needed
                  />
                  Sign in with Microsoft
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Fragment>
  );
}
