from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializer import *

@api_view(['GET'])
def get_all_roads(request):
    roads = TblRoads.objects.values('road_code', 'name', 'length_km', 'geomtype', 'coordinates')
    
    return Response(TblRoadsSerializer(roads, many=True).data, status=200)


