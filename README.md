# Studer - Wild Work Week 2024 - MMI Toulon
A web application inspired by Tinder, created during the "Wild Work Week" at the University of Toulon, to promote the MMI training and the work done by students.

![Studer](https://github.com/arthur-mdn/Studer/blob/main/client/public/elements/studer.png)

## Description

During the "Wild Work Week" at the University of Toulon, I participated in a student project aimed at promoting the MMI (Multimedia and Internet Professions) training and the work done by students. In my team, composed of digital creators and communicators, I was the only developer. Our mission was to create an interactive and innovative web experience in a very limited time of only 3 days. The result of this intense collaboration is "Studer", a web application inspired by Tinder, where the goal is to "match" with the user's favorite MMI course, whether it be creation, development or communication. This playful and interactive approach highlights the various aspects and specializations of the MMI training in an engaging way.

The "Studer" application is structured around the main "cards" functionality, which presents the work of the group's students. Users can swipe the cards to the right or left to like or dislike each project. This interaction is not only playful; it also allows an invisible score to be incremented that calculates the user's preferences based on their reactions to the different projects. In addition to navigating through the projects, users can click on a card to access more details about each work. They can learn more about the project, ask questions via an integrated chatbot, and interact more deeply with the content presented.

At the end of the experience, the application reveals the compatibility results, indicating the MMI course — creation, development, or communication — that best matches the user's preferences, based on their interactions with the projects. This result is accompanied by options to contact the students responsible for the work that most interested the user, facilitating more personalized and targeted exchanges.

## Features

- Interactive web application
- Tinder-inspired design
- Cards-based navigation
- Like and dislike projects
- Compatibility score calculation
- Detailed project view
- Chatbot integration
- Personalized results
- Contact options
- Real-time communication
- Responsive design
- User-friendly interface

## Installation 

1. Clone the repository
```shell
git clone git@github.com:arthur-mdn/Studer.git
```

2. Install the dependencies
```shell
cd client
npm install

cd ..

cd server
npm install
```

3. Start the server
```shell
cd server
node server.js
```

4. Start the client
```shell
cd client
npm run dev
```

5. Access the application
```shell
http://localhost:5173
```

## Administration

### Add a project

Go to the following URL:
```shell
http://localhost:5173/realization/new
```

### Add a quiz

Go to the following URL:
```shell
http://localhost:5173/quiz/new
```

## Usage

1. Swipe the cards to the right or left
2. Like or dislike the projects
3. Click on a card to view more details
4. Ask questions via the chatbot
5. Interact with the content
6. Discover your compatibility results
7. Contact the students responsible for the projects


## Technologies

- HTML
- CSS
- JavaScript
- React.js
- Node.js
- Express
- MongoDB
- Socket.io
- Git

## Crédits 
#### Development
- Arthur Mondon

#### Design and creation
- Mauryne Marty
- Julie Rigal

#### Logo
- Théodore Allard

#### Photo / Video
- Dorian Rastello
- Hugo Bransard
- Pénolope Pierron