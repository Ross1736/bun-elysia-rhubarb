FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN chmod +x binLinux/rhubarb

RUN bun install
RUN bun run build

CMD ["bun", "run", "start"]
