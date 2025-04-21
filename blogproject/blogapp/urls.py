from django.urls import path
from .views import BlogListView, BlogDetailView, ReviewCreateView, CommentCreateView, BlogCreateView,SignUpView, UserLoginView, UserLogoutView

app_name = 'blogapp'


urlpatterns = [
    path('', BlogListView.as_view(), name='blog_list'),
    path('blog/add/', BlogCreateView.as_view(), name='add_blog'),
    path('blog/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),
    path('blog/<int:pk>/review/', ReviewCreateView.as_view(), name='add_review'),
    path('blog/<int:blog_pk>/review/<int:review_pk>/comment/', CommentCreateView.as_view(), name='add_comment'),
    path('signup/', SignUpView.as_view(), name='signup'),  # Ruta para registrarse
    path('login/', UserLoginView.as_view(), name='login'),  # Ruta para iniciar sesión
    path('logout/', UserLogoutView.as_view(), name='logout'),  # Ruta para cerrar sesión
]