import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {
    // Dynamically resolve the monorepo root (one directory up from frontend)
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
