from django.db import models

class LinksModel(models.Model):
    page_num = models.CharField(max_length=3)
    title = models.CharField(max_length=60)
    href = models.CharField(max_length=300)
    thumbnail_src = models.CharField(max_length=400, default='None')
    src = models.CharField(max_length=400, default='None')
    search = models.CharField(max_length=30, default='None')