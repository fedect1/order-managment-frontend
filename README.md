# Development
Pasos para levantar la app en desarrollo


1. Levantar la base de datos
```
docker compose up -d
```


# Prisma commnads
```
npm install prisma --save-dev
npm install @prisma/client

npx prisma init

.env
DATABASE_URL="mysql://root:innomip@localhost:3306/webmip"

prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}


```



# Prod


# Stage