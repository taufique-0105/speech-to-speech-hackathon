[![Contributing](https://img.shields.io/badge/Contributions-welcome-brightgreen.svg)][contrib]

# OdishaVox

## Stack

- React
- Tailwind CSS
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

###

## Starting dev sever

- Move to the code space

```
cd v1
```

### Backend

- Move to the backend dir

```
cd backend
```

- Create a .env file in the backend folder

```
echo "API_KEY=<YOUR_API_KEY>
PORT=3000
MONGODB_URI=<MONGODB_CONNECTION_STRING>" > .env
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
nodemon server.js
```

### Frontend

- Move to the frontend dir

```
cd web_frontend
```

- Install dependencies

```
npm i
```

- Start dev server

```
npm run dev
```

## Contributing

We welcome contributions from everyone!  
Please see [CONTRIBUTING.md][contrib] for details on how to get started, our code of conduct, and best practices.

[contrib]: /docs/CONTRIBUTING.md
