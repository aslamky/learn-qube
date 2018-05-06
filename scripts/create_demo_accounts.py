import json
from django.contrib.auth.models import User

def run():
    accounts = json.loads(open('scripts/demo_accounts.json').read())['accounts']
    
    for account in accounts:
        username = email = account.get('email')
        user = User.objects.create_user(username, email, account.get('password'))
    
        user.first_name = account.get('first_name')
        user.last_name = account.get('last_name')
        user.profile.roles = [account.get('first_name')]
    
        user.profile.save()
        user.save()

