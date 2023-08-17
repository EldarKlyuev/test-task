from rest_framework import serializers
from .models import *

class TblAzsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblAzs
        fields = "__all__"


class TblRoadsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblRoads
        fields = "__all__"