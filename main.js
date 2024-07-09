const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
const currentUrl = window.location.href;
let newsApiUrl = "";
// 개발시 / 배포시 에 따라 api url 처리
if (currentUrl === "https://cool-times.netlify.app") {
    newsApiUrl = `https://noona-times-v2.netlify.app/top-headlines`;
} else {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`;
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
