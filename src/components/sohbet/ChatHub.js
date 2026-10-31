'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useChat from './useChat';

const ago = (at) => {
  const s = Math.max(0, Math.round((Date.now() - Number(at || 0)) / 1000));
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`;
  return `${Math.floor(s / 86400)} gün önce`;
};

const initials = (nick) => String(nick || '?').slice(0, 1).toUpperCase();

// Sohbet ana ekranı: profil, gelen/giden istekler, aktif sohbetler ve aynı mekândaki masalar.
export default function ChatHub({ cafe, masa, no }) {
  const base = `/${cafe}/${masa}/sohbet`;
  const router = useRouter();
  const { data, error, live, busy, act, retry } = useChat({ cafe, masa });
  const [nick, setNick] = useState('');
  const [bio, setBio] = useState('');
  const [edit, setEdit] = useState(false);
  const [note, setNote] = useState('');

  const me = data?.me;

  useEffect(() => {
    if (me && !edit) { setNick(me.nick); setBio(me.bio ?? ''); }
  }, [me, edit]);

  // Okunmamış mesaj sayısı sekme başlığında görünür.
  useEffect(() => {
    const n = (data?.rooms ?? []).reduce((a, r) => a + (r.unread || 0), 0);
    document.title = n > 0 ? `(${n}) Sohbet · ${masa.replace('masa-', 'Masa ')}` : 'Sohbet';
    return () => { document.title = 'Sohbet'; };
  }, [data?.rooms, masa]);

  const run = async (fn, okMsg = '') => {
    setNote('');
    const d = await fn();
    if (d?.error) setNote(d.error);
    else if (okMsg) setNote(okMsg);
    return d;
  };

  const request = async (target) => {
    const d = await run(() => act('request', { target }));
    if (d?.roomId) router.push(`${base}/${d.roomId}`);
  };
  const accept = async (id) => {
    const d = await run(() => act('accept', { id }));
    if (d?.roomId) router.push(`${base}/${d.roomId}`);
  };

  return (
    <main className="oh-page sh">
      <header className="sh-top">
        <Link className="oh-back" href={`/${cafe}/${masa}/oyunlar`} aria-label="Oyunlara dön">←</Link>
        <div className="sh-top-title"><b>Sohbet</b><small>Masa {no} · masalarla tanışın</small></div>
        <span className="felt-seat">Masa {no}</span>
      </header>

      {!live && data && <p className="sh-banner" role="status">Bağlantı koptu, yeniden deniyor…</p>}

      {note && <p className="sh-alert" role="alert">{note}</p>}

      {error && (
        <div className="sh-card sh-block">
          <b>Sohbet açılamadı</b>
          <p>{error}</p>
          <button className="btn primary" onClick={retry}>Yeniden dene</button>
        </div>
      )}

      {!data && !error && <p className="sh-empty">Sohbet hazırlanıyor…</p>}

      {data?.disabled && (
        <div className="sh-card sh-block">
          <b>Sohbet şu an kapalı</b>
          <p>Bu mekân sosyal sohbeti geçici olarak kapattı. Oyunlara dönebilirsiniz.</p>
          <Link className="btn primary" href={`/${cafe}/${masa}/oyunlar`}>Oyunlara dön</Link>
        </div>
      )}

      {data && !data.disabled && me && (
        <>
          <section className="sh-card sh-me" aria-label="Profiliniz">
            <div className="sh-avatar" aria-hidden="true">{initials(me.nick)}</div>
            <div className="sh-me-body">
              {edit ? (
                <div className="sh-form">
                  <label>Takma ad<input value={nick} maxLength={24} onChange={(e) => setNick(e.target.value)} /></label>
                  <label>Kısa profil<textarea value={bio} maxLength={140} rows={2} onChange={(e) => setBio(e.target.value)} placeholder="İsterseniz kendinizden bir cümleyle bahsedin." /></label>
                  <div className="sh-row">
                    <button className="btn primary sm" disabled={busy} onClick={async () => {
                      const d = await run(() => act('profile', { nick, bio }), 'Profil güncellendi.');
                      if (!d?.error) setEdit(false);
                    }}>Kaydet</button>
                    <button className="btn sm" onClick={() => setEdit(false)}>İptal</button>
                  </div>
                </div>
              ) : (
                <>
                  <b>{me.nick}</b>
                  <p>{me.bio || 'Kısa profiliniz boş. İsterseniz kendinizi bir cümleyle tanıtın.'}</p>
                  <div className="sh-row">
                    <button className="btn sm" onClick={() => setEdit(true)}>Profili düzenle</button>
                    <button
                      className={`sh-open ${me.status === 'active' ? 'on' : ''}`}
                      aria-pressed={me.status === 'active'}
                      disabled={busy}
                      onClick={() => run(() => act(me.status === 'active' ? 'pause' : 'open'))}
                    >
                      <span aria-hidden="true" /> {me.status === 'active' ? 'Sohbete açık' : 'Sohbet kapalı'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {data.requestsIn.length > 0 && (
            <section className="sh-sec" aria-labelledby="sh-in">
              <h2 id="sh-in">Gelen istekler <span className="sh-count">{data.requestsIn.length}</span></h2>
              <ul className="sh-list">
                {data.requestsIn.map((r) => (
                  <li key={r.id} className="sh-card sh-item">
                    <div className="sh-avatar sm" aria-hidden="true">{initials(r.from.nick)}</div>
                    <div className="sh-item-body">
                      <b>{r.from.nick}</b>
                      <small>{r.from.tbl.replace('masa-', 'Masa ')} · {ago(r.at)}</small>
                      {r.from.bio && <p>{r.from.bio}</p>}
                    </div>
                    <div className="sh-row">
                      <button className="btn primary sm" disabled={busy} onClick={() => accept(r.id)}>Kabul</button>
                      <button className="btn sm" disabled={busy} onClick={() => run(() => act('reject', { id: r.id }))}>Reddet</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.requestsOut.length > 0 && (
            <section className="sh-sec" aria-labelledby="sh-out">
              <h2 id="sh-out">Gönderilen istekler</h2>
              <ul className="sh-list">
                {data.requestsOut.map((r) => (
                  <li key={r.id} className="sh-card sh-item">
                    <div className="sh-avatar sm" aria-hidden="true">{initials(r.to.nick)}</div>
                    <div className="sh-item-body">
                      <b>{r.to.nick}</b>
                      <small>{r.to.tbl.replace('masa-', 'Masa ')} · yanıt bekleniyor</small>
                    </div>
                    <button className="btn sm" disabled={busy} onClick={() => run(() => act('cancel', { id: r.id }))}>Vazgeç</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="sh-sec" aria-labelledby="sh-rooms">
            <h2 id="sh-rooms">Sohbetler {data.rooms.length > 0 && <span className="sh-count">{data.rooms.length}</span>}</h2>
            {data.rooms.length === 0 ? (
              <p className="sh-empty">Henüz aktif sohbetiniz yok. Aşağıdan bir masaya istek gönderin.</p>
            ) : (
              <ul className="sh-list">
                {data.rooms.map((r) => (
                  <li key={r.id}>
                    <Link className="sh-card sh-item sh-room" href={`${base}/${r.id}`}>
                      <div className="sh-avatar sm" aria-hidden="true">{initials(r.peer.nick)}</div>
                      <div className="sh-item-body">
                        <b>{r.peer.nick} <span className={`sh-dot ${r.peer.online ? 'on' : ''}`} title={r.peer.online ? 'Çevrimiçi' : 'Çevrimdışı'} /></b>
                        <small>{r.peer.tbl.replace('masa-', 'Masa ')}</small>
                        <p>{r.last ? `${r.last.mine ? 'Siz: ' : ''}${r.last.body}` : 'Sohbet başladı, ilk mesajı siz yazın.'}</p>
                      </div>
                      {r.unread > 0 && <span className="sh-unread" aria-label={`${r.unread} okunmamış mesaj`}>{r.unread}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="sh-sec" aria-labelledby="sh-tables">
            <h2 id="sh-tables">Masalar</h2>
            {data.tables.length === 0 ? (
              <p className="sh-empty">
                Şu an sohbet edecek başka masa yok. Arkadaşlarınız da masasındaki karekodu okutursa burada görünür.
              </p>
            ) : (
              <ul className="sh-list">
                {data.tables.map((t) => (
                  <li key={t.id} className="sh-card sh-item">
                    <div className="sh-avatar sm" aria-hidden="true">{initials(t.nick)}</div>
                    <div className="sh-item-body">
                      <b>{t.nick} <span className={`sh-dot ${t.online ? 'on' : ''}`} title={t.online ? 'Çevrimiçi' : 'Çevrimdışı'} /></b>
                      <small>{t.tbl.replace('masa-', 'Masa ')}{t.bio ? ` · ${t.bio}` : ''}</small>
                    </div>
                    {t.room ? (
                      <Link className="btn primary sm" href={`${base}/${t.room}`}>Sohbete git</Link>
                    ) : t.request === 'out' ? (
                      <span className="sh-tag">İstek gönderildi</span>
                    ) : t.request === 'in' ? (
                      <button className="btn primary sm" disabled={busy} onClick={() => {
                        const r = data.requestsIn.find((x) => x.from.id === t.id);
                        if (r) accept(r.id);
                      }}>Kabul et</button>
                    ) : (
                      <button className="btn sm" disabled={busy || me.status !== 'active'} onClick={() => request(t.id)}>
                        {data.settings.open_mode ? 'Sohbet aç' : 'Sohbet iste'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="sh-note">
            Sohbetler yalnızca bu mekândaki masalarla sınırlıdır. İstemediğiniz biri yazarsa onu engelleyebilir
            veya işletmeye bildirebilirsiniz. Mesajlar saklama süresi dolunca silinir.
          </p>
        </>
      )}

      <footer className="oh-foot"><Link href="/">oyunhadi</Link> ile tanışılıyor</footer>
    </main>
  );
}
