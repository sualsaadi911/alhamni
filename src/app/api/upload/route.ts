import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على ملف' }, { status: 400 });
    }

    const originalName = file.name || 'image.png';
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
      .from('images')
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename);

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء رفع الملف' }, { status: 500 });
  }
}
