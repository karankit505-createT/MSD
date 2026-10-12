import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, LifeBuoy, Map, Users } from "lucide-react";

const Partition = () => {
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="1947 Crisis Relief"
            title="Role During the Partition Period"
            subtitle="Humanitarian assistance, community protection, and expansion during post-independence displacement."
          />

          <div className="card-feature-cream space-y-6 text-body text-base leading-relaxed font-sans mb-12">
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy className="text-coral" size={24} />
              <h2 className="font-serif text-2xl text-ink">
                Humanitarian Relief & Protection
              </h2>
            </div>
            
            <p>
              During the period of Partition in 1947, India experienced widespread communal violence and displacement. In this environment of instability, volunteers associated with Maha Seva Dal undertook relief efforts aimed at assisting and protecting Hindu communities affected by the unrest.
            </p>
            <p>
              These activities contributed to the organization's emerging image as a protector of Hindu society during a time of crisis and led to a significant expansion in influence and membership. Maha Seva Dal extended its presence into regions including Delhi, Bihar, and Kashmir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="tile-connector">
              <Map className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Regional Expansion</h3>
              <p className="text-xs text-muted-editorial">
                Establishment of volunteer bases across Delhi, Bihar, Punjab, and Jammu & Kashmir.
              </p>
            </div>
            <div className="tile-connector">
              <Users className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Refugee Assistance</h3>
              <p className="text-xs text-muted-editorial">
                Distribution of essential supplies, food, and temporary shelter during 1947 migrations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-hairline">
            <Link to="/ideology" className="text-sm text-muted-editorial hover:text-ink">
              ← Previous: Ideology
            </Link>
            <Link to="/legacy" className="btn-primary-coral text-xs">
              <span>Next: Growth & Legacy</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Partition;
