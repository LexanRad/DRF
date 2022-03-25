from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer

from .models import Project, ToDo


class ProjectModelSerializer(HyperlinkedModelSerializer):
    users = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        # fields = '__all__'
        fields = ['id', 'url', 'name', 'repository', 'users']


class ToDoModelSerializer(HyperlinkedModelSerializer):
    active = serializers.BooleanField(initial=True)

    class Meta:
        model = ToDo
        fields = '__all__'
