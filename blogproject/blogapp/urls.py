from django.urls import path
from .views import BlogListView, BlogDetailView, ReviewCreateView, CommentCreateView, BlogCreateView,SignUpView, UserLoginView, UserLogoutView
from .views import BlogStatsView
from .views2 import (SignUpAPIView, LoginAPIView)

app_name = 'blogapp'


urlpatterns = [
    path('', BlogListView.as_view(), name='blog_list'),  # Página principal: lista de todos los blogs
    path('blog/add/', BlogCreateView.as_view(), name='add_blog'),  # Crear un nuevo blog
    path('blog/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),  # Detalles de un blog por su ID
    path('blog/<int:pk>/review/', ReviewCreateView.as_view(), name='add_review'),  # Agregar una reseña a un blog
    path('blog/<int:blog_pk>/review/<int:review_pk>/comment/', CommentCreateView.as_view(), name='add_comment'),  # Agregar un comentario a una reseña específica

    path('signup/', SignUpView.as_view(), name='signup'),  # Página de registro de usuario
    path('login/', UserLoginView.as_view(), name='login'),  # Página de inicio de sesión
    path('logout/', UserLogoutView.as_view(), name='logout'),  # Página para cerrar sesión

    path('category/<slug:category_slug>/', BlogListView.as_view(), name='blogs_by_category'),  # Filtrar blogs por categoría usando slug
    path('tag/<slug:tag_slug>/', BlogListView.as_view(), name='blogs_by_tag'),  # Filtrar blogs por etiqueta (tag) usando slug
    path('estadisticas/', BlogStatsView.as_view(), name='blog_stats'), # esto para la parte de estadisticaspath('blog/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),


    # Rutas de la API =============================================
    
    # Autenticacion del usuarii
    path('api/signup/',SignUpAPIView.as_view()),
    path('api/login/',LoginAPIView.as_view()),
]