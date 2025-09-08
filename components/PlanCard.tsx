import { blocksToHtml } from "@/lib/blocksToHtml";
import { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

export default function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const p = plan.attributes || plan;
  const title = p.displayName || 'Paket';
  const slug = p.uidName || title;
  const desc = p.description || '';
  const fmt = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const price = (typeof p.price === 'number') ? fmt.format(p.price).replace(',00', '') : (p.price ?? 'Po dogovoru');
  const suffix = p.pricesufix ? `<small>${p.pricesufix}</small>` : '';
  const featured = !!p.isFeatured;
  const note = p.note ? `<p class="fine">${p.note}</p>` : '';
  const featuresHTML = p.features ? `<div class="rtx">${blocksToHtml(p.features)}</div>` : '';

  return (
    <article className="card" role="listitem">
      {featured ? <span className="badge">Najpopularnije</span> : ''}
      <h3>{title}</h3>
      <p className="desc">{desc}</p>
      <div className="price"><div className="amount" dangerouslySetInnerHTML={{ __html: price }}></div><div dangerouslySetInnerHTML={{ __html: suffix }}></div></div>
      <div dangerouslySetInnerHTML={{ __html: featuresHTML }}></div>
      <div dangerouslySetInnerHTML={{ __html: note }}></div>
      <div className="cta flex flex-col sm:flex-row gap-2">
        <button onClick={() => onSelectPlan(plan)} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0">Zatraži ponudu</button>
      </div>
    </article>
  );
}
