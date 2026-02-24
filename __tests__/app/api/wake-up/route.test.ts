import { GET } from '@/app/api/wake-up/route';
import { NextRequest } from 'next/server';

// Mock fetch globally
global.fetch = jest.fn();

// Mock NextResponse
jest.mock('next/server', () => {
    return {
        NextRequest: class {
            headers: Map<string, string>;
            constructor(url: string, init?: any) {
                this.headers = new Map(Object.entries(init?.headers || {}));
            }
        },
        NextResponse: class {
            body: any;
            init: any;
            headers: Map<string, string>;
            status: number;
            constructor(body: any, init?: any) {
                this.body = body;
                this.init = init;
                this.headers = new Map(Object.entries(init?.headers || {}));
                this.status = init?.status || 200;
            }
            static json(body: any, init?: any) {
                return {
                    json: async () => body,
                    status: init?.status || 200,
                    headers: new Map(),
                };
            }
            json() {
                return Promise.resolve(JSON.parse(JSON.stringify(this.body)));
            }
        },
    };
});

function createRequest(headers: Record<string, string> = {}): NextRequest {
    return new NextRequest('http://localhost/api/wake-up', { headers });
}

describe('Wake-Up API', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ legacyFakeTimers: false });
        process.env = { ...originalEnv };
        process.env.NEXT_PUBLIC_API_DOMAIN = 'https://test-backend.onrender.com';
        delete process.env.CRON_SECRET;
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('returns 200 with backend status on first attempt success', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 200, ok: true });

        const response = await GET(createRequest());

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            'https://test-backend.onrender.com/health',
            expect.objectContaining({ cache: 'no-store' })
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.status).toBe('ok');
        expect(data.backendStatus).toBe(200);
        expect(data.message).toContain('1 attempt');
        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('attempts');
        expect(data.attempts).toHaveLength(1);
    });

    it('retries and succeeds when backend wakes up after failures', async () => {
        // First 2 calls fail (sleeping), third succeeds (woke up)
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ status: 503, ok: false })
            .mockResolvedValueOnce({ status: 503, ok: false })
            .mockResolvedValueOnce({ status: 200, ok: true });

        // Run the GET call but let timers advance for the delays
        const responsePromise = GET(createRequest());

        // Advance past the first retry delay (15s)
        await jest.advanceTimersByTimeAsync(15_000);
        // Advance past the second retry delay (15s)
        await jest.advanceTimersByTimeAsync(15_000);

        const response = await responsePromise;

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.status).toBe('ok');
        expect(data.backendStatus).toBe(200);
        expect(data.message).toContain('3 attempt');
        expect(data.attempts).toHaveLength(3);
        expect(data.attempts[0].status).toBe(503);
        expect(data.attempts[1].status).toBe(503);
        expect(data.attempts[2].status).toBe(200);
    });

    it('returns 503 after all retries exhausted with non-200 responses', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 503, ok: false });

        const responsePromise = GET(createRequest());

        // Advance timers for all 7 retry delays (between 8 attempts)
        for (let i = 0; i < 7; i++) {
            await jest.advanceTimersByTimeAsync(15_000);
        }

        const response = await responsePromise;

        expect(global.fetch).toHaveBeenCalledTimes(8);
        expect(response.status).toBe(503);
        const data = await response.json();
        expect(data.status).toBe('error');
        expect(data.message).toContain('8 attempts');
        expect(data.attempts).toHaveLength(8);
    });

    it('returns 503 after all retries exhausted when fetch throws', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const responsePromise = GET(createRequest());

        // Advance timers for all 7 retry delays
        for (let i = 0; i < 7; i++) {
            await jest.advanceTimersByTimeAsync(15_000);
        }

        const response = await responsePromise;

        expect(global.fetch).toHaveBeenCalledTimes(8);
        expect(response.status).toBe(503);
        const data = await response.json();
        expect(data.status).toBe('error');
        expect(data.attempts).toHaveLength(8);
        // Network errors should be recorded as status 0
        expect(data.attempts[0].status).toBe(0);
    });

    it('returns 500 when backend URL is not configured', async () => {
        delete process.env.NEXT_PUBLIC_API_DOMAIN;

        const response = await GET(createRequest());

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toHaveProperty('error', 'Backend URL not configured');
    });

    describe('with CRON_SECRET set', () => {
        beforeEach(() => {
            process.env.CRON_SECRET = 'my-secret-token';
        });

        it('returns 401 when authorization header is missing', async () => {
            const response = await GET(createRequest());

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data).toHaveProperty('error', 'Unauthorized');
        });

        it('returns 401 when authorization header is wrong', async () => {
            const response = await GET(
                createRequest({ authorization: 'Bearer wrong-token' })
            );

            expect(response.status).toBe(401);
        });

        it('returns 200 when authorization header is correct', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ status: 200, ok: true });

            const response = await GET(
                createRequest({ authorization: 'Bearer my-secret-token' })
            );

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.status).toBe('ok');
        });
    });
});
