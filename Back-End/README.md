Change directory to Back-End
`cd Back-End`
Create a virtual environment
`python -m venv venv`
Activate virtual environment
+ Windows: `venv/Script/activate`
+ Linux `source venv/Script/activate`
Install dependencies
`pip install -r requirements.txt`
Run BE
`uvicorn main:app --reload`