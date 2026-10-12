import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, HeartHandshake, Compass } from "lucide-react";

const Ideology = () => {
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Foundational Principles"
            title="Ideological Focus"
            subtitle="Prioritizing social cohesion, cultural preservation, and non-political community strength."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-feature-cream">
              <Shield className="text-coral mb-3" size={24} />
              <h3 className="font-serif text-lg text-ink mb-2">Social Discipline</h3>
              <p className="text-xs text-body leading-relaxed">
                Fostering individual character and collective responsibility for community welfare.
              </p>
            </div>
            <div className="card-feature-cream">
              <HeartHandshake className="text-coral mb-3" size={24} />
              <h3 className="font-serif text-lg text-ink mb-2">Non-Political Service</h3>
              <p className="text-xs text-body leading-relaxed">
                Directing energy toward humanitarian service and cultural assemblies rather than party politics.
              </p>
            </div>
            <div className="card-feature-cream">
              <Compass className="text-coral mb-3" size={24} />
              <h3 className="font-serif text-lg text-ink mb-2">Cultural Continuity</h3>
              <p className="text-xs text-body leading-relaxed">
                Upholding traditional festivals, spiritual values, and educational foundations across generations.
              </p>
            </div>
          </div>

          <div className="card-feature-cream space-y-6 mb-12">
            <h2 className="font-serif text-2xl text-ink">
              Foundational Philosophy
            </h2>
            <p className="text-sm text-body leading-relaxed">
              The ideological foundation of Maha Seva Dal was centered on the belief that a strong and organized Hindu society was essential for the stability and progress of independent India. The organization prioritized social and cultural cohesion over political participation, emphasizing long-term community building.
            </p>
            <p className="text-sm text-body leading-relaxed">
              This focus shaped MSD's early development and defined its role as a social and cultural organization rooted in ideology rather than political action.
            </p>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-hairline">
            <Link to="/origins" className="text-xs font-semibold text-muted-editorial hover:text-coral">
              ← Back to 1947 Origins
            </Link>
            <Link to="/partition" className="text-xs font-semibold text-coral hover:underline inline-flex items-center gap-1">
              <span>Read Partition Relief</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Ideology;
