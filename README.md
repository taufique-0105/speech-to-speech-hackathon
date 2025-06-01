# OdiaAudioGen

## Stack

- React-native
- Expo
- Expressjs

## Getting started

### Pre-requisits

- nodejs
- npm
- API_KEY, get a subscription key from [SARVAM AI](https://dashbord.sarvam.ai).

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
git clone https://github.com/taufique-0105/speech-to-speech-hackathon.git
```

## Starting dev sever

### Backend

- move to the backend dir

```
cd backend
```

- put your api key in .env file

```
echo "API_KEY=<paste your api key here>" > .env
```

- install dependencies

```
npm i
```

- start dev server

```
nodemon serer
```

### Frontend

- move to the frontend dir

- In TTSPlayer.js add your IP address in line number 23

```
cd frontend
```

- install dependencies

```
npm i
```

- start dev server

```
npx expo start
```

## App in Phone

- Download Expo Go

- Scan the QR in Expo Go to get started

## Instruction for Contribution

- Go to github repo
- Click on fork
- Clone the code repo to your machine
- Edit the local repo
- Test changes
- Push code into your repo
- Click on compare and create a pull request
- After creating a pull request assign someone for reviewing the code
