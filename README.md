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
### 
## Starting dev sever
- Move to the code space
```
cd 01version
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

- In TTSPlayer.js add your IP address in line number 23
 
```
cd frontend
```
- Install dependencies

```
npm i
```

#### Environment Variables

- Open the terminal in the frontend root folder and execute this command.
- This will create a .env file and add the required environment variables
- Make sure if you're using physical device to test the app then use you computer IP address in place of localhost in each variables
- If you're using emulator use localhost

```
echo "EXPO_PUBLIC_URL=http://localhost:3000" > .env
```

- Start dev server
```
npx expo start
```

## App in Phone

- Download Expo Go

- Scan the QR in Expo Go to get started

## App in emulator

- Download [Android Studio](https://developer.android.com/studio)
- Complete the installation process, make sure to check Virtual device option.
- In "More Action" select "Virtual Device Manager".
- In top left corner there is a plus button where you can create virtual device.
- Select a device with Play Store available on it and click Next.
- ![image](https://github.com/user-attachments/assets/164b9644-9840-44e3-b39b-73051e926fde)
- Click on download, play store will be downloaded.
- Click Finish
- ![image](https://github.com/user-attachments/assets/b57cbfb2-0de6-41ee-8684-82c737e15f05)
- You'll get this screen, click on start to launch the Emulater
- Emulator will launch in few seconds.
- Click 'a' on terminal where expo frontend is running, this will start the app in the emulator.
