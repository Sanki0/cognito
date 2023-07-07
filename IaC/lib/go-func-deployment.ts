import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { ISecurityGroup, ISubnet } from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";

export interface GoFuncDeploymentProps {
  funcName?: string;
  codePath: string;
  handler?: string;
  environmentVariables?: any;
  vpcVariables?: any;
  vpcSubnetsVariables?: ISubnet[];
  securityGroupVariables?: ISecurityGroup[];
  maxMemorySize?: number;
}

export class GoFuncDeployment extends Construct {
  public funcRef: Function;

  constructor(scope: Construct, id: string, props: GoFuncDeploymentProps) {
    super(scope, id);
    const environment = {
      CGO_ENABLED: "0",
      GOOS: "linux",
      GOARCH: "amd64",
    };

    const path: string = props.codePath;

    const handler: string = props.handler || "main";

    const enviromentVar = props.environmentVariables || {};

    const vpcVar = props.vpcVariables || undefined;

    const maxMemorySize = props.maxMemorySize || 1024;

    const securityGroupVarArray = props.securityGroupVariables || undefined;

    const gofunc = new Function(this, id, {
      functionName: props.funcName,
      code: Code.fromAsset(path, {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          user: "root",
          environment,
          command: [
            "bash",
            "-c",
            ["make vendor", "make lambda-build"].join(" && "),
          ],
        },
      }),
      handler,
      environment: enviromentVar,
      timeout: Duration.minutes(10),
      memorySize: maxMemorySize,
      runtime: Runtime.GO_1_X,
      vpc: vpcVar,
      securityGroups: securityGroupVarArray,
    });
    this.funcRef = gofunc;
  }
}
