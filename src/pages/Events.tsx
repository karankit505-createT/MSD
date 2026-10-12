import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Users, Heart, Utensils, Flame } from "lucide-react";

const eventCards = [
  {
    path: "/events/guru-poornima",
    appointmentPath: "/appointment/guru-poornima-2025",
    icon: Utensils,
    category: "food",
    title: "Guru Poornima Celebration & Mahaprasadam",
    date: "July 2025",
    guest: "Shri Sanjay Nirmal",
    role: "BJP National General Secretary, SC Morcha",
    summary:
      "A large-scale food distribution drive for underprivileged communities, highlighting MSD's commitment to Hindutva, cultural heritage, and educational empowerment.",
    tags: ["Social Welfare", "Cultural Identity", "Education"],
  },
  {
    path: "/events/mahashivratri",
    appointmentPath: "/appointment/mahashivratri-2025",
    icon: Flame,
    category: "cultural",
    title: "Mahashivratri Jagaran & Cultural Assembly",
    date: "September 2025",
    guest: "Shri Dr. Chuba Ao",
    role: "BJP National Vice President",
    summary:
      "A grand celebration at T. Nagar Hall, Chennai, featuring distribution of assistive devices to persons with disabilities and honouring 30 years of tribal service in Nagaland.",
    tags: ["Philanthropy", "Sports & Youth", "Heritage"],
  },
];

const Events = () => {
  const [activeTab, setActiveTab] = useState<"all" | "cultural" | "food">("all");

  const filteredEvents = eventCards.filter((ev) => {
    if (activeTab === "all") return true;
    return ev.category === activeTab;
  });

  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Assemblies & Celebrations"
            title="Our Major Events & Activities"
            subtitle="Celebrations of culture, social service, and community unity organised by Maha Seva Dal."
          />

          {/* Category Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 p-1.5 bg-surface-soft border border-hairline rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === "all"
                    ? "bg-canvas shadow-sm text-ink font-semibold border border-hairline"
                    : "text-muted-editorial hover:text-ink"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveTab("cultural")}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === "cultural"
                    ? "bg-canvas shadow-sm text-ink font-semibold border border-hairline"
                    : "text-muted-editorial hover:text-ink"
                }`}
              >
                Cultural Assemblies
              </button>
              <button
                onClick={() => setActiveTab("food")}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === "food"
                    ? "bg-canvas shadow-sm text-ink font-semibold border border-hairline"
                    : "text-muted-editorial hover:text-ink"
                }`}
              >
                Food Drives
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredEvents.map((ev) => {
              const IconComp = ev.icon;
              return (
                <div key={ev.path} className="card-feature-cream flex flex-col justify-between animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-coral font-semibold text-sm">
                        <IconComp size={18} />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex gap-2">
                        {ev.tags.map((t) => (
                          <span key={t} className="badge-pill-cream text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="font-serif text-2xl text-ink mb-3">{ev.title}</h2>
                    <p className="text-xs text-body leading-relaxed mb-6">{ev.summary}</p>

                    {/* Guest Box */}
                    <div className="p-4 rounded-lg bg-canvas border border-hairline mb-6">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-coral mb-1">
                        Chief Guest
                      </div>
                      <div className="text-sm font-semibold text-ink">{ev.guest}</div>
                      <div className="text-xs text-muted-editorial">{ev.role}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-hairline">
                    <Link to={ev.path} className="btn-primary-coral text-xs justify-center">
                      <span>View Full Event Program</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Events;
