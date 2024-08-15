import { createServer } from 'http'; 
import Koa from 'koa';
import Router from 'koa-router';
import { PassThrough } from 'stream';
import amqp from 'amqplib';
import bodyParser from 'koa-bodyparser';
import { getEnvironment } from '@leclub/shared';

const debug = require('debug')('leclub:push');

export interface ApplicationProps {
  env: 'development' | 'production';
}

export async function createApplication({ env }: ApplicationProps) {
  
  const koaServer = new Koa({ env });
  koaServer.use(bodyParser());
  const httpServer = createServer(koaServer.callback());
  const router = new Router();
  
  const connection = await amqp.connect(getEnvironment('LCB_NOTIFICATION_MQ_URL'));
  const channel = await connection.createChannel();
  
  var queue = 'hello';
  
  channel.assertQueue(queue, {
    durable: false
  });
  
  router.get('/subscribe', async (ctx, next) => {
    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    
    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });
    
    const stream = new PassThrough();
    
    ctx.status = 200;
    ctx.body = stream;
    
    channel.consume(queue, function(msg) {
      console.log('received')
      stream.write(msg?.content.toString());
    }, { noAck: true });
  });

  router.post('/account/verify', async (ctx, next) => {
    
  });

  router.post('/tournament/request', async (ctx, next) => {
    channel.sendToQueue(queue, Buffer.from(ctx.request.body.name));
    ctx.status = 200;
    ctx.body = 'successfully requested';
  });
  
  koaServer.use(router.routes());
  
  return (port: number, hostname?: string) => {
    return new Promise<void>(resolve => httpServer.listen({ port, hostname }, resolve));
  }
}