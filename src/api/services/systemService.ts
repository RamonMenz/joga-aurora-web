import api from "@/api/axios";
import { API_ENDPOINTS } from "@/util/constants";

const systemService = {
  health: async (): Promise<boolean> => {
    try {
      // Keep it simple: a GET to health endpoint; resolves true on 2xx
      const res = await api.get(API_ENDPOINTS.SYSTEM.HEALTH, { timeout: 5000 });
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  },
  waitUntilHealthy: async (opts?: { retries?: number; delayMs?: number }): Promise<void> => {
    const retries = opts?.retries ?? 6;
    const baseDelay = opts?.delayMs ?? 1000;

    for (let attempt = 0; attempt < retries; attempt++) {
      const ok = await systemService.health();
      if (ok) return;
      await new Promise((r) => setTimeout(r, baseDelay * Math.min(1 + attempt, 5)));
    }
  },
};

export default systemService;
