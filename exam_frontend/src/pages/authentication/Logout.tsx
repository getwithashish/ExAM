/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear the local storage
        localStorage.removeItem("jwt");
        localStorage.removeItem("refresh_token");

        // Redirect to the login page
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    // Call the logout function when the component mounts
    handleLogout();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
        Logged out
      </h1>
      <Button
        className="bg-blue-500 text-white hover:bg-blue-700"
        onClick={() => navigate("/")}
      >
        Return to Login
      </Button>
    </div>
  );
}
