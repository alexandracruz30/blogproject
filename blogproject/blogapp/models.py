"""
Este módulo define los modelos de la aplicación BlogApp, incluyendo:
- Blog: Representa un artículo de blog.
- Review: Representa una reseña de un blog.
- Comment: Representa un comentario en una reseña.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify

class Category(models.Model):
    """Modelo para categorías de blogs."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # Genera el slug solo si no existe
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.name)  # Asegura que devuelve una cadena


class Tag(models.Model):
    """Modelo para etiquetas de blogs."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # Genera el slug solo si no existe
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.name)  # Asegura que devuelve una cadena
# MODELOS
class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = RichTextUploadingField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)  # Campo para imágenes
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="blogs")
    tags = models.ManyToManyField(Tag, blank=True, related_name="blogs")
   
    def __str__(self):
        return str(self.title)  # Asegura que devuelve una cadena
    
    def average_rating(self):
        """Calcula el promedio de las calificaciones de las reseñas asociadas al blog."""
        return self.reviews.aggregate(Avg('rating'))['rating__avg'] or 0  # pylint: disable=no-member

class Review(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer.username} - {self.blog.title}"  # pylint: disable=no-member



class Comment(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.commenter.username}"  # pylint: disable=no-member