import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import express from 'express';
import { compress } from 'express-compress';
import minifyHTML from 'express-minify-html-3';
import router from './router';
import templateVariables from './middleware/templateVariables';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
import PeerTube from './utils/peertube';

// @env
dotenv.config();

// @app
const app = express();

// @init
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);
app.use(express.json());
app.use(compress());
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(templateVariables);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');
app.set('view options', { rmWhitespace: true });
app.set('trust proxy', 1);

// @router
app.use('/', router);

// @notFound
app.use(notFound);

// @error
app.use(errorHandler);

// @run
app.listen(process.env.PORT, async () => {
  await new PeerTube().auth();
});
