checkConnection();

var filterForm = document.querySelector("#filterForm");
filterForm.onsubmit = submitForm;
document.querySelector("#sourceIn").onkeyup = searchAutoComplete;
document.querySelector("#clearForm").onclick = clearForm;

document.querySelector('#sourceIn').addEventListener('focus', ()=>{
    document.querySelector('#searchResults').style.display="block";
});

document.querySelector("#showForm").addEventListener('click', ()=>{
    document.querySelector("#showForm").style.display="none";
    filterForm.classList.remove("hide");
    filterForm.classList.add("display");
    document.querySelector("#closeForm").style.display="block";
});

document.querySelector("#closeForm").addEventListener('click', ()=>{
    document.querySelector("#closeForm").style.display="none";
    filterForm.classList.add("hide");
    filterForm.classList.remove("display");
    document.querySelector("#showForm").style.display="inline-block";
});

document.querySelector('#sourceIn').addEventListener('focusout', ()=>{
    document.querySelector('#searchResults').style.display="none";
});
google.charts.load('current', {'packages':['corechart', 'geochart']});
google.charts.setOnLoadCallback(()=> {
    fetch("http://127.0.0.1:8000/getEntireData")
    .then(response=>response.json())
    .then(data=> {
        drawCharts(data);
    });
});

function clearForm() {
    document.querySelector("#filterForm").reset();
    submitForm();
}

function drawCharts(data) {
    drawSectors(data);
    drawTopics(data);
    drawCountry(data);
    drawStartYear(data);
    drawEndYear(data);
    drawPestle(data);
    drawRegion(data);
    drawRelevance(data);
    drawLikelihood(data);
    drawIntensity(data);
}

function checkConnection() {
    if (!window.navigator.onLine) {
        alert('Please connect to the internet to load the graphs');
        location.reload();
    }
}

function submitForm() {
    let sectorList = document.querySelectorAll('.sectorList');
    let sectors = "";
    for (let i = 0; i < sectorList.length; i++) {
        if (sectorList[i].checked) sectors += sectorList[i].value;
    }
    filterForm.sector.value = sectors;

    let countryList = document.querySelectorAll('.countryList');
    let countrys = "";
    for (let i = 0; i < countryList.length; i++) {
        if (countryList[i].checked) countrys += countryList[i].value;
    }
    filterForm.country.value = countrys;

    let regionList = document.querySelectorAll('.regionList');
    let regions = "";
    for (let i = 0; i < regionList.length; i++) {
        if (regionList[i].checked) regions += regionList[i].value;
    }
    filterForm.region.value = regions;

    let formData = new FormData(filterForm);
    let filters = new URLSearchParams(formData).toString();    
    fetch(`http://127.0.0.1:8000/filter?${filters}`)
    .then(response=>response.json())
    .then(data=>drawCharts(data));
    document.querySelector("#closeForm").dispatchEvent(new Event('click'));
    return false;
}

function searchAutoComplete() {
    let query = document.querySelector("#sourceIn").value;
    if (query != "") {
        let searchbox = document.querySelector("#searchResults");
        searchbox.innerHTML = "";
        fetch(`http://127.0.0.1:8000/getSourceName?source=${query}`)
        .then(request => request.json())
        .then(data => {
            if (data.length != 0){
                let resList={};
                data.forEach(element=> resList[element.source]=1);
                for(const key in resList) {
                        let option=document.createElement("p");
                        option.innerHTML = `${key}`;
                        searchbox.append(option);
                };
            }
            else {
                let searchbox = document.querySelector("#searchResults");
                searchbox.innerHTML = "No Results :(";
            }
        });
    }
    else {
        document.querySelector("#searchResults").innerHTML = "";
    }
}

function drawSectors(data) {
    // Taking count of the sectors including null
    var sectorCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].sector in sectorCount) {
            sectorCount[data[i].sector]++;
        } else {
            sectorCount[data[i].sector]=1;
        }
    }

    delete sectorCount[null];
    
    // Drawing pie chart for the sectors
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'Sector');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(sectorCount)) {
        tableData.addRow([key, value]);
    }
    var options = {title: 'Sectors', pieHole:0.5};
    
    // Drawing bar chart for the sectors
    var sector = new google.visualization.PieChart(document.getElementById('sectorGraph'));
    sector.draw(tableData, options);
}

function drawTopics(data) {
    var topicCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].topic in topicCount) {
            topicCount[data[i].topic]++;
        } else {
            topicCount[data[i].topic]=1;
        }
    }

    delete topicCount[null];
    // Drawing pie chart for the topics
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'Topic');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(topicCount)) {
        tableData.addRow([key, value]);
    }
    var options = {title: 'Topics'};
    var topic = new google.visualization.BarChart(document.getElementById('topicGraph'));
    topic.draw(tableData, options);
}

