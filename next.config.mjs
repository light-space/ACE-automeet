/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // legacy/ holds the retired Python pipeline. Nothing in it is part of the build,
  // but keeping it out of the file tracer keeps `next build` from walking it.
  outputFileTracingExcludes: {
    "*": ["./legacy/**/*"],
  },
};

export default nextConfig;
