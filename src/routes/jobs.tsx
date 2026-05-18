import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PageContainer, PageHeader, PageSection, TabNav } from "@/components/layout";
import { SplitLayout } from "@/components/layout/split-layout";
import { Briefcase } from "lucide-react";
import { JobsSidebar } from "@/components/jobs/jobs-sidebar";
import { JobEditor } from "@/components/jobs/job-editor";
import { OffersSidebar } from "@/components/jobs/offers-sidebar";
import { OfferEditor } from "@/components/jobs/offer-editor";
import { ServicesSidebar } from "@/components/jobs/services-sidebar";
import { ServiceEditor } from "@/components/jobs/service-editor";
import type { SavedJob, FreelanceOffer, MyService } from "@/components/jobs/types";

const searchSchema = z.object({ tab: z.enum(["jobs", "offers", "services"]).optional() });

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs & Freelance — Dev Studio" }] }),
  validateSearch: searchSchema,
  component: JobsPage,
});

const TABS = [
  { id: "jobs",     label: "Jobs" },
  { id: "offers",   label: "Offers" },
  { id: "services", label: "Services" },
] as const;

function mapJob(x: any): SavedJob {
  return {
    id: x.id, title: x.title, company: x.company ?? "", location: x.location ?? "",
    url: x.url ?? "", platform: x.platform ?? "", status: x.status ?? "saved",
    salary: x.salary ?? "", remote: x.remote ?? false, tags: x.tags ?? [],
    notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
  };
}
function mapOffer(x: any): FreelanceOffer {
  return {
    id: x.id, title: x.title, client: x.client ?? "", platform: x.platform ?? "",
    budget: x.budget ?? "", currency: x.currency ?? "USD", status: x.status ?? "new",
    description: x.description ?? "", url: x.url ?? "", deadline: x.deadline ?? "",
    tags: x.tags ?? [], notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
  };
}
function mapService(x: any): MyService {
  return {
    id: x.id, title: x.title, platform: x.platform ?? "", url: x.url ?? "",
    category: x.category ?? "", price: x.price ?? "", currency: x.currency ?? "USD",
    status: x.status ?? "active", description: x.description ?? "",
    deliveryDays: x.delivery_days ?? 3, tags: x.tags ?? [], notes: x.notes ?? "",
    createdAt: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
    updatedAt: x.updated_at ? new Date(x.updated_at).getTime() : Date.now(),
  };
}


