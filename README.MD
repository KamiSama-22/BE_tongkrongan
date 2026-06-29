instalasi project : npm init -y
install express dan cors : npm install express cors
install typesript : npm install -D typescript @types/node @types/express @types/cors ts-node-dev
buat file tsconfig.json : npx tsc --init
npm install prisma
npm install dotenv
npm install @prisma/client
npx prisma init

npx prisma migrate dev --name nama bebas //jika ingin mengupdate atau menambahkan tabel yang sebelumnya di buat di schema.prisma

npm install @prisma/adapter-mariadb //menyambunngkan ke mariadb
rm -rf src/generated/prisma (linux,mac,dll)
npx prisma generate

npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken

====================Frontend================================

npm install axios
npm install @tanstack/react-query