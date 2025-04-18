from django.views.generic import ListView, DetailView, CreateView, FormView
from django.urls import reverse_lazy
from .models import Blog, Review, Comment
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login


# Vista para el registro de usuarios
class SignUpView(FormView):
    template_name = 'blogapp/signup.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('blogapp:blog_list')

    def form_valid(self, form):
        # Guarda el usuario y lo autentica
        user = form.save()
        login(self.request, user)
        return super().form_valid(form)  # Usa el flujo estándar de FormView

    def form_invalid(self, form):
        # Renderiza errores en la plantilla
        form.add_error(None, "Por favor, corrige los errores e intenta nuevamente.")
        return super().form_invalid(form)

class UserLoginView(LoginView):
    template_name = 'blogapp/login.html'

    def form_invalid(self, form):
        # Agrega un mensaje de error genérico si las credenciales son incorrectas
        form.add_error(None, "Usuario o contraseña incorrectos. Intenta de nuevo.")
        return super().form_invalid(form)

# Vista para cerrar sesión
class UserLogoutView(LogoutView):
    next_page = 'blogapp:blog_list'  # Redirige a la lista de blogs después de cerrar sesión

#HACIA ARRIBA TODO ES NUEVO 

class BlogListView(ListView):
    model = Blog
    template_name = 'blogapp/blog_list.html'


class BlogDetailView(DetailView):
    model = Blog
    template_name = 'blogapp/blog_detail.html'


class BlogCreateView(LoginRequiredMixin, CreateView):
    model = Blog
    fields = ['title', 'content']
    template_name = 'blog_form.html'

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.object.pk})



class ReviewCreateView(CreateView):
    model = Review
    fields = ['rating', 'comment']
    template_name = 'blogapp/review_form.html'

    def form_valid(self, form):
        form.instance.reviewer = self.request.user
        form.instance.blog_id = self.kwargs['pk']
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['pk']})


class CommentCreateView(CreateView):
    model = Comment
    fields = ['content']
    template_name = 'blogapp/comment_form.html'

    def form_valid(self, form):
        form.instance.commenter = self.request.user
        form.instance.review_id = self.kwargs['review_pk']
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['blog_pk']})