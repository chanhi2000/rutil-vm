# rutil-vm-front

![favicon](public/favicon.ico)
  
루틸 VM 프론트앤드

---

## 🚀Quickstart

### 🧰Prerequisite(s)

![Node.js (`11.0.23`)][shield-nodejs]
![React.js (`18.3.x`)][shield-reactjs]
![Storybook (`8.2.x`)][shield-storybook]

## React.js

> [!IMPORTANT] 
> 
> npm이 없을 경우 설치 권고
> 
> ```sh
> npm start  # React 앱 실행
> npm build # React 앱 빌드
> ```

## (로컬용 API 대신) 다른 API를 지정하여 개발할 경우

> [!TIP]
>
> API에 연결하여 사용 할 경우 proxy 구성에 필요한 조건
>
> 로컬이 아닌 곳일 경우 `package.json` 파일에 
> 아래 내용을 임시로 추가 후 `npm start`
>
> ```json
> {
>   "proxy": "https://192.168.0.70:8443",
> }
> ```

[shield-nodejs]: https://img.shields.io/badge/Node.js-11.0.23-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat-square
[shield-reactjs]: https://img.shields.io/badge/React.js-18.3.x-61DAFB?logo=react&logoColor=61DAFB&style=flat-square
[shield-storybook]: https://img.shields.io/badge/Storybook-8.2.x-FF4785?logo=storybook&logoColor=FF4785&style=flat-square
