## Description
This application performs web-scraping and runs as a Lambda Function in AWS.

## Prerequisites
Before being able to run or deploy the application to AWS, make sure you have installed locally SAM CLI and the requirements it comes with (e.g. AWS CLI and Docker):
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html

## Run application locally
Install NPM dependencies:

```bash
$ yarn install
```

Build TypeScript files to JavaScript:

```bash
$ tsc
```

Run the application:

```bash
$ sam local invoke WebScrapingFunction --event event.json
```
