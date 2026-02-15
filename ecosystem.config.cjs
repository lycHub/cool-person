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
    {
      name: 'cool-person_spa',
      cwd: './packages/cool',
      script: 'spa.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
