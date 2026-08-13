/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // legacy/ holds the retired Python pipeline. Nothing in it is part of the build,
  // but keeping it out of the file tracer keeps `next build` from walking it.
  outputFileTracingExcludes: {
    "*": ["./legacy/**/*"],
  },
  // `/fallback` was the worked example's route before visualisations existed.
  // It is linked from PR descriptions and workshop notes, so it keeps working.
  // A config redirect rather than a stub page: no route file to mistake for a
  // visualisation, and nothing sitting in `app/` that has to be maintained.
  async redirects() {
    return [
      {
        source: "/fallback",
        destination: "/visualisations/keyshot-reference",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
