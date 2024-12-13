const mongoose = require("mongoose");
const axios = require("axios");
const Place = require("../models/place");

// Koneksi MongoDB
mongoose
  .connect("mongodb://localhost:27017/bestpoints", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Unsplash API Configuration
const UNSPLASH_ACCESS_KEY = "0Zac4yMUpD8_XnrB1Ts87sseJQt9PERrPRQLZIIbufs"; // Ganti dengan Access Key Anda
const unsplashEndpoint = "https://api.unsplash.com/photos/random";

// Fungsi untuk mendapatkan URL gambar dari Unsplash
async function fetchUnsplashImage(query) {
  try {
    const response = await axios.get(unsplashEndpoint, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query, // Kata kunci untuk pencarian gambar
        orientation: "landscape",
      },
    });

    return response.data.urls.regular; // URL gambar ukuran reguler
  } catch (err) {
    console.error(`Error fetching image for query "${query}":`, err.message);
    return "https://via.placeholder.com/1280x720"; // URL fallback
  }
}

// Data tempat
const places = [
  {
    title: "Taman Mini Indonesia Indah",
    price: 20000,
    description:
      "Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia",
    location: "East Jakarta, DKI Jakarta",
    query: "Indonesia culture",
  },
  {
    title: "Pantai Kuta",
    price: 0,
    description:
      "Pantai yang terkenal di Bali dengan pemandangan sunset yang indah",
    location: "Kuta, Badung Regency, Bali",
    query: "Bali beach",
  },
  {
    title: "Borobudur",
    price: 25000,
    description:
      "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah",
    location: "Magelang, Central Java",
    query: "Borobudur",
  },
  {
    title: "Kawah Putih",
    price: 50000,
    description:
      "Kawah vulkanik dengan danau berwarna putih di Bandung, Jawa Barat",
    location: "Ciwidey, West Java",
    query: "Kawah Putih",
  },
  {
    title: "Malioboro",
    price: 0,
    description:
      "Jalan utama di Yogyakarta dengan berbagai toko dan kuliner khas",
    location: " Yogyakarta City, Special Region of Yogyakarta",
    query: "Malioboro",
  },
  {
    title: "Pantai Tanjung Aan",
    price: 10000,
    description:
      "Pantai dengan pasir berwarna putih dan air laut yang jernih di Lombok, Nusa Tenggara Barat",
    location: "Lombok, West Nusa Tenggara",
    query: "Pantai Tanjung Aan",
  },
  {
    title: "Bukit Bintang",
    price: 0,
    description: "Kawasan perbelanjaan dan hiburan di Kuala Lumpur, Malaysia",
    location: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
    query: "Bukit Bintang",
  },
  {
    title: "Candi Prambanan",
    price: 25000,
    description:
      "Candi Hindu terbesar di Indonesia yang terletak di Yogyakarta",
    location: "Sleman, Special Region of Yogyakarta",
    query: "Candi Prambanan",
  },
  {
    title: "Danau Toba",
    price: 0,
    description:
      "Danau vulkanik terbesar di Indonesia yang terletak di Sumatera Utara",
    location: "Danau Toba, North Sumatra",
    query: "Danau Toba",
  },
  {
    title: "Kawah Ijen",
    price: 100000,
    description:
      "Kawah vulkanik dengan fenomena blue fire di Banyuwangi, Jawa Timur",
    location: "Banyuwangi, East Java",
    query: "Kawah Ijen",
  },
  {
    title: "Pantai Sanur",
    price: 0,
    description:
      "Pantai di Bali yang cocok untuk berenang dan melihat matahari terbit",
    location: "Denpasar, Bali",
    query: "Pantai Sanur",
  },
  {
    title: "Candi Borobudur",
    price: 25000,
    description:
      "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah",
    location: "Magelang, Central Java",
    query: "Candi Borobudur",
  },
  {
    title: "Pulau Komodo",
    price: 5000000,
    description:
      "Pulau di Indonesia yang terkenal dengan komodo, hewan terbesar di dunia",
    location: "Pulau Komodo, East Nusa Tenggara",
    query: "Pulau Komodo",
  },
  {
    title: "Taman Nasional Gunung Rinjani",
    price: 150000,
    description:
      "Taman nasional yang terletak di Lombok dan memiliki gunung tertinggi kedua di Indonesia",
    location: "Lombok, West Nusa Tenggara",
    query: "Taman Nasional Gunung Rinjani",
  },
  {
    title: "Bukit Tinggi",
    price: 0,
    description:
      "Kota kecil yang terletak di Sumatera Barat dengan arsitektur khas Eropa",
    location: "Bukit Tinggi, West Sumatra",
    query: "Bukit Tinggi",
  },
  {
    title: "Pulau Weh",
    price: 50000,
    description:
      "Pulau yang terletak di ujung barat Indonesia dengan keindahan bawah laut yang luar biasa",
    location: "Pulau Weh, Sabang, Aceh",
    query: "Pulau Weh",
  },
  {
    title: "Taman Safari Indonesia",
    price: 180000,
    description:
      "Taman hiburan keluarga dengan berbagai satwa liar di Cisarua, Bogor",
    location: "Taman Safari Indonesia, Cisarua, West Java",
    query: "Taman Safari Indonesia",
  },
  {
    title: "Gunung Merbabu",
    price: 50000,
    description:
      "Gunung yang terletak di Jawa Tengah dengan pemandangan matahari terbit yang indah",
    location: "Gunung Merbabu, Central Java",
    query: "Gunung Merbabu",
  },
  {
    title: "Pulau Lombok",
    price: 0,
    description: "Pulau di Indonesia yang terkenal dengan keindahan pantainya",
    location: "Pulau Lombok, West Nusa Tenggara",
    query: "Pulau Lombok",
  },
  {
    title: "Tanjung Lesung",
    price: 100000,
    description:
      "Kawasan wisata pantai di Banten yang cocok untuk bersantai dan berenang",
    location: "Tanjung Lesung, Pandeglang, Banten",
    query: "Tanjung Lesung",
  },
];

async function seedPlaces() {
  try {
    await Place.deleteMany({});
    console.log("Existing data deleted.");

    for (let place of places) {
      // Dapatkan URL gambar dari Unsplash
      const imageUrl = await fetchUnsplashImage(place.query);
      const placeData = {
        title: place.title,
        price: place.price,
        description: place.description,
        location: place.location,
        image: imageUrl,
      };

      // Simpan data ke MongoDB
      await Place.create(placeData);
      console.log(`Saved: ${place.title}`);
    }

    console.log("All places have been seeded.");
  } catch (err) {
    console.error("Error seeding places:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedPlaces();
