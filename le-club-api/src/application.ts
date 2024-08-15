import { Logger } from 'winston';
import { connect } from './database';
import { getAWSConfig } from './aws.config';
import * as AWS from 'aws-sdk';
import Koa from 'koa';
import { createServer } from 'http'; 
import { ApolloServer } from 'apollo-server-koa';
import { GraphQLUpload, graphqlUploadKoa } from 'graphql-upload';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { videoSchema } from './video/video.schema';
import { locationSchema } from './location/location.schema';
import { dateSchema } from './date/date.schema';
import { tournamentSchema } from './tournament/tournament.schema';
import GraphQLDate from './date/date.resolver';
import uploadVideoResolver from './video/upload-video.resolver';
import { getVideoConfig } from './video/video.config';
import findVideoResolver from './video/find-video.resolver';
import findTournamentResolver from './tournament/find-tournament.resolver';
import createTournamentResolver from './tournament/create-tournament.resolver';

export interface ApplicationProps {
  env: 'development' | 'production';
  logger: Logger;
}

export function createApplication({ env, logger }: ApplicationProps) {

  const koaServer = new Koa();
  const httpServer = createServer(koaServer.callback());
  const apolloServer = new ApolloServer({
    typeDefs: [videoSchema, locationSchema, dateSchema, tournamentSchema],
    resolvers: {
      Date: GraphQLDate,
      Upload: GraphQLUpload,
      Query: {
        findVideo: findVideoResolver,
        findTournament: findTournamentResolver({ logger })
      },
      Mutation: {
        uploadVideo: uploadVideoResolver(getVideoConfig(logger)),
        createTournament: createTournamentResolver({ logger })
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ ctx }) => {
      //getAccessToken(ctx);
      return ctx;
    }
  });

  AWS.config.update(
    getAWSConfig(logger)
  );

  connect(logger);

  return async (port: number, hostname?: string) => {
    await apolloServer.start();
    koaServer.use(graphqlUploadKoa());
    apolloServer.applyMiddleware({ app: koaServer });
    await new Promise<void>(resolve => httpServer.listen({ port, hostname }, resolve));
  }
}