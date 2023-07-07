import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends cdk.Stack {

  public readonly userPoolId: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cdk_env: any = { ...props?.env };


    const userPool = new cognito.UserPool(this, `UserPool-${cdk_env["CDK_PARAM_STACK"]}`, {
      userPoolName: `UserPool-${cdk_env["CDK_PARAM_STACK"]}`,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        nickname: {
          required: true,
          mutable: true,
        },
        profilePicture: {
          required: true,
          mutable: true,
        },
        lastUpdateTime: {
          required: true,
          mutable: true,
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
      },
      keepOriginal: {
        email: true,
      },
      // email: {

      // },

      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      signInCaseSensitive: true,
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      }

    });


    // const emailSES = new cognito.WellKnownEmailProvider(this, 'EmailProvider', {
    //   userPool,
    //   emailProviderName: 'EmailProvider',
    //   from: '
    //   replyTo: '',
    // });


    const userPoolClient = new cognito.UserPoolClient(this, `UserPoolClient-${cdk_env["CDK_PARAM_STACK"]}`, {
      userPool,
      userPoolClientName: `UserPoolClient-${cdk_env["CDK_PARAM_STACK"]}`,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
        adminUserPassword: true,
      },
    });

    const userGroup1 = new cognito.CfnUserPoolGroup(this, `UserPoolGroup-${cdk_env["CDK_PARAM_STACK"]}`, {
      groupName: `UserPoolGroup-${cdk_env["CDK_PARAM_STACK"]}`,
      userPoolId: userPool.userPoolId,
    });


    // const identityPool = new cognito.CfnIdentityPool(this, `IdentityPool-${cdk_env["CDK_PARAM_STACK"]}`, {
    //   allowUnauthenticatedIdentities: false,
    //   cognitoIdentityProviders: [
    //     {
    //       clientId: userPoolClient.userPoolClientId,
    //       providerName: userPool.userPoolProviderName,
    //     },
    //   ],
    //   identityPoolName: `IdentityPool-${cdk_env["CDK_PARAM_STACK"]}`,
    // });


  }
}
