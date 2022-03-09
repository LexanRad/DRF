from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Project, ToDo
from .serializers import ProjectModelSerializer, ToDoModelSerializer
from .pagination import ProjectPageNumberPagination, ToDoPageNumberPagination


class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
    pagination_class = ProjectPageNumberPagination

    def get_queryset(self):
        name = self.request.query_params.get('name', '')

        if name:
            self.queryset = self.queryset.filter(name__contains=name)
        return self.queryset


class ToDoModelViewSet(ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoModelSerializer
    pagination_class = ToDoPageNumberPagination

    def get_queryset(self):
        project = self.request.query_params.get('project', '')
        date_qt = self.request.query_params.get('date_qt', '')
        date_lt = self.request.query_params.get('date_lt', '')
        if project:
            self.queryset = self.queryset.filter(project__name=project)
        if date_qt and date_lt:
            self.queryset = self.queryset.filter(created__gt=date_qt, created__lt=date_lt)

        return self.queryset

    def destroy(self, request, pk=None):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
