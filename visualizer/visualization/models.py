from django.db import models

# Create your models here.
class Article(models.Model):
    end_year = models.IntegerField(blank=True, null=True)
    intensity = models.IntegerField(blank=True, null=True)
    sector = models.CharField(max_length=60, blank=True, null=True)
    topic = models.CharField(max_length=60, blank=True, null=True)
    insight = models.CharField(max_length=250)
    url = models.URLField(max_length=600)
    region = models.CharField(max_length=50, blank=True, null=True)
    start_year = models.IntegerField(blank=True, null=True)
    impact = models.IntegerField(blank=True, null=True)
    added = models.DateTimeField()
    published = models.DateTimeField(blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    relevance = models.IntegerField(blank=True, null=True)
    pestle = models.CharField(max_length=20, blank=True, null=True)
    source = models.CharField(max_length=150, blank=True, null=True)
    title = models.CharField(max_length=350)
    likelihood = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.title}"
