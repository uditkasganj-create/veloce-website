import { useEffect } from 'react';

// Uses Vite env variable, falls back to localhost for local dev
const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '/api';

export const useAnalytics = (currentPage: string) => {
    useEffect(() => {
        const controller = new AbortController();

        const trackPageView = async () => {
            try {
                await fetch(`${API_BASE}/analytics/pageview`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: currentPage }),
                    signal: controller.signal,
                });
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    // silent — analytics should never surface errors to user
                }
            }
        };

        trackPageView();
        return () => controller.abort();
    }, [currentPage]);

    useEffect(() => {
        const pingActiveUser = async () => {
            try {
                await fetch(`${API_BASE}/analytics/ping`, { method: 'POST' });
            } catch {
                // silent fail - don't pollute console if server is offline
            }
        };

        pingActiveUser();
        const interval = setInterval(pingActiveUser, 30000);
        return () => clearInterval(interval);
    }, []);
};

export const trackInteraction = async (elementId: string): Promise<void> => {
    try {
        await fetch(`${API_BASE}/analytics/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ elementId }),
        });
    } catch {
        // silent — analytics should never interrupt UX
    }
};
