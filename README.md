# 뉴스 타임즈 만들기 (3주 1일 2일,3일, 4일, 5일, 6일, 7일)

## 배포 URL
[뉴스타임즈만들기] : https://cool-times.netlify.app/

## 1일차 : 24-07-08
1. API란? : 인터넷과 소통하기- 
2. API 문서를 읽는 법
3. API 호출하는 도구 : Postman
```
 - 과제 없음
```
## 2일차 : 24-07-09
4. 자바스크립트에서 API를 불러보자
5. 자바스크립트의 동작 원리 : api를 이해 하기 위한 필수 개념
6. 자바스크립트에서 API호출하기 : async, await, fetch 이 세 개 만 기억해

#### 과제 : 6탄 까지 내용 도메인 공유
- api 구성 해서 데이터 받는것 까지 구성
- 로컬 / 배포에 따라 Api Url 다른게 구성
- 부트스크랩을 활용한 기본 UI구성
- 메뉴구성/카드형 기사/ 페이징 / 키워드 검색
```
const API_KEY = `7713fec*****************d292`;
// url 주소 가져오기
const currentUrl = window.location.href;
let newsApiUrl = "";
// 개발시 / 배포시 에 따라 api url 처리
if (currentUrl === "https://cool-times.netlify.app/") {
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

/* 결과
(20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
그중 1개만
{
    "source": {
        "id": null,
        "name": "Kormedi.com"
    },
    "author": "권순일 기자",
    "title": "“고기만 굽지 말고”...바비큐 건강하게 잘 먹는 법 3 - 코메디닷컴",
    "description": "야외에서 바비큐를 즐기기에 좋은 시기다. 고기를 불에 직접 구워 먹으면 해롭다는 것은 상식. 먹는 즐거움의 하나인 바비큐를 포기하지 않으면서 잘 먹는 방법은 없는 걸까. 미국 시사 주간지 타임 등의 자료를 토대로 바비큐, 건강하게 먹는 방법을 알아봤다.“고기 외에 과일, 채소, 해산물도 구워라”=고기를 300도 이상 고온에서 조리하면 아미노산과 크레아틴이 반응하면서 헤테로사이클릭아민류(HCAs)라 불리는 발암 물질이 생성된다. 과일과 채소는 다",
    "url": "https://kormedi.com/1703420/고기만-굽지-말고-바비큐-건강하게-잘-먹는-법-3/",
    "urlToImage": "https://kormedi.com/wp-content/uploads/2024/07/gettyimages-a10737588-700x467.jpg",
    "publishedAt": "2024-07-08T02:36:22Z",
    "content": ", . [=]\r\n. . . , .\r\n , , = 300 (HCAs) . .\r\n, , , , , HCAs . , , , . .\r\n= 2 . , , B . .\r\n . . , .\r\n=, , , , . 30 HCAs .\r\n . 100g 1g HCAs . .\r\n. kormedi.com / -, AI"
}
*/

```

## 3일차 :24-07-10
7. 타임즈 뉴스 웹페이지를 꾸며보자
8. 뉴스를 그려주자 : render

#### 과제 : 8탄 까지 내용 도메인 공유
- 타임즈 뉴스 UI 구성
- API 내용 그려주기
```
const API_KEY = `7713fec*****************d292`;
const currentUrl = window.location.href; // 현 URL 정보가져오기
let arraySplit = currentUrl.split("/"); // url 분리하기
let newsApiUrl = "";
// 개발시 / 배포시 에 따라 api url 처리
if (arraySplit[2] === "127.0.0.1:5500") {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`;
} else {
    // 배포 새로운주소로
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
                    <a href="${news.url}" class="btn btn-light" taget="_blank">기사링크</a>
                </div>
            </div>
        </div>`
        )
        .join("");
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
};
getLastNews();

```
