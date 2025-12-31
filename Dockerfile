FROM oven/bun:1.1.8

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    wget \
    cmake

# Clonar whisper.cpp
RUN git clone https://github.com/ggerganov/whisper.cpp.git

# Build correcto con CMake
WORKDIR /app/whisper.cpp
RUN cmake -B build && cmake --build build -j$(nproc)

# Copiar binario real
WORKDIR /app
RUN mkdir -p binWhisper/linux && \
    cp whisper.cpp/build/bin/whisper-cli binWhisper/linux/whisper && \
    chmod +x binWhisper/linux/whisper

# Descargar modelo
RUN mkdir -p models && \
    wget -O models/ggml-tiny.bin \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin

# App
COPY . .
RUN bun install

EXPOSE 3000
CMD ["bun", "run", "index.ts"]
