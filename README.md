# Pro Chat

Pro Chat is a real-time messaging web application that allows users to chat with each other instantly. It is built using Node.js, Express, Socket.io, and React.

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
