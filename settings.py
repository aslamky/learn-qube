# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import environ
import logging
from django.contrib.messages import constants as messages

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env = environ.Env(DEBUG=(bool, False),)
environ.Env.read_env()

SECRET_KEY = env('SECRET_KEY')
# DEBUG = env('DEBUG')
DEBUG = True

DATABASES = {
    'default': env.db()
}

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = (
    'suit',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'app',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

ROOT_URLCONF = 'urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

MESSAGE_TAGS = {
    messages.DEBUG: 'alert-info',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}

LOGGING_CONFIG = None
logfmt = ' %(asctime)s %(filename)-15s:%(lineno)-5s %(levelname)-8s %(message)s'
handlers = [logging.StreamHandler(), logging.FileHandler('logs/django.log')]
logging.basicConfig(format=logfmt, level=logging.INFO, handlers=handlers)

WSGI_APPLICATION = 'wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

TIME_ZONE = 'Asia/Kolkata'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_ROOT = 'app/static'
STATIC_URL = '/static/'

DEEPSTREAM_URL = env('DEEPSTREAM_URL')
OPENVIDU_URL = env('OPENVIDU_URL')

LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/home'
LOGOUT_REDIRECT_URL = '/'

