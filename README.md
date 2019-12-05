# Wikipedia Data Analytics

Me and my teammates have created this project as our final project for Web Application Development course at University of Sydney. Our task is to build a single-page node.js data analytic web application to analyze the individual and overall articles of Wikipedia and their authors.

### Stack
* MVC architecture
* NodeJS
* Express
* MongoDB

## Features

### Login and Registration
User has to login or create new account before entering the main page of the application. As the project is in development environment, user information will be saved into the local database.

![Login screen](./images/Login.png)
![Registration screen](./images/Registration.png)

### Overall Article Analytics
After user has logged in successfully, they will land on this page. This page shows the overall analytics of all provided Wikipedia articles.
** Sample dataset of articles is located in `app/import/dataset/revisions/`

![Main page](./images/Overall_Analytics.png)
![Overall analytics barchart](./images/Overall_analytics_barchart.png)
![Overall analytics piechart](./images/Overall_analytics_piechart.png)

### Individual Article Analytics
User can select an article to view the individual article analytics.

![Individual analytics of article titled 'Japan'](./images/Individual_analytics.png)
![Individual analytics Barchart #1](./images/Individual_barchart1.png)
![Individual analytics Piechart](./images/Individual_piechart.png)

User can view the analytics on the revisions made by the authors of the article by selecting the author's name and the year range.
![Individual article analytics of user contributions](./images/Individual_barchart2.png)

### Author analytics
User can view the analytics on an author and check the revisions' timestamps made by the author on a particular article.
![Author analytics](./images/Author_analytics.png)

## Setup

### Requirements

To run this project, you will need `Node.js` installed in your environment.

### Installing

Clone the project and run `npm install` in root directory

```
$ git clone https://github.com/faihihi/wikidata_analytics.git
$ npm install
```

### Configure the database

We have provided a sample dataset of Wikipedia revisions and list of admins and bots in the app/import/ directory. Before starting the server, you will need to import the dataset into the database and configure the database.

On terminal, go into the `app/import/` directory

```
$ cd app/import
```

Run the following commands in the import directory

```
$ node importJSON
$ node update
```
After the update of all 8 user types have been completed, force end the execution with  '^C'

## Running the project

$ npm start

## Notes
The project is forked from my University of Sydney Enterprise Github account.
