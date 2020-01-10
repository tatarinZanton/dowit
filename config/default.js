module.exports = {
  db: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'dowit',
      password: 'dowit',
      database: 'dowit',
    },
  },
  mail: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'inna.artkai@gmail.com',
      pass: process.env.SMTP_PASS || 'HelloArtkai27',
    },
    from: process.env.FROM_EMAIL || 'admin@development.org',
  },
};
