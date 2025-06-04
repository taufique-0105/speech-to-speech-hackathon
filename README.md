# OdishaVox
## Stack
- React-native
- Expo
- Expressjs
- MongoDB

## Getting started
### Pre-requisits
- nodejs
- npm
- API_KEY, get a subscription key from [SARVAM AI](https://dashbord.sarvam.ai).
- Create a cluster in mongodb and get the connection String [MongoDB](https://www.mongodb.com/)

## Install nodejs

### Windows 10/11 

Download the [Windows Installer](https://nodejs.org/en/download) directly from the [nodejs.org](https://nodejs.org/en/#home-downloadhead) web site.

#### Alternative only on windows 11 using `winget`

```
winget install OpenJS.NodeJS
```

### Linux using package managers i.e. Ubuntu

```
apt install nodejs
```

### MacOS using homebrew

```
brew install node
```

## Clone the repo

```
git clone https://github.com/taufique-0105/OdishaVox.git
```

## Starting dev sever
### Backend
- Move to the backend dir

```
cd backend
```

- Create a .env file in the backend folder
```
API_KEY="<YOUR_API_KEY>"
PORT=3000
MONGODB_URI=<MONGODB_URL>
```

- install dependencies

```
npm i
```

- install nodemon
```
npm i -g nodemon
```

- start dev server
```
nodemon serer
```

### Frontend
- Move to the frontend dir

- In TTSPlayer.js add your IP address in line number 23
 
```
cd frontend
```
- Install dependencies

```
npm i
```

### Add your current IP Address on 
#### 01version/frontend/components/Feedback.js
#### 01version/frontend/components/STSConverter.js
#### 01version/frontend/components/STTConverter.js
#### 01version/frontend/components/TTSPlayer.js

- Start dev server
```
npx expo start
```

## App in Phone

- Download Expo Go

- Scan the QR in Expo Go to get started
