from .serializers import *
from .models import LinksModel
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status

import sys
sys.path.insert(0, '../')
from vids_collector import vids_collector as vid

class DualSerializerViewSet(viewsets.ModelViewSet):
    # mapping serializer into the action
    serializer_classes = {
        'list': LinksDataSerializer,
        'retrieve': LinksDataSerializer,
        # ... other actions
    }
    default_serializer_class = LinksRetrieveSerializer # Your default serializer

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

    queryset = LinksModel.objects.all()

    @action(detail=False, methods=['post'])
    def get_links(self, request, pk=None):
        if request.method == 'POST':
            page_num = request.data["page_num"]
            search_term = request.data["search"]

            titles, hrefs, thumbnails_src = vid.get_vids("https://xmoviesforyou.video/page/" + str(page_num) + "/?s=" + search_term)

            if (titles != "F"):
                LinksModel.objects.all().delete()
                for video in zip(titles, hrefs, thumbnails_src):
                    title = video[0]
                    href = video[1]
                    thumbnail_src = video[2]
                    LinksModel.objects.create(page_num=page_num,title=title,href=href, thumbnail_src=thumbnail_src)

                data = LinksModel.objects.first()

                serializer = LinksDataSerializer(data=data.__dict__)
                if serializer.is_valid():
                    return Response("Success", status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Error", status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def get_vid(self, request, pk=None):
        if request.method == 'GET':
            video = get_object_or_404(LinksModel, pk=self.kwargs['pk'])
            video.src = vid.get_src2(video.href)
            if (video.src != "F"):
                video.save()
                serializer = LinksDataSerializer(data=video.__dict__)
                if serializer.is_valid():
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Error", status=status.HTTP_201_CREATED)
            