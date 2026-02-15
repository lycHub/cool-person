module.exports = {
  apps: [
    {
      name: 'cool-person',
      cwd: './packages/cool',
      script: 'express/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
