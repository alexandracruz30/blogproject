from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (UserSerializer)
from rest_framework import status

class SignUpAPIView(APIView):
    def post(self, request):
        # Verificar que se envien los datos correctos
        serializer = UserSerializer(data = request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({'user': serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)