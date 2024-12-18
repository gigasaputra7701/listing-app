// Fungsi untuk menghitung total rating dan rata-rata rating
const calculateAverageRating = (reviews) => {
  let totalRating = 0;
  let totalReviews = reviews.length;

  // Menjumlahkan semua rating
  for (const review of reviews) {
    totalRating += review.rating;
  }

  // Menghitung rata-rata rating
  let averageRating =
    totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

  return averageRating;
};

module.exports = calculateAverageRating;
