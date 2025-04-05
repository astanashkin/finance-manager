import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("User load error", err));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user) return;

    Promise.all([
      fetch(`http://localhost:5000/api/transactions?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`http://localhost:5000/api/categories?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`http://localhost:5000/api/assets?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ]).then(([transactionsData, categoriesData, assetsData]) => {
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setAssets(assetsData);
    });
  }, [user]);

  // 🔍 Распределение по категориям
  const groupByCategory = (type) => {
    const filtered = transactions.filter((t) => t.type === type);
    const grouped = {};

    filtered.forEach((t) => {
      const cat = categories.find(c => c.id === parseInt(t.category_id));
      const name = cat?.name || "Unknown";
      grouped[name] = (grouped[name] || 0) + parseFloat(t.amount);
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4D4F", "#9E71FF", "#72D7FF"];

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const assetData = assets.map(a => ({
    name: a.name,
    value: a.balance,
  }));

  // 🔄 Считаем активность по дате
  const activityByDate = {};

  transactions.forEach((t) => {
    const date = new Date(t.created_at || t.date || Date.now()).toLocaleDateString("en-GB");
    if (!activityByDate[date]) {
      activityByDate[date] = { date, income: 0, expense: 0, transfer: 0 };
    }
    activityByDate[date][t.type] += 1;
  });

  const activityList = Object.values(activityByDate).sort(
    (a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-'))
  );


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

            <div className="content-wrapper">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    📊
                    Analytics
                  </h3>
                  <div className="content-text">
                    The Analytics page is your personal dashboard for understanding your financial behavior.
                    Here, you can visualize your income and expenses by category, track the distribution of your assets, and gain a clear overview of your financial health.
                    Make smarter money decisions by analyzing trends and optimizing your financial strategy.
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907675.png"
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">Analytics Overview</div>
                <ul className="products-list">
                  {/* 💰 Итог */}
                  <li className="adobe-product" style={{ borderLeft: "5px solid #17c964" }}>
                    <div className="products">
                      <span className="icon">💰</span>
                      <span>Total Balance</span>
                    </div>
                    <span className="status">
                      {/* <span className="status-circle green" /> */}
                      {totalIncome.toFixed(2)} - {totalExpense.toFixed(2)}
                    </span>
                    <span className="balance">
                      {(totalIncome - totalExpense).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD
                    </span>
                  </li>

                  {/* 📈 Доходы */}
                  <li className="adobe-product" style={{ borderLeft: "5px solid #3498db" }}>
                    <div className="products">
                      <span className="icon">📈</span>
                      <span>Income by Category</span>
                    </div>
                    <div style={{ height: "200px", width: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={groupByCategory("income")}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {groupByCategory("income").map((_, i) => (
                              <Cell key={`cell-income-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </li>

                  {/* 📉 Расходы */}
                  <li className="adobe-product" style={{ borderLeft: "5px solid #e74c3c" }}>
                    <div className="products">
                      <span className="icon">📉</span>
                      <span>Expenses by Category</span>
                    </div>
                    <div style={{ height: "200px", width: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={groupByCategory("expense")}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {groupByCategory("expense").map((_, i) => (
                              <Cell key={`cell-expense-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </li>

                  {/* 🏦 Активы */}
                  <li className="adobe-product" style={{ borderLeft: "5px solid #f1c40f" }}>
                    <div className="products">
                      <span className="icon">🏦</span>
                      <span>Assets by Balance</span>
                    </div>
                    <div style={{ height: "220px", width: "100%" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assetData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value">
                            {assetData.map((_, i) => (
                              <Cell key={`bar-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="content-section">
                <div className="content-section-title">📅 Activity by Date</div>
                <ul className="products-list">
                  {activityList.map((day) => (
                    <li key={day.date} className="adobe-product" style={{ borderLeft: "5px solid #aaa" }}>
                      <div className="products">
                        <span className="icon">🗓</span>
                        <span>{day.date}</span>
                      </div>
                      <span className="status">
                        <span className="status-circle green" />
                        {day.income} income, {day.expense} expense, {day.transfer} transfer
                      </span>
                    </li>
                  ))}
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
