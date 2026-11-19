import { Plan } from "@/types";
import ServicePrice from './ServicePrice';

interface PlanCardProps {
  plan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

export default function PlanCard({ plan, onSelectPlan }: PlanCardProps) {
  const p = plan;
  const title = p.displayName || 'Paket';
  const desc = p.description || '';
  const featured = !!p.isFeatured;

  return (
    <article className="card" role="listitem">
      {featured ? <span className="badge">Najpopularnije</span> : ''}
      <h3>{title}</h3>
      <p className="desc">{desc}</p>
      <ServicePrice price={p.price} netPrice={p.netPrice} basePrice={p.basePrice} />
      <div className="rtx">
        {p.features.map((feature, index) => <p key={index}>{feature}</p>)}
      </div>
      {p.note && <p className="fine">{p.note}</p>}
      <div className="cta flex flex-col sm:flex-row gap-2">
        <button onClick={() => onSelectPlan(plan)} className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0">Zatraži ponudu</button>
      </div>
    </article>
  );
}
