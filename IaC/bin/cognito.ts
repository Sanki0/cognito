#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';

const cdk_env: any = {};
Object.keys(process.env)
  // .filter((k) => k.startsWith("CDK_PARAM")) // filter only CDK_PARAM*
  .map((k) => (cdk_env[k] = process.env[k]));


const app = new cdk.App();

new CognitoStack(app, 'CognitoStack', {
  env: {
    region: process.env["CDK_DEPLOY_REGION"],
    account: process.env["CDK_DEPLOY_ACCOUNT"],
    ...cdk_env,
  },
});