import { NextRequest, NextResponse } from 'next/server';

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 15_000; // 15 seconds between retries
const FETCH_TIMEOUT_MS = 30_000; // 30 second timeout per attempt

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingBackend(url: string): Promise<{ status: number; ok: boolean }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const res = await fetch(url, {
            cache: 'no-store',
            signal: controller.signal,
        });

        clearTimeout(timeout);
        return { status: res.status, ok: res.ok };
    } catch {
        return { status: 0, ok: false }; // network error or timeout
    }
}

export async function GET(request: NextRequest) {
    // Optional: verify the secret to prevent public abuse
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
    if (!backendUrl) {
        return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const healthUrl = `${backendUrl}/health`;
    const attempts: { attempt: number; status: number; timestamp: string }[] = [];

    for (let i = 1; i <= MAX_RETRIES; i++) {
        const result = await pingBackend(healthUrl);
        attempts.push({
            attempt: i,
            status: result.status,
            timestamp: new Date().toISOString(),
        });

        if (result.ok) {
            // Backend is awake — return success immediately
            return NextResponse.json({
                status: 'ok',
                message: `Backend is awake (took ${i} attempt${i > 1 ? 's' : ''})`,
                backendStatus: result.status,
                attempts,
                timestamp: new Date().toISOString(),
            });
        }

        console.log(
            `[wake-up] Attempt ${i}/${MAX_RETRIES} — got ${result.status || 'timeout/error'}, retrying in ${RETRY_DELAY_MS / 1000}s...`
        );

        // Don't delay after the last attempt
        if (i < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS);
        }
    }

    // All retries exhausted — backend didn't wake up
    console.error(`[wake-up] Backend failed to wake after ${MAX_RETRIES} attempts`, attempts);
    return NextResponse.json(
        {
            status: 'error',
            message: `Backend did not respond after ${MAX_RETRIES} attempts`,
            attempts,
            timestamp: new Date().toISOString(),
        },
        { status: 503 }
    );
}

