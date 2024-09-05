from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.timezone import make_aware
from django.urls import reverse
from .models import Article
from datetime import datetime
from threading import Thread

import pandas as pd

def index(request):
    """
        Homepage of the site
    """
    articles = Article.objects.all()
    sectors = set()
    for article in articles:
        if article.sector is not None:
            sectors.add(article.sector)
    sectors = sorted(sectors)
    countries = set()
    for article in articles:
        if article.country is not None:
            countries.add(article.country)
    countries = sorted(countries)
    regions = set()
    for article in articles:
        if article.region is not None:
            regions.add(article.region)
    regions=sorted(regions)
    return render(request, "visualization/index.html", {
        "sectors":sectors,
        "countries":countries,
        "regions":regions,
    })

def writeData(data):
    """
        Writes each row of the dataframe in to the database
    """
    for i in range(len(data)):
                entry = data.iloc[i]
                writeEntry(entry)

def writeEntry(entry):
    """
        Writes one entry into the database
    """
    obj = Article(insight=entry.insight, url=entry.url, title=entry.title,\
                   added=make_aware(datetime.strptime(entry.added, "%B, %d %Y %H:%M:%S")))
    if entry.end_year != '':
        obj.end_year = int(entry.end_year)
    if entry.intensity != '':
        obj.intensity = int(entry.intensity)
    if entry.start_year != '':
        obj.start_year = int(entry.start_year)
    if entry.impact != '':
        obj.impact = int(entry.impact)
    if entry.published != '':
        obj.published = make_aware(datetime.strptime(entry.published, "%B, %d %Y %H:%M:%S"))
    if entry.relevance != '':
        obj.relevance = int(entry.relevance)
    if entry.source != '':
        obj.source = entry.source
    if entry.likelihood != '':
        obj.likelihood = int(entry.likelihood)
    if entry.topic != '':
        obj.topic = entry.topic
    if entry.region != '':
        obj.region = entry.region
    if entry.sector != '':
        obj.sector = entry.sector
    if entry.country != '':
        obj.country = entry.country
    if entry.pestle != '':
        obj.pestle = entry.pestle
    obj.save()

def uploadnewdata(request):
    if not request.user.is_authenticated:
        return HttpResponse('Please login from the admin interface')
    if request.user.is_superuser:
        if request.method == "POST":
            # Checking if the file is json or not
            file = request.FILES["newfile"]
            if not file.content_type.startswith("application/json"):
                return render(request, "visualization/inputData.html", {
                    "message":"Invalid file type"
                })
            # We can write more checks like checking the columns, checking if any not
            # null field is empty, etc. But for the scope of this assignment, I am
            # skipping the checks for now

            # Writing the data in the database in background by running a thread
            data = pd.read_json(file)
            t1 = Thread(target=writeData, args=(data,))
            t1.start()
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "visualization/inputData.html")
    else:
        return HttpResponse('Invalid User: Login as an admin to make this request')


def getEntireData(request):
    data = list(Article.objects.values())
    return JsonResponse(data, safe=False)

def new_data(new_data_list):
    new_data = new_data_list[0]
    for i in new_data_list:
        new_data = new_data | i
    return new_data

def filter(request):
    try:
        end_year_first = request.GET["end_year_first"]
    except MultiValueDictKeyError:
        end_year_first = ''

    try:
        end_year_last = request.GET["end_year_last"]
    except MultiValueDictKeyError:
        end_year_last = ''
    
    try:
        topics = list(request.GET["topics"].split(','))
    except MultiValueDictKeyError:
        topics = ''
    
    try:
        sector = list(request.GET["sector"].split(','))
    except MultiValueDictKeyError:
        sector = ''

    try:
        region = list(request.GET["region"].split(','))
    except MultiValueDictKeyError:
        region = ''

    try:
        country = list(request.GET["country"].split(','))
    except MultiValueDictKeyError:
        country = list()
    
    try:
        source = list(request.GET["source"].split(','))
    except MultiValueDictKeyError:
        source = ''
    
    topics = [x for x in topics if x != '']
    country = [x for x in country if x != '']
    source = [x for x in source if x != '']
    sector = [x for x in sector if x != '']
    region = [x for x in region if x != '']

    print(topics, country, sector, region, source)
    data = Article.objects.all()
    if end_year_first != '':
        data=data.filter(end_year__gte=int(end_year_first))
    if end_year_last != '':
        data=data.filter(end_year__lte=int(end_year_last))
    if len(topics) != 0:
        new_data_list = list()
        for i in topics:
            new_data_list.append(data.filter(topic=i))
        data = new_data(new_data_list)
    if len(sector) != 0:
        new_data_list = list()
        for i in sector:
            new_data_list.append(data.filter(sector=i))
        data = new_data(new_data_list)
    if len(region) != 0:
        new_data_list = list()
        for i in region:
            new_data_list.append(data.filter(region=i))
        data = new_data(new_data_list)
    if len(country) != 0:
        new_data_list = list()
        for i in country:
            new_data_list.append(data.filter(country=i))
        data = new_data(new_data_list)
    if len(source) != 0:
        new_data_list = list()
        for i in source:
            new_data_list.append(data.filter(source__startswith=i))
        data = new_data(new_data_list)

    return JsonResponse(list(data.values()), safe=False)

def getSourceName(request):
    sourceName = request.GET["source"]
    data = Article.objects.all().filter(source__startswith=sourceName)
    return JsonResponse(list(data.values()), safe=False)
