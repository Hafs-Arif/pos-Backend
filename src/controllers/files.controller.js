import pool from "../db/index.js";
import path from "path";
import fs from "fs";

// Upload single file (Image, PDF, Video, or AR model)
export const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { entity_type, entity_id, uploaded_by, is_public, is_ar_file } = req.body;
    const file = req.file;

    const result = await pool.query(
      `INSERT INTO files (
        name, url, file_type, entity_type, entity_id, uploaded_by, size, is_public, is_ar_file
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        file.originalname,
        `/uploads/${file.filename}`, // relative path
        getFileType(file.mimetype),
        entity_type,
        entity_id,
        uploaded_by || null,
        file.size,
        is_public || false,
        is_ar_file || false
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { entity_type, entity_id, uploaded_by, is_public } = req.body;

    const insertPromises = req.files.map(file =>
      pool.query(
        `INSERT INTO files (
          name, url, file_type, entity_type, entity_id, uploaded_by, size, is_public
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
          file.originalname,
          `/uploads/${file.filename}`,
          getFileType(file.mimetype),
          entity_type,
          entity_id,
          uploaded_by || null,
          file.size,
          is_public || false
        ]
      )
    );

    const results = await Promise.all(insertPromises);
    const uploaded = results.map(r => r.rows[0]);

    res.status(201).json(uploaded);
  } catch (err) {
    next(err);
  }
};

// Get files for a specific entity (e.g. product, user)
export const getFilesByEntity = async (req, res, next) => {
  const { entityType, entityId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM files WHERE entity_type = $1 AND entity_id = $2",
      [entityType, entityId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Delete a file
export const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM files WHERE file_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Remove physical file (optional)
    const filePath = path.join(process.cwd(), result.rows[0].url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "File deleted", deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Helper to map MIME → file_type ENUM
function getFileType(mime) {
  if (mime.startsWith("image/")) return "Image";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("video/")) return "Video";
  if (mime.includes("model") || mime.endsWith(".glb") || mime.endsWith(".usdz")) return "AR";
  return "Other";
}
