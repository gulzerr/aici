# Build stage
FROM node:22.17.0

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . /app

RUN yarn prisma:generate
# Build the application
RUN yarn build

CMD ["yarn", "start"]
