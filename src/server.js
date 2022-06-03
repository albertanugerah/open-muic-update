require('dotenv').config();

const Hapi = require('@hapi/hapi');
// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validators/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validators/songs');

// const ClientError = require('./exceptions/ClientError');
// const NotFoundError = require('./exceptions/NotFoundError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    }]);
  // server.ext('onPreResponse', (request, h) => {
  //   const { response } = request;
  //
  //   if (response instanceof ClientError) {
  //     const newResponse = h.response({
  //       status: 'fail',
  //       message: response.message,
  //     });
  //     newResponse.code(response.statusCode);
  //     return newResponse;
  //   }
  //   if (response instanceof NotFoundError) {
  //     const newResponse = h.response({
  //       status: 'fail',
  //       message: response.message,
  //     });
  //     newResponse.code(response.statusCode);
  //     return newResponse;
  //   }
  //   // Server ERROR!
  //   const newResponse = h.response({
  //     status: 'error',
  //     message: 'Maaf, terjadi kegagalan pada server kami.',
  //   });
  //   newResponse.code(500);
  //
  //   return response.continue || response;
  // });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
