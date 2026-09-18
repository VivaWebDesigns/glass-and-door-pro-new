import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, cp, readFile, writeFile } from "fs/promises";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  ) as { version?: string };

  console.log("building client...");
  const clientBuild = await viteBuild();
  const builds = Array.isArray(clientBuild) ? clientBuild : [clientBuild];
  const cmsEntry = builds
    .flatMap((build) => ("output" in build ? build.output : []))
    .find(
      (file) =>
        file.type === "chunk" && file.isEntry && file.facadeModuleId?.endsWith("/cms-main.tsx"),
    );
  if (!cmsEntry) throw new Error("CMS client entry was not emitted");

  const baseHtml = await readFile("dist/public/index.html", "utf8");
  const entryScript = /<script type="module" crossorigin src="\/assets\/[^\"]+\.js"><\/script>/;
  if (!entryScript.test(baseHtml)) throw new Error("Client entry script was not found in HTML");
  const cmsHtml = baseHtml.replace(
    entryScript,
    `<script type="module" crossorigin src="/${cmsEntry.fileName}"></script>`,
  );
  await writeFile("dist/public/.cms.html", cmsHtml);

  console.log("building server...");
  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
      __APP_VERSION__: JSON.stringify(packageJson.version ?? "unknown"),
    },
    minify: false,
    packages: "external",
    logLevel: "info",
  });

  console.log("copying migrations...");
  await cp("migrations", "dist/migrations", { recursive: true });

  console.log("copying docs...");
  await cp("docs", "dist/docs", { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
