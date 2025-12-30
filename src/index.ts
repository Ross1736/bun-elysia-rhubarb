import { Elysia } from "elysia";
import { platform } from "node:os";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

const RHUBARB =
  platform() === "win32" ? "./binWindows/rhubarb.exe" : "./binLinux/rhubarb";

app.get("generate", async () => {
  const process = Bun.spawn([
    RHUBARB,
    "./uploads/defeated.wav",
    "-f",
    "json",
    "-o",
    "./output/defeated.json",
  ]);

  await process.exited;

  const json = await Bun.file("./output/defeated.json").json();

  return json;
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
