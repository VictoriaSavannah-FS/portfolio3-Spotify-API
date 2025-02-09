# Spotify-2GO | API
--- 

## Project Overview | 
### [placeholder]This section of your README should contain the description of your project, features, and functionality. 


## Pre-requisites | 

> Ensure you have the latest version of MonogoDB by updating Homebrew from your terminal and ensure you isntall adn run the needed dependencies. Reference the step by step **Getting Started** section. 

## Getting Started

### Follow along and install the following necessary dependencies to get a working version of this project up and running. 


### Let's Get This Up & Running | Follow these Steps: 

1. Install Homebrew if you haven't done so already. Then, use Homebrew to install MonogoDB.

Homebrew Install

   `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Install necessary "Xcode command-line tools from Apple's Xcode 

`xcode-select --install`

Download official Homebrew formula for MongoDB  

`brew tap mongodb/brew`

Ensures Homebrew and all otehr forumulae are up to date

\`brew update`

 
Install MonogoDB 

    `brew install mongodb-community@8.0`

2. Run `npm init`
3. Install the dev dependencies:

   `npm i express mongoose path cors dotenv nodemon`
   
   >Express: to help manage our server
   >Mongoose: help manage our connections to Mongo database
   >Path: to point to React Build
   >CORS: helps our local development from different ports to avoid having cross origin issues.
   >dotenv: contorl environemtn variabels
   >nodemon: better development experience w/ou thaving to refresh our server constantly
   
5. Start the Server
   > To Run / Start MonogoDB | `mongod` process
   
 `brew services start mongodb-community@8.0`

   > To Stop MonogDB | `mongod` process

`brew services stop mongodb-community@8.0`

3. Start the Front-end


## Links 
### Links to Project Sources  

- link 1 <placeholder>
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

- 
