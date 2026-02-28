const User = require("../models/User");

exports.updateTrustScore = async (userId, rating) => {

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const currentTrust = user.trustScore;

  // Convert rating (1–5) to 0–100 scale
  const ratingScore = (rating / 5) * 100;

  // Weighted update (70% old, 30% new)
  const updatedTrust =
    (currentTrust * 0.7) + (ratingScore * 0.3);

  user.trustScore = Math.min(100, Math.max(0, updatedTrust));
  await user.save();

  return user.trustScore;
};