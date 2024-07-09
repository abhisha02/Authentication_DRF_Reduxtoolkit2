from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer
from rest_framework import serializers
from accounts.models import User,UserProfile
from rest_framework_simplejwt.tokens import RefreshToken, Token,AccessToken
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError as DjangoValidationError


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        # ...
        
        return token
    
# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password',)
        
class UserDetailsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_pic']
    

class UserRegisterSerializer(serializers.ModelSerializer):
    # Add email and password validators
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'phone_number', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def validate_email(self, value):
        # Check if email is already in use
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
            instance.save()
            return instance
        else:
            raise serializers.ValidationError({"password": "Password is not valid."})
       
#Admin#

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_pic']
        
class AdminUserSerializer(serializers.ModelSerializer):
    User_Profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'User_Profile','password','is_active']
        extra_kwargs = {
            'password':{ 'write_only':True},
            'first_name': {'error_messages': {'required': 'Please provide the first name.'}},
            'last_name': {'error_messages': {'required': 'Please provide the last name.'}},
            'phone_number': {'error_messages': {'required': 'Please provide the phone number.'}},
            'email': {'error_messages': {'required': 'Please provide the email address.'}},
            
            
        }
    
    def create(self, validated_data):
        profile_data = validated_data.pop('User_Profile')
        password = validated_data.pop('password',None)
        print("-=-=-=-=-=")
        print(password)
        user_instance = self.Meta.model(**validated_data)
        if password is not None:
            user_instance.set_password(password)
            user_instance.is_active=True
            user_instance.save()
            
        UserProfile.objects.create(user=user_instance, **profile_data)
        return user_instance
    
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'phone_number', 'email', 'is_active']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance