const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
const currentUrl = window.location.href;
console.log(currentUrl);
let newsApiUrl = "";
if (currentUrl === "https://cool-times.netlify.app/") {
    newsApiUrl = `https://noona-times-v2.netlify.app/top-headlines`;
    console.log("global", newsApiUrl);
} else {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    console.log("local", newsApiUrl);
}
let news = [];
const getLastNews = async () => {
    const url = new URL(newsApiUrl);

    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log(news);
};

getLastNews();
