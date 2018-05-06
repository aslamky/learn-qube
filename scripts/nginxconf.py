#!/usr/bin/env python

import os
import environ
from jinja2 import Template

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env()
env_file = os.path.join(BASE_DIR, '.env')
environ.Env.read_env(env_file)

conf = open('deploy/nginx.conf').read()
envdict = dict(env.ENVIRON)

conf = Template(conf).render(**envdict)
print(conf)

