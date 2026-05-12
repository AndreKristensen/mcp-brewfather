import type { NextConfig } from "next";
import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Expose OAuth Authorization Server Metadata at the well-known URL
      // required by RFC 8414 / MCP auth spec so Claude can discover our OAuth endpoints.
      {
        source: '/.well-known/oauth-authorization-server',
        destination: '/api/oauth/metadata',
      },
    ];
  },
};

export default varlockNextConfigPlugin()(nextConfig);
