import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	outputFileTracingIncludes: {
		"/*": ["./public/fonts/**/*"],
	},
};

export default nextConfig;
