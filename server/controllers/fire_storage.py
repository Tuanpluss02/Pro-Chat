# import pyrebase

# firebaseConfig = {
#   "apiKey": "AIzaSyD9jUNTEgdU870TvHmnxFAG1ON7Wm8cio8",
#   "authDomain": "pro-chat-d5c75.firebaseapp.com",
#   "projectId": "pro-chat-d5c75",
#   "storageBucket": "pro-chat-d5c75.appspot.com",
#   "messagingSenderId": "514489518503",
#   "appId": "1:514489518503:web:fcfe3b1ec382c126814e82"
# }

# firebase = pyrebase.initialize_app(firebaseConfig)
# storage = firebase.storage()

# path_on_cloud = "<folder>/<file>"
# path_local = "<file>"

# # Upload
# storage.child(path_on_cloud).put(path_local)

# # Download
# # storage.child(path_on_cloud).download("<file_downloaded>")