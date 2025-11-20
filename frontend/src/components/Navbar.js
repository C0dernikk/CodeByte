import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <div
          className="navbar-brand"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <img
            src="/codebyte.png"
            alt="CodeByte logo"
            style={{
              height: 48,
              width: "auto",
              objectFit: "contain",
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
