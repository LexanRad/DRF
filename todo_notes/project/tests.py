from django.contrib.auth import get_user_model
import json
from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APITestCase
from mixer.backend.django import mixer

from usersapp.models import User
from .views import ProjectModelViewSet
from .models import Project


class TestProjectViewSetTestCase(TestCase):
    def setUp(self):
        self.super_user = get_user_model().objects.create_superuser(
            username='admintest', email='admin@test.com', password='Z123xcvbnm'
        )
        self.user = get_user_model().objects.create_user(
            username='test1', email='test1@test.com', password='Z123xcvbnm'
        )
        self.project = {'users': ['http://127.0.0.1:8000/api/users/1/', 'http://127.0.0.1:8000/api/users/2/'],
                        'name': 'x',
                        'repository': 'https://repo.com'}

    # Тесты для  'rest_framework.permissions.IsAuthenticated'
    def test_get_list_quest(self):
        factory = APIRequestFactory()
        request = factory.get('/api/projects/')
        view = ProjectModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_user(self):
        factory = APIRequestFactory()
        request = factory.get('/api/projects/')
        force_authenticate(request, user=self.user)
        view = ProjectModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_quest(self):
        project_data = {'name': 'Project', 'repository': 'Repo'}
        factory = APIRequestFactory()
        request = factory.post('api/projects', project_data, format='json')
        view = ProjectModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_admin(self):
        project = mixer.blend(Project)
        factory = APIRequestFactory()
        request = factory.post('/api/projects', self.project, format='json')
        force_authenticate(request, user=self.super_user)
        view = ProjectModelViewSet.as_view({'post': 'create'})
        response = view(request)
        print(response.render().content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user(self):
        factory = APIRequestFactory()
        request = factory.post('/api/projects', self.project, format='json')
        force_authenticate(request, user=self.user)
        view = ProjectModelViewSet.as_view({'post': 'create'})
        response = view(request)
        print(response.render().content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TestProjectModelViewSetAPIClient(TestCase):
    def setUp(self):
        self.super_user = get_user_model().objects.create_superuser(
            username='admintest', email='admin@test.com', password='Z123xcvbnm'
        )
        self.user = get_user_model().objects.create_user(
            username='test1', email='test1@test.com', password='Z123xcvbnm'
        )
        self.project = {'users': ['http://127.0.0.1:8000/api/users/1/', 'http://127.0.0.1:8000/api/users/2/'],
                        'name': 'x',
                        'repository': 'https://repo.com'}

    def test_get_list_quest(self):
        client = APIClient()
        response = client.get('/api/projects/')
        print(response.render().content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_user(self):
        self.client.login(username=self.user.username, password=self.user.password)  # 401
        token = Token.objects.get(user__username=self.super_user.username)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        client.force_authenticate(user=self.super_user)
        response = client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestProjectModelViewSetAPITestCase(APITestCase):
    def setUp(self):
        self.super_user = get_user_model().objects.create_superuser(
            username='admintest', email='admin@test.com', password='Z123xcvbnm'
        )
        self.user = get_user_model().objects.create_user(
            username='test1', email='test1@test.com', password='Z123xcvbnm'
        )
        self.project = {'users': ['http://127.0.0.1:8000/api/users/1/', 'http://127.0.0.1:8000/api/users/2/'],
                        'name': 'x',
                        'repository': 'https://repo.com'}

    def test_get_list_quest(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_user(self):
        self.client.force_login(self.super_user)
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_quest(self):
        response = self.client.post('/api/projects/', self.project)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user(self):
        self.client.login(username='admintest', password='Z123xcvbnm')
        response = self.client.post('/api/projects/', self.project)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
