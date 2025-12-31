import { Elysia } from "elysia";
import { platform } from "node:os";
import { whisperToMouthCues } from "./utils/functions";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

const WHISPER =
  platform() === "win32"
    ? "binWhisper/whisper-cli.exe"
    : "binWhisper/whisper-cli";

app.get("generate", async () => {
  const proc = Bun.spawn([
    WHISPER,
    "-m",
    "models/ggml-tiny.bin",
    "-f",
    "uploads/defeated.wav",
    "-oj",
    "-t",
    "2",
    "-of",
    "output/defeated",
  ]);

  const code = await proc.exited;

  if (code !== 0) {
    return { error: "Whisper exit code " + code };
  }

  const whisperJson = await Bun.file("output/defeated.json").json();

  return whisperToMouthCues(whisperJson);
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
