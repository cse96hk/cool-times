const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
const currentUrl = window.location.href; // 현 URL 정보가져오기
let arraySplit = currentUrl.split("/"); // url 분리하기
let newsApiUrl = "";
// 개발시 / 배포시 에 따라 api url 처리
if (arraySplit[2] === "127.0.0.1:5500") {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`;
} else {
    newsApiUrl = ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;
}

let newsList = [];
const getLastNews = async () => {
    const url = new URL(newsApiUrl);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    renderNews();
    console.log(newsList);
};

const renderNews = () => {
    const newsHTML = newsList
        .map(
            (news) => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${news.urlToImage}" onerror="this.onerror=null; this.src='https://unsplash-assets.imgix.net/empty-states/photos.png?auto=format&fit=crop&q=100'" class="card-img-top"  >
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.description}</p>
                    <p class="card-text">${news.source.name} * ${news.publishedAt}</p>
                    <a href="${news.url}" class="btn btn-light" target="_blank">기사링크</a>
                </div>
            </div>
        </div>`
        )
        .join("");
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
};
getLastNews();
