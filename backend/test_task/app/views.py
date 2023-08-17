from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializer import *

@api_view(['GET'])
def get_all_roads(request):
    roads = TblRoads.objects.values('road_code', 'name', 'length_km', 'geomtype', 'coordinates')
    print(len(roads))
    return Response(TblRoadsSerializer(roads, many=True).data, status=200)


@api_view(['GET'])
def get_only_one_road(request, **kwargs):
    road_code = kwargs.get('road_code', None)
    if not road_code:
        return Response({"error": "Invalid URL"}, status=400)
    
    road = TblRoads.objects.values('road_code', 'name', 'length_km', 'geomtype', 'coordinates').filter(road_code=road_code)

    return Response(TblRoadsSerializer(road, many=True).data, status=200)

@api_view(['GET'])
def get_azs_for(request, **kwargs):
    road_code = kwargs.get('road_code', None)
    if not road_code:
        return Response({"error": "Invalid URL"}, status=400)
    
    azs = TblAzs.objects.values('road_code', 'geomtype', 'coordinates').filter(road_code=road_code)

    return Response(TblAzsSerializer(azs, many=True).data, status=200)