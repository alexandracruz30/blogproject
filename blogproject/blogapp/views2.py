from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Blog, Review, Comment, Category, Tag, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (UserSerializer, BlogSerializer, ReviewSerializer)
from rest_framework import status, generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404


class SignUpAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generar token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response({
                'user': serializer.data,
                'access_token': access_token,
                'refresh_token': refresh_token,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Usuario o contraseña incorrectos"}, status=status.HTTP_400_BAD_REQUEST)

        # Generar token JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        serializer = UserSerializer(user)
        return Response({
            "user": serializer.data,
            "access_token": access_token,
            "refresh_token": refresh_token,
        }, status=status.HTTP_200_OK)


# =================== Blogs ====================== #

class BlogListAPIView(generics.ListAPIView):
    serializer_class = BlogSerializer

    def get_queryset(self):
        queryset = Blog.objects.annotate(
            average_rating=Avg('reviews__rating')
        ).order_by('-created_at')

        category_slug = self.request.query_params.get('category_slug')
        tag_slug = self.request.query_params.get('tag_slug')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)

        return queryset
    

class BlogDetailAPiView(APIView):
    def get(self, request, blog_id):
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BlogCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        data = request.data.copy()

        # Procesar categoría
        category_name = data.get('category')
        if isinstance(category_name, list):
            category_name = category_name[0]

        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name.strip())
            data['category'] = category.id

        # Extraer tags para manejar ManyToMany
        tags_input = data.pop('tags', None)
        tag_objs = []
        if tags_input:
            # Si la lista se escribe asi ['tag1, tag2']
            if isinstance(tags_input, list):
                tags_input = tags_input[0]

            tag_names = [tag.strip() for tag in tags_input.split(',')]
            for tag_name in tag_names:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                tag_objs.append(tag)


        # Se crea serializer
        serializer = BlogSerializer(data=data)
        if serializer.is_valid():
            # Asignar autor
            blog = serializer.save(author=request.user)
            # Asignar tags ManyToMany
            if tag_objs:
                blog.tags.set(tag_objs)

            return Response(BlogSerializer(blog).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ==================== Reviews =====================
class ReviewCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, blog_id):
        user = request.user

        # Validar si el blog existe
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Validar si ya hay una reseña
        if Review.objects.filter(blog=blog, reviewer=user).exists():
            return Response({'error': 'Ya has enviado una reseña para este blog'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la reseña manualmente
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(reviewer=user, blog=blog)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)