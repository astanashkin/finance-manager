import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/icon.png";
import "../assets/css/app.css";
import "../assets/js/app.js";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe) {
      setUsername(savedUsername || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields must be completed!");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      navigate("/main"); // Перенаправляем на Main.js
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
                  Finance Manager
                </h2>
                <p className="text-slate-400 dark:text-navy-300">
                  Please sign in to continue
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card mt-5 rounded-lg p-5 lg:p-7">
                {error && <p className="text-danger text-center mb-3">{error}</p>}
                <label className="block">
                  <span>Email:</span>
                  <span className={`relative mt-1.5 flex ${isShaking ? "animate-shake" : ""}`}>
                    <input className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
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
                    <input className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Enter Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </span>
                </label>
                <div className="mt-4 flex items-center justify-between space-x-2">
                  <label className="inline-flex items-center space-x-2">
                    <input className="form-checkbox is-basic size-5 rounded border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent" type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    <span className="line-clamp-1">Remember me</span>
                  </label>
                  {/* <a href="#" className="text-xs text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100">Forgot Password?</a> */}
                </div>
                <button className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                  Sign In
                </button>
                <div className="mt-4 text-center text-xs+">
                  <p className="line-clamp-1">
                    <span>Dont have Account?</span>
                    <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/signup">Create account</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <div id="x-teleport-target" />
    </div>
  );
}