'use client';
import { useEffect, useRef, useState } from 'react';

const clock = (at) => new Date(Number(at)).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

// İki masa arasındaki özel sohbet içeriği. Panelde (ChatWidget) çizilir; oda kimliği sunucuda
// katılımcıya göre doğrulanır, mesajlar 2 sn'de bir yoklanır, gönderim iyimser gösterilir.
export default function ChatRoom({ roomId, data, messages, busy, act, onBack }) {
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState([]);
  const [note, setNote] = useState('');
  const [menu, setMenu] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState('');
  const listRef = useRef(null);

  const current = data?.current;
  const peer = data?.rooms?.find((r) => r.id === roomId)?.peer;
  const closed = !!data && (!current || current.status !== 'active');

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pending.length]);

  const send = async (text, tmp) => {
    const body = String(text).replace(/\s+/g, ' ').trim().slice(0, 500);
    if (!body) return;
    setNote('');
    const d = await act('send', { room: roomId, body });
    if (d?.error) {
      setPending((p) => p.map((m) => (m.tmp === tmp ? { ...m, failed: true, error: d.error } : m)));
    } else {
      setPending((p) => p.filter((m) => m.tmp !== tmp));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    const tmp = Date.now() + Math.random();
    setPending((p) => [...p, { tmp, body }]);
    setDraft('');
    send(body, tmp);
  };

  const block = async () => {
    if (!peer) return;
    if (!window.confirm(`${peer.nick} adlı kişiyi engellemek istiyor musunuz? Yeni istek ve mesaj gönderemez.`)) return;
    const d = await act('block', { target: peer.id });
    if (d?.error) setNote(d.error);
    else onBack();
  };

  const close = async () => {
    const d = await act('close', { room: roomId });
    if (d?.error) setNote(d.error);
    else onBack();
  };

  const reportIt = async () => {
    if (!peer) return;
    const d = await act('report', { target: peer.id, room: roomId, reason });
    if (d?.error) setNote(d.error);
    else { setReport(false); setReason(''); setNote('Bildiriminiz işletmeye iletildi.'); }
  };

  if (closed) {
    return (
      <div className="sh">
        <div className="sh-card sh-block">
          <b>Bu sohbet kapandı</b>
          <p>Sohbet sona erdi. Yeni bir sohbet için masalara göz atabilirsiniz.</p>
          <button className="btn primary" onClick={onBack}>Sohbete dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sh-chat">
      {note && <p className="sh-alert" role="alert">{note}</p>}

      <div className="sh-chat-bar">
        <button
          className="sh-menu-btn"
          aria-label="Sohbet seçenekleri"
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >⋯</button>
        {menu && (
          <div className="sh-menu" role="menu">
            <button role="menuitem" disabled={busy} onClick={close}>Sohbeti bitir</button>
            <button role="menuitem" className="danger" disabled={busy} onClick={block}>Engelle</button>
            <button role="menuitem" onClick={() => { setReport(true); setMenu(false); }}>İşletmeye bildir</button>
          </div>
        )}
      </div>

      {report && (
        <div className="sh-card sh-block">
          <b>İşletmeye bildir</b>
          <p>Rahatsız edici mesajları işletme sahibine iletebilirsiniz. Mesaj içeriği kopyalanmaz.</p>
          <textarea value={reason} maxLength={300} rows={3} onChange={(e) => setReason(e.target.value)} placeholder="Ne oldu? Kısaca yazın." />
          <div className="sh-row">
            <button className="btn primary sm" disabled={busy || reason.trim().length < 3} onClick={reportIt}>Gönder</button>
            <button className="btn sm" onClick={() => { setReport(false); setReason(''); }}>Vazgeç</button>
          </div>
        </div>
      )}

      <div className="sh-msgs" ref={listRef} role="log" aria-live="polite" aria-label="Mesajlar">
        {!data && <p className="sh-empty">Mesajlar yükleniyor…</p>}
        {data && messages.length === 0 && pending.length === 0 && (
          <p className="sh-empty">Henüz mesaj yok. İlk mesajı siz yazın.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`sh-msg ${m.mine ? 'mine' : ''}`}>
            <p>{m.body}</p>
            <small>
              {clock(m.at)}
              {m.mine && m.seen && ' · Okundu'}
            </small>
          </div>
        ))}
        {pending.map((m) => (
          <div key={m.tmp} className={`sh-msg mine ${m.failed ? 'failed' : ''}`}>
            <p>{m.body}</p>
            <small>
              {m.failed ? 'Gönderilemedi' : 'Gönderiliyor…'}
              {m.failed && (
                <button className="sh-retry" onClick={() => { setPending((p) => p.filter((x) => x.tmp !== m.tmp)); send(m.body, m.tmp); }}>
                  Tekrar dene
                </button>
              )}
            </small>
          </div>
        ))}
      </div>

      <form className="sh-send" onSubmit={submit}>
        <input
          value={draft}
          maxLength={500}
          placeholder="Mesaj yazın…"
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Mesaj"
          autoComplete="off"
        />
        <button className="btn primary" type="submit" disabled={!draft.trim() || busy}>Gönder</button>
      </form>
    </div>
  );
}
