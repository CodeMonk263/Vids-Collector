# Create your views here.
from .models import LinksModel
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from .viewsets import *

from rest_framework import status

from django.views.generic.detail import DetailView

import sys
sys.path.insert(0, '../')
from vids_collector import vids_collector as vid

page_num = 0


@api_view(['POST', 'GET'])
def links_list(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        links = LinksModel.objects.all()
        serializer = LinksDataSerializer(links, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        LinksModel.objects.all().delete()
        page_num = request.data
        titles, hrefs = vid.get_vids("https://xmoviesforyou.video/page/" + str(page_num))

        for video in zip(titles,hrefs):
            title = video[0]
            href = video[1]
            LinksModel.objects.create(page_num=page_num,title=title,href=href)

        data = LinksModel.objects.first()

        serializer = LinksDataSerializer(data=data.__dict__)
        if serializer.is_valid():
            serializer.save()
            return Response("Success", status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
