FROM node:22-alpine

WORKDIR /backend

COPY . .

RUN npm install
RUN npm run build 
RUN npx prisma generate

ENV DATABASE_URL="postgresql://bkashishh07:WrIzv49gynwO@ep-square-dew-a5fv8u6f.us-east-2.aws.neon.tech/chaimera?sslmode=require"


EXPOSE 3000


CMD ["node", "dist/index.js"]