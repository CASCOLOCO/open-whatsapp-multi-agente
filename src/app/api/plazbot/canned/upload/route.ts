import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// Increase body size limit for file uploads
export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];
const ALLOWED_VIDEO_EXTS = ["mp4", "webm", "mov"];
const ALLOWED_DOC_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "zip", "rar"];
const ALLOWED_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS, ...ALLOWED_DOC_EXTS];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const entries = formData.getAll("files");

    // Also try individual file keys (file0, file1, etc) as fallback
    if (!entries || entries.length === 0) {
      // Try getting any file entries
      const allEntries: File[] = [];
      formData.forEach((value, key) => {
        if (value instanceof File) allEntries.push(value);
      });
      if (allEntries.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }
      entries.push(...allEntries);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "canned");
    await mkdir(uploadDir, { recursive: true });

    const results: { url: string; type: string; name: string }[] = [];

    for (const entry of entries) {
      if (!(entry instanceof File)) continue;
      const file = entry as File;
      if (!file.name || file.size === 0) continue;

      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTS.includes(ext)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);

      const mediaType = ALLOWED_IMAGE_EXTS.includes(ext) ? "image" : ALLOWED_VIDEO_EXTS.includes(ext) ? "video" : "document";
      results.push({
        url: `/uploads/canned/${filename}`,
        type: mediaType,
        name: file.name,
      });
    }

    return NextResponse.json({ files: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
