const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const formatMessage = require('./messages');

const { addUser, removeUser, getUser, getUsersInRoom } = require ("./users.js");

const PORT = process.env.PORT || 3001;

//Utilizziamo il file nella cartella routes
const  router = require("./routes/index");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//Connessione al server
io.on('connection', (socket) => {
    //Nickname e room utilizzate per la chat
    socket.on('join', ({nickName, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, nickName, room });

        if(error) return callback(error);

        //Messaggio che appare all'utente appena entrato
        socket.emit('message', formatMessage( 'Admin' ,`${user.nickName} benvenuto/a nella stanza ${user.room}!`));
        //Alle persone nella stanza appare un messaggio che permettere di sapere chi è entrato in quel momento
        socket.broadcast.to(user.room).emit('message', formatMessage( 'Admin', `${user.nickName} è entrato/a nella stanza!`));

        socket.join(user.room);

        //Aggiunge l'utente quando entra nella chat
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback();
    });


    //Quando mandi un messaggio
    socket.on('sendMessage', ( message, callback ) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', formatMessage( user.nickName, message ));

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });


    //Disconnessione dal server
    socket.on('disconnect', () => {
       const user = removeUser(socket.id);

       if(user){
           io.to(user.room).emit('message', formatMessage( 'Admin', `${user.nickName} si è disconnesso.`));

           //Elimina gli utenti disconnessi dalla chat
           io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
       }
    })
});



app.use(router);

server.listen(PORT, () => console.log(`Server in esecuzione nella porta ${PORT}`));


