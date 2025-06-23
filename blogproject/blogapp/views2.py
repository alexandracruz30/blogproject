from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (UserSerializer)
from rest_framework import status
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
