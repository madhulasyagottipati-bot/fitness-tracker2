
import { useState } from "react";
import User from "./User";
import Admin from "./Admin";

export default function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("fitlifeSession") || "null")
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function signup(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("fitlifeUsers") || "[]");

    if (users.some(u => u.email === email)) {
      setError("Email already registered!");
      return;
    }

    const newUser = { name, email, password, role: "user", fitness: null };
    users.push(newUser);
    localStorage.setItem("fitlifeUsers", JSON.stringify(users));
    saveLogin(newUser);
  }

  function login(e) {
    e.preventDefault();

    if (email === "admin" && password === "admin123") {
      saveLogin({ name: "Admin", email: "admin", role: "admin" });
      return;
    }

    const users = JSON.parse(localStorage.getItem("fitlifeUsers") || "[]");
    const found = users.find(u => u.email === email && u.password === password);

    if (found) saveLogin(found);
    else setError("Invalid email or password!");
  }

  function saveLogin(user) {
    localStorage.setItem("fitlifeSession", JSON.stringify(user));
    setCurrentUser(user);
    setError("");
  }

  function logout() {
    localStorage.removeItem("fitlifeSession");
    setCurrentUser(null);
    setPage("login");
  }

  if (currentUser) {
    return currentUser.role === "admin"
      ? <Admin logout={logout} />
      : <User user={currentUser} logout={logout} />;
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>💪 FIT<span>LIFE</span></h1>
        <h2>{page === "login" ? "Welcome Back!" : "Create Account"}</h2>
        <p>Your Personal Fitness Tracker</p>

        <form onSubmit={page === "login" ? login : signup}>
          {page === "signup" && (
            <input placeholder="Full Name" value={name}
              onChange={e => setName(e.target.value)} required />
          )}

          <input placeholder="Email / Admin Username"
            value={email} onChange={e => setEmail(e.target.value)} required />

          <input type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />

          <p className="error">{error}</p>
          <button type="submit">
            {page === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <p>
          {page === "login" ? "New user? " : "Already registered? "}
          <span className="link" onClick={() => {
            setPage(page === "login" ? "signup" : "login");
            setError("");
          }}>
            {page === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
