import * as dotenv from "dotenv";
dotenv.config();

interface IJWT {
    secret: string;
    issuer: string;
    expires: number;
    subject: string;
    algorithm: string;
}

interface IDATABASE {
    database: string,
    host: string,
    port: number,
    user: string,
    password: string,
    dbTest: string,

}

interface IConfig {
    serverPort: string;
    saltFactor: number, 
    JWT: IJWT
    Database: IDATABASE 
}


const Configuration: IConfig = {
    serverPort: process.env.PORT as string,
    saltFactor: Number(process.env.SALT_FACTOR), 
    JWT: {
        secret: process.env.JWT_SECRET as string,
        issuer: process.env.JWT_ISSUER as string,
        subject: process.env.JWT_SUBJECT as string,
        algorithm: process.env.JWT_ALGORITHM as string,
        expires: Number(process.env.JWT_EXPIRES)
    },
    Database: {
        database: process.env.MYSQL_DATABASE_NAME as string,
        dbTest: process.env.MYSQL_DATABASE_TEST_NAME as string,
        host: process.env.MYSQL_HOST as string,
        port: Number(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USER as string,
        password: process.env.MYSQL_PASSWORD as string
    }
}

export default Configuration;
