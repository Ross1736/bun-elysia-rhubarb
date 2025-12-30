import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

const RHUBARD =
  process.env.NODE_ENV === "production"
    ? "./binLinux/rhubarb"
    : "./binWindows/rhubarb.exe";

app.get("generate", async () => {
  const process = Bun.spawn([
    RHUBARD,
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
