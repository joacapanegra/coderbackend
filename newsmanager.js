class News {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class NewsManager {
  constructor() {
    this.newsList = [];
    this.lastId = 0;
  }

  addNews(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.newsList.some((news) => news.code === code)) {
      console.log("El código de la noticia ya existe");
      return;
    }

    const news = new News(title, description, price, thumbnail, code, stock);
    news.id = ++this.lastId;
    this.newsList.push(news);
    console.log("Noticia agregada:", news);
  }

  getNews() {
    return this.newsList;
  }

  getNewsById(id) {
    const news = this.newsList.find((news) => news.id === id);
    if (news) {
      return news;
    } else {
      console.log("Noticia no encontrada");
    }
  }
}

// Ejemplo de uso
const newsManager = new NewsManager();

newsManager.addNews(
  "Nueva ley aprobada",
  "Se aprueba ley de protección al medio ambiente",
  0,
  "noticia.jpg",
  "001",
  50
);
newsManager.addNews(
  "Inauguración de nueva sede",
  "La empresa XYZ inaugura su nueva sede en la ciudad",
  0,
  "noticia2.jpg",
  "002",
  30
);

console.log("Todas las noticias:", newsManager.getNews());
console.log("Noticia con ID 1:", newsManager.getNewsById(1));
console.log("Noticia con ID 3:", newsManager.getNewsById(3));
