import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";

export default function Settings() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    // JS connect
    const script = document.createElement("script");
    script.src = "/src/assets/assetsscript.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // get User
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name || "", email: data.email || "" });
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  return (
    <>
      {/* Background */}
      <div className="video-bg">
        <video width={320} height={240} autoPlay="" loop="" muted="">
          <source
            src="https://assets.codepen.io/3364143/7btrrd.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Button to select a theme  */}
      <div className="dark-light">
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>

      {/* Main */}
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="menu-circle" />
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="wrapper">
          {/* Sidebar */}
          <div className="left-side">
            <div className="side-wrapper">
              <div className="side-title">Side Bar</div>
              <div className="side-menu">
                <a href="/main/">
                  🏠
                  Home
                </a>

                <a href="/assets/">
                  💰
                  Assets
                </a>
                <a href="/transactions/">
                  🔄
                  Transactions
                </a>
                <a href="/categories/">
                  🏷️
                  Categories
                </a>
                <a href="/analytics/">
                  📊
                  Analytics
                </a>
                <a href="/settings/">
                  🧑‍💻
                  Profile
                </a>
                <a href="/">
                  🚪
                  Exit
                </a>
              </div>
            </div>
          </div>

          <div className="main-container">
            {/* Navbar */}
            <div className="main-header">
              <a className="menu-link-main" href="#">
                {user ? `Welcome ${user.name}` : "Loading..."}
              </a>
            </div>

            <div className="content-wrapper2">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    🧑‍💼
                    Profile
                  </h3>
                  <div className="content-text">
                  The Profile page displays your personal account information, including your name and email address.
                  Keeping your profile up to date helps ensure personalized features and secure access to your financial data.
                  This section gives you a quick overview of your account details in one place.                  
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907675.png"
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">User Info</div>
                <ul>
                  <li className="li-settings"><strong className="strong-settings">Name:</strong> {user?.name}</li>
                  <li className="li-settings"><strong className="strong-settings">Email:</strong> {user?.email}</li>
                  <li className="li-settings"><strong className="strong-settings">ID:</strong> {user?._id}</li>
                  {/* Можно добавить user?.createdAt, если есть */}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="overlay-app" />
      </div>
    </>
  );
}
