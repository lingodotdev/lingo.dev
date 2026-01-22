"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected");
        setIsConnected(true);
        setError(null);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError(err.message);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
        setError(err.message);
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  return { socket, isConnected, error };
}

export function useSocketEvent(eventName, handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const eventHandler = (...args) => {
      handlerRef.current(...args);
    };

    socket.on(eventName, eventHandler);

    return () => {
      socket.off(eventName, eventHandler);
    };
  }, [eventName]);
}

export function emitSocketEvent(eventName, data) {
  if (socket && socket.connected) {
    socket.emit(eventName, data);
  } else {
    console.warn("Socket not connected, cannot emit event:", eventName);
  }
}

export default {
  useSocket,
  useSocketEvent,
  emitSocketEvent,
};
