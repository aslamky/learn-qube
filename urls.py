
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from app.views import *

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^home', HomeView.as_view(), name='home'),
    url(r'^classroom', ClassRoomView.as_view(), name='classroom'),
    url(r'^signup', SignupView.as_view(), name='signup'),
    url(r'^login', LoginView.as_view(), name='login'),
    url(r'^logout/$', auth_views.logout),
    url(r'^demo', TemplateView.as_view(template_name='demo.html')),
]
