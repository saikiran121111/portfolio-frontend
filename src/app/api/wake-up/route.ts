import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Optional: verify the secret to prevent public abuse
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
        const res = await fetch(`${backendUrl}/health`, { cache: 'no-store' });
        return NextResponse.json({
            status: 'ok',
            backendStatus: res.status,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Wake-up ping failed:', error);
        return NextResponse.json(
            { error: 'Failed to ping backend' },
            { status: 500 }
        );
    }
}
