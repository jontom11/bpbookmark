# BP TechChallange
UI Engineer
#### Jonathan Tom
## Dependencies
This project is built using the following technologies:
* [Node](https://nodejs.org/en/)
* [Webpack](https://webpack.js.org)
* [React](https://facebook.github.io/react/)
* [Yarn](https://yarnpkg.com/en/)

## Quick Start
The first required step is to download all of the dependencies using Yarn. To do this, make sure [Yarn is installed](https://yarnpkg.com/en/docs/install) and then run the following command:
```
yarn
```
Next, the API token must be set in a `.env` file. Copy your API token to a variable named `TOKEN` in `.env`:
```
TOKEN=your-token-here
```
To run the dev server locally, run the following command and visit `localhost:8080` in the browser:
```
yarn start
```

## TODO
We would like you to build a system in which you can keep track of the properties that you’re interested in buying or renting.
This is essentially a bookmarking tool. Please consider the mockup provided [here](https://bp-assessment.s3.amazonaws.com/ui-engineer-design-mockup.png)

As part of this challenge you will be expected to interface with a RESTFUL, JSON API which largely follows the JSON API spec (https://jsonapi.org).
API documentation can be found here: http://clientside-api.herokuapp.com/apipie

Your email will have included an API key that you will need to pass during all requests as a header.
This is documented for each endpoint.

Requirements:

User should be able to add new listings
User should be able to remove existing listings
User should be able to edit an existing listing
Form fields must respect server-side validation

There are intentional grey areas left open for interpretation.
