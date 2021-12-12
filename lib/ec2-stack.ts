import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { Instance, SubnetType, InstanceType, InstanceClass, InstanceSize, Vpc, Port,
  BlockDeviceVolume, EbsDeviceVolumeType, Peer, MachineImage, AmazonLinuxGeneration, 
  AmazonLinuxEdition, AmazonLinuxVirt, AmazonLinuxStorage, AmazonLinuxCpuType } from '@aws-cdk/aws-ec2';
import { StringParameter } from '@aws-cdk/aws-ssm';

export class ec2Stack extends Stack {
    constructor(scope: Construct, id: string, peerCidrIp: string, keyName: string, props?: StackProps) {
      super(scope, id, props);

      // Store VPC Props
      const vpcProps = {
        cidr: "10.0.0.0/16",
        natGateways: 1,
        subnetConfiguration: [
            {
                name: "publicSubnet1",
                subnetType: SubnetType.PUBLIC,
                cidrMask: 28
            },
        ]
      };
      // Create a new VPC based on passed parameters
      const vpc = new Vpc(this, id, vpcProps);
      // Create a new SSM Parameter for the VPC id Value
      const ssmVpcId = id+'-ssm-param'
      new StringParameter(this, ssmVpcId, {
        parameterName: ssmVpcId,
        stringValue: id,
      });

      const amznLinuxAmi = MachineImage.latestAmazonLinux({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: AmazonLinuxEdition.STANDARD,
        virtualization: AmazonLinuxVirt.HVM,
        storage: AmazonLinuxStorage.GENERAL_PURPOSE,
        cpuType: AmazonLinuxCpuType.X86_64,
    });
    
    const publicAccessibleInstance = new Instance(this, 'PublicInstance', {
        vpc: vpc,
        availabilityZone: this.availabilityZones[0],
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC
        },
        machineImage: amznLinuxAmi,
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
        keyName: keyName,
        blockDevices: [
            {
                deviceName: '/dev/xvda',
                volume: BlockDeviceVolume.ebs(8, {
                    deleteOnTermination: true,
                    encrypted: true,
                    volumeType: EbsDeviceVolumeType.GP2
                }),
            }
        ]
    });
    if (peerCidrIp != null) {
        publicAccessibleInstance.connections.allowFrom(Peer.ipv4(peerCidrIp), Port.tcp(22));
    }
 }
}

