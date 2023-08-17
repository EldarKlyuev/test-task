from rest_framework import serializers
from .models import *

class TblAzsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblAzs
        fields = "__all__"


class TblRoadsSerializer(serializers.ModelSerializer):
    class Meta:
        models = TblRoads
        fields = ('road_code', 'name', 'length_km', 'geomtype', 'coordinates')