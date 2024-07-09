# 뉴스 타임즈 만들기 (3주 1일 2일)

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
```
const API_KEY = `7713*********************292`;
let news = [];
const getLastNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log(news);
};

getLastNews();


```
