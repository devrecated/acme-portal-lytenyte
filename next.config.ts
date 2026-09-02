import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@1771technologies/lytenyte-core"],
}

export default nextConfig
