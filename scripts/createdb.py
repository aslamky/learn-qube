#!/usr/bin/env python

import os
import environ

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env = environ.Env()
env_file = os.path.join(BASE_DIR, '.env')
environ.Env.read_env(env_file)
db = env.db()

sql = """
    DROP DATABASE IF EXISTS {NAME};
    DROP USER IF EXISTS {USER};
    CREATE USER {USER} WITH PASSWORD '{PASSWORD}';
    CREATE DATABASE {NAME} WITH OWNER {USER};
"""

sql = sql.format(**db)
print(sql)
