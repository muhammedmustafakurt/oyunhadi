'use client';
import { useEffect, useRef, useState } from 'react';
import useChat from './useChat';
import ChatHub from './ChatHub';
import ChatRoom from './ChatRoom';

// Canlı destek balonu: masa sayfasının sağ altındaki küçük ikon. Kapalıyken okunmamış sayacını
// güncel tutmak için yavaş, açıkken gerçek zamanlı (2 sn) yoklama yapar. Yeni istek ve mesajlarda
// balonun sol üstünde bildirim kartı çıkar.
export default function ChatWidget({ cafe, masa, no }) {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState(0); // 0: sohbet listesi, >0: açık oda kimliği
  const { data, messages, error, live, busy, act, retry } = useChat({
    cafe, masa,
    room: open ? room || undefined : undefined,
    active: open,
  });

  const [toasts, setToasts] = useState([]);
  const seenReq = useRef(null);   // bildirimi verilmiş istek kimlikleri
  const roomStamp = useRef(null); // oda -> son mesaj zamanı
  const baseTitle = useRef('');

  useEffect(() => {
    baseTitle.current = document.title;
    return () => { document.title = baseTitle.current; };
  }, []);

  const unread = (data?.rooms ?? []).reduce((a, r) => a + (r.unread || 0), 0);

  const push = (t) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p.slice(-2), { ...t, id }]); // en fazla üç bildirim
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 6000);
    try { navigator.vibrate?.(60); } catch {}
  };

  // Yeni istek / yeni mesaj farkı: ilk yüklemede sessiz kalınır, sonraki değişimlerde bildirilir.
  useEffect(() => {
    if (!data) return;
    const first = seenReq.current === null;
    if (first) { seenReq.current = new Set(); roomStamp.current = new Map(); }

    for (const r of data.requestsIn ?? []) {
      if (!first && !seenReq.current.has(r.id) && !open) {
        push({
          kind: 'request',
          title: 'Sohbet isteği',
          body: `${r.from.nick} (Masa ${r.from.tbl.replace('masa-', '')}) sohbet etmek istiyor.`,
          go: () => { setOpen(true); setRoom(0); },
        });
      }
      seenReq.current.add(r.id);
    }

    for (const r of data.rooms ?? []) {
      const prev = roomStamp.current.get(r.id);
      if (r.last && !r.last.mine && !first && (!prev || prev < r.last.at) && (!open || room !== r.id)) {
        push({
          kind: 'message',
          title: `${r.peer.nick} · Masa ${r.peer.tbl.replace('masa-', '')}`,
          body: r.last.body,
          go: () => { setOpen(true); setRoom(r.id); },
        });
      }
      if (r.last) roomStamp.current.set(r.id, r.last.at);
    }
  }, [data, open, room]);

  // Sekme başlığında bekleyen bildirim sayısı.
  useEffect(() => {
    const n = unread + (data?.requestsIn?.length || 0);
    document.title = n > 0 ? `(${n}) ${baseTitle.current}` : baseTitle.current;
  }, [unread, data?.requestsIn]);

  const peer = data?.rooms?.find((r) => r.id === room)?.peer;

  return (
    <>
      {toasts.length > 0 && (
        <div className="sh-toasts" aria-live="polite">
          {toasts.map((t) => (
            <button
              key={t.id}
              className="sh-toast"
              onClick={() => { t.go(); setToasts((p) => p.filter((x) => x.id !== t.id)); }}
            >
              <span className="sh-toast-avatar" aria-hidden="true">
                {t.kind === 'request' ? '?' : t.title.slice(0, 1).toUpperCase()}
              </span>
              <span className="sh-toast-body">
                <b>{t.title}</b>
                <small>{t.body}</small>
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        className="sh-fab"
        aria-label={unread > 0 ? `Sohbet, ${unread} okunmamış mesaj` : 'Masalarla sohbet'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3C6.9 3 3 6.4 3 10.7c0 2 1 3.9 2.6 5.2L5 21l4.3-2c.9.2 1.8.4 2.7.4 5.1 0 9-3.4 9-7.7S17.1 3 12 3Z" />
          <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
        </svg>
        {unread > 0 && <span className="sh-fab-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="sh-sheet" role="dialog" aria-label="Masalar arası sohbet">
          <header className="sh-sheet-top">
            {room > 0 && (
              <button className="sh-sheet-btn" onClick={() => setRoom(0)} aria-label="Sohbetlere dön">←</button>
            )}
            <div className="sh-sheet-title">
              {room > 0 ? (
                <>
                  <b>{peer?.nick ?? 'Sohbet'}</b>
                  <small>
                    {peer && <><span className={`sh-dot ${peer.online ? 'on' : ''}`} /> {peer.tbl.replace('masa-', 'Masa ')} · {peer.online ? 'çevrimiçi' : 'çevrimdışı'}</>}
                  </small>
                </>
              ) : (
                <>
                  <b>Sohbet</b>
                  <small>Masa {no} · masalarla tanışın</small>
                </>
              )}
            </div>
            <button className="sh-sheet-btn" onClick={() => setOpen(false)} aria-label="Sohbeti kapat">✕</button>
          </header>

          <div className="sh-sheet-body">
            {!live && <p className="sh-banner" role="status">Bağlantı koptu, yeniden deniyor…</p>}
            {error ? (
              <div className="sh">
                <div className="sh-card sh-block">
                  <b>Sohbet açılamadı</b>
                  <p>{error}</p>
                  <button className="btn primary" onClick={retry}>Yeniden dene</button>
                </div>
              </div>
            ) : !data ? (
              <div className="sh"><p className="sh-empty">Sohbet hazırlanıyor…</p></div>
            ) : room > 0 ? (
              <ChatRoom
                roomId={room}
                data={data}
                messages={messages}
                busy={busy}
                act={act}
                onBack={() => setRoom(0)}
              />
            ) : (
              <ChatHub data={data} busy={busy} act={act} onOpenRoom={(id) => setRoom(id)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
