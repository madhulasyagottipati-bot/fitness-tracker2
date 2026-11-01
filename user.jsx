
import { useState } from "react";

export default function User({ user, logout }) {
  const [data, setData] = useState({
    age: "", gender: "", height: "",
    weight: "", steps: "", exercise: ""
  });

  const [result, setResult] = useState(
    user.fitness?.result || null
  );

  function update(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function calculate(e) {
    e.preventDefault();

    const age = Number(data.age);
    const height = Number(data.height);
    const weight = Number(data.weight);
    const steps = Number(data.steps);
    const exercise = Number(data.exercise);

    if (age <= 0 || height <= 0 || weight <= 0 ||
        steps < 0 || exercise < 0 || !data.gender) {
      alert("Enter valid details!");
      return;
    }

    const bmi = weight / ((height / 100) ** 2);

    const status = bmi < 18.5 ? "Underweight" :
      bmi < 25 ? "Normal" :
      bmi < 30 ? "Overweight" : "Obese";

    const calories = data.gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    let score = 0;
    score += bmi >= 18.5 && bmi < 25 ? 40 : 20;
    score += steps >= 10000 ? 30 : steps >= 7000 ? 20 : 10;
    score += exercise >= 30 ? 30 : exercise >= 15 ? 20 : 10;

    const output = {
      bmi: bmi.toFixed(1),
      status,
      calories: Math.round(calories),
      steps,
      exercise,
      score,
      level: score >= 85 ? "Excellent" :
        score >= 65 ? "Good" : "Needs Improvement"
    };

    setResult(output);

    const users = JSON.parse(localStorage.getItem("fitlifeUsers") || "[]");

    const updated = users.map(u =>
      u.email === user.email
        ? { ...u, fitness: { ...data, result: output } }
        : u
    );

    localStorage.setItem("fitlifeUsers", JSON.stringify(updated));

    const session = JSON.parse(localStorage.getItem("fitlifeSession"));
    localStorage.setItem("fitlifeSession",
      JSON.stringify({ ...session, fitness: { ...data, result: output } })
    );
  }

  return (
    <>
      <nav className="navbar">
        <h2>💪 FIT<span>LIFE</span></h2>
        <div>Welcome, {user.name}
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="main">
        <h1>Fitness Dashboard 🏃</h1>
        <p>Track your daily health and fitness.</p>

        <form className="card" onSubmit={calculate}>
          <h2>Personal Details</h2>

          <div className="form-grid">
            <input name="age" type="number" min="1"
              placeholder="Age" value={data.age} onChange={update} required />

            <select name="gender" value={data.gender}
              onChange={update} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input name="height" type="number" min="1"
              placeholder="Height (cm)" value={data.height} onChange={update} required />

            <input name="weight" type="number" min="1"
              placeholder="Weight (kg)" value={data.weight} onChange={update} required />

            <input name="steps" type="number" min="0"
              placeholder="Daily Steps" value={data.steps} onChange={update} required />

            <input name="exercise" type="number" min="0"
              placeholder="Exercise Minutes" value={data.exercise} onChange={update} required />
          </div>

          <button type="submit">Calculate Fitness</button>
        </form>

        {result && (
          <section className="results">
            <h2>Your Fitness Report</h2>

            <div className="result-grid">
              <div className="result-card">
                <h3>BMI</h3>
                <h2>{result.bmi}</h2>
                <p>{result.status}</p>
              </div>

              <div className="result-card">
                <h3>Calories</h3>
                <h2>{result.calories}</h2>
                <p>Estimated kcal/day</p>
              </div>

              <div className="result-card">
                <h3>Daily Steps</h3>
                <h2>{result.steps}</h2>
              </div>

              <div className="result-card">
                <h3>Exercise</h3>
                <h2>{result.exercise} min</h2>
              </div>

              <div className="result-card">
                <h3>Fitness Score</h3>
                <h2>{result.score}/100</h2>
                <p>{result.level}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
