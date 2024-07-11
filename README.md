# 뉴스 타임즈 만들기 (3주 1일 2일,3일, 4일, 5일, 6일, 7일)

## News API
[뉴스 API] : https://newsapi.org/

## 배포 URL
[뉴스타임즈만들기] : https://cool-times.netlify.app/

## 4일차 : 24-07-11
9. 카테고리별 검색
10. 키워드별 검색

#### 과제 : 10탄 까지 내용 도메인 공유
- 피드백 내용 : 모바일 버전이 좀더 정리가 되었으며 좋겠습니다
: 모바일 관련 구성 검색바, 사이드바 등
- 카테고리 구성
- 검색 구성

```
// 변수
const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`;
const currentUrl = window.location.href; // 현 URL 정보가져오기
let arraySplit = currentUrl.split("/"); // url 분리하기
let newsApiUrl = "";
let newsList = [];
let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-btn");
let searchIcon = document.getElementById("search-icon");
const menus = document.querySelectorAll(".menus button");
const sideMenu = document.getElementById("side-menu");
const sideMenus = document.querySelectorAll(".menu-content button");
let category = "Home";
const closeMenu = document.getElementById("close-menu");

// 검색 아이콘 토굴
searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("d-none");
    searchBtn.classList.toggle("d-none");
});

// 피시용 메뉴 클릭시
menus.forEach((menu) =>
    menu.addEventListener("click", (event) => {
        menus.forEach((menu) => menu.classList.remove("active"));
        event.target.classList.add("active");
        // 모든 탭의 폰트를 기본 폰트로 설정
        menus.forEach((menu) => {
            menu.style.fontWeight = "normal";
        });
        event.target.style.fontWeight = "bold";
        getByMenu(event);
    })
);

// 사이드바메뉴 클릭시
sideMenus.forEach((menu) =>
    menu.addEventListener("click", (event) => {
        sideMenus.forEach((menu) => menu.classList.remove("active"));
        event.target.classList.add("active");
        // 모든 탭의 폰트를 기본 폰트로 설정
        sideMenus.forEach((menu) => {
            menu.style.color = "#ffffff";
        });
        event.target.style.color = "yellow";
        sideMenu.classList.remove("active");
        getByMenu(event);
    })
);

// 개발시 / 배포시 에 따라 api url 처리
if (arraySplit[2] === "127.0.0.1:5500") {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=kr&pageSize=12&apiKey=${API_KEY}`;
} else {
    newsApiUrl = ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;
}

// 입력상자에서 엔터입력 검색
searchBtn.addEventListener("click", (event) => searchPost(event));
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault(); // 폼 제출 방지
        searchPost();
    }
});

// 검색
const searchPost = async (event) => {
    let searchQuery = searchInput.value;
    console.log("검색어", searchQuery);
    if (searchQuery == "") {
        alert("검색어를 입력해주세요!");
        searchInput.focus();
        return;
    } else {
        const url = new URL(newsApiUrl);
        url.searchParams.set("q", searchQuery);
        const response = await fetch(url);
        const data = await response.json();
        newsList = data.articles;

        if (newsList.length == 0) {
            renderNoData();
        } else {
            renderNews();
        }
    }
};

// 기사가져오기
const getLastNews = async (searchQuery) => {
    const url = new URL(newsApiUrl);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    renderNews();
    console.log(newsList);
};

// 메뉴 클릭시 기사 가져오기
const getByMenu = async (event) => {
    category = event.target.textContent;
    const url = new URL(newsApiUrl);
    if (category !== "Home") {
        url.searchParams.set("category", category);
    } else {
        url.searchParams.delete("category");
    }

    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;

    renderNews();
};

// 기사 없을때 처리
const descriptionDataCheck = (description) => {
    if (description == null || description == "") {
        return "기사없음";
    } else {
        if (description.length > 200) {
            //200자를 초과 말줄임 처리
            return (description = description.substr(0, 200) + "...");
        } else {
            return description;
        }
    }
};

// 가져오기 데이터 그려주기
const renderNews = () => {
    const newsHTML = newsList
        .map(
            (news) => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${news.urlToImage}" onerror="this.onerror=null; this.src='images/noimg.jpg'" class="card-img-top"  >
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${descriptionDataCheck(news.description)}</p>
                    <a href="${news.url}" class="btn btn-light" target="_blank">기사링크</a>
                </div>
                <div class="card-footer text-body-secondary d-flex justify-content-between">
                ${news.source.name == null ? "no source" : news.source.name}
                <div>${moment(news.publishedAt).startOf("day").fromNow()}</div>
                </div>
            </div>
        </div>`
        )
        .join("");
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
};

// 데이터 없을때 그려주기
const renderNoData = () => {
    const newsHTML = `<main class="px-3 text-center">
    <h1>요청한 데이터가 없습니다.</h1>
    <p class="lead">요청하신  데이터가 없습니다. 새로고침 후 다시 검색하세요.</p>
    <p class="lead">
      <a href="/" class="btn btn-lg btn-light fw-bold border-white bg-white">새로고침</a>
    </p>
  </main>`;
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
};
getLastNews();

// SIDE MENU
document.addEventListener("DOMContentLoaded", function () {
    // "전체" 탭을 초기 활성화 상태로 설정
    let allTab = document.getElementById("Home");
    allTab.classList.add("active");
    allTab.style.fontWeight = "bold";
    const menuToggle = document.getElementById("menu-toggle");

    menuToggle.addEventListener("click", function () {
        sideMenu.classList.add("active");
    });

    closeMenu.addEventListener("click", function () {
        sideMenu.classList.remove("active");
    });

    // Prevent body scroll when side menu is open
    sideMenu.addEventListener("transitionend", function () {
        if (sideMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });
});

```
  

- 
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
const formatDateTime = (inputDateTime) => {
    const date = new Date(inputDateTime);
    console.log(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
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
                    <p class="card-text">${news.description == null ? "기사없음" : news.description}</p>
                    <p class="card-text">${news.source.name} * ${formatDateTime(news.publishedAt)}</p>
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


## 1일차 : 24-07-08
1. API란? : 인터넷과 소통하기- 
2. API 문서를 읽는 법
3. API 호출하는 도구 : Postman
```
 - 과제 없음
```

