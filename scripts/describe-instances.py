import boto3

def ec2_instance_types(region_name):
    '''Yield all available EC2 instance types in region <region_name>'''
    ec2 = boto3.client('ec2', region_name=region_name)
    describe_args = {}
    while True:
        describe_result = ec2.describe_instance_types(**describe_args)
        yield from [i['InstanceType'] for i in describe_result['InstanceTypes']]
        if 'NextToken' not in describe_result:
            break
        describe_args['NextToken'] = describe_result['NextToken']


types = set()

for ec2_type in ec2_instance_types('us-west-2'):
    types.add(ec2_type)

for type_ in sorted(types):
    print(type_)
