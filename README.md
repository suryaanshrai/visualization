# Visualization Dashboard

## Index
#### 1. [How to run](#how-to-run)
- [Environment Setup](#environment-setup)
- [Running the project](#running-the-project)
#### 2. [About filters](#about-filters)
#### 3. [Playing with the database](#playing-with-the-database)
#### 4. [Admin interface credentials](#admin-interface-credentials)

## How to run

#### Environment Setup

    Note:  Please use a terminal which takes the common bash commands. Windows powershell, Ubuntu's bash or Apple's Z shell should work fine.
- Download or clone the current repository and open it in the terminal.
- Create a python virtual environment by running `python -m venv venv` and activate this environment by running `venv/Scripts/activate` on windows or `source venv/bin/activate` on Linux.
- Run `pip install -r requirements.txt`.

#### Running the project
- Open the `visualizer` folder, which contains the `manage.py` file  and execute `python manage.py runserver`.
- Open the browser and go to `127.0.0.1:8000` to see the project in action.

## About filters

    TL;DR 
    Selecting filters of different types would give an intersection of that data, selecting filters of the same type would give a union.

The filters are such that if you select multiple filters of the same type (say multiple countries, like United States of America, India and Indonesia), then the represented data would be based on the combined data of all these countries.

Now lets say one selects a filter of different type like the sectors of Government and Environment, then the represented data would be _the data of Government and Environment sectors of United States of America, India and Indonesia_.

## Playing with the database

### Loading new data or reloading the same data

Althought the database is already loaded with necessary data, but if for some reason it does not works or if you just want to load different data of the same format, please do the following:

1. Execute `python manage.py flush`. This will clear the current database.
2. Create new superuser by running `python manage.py createsuperuser` and filling the required credentials
3. Start the server and go to the admin interface at `127.0.0.1:8000/admin` and login using the credentials.
4. Now go to `127.0.0.1:8000/uploadnewdata` and upload the data in the same format as given in the assignment, i.e., the file should be a json file with a list of json objects of following keys: ['end_year', 'intensity', 'sector', 'topic', 'insight', 'url', 'region', 'start_year, 'impact', 'added', 'published', 'country', 'relevance', 'pestle', 'source', 'title', 'likelihood']
5. The data would take a few seconds to completely load onto the server, **however, that would not stop the server as the writing process has been initiated as a separate thread**.

### Creating a new database

If you want to create a new database after deleting this, please go through the following steps.

1. Delete the `db.sqlite3` file.
2. Execute `python manage.py makemigrations`
3. Execute `python manage.py migrate`
4. Follow on from step 2 of the [previous section](#loading-new-data-or-reloading-the-same-data)
    
## Admin interface credentials
Here are the login credentials for the admin interface of the default databse

    SUPERUSER LOGIN
        Username: `master`
        Password: `password`