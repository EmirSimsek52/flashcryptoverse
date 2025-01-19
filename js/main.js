// Crypto Price Ticker
const cryptoPrices = document.getElementById("cryptoPrices");
const cryptocurrencies = [
  {
    id: "bitcoin",
    symbol: "BTC",
  },
  {
    id: "ethereum",
    symbol: "ETH",
  },
  {
    id: "binancecoin",
    symbol: "BNB",
  },
  {
    id: "cardano",
    symbol: "ADA",
  },
  {
    id: "polkadot",
    symbol: "DOT",
  },
  {
    id: "ripple",
    symbol: "XRP",
  },
  {
    id: "solana",
    symbol: "SOL",
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
  },
];

// CoinGecko API'den gerçek kripto fiyatlarını al
async function fetchCryptoPrices() {
  try {
    const ids = cryptocurrencies.map((crypto) => crypto.id).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await response.json();

    cryptoPrices.innerHTML = "";

    cryptocurrencies.forEach((crypto) => {
      const coinData = data[crypto.id];
      if (coinData) {
        const price = coinData.usd;
        const change = coinData.usd_24h_change;
        const changeClass = change >= 0 ? "text-success" : "text-danger";
        const formattedChange = change.toFixed(2);
        const formattedPrice = price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const priceElement = document.createElement("div");
        priceElement.className = "crypto-item px-4 py-2";
        priceElement.innerHTML = `
                    <span class="crypto-name fw-bold">${crypto.symbol}</span>
                    <span class="crypto-price ms-2">${formattedPrice}</span>
                    <span class="crypto-change ms-2 ${changeClass}">(${formattedChange}%)</span>
                `;

        cryptoPrices.appendChild(priceElement);
      }
    });
  } catch (error) {
    console.error("Kripto fiyatları alınırken hata oluştu:", error);
    cryptoPrices.innerHTML =
      "<div class='text-danger'>Fiyatlar yüklenirken bir hata oluştu.</div>";
  }
}

// Her 1 dakikada bir fiyatları güncelle (CoinGecko API rate limit'ine uygun)
setInterval(fetchCryptoPrices, 60000);
fetchCryptoPrices(); // İlk yükleme

// Image Slider
const imageSlider = document.getElementById("imageSlider");
const slideTrack = imageSlider.querySelector(".slide-track");

const images = [
  { src: "images/hero/hero1.webp", alt: "Cryptocurrency 1" },
  { src: "images/hero/hero2.jpg", alt: "Cryptocurrency 2" },
  { src: "images/hero/hero3.webp", alt: "Cryptocurrency 3" },
  { src: "images/hero/hero4.jpg", alt: "Cryptocurrency 4" },
  { src: "images/hero/hero5.png", alt: "Cryptocurrency 5" },
];

// Resimleri iki kez ekleyerek sonsuz döngü efekti oluştur
function loadImages() {
  const allImages = [...images, ...images]; // Resimleri iki kez kopyala

  allImages.forEach((img) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.alt;
    image.className = "img-fluid rounded shadow";

    slide.appendChild(image);
    slideTrack.appendChild(slide);
  });
}

loadImages(); // Resimleri yükle
