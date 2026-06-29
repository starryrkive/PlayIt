import User from "../models/User.js"; // Import User model for database operations
import bcrypt from "bcrypt"; // Import bcrypt for password hashing and comparison

// Change user password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated request
    const { oldPassword, newPassword } = req.body; // Extract passwords from request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password matches stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password and save it
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // Respond with success message
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated request
    const { password } = req.body; // Extract password for verification

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password before deletion
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password is incorrect" });

    // Delete user record from database
    await User.findByIdAndDelete(userId);

    // Respond with success message
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
