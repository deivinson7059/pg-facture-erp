const isProd = false;
export const environment = {
    production: isProd,
    fronted: {
        domain: isProd
          ? 'http://localhost:4200'
          : 'http://localhost:4200',
      },
    backend: {
        domain: isProd
          ? 'http://127.0.0.1:3000'
          : 'http://127.0.0.1:3000',
      },
  };
  