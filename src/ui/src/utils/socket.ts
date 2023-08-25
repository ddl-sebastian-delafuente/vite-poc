import io from 'socket.io-client';
import * as R from 'ramda';

export type Channel = {
  room: string;
  eventName: string;
  handler: (e: any) => void;
  disabled?: boolean;
};

export const SOCKET_PATH = '/pusher-service';
const MAX_RETRY_ATTEMPTS = 10;

export const getSocket = () =>
  io(`${window.location.origin}`, {
    path: SOCKET_PATH,
    reconnectionAttempts: MAX_RETRY_ATTEMPTS,
    rememberUpgrade: true,
  });

export const getOrCreateSocket = (
  globalSocket?: SocketIOClient.Socket,
  onSocketCreate?: (socket: SocketIOClient.Socket) => void,
): SocketIOClient.Socket => {
  if (R.isNil(globalSocket)) {
    const socket = getSocket();
    if (!R.isNil(onSocketCreate)) {
      onSocketCreate(socket);
    }
    return socket;
  } else {
    return globalSocket;
  }
};

const subscribeToChannel = (socket: SocketIOClient.Socket, channel: Channel) => {
  if (!channel.disabled) {
    socket.on(channel.eventName, channel.handler);
  }
};

export const subscribeTo = (
  channel: Channel,
  onSocketCreate: (socket: SocketIOClient.Socket) => void,
  onError: (err: any) => void,
  globalSocket?: SocketIOClient.Socket,
  onDisconnect?: (reason: string) => void
) => {
  const socket = getOrCreateSocket(globalSocket, onSocketCreate);
  // Do some setup if socket was just created

  if (R.isNil(globalSocket)) {
    socket.on('connect_error', (err: any) => onError(err));
    socket.on('connect', () => {
      socket.emit('join', channel.room);
    });
  } else {
    socket.emit('join', channel.room);
  }
  socket.on('error', (err: any) => onError(err));
  socket.on('disconnect', (reason: string) => {
    if (!R.isNil(onDisconnect)) {
      onDisconnect(reason);
    }
  });
  subscribeToChannel(socket, channel);
};

export const leaveSocketChannel = (socket: SocketIOClient.Socket, channel: Channel) => {
  socket.emit('leave', channel && channel.room);
};

export const closeSocketConnection = (socket?: SocketIOClient.Socket) => {
  if (!R.isNil(socket)) {
    socket.close();
  }
};
