import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { createIAMUser, createEC2Role } from '../lib/iam-constructs';

export class iamStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      // Create an IAM User
      const user = new createIAMUser(this, 'iam-user', 'iam-user-001');

      const role = new createEC2Role(this, 'iam-role', 'iam-role-ec2-01');

    }
}

