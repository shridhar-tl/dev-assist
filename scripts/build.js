'use strict';

const isDevBuild = process.argv[2] !== 'PROD';

// Do this as the first thing so that any code reading it knows the right env.
if (!isDevBuild) {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';
} else {
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


// Modified: const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const bfj = require('bfj');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
// Modified: const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const movePackages = require('./move-package'); // Modified: Added this variable

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
// Modified: const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
const config = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(handleCompilationSuccess, handleCompilationError)

  // Modified: Add this block to move package to appropriate folders
  .then((result) => {
    movePackages(paths.appBuild, paths.sourceMapPath);
    return result;
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }

    if (!isDevBuild) {
      process.exit(1);
    }
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  if (isDevBuild) {
    console.log('Building in watch mode...');
  } else {
    console.log('Creating an optimized production build...');
  }

  const compiler = webpack(config);
  compiler.watchMode = true;

  let firstCompile = true;

  return new Promise((resolve, reject) => {
    // Modified:
    const handler = (err, stats) => {
      const result = parseCompileCallback(err, stats, previousFileSizes);

      if (firstCompile) {
        firstCompile = false;
        result.then(resolve, reject);
      }
      else {
        result.then(handleCompilationSuccess, handleCompilationError);
      }
    };

    if (isDevBuild) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: 1000
      }, handler);
    }
    else {
      compiler.run(handler);
    }
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

// Modified:

function parseCompileCallback(err, stats, previousFileSizes) {
  return new Promise((resolve, reject) => {
    let messages;
    if (err) {
      if (!err.message) {
        return reject(err);
      }

      let errMessage = err.message;

      // Add additional information for postcss errors
      if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
        errMessage +=
          '\nCompileError: Begins at CSS selector ' +
          err['postcssNode'].selector;
      }

      messages = formatWebpackMessages({
        errors: [errMessage],
        warnings: [],
      });
    } else {
      messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
    }
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      return reject(new Error(messages.errors.join('\n\n')));
    }
    if (
      process.env.CI &&
      (typeof process.env.CI !== 'string' ||
        process.env.CI.toLowerCase() !== 'false') &&
      messages.warnings.length
    ) {
      console.log(
        chalk.yellow(
          '\nTreating warnings as errors because process.env.CI = true.\n' +
          'Most CI servers set it automatically.\n'
        )
      );
      return reject(new Error(messages.warnings.join('\n\n')));
    }

    const resolveArgs = {
      stats,
      previousFileSizes,
      warnings: messages.warnings,
    };

    if (writeStatsJson) {
      return bfj
        .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
        .then(() => resolve(resolveArgs))
        .catch(error => reject(new Error(error)));
    }

    return resolve(resolveArgs);
  });
}

function handleCompilationSuccess({ stats, previousFileSizes, warnings }) {
  if (warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(warnings.join('\n\n'));
    console.log(
      '\nSearch for the ' +
      chalk.underline(chalk.yellow('keywords')) +
      ' to learn more about each warning.'
    );
    console.log(
      'To ignore, add ' +
      chalk.cyan('// eslint-disable-next-line') +
      ' to the line before.\n'
    );
  } else {
    console.log(chalk.green('Compiled successfully.\n'));
  }

  console.log('File sizes after gzip:\n');
  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    paths.appBuild,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  );
  console.log();

  console.log('Build completed at: ' + new Date().toString()); // Modified:

  /* Modified: This info is not necessary
  const appPackage = require(paths.appPackageJson);
  const publicUrl = paths.publicUrlOrPath;
  const publicPath = config.output.publicPath;
  const buildFolder = path.relative(process.cwd(), paths.appBuild);
  printHostingInstructions(
    appPackage,
    publicUrl,
    publicPath,
    buildFolder,
    useYarn
  );*/
};

function handleCompilationError(err) {
  const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
  if (tscCompileOnError) {
    console.log(
      chalk.yellow(
        'Compiled with the following type errors (you may want to check these before deploying your app):\n'
      )
    );
    printBuildError(err);
  } else {
    console.log(chalk.red('Failed to compile.\n'));
    printBuildError(err);
    if (!isDevBuild) {
      process.exit(1);
    }
  }
}