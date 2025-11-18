import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [message, setMessage] = useState("");

  const handleClick = (): void => {
    setMessage("Hello");
  };

  return (
    <div className="home-container">
      <button onClick={handleClick}>Home</button>
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default Home;
