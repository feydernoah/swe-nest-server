// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

/**
 * Das Modul enthält die Konfiguration für den _Node_-basierten Server.
 * @packageDocumentation
 */

import { type HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { RESOURCES_DIR } from './app.js';

// https://nodejs.org/api/path.html
// https://nodejs.org/api/fs.html
// http://2ality.com/2017/11/import-meta.html

const tlsDir = path.resolve(RESOURCES_DIR, 'tls');
console.debug('tlsDir = %s', tlsDir);

// public/private keys und Zertifikat fuer TLS
let keyBuffer: Buffer;
let certBuffer: Buffer;
try {
  keyBuffer = readFileSync(path.resolve(tlsDir, 'key.pem')); // eslint-disable-line security/detect-non-literal-fs-filename
  certBuffer = readFileSync(path.resolve(tlsDir, 'certificate.crt')); // eslint-disable-line security/detect-non-literal-fs-filename
} catch {
  // if files are not present (e.g. in CI tests), use empty buffers
  keyBuffer = Buffer.alloc(0);
  certBuffer = Buffer.alloc(0);
}
export const httpsOptions: HttpsOptions = { key: keyBuffer, cert: certBuffer };
