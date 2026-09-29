import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env['PORT'] || 3000,
  mongoUri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/portfolio',
  jwtSecret: process.env['JWT_SECRET'] || 'fallback_secret_change_in_production',
  nodeEnv: process.env['NODE_ENV'] || 'development',
  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:4200',
  githubToken: process.env['GITHUB_TOKEN'] || '',
  githubUsername: process.env['GITHUB_USERNAME'] || 'YOUR_GITHUB_USERNAME',
  emailUser: process.env['EMAIL_USER'] || '',
  emailPass: process.env['EMAIL_PASS'] || '',
  adminEmail: process.env['ADMIN_EMAIL'] || '',
};
