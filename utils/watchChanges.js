const { MongoClient } = require('mongodb');
const WebSocket = require('ws');

async function monitorChanges() {
  const uri = 'mongodb+srv://managestaff:kW9Z8wPUrgrc6C3o@cluster0.zxkpyow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  const port = 8080;
  const wss = new WebSocket.Server({ port: port });

  const userTenantMap = new Map(); // クライアントのテナントIDを管理するマップ

  try {
    await client.connect();
    const database = client.db('test');
    const collection = database.collection('chats');
    const changeStream = collection.watch();

    console.log('Change Stream is set up.');

    changeStream.on('change', (change) => {
      try {
        console.log('Change detected:', change);

        // fullDocument が存在するかどうかを確認
        const fullDocument = change.fullDocument;
        if (!fullDocument) {
          console.warn('No fullDocument in change:', change);
          return;
        }

        const tenantId = fullDocument.tenantId;
        if (!tenantId) {
          console.warn('No tenantId in fullDocument:', fullDocument);
          return;
        }

        // メッセージがテナントIDに基づいてフィルタリングされる
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const clientTenantId = userTenantMap.get(client);

            if (clientTenantId === tenantId) {
              client.send(JSON.stringify({
                createdAt: fullDocument.createdAt,
                name: fullDocument.name,
                // tenantIdを含まないデータ
              }));
            }
          }
        });
      } catch (error) {
        console.error('Error processing change event:', error);
      }
    });

    changeStream.on('error', (error) => {
      console.error('Change Stream error:', error);
    });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        try {
          const { tenantId } = JSON.parse(message);
          if (tenantId) {
            userTenantMap.set(ws, tenantId);
          } else {
            console.warn('Received message with no tenantId:', message);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        userTenantMap.delete(ws);
      });
    });

  } catch (err) {
    console.error('Error setting up Change Stream:', err);
  }
}

monitorChanges();