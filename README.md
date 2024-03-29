# projet-web : Blog

![HTML](https://img.shields.io/badge/-HTML-E34F26?logo=html5&logoColor=white&style=for-the-badge)
![CSS](https://img.shields.io/badge/-CSS-1572B6?logo=css3&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=white&style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/-Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=for-the-badge)
![jQuery](https://img.shields.io/badge/-jQuery-0769AD?logo=jquery&logoColor=white&style=for-the-badge)
![AJAX](https://img.shields.io/badge/-AJAX-0096D6?logo=ajax&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)
![Prisma](https://img.shields.io/badge/-Prisma-1B222D?logo=prisma&logoColor=white&style=for-the-badge)


This is a web application allows users to publish posts and comment on them. The front-end is built using HTML, CSS, JavaScript, and Bootstrap. The back-end is built using Node.js and Express.js, with MySQL as the database management system and Prisma as the ORM and EJS as template engine.


### Installation

1. Clone the repository:

    git clone https://github.com/abdellatif-hassani/projet-web
    
    cd projet-web

    npm install

2. Install dependencies:

    cd projet-web

    npm install

Database Setup

3. Update the database connection settings in the Prisma client configuration file (prisma/client directory) to match your database credentials.

4. Run database migrations to create the necessary tables:

    npx prisma migrate dev --name last

### Usage

Start the application:

    npm start

The server will start using nodemon, which automatically restarts the server when changes are made to the code.

To fill the database with initial data, execute the following command after running the migrations:

node seeds/seed