/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import axiosInstance from '../../config/AxiosConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous error messages
    setUsernameError('');
    setPasswordError('');

    // Validate username and password
    if (!username) {
      setUsernameError('Please enter your username');
      return;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    try {
      const response = await axiosInstance.post('/user/signin', { username, password });

      localStorage.setItem('jwt', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const fetchNewAccessToken = async () => {
        try {
          const response = await axios.post('/refresh_token', { refresh_token: refreshToken });
          localStorage.setItem('jwt', response.data.access_token);
        } catch (error) {
          // Handle refresh token expiration or other errors
          console.log('Error refreshing access token:', error);
          // Redirect to login page if refresh token is expired or invalid
          navigate('/login');
        }
      };
  
      // Check if access token is expired (example assumes access token is JWT)
      const accessToken = localStorage.getItem('jwt');
      if (accessToken) {
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
          // Access token is expired, fetch new access token using refresh token
          fetchNewAccessToken();
        }
      }
    }
  }, []);
  

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Experion Asset Management
        </span>
      </div>
      <Card
        horizontal
        imgAlt=""
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">Login to platform</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="username">Your username</Label>
            <TextInput
              id="username"
              name="username"
              placeholder="Your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="text-red-500">{usernameError}</p>}
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto bg-blue-500 text-white hover:bg-blue-700">
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
