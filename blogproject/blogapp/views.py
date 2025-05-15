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
from .models import Blog, Review, Comment, Category, Tag
from django import forms  # Import necesario para personalizar widgets
from django.db.models import Avg
from django.views.generic import TemplateView
from django.db.models import Count, Avg
from .models import Blog
from django.shortcuts import get_object_or_404
from blogapp.models import Blog, Review, Comment

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
    """Vista para listar todos los blogs disponibles."""
    model = Blog
    template_name = 'blogapp/blog_list.html'
    context_object_name = 'blogs'
    paginate_by = 3

    def get_queryset(self):
        queryset = Blog.objects.annotate(average_rating=Avg('reviews__rating')).order_by('-created_at')
        category_slug = self.kwargs.get('category_slug')
        tag_slug = self.kwargs.get('tag_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()  # pylint: disable=no-member
        context['tags'] = Tag.objects.all()  # pylint: disable=no-member
        return context

class BlogDetailView(DetailView):
    """Vista para mostrar los detalles de un blog específico."""
    model = Blog
    template_name = 'blogapp/blog_detail.html'
    context_object_name = 'blog'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['average_rating'] = self.object.average_rating()  # Calcula el promedio
        return context
class BlogCreateView(LoginRequiredMixin, CreateView):
    model = Blog
    fields = ['title', 'content', 'image']  # Excluye 'category' y 'tags' porque se manejarán manualmente
    template_name = 'blog_form.html'

    def form_valid(self, form):
        # Asignar el autor del blog
        form.instance.author = self.request.user

        # Procesar categoría
        category_name = self.request.POST.get('category')
        if category_name:
            # Crear o recuperar la categoría ingresada
            category, _ = Category.objects.get_or_create(name=category_name.strip())  # pylint: disable=no-member
            form.instance.category = category

        # Procesar etiquetas
        tags_input = self.request.POST.get('tags')
        if tags_input:
            tag_names = [tag.strip() for tag in tags_input.split(',')]
            tags = []
            for tag_name in tag_names:
                # Crear o recuperar cada etiqueta ingresada
                tag, _ = Tag.objects.get_or_create(name=tag_name)  # pylint: disable=no-member
                tags.append(tag)
            form.instance.save()  # Guarda el blog primero para agregar las etiquetas
            form.instance.tags.set(tags)

        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.object.pk})
    
#Implementación para control de una review por usuario 
class ReviewCreateView(CreateView):
    """Vista para crear reseñas sobre blogs (requiere autenticación)."""
    model = Review
    fields = ['rating', 'comment']  # Campos mostrados en el formulario
    template_name = 'blogapp/review_form.html'

    def get_form(self, form_class=None):
        """Personaliza el formulario generado automáticamente."""
        form = super().get_form(form_class)
        form.fields['rating'].widget = forms.NumberInput(attrs={
            'min': 1,                 # Valor mínimo permitido
            'max': 5,                 # Valor máximo permitido
            'step': 1,                # Incremento del spinner
        })
        return form

    def dispatch(self, request, *args, **kwargs):
        """Verifica autenticación antes de procesar la solicitud."""
        if not request.user.is_authenticated:
            messages.error(request, "Debes iniciar sesión para agregar una reseña.")
            return redirect(f"{reverse('blogapp:login')}?next={request.path}")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        """Valida que el usuario no haya enviado una reseña previa y guarda la nueva reseña."""
        user = self.request.user
        blog_id = self.kwargs['pk']

        # Validar si ya existe una reseña del usuario para este blog
        if Review.objects.filter(blog_id=blog_id, reviewer=user).exists():  # pylint: disable=no-member
            messages.error(self.request, "Ya has enviado una reseña para este blog.")
            return redirect(reverse('blogapp:blog_detail', kwargs={'pk': blog_id}))

        # Asigna el usuario actual y el blog asociado antes de guardar la reseña
        form.instance.reviewer = user
        form.instance.blog_id = blog_id
        return super().form_valid(form)

    def get_success_url(self):
        """Obtiene la URL para redirigir tras crear la reseña exitosamente."""
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
        form.instance.review = get_object_or_404(Review, pk=self.kwargs['review_pk']) 

        return super().form_valid(form)

    def get_success_url(self):
        """Obtiene la URL para redirigir tras crear el comentario exitosamente.

        Returns:
            str: URL para ver el detalle del blog asociado al comentario.
        """
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['blog_pk']})
    def form_valid(self, form):
        print("✅ Comentario válido. Guardando comentario...")
        form.instance.commenter = self.request.user
        form.instance.review = get_object_or_404(Review, pk=self.kwargs['review_pk'])
        return super().form_valid(form)

    def form_invalid(self, form):
        print("❌ Error al enviar comentario:", form.errors)
        return super().form_invalid(form)


from django.db.models import Count

class BlogStatsView(TemplateView):
    template_name = "blogapp/blog_stats.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Blogs con más reseñas (según tu solicitud)
        context['blogs_con_mas_reviews'] = Blog.objects.annotate(
            num_reviews=Count('reviews')
        ).order_by('-num_reviews')[:7]

        # Blogs mejor puntuados 
        context['blogs_mejor_puntuados'] = Blog.objects.annotate(
            promedio_puntuacion=Avg('reviews__rating')
        ).order_by('-promedio_puntuacion')[:7]

        return context
