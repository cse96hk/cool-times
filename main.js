const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
let news = [];
const getLastNews = async () => {
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    // noona API 배포에만 사용
    const url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log(news);
};

getLastNews();
