import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { register } from "../api/auth";
import { Link } from "react-router-dom";



const Register = () => {
  const userRef = useRef();

  const [username, setUsername] = useState("");
  
  const [password, setPassword] = useState("");


  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false); 


  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
      setValidMatch(password === matchPwd);
  }, [password, matchPwd])
  
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        register,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      console.log(response.data);
      // response.data === "User already exists" ? alert("User already exists") : alert("User created successfully");
      if (response.status !== 200) return null;
    } catch (error) {
      console.error(error);
    }
  };

  const input_text_style =
    "px-10 py-2 w-96 rounded-md outline-none border-2 border-primary font-medium text-medium text-grey-400";

 
    return (
      <>
        <div className="p-16 h-screen bg-black text-center flex justify-end">
          <div className="space-y-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-200 bg-clip-text">
              <h1 className="text-transparent h-20">Sign-up</h1>
            </div>
            <div className="space-y-4">
              <form>
                <label 
                  class="block text-lg font-medium mb-1 text-white text-left"
                  htmlFor="username"
                >
                  Username
                </label>
                  <input
                    className={input_text_style}
                    id="username"
                    value={username}
                    ref={userRef}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter Username"
                    name="uname"
                    required
                  />
                <label 
                  class="block text-lg font-medium mb-1 text-white text-left"
                  htmlFor="password"
                >
                  Password
                </label>
                  <input
                    className={input_text_style}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="off"
                    placeholder="Enter Password"
                    name="psw"
                    required
                  />
                <label 
                  class="block text-lg font-medium mb-1 text-white text-left"
                  htmlFor="confirm_pwd"
                >
                  Confirm your password
                </label>
                  <input
                    className={input_text_style}
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                    placeholder="Re-enter Password"
                  />
                <p
                  id="confirmnote"
                  className={matchFocus && !validMatch ? "text-red-500" : "sr-only"}
                >
                  Must match the first password input field.
                </p>
              </form>
              <div>
                <button
                  className="px-10 py-2 w-60 rounded-md bg-emerald-400 text-white font-medium text-medium"
                  onClick={registerHandler}
                >
                  Register
                </button>
                <h1 class="text-lg font-medium mb-1 text-white text-center">
                  Already have an account?  <Link to="/login" className="text-blue-500">Login</Link>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
export default Register;
