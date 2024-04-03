import { Server, Socket } from 'socket.io';

export class SocketServer {
	constructor(public readonly io: Server) {
		this.socketsEvents();
	}

	socketsEvents() {
		this.io.on('connection', (socket: Socket) => {
			console.log(socket.id);
		});
	}
}
