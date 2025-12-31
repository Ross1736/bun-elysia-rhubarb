FROM oven/bun:1.1.8

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    wget \
    cmake

RUN git clone https://github.com/ggerganov/whisper.cpp.git

WORKDIR /app/whisper.cpp

# 🔥 AQUÍ
RUN make -j$(nproc) && \
    echo "=== BINARIOS GENERADOS ===" && \
    find . -type f -perm /111

WORKDIR /app

RUN mkdir -p binWhisper/linux && \
    cp whisper.cpp/build/bin/whisper-server binWhisper/linux/whisper && \
    chmod +x binWhisper/linux/whisper

RUN mkdir -p models && \
    wget -O models/ggml-tiny.bin \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin

COPY . .

RUN bun install

EXPOSE 3000
CMD ["bun", "run", "index.ts"]
