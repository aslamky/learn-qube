# from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from braces.views import LoginRequiredMixin
from app.models import UserProfile

class IndexView(TemplateView):
    template_name = "index.html"

class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"

class ClassRoomView(LoginRequiredMixin, TemplateView):
    template_name = "classroom.html"

class SignupView(TemplateView):
    template_name = "signup.html"

    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')
        # username = email.split('@')[0]
        username = email
        password = request.POST.get('password')

        user = User.objects.filter(email=email).first()
        if user:
            return HttpResponseRedirect('/home')

        user = User.objects.create_user(username, email, password)

        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.profile.roles = [request.POST.get('role')]
        
        user.profile.save()
        user.save()

        login(request, user)
        return HttpResponseRedirect('/home')


class LoginView(TemplateView):
    template_name = "login.html"

    def post(self, request, *args, **kwargs):
        email = username = request.POST.get('email')
        password = request.POST.get('password')

        user = User.objects.filter(username=username).first()

        if not user:
            return HttpResponse("User doesn't exist. Please signup and try again.")

        user = authenticate(username=username, password=password)
        if not user:
            return HttpResponse("Password incorrect. Please try again or reset password.")

        login(request, user)
        return HttpResponseRedirect('/home')

