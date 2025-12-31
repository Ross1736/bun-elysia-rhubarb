FROM oven/bun:1.1.8

WORKDIR /app

# dependencias para compilar whisper.cpp
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    wget \
    cmake

# clonar whisper.cpp
RUN git clone https://github.com/ggerganov/whisper.cpp.git

WORKDIR /app/whisper.cpp

# compilar
RUN make whisper-cli

# volver a la app
WORKDIR /app

# copiar binario compilado
RUN mkdir -p binWhisper/linux && \
    cp whisper.cpp/whisper-cli binWhisper/linux/whisper && \
    chmod +x binWhisper/linux/whisper

# modelo
RUN mkdir -p models && \
    wget -O models/ggml-tiny.bin \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin

# app
COPY . .

RUN bun install

EXPOSE 3000
CMD ["bun", "run", "index.ts"]
