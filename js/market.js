// API'den veri çekme ve görüntüleme işlemleri
class CryptoAPI {
  constructor() {
    this.baseUrl = "https://api.coingecko.com/api/v3";
  }

  async getCryptoData() {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      return [];
    }
  }
}

// UI işlemleri
class UI {
  constructor() {
    this.cryptoGrid = document.getElementById("cryptoGrid");
    this.loadingSpinner = document.getElementById("loading-spinner");
    this.searchInput = document.getElementById("searchCrypto");
    this.sortSelect = document.getElementById("sortSelect");
  }

  showLoading() {
    this.loadingSpinner.style.display = "block";
    this.cryptoGrid.innerHTML = "";
  }

  hideLoading() {
    this.loadingSpinner.style.display = "none";
  }

  displayCryptos(cryptos) {
    this.cryptoGrid.innerHTML = "";

    cryptos.forEach((crypto) => {
      const priceChangeClass =
        crypto.price_change_percentage_24h >= 0 ? "positive" : "negative";

      const cryptoCard = `
                <div class="crypto-card">
                    <div class="crypto-icon">
                        <img src="${crypto.image}" alt="${crypto.name}">
                    </div>
                    <div class="crypto-info">
                        <h3 class="crypto-name">${crypto.name}</h3>
                        <p class="price">$${crypto.current_price.toLocaleString()}</p>
                        <p class="change ${priceChangeClass}">
                            ${crypto.price_change_percentage_24h.toFixed(2)}%
                        </p>
                        <p class="market-cap">
                            Market Cap: $${crypto.market_cap.toLocaleString()}
                        </p>
                    </div>
                    <div class="glow"></div>
                </div>
            `;

      this.cryptoGrid.innerHTML += cryptoCard;
    });
  }

  // Arama ve filtreleme işlemleri
  filterCryptos(cryptos, searchTerm) {
    return cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  sortCryptos(cryptos, sortBy) {
    switch (sortBy) {
      case "priceAsc":
        return [...cryptos].sort((a, b) => a.current_price - b.current_price);
      case "priceDesc":
        return [...cryptos].sort((a, b) => b.current_price - a.current_price);
      case "changeDesc":
        return [...cryptos].sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );
      default:
        return cryptos; // varsayılan market cap sıralaması
    }
  }
}

// Ana uygulama
class App {
  constructor() {
    this.cryptoAPI = new CryptoAPI();
    this.ui = new UI();

    // Event listeners
    this.ui.searchInput.addEventListener("input", () => this.handleSearch());
    this.ui.sortSelect.addEventListener("change", () => this.handleSort());

    // Veriyi periyodik olarak güncelle
    this.cryptoData = [];
    this.init();
    setInterval(() => this.updateData(), 60000); // Her 1 dakikada bir güncelle
  }

  async init() {
    await this.updateData();
  }

  async updateData() {
    this.ui.showLoading();
    this.cryptoData = await this.cryptoAPI.getCryptoData();
    this.handleSearch(); // Mevcut filtreleri uygula
    this.ui.hideLoading();
  }

  handleSearch() {
    const searchTerm = this.ui.searchInput.value;
    const sortBy = this.ui.sortSelect.value;

    let filteredData = this.ui.filterCryptos(this.cryptoData, searchTerm);
    filteredData = this.ui.sortCryptos(filteredData, sortBy);

    this.ui.displayCryptos(filteredData);
  }

  handleSort() {
    this.handleSearch(); // Mevcut aramayı koruyarak sırala
  }
}

// Uygulamayı başlat
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
