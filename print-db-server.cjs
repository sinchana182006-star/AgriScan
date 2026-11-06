const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/db") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const data = JSON.parse(body);

      console.log("\n========== AGRISCAN DATABASE ==========\n");

      for (const [store, records] of Object.entries(data)) {
        console.log(`\n${store.toUpperCase()} (${records.length} records)`);
        console.table(records);
      }

      console.log("\n========== END DATABASE ==========\n");
      res.end("Database printed in terminal");
    });

    return;
  }

  res.end("AgriScan database terminal server running");
});

server.listen(4179, () => {
  console.log("Database terminal server running on port 4179");
});