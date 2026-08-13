'use strict'
/* eslint-disable @typescript-eslint/no-require-imports -- Passenger loads this CommonJS startup file directly. */

const path = require('node:path')
const { existsSync } = require('node:fs')

process.env.NODE_ENV ||= 'production'
process.env.HOSTNAME ||= '0.0.0.0'

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js')

if (!existsSync(standaloneServer)) {
  throw new Error('Standalone Next.js build not found. Run the production build before starting Passenger.')
}

require(standaloneServer)
