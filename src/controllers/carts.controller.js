import pool from "../db/index.js";

// Get all carts
export const getCarts = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM carts ORDER BY cart_id ASC");
    res.json(result.rows);
  } catch (err) {
    next(err); 
  }
};

// Get a single cart by ID
export const getCartById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM carts WHERE cart_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Get carts by user ID
export const getCartsByUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    // Join products to return useful product info for the frontend (name, price, image)
    const result = await pool.query(
      `SELECT c.*, p.name AS product_name, p.retail_price AS product_price, p.image_url AS product_image
       FROM carts c
       LEFT JOIN products p ON p.product_id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.added_at DESC`,
      [userId]
    );

    // Map rows to a friendly shape
    const rows = result.rows.map((r) => ({
      cart_id: r.cart_id,
      user_id: r.user_id,
      session_id: r.session_id,
      product_id: r.product_id,
      variant_id: r.variant_id,
      quantity: r.quantity,
      expires_at: r.expires_at,
      is_one_click_eligible: r.is_one_click_eligible,
      added_at: r.added_at,
      updated_at: r.updated_at,
      product_name: r.product_name,
      product_price: r.product_price,
      product_image: r.product_image,
    }));

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  const { user_id, session_id, product_id, variant_id, quantity, expires_at, is_one_click_eligible } = req.body;
  try {
    // Check if the same product/variant already exists for this user/session
    const existing = await pool.query(
      `SELECT * FROM carts 
       WHERE (user_id = $1 OR session_id = $2)
       AND product_id = $3
       AND (variant_id = $4 OR variant_id IS NULL)`,
      [user_id, session_id, product_id, variant_id] 
    );

    if (existing.rows.length > 0) {
      // Update quantity instead of inserting duplicate
      const updated = await pool.query(
        `UPDATE carts SET 
           quantity = quantity + $1, 
           updated_at = NOW()
         WHERE cart_id = $2
         RETURNING *`,
        [quantity, existing.rows[0].cart_id]
      );
      return res.status(200).json(updated.rows[0]);
    }

    // Insert new cart item
    const result = await pool.query(
      `INSERT INTO carts (
         user_id, session_id, product_id, variant_id, quantity, 
         expires_at, is_one_click_eligible
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, session_id, product_id, variant_id, quantity, expires_at, is_one_click_eligible]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update cart item (change quantity or other details)
export const updateCart = async (req, res, next) => {
  const { id } = req.params;
  const { quantity, expires_at, is_one_click_eligible } = req.body;
  try {
    const result = await pool.query(
      `UPDATE carts SET
         quantity = COALESCE($1, quantity),
         expires_at = COALESCE($2, expires_at),
         is_one_click_eligible = COALESCE($3, is_one_click_eligible),
         updated_at = NOW()
       WHERE cart_id = $4
       RETURNING *`,
      [quantity, expires_at, is_one_click_eligible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
export const deleteCartItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM carts WHERE cart_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Clear all cart items for a user or session
export const clearCart = async (req, res, next) => {
  const { user_id, session_id } = req.body;
  try {
    const result = await pool.query(
      `DELETE FROM carts 
       WHERE user_id = $1 OR session_id = $2 
       RETURNING *`,
      [user_id, session_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.json({ message: "Cart cleared", removed: result.rowCount });
  } catch (err) {
    next(err);
  }
};
