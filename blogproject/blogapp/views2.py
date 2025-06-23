from django.contrib.auth.models import User
from .models import Blog, Review, Comment, Category, Tag, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (UserSerializer, BlogSerializer)
from rest_framework import status, generics
from django.shortcuts import get_object_or_404


class SignUpAPIView(APIView):
    def post(self, request):
        # Verificar que se envien los datos correctos
        serializer = UserSerializer(data = request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({'user': serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginAPIView(APIView):
    def post(self, request):
        user = get_object_or_404(User, username=request.data['username'])

        if not user.check_password(request.data['password']):
            return Response({"error": "Contrasena invalida"}, status=status.HTTP_400_DAB_REQUEST)
        
        serializer = UserSerializer(instance=user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)


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