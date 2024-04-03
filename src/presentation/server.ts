import express, { Router } from 'express';
import http from 'http';
import { Server as IoServer, Socket } from 'socket.io';
import path from 'path';
import cors from 'cors';
import { SocketServer } from '@/presentation/socketServer';

interface Options {
	port: number;
	public_path?: string;
	routes: Router;
}

export class Server {
	public readonly app = express();
	private readonly httpServer = http.createServer(this.app);
	private readonly io = new IoServer(this.httpServer, {});

	private readonly port: number;
	private readonly publicPath: string;
	private readonly routes: Router;

	constructor(options: Options) {
		const { port, public_path = 'public', routes } = options;

		this.port = port;
		this.publicPath = public_path;
		this.routes = routes;
	}

	initSocketServer() {
		new SocketServer(this.io);
	}

	async start() {
		//*Middlewares
		this.app.use(express.json()); //raw
		this.app.use(express.urlencoded({ extended: true })); //x-www-form-urlencoded
		this.app.use(cors());

		//*Public Folder
		this.app.use(express.static(this.publicPath));

		//*Routes
		this.app.use(this.routes);

		this.app.get('*', (req, res) => {
			const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
			res.sendFile(indexPath);
		});

		//*Socket server
		this.initSocketServer();

		this.httpServer.listen(this.port, () => {
			console.log(`server running on port ${this.port}`);
		});
	}
}
