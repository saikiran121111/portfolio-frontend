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
        process.env = { ...originalEnv };
        process.env.NEXT_PUBLIC_API_DOMAIN = 'https://test-backend.onrender.com';
        delete process.env.CRON_SECRET;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('returns 200 with backend status on success', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 200 });

        const response = await GET(createRequest());

        expect(global.fetch).toHaveBeenCalledWith(
            'https://test-backend.onrender.com/health',
            { cache: 'no-store' }
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.status).toBe('ok');
        expect(data.backendStatus).toBe(200);
        expect(data).toHaveProperty('timestamp');
    });

    it('returns backend status even when backend returns non-200', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 503 });

        const response = await GET(createRequest());

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.backendStatus).toBe(503);
    });

    it('returns 500 when fetch throws', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        const response = await GET(createRequest());

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toHaveProperty('error', 'Failed to ping backend');
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
            (global.fetch as jest.Mock).mockResolvedValue({ status: 200 });

            const response = await GET(
                createRequest({ authorization: 'Bearer my-secret-token' })
            );

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.status).toBe('ok');
        });
    });
});
