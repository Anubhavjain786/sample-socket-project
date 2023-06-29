import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvents } from './constants';

@WebSocketGateway(undefined, {
  serveClient: false,
  transports: ['websocket, polling'],
  cors: true,
})
@Injectable()
export class SampleGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  /* The line `public logger: Logger = new Logger(SampleGateway.name, { timestamp: true });` is
  creating a new instance of the `Logger` class and assigning it to the `logger` property of the
  `SampleGateway` class. */
  public logger: Logger = new Logger(SampleGateway.name, { timestamp: true });

  /* The `@WebSocketServer()` decorator is used to declare a property `server` of type `Server` in the
  `SampleGateway` class. This property represents the WebSocket server instance that is created when
  the WebSocketGateway is initialized. It allows you to access and interact with the WebSocket
  server, such as emitting events or sending messages to connected clients. */
  @WebSocketServer()
  public server: Server;

  /**
   * The "afterInit" function logs a message indicating that the socket has been initialized.
   * @param {Server} server - The "server" parameter is an instance of the Server class. It represents
   * the server that the socket is being initialized on.
   */
  afterInit(server: Server) {
    this.logger.log('Socket initialized');
  }

  /**
   * The function handles a socket connection by joining the socket to a specific room and logging the
   * connection.
   * @param {Socket} socket - The `socket` parameter is an instance of the `Socket` class. It
   * represents the connection between the server and the client. It allows bidirectional communication
   * between the server and the client.
   * @param {any[]} args - The `args` parameter is a rest parameter that allows you to pass in an
   * arbitrary number of arguments to the `handleConnection` function. These arguments can be of any
   * type.
   */
  async handleConnection(socket: Socket, ...args: any[]) {
    socket.join(`SampleSocketRoom:1`);
    this.logger.log(`USER With Socket ID:${socket.id} - connected`);
  }

  /**
   * The function handles the disconnection of a client by removing them from all rooms they are
   * currently in and logging a message.
   * @param {Socket} client - The parameter `client` is of type `Socket`, which represents a client
   * connection in a socket.io server.
   */
  handleDisconnect(client: Socket) {
    const getAllRooms = Object.keys(client.rooms);
    for (const room of getAllRooms) {
      client.leave(room);
    }

    console.log('HH client disconnected =>>');
  }

  /* The `@SubscribeMessage(SocketEvents.SEND)` decorator is used to indicate that the `handle` method
  should be called when a client sends a message with the event name `SocketEvents.SEND`. */
  @SubscribeMessage(SocketEvents.SEND)
  async handle(client: Socket, inputs: Record<string, any>): Promise<void> {
    this.logger.log(`Inputs: ${JSON.stringify(inputs)}`);
    client.to(`SampleSocketRoom:1`).emit(SocketEvents.RECEIVE, inputs);
  }
}
