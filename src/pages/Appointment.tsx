import { useParams, Navigate, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import appointmentsData from "@/data/appointments.json";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

const Appointment = () => {
  const { id } = useParams<{ id: string }>();
  const appointment = appointmentsData.find((a) => a.id === id);

  if (!appointment) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Official Record"
            title={appointment.region}
            subtitle={
              appointment.type === "team"
                ? `Official State Team Appointment`
                : `Official Appointment for ${appointment.name}`
            }
          />

          <div className="card-feature-cream mb-12">
            
            {appointment.type === "individual" && (
              <div className="border-b border-hairline pb-6 mb-6">
                <span className="badge-coral-fill text-[10px]">Appointed Member</span>
                <h2 className="font-serif text-3xl text-ink mt-2 mb-1">
                  {appointment.name}
                </h2>
                <div className="text-sm font-medium text-coral font-sans">
                  {appointment.role}
                </div>
              </div>
            )}

            <div className="text-body text-base leading-relaxed font-sans mb-8">
              <p>{appointment.description}</p>
            </div>

            {/* Team Members Table */}
            {appointment.type === "team" && appointment.members && (
              <div className="rounded-lg overflow-hidden border border-hairline bg-canvas mb-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline">
                      <th className="py-3 px-4 font-semibold text-ink text-xs uppercase tracking-wider">Member Name</th>
                      <th className="py-3 px-4 font-semibold text-ink text-xs uppercase tracking-wider">Assigned Post</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline text-sm">
                    {appointment.members.map((member: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface-soft transition-colors">
                        <td className="py-3 px-4 font-medium text-ink">{member.name}</td>
                        <td className="py-3 px-4 text-muted-editorial">{member.post}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Responsibilities */}
            {appointment.type === "individual" && appointment.responsibilities && (
              <div className="border-t border-hairline pt-6">
                <h3 className="font-serif text-xl text-ink mb-4">Key Responsibilities</h3>
                <ul className="space-y-3">
                  {appointment.responsibilities.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-body">
                      <CheckCircle2 size={16} className="text-coral flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verification Footer */}
            <div className="mt-8 pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-editorial">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-coral" />
                <span>Verified by Maha Seva Dal Central Secretariat (1947)</span>
              </div>
              <Link to="/events" className="text-coral font-medium hover:underline inline-flex items-center gap-1">
                <span>View State Events</span>
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Appointment;
