import { reviews } from '../lib/reviews';

export default function Reviews() {
  if (reviews.length === 0) return null;

  return (
    <section className="section-pad bg-white" id="reviews">
      <div className="centered-content">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What students say</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.slice(0, 3).map((r) => (
            <figure key={`${r.firstName}-${r.course}`} className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50">
              <blockquote className="text-slate-700 leading-relaxed mb-6">“{r.quote}”</blockquote>
              <figcaption className="text-sm font-semibold text-slate-900">
                {r.firstName} <span className="text-slate-400 font-normal">· {r.course}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
