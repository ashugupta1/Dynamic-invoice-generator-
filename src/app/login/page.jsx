"use client";

import Link from "next/link";

export default function logIn() {
  const handleSubmit = () => {
    console.log("Form submitted")
  };

  return (
    <div>
      <h1>Login</h1>
      <label htmlFor="email">Email:</label>
      <input
        type="text"
        name="email"
        id="email"
        value={user.email}
        onChange={(e) => {
          setUser({ ...user, email: e.target.value });
        }}
      />
      <br />
      <label htmlFor="password">password:</label>
      <input
        type="password"
        name="password"
        id="password"
        value={user.password}
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
      />
      <br />
      <button onSubmit={handleSubmit}>Sign Up</button>

      <Link href="/signup" className="text-slate-950">
        Log In
      </Link>
    </div>
  );
}
