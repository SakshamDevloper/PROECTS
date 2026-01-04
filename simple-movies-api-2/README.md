## Requirements:
1. [NodeJS](https://nodejs.org)
2. [NPM](https://www.npmjs.com)

## Version 2
Technologies:
1. NodeJS
2. Typescript
3. MongoDB

## Installation
1. Install node dependencies using npm (clean installation):
``` 
npm ci
```
2. Copy contents of `.env.example` to `.env` file:
``` 
cp .env.example .env
```
3. Change database credentials in `.env` file to your own:
```
MONGODB_DATABASE=db
MONGODB_CONNECTION_URI=mongodb://localhost:27017
```
4. Compile .ts files to .js into build directory:
``` 
npm run build
```
5.  Run nodejs-server:
``` 
npm run serve
```
6. Now, you can access `nodejs` app at http://localhost:8000 


## Additional
### Run server with custom port:
``` 
npm run serve -- --port=9999
```
### Live-reloading
For local development, you may want to use `Live-reloading`. Whenever you change file within `/src` directory all .ts files will re-build into `/build` directory:
``` 
npm run watch
```
So, for using `Live-reloading` you need to use 2 tabs in your terminal with following commands:
1. `npm run watch`
2. `npm run serve`    
Now, that's it.

## Routes list:
```
GET api/movies (read collection of documents)
POST api/movies (create a document)
GET api/movies/{movieId} (read specific document by id)
PUT api/movies/{movieId} (update specific document by id)
DELETE api/movies/{movieId} (delete specific document by id)
```