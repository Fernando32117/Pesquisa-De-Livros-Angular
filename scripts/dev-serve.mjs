import { spawn } from "node:child_process";

function start(cmd, args) {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  child.on("exit", (code) => {
    if (code !== 0) process.exit(code ?? 1);
  });
  return child;
}

start("node", ["scripts/api-dev-server.mjs"]);
start("ng", ["serve"]);
