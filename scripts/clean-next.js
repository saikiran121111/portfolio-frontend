const fs = require("fs");
const path = require("path");

const nextDir = path.join(process.cwd(), ".next");

if (!fs.existsSync(nextDir)) {
  console.log("No .next directory found.");
  process.exit(0);
}

fs.rmSync(nextDir, { recursive: true, force: true });
console.log("Removed stale .next directory.");
