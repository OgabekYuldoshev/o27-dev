// pdfkit (under @react-pdf/renderer) loads its standard fonts and platform
// shims through `#standard-fonts/*`-style subpath imports, which the
// standalone file tracer does not follow. Every route that imports the resume
// feature has to ship those files explicitly or it throws MODULE_NOT_FOUND.
const PDFKIT_RUNTIME_FILES = [
	"./node_modules/pdfkit/js/standard-fonts/**/*",
	"./node_modules/pdfkit/lib/**/*",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Self-contained server bundle (`.next/standalone`) for the Docker image.
	output: "standalone",
	// react-pdf ships its own layout engine and font loader; bundling it breaks
	// both, so it is required from node_modules at runtime instead.
	serverExternalPackages: ["@react-pdf/renderer"],
	experimental: {
		// shadcn/ui imports its primitives from the `radix-ui` umbrella package,
		// which does not tree-shake on its own; this rewrites those barrel imports
		// to the individual modules that are actually used.
		optimizePackageImports: ["radix-ui"],
	},
	// Keystatic reads its markdown content from the filesystem, so the content
	// directory has to be traced into the standalone build of every route that
	// queries it.
	outputFileTracingIncludes: {
		"/": ["./content/**/*", ...PDFKIT_RUNTIME_FILES],
		"/blog/[slug]": ["./content/**/*"],
		"/projects/[slug]": ["./content/**/*"],
		"/sitemap.xml": ["./content/**/*", ...PDFKIT_RUNTIME_FILES],
		// The resume reads the singleton and the Golos Text files from disk.
		"/resume.pdf": [
			"./content/**/*",
			"./src/assets/fonts/**/*",
			...PDFKIT_RUNTIME_FILES,
		],
		// The social cards read the Golos Text files from disk at render time.
		"/opengraph-image": ["./src/assets/fonts/**/*"],
		"/blog/[slug]/opengraph-image": [
			"./content/**/*",
			"./src/assets/fonts/**/*",
		],
		"/projects/[slug]/opengraph-image": [
			"./content/**/*",
			"./src/assets/fonts/**/*",
		],
	},
};

export default nextConfig;
