#Introduction

Fur Elise is a project aimed at translating digital music sheets to speech for the visually impaired.

#Deploy

```sh
cd path-to-fur-elise/frontend
npm install

cd path-to-fur-elise/frontend/app
bower install

cd path-to-fur-elise/text2speech
npm install
node index.js

// Open a new terminal
cd path-to-fur-elise/frontend
npm start 
// Web app will run at http://localhost:8000
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