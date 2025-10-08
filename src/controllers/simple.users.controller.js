import pool from "../db/index.js";

// Simple login controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user with matching email and password
    const query = "SELECT user_id, email, role FROM users WHERE email = $1 AND password_hash = $2";
    const result = await pool.query(query, [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Return user data
    return res.status(200).json({
      success: true,
      data: {
        user: result.rows[0]
      },
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};