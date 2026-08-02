import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const resumeUrl = "https://github.com/saikiran121111/Resume/raw/main/SaiKiran_Resume.pdf";
    
    // Fetch the PDF from GitHub
    const response = await fetch(resumeUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
    }
    
    // Get the PDF buffer
    const pdfBuffer = await response.arrayBuffer();
    
    const inline = request.nextUrl.searchParams.get('view') === '1';

    // The same PDF can be shown in the viewer or downloaded explicitly.
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="SaiKiran_Resume.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
