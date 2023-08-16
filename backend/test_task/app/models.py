from django.db import models

class TblAzs(models.Model):
    road_code = models.IntegerField(blank=True, null=True)
    geomtype = models.TextField(blank=True, null=True)
    coordinates = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_azs'


class TblRoads(models.Model):
    road_code = models.IntegerField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    length_km = models.TextField(blank=True, null=True)  # This field type is a guess.
    geomtype = models.TextField(blank=True, null=True)
    coordinates = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tbl_roads'
