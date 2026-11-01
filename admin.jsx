
import { useState } from "react";

export default function Admin({ logout }) {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("fitlifeUsers") || "[]")
  );

  function refresh() {
    setUsers(JSON.parse(localStorage.getItem("fitlifeUsers") || "[]"));
  }

  function deleteUser(email) {
    const updated = users.filter(u => u.email !== email);
    localStorage.setItem("fitlifeUsers", JSON.stringify(updated));
    setUsers(updated);
  }

  const reports = users.filter(u => u.fitness?.result);

  return (
    <>
      <nav className="navbar">
        <h2>💪 FIT<span>LIFE</span> ADMIN</h2>
        <button className="logout" onClick={logout}>Logout</button>
      </nav>

      <main className="main">
        <h1>Admin Dashboard 📊</h1>
        <p>Manage and monitor fitness users.</p>

        <div className="result-grid">
          <div className="result-card">
            <h3>Total Users</h3>
            <h2>{users.length}</h2>
          </div>

          <div className="result-card">
            <h3>Fitness Reports</h3>
            <h2>{reports.length}</h2>
          </div>

          <div className="result-card">
            <h3>Active Users</h3>
            <h2>{users.length}</h2>
          </div>
        </div>

        <section className="card">
          <div className="admin-heading">
            <h2>Registered Users</h2>
            <button onClick={refresh}>Refresh</button>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>BMI</th>
                  <th>Fitness Score</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.fitness?.result?.bmi || "--"}</td>
                    <td>{u.fitness?.result?.score ?? "--"}</td>
                    <td>
                      <button className="delete"
                        onClick={() => deleteUser(u.email)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5">No registered users yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
