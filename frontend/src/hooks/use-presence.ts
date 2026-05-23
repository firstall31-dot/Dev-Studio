/**
 * usePresence
 *
 * Connects to the backend WebSocket presence channel, identifies the current
 * user, and maintains a live list of online user IDs.
 *
 * Usage:
 *   const { online, connected } = usePresence(userId);
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface UsePresenceResult {
  online: string[];
  connected: boolean;
}

const HEARTBEAT_INTERVAL_MS = 30_000;
const RECONNECT_DELAY_MS = 3_000;
const MAX_RECONNECT_ATTEMPTS = 5;

function getWsUrl(): string {
  const loc = window.location;
  const proto = loc.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${loc.host}/ws/presence`;
}

export function usePresence(userId: string | null | undefined): UsePresenceResult {
  const [online, setOnline] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!userId) return;
    if (!mountedRef.current) return;
    if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;

    const ws = new WebSocket(getWsUrl());
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      if (!mountedRef.current) { ws.close(); return; }
      attemptsRef.current = 0;
      setConnected(true);
      ws.send(JSON.stringify({ type: "identify", userId }));

      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "heartbeat" }));
        }
      }, HEARTBEAT_INTERVAL_MS);
    });

    ws.addEventListener("message", (evt) => {
      let msg: Record<string, unknown>;
      try { msg = JSON.parse(evt.data as string) as Record<string, unknown>; }
      catch { return; }

      if (msg.type === "presence" && Array.isArray(msg.online)) {
        setOnline(msg.online as string[]);
        return;
      }

      if (msg.type === "change") {
        const uid = msg.userId as string;
        if (msg.event === "join" || msg.event === "heartbeat") {
          setOnline((prev) => prev.includes(uid) ? prev : [...prev, uid]);
        } else if (msg.event === "leave") {
          setOnline((prev) => prev.filter((id) => id !== uid));
        }
      }
    });

    ws.addEventListener("close", () => {
      clearInterval(heartbeatRef.current ?? undefined);
      setConnected(false);
      if (!mountedRef.current) return;
      attemptsRef.current += 1;
      reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
    });

    ws.addEventListener("error", () => {
      ws.close();
    });
  }, [userId]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      clearInterval(heartbeatRef.current ?? undefined);
      clearTimeout(reconnectRef.current ?? undefined);
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: "leave" }));
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { online, connected };
}
