// export async function connectSocket(
//   serverUrl: string,
//   onmessage: ((this: WebSocket, ev: MessageEvent<any>) => any) | null
// ): WebSocket {
//   const ws = new WebSocket(serverUrl);
//   ws.onmessage = onmessage;

//   return ws;
// }

export async function sendPacket(
  ws: WebSocket,
  { category, type, data }: { category: string; type: string; data?: any }
) {
  await ws.send(
    JSON.stringify({
      category: category,
      type: type,
      data: data !== undefined ? data : {},
    })
  );
}
