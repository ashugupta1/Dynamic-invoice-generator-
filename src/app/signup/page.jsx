"use client";

import Link from "next/link";
import { useState } from "react";

export default function signUp() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  return (
    <div>
      <h1>Sign Up</h1>

      <label htmlFor="username">Username:</label>
      <input
        type="text"
        name="username"
        id="username"
        value={user.username}
        onChange={(e) => {
          setUser({ ...user, username: e.target.value });
        }}
      />
      <br />
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
      <Link href="/signup">Log In</Link>
    </div>
  );
}
