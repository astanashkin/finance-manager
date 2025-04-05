import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/icon.png";
import "../assets/css/app.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields must be completed!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration error.");
        return;
      }
      alert("Registration completed successfully");
      navigate("/");
    } catch (error) {
      setError("Error connecting to server.");
    }
  };

  return (
    <div>
      <div className="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900">
        <main className="grid w-full grow grid-cols-1 place-items-center">
          <div className="w-full max-w-[26rem] p-4 sm:px-5">
            <div className="text-center">
              <img className="mx-auto size-16" src={logo} alt="logo" />
              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                  Create Account
                </h2>
                <p className="text-slate-400 dark:text-navy-300">
                  Sign up to get started
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card mt-5 rounded-lg p-5 lg:p-7">
                {error && <p className="text-danger text-center mb-3">{error}</p>}
                <label className="block">
                  <span>Full Name:</span>
                  <span className={`relative mt-1.5 flex ${isShaking ? "animate-shake" : ""}`}>
                    <input 
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9"
                      placeholder="Enter Full Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14a4 4 0 100-8 4 4 0 000 8zm-7 6a7 7 0 0114 0" />
                        </svg>
                    </span>
                  </span>
                </label>
                <label className="mt-4 block">
                  <span>Email:</span>
                  <span className={`relative mt-1.5 flex ${isShaking ? "animate-shake" : ""}`}>
                    <input 
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9"
                      placeholder="Enter Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </span>
                </label>
                <label className="mt-4 block">
                  <span>Password:</span>
                  <span className={`relative mt-1.5 flex ${isShaking ? "animate-shake" : ""}`}>
                    <input
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9"
                      placeholder="Enter Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </span>
                </label>
                <label className="mt-4 block">
                  <span>Confirm Password:</span>
                  <span className={`relative mt-1.5 flex ${isShaking ? "animate-shake" : ""}`}>
                    <input
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9"
                      placeholder="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </span>
                </label>
                <button 
                  type="submit"
                  className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus"
                >
                  Sign Up
                </button>
                <div className="mt-4 text-center text-xs+">
                  <p className="line-clamp-1">
                    <span>Already have an account?</span>
                    <a className="text-primary transition-colors hover:text-primary-focus" href="/">
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}