# Chat Room App
This being a FastAPI app, you will also be able to get quick documenatation on the routes and request types after getting it up and running.

This app uses:

- Anaconda (for Python environemnt management)
- Python FastAPI+WebSockets [docs](https://fastapi.tiangolo.com/)
- Pymongo [docs](https://pymongo.readthedocs.io/en/stable/)
- MongoDB [docs](https://docs.mongodb.com/manual/)
- AWS S3 (image handling)
- Twilio (video chat)

## Setting up and running

I've set it up so that you only need to use the `run` script to start.
Be sure to set the S3 environement variables for access

```bash
conda env create -f environment.yml
conda activate chat_app
export AWS_SECRET_ACCESS_KEY=...
export AWS_ACCESS_KEY_ID=...
cp config.template.py config.py # edit config.py and fill with your values/credentials
./run
```

_For quick API documentation, navigate to `localhost:8000/docs` after starting the server_

## Dependencies 

This app uses a couple of 3rd party resources for all of it's functionality.

- AWS S3 is used for storing the user's profile images and fetching them.
- Twilio is used for the group video chat capability.
- MongoDB is used to persist all data to the database.
