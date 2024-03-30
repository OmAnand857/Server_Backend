import { Server } from "socket.io";
import cors from "cors";
const io = new Server(5000,{ 
    cors:{
        origin:true,
    }
});


const EmailToSocketIdMap = new Map() ;
const SocketIdToEmailMap = new Map() ;

io.on("connection", (socket) => {
    console.log('User Got connected',socket.id);

    socket.on('roomJoin' , ({email , room} )=>{
           EmailToSocketIdMap.set( email,socket.id );
           SocketIdToEmailMap.set( socket.id,email );
            socket.join(room);
            io.to(room).emit("userJoined",{email,id:socket.id});
           io.to(socket.id).emit('roomJoin',{email, room});
    });


    socket.on('userCall', ({to,offer})=>{
        io.to(to).emit('incomingCall',{from: socket.id,offer});
    })

    socket.on('callAccepted',({to,ans})=>{
            io.to(to).emit('callAccepted',{from:socket.id,ans});
    })

    socket.on('peer:nego:needed',({to,offer})=>{
        io.to(to).emit('peer:nego:needed',{from: socket.id, offer});
    });

    socket.on('peer:nego:done',({to,ans})=>{
        io.to(to).emit('peer:nego:final',{from:socket.id,offer});
    });

});

