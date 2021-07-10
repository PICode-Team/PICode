import dotenv from 'dotenv'
dotenv.config()

interface TEnvConfig {
    NODE_ENV?: 'development' | 'production',
    PORT?: number,
    MODE?: 'server' | 'full'
}

const envConfig: TEnvConfig = process.env

export default envConfig