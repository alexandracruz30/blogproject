"""Módulo que contiene todas las vistas de la aplicación Blog.

Incluye vistas para autenticación (registro, login, logout), gestión de blogs,
reseñas y comentarios.
"""
from django.views.generic import ListView, DetailView, CreateView, FormView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse
from .models import Blog, Review, Comment


class SignUpView(FormView):
    """Vista para el registro de usuarios en el sistema.
    """
    template_name = 'blogapp/signup.html'
    form_class = UserCreationForm
    success_url = reverse_lazy('blogapp:blog_list')

    def form_valid(self, form):
        """Procesa un formulario válido, guarda el usuario y lo autentica.
        """
        user = form.save()
        login(self.request, user)
        return super().form_valid(form)

    def form_invalid(self, form):
        """Maneja un formulario inválido agregando un mensaje de error genérico.
        """
        form.add_error(None, "Por favor, corrige los errores e intenta nuevamente.")
        return super().form_invalid(form)


class UserLoginView(LoginView):
    """Vista para el inicio de sesión de usuarios.
    """
    template_name = 'blogapp/login.html'

    def form_invalid(self, form):
        """Maneja credenciales inválidas mostrando un mensaje de error.
        """
        form.add_error(None, "Usuario o contraseña incorrectos. Intenta de nuevo.")
        return super().form_invalid(form)


class UserLogoutView(LogoutView):
    """Vista para cerrar sesión.
    """
    next_page = 'blogapp:blog_list'


class BlogListView(ListView):
    """Vista para listar todos los blogs disponibles.
    """
    model = Blog
    template_name = 'blogapp/blog_list.html'


class BlogDetailView(DetailView):
    """Vista para mostrar los detalles de un blog específico.
    """
    model = Blog
    template_name = 'blogapp/blog_detail.html'


class BlogCreateView(LoginRequiredMixin, CreateView):
    model = Blog
    fields = ['title', 'content', 'image']  # Incluye el campo de imagen
    template_name = 'blog_form.html'

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.object.pk})
    
class ReviewCreateView(CreateView):
    """Vista para crear reseñas sobre blogs (requiere autenticación).
    """
    model = Review
    fields = ['rating', 'comment']
    template_name = 'blogapp/review_form.html'

    def dispatch(self, request, *args, **kwargs):
        """Verifica autenticación antes de procesar la solicitud.
        """
        if not request.user.is_authenticated:
            messages.error(request, "Debes iniciar sesión para agregar una reseña.")
            return redirect(f"{reverse('blogapp:login')}?next={request.path}")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        """Asigna el usuario actual y el blog asociado antes de guardar la reseña.
        """
        form.instance.reviewer = self.request.user
        form.instance.blog_id = self.kwargs['pk']
        return super().form_valid(form)

    def get_success_url(self):
        """Obtiene la URL para redirigir tras crear la reseña exitosamente.
        """
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['pk']})


class CommentCreateView(CreateView):
    """Vista para crear comentarios sobre reseñas (requiere autenticación).
    """
    model = Comment
    fields = ['content']
    template_name = 'blogapp/comment_form.html'

    def dispatch(self, request, *args, **kwargs):
        """Verifica autenticación antes de procesar la solicitud.
        """
        if not request.user.is_authenticated:
            messages.error(request, "Debes iniciar sesión para agregar un comentario.")
            return redirect(f"{reverse('blogapp:login')}?next={request.path}")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        """Asigna el usuario actual y la reseña asociada antes de guardar el comentario.
        """
        form.instance.commenter = self.request.user
        form.instance.review_id = self.kwargs['review_pk']
        return super().form_valid(form)

    def get_success_url(self):
        """Obtiene la URL para redirigir tras crear el comentario exitosamente.

        Returns:
            str: URL para ver el detalle del blog asociado al comentario.
        """
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['blog_pk']})