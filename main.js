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
