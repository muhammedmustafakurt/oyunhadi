'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPid } from '@/components/games/useRoom';

// Sohbet oturumu ve yoklaması. Sohbet arayüzü 2 sn'de bir /api/chat'i yoklar (oyun odalarıyla aynı desen);
// belirteç sunucudan bir kez alınır ve yerelde saklanır, her istekte sunucuya gönderilir.
const TKEY = (cafe, masa) => `oh-chat-${cafe}-${masa}`;
const NKEY = 'oh-nick';
const BKEY = 'oh-bio';

const store = {
  get(k) { try { return localStorage.getItem(k) ?? ''; } catch { return ''; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

export default function useChat({ cafe, masa, room }) {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [live, setLive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const tok = useRef('');
  const lastId = useRef(0);
  const stop = useRef(false);
  const roomRef = useRef(room);
  roomRef.current = room;

  const join = useCallback(async () => {
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'join', cafe, masa, pid: getPid(),
          nick: store.get(NKEY) || undefined,
          bio: store.get(BKEY) || undefined,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.token) {
        stop.current = true;
        setError(d.error || 'Sohbet başlatılamadı.');
        return false;
      }
      tok.current = d.token;
      store.set(TKEY(cafe, masa), d.token);
      store.set(NKEY, d.me.nick);
      store.set(BKEY, d.me.bio ?? '');
      setError('');
      setLive(true);
      return true;
    } catch {
      setLive(false);
      return false;
    }
  }, [cafe, masa]);

  const refresh = useCallback(async () => {
    if (stop.current) return;
    let token = tok.current;
    if (!token) {
      if (!(await join())) return;
      token = tok.current;
    }
    try {
      const r = await fetch(`/api/chat?token=${token}&room=${roomRef.current ?? ''}&after=${lastId.current}`, { cache: 'no-store' });
      const d = await r.json();
      if (d.gone) { tok.current = ''; setData(null); return; }
      if (!r.ok || d.error) { setLive(false); return; }
      setLive(true);
      setData(d);
      if (roomRef.current && Array.isArray(d.messages) && d.messages.length) {
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const add = d.messages.filter((m) => !seen.has(m.id));
          if (!add.length) return prev;
          for (const m of add) lastId.current = Math.max(lastId.current, m.id);
          return [...prev, ...add];
        });
      }
    } catch {
      setLive(false);
    }
  }, [join]);

  useEffect(() => {
    stop.current = false;
    tok.current = store.get(TKEY(cafe, masa));
    lastId.current = 0;
    setMessages([]);
    setData(null);
    setError('');
    let dead = false;
    const tick = () => { if (!dead && !document.hidden) refresh(); };
    tick();
    const a = setInterval(tick, 2000);
    return () => { dead = true; clearInterval(a); };
  }, [cafe, masa, refresh, retryTick]);

  const retry = useCallback(() => {
    stop.current = false;
    setError('');
    setRetryTick((t) => t + 1);
  }, []);

  const act = useCallback(async (type, payload = {}) => {
    if (!tok.current) return { error: 'Oturum yok. Sayfayı yenileyin.' };
    setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tok.current, type, ...payload }),
      });
      const d = await r.json();
      if (!r.ok || d.error) return d.error ? d : { error: 'İşlem başarısız.' };
      if (type === 'profile' && d.me) {
        store.set(NKEY, d.me.nick);
        store.set(BKEY, d.me.bio ?? '');
      }
      refresh();
      return d;
    } catch {
      return { error: 'Bağlantı hatası. Tekrar deneyin.' };
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  return { data, messages, error, live, busy, act, retry };
}
