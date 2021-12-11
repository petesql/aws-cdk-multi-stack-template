
build:
	echo "running build..."
	npm run build
synth:
	cdk synth --all
synth-core:
	cdk synth core-stack
synth-iam:
	cdk synth-iam
synth-ec2:
	cdk synth ec2-stack
diff:
	cdk diff
watch:
	echo "running watch..."
	npm run watch
test: 
	echo "running unit tests..."
	npm run test
deploy-vpc:
	echo "deploying vpc stack..."
	cdk deploy core-stack
deploy-iam:
	echo "deploying iam stack..."
deploy-ec2:
	echo "deploying ec2 stack..."
