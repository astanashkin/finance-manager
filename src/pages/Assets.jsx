import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";

const assetIcons = {
  wallet: "💰",
  bank: "🏦",
  card: "💳",
  investment: "📈",
  loan: "💸",
  insurance: "🛡️",
  other: "📦",
};

export default function Assets() {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: "", type: "wallet", balance: 0, currency: "" });
  const [editModal, setEditModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  // get Assets
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

  // get Currency
  useEffect(() => {
    fetch("http://localhost:5000/api/currencies")
      .then((res) => res.json())
      .then((data) => setCurrencies(data))
      .catch((error) => console.error("Error loading currencies:", error));
  }, []);

  // 📌 Добавление актива
  const handleAddAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!newAsset.name) {
      setError("Fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id, ...newAsset }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении актива");
      }

      const createdAsset = await response.json();
      setAssets((prevAssets) => [...prevAssets, createdAsset]); // Обновляем список активов
      setShowModal(false);
      setNewAsset({ name: "", type: "wallet", balance: 0, currency: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = (asset) => {
    setEditAsset(asset);
    setEditModal(true);
  };

  // 📌 Функция обновления актива
  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!editAsset.name) {
      setError("Fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/assets/${editAsset.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAsset),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении актива");
      }

      const updatedAsset = await response.json();
      setAssets((prevAssets) => prevAssets.map((asset) =>
        asset.id === updatedAsset.id ? updatedAsset : asset
      ));
      setEditModal(false);
      setEditAsset(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error deleting asset");

      setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== id));
    } catch (error) {
      setError(error.message);
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

            <div className="content-wrapper1">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    💰
                    Assets
                  </h3>
                  <div className="content-text">
                    The Assets page is your dedicated space for managing all your financial resources in one place.
                    Here, you can track your wallets, bank accounts, cards, investments, and other financial assets.
                    Stay in control of your finances by monitoring balances, managing funds, and making informed financial decisions effortlessly.
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907675.png"
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">List of assets</div>
                <ul>
                  <li className="adobe-product">
                    <div className="button-wrapper">
                      <button
                        className="content-button status-button open"
                        onClick={() => setShowModal(true)}
                      >
                        Add a new asset
                      </button>
                    </div>
                  </li>
                </ul>
                <ul>
                  {assets.length > 0 ? (
                    assets.map((asset) => (
                      <li className="adobe-product" key={asset.id}>
                        <div className="products">
                          <span className="icon">{assetIcons[asset.type] || "📦"}</span>
                          <span>{asset.name}</span>
                        </div>
                        <span className="status">
                          {/* <span className="status-circle green" /> */}
                          {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                        </span>
                        <span className="balance">
                          {asset.balance.toLocaleString()} {asset.currency}
                        </span>
                        <div className="button-wrapper">
                          <button className="status-button1 update" onClick={() => handleEditAsset(asset)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.5-.55 2.87-1.46 3.94l1.42 1.42A7.986 7.986 0 0020 12c0-4.42-3.58-8-8-8zm-8 8c0-1.5.55-2.87 1.46-3.94L4.04 6.64A7.986 7.986 0 002 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z" fill="currentColor" />
                            </svg>
                          </button>

                          <button className="status-button1 delete" onClick={() => handleDeleteAsset(asset.id)}>
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
                      <p>No assets found</p>
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
                <h2>Add New Asset</h2>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddAsset} className="modal-form">
                {error && <p className="text-red-500">{error}</p>}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="input-group__input"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    required
                    placeholder="Enter asset name"
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="type">Type</label>
                  <select
                    id="type"
                    className="input-group__input"
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                  >
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                    <option value="investment">Investment</option>
                    <option value="loan">Loan</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="balance">Balance</label>
                  <input
                    type="text"
                    id="balance"
                    className="input-group__input"
                    value={newAsset.balance === 0 ? "" : newAsset.balance}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) { // Разрешены только числа и десятичные точки
                        setNewAsset({ ...newAsset, balance: value });
                      }
                    }}
                    placeholder="Enter balance"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    className="input-group__input"
                    value={newAsset.currency}
                    onChange={(e) => setNewAsset({ ...newAsset, currency: e.target.value })}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="content-button status-button" disabled={loading}>
                  {loading ? "Adding..." : "Add Asset"}
                </button>
              </form>
            </div>
          </div>
        )}

        {editModal && (
          <div className="overlay-app is-active">
            <div className="pop-up visible">
              <div className="pop-up__title">
                <h2>Edit Asset</h2>
                <button className="close" onClick={() => setEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateAsset} className="modal-form">
                {error && <p className="text-red-500">{error}</p>}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-name">Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    className="input-group__input"
                    value={editAsset.name}
                    onChange={(e) => setEditAsset({ ...editAsset, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-type">Type</label>
                  <select
                    id="edit-type"
                    className="input-group__input"
                    value={editAsset.type}
                    onChange={(e) => setEditAsset({ ...editAsset, type: e.target.value })}
                  >
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                    <option value="card">Card</option>
                    <option value="investment">Investment</option>
                    <option value="loan">Loan</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-balance">Balance</label>
                  <input
                    type="text"
                    id="edit-balance"
                    className="input-group__input"
                    value={editAsset.balance === 0 ? "" : editAsset.balance}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setEditAsset({ ...editAsset, balance: value });
                      }
                    }}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-currency">Currency</label>
                  <select
                    id="edit-currency"
                    className="input-group__input"
                    value={editAsset.currency}
                    onChange={(e) => setEditAsset({ ...editAsset, currency: e.target.value })}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="content-button status-button" disabled={loading}>
                  {loading ? "Updating..." : "Update Asset"}
                </button>
              </form>
            </div>
          </div>
        )}


        <div className="overlay-app" />
      </div>
    </>
  );
}
