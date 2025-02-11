# SpotifyX | API
--- 

## Project Overview | 
### SpotifyX will be a simple Web-app that through the use of proper OAuth and JWT tokens, the user will be able to search their favorite artist and be given their artists' stats; from their picture, followers, Genres, and their current popularity. 

## Pre-requisites | 

> Ensure you have the latest version of MonogoDB by updating Homebrew from your terminal and ensure you isntall adn run the needed dependencies. Reference the step by step **Getting Started** section. 

## Getting Started

### Follow along and install the following necessary dependencies to get a working version of this project up and running. 


### Let's Get This Up & Running | Follow these Steps: 

1. Install Homebrew if you haven't done so already. Then, use Homebrew to install MongoDB.

Homebrew Install

	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

Install necessary "Xcode command-line tools from Apple's Xcode 

	`xcode-select --install`

Download official Homebrew formula for MongoDB  

  	 `brew tap mongodb/brew`

Ensures Homebrew and all otehr formulae are up to date
    
    `brew update`
 
Install MonogoDB 

    `brew install mongodb-community@8.0`

2. Run `npm init`
Install the dev dependencies:

	`npm i express mongoose path cors dotenv nodemon axios`
   
   
   > - Express: to help manage our server
   > - Mongoose: help manage our connections to Mongo database
   > - Path: to point to React Build
   > - CORS: helps our local development from different ports to avoid having cross origin issues.
   > - dotenv: contorl environemtn variabels
   > - Nodemon: better development experience w/ou thaving to refresh our server constantly
   > - Axios: Middleware that handles HTTP requests
   
3. Start MonogDB

   > To Run / Start MonogoDB | `mongod` process
   	
		`brew services start mongodb-community@8.0`

   > To Stop MonogDB | `mongod` process

		`brew services stop mongodb-community@8.0`
4. Start Local Server:

   		`npm run dev`
6. Start the Front-end
		`placeholder`

## Links 
### Links to Project Sources  

- local backend: http://localhost:8000
- link 2 <placeholder>
- link 3 <placeholder>
### Resources | References

> MEVN Stack Tutorial | Build a CRUD app using Vue 3, Node, Express & MongoDB
- https://signoz.io/blog/mevn-stack-tutorial/


> **Kickstarting Your Full-Stack Journey with React, Vite, and Expres**
- https://www.joelspriggs.com/kickstarting-your-full-stack-journey-with-react-vite-and-express/


> My current FrontEnd Stack — React, Vite, Mantine, Tanner-query, react-hook-form & Typescript
- https://adam-drake-frontend-developer.medium.com/my-current-frontend-stack-react-vite-mantine-tanner-query-react-hook-form-typescript-fae33c67f77e


> Vite Docs | Getting Started
- https://vite.dev/guide/

> MERN Stack Explained
- https://www.mongodb.com/resources/languages/mern-stack

> Spotify | Great Reference Articles I used in my initial setup
 - https://developer.spotify.com/documentation/web-api/concepts/api-calls#response-status-codes
 - https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 - https://developer.spotify.com/documentation/web-api/concepts/access-token
 - https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 - https://developer.spotify.com/documentation/web-api/tutorials/getting-started#request-an-access-token
 - https://developer.spotify.com/documentation/web-api/reference/get-an-artist

