import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, MapPin } from "lucide-react";

const Origins = () => {
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="1947 Historical Record"
            title="Origins and Foundation"
            subtitle="The historic emergence of Maha Seva Dal during India's transition to independence."
          />

          {/* Key Facts Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="tile-connector text-center">
              <Calendar className="mx-auto text-coral mb-2" size={20} />
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Founding Year</div>
              <div className="font-serif text-xl text-ink font-normal mt-1">1947</div>
            </div>
            <div className="tile-connector text-center">
              <User className="mx-auto text-coral mb-2" size={20} />
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Founder</div>
              <div className="font-serif text-xl text-ink font-normal mt-1">Saragabani Gopu</div>
            </div>
            <div className="tile-connector text-center">
              <MapPin className="mx-auto text-coral mb-2" size={20} />
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Initial Scope</div>
              <div className="font-serif text-xl text-ink font-normal mt-1">National & Social</div>
            </div>
          </div>

          {/* Main Editorial Text */}
          <div className="card-feature-cream space-y-6 text-body text-base leading-relaxed font-sans mb-12">
            <h2 className="font-serif text-2xl text-ink">
              Emergence During National Transition
            </h2>
            <p>
              Maha Seva Dal emerged during a defining moment in India's history, as the country moved toward independence in 1947. In this period of national transition, the organization directed its efforts toward the organization and strengthening of Hindu society, viewing social cohesion as a necessary foundation for an independent nation.
            </p>
            <p>
              Rather than engaging in direct anti-British political movements, MSD maintained a non-political stance during the freedom struggle. Its focus remained on cultural organization, social discipline, and community structure, guided by the belief that long-term national stability depended on a strong and unified social framework.
            </p>
            <blockquote className="border-l-2 border-coral pl-4 py-2 font-serif text-xl text-ink italic my-6 bg-canvas/60 rounded-r-md">
              "Long-term national stability depends upon a disciplined, compassionate, and culturally rooted social framework."
            </blockquote>
            <p>
              Founder Saragabani Gopu established the organization with a focus on selflessness, community service, and physical discipline among youth, forming early assemblies across key states.
            </p>
          </div>

          {/* Bottom Navigation links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-hairline">
            <Link to="/" className="text-sm text-muted-editorial hover:text-ink">
              ← Return to Home
            </Link>
            <Link to="/ideology" className="btn-primary-coral text-xs">
              <span>Next: Ideology & Principles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Origins;
