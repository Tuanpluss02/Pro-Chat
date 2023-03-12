# Pro Chat

Pro Chat is a real-time messaging web application that allows users to chat with each other instantly. It is built using Node.js, Express, Socket.io, and React.
Check our langding page [https://team.stormx.software](https://team.stormx.software)
## Features

- Real-time messaging
- Multiple rooms support
- User authentication and registration
- User profiles with avatars
- Notification sounds
- Online status indicators

## Getting Started

To run Pro Chat locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Tuanpluss02/Pro-Chat.git`
2. Install dependencies: `npm install`
3. Create a `.env` file and set the following environment variables:
   - `MONGODB_URI`: the URI for your MongoDB database
   - `JWT_SECRET`: a secret key for JSON Web Tokens
   - `JWT_EXPIRATION`: the duration for which a JSON Web Token is valid (e.g. `1d` for one day)
   - `PORT`: the port number on which the server will run (default is 5000)
4. Start the server: `npm run start-server`
5. In a separate terminal, start the client: `npm run start-client`
6. Open `http://localhost:3000` in your browser to use the app

## Contributing

Contributions are always welcome! Please read the contributing guidelines before getting started.

## License

This project is licensed under the MIT License.

```
Pro-Chat
├─ .vscode
│  └─ settings.json
├─ Back-End
│  ├─ README.md
│  ├─ __init__.py
│  ├─ __pycache__
│  │  ├─ config.cpython-310.pyc
│  │  ├─ main.cpython-310.pyc
│  │  ├─ models.cpython-310.pyc
│  │  ├─ mongodb.cpython-310.pyc
│  │  ├─ notifier.cpython-310.pyc
│  │  ├─ request_models.cpython-310.pyc
│  │  └─ utils.cpython-310.pyc
│  ├─ api
│  │  ├─ __init__.py
│  │  ├─ __pycache__
│  │  │  ├─ __init__.cpython-310.pyc
│  │  │  ├─ auth.cpython-310.pyc
│  │  │  ├─ rooms.cpython-310.pyc
│  │  │  ├─ twilio.cpython-310.pyc
│  │  │  └─ users.cpython-310.pyc
│  │  ├─ auth.py
│  │  ├─ rooms.py
│  │  ├─ twilio.py
│  │  └─ users.py
│  ├─ config.py
│  ├─ controllers
│  │  ├─ __init__.py
│  │  ├─ __pycache__
│  │  │  ├─ __init__.cpython-310.pyc
│  │  │  ├─ rooms.cpython-310.pyc
│  │  │  ├─ s3.cpython-310.pyc
│  │  │  └─ users.cpython-310.pyc
│  │  ├─ fire_storage.py
│  │  ├─ rooms.py
│  │  ├─ s3.py
│  │  └─ users.py
│  ├─ environment.yml
│  ├─ main.py
│  ├─ models.py
│  ├─ mongodb.py
│  ├─ notifier.py
│  ├─ request_models.py
│  ├─ requirements.txt
│  ├─ run
│  └─ utils.py
├─ Front-End
│  ├─ .d.ts
│  ├─ .eslintcache
│  ├─ README.md
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  └─ src
│     ├─ App.css
│     ├─ App.js
│     ├─ App.test.js
│     ├─ api
│     │  ├─ auth.js
│     │  └─ rooms.js
│     ├─ components
│     │  ├─ ChatModule.js
│     │  ├─ NavBar.js
│     │  ├─ Participant.js
│     │  ├─ ProtectedRoute.js
│     │  ├─ Track.js
│     │  └─ VideoChatModule.js
│     ├─ config.json
│     ├─ index.css
│     ├─ index.js
│     ├─ logo.svg
│     ├─ pages
│     │  ├─ Dashboard.js
│     │  ├─ Favorites.js
│     │  ├─ Home.js
│     │  ├─ Login.js
│     │  ├─ Profile.js
│     │  └─ VideoChatPage.js
│     ├─ reportWebVitals.js
│     └─ setupTests.js
├─ LICENSE
└─ README.md

```