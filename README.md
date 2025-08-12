# Collabortive Realtime Text Editor

## Spinning up Locally
### Requirements
1. Node v22 or above
2. Docker or Podman
3. AWS credentials with production access to SES
### Steps
Clone and Enter Repository
```
git clone git@github.com:antonizyla/collaborativeEditor.git
cd collaborativeEditor/
```
Install dependencies
```
npm i
```
Setup Local Database, Edit .env file to suit. If you don't have SES credentials then in non prod mode it will log an otp to the server console.
```
cp .env.example .env
nvim .env
docker-compose up -d
```
Start Development Server
```
npm run dev
```
App is now ready on localhost :)