function JobsPage() {
  const { tab = "jobs" } = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs" });

  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [offers, setOffers] = useState<FreelanceOffer[]>([]);
  const [services, setServices] = useState<MyService[]>([]);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState(false);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const r = await fetch("/api/jobs/saved");
      if (r.ok) setJobs((await r.json()).map(mapJob));
    } catch {}
  }, []);

  const loadOffers = useCallback(async () => {
    try {
      const r = await fetch("/api/jobs/offers");
      if (r.ok) setOffers((await r.json()).map(mapOffer));
    } catch {}
  }, []);

  const loadServices = useCallback(async () => {
    try {
      const r = await fetch("/api/jobs/services");
      if (r.ok) setServices((await r.json()).map(mapService));
    } catch {}
  }, []);

  useEffect(() => { loadJobs(); loadOffers(); loadServices(); }, [loadJobs, loadOffers, loadServices]);

  useEffect(() => {
    setActiveJobId(null); setNewJob(false);
    setActiveOfferId(null); setNewOffer(false);
    setActiveServiceId(null); setNewService(false);
  }, [tab]);

  const handleSaveJob = async (data: Partial<SavedJob>) => {
    const body = activeJobId ? { ...data, id: activeJobId } : data;
    const r = await fetch("/api/jobs/saved", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) { toast.error("Failed to save."); return; }
    const saved = mapJob(await r.json());
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j.id === saved.id);
      return idx >= 0 ? prev.map((j) => j.id === saved.id ? saved : j) : [...prev, saved];
    });
    setActiveJobId(saved.id);
    setNewJob(false);
    toast.success("Job saved!");
  };

  const handleDeleteJob = async (id: string) => {
    await fetch(`/api/jobs/saved/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setActiveJobId(null);
    setNewJob(false);
    toast.success("Job removed.");
  };

  const handleSaveOffer = async (data: Partial<FreelanceOffer>) => {
    const body = activeOfferId ? { ...data, id: activeOfferId } : data;
    const r = await fetch("/api/jobs/offers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) { toast.error("Failed to save."); return; }
    const saved = mapOffer(await r.json());
    setOffers((prev) => {
      const idx = prev.findIndex((o) => o.id === saved.id);
      return idx >= 0 ? prev.map((o) => o.id === saved.id ? saved : o) : [...prev, saved];
    });
    setActiveOfferId(saved.id);
    setNewOffer(false);
    toast.success("Offer saved!");
  };

  const handleDeleteOffer = async (id: string) => {
    await fetch(`/api/jobs/offers/${id}`, { method: "DELETE" });
    setOffers((prev) => prev.filter((o) => o.id !== id));
    setActiveOfferId(null);
    setNewOffer(false);
    toast.success("Offer removed.");
  };

  const handleSaveService = async (data: Partial<MyService>) => {
    const body = activeServiceId ? { ...data, id: activeServiceId } : data;
    const r = await fetch("/api/jobs/services", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) { toast.error("Failed to save."); return; }
    const saved = mapService(await r.json());
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      return idx >= 0 ? prev.map((s) => s.id === saved.id ? saved : s) : [...prev, saved];
    });
    setActiveServiceId(saved.id);
    setNewService(false);
    toast.success("Service saved!");
  };

  const handleDeleteService = async (id: string) => {
    await fetch(`/api/jobs/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
    setActiveServiceId(null);
    setNewService(false);
    toast.success("Service removed.");
  };

  const activeJob     = jobs.find((j) => j.id === activeJobId) ?? null;
  const activeOffer   = offers.find((o) => o.id === activeOfferId) ?? null;
  const activeService = services.find((s) => s.id === activeServiceId) ?? null;

  return (
    <PageContainer className="overflow-hidden">
      <PageSection>
        <PageHeader
          icon={Briefcase}
          eyebrow="Freelance"
          title="Jobs & Freelance"
          className="mb-4"
        />
        <TabNav
          tabs={[
            { id: "jobs",     label: "Jobs",     badge: jobs.length || undefined,     onClick: () => navigate({ search: { tab: "jobs" } }) },
            { id: "offers",   label: "Offers",   badge: offers.length || undefined,   onClick: () => navigate({ search: { tab: "offers" } }) },
            { id: "services", label: "Services", badge: services.length || undefined, onClick: () => navigate({ search: { tab: "services" } }) },
          ]}
          activeTab={tab}
        />
      </PageSection>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "jobs" && (
          <SplitLayout
            sidebar={
              <JobsSidebar
                jobs={jobs}
                activeId={activeJobId}
                onSelect={(id) => { setActiveJobId(id); setNewJob(false); }}
                onAdd={() => { setActiveJobId(null); setNewJob(true); }}
              />
            }
          >
            <JobEditor
              job={activeJob}
              isNew={newJob}
              onSave={handleSaveJob}
              onDelete={handleDeleteJob}
              onSaveRemote={handleSaveJob}
              onBack={() => { setActiveJobId(null); setNewJob(false); }}
            />
          </SplitLayout>
        )}

        {tab === "offers" && (
          <SplitLayout
            sidebar={
              <OffersSidebar
                offers={offers}
                activeId={activeOfferId}
                onSelect={(id) => { setActiveOfferId(id); setNewOffer(false); }}
                onAdd={() => { setActiveOfferId(null); setNewOffer(true); }}
              />
            }
          >
            <OfferEditor
              offer={activeOffer}
              isNew={newOffer}
              onSave={handleSaveOffer}
              onDelete={handleDeleteOffer}
            />
          </SplitLayout>
        )}

        {tab === "services" && (
          <SplitLayout
            sidebar={
              <ServicesSidebar
                services={services}
                activeId={activeServiceId}
                onSelect={(id) => { setActiveServiceId(id); setNewService(false); }}
                onAdd={() => { setActiveServiceId(null); setNewService(true); }}
              />
            }
          >
            <ServiceEditor
              service={activeService}
              isNew={newService}
              onSave={handleSaveService}
              onDelete={handleDeleteService}
            />
          </SplitLayout>
        )}
      </div>
    </PageContainer>
  );
}
