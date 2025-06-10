  import React from "react";

const cardData = [
  { title: "Active Orders", value: "48", icon: "📦", onClick: () => alert("Active Orders Clicked") },
  { title: "New Orders", value: "27", icon: "🛒", onClick: () => alert("New Orders Clicked") },
  {
    title: "Total Revenue",
    value: "₹ 4.8 Crores\n↑ 10.8% Than last Month",
    icon: "💰",
    onClick: () => alert("Total Revenue Clicked"),
  },
  { title: "Customer Satisfaction", value: "92%", icon: "😊", onClick: () => alert("Customer Satisfaction Clicked") },
  { title: "Farmers", value: "150", icon: "👩‍🌾", onClick: () => alert("Farmers Clicked") },
  { title: "Milk Products", value: "75", icon: "🥛", onClick: () => alert("Milk Products Clicked") },
  { title: "Buffaloes", value: "120", icon: "🐃", onClick: () => alert("Buffaloes Clicked") },
];

// Monthly sales data (Lakhs)
const salesData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 160 },
  { month: "Mar", value: 140 },
  { month: "Apr", value: 180 },
  { month: "May", value: 220 },
  { month: "Jun", value: 200 },
];

// Recent notifications
const recentActivities = [
  { time: "2 min ago", text: "New order #4582 received" },
  { time: "10 min ago", text: "Order #4570 has been dispatched" },
  { time: "30 min ago", text: "Customer feedback received" },
  { time: "1 hour ago", text: "New product added to catalog" },
];

// Fulfillment rate 0 to 100
const fulfillmentRate = 87;

function AdminDashboard() {
  const maxValue = Math.max(...salesData.map((d) => d.value));

  // Calculate stroke for progress ring
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressStroke = circumference * (1 - fulfillmentRate / 100);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#f0f1f5", // light background color
        color: "#333",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1000px", // Minimized width of the dashboard
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#4A90E2", // blue color for header
          padding: "10px 20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.7)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontWeight: "900", fontSize: "2.5rem", margin: 0, letterSpacing: "2px", color: "#ffffff" }}>
          Admin Dashboard
        </h1>
        <p style={{ opacity: 0.85, marginTop: "8px", fontSize: "1.1rem", color: "#e0e7ff" }}>
          Overview of key metrics and recent activity
        </p>
      </header>

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          gap: "40px",
          padding: "30px",
          maxWidth: "1000px", // Minimized width of the dashboard
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Left side - Cards */}
        <section style={{ flex: 1 }}>
          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
            }}
          >
            {cardData.map(({ icon, title, value, onClick }, idx) => (
              <div
                key={idx}
                style={{
                  background: "#A8E6CF", // Light green color for cards
                  borderRadius: "18px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "background 0.3s ease, transform 0.3s ease",
                  color: "#333", // text color
                }}
                onClick={onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C8E6C9"; // lighter green on hover
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#A8E6CF";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{icon}</div>
                <div style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>{title}</div>
                <div style={{ fontSize: "16px", whiteSpace: "pre-line", fontWeight: "600" }}>{value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Right side - Fulfillment + Sales + Recent Activity */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Order Fulfillment Rate */}
          <div
            style={{
              background: "#B0BEC5", // Light dark color for order fulfillment card
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "white",
              flexShrink: 0,
            }}
          >
            <h2 style={{ margin: "0 0 24px 0", fontWeight: "900", fontSize: "1.9rem" }}>Order Fulfillment Rate</h2>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="16"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#4ADE80"
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset={progressStroke}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
              <text x="80" y="90" textAnchor="middle" fontSize="36" fontWeight="700" fill="#d1fae5">
                {fulfillmentRate}%
              </text>
            </svg>
            <p style={{ marginTop: "22px", fontSize: "17px", fontWeight: "700", color: "#bbf7d0", textAlign: "center" }}>
              Orders fulfilled successfully within time
            </p>
          </div>

          {/* Monthly Sales Bar Chart */}
          <div
            style={{
              background: "#383B5C", // dark background for sales section
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              padding: "32px",
              color: "white",
            }}
          >
            <h2 style={{ fontWeight: "900", marginBottom: "26px", fontSize: "1.9rem" }}>Monthly Sales (Lakhs)</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {salesData.map(({ month, value }, idx) => {
                const barWidthPercent = (value / maxValue) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#d1d5db",
                    }}
                  >
                    <div style={{ width: "60px" }}>{month}</div>
                    <div
                      style={{
                        flexGrow: 1,
                        height: "28px",
                        marginLeft: "18px",
                        background: "#5D5E8B", // bar background
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidthPercent}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #22c55e, #16a34a)", // bar gradient
                          borderRadius: "18px 0 0 18px",
                          boxShadow: "0 3px 8px rgba(34,197,94,0.8)",
                          transition: "width 0.7s ease",
                        }}
                      />
                    </div>
                    <div style={{ width: "60px", textAlign: "right", marginLeft: "16px", color: "#bbf7d0" }}>{value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            style={{
              background: "#5B647E", // dark background for activity section
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              padding: "32px",
              color: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2 style={{ fontWeight: "900", marginBottom: "24px", fontSize: "1.9rem" }}>Recent Activity</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "280px", overflowY: "auto" }}>
              {recentActivities.map(({ time, text }, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "18px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    color: "#e5e7eb",
                  }}
                >
                  <span style={{ opacity: 0.75, fontSize: "13px", fontWeight: "600" }}>{time} - </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "#2A2B3E", // darker shade for footer
          color: "#9ca3af",
          padding: "15px 20px",
          textAlign: "center",
          fontSize: "14px",
          letterSpacing: "0.8px",
        }}
      >
        &copy; 2024 Admin Dashboard. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminDashboard;

  