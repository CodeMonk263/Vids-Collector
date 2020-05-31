from rest_framework import serializers, fields
from .models import LinksModel

class LinksRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinksModel
        fields = ('page_num', 'search')

    
class LinksDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinksModel
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True}
        }
    