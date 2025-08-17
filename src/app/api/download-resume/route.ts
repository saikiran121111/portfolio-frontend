import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resumeUrl = "https://github.com/saikiran121111/Resume/raw/main/SaiKiran_Resume.pdf";
    
    // Fetch the PDF from GitHub
    const response = await fetch(resumeUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
    }
    
    // Get the PDF buffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Return the PDF with proper headers for download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="SaiKiran_Resume.pdf"',
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
