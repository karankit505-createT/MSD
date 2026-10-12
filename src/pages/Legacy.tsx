import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Network, Sparkles } from "lucide-react";

const Legacy = () => {
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Post-Independence Development"
            title="Growth and Legacy"
            subtitle="Network expansion, cultural continuity, and modern social service initiatives."
          />

          <div className="card-feature-cream space-y-6 text-body text-base leading-relaxed font-sans mb-12">
            <h2 className="font-serif text-2xl text-ink">
              Institutional Expansion
            </h2>
            <p>
              Following India's independence, Maha Seva Dal expanded its activities through the establishment of shakhas (branches) and a broad network of affiliated organizations. These included educational programs, women's forums, and youth student groups, aimed at strengthening social engagement and cultural continuity.
            </p>
            <p>
              Through its origins, ideological focus, role during Partition, and post-independence expansion, Maha Seva Dal developed into a significant social and cultural organization in independent India. Over time, it came to be regarded as a major cultural force grounded in social organization rather than political participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="tile-connector">
              <Network className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Branch Network</h3>
              <p className="text-xs text-muted-editorial">
                Widespread shakhas (local chapters) promoting daily physical and social discipline.
              </p>
            </div>
            <div className="tile-connector">
              <Sparkles className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Cultural Assemblies</h3>
              <p className="text-xs text-muted-editorial">
                Annual celebrations including Guru Poornima food drives and Mahashivratri jagarans.
              </p>
            </div>
            <div className="tile-connector">
              <Award className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Youth Leadership</h3>
              <p className="text-xs text-muted-editorial">
                Continuous training of selfless community volunteers and nation-building leaders.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-hairline">
            <Link to="/partition" className="text-sm text-muted-editorial hover:text-ink">
              ← Previous: Partition Period
            </Link>
            <Link to="/events" className="btn-primary-coral text-xs">
              <span>Explore Modern Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Legacy;
