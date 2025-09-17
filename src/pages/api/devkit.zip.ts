// /src/pages/api/devkit.zip.ts

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import archiver from "archiver";

/**
 * Streams a developer kit ZIP bundle.
 * Includes:
 *  - /lib/versetory-sdk.ts (if exists)
 *  - /examples/quickstart.ts (if exists)
 *  - /public/devkit/Versetory.postman_collection.json
 *  - /public/devkit/samples/search.json
 *  - /public/devkit/samples/interpretations.json
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="versetory-devkit.zip"');

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => res.status(500).end(String(err)));
    archive.pipe(res);

    const root = process.cwd();
    const add = (p: string) => fs.existsSync(p) && archive.file(p, { name: path.relative(root, p) });

    add(path.join(root, "lib", "versetory-sdk.ts"));
    add(path.join(root, "examples", "quickstart.ts"));
    add(path.join(root, "public", "devkit", "Versetory.postman_collection.json"));
    add(path.join(root, "public", "devkit", "samples", "search.json"));
    add(path.join(root, "public", "devkit", "samples", "interpretations.json"));

    await archive.finalize();
}
