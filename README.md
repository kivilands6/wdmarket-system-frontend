# Uzdevumu menedžēšanas sistēma


### Projekta apraksts

Šis ir mans PIKC "Rīgas Valsts tehnikums" kvalifikācijas darbs.
Web sistēma kura paredzēta uzdevumu un projektu menedžēšanai.

### Izmantotās tehnoloģijas

- HTML5
- CSS3
- Javascript
- React
- Tailwindcss
- MongoDB
- NodeJS
- ExpressJS

### Izmantotie avoti

React dokumentācija - https://reactjs.org/docs/getting-started.html - (resurs skatīts sākot no 24.11.2021)

React router dokumentācija - https://reactrouter.com/docs/en/v6/getting-started/overview - (resurs skatīts sākot no 20.04.2021)

React beautiful dnd izmantošanas pamācība - https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd - (resurs skatīts sākot no 25.04.2022)

TailwindCSS uzstādīšana - https://www.youtube.com/watch?v=Pe1Vo2N3Z2c&t=733s (resurs skatīts 27.04.2022)

TailwindCSS klašu špikeris - https://nerdcave.com/tailwind-cheat-sheet (resurs skatīts sākot no 27.04.2022)

Brad Schiff (React kurss) - https://www.udemy.com/course/react-for-the-rest-of-us/ - (resurs skatīts sākot no 24.11.2021)

Brad Schiff (Javascript kurss) - https://www.udemy.com/course/web-design-for-beginners-real-world-coding-in-html-css/ - (resurs skatīts sākot no 1.05.2022)

React immer dokumentācija - https://immerjs.github.io/immer/ (resurs skatīts sākot no 21.04.2022)

ExpressJs dokumnetācija - https://expressjs.com/en/guide/routing.html (resurs skatīts sākot no 01.05.2022)

Mongodb nodejs dokumentācija - https://www.mongodb.com/docs/drivers/node/current/ - (resurs skatīts sākot no 01.05.2022)

### Uzstādīšanas instrukcijas

#### Lokāli:
1. Nolādēt github folderi
2. iejiet caur termināli "frontend" un palaist komandu "npm install", to pašu izdarīt "backend" folderī
3. "backend" folderi izveidot .env failu un iestatīt "PORT=8000" un "CONNECTIONSTRING=xxxxxxxxx" x vietā ievietot mongodb connection stringu
4. Tālāk izveidot .env failu "forntend" folderi un pievienot mainīgo "REACT_APP_BACKENDURL="http://localhost:8000""
5. Lai palaistu pašu programmu konsolē "backend folderī jāpalaiž komanda "npm run watch" un "frontend" feloderī komanda "npm run start"

