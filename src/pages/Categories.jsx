import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";

const categoryIcons = {
  expense: "💸",
  income: "💰",
};

export default function Categories() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); // Добавляем состояние категорий
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [editCategory, setEditCategory] = useState(null);
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

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/categories?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Ошибка загрузки категорий:", error));
  }, [user]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!newCategory.name || !newCategory.type) {
      setError("Заполните все поля!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id, ...newCategory }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении категории");
      }

      const createdCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, createdCategory]);
      setShowModal(false);
      setNewCategory({ name: "", type: "expense" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setEditModal(true);
  };

  // 📌 Функция обновления категории
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!editCategory.name || !editCategory.type) {
      setError("Заполните все поля!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${editCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editCategory),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении категории");
      }

      const updatedCategory = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
      setEditModal(false);
      setEditCategory(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error deleting category");

      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
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

            <div className="content-wrapper2">
              {/* Welcome text */}
              <div className="content-wrapper-header">
                <div className="content-wrapper-context">
                  <h3 className="img-content">
                    💰
                    Categories
                  </h3>
                  <div className="content-text">
                    The Categories page is your dedicated space for organizing and managing your financial transactions.
                    Here, you can create, edit, and delete categories for expenses and income, ensuring a clear structure for your financial records.
                    By categorizing your transactions, you gain better insights into your spending habits and income sources,
                    allowing for smarter budgeting and financial planning.
                  </div>
                </div>
                <img
                  className="content-wrapper-img"
                  src="https://cdn-icons-png.flaticon.com/512/1907/1907675.png"
                  alt=""
                />
              </div>

              <div className="content-section">
                <div className="content-section-title">List of categories</div>
                <ul>
                  <li className="adobe-product">
                    <div className="button-wrapper">
                      <button
                        className="content-button status-button open"
                        onClick={() => setShowModal(true)}
                      >
                        Add a new category
                      </button>
                    </div>
                  </li>
                </ul>
                <ul>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li className="adobe-product" key={category.id}>
                        <div className="products">
                          <span className="icon">{categoryIcons[category.type] || "🏷️"}</span>
                          <span>{category.name}</span>
                        </div>
                        <span className="status">
                          {/* <span className="status-circle green" /> */}
                          {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                        </span>
                        <div className="button-wrapper">
                          {/* Кнопка Update */}
                          <button className="status-button1 update" onClick={() => handleEditCategory(category)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.5-.55 2.87-1.46 3.94l1.42 1.42A7.986 7.986 0 0020 12c0-4.42-3.58-8-8-8zm-8 8c0-1.5.55-2.87 1.46-3.94L4.04 6.64A7.986 7.986 0 002 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z" fill="currentColor" />
                            </svg>
                          </button>

                          {/* Кнопка Delete */}
                          <button className="status-button1 delete" onClick={() => handleDeleteCategory(category.id)}>
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
                      <p>No categories found</p>
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
                <h2>Add New Category</h2>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleAddCategory} className="modal-form">
                {error && <p className="text-red-500">{error}</p>}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="input-group__input"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                    placeholder="Enter category name"
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="type">Type</label>
                  <select
                    id="type"
                    className="input-group__input"
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <button type="submit" className="content-button status-button" disabled={loading}>
                  {loading ? "Adding..." : "Add Category"}
                </button>
              </form>
            </div>
          </div>
        )}

        {editModal && (
          <div className="overlay-app is-active">
            <div className="pop-up visible">
              <div className="pop-up__title">
                <h2>Edit Category</h2>
                <button className="close" onClick={() => setEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleUpdateCategory} className="modal-form">
                {error && <p className="text-red-500">{error}</p>}

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-name">Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    className="input-group__input"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-group__label" htmlFor="edit-type">Type</label>
                  <select
                    id="edit-type"
                    className="input-group__input"
                    value={editCategory.type}
                    onChange={(e) => setEditCategory({ ...editCategory, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <button type="submit" className="content-button status-button" disabled={loading}>
                  {loading ? "Updating..." : "Update Category"}
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
