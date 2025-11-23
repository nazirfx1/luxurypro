import { useState } from "react";

const SetupAdminSimple = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple test without fetch
      console.log("Creating admin user...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "32px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Super Admin Setup</h1>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Click the button below to create the super admin user
          </p>
        </div>

        {!success ? (
          <form onSubmit={createAdminUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email</label>
              <input value="nazirfxone@gmail.com" disabled style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f9f9f9" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Name</label>
              <input value="Nazir Ismail" disabled style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f9f9f9" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Role</label>
              <input value="Super Admin" disabled style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#f9f9f9" }} />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "12px", 
                backgroundColor: loading ? "#ccc" : "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Creating..." : "Create Super Admin User"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", color: "#28a745", marginBottom: "16px" }}>✅</div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Success!</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                Super Admin user has been created successfully.
              </p>
              <div style={{ backgroundColor: "#f8f9fa", padding: "16px", borderRadius: "4px", textAlign: "left", fontSize: "14px", marginBottom: "16px" }}>
                <p><strong>Email:</strong> nazirfxone@gmail.com</p>
                <p><strong>Password:</strong> hacksom-1212</p>
                <p><strong>Role:</strong> Super Admin</p>
              </div>
              <button
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  backgroundColor: "#007bff", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px", 
                  fontSize: "16px",
                  cursor: "pointer"
                }}
                onClick={() => window.location.href = '/auth'}
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupAdminSimple;