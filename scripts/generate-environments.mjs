import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rootDir = process.cwd();

const devEnvPath = resolve(rootDir, '.env');
const prodEnvPath = resolve(rootDir, '.env.prod');

const devEnvValues = parseEnvFile(devEnvPath);
const prodEnvValues = parseEnvFile(prodEnvPath);

const devApiKey = pickFirstNonEmpty([
  process.env.GOOGLE_BOOKS_API_KEY_DEV,
  process.env.GOOGLE_BOOKS_API_KEY,
  devEnvValues.GOOGLE_BOOKS_API_KEY_DEV,
  devEnvValues.GOOGLE_BOOKS_API_KEY,
]);

const prodApiKey = pickFirstNonEmpty([
  process.env.GOOGLE_BOOKS_API_KEY_PROD,
  process.env.GOOGLE_BOOKS_API_KEY,
  prodEnvValues.GOOGLE_BOOKS_API_KEY_PROD,
  prodEnvValues.GOOGLE_BOOKS_API_KEY,
  devApiKey,
]);

writeEnvironmentFile(
  resolve(rootDir, 'src/environments/environment.ts'),
  false,
  devApiKey,
);
writeEnvironmentFile(
  resolve(rootDir, 'src/environments/environment.production.ts'),
  true,
  prodApiKey,
);

console.log('[env] Arquivos de environment gerados com sucesso.');

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const content = readFileSync(filePath, 'utf8');
  const values = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(.+)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    const normalizedValue = stripQuotes(match[2].trim());
    values[key] = normalizedValue;
  }

  return values;
}

function stripQuotes(value) {
  const isDoubleQuoted = value.startsWith('"') && value.endsWith('"');
  const isSingleQuoted = value.startsWith("'") && value.endsWith("'");

  if (isDoubleQuoted || isSingleQuoted) {
    return value.slice(1, -1).trim();
  }

  return value;
}

function pickFirstNonEmpty(candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return '';
}

function writeEnvironmentFile(filePath, production, googleBooksApiKey) {
  mkdirSync(dirname(filePath), { recursive: true });

  const escapedApiKey = googleBooksApiKey
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");

  const content = `export const environment = {
  production: ${production},
  googleBooksApiKey: '${escapedApiKey}',
};
`;

  writeFileSync(filePath, content, 'utf8');
}
