import { useState } from "react";

const TestComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Drawer: Slides in from the left */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "250px",
          height: "100%",
          backgroundColor: "lightblue",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1000,
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
        }}
      >
        <h2>Drawer Content</h2>
        <p>This is the sidebar drawer.</p>
        {/* Add more content here as needed */}
      </div>

      {/* Main Container: Responsive and shifts when drawer opens */}
      <div
        style={{
          marginRight: isOpen ? "250px" : "0",
          transition: "margin-left 0.3s ease-in-out",
          padding: "20px",
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#f0f0f0",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isOpen ? "Close Drawer" : "Open Drawer"}
        </button>
        <h1>Main Content</h1>
        <p>
          This is the main container. It adjusts responsively when the drawer
          opens by shifting to the right. The content here can be made fully
          responsive using CSS media queries or flex/grid layouts as needed.
        </p>
        {/* Add your main content here */}
      </div>
    </div>
  );
};

export default TestComponent;
