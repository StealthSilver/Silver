import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const pdfPath = path.join(process.cwd(), "public", "Resume1.pdf");
  const pdf = await readFile(pdfPath);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Resume1.pdf"',
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

