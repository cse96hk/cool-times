const currentUrl = window.location.href;
console.log(currentUrl);
const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
const localApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
const globalApiUrl = `https://noona-times-v2.netlify.app/top-headlines`;
let news = [];
const getLastNews = async () => {
    const url = new URL(globalApiUrl);

    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log(news);
};

getLastNews();
