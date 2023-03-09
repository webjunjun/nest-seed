module.exports = {
  apps : [{
    name   : "wwz_booking",
    script : "./dist/main.js",
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production",
    }
  }]
}
