import React from "react";

const TestAuth = () => {
  const testDirectRedirect = () => {
    console.log("Testing direct redirect to backend...");
    window.location.href = "http://127.0.0.1:3000/auth/spotify";
  };

  const testProxyRedirect = () => {
    console.log("Testing proxy redirect...");
    window.location.href = "/auth/spotify";
  };

  const testOpenNewWindow = () => {
    console.log("Testing in new window...");
    window.open("http://127.0.0.1:3000/auth/spotify", "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auth Testing</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
        }}
      >
        <button onClick={testDirectRedirect} style={{ padding: "10px" }}>
          Test Direct Backend URL
        </button>
        <button onClick={testProxyRedirect} style={{ padding: "10px" }}>
          Test Proxy URL
        </button>
        <button onClick={testOpenNewWindow} style={{ padding: "10px" }}>
          Test New Window
        </button>
      </div>
    </div>
  );
};

export default TestAuth;
