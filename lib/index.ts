import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class coreStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create VPC & store VPC_id to SSM

  }
}