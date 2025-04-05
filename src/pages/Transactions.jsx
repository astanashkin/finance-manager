import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";

const transactionIcons = {
  expense: "💸",
  income: "💰",
  transfer: "🔄",
};

export default function Transactions() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    type: "expense",
    category_id: "",
    asset_id: "",
    note: ""
  });
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const updateAssetBalance = async (assetId, amountChange) => {
    const token = localStorage.getItem("token");

    const asset = assets.find(a => a.id === parseInt(assetId));
    if (!asset) {
      console.error("Asset not found");
      return;
    }

    const newBalance = asset.balance + amountChange;

    try {
      await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ balance: newBalance }),
      });
    } catch (err) {
      console.error("Asset balance update error:", err);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(data))
      .catch((err) => console.error("Failed to load currencies", err));
  }, []);

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
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  // Устанавливаем значение по умолчанию для категории
  useEffect(() => {
    if (categories.length > 0 && !newTransaction.category_id && newTransaction.type !== "transfer") {
      setNewTransaction((prev) => ({
        ...prev,
        category_id: categories.find(cat => cat.type === prev.type)?.id || categories[0].id
      }));
    }
  }, [categories, newTransaction.type]);

  // Устанавливаем значение по умолчанию для актива
  useEffect(() => {
    if (assets.length > 0 && !newTransaction.asset_id && newTransaction.type !== "transfer") {
      setNewTransaction((prev) => ({
        ...prev,
        asset_id: assets[0].id
      }));
    }
  }, [assets, newTransaction.type]);

  // Для transfer: ставим from_asset и to_asset по умолчанию
  useEffect(() => {
    if (assets.length > 1 && newTransaction.type === "transfer") {
      setNewTransaction((prev) => ({
        ...prev,
        from_asset_id: prev.from_asset_id || assets[0].id,
        to_asset_id: prev.to_asset_id || assets[1].id
      }));
    }
  }, [assets, newTransaction.type]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/categories?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error loading categories:", error));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/assets?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((error) => console.error("Error loading assets:", error));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/transactions?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Error loading transactions:", error));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/transfers?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Добавим тип "transfer" и мокаем поле currency для отображения
        const formatted = data.map((t) => ({
          ...t,
          type: "transfer",
          currency: getAssetCurrency(t.from_asset_id),
        }));
        setTransactions((prev) => [...prev, ...formatted]);
      })
      .catch((error) => console.error("Error loading transfers:", error));
  }, [user]);

  const getAssetCurrency = (assetId) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.currency;
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    const amount = parseFloat(newTransaction.amount);

    if (newTransaction.type === "transfer") {
      if (
        !amount ||
        !newTransaction.from_asset_id ||
        !newTransaction.to_asset_id ||
        newTransaction.from_asset_id === newTransaction.to_asset_id
      ) {
        setError("Fill in all fields for transfer!");
        setLoading(false);
        return;
      }

      const fromAsset = assets.find((a) => a.id === parseInt(newTransaction.from_asset_id));
      const toAsset = assets.find((a) => a.id === parseInt(newTransaction.to_asset_id));
      if (!fromAsset || !toAsset) {
        setError("Invalid assets selected");
        setLoading(false);
        return;
      }

      const fromCurrency = currencies.find((c) => c.code === fromAsset.currency);
      const toCurrency = currencies.find((c) => c.code === toAsset.currency);
      if (!fromCurrency || !toCurrency) {
        setError("Currency rate not found");
        setLoading(false);
        return;
      }

      const fromRate = fromCurrency.rate_to_usd;
      const toRate = toCurrency.rate_to_usd;
      const convertedAmount = (amount * fromRate) / toRate;

      try {
        const response = await fetch("http://localhost:5000/api/transfers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id, ...newTransaction }),
        });

        if (!response.ok) throw new Error("Error adding transfer");

        // Update balances with currency conversion
        await updateAssetBalance(newTransaction.from_asset_id, -amount);
        await updateAssetBalance(newTransaction.to_asset_id, convertedAmount);

        setShowModal(false);
        setNewTransaction({
          amount: "",
          type: "expense",
          category_id: "",
          asset_id: "",
          from_asset_id: "",
          to_asset_id: "",
          note: "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Income / Expense
      if (!amount || !newTransaction.category_id || !newTransaction.asset_id) {
        setError("Fill in all fields!");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id, ...newTransaction }),
        });

        if (!response.ok) throw new Error("Error adding transaction");

        const createdTransaction = await response.json();
        setTransactions((prev) => [...prev, createdTransaction]);

        const delta = newTransaction.type === "income" ? amount : -amount;
        await updateAssetBalance(newTransaction.asset_id, delta);

        setShowModal(false);
        setNewTransaction({
          amount: "",
          type: "expense",
          category_id: "",
          asset_id: "",
          from_asset_id: "",
          to_asset_id: "",
          note: "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    try {
      if (transaction.type === "transfer") {
        const fromAsset = assets.find((a) => a.id === parseInt(transaction.from_asset_id));
        const toAsset = assets.find((a) => a.id === parseInt(transaction.to_asset_id));

        const fromCurrency = currencies.find((c) => c.code === fromAsset.currency);
        const toCurrency = currencies.find((c) => c.code === toAsset.currency);

        const fromRate = fromCurrency.rate_to_usd;
        const toRate = toCurrency.rate_to_usd;
        const convertedAmount = (parseFloat(transaction.amount) * fromRate) / toRate;

        await updateAssetBalance(transaction.from_asset_id, parseFloat(transaction.amount));
        await updateAssetBalance(transaction.to_asset_id, -convertedAmount);

        await fetch(`http://localhost:5000/api/transfers/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const delta = transaction.type === "income"
          ? -parseFloat(transaction.amount)
          : +parseFloat(transaction.amount);

        await updateAssetBalance(transaction.asset_id, delta);

        await fetch(`http://localhost:5000/api/transactions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await refreshTransactions();
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const refreshTransactions = async () => {
    const token = localStorage.getItem("token");

    try {
      const t1 = await fetch(`http://localhost:5000/api/transactions?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incomeExpense = await t1.json();

      const t2 = await fetch(`http://localhost:5000/api/transfers?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transfers = await t2.json();

      const formattedTransfers = transfers.map((t) => ({
        ...t,
        type: "transfer",
        currency: getAssetCurrency(t.from_asset_id),
      }));

      setTransactions([...incomeExpense, ...formattedTransfers]);
    } catch (err) {
      console.error("Error refreshing transactions:", err);
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

            <div className="content-wrapper">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    💰
                    Transactions
                  </h3>
                  <div className="content-text">
                    The Transactions page is your central hub for tracking all your financial activities.
                    Here, you can add, and delete transactions, categorizing them as expenses, income, or transfers between accounts.
                    By keeping an organized record of your transactions, you gain a clearer picture of your financial flow,
                    enabling better budgeting, smarter spending, and more efficient financial management.
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907675.png"
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">List of Transactions</div>
                <ul>
                  <li className="adobe-product">
                    <div className="button-wrapper">
                      <button
                        className="content-button status-button open"
                        onClick={() => setShowModal(true)}
                      >
                        Add a new transaction
                      </button>
                    </div>
                  </li>
                </ul>
                <ul>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <li className="adobe-product" key={transaction.id}>
                        <div className="products">
                          <span className="icon">{transactionIcons[transaction.type] || "🔄"}</span>
                          <span>
                            {transaction.amount.toLocaleString()} {transaction.currency}
                          </span>
                        </div>
                        <span className="status">
                          <span className="status-circle green" />
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                        <div className="button-wrapper">
                          <button
                            className="status-button1"
                            onClick={() => setViewTransaction(transaction)}
                          >
                            🔍
                          </button>
                          {/* Кнопка Delete */}
                          <button className="status-button1 delete" onClick={() => handleDeleteTransaction(transaction.id)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18v2H3V6zm3 3h12l-1.5 12H7.5L6 9zm2 2h2v8H8v-8zm4 0h2v8h-2v-8zm4 0h2v8h-2v-8z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <center>
                      <br />
                      <p>No transactions found</p>
                      <br />
                    </center>
                  )}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {showModal && (
          <div className="overlay-app is-active">
            <div className="pop-up visible">
              <div className="pop-up__title">
                <h2>Add New Transaction</h2>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddTransaction} className="modal-form">
                {error && <p className="text-red-500">{error}</p>}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="amount">Amount</label>
                  <input
                    type="text"
                    id="amount"
                    className="input-group__input"
                    value={newTransaction.amount === 0 ? "" : newTransaction.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) { // Разрешены только числа и десятичные точки
                        setNewTransaction({ ...newTransaction, amount: value });
                      }
                    }}
                    required
                    placeholder="Enter transaction amount"
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="type">Type</label>
                  <select
                    id="type"
                    className="input-group__input"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>

                {newTransaction.type !== "transfer" && (
                  <>
                    <div className="input-group">
                      <label className="input-group__label" htmlFor="category">Category</label>
                      <select
                        id="category"
                        className="input-group__input"
                        value={newTransaction.category_id}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value })}
                      >
                        {categories
                          .filter((cat) => cat.type === newTransaction.type)
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}

                {newTransaction.type !== "transfer" && (
                  <div className="input-group">
                    <label className="input-group__label" htmlFor="asset">Asset</label>
                    <select
                      id="asset"
                      className="input-group__input"
                      value={newTransaction.asset_id}
                      onChange={(e) => setNewTransaction({ ...newTransaction, asset_id: e.target.value })}
                    >
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}


                {newTransaction.type === "transfer" && (
                  <>
                    <div className="input-group">
                      <label className="input-group__label" htmlFor="from_asset">From Asset</label>
                      <select
                        id="from_asset"
                        className="input-group__input"
                        value={newTransaction.from_asset_id}
                        onChange={(e) => setNewTransaction({ ...newTransaction, from_asset_id: e.target.value })}
                      >
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-group__label" htmlFor="to_asset">To Asset</label>
                      <select
                        id="to_asset"
                        className="input-group__input"
                        value={newTransaction.to_asset_id}
                        onChange={(e) => setNewTransaction({ ...newTransaction, to_asset_id: e.target.value })}
                      >
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="note">Note</label>
                  <input
                    type="text"
                    id="note"
                    className="input-group__input"
                    value={newTransaction.note}
                    onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                    placeholder="Optional note"
                  />
                </div>

                <button type="submit" className="content-button status-button" disabled={loading}>
                  {loading ? "Adding..." : "Add Transaction"}
                </button>
              </form>
            </div>
          </div>
        )}

        {viewTransaction && (
          <div className="overlay-app is-active">
            <div className="pop-up visible">
              <div className="pop-up__title">
                <h2>Transaction Details</h2>
                <button className="close" onClick={() => setViewTransaction(null)}>×</button>
              </div>
              <div className="modal-form" style={{ maxWidth: "400px", fontSize: "16px" }}>
                <br />
                <p><strong>Type:</strong> {viewTransaction.type}</p>
                <p><strong>Date:</strong> {viewTransaction.datetime
                  ? new Date(viewTransaction.datetime).toLocaleString()
                  : "Unknown"}
                </p>
                <p><strong>Amount:</strong> {viewTransaction.amount} {viewTransaction.currency}</p>
                {viewTransaction.type !== "transfer" && (
                  <>
                    <p><strong>Asset:</strong> {
                      assets.find(a => a.id === parseInt(viewTransaction.asset_id))?.name || "N/A"
                    }</p>
                    <p><strong>Category:</strong> {
                      categories.find(c => c.id === parseInt(viewTransaction.category_id))?.name || "N/A"
                    }</p>
                  </>
                )}
                {viewTransaction.type === "transfer" && (
                  <>
                    <p><strong>From:</strong> {
                      assets.find(a => a.id === parseInt(viewTransaction.from_asset_id))?.name || "N/A"
                    }</p>
                    <p><strong>To:</strong> {
                      assets.find(a => a.id === parseInt(viewTransaction.to_asset_id))?.name || "N/A"
                    }</p>
                  </>
                )}
                {viewTransaction.note && <p><strong>Note:</strong> {viewTransaction.note}</p>}
              </div>
            </div>
          </div>
        )}



        <div className="overlay-app" />
      </div>
    </>
  );
}