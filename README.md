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
## Deploy the application to AWS
Package the CloudFormation template:
```bash
$ sam package --output-template-file template-packaged.yaml --s3-bucket <bucket_name> --region <region>
```
where `<bucket_name>` is a bucket from your AWS account where the resources will be published.

Then you can deploy the application:
```bash
$ sam deploy --template-file template-packaged.yaml --region <region> --capabilities CAPABILITY_IAM --stack-name web-scraping-lambda
```

Now you should be able to go to AWS console and under Lambda section you will find your new Lambda function.