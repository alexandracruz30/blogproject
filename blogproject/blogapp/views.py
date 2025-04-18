from django.views.generic import ListView, DetailView, CreateView, FormView
from django.urls import reverse_lazy
from .models import Blog, Review, Comment
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse


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

# Proteger acceso a crear nuevos blogs
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
    model = Review  # Modelo que se utilizará para el formulario (modelo Review)
    fields = ['rating', 'comment']  # Campos que aparecerán en el formulario
    template_name = 'blogapp/review_form.html'  # Template que se usará para renderizar el formulario

    def dispatch(self, request, *args, **kwargs):
        # Se ejecuta antes de procesar GET o POST
        # Verifica si el usuario está autenticado
        if not request.user.is_authenticated:
            # Si no está autenticado, muestra un mensaje de error
            messages.error(
                request,
                "Debes iniciar sesión para agregar una reseña."
            )
            # Redirige al login y agrega la URL actual como `next`, para redirigir luego de login
            return redirect(f"{reverse('blogapp:login')}?next={request.path}")
        # Si está autenticado, continúa con el flujo normal
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        # Antes de guardar el formulario, se asigna el usuario actual como revisor
        form.instance.reviewer = self.request.user
        # También se asocia la reseña con un blog específico usando el `pk` de la URL
        form.instance.blog_id = self.kwargs['pk']
        return super().form_valid(form)

    def get_success_url(self):
        # Redirige al detalle del blog después de guardar la reseña con éxito
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['pk']})

class CommentCreateView(CreateView):
    model = Comment  # Modelo que se utilizará para el formulario (modelo Comment)
    fields = ['content']  # Campo del comentario que aparecerá en el formulario
    template_name = 'blogapp/comment_form.html'  # Template que se usará para renderizar el formulario

    def dispatch(self, request, *args, **kwargs):
        # Se ejecuta antes de procesar GET o POST
        # Verifica si el usuario está autenticado
        if not request.user.is_authenticated:
            # Si no está autenticado, muestra un mensaje de error
            messages.error(
                request,
                "Debes iniciar sesión para agregar un comentario."
            )
            # Redirige al login con el parámetro `next` para redirigir después del login
            return redirect(f"{reverse('blogapp:login')}?next={request.path}")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        # Antes de guardar el formulario, se asigna el usuario actual como comentarista
        form.instance.commenter = self.request.user
        # Se asocia el comentario con una reseña específica usando `review_pk` de la URL
        form.instance.review_id = self.kwargs['review_pk']
        return super().form_valid(form)

    def get_success_url(self):
        # Redirige al detalle del blog al que pertenece la reseña después de guardar el comentario con éxito
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['blog_pk']})
