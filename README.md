# content manager for ubccsss.org

Create posts for [ubccsss.org](https://github.com/ubccsss/ubccsss.org)

## Installation

```bash
$ git clone git@github.com:ubccsss/content-manager.git
$ cd content-manager
$ yarn install
```

## Environment Variables

- `GITHUB_TOKEN` - GitHub personal access token generated from using [csssbot's account](https://github.com/csssbot)

Download the token from Netlify and store it in a file called `.env` in the root directory of the project. Like:
   
 ```bash
GITHUB_TOKEN="QWERTY123"
 ```

## Usage

```bash
$ yarn start # runs the app in the development mode a http://localhost:3000
$ yarn build # builds the app for production to the `build` folder
```

## Contributing

### Dependencies

- [Netlify](https://www.netlify.com) is used to deploy the app
- [React](https://reactjs.org) is used to build the app
- [TypeScript](https://www.typescriptlang.org) is used to type check the app
- [react-bootstrap](https://react-bootstrap.github.io) is used to style the app
- [Yup](https://www.npmjs.com/package/yup) and [Formik](https://www.npmjs.com/package/formik) are used for form validation
- [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter) is used for syntax highlighting is in the "Markdown" preview
- [react-markdown](https://www.npmjs.com/package/react-markdown) is used for rendering markdown in the "Output" preview
- [GitHub API](https://docs.github.com/en/rest) is used to create a pull request using ["@octokit/rest](https://www.npmjs.com/package/@octokit/rest)

### Folder Structure

- `src` - contains all the source code for the app
  - `components` - contains all the components used in the app
  - `contants` - contains all the constants used in the app
  - `contexts` - contains all the contexts used in the app
  - `reducers` - contains all the reducers used in the app
  - `utils` - contains all the utility functions used in the app
  - `App.tsx` - the main app component
  - `index.tsx` - the entry point of the app