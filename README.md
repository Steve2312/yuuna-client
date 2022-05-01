# yuuna-client

[![CodeFactor](https://www.codefactor.io/repository/github/steve2312/yuuna-client/badge)](https://www.codefactor.io/repository/github/steve2312/yuuna-client)

A music player that extracts songs from osu! beatmaps and presents them in a user-friendly way. With the help of the Beatconnect API, Yuuna is able to provide search and download of osu! beatmaps within the app.

## Technology
- React (Typescript)
- SASS (SCSS)
- Webpack 5 / Electron

## Releases

Yet to be released...

## Development
These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
- Node.js 16 or higher
- Beatconnect API Token

### Set-up
```shell
# Clone the repository
git clone https://github.com/Steve2312/yuuna-client.git

# Go into the repository
cd yuuna-client

# Install dependencies
npm install

# Start the dev server and launch the application
npm run dev
```

### Env file
The `.env` file must be located at the root of the project
```dotenv
BEATCONNECT_API_KEY=your-api-token
```




