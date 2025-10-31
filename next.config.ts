import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  // từ react 18 hay nextjs 16 nó có hổi trợ cái babel mới để biên dịch react nhanh hơn
  // và nó reduce render những cái không cần thiết
  reactCompiler: true,
}

export default nextConfig
