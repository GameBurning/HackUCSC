#Introduction

Fur Elise is a project aimed at translating digital music sheets to speech for the visually impaired.

#Run

Environment: node - v6.4.0, npm  - v3.10.3

Get Node Version Manager: 

```sh
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
$ bash install_nvm.sh
$ source ~/.profile
$ nvm install 6.4.0
$ nvm use 6.4.0
$ node -v   //output v6.4.0
$ npm -v   //output v3.10.3
```

Run front-end and text-to-speech service

```sh
$ cd path-to-fur-elise/frontend
$ npm install

$ cd path-to-fur-elise/frontend/app
$bower install

$ cd path-to-fur-elise/text2speech
$ npm install
$ node index.js

// Open a new terminal
$ cd path-to-fur-elise/frontend
$ npm start 

// Web app will run at http://localhost:8000
```
#Deploy in Google Cloud

```sh
$ [sudo] npm install forever -g

// To start & stop frontend:

$ cd path-to-fur-elise/frontend/app

$ forever start -c "npm start" ./

$ forever stop -c "npm start" ./

// To start & stop text2speech:

$ cd path-to-fur-elise/text2speech

$ forever start index.js

$ forever stop index.js

```

#Use
This web app is designed to be friendly to visually impaired. All interactions can be done by **keyboard**. However you can still use mouse as you want.

* **Enter** - **confirm** input or **select**
* **Left** - **move left**
* **Reft** - **move right**
* **Up** - change to **right hand** score
* **Down** - change to **left hand** score
* **ESC** / **Delete** / **Backspace** - **clear input**
* **Ctrl + 1** - go to "**Search**" page
* **Ctrl + 2** - go to "**My Favorites**" page
* **Ctrl + 3** - go to "**History**" page
