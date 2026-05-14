import React, { useState } from 'react';
import logo from '../assets/Logo_dark.png';
import { Button } from './components/Button';
import { useAppDispatch } from '../store/hooks';
import { setUser, setError } from '../store/authSlice'; // Added setError
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, // Import updateProfile
  setPersistence,
  browserLocalPersistence 
} from "firebase/auth";
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navyBlue = 'text-[#192A56]';
  const borderNavy = 'border-[#192A56]';
  const bgColor = 'bg-[#FBFCF8]';

  const handleAuth = async () => {
    if (!email || !password || (!isLoginMode && !username)) {
      alert("Please fill in all fields");
      return;
    }

    setLoader(true);
    try {
      // Set persistence to LOCAL so the session survives refreshes
      await setPersistence(auth, browserLocalPersistence);

      if (!isLoginMode) {
        // --- CREATE ACCOUNT LOGIC ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // CRITICAL: Update the Firebase profile with the entered name
        await updateProfile(userCredential.user, {
          displayName: username
        });

        dispatch(setUser({ 
          id: userCredential.user.uid, 
          email, 
          name: username, 
          role: 'student' 
        }));
        
        navigate('/courses');
      } else {
        // --- LOGIN LOGIC ---
        const response = await signInWithEmailAndPassword(auth, email, password);
        const user = response.user;

        dispatch(setUser({ 
          id: user.uid, 
          email: user.email || '', 
          name: user.displayName || 'Learner',
          role: 'student' 
        }));
        
        navigate('/courses');
      }
    } catch (error: any) {
      console.error("Auth Error:", error.code);
      dispatch(setError(error.message));
      alert(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} p-4`}>
      <img src={logo} alt="Skillup" className="w-[180px] mb-5 transition-transform hover:scale-105 animate-pulse" />

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
            className={`p-4 rounded-xl border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all placeholder:text-gray-400`} 
          />
        )}
        
        <input 
          type="email" 
          placeholder="Enter email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-4 rounded-xl border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all placeholder:text-gray-400`} 
        />
        
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`p-4 rounded-xl border-2 ${borderNavy} ${navyBlue} focus:outline-none focus:ring-2 focus:ring-[#A5BEFC]/50 transition-all placeholder:text-gray-400`} 
        />

        <div className="mt-4">
          <Button 
            title={loader ? "Loading..." : (isLoginMode ? 'Login' : 'Join Skillup')} 
            onPress={handleAuth} 
          />
        </div>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-500 font-medium">
            {isLoginMode ? "New to Skillup? " : "Already part of the us? "}
          </span>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-[#7D96FF] bg-none border-none cursor-pointer font-black hover:underline transition-all"
          >
            {isLoginMode ? 'Create Account' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;