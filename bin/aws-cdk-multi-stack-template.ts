#!/usr/bin/env node
import 'source-map-support/register';
import { App, Construct } from '@aws-cdk/core';
import { coreStack } from '../lib/index';
import { ec2Stack } from '../lib/ec2-stack';
import { iamStack } from '../lib/iam-stack';

interface EnvProps {
  prod: boolean;
}

const stackProps = {
  env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
  }
}

const app = new App();

class myApp extends Construct {
  constructor(scope: Construct, id: string, props?: EnvProps) {
      super(scope, id);
      let az: string = 'eu-west-1';
      let peerCidrIp: string = app.node.tryGetContext('peerIp');
      let keyName: string = app.node.tryGetContext('keyName');
      
      if (peerCidrIp == null) {
          console.log('"peerIp" context key missing, using hard-coded cidr...');
          peerCidrIp = '10.10.10.0/24'
          console.log('"peerIp" has been set to ' + peerCidrIp);
      } else {
          console.log('Default "peerIp" is set to ' + peerCidrIp);
      }
      
      if (keyName == null) {
          console.log('"keyName" context key missing, using hard-coded keyname...');
          keyName = 'pw_key_pair'
          console.log('"keyName" has been set to ' + keyName);
          // can also use aws ec2-instance-connect send-ssh-public-key to provide SSH public key
      } else {
          console.log('Default "keyName" is set to ' + keyName);
      }
      
      new coreStack(app, 'core-stack', stackProps); // vpc init
      new ec2Stack(app, 'ec2-stack', peerCidrIp, keyName, stackProps);
      new iamStack(app, 'iam-stack', stackProps);
}}
new myApp(app, "myapp");

app.synth();