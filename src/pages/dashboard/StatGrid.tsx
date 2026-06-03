import { Activity, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";

export function StatGrid({
  stats,
  links,
}: {
  stats: Record<string, number>;
  links?: Record<string, string>;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(stats).map(([key, value]) => {
        const href = links?.[key];
        const content = (
          <Card
            className={`p-6 rounded-2xl border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all bg-gradient-to-br from-white to-slate-50/50 h-full ${href ? "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/30 group cursor-pointer" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">
                {key.replace(/([A-Z])/g, " $1")}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-2">
              <div className="text-4xl font-extrabold text-slate-900">
                {value}
              </div>
              {href && (
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors mb-1" />
              )}
            </div>
          </Card>
        );

        return href ? (
          <Link
            key={key}
            to={href}
            className="block outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
          >
            {content}
          </Link>
        ) : (
          <div key={key} className="h-full">
            {content}
          </div>
        );
      })}
    </div>
  );
}
