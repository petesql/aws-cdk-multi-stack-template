import { Construct } from "@aws-cdk/core";
import { User, UserProps, Role, RoleProps, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Group, ManagedPolicy } from '@aws-cdk/aws-iam';

/**
 * IAM User CDK Construct 
 * @param scope
 * @param iamRoleName Role Name, STRING
 * @param groupName? Optional, name for Group
 * @returns IAM Role Name.
 */
 export class createIAMUser extends Construct {
    constructor(scope: Construct, id: string, iamUserName: string, groupName?: string, userConfig?: UserProps) {
      super(scope, id);

      // Create new IAM User based on passed params.
      const userProps = { userName: iamUserName };
      const user = new User(this, iamUserName, { ...userConfig, ...userProps });

      // IAM Permission Constants
      const roManagedPol = ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')

      // Create a Group for the new Iam User.
      if ( groupName == null ) { // If no GroupName passed give it any.
          const groupParam:string = 'userGroup-'+Math.floor(Math.random()*(1000-1+1))+1+'-';
          // Create a Group & Add User into.
          const group = new Group(this, groupParam, {
              managedPolicies: [ roManagedPol ], // ReadOnlyAccess
          });
          group.addUser(user);
        }
    }
}

/**
 * EC2 Role CDK Construct 
 * @param scope
 * @param iamRoleName Role Name, STRING
 * @returns IAM Role Name.
 */
export class createEC2Role extends Construct {
    constructor(scope: Construct, id: string, iamRoleName: string, roleConfig?: RoleProps) {
      super(scope, id);
      
      const roleProps = {
          id: id,
          roleName: iamRoleName,
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
      };
      const role = new Role(
          scope,
          iamRoleName,
          { ...roleConfig, ...roleProps },
      )
      return role;
    }
}


