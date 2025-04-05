import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const assetIcons = {
  wallet: "💰",
  bank: "🏦",
  card: "💳",
  investment: "📈",
  loan: "💸",
  insurance: "🛡️",
  other: "📦",
};

export default function Main() {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // JS connect
    const script = document.createElement("script");
    script.src = "/src/assets/mainscript.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        const [assetsRes, transactionsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/assets?user_id=${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/transactions?user_id=${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAssets(await assetsRes.json());
        setTransactions(await transactionsRes.json());
      } catch (err) {
        console.error("Error loading data:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const grouped = transactions.reduce((acc, t) => {
    const date = new Date(t.created_at || t.date || Date.now())
      .toLocaleDateString("en-GB"); // формат "dd/mm/yyyy"

    if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };

    if (t.type === "income") {
      acc[date].income += parseFloat(t.amount);
    } else if (t.type === "expense") {
      acc[date].expense += parseFloat(t.amount);
    }

    return acc;
  }, {});

  const chartData = Object.values(grouped).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      {/* Background */}
      <div className="video-bg">
        <video width={320} height={240} autoPlay loop muted>
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
                <a href="/" onClick={() => localStorage.removeItem("token")}>
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

            <div className="content-wrapper">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    🏠
                    Home page
                  </h3>
                  <div className="content-text">
                    The home page is your financial hub where you can easily track, analyze,
                    and manage your finances. It brings together all the important information about your income,
                    expenses, and assets, allowing you to always be aware of your financial situation.
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://www.transparentpng.com/download/finance/TpPTTh-finance-png-picture.png "
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">💸 Latest Transactions</div>
                <ul className="products-list">
                  {transactions.length > 0 ? (
                    transactions
                      .slice(-3)
                      .reverse()
                      .map((t) => (
                        <li key={t.id} className="adobe-product" style={{ borderLeft: "5px solid #aaa" }}>
                          <div className="products">
                            <span className="icon">
                              {t.type === "income"
                                ? "📥"
                                : t.type === "expense"
                                  ? "📤"
                                  : "🔁"}
                            </span>
                            <span>
                              {t.type.charAt(0).toUpperCase() + t.type.slice(1)} — {t.amount} {t.currency}
                            </span>
                          </div>
                          <span className="status">
                            <span className="status-circle green" />
                            {t.note || "No note"}
                          </span>
                        </li>
                      ))
                  ) : (
                    <li className="adobe-product">
                      <div className="products">No transactions found</div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="content-section">
                <div className="content-section-title">💰 Summary</div>
                <ul className="products-list">
                  <li className="adobe-product" style={{ borderLeft: "5px solid #28a745" }}>
                    <div className="products">
                      <span className="icon">💰</span>
                      <span>Total Balance</span>
                    </div>
                    <span className="balance">
                      {assets.reduce((sum, a) => sum + a.balance, 0).toLocaleString()} USD
                    </span>
                  </li>
                </ul>
              </div>
              <div className="content-section">
                <div className="content-section-title">📊 Income vs Expense Chart</div>
                <ul className="products-list">
                  <li className="adobe-product" style={{ width: "100%" }}>
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="income" fill="#2ecc71" name="Income" />
                          <Bar dataKey="expense" fill="#e74c3c" name="Expense" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </li>
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
