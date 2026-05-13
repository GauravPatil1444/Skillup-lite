import React, { useState } from 'react';
import logo from '../assets/Logo_dark.png';
import { Button } from './components/Button';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/authSlice';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const navyBlue = 'text-[#192A56]';
  const borderNavy = 'border-[#192A56]';
  const bgColor = 'bg-[#FBFCF8]';

  const handleAuth = async () => {
    setLoader(true);
    try {
      // Logic for Create Account
      if (!isLoginMode) {
        console.log("Creating account for:", username, email);
        await createUserWithEmailAndPassword(auth, email, password);
        dispatch(setUser({ id: Date.now().toString(), email, name: username, role: 'student' }));
        navigate('/courses');
      } 
      // Logic for Login
      else {
        const response = await signInWithEmailAndPassword(auth, email, password);
        const user = response.user;

        dispatch(setUser({ 
          id: user.uid, 
          email: user.email||'', 
          name: user.displayName||'', 
          role: 'student' 
        }));
        navigate('/courses'); // Redirect to catalog after login
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} p-4`}>
      <img src={logo} alt="Logo" className="w-[180px] mb-5 transition-transform hover:scale-105" />

      <h1 className={`text-[32px] font-bold ${navyBlue} mb-6`}>
        {isLoginMode ? 'Login' : 'Create Account'}
      </h1>

      <div className="flex flex-col gap-[15px] w-full max-w-[320px]">
        {!isLoginMode && (
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`p-3 rounded-lg border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all`} 
          />
        )}
        
        <input 
          type="email" 
          placeholder="Enter email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-3 rounded-lg border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all`} 
        />
        
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`p-3 rounded-lg border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all`} 
        />

        <div className="mt-2">
          <Button 
            title={loader ? "Loading..." : (isLoginMode ? 'Login' : 'Create Account')} 
            onPress={handleAuth} 
          />
        </div>

        <div className="text-center mt-[10px] text-sm">
          <span className="text-gray-500">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-[#7D96FF] bg-none border-none cursor-pointer font-bold hover:underline transition-all"
          >
            {isLoginMode ? 'Create now' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;