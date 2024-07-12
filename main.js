// 변수
let _totalResults = 0;
let _page = 1;
const _pageSize = 10;
const _groupSize = 5;

const API_KEY = `dc00e5537ae54bf9a63c4d9ddb458085`;
//const API_KEY = `7713fec458914cb7b0bf43b12d8bd292`; // 막힘
const currentUrl = window.location.href; // 현 URL 정보가져오기
let arraySplit = currentUrl.split("/"); // url 분리하기
let newsApiUrl = "";
let newsList = [];
let category = "";
let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-btn");
let searchIcon = document.getElementById("search-icon");
const menus = document.querySelectorAll(".menus button");
const sideMenu = document.getElementById("side-menu");
const sideMenus = document.querySelectorAll(".menu-content button");
const closeMenu = document.getElementById("close-menu");

// 개발시 / 배포시 에 따라 api url 처리
if (arraySplit[2] === "127.0.0.1:5500") {
    newsApiUrl = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`;
    //newsApiUrl = ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;
} else {
    newsApiUrl = ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`;
}
let url = new URL(newsApiUrl);

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
    getLastNews();
});
// 검색 아이콘 토굴
searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("d-none");
    searchBtn.classList.toggle("d-none");
});

// 메뉴 클릭시
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

// 사이드메뉴 클릭시
sideMenus.forEach((menu) =>
    menu.addEventListener("click", (event) => {
        sideMenus.forEach((menu) => menu.classList.remove("active"));
        event.target.classList.add("active");
        // 모든 탭의 폰트를 기본 폰트로 설정
        sideMenus.forEach((menu) => {
            menu.style.color = "#ffffff";
        });
        event.target.style.color = "yellow";
        sideMenu.classList.remove("active"); // 사이드메뉴 닫기
        getByMenu(event);
    })
);

// 입력상자에서 엔터입력 검색
searchBtn.addEventListener("click", (event) => searchPost(event));
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault(); // 폼 제출 방지
        searchPost();
    }
});

// 기사가져오기
const getNews = async () => {
    try {
        url.searchParams.set("page", _page);
        url.searchParams.set("pageSize", _pageSize);
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
            if (data.articles.length === 0) {
                _totalResults = 0; // 전체건수 초기화
                pagingRender(); // 페이지 재 호출
                throw new Error("요청하신 데이터가 없습니다. 다시 확인하세요.");
            }
            newsList = data.articles;
            _totalResults = data.totalResults;
            renderNews();
            pagingRender();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        renderNoData(error.message);
    }
};

// 검색
const searchPost = async (event) => {
    let searchQuery = searchInput.value;
    if (searchQuery == "") {
        alert("검색어를 입력해주세요!");
        searchInput.focus();
        return;
    } else {
        url = new URL(newsApiUrl);
        url.searchParams.set("q", searchQuery);
        searchInput.value = ""; // 검색상자 비우기
        await getNews(); // 기사가져오기 리팩토링
    }
};

// 기사가져오기
const getLastNews = async (searchQuery) => {
    url = new URL(newsApiUrl);
    await getNews(); // 기사가져오기 리팩토링
};

// 메뉴 클릭시 기사 가져오기
const getByMenu = async (event) => {
    category = event.target.textContent.toLowerCase();
    url = new URL(newsApiUrl);
    if (category !== "home") {
        url.searchParams.set("category", category);
    } else {
        url.searchParams.delete("category");
    }

    await getNews(); // 기사가져오기 리팩토링
};

// 가져오기 데이터 그려주기
const renderNews = () => {
    const newsHTML = newsList
        .map((news) => {
            // 기사원분
            let description = news.description;
            if (description && description.length > 200) {
                description = description.substr(0, 200) + "...";
            } else {
                description = "기사없음";
            }

            return `
                    <div class="col-md-6 mb-6">
                        <div class="card h-100">
                            <img src="${news.urlToImage}" onerror="this.onerror=null; this.src='images/noimg.jpg'" class="card-img-top"  >
                            <div class="card-body">
                                <h5 class="card-title">${news.title}</h5>
                                <p class="card-text">${description}</p>
                                <a href="${news.url}" class="btn btn-light" target="_blank">기사링크</a>
                            </div>
                            <div class="card-footer text-body-secondary d-flex justify-content-between">
                            ${news.source.name == null ? "no source" : news.source.name}
                            <div>${moment(news.publishedAt).startOf("day").fromNow()}</div>
                            </div>
                        </div>
                    </div>`;
        })
        .join("");
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
    const newsCount = document.getElementById("news-count");
    newsCount.innerHTML = `Total Count : ${_totalResults}건`;
};

// 데이터 없거나 오류 그려주기
const renderNoData = (msg) => {
    const newsHTML = `<main class="px-3 text-center error-page">
    <img src="https://www.gstatic.com/youtube/src/web/htdocs/img/monkey.png" >
    <h1>요청한 데이터가 없습니다.</h1>
    <p class="lead">${msg}</p>
  </main>`;
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = newsHTML;
    const newsCount = document.getElementById("news-count");
    newsCount.innerHTML = `Total Count : ${_totalResults}건`;
};
/**
 * page navigation
 */
const pagingRender = () => {
    //totalPage
    const totalPage = Math.ceil(_totalResults / _pageSize);
    //현재페이지: pageGroup
    const pageGroup = Math.ceil(_page / _groupSize);
    // lastPage
    let lastPage = pageGroup * _groupSize;
    if (lastPage > totalPage) {
        lastPage = totalPage;
    }
    // firstPage
    const firstPage = lastPage - (_groupSize - 1) <= 0 ? 1 : lastPage - (_groupSize - 1);

    let paginationHTML = ``;
    paginationHTML += `<li class="page-item ${totalPage < 5 || _page === 1 ? "disN" : ""}" onclick="goPage(1)"><a class="page-link" href="#"><<</a></li>`;
    paginationHTML += `<li class="page-item ${totalPage < 5 || _page === 1 ? "disN" : ""}" onclick="goPage(${_page - 1})"><a class="page-link" href="#">&lt;</a></li>`;

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${_page === i ? "active" : ""}" onclick="goPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }
    paginationHTML += `<li class="page-item ${totalPage < 5 || _page === totalPage ? "disN" : ""}" onclick="goPage(${_page + 1})"><a class="page-link" href="#">&gt;</a></li>`;
    paginationHTML += `<li class="page-item ${totalPage < 5 || _page === totalPage ? "disN" : ""}" onclick="goPage(${totalPage})"><a class="page-link" href="#">>></a></li>`;

    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const goPage = (pageNum) => {
    _page = pageNum;
    getNews();
};
