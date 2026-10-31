import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Yerel geliştirmede DATABASE_URL yoksa oyun odaları bellekteki PGlite'ta tutulur (bkz. src/lib/db.js).
  serverExternalPackages: ['@electric-sql/pglite'],
  experimental: { globalNotFound: true },
  // Ana klasörde başka bir package-lock.json olduğu için proje kökünü açıkça belirtiyoruz.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
