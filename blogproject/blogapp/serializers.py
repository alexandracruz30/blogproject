from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (Blog,Category,Comment,Review,Tag)


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # eliminar password2 porque no es parte del modelo
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    
# Categoria ======================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


# Tag =============================
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


# Comment ========================
class CommentSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'commenter', 'content', 'created_at']
        read_only_fields = ['commenter', 'review']


# Review =========================
class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'rating', 'comment', 'created_at', 'comments']
        read_only_fields = ['reviewer', 'blog', 'created_at']
    
    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data


# Blog ===========================
class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(required=False)
    tags = TagSerializer(many=True, required=False)
    average_rating = serializers.FloatField(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'content', 'image', 'author',
            'created_at', 'category', 'tags',
            'average_rating', 'reviews'
        ]

    def create(self, validated_data):
        category_data = validated_data.pop('category', None)
        tags_data = validated_data.pop('tags', [])
        blog = Blog.objects.create(**validated_data)

        # Crear o asociar categoría
        if category_data:
            category, _ = Category.objects.get_or_create(**category_data)
            blog.category = category

        # Crear o asociar tags
        tag_objs = []
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            tag_objs.append(tag)
        blog.save()
        blog.tags.set(tag_objs)

        return blog