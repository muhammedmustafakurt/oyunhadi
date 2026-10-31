import GameFace from '@/components/oyun/GameFace';
import { SPINE } from '@/lib/spines';

// Bir masanın oyun akışı, mesajlaşma görünümünde (tanıtım görseli; avatarlar oyun karakterleri).
function Av({ id }: { id: string }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: SPINE[id][0] }}>
      <GameFace id={id} className="h-9 w-9" />
    </span>
  );
}

function Msg({ av, who, text, me = false, delay }: { av: string; who: string; text: string; me?: boolean; delay: number }) {
  return (
    <div className={`chat-in flex items-end gap-2.5 ${me ? 'flex-row-reverse' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <Av id={av} />
      <div className={`max-w-[280px] px-3.5 py-2.5 text-[15px] ${me ? 'rounded-[18px_18px_4px_18px] bg-grape text-white' : 'rounded-[18px_18px_18px_4px] bg-[#f3f0fb]'}`}>
        <small className={`block text-xs font-extrabold ${me ? 'text-[#e3d6ff]' : 'text-grape'}`}>{who}</small>
        {text}
      </div>
    </div>
  );
}

export default function TableChat() {
  return (
    <div className="rounded-[28px] border border-[#e3dbf7] bg-white p-5 shadow-[0_30px_60px_-30px_rgba(76,29,149,.45)]" aria-label="Örnek masa sohbeti">
      <div className="mb-4 flex items-center gap-2.5 border-b border-[#eee8fb] pb-3.5">
        <Av id="tabu" />
        <div>
          <p className="font-display text-lg leading-tight font-extrabold">Masa 5 · Tabu</p>
          <p className="text-[13px] text-[#8a80a3]">Hadi Kafe · 4 kişi</p>
        </div>
        <span className="ml-auto h-2.5 w-2.5 animate-pulse rounded-full bg-leaf" />
      </div>
      <div className="grid gap-3">
        <Msg av="bil" who="Ayşe" text="Tabu'yu açtım, karekodu okutup katılın!" delay={100} />
        <Msg av="spyfall" who="Mert" text="Geliyorum, kırmızı takım benim." me delay={500} />
        <p className="chat-in text-center text-[13px] text-[#8a80a3]" style={{ animationDelay: '900ms' }}><b className="text-ink">Zeynep</b> ve <b className="text-ink">Can</b> masaya katıldı · Oyun başladı</p>
        <Msg av="kimim" who="Zeynep" text="12 – 9 öndeyiz, pas hakkımız bitti!" delay={1300} />
        <div className="chat-in flex items-center gap-3 rounded-2xl border-[2.5px] border-ink bg-sun p-3" style={{ animationDelay: '1700ms' }}>
          <GameFace id="bil" className="h-10 w-10 shrink-0" />
          <div>
            <p className="font-display leading-tight font-extrabold">Ödül kazandınız</p>
            <p className="text-[13px]">1 tatlı ikram · garsona gösterin</p>
          </div>
          <code className="ml-auto rounded-lg bg-ink px-2.5 py-1.5 text-sm font-extrabold tracking-wider text-sun">HK-7Q4M</code>
        </div>
      </div>
    </div>
  );
}