function drawCountry(data) {
    var countryCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].country in countryCount) {
            countryCount[data[i].country]++;
        } else {
            countryCount[data[i].country]=1;
        }
    }
    delete countryCount[null];
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'Country');
    tableData.addColumn('number', 'Count');
    // Name of countries have been converted to ISO 3166-1 alpha 2 standard codes
    // in order to represent the data using the free tier of Google Charts
    let countryCode = {
        'United States of America':'US', 'Mexico':'MX', 'Nigeria':'NG', 'Lebanon':'LB',
        'Russia':'RU', 'Saudi Arabia':'SA', 'Angola':'AO', 'Egypt':'EG', 'South Africa':'ZA',
        'India':'IN', 'Ukraine':'UA', 'Azerbaijan':'AZ', 'China':'CN', 'Colombia':'CO', 'Niger':'NE',
        'Libya':'LY', 'Brazil':'BR', 'Mali':'ML', 'Indonesia':'ID', 'Iraq':'IQ', 'Iran':'IR',
        'South Sudan':'SS', 'Venezuela':'VE', 'Burkina Faso':'BF', 'Germany':'DE',
        'United Kingdom':'GB', 'Kuwait':'KW', 'Canada':'CA', 'Argentina':'AR', 'Japan':'JP',
        'Austria':'AT', 'Spain':'ES', 'Estonia':'EE', 'Hungary':'HU', 'Australia':'AU', 'Morocco':'MA',
        'Greece':'GR', 'Qatar':'QA', 'Oman':'OM', 'Liberia':'LR', 'Denmark':'DK', 'Malaysia':'MY',
        'Jordan':'JO', 'Syria':'SY', 'Ethiopia':'ET', 'Norway':'NO', 'Ghana':'GH', 'Kazakhstan':'KZ',
        'Pakistan':'PK', 'Gabon':'GA', 'United Arab Emirates':'AE', 'Algeria':'DZ', 'Turkey':'TR',
        'Cyprus':'CY', 'Belize':'BZ', 'Poland':'PL'
    }
    let keyList = [];
    for (let [key, value] of Object.entries(countryCount)) keyList.push(key);
    for (let i = 0; i < keyList.length; i++) {
        countryCount[countryCode[keyList[i]]] = countryCount[keyList[i]];
        delete countryCount[keyList[i]];
    };

    // Conversion of data to tableData
    for (let [key, value] of Object.entries(countryCount)) {
            tableData.addRow([key, value]);
    }
    var options = {title:'Countries'};
    var country = new google.visualization.GeoChart(document.getElementById('countryGraph'));
    country.draw(tableData, options);
}

function drawStartYear(data) {
    var yearCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].start_year == null) continue;
        let year = parseInt(data[i].start_year);
        if (year in yearCount) {
            yearCount[year]++;
        } else {
            yearCount[year]=1;
        }
    }
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('number', 'Year');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(yearCount)) {
        tableData.addRow([parseInt(key), value]);
    }
    var options = {title: 'Start Year', legend: { position: 'bottom' }};
    var yearLine = new google.visualization.LineChart(document.getElementById('startYearGraph'));
    yearLine.draw(tableData, options);   
}

function drawEndYear(data) {
    var yearCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].end_year == null) continue;
        let year = parseInt(data[i].end_year);
        if (year in yearCount) {
            yearCount[year]++;
        } else {
            yearCount[year]=1;
        }
    }
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('number', 'Year');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(yearCount)) {
        tableData.addRow([parseInt(key), value]);
    }
    var options = {title: 'End Year', legend: { position: 'bottom' }};
    var yearLine = new google.visualization.LineChart(document.getElementById('endYearGraph'));
    yearLine.draw(tableData, options);   
}

function drawPestle(data) {
    var pestleCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].pestle in pestleCount) {
            pestleCount[data[i].pestle]++;
        } else {
            pestleCount[data[i].pestle]=1;
        }
    }
    delete pestleCount[null];
    // Drawing pie chart for the pestles
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'pestle');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(pestleCount)) {
        tableData.addRow([key, value]);
    }
    var options = {title: 'Pestles'};
    var pestlePie = new google.visualization.PieChart(document.getElementById('pestleGraph'));
    pestlePie.draw(tableData, options);
}

function drawRegion(data) {
    var regionCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].region in regionCount) {
            regionCount[data[i].region]++;
        } else {
            regionCount[data[i].region]=1;
        }
    }
    delete regionCount[null];
    // Drawing pie chart for the regions
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'region');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(regionCount)) {
        tableData.addRow([key, value]);
    }
    var options = {title: 'Regions'};
    
    // Drawing bar chart for the regions
    var sectorBar = new google.visualization.ColumnChart(document.getElementById('regionGraph'));
    sectorBar.draw(tableData, options);
}

function drawRelevance(data) {
    var relevanceCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].relevance in relevanceCount) {
            relevanceCount[data[i].relevance]++;
        } else {
            relevanceCount[data[i].relevance]=1;
        }
    }
    delete relevanceCount[null];
    // Drawing pie chart for the relevances
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'relevance');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(relevanceCount)) {
        tableData.addRow([key, value]);
    }
    var options = {title: 'Relevance'};
    
    // Drawing bar chart for the relevances
    var relevance = new google.visualization.ColumnChart(document.getElementById('relevanceGraph'));
    relevance.draw(tableData, options);
}

function drawLikelihood(data) {
    var likelihoodCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].likelihood in likelihoodCount) {
            likelihoodCount[data[i].likelihood]++;
        } else {
            likelihoodCount[data[i].likelihood]=1;
        }
    }
    delete likelihoodCount[null];
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('number', 'likelihood');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(likelihoodCount)) {
        tableData.addRow([parseInt(key), value]);
    }
    var options = {title: 'Likelihood'};
    
    var likelihood = new google.visualization.ColumnChart(document.getElementById('likelihoodGraph'));
    likelihood.draw(tableData, options);
}

function drawIntensity(data) {
    var intensityCount={};
    for (let i = 0; i < data.length; i++) {
        if (data[i].intensity in intensityCount) {
            intensityCount[data[i].intensity]++;
        } else {
            intensityCount[data[i].intensity]=1;
        }
    }
    delete intensityCount[null];
    let tableData = new google.visualization.DataTable();
    tableData.addColumn('number', 'intensity');
    tableData.addColumn('number', 'count');
    for (let [key, value] of Object.entries(intensityCount)) {
        tableData.addRow([parseInt(key), value]);
    }
    var options = {title: 'intensity'};
    
    var intensity = new google.visualization.LineChart(document.getElementById('intensityGraph'));
    intensity.draw(tableData, options);
}