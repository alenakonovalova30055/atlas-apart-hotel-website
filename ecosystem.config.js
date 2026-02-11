module.exports = {
  apps: [
    {
      name: "atlas-apart",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/root/atlas-apart-hotel-website",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
