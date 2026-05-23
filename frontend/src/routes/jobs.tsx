import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PageContainer, PageHeader, PageSection, TabNav } from "@/components/layout";
import { SplitLayout } from "@/components/layout/split-layout";
import { Briefcase } from "lucide-react";
import { JobsSidebar } from "@/features/jobs/jobs-sidebar";
import { JobEditor } from "@/features/jobs/job-editor";
import { OffersSidebar } from "@/features/jobs/offers-sidebar";
import { OfferEditor } from "@/features/jobs/offer-editor";
import { ServicesSidebar } from "@/features/jobs/services-sidebar";
import { ServiceEditor } from "@/features/jobs/service-editor";
import type { SavedJob, FreelanceOffer, MyService } from "@/features/jobs/types";
import {
  getSavedJobs,
  saveJob,
  deleteSavedJob,
  getFreelanceOffers,
  saveOffer,
  deleteFreelanceOffer,
  getMyServices,
  saveMyService,
  deleteMyService,
} from "@/lib/api/jobs";
import { JOBS_TABS } from "@/constants";

const searchSchema = z.object({ tab: z.enum(["jobs", "offers", "services"]).optional() });

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs & Freelance — Dev Studio" }] }),
  validateSearch: searchSchema,
  component: JobsPage,
});

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
    setJobs(await getSavedJobs());
  }, []);

  const loadOffers = useCallback(async () => {
    setOffers(await getFreelanceOffers());
  }, []);

  const loadServices = useCallback(async () => {
    setServices(await getMyServices());
  }, []);

  useEffect(() => {
    loadJobs();
    loadOffers();
    loadServices();
  }, [loadJobs, loadOffers, loadServices]);

  useEffect(() => {
    setActiveJobId(null);
    setNewJob(false);
    setActiveOfferId(null);
    setNewOffer(false);
    setActiveServiceId(null);
    setNewService(false);
  }, [tab]);

  const handleSaveJob = async (data: Partial<SavedJob>) => {
    try {
      const body = activeJobId ? { ...data, id: activeJobId } : data;
      const saved = await saveJob(body);
      setJobs((prev) => {
        const idx = prev.findIndex((j) => j.id === saved.id);
        return idx >= 0 ? prev.map((j) => (j.id === saved.id ? saved : j)) : [...prev, saved];
      });
      setActiveJobId(saved.id);
      setNewJob(false);
      toast.success("Job saved!");
    } catch {
      toast.error("Failed to save.");
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteSavedJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setActiveJobId(null);
      setNewJob(false);
      toast.success("Job removed.");
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  const handleSaveOffer = async (data: Partial<FreelanceOffer>) => {
    try {
      const body = activeOfferId ? { ...data, id: activeOfferId } : data;
      const saved = await saveOffer(body);
      setOffers((prev) => {
        const idx = prev.findIndex((o) => o.id === saved.id);
        return idx >= 0 ? prev.map((o) => (o.id === saved.id ? saved : o)) : [...prev, saved];
      });
      setActiveOfferId(saved.id);
      setNewOffer(false);
      toast.success("Offer saved!");
    } catch {
      toast.error("Failed to save.");
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      await deleteFreelanceOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      setActiveOfferId(null);
      setNewOffer(false);
      toast.success("Offer removed.");
    } catch {
      toast.error("Failed to delete offer.");
    }
  };

  const handleSaveService = async (data: Partial<MyService>) => {
    try {
      const body = activeServiceId ? { ...data, id: activeServiceId } : data;
      const saved = await saveMyService(body);
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id);
        return idx >= 0 ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
      });
      setActiveServiceId(saved.id);
      setNewService(false);
      toast.success("Service saved!");
    } catch {
      toast.error("Failed to save.");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteMyService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setActiveServiceId(null);
      setNewService(false);
      toast.success("Service removed.");
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  const activeJob = jobs.find((j) => j.id === activeJobId) ?? null;
  const activeOffer = offers.find((o) => o.id === activeOfferId) ?? null;
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
          tabs={JOBS_TABS.map((t) => ({
            ...t,
            badge:
              t.id === "jobs"
                ? jobs.length
                : t.id === "offers"
                  ? offers.length
                  : services.length || undefined,
            onClick: () => navigate({ search: { tab: t.id } }),
          }))}
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
                onSelect={(id) => {
                  setActiveJobId(id);
                  setNewJob(false);
                }}
                onAdd={() => {
                  setActiveJobId(null);
                  setNewJob(true);
                }}
              />
            }
          >
            <JobEditor
              job={activeJob}
              isNew={newJob}
              onSave={handleSaveJob}
              onDelete={handleDeleteJob}
              onSaveRemote={handleSaveJob}
              onSaveOffer={async (scraped) => {
                try {
                  const saved = await saveOffer({
                    title: scraped.title ?? "",
                    client: scraped.company ?? "Client",
                    platform: scraped.source === "mostaql" ? "Mostaql" : "Khamsat",
                    budget: scraped.salary ?? "",
                    currency: "USD",
                    status: "new",
                    url: scraped.url ?? "",
                    description: scraped.description ?? "",
                    tags: scraped.tags ?? [],
                    notes: "",
                  });
                  setOffers((prev) => {
                    const idx = prev.findIndex((o) => o.id === saved.id);
                    return idx >= 0 ? prev.map((o) => (o.id === saved.id ? saved : o)) : [...prev, saved];
                  });
                  toast.success("Project saved to Offers!");
                } catch {
                  toast.error("Failed to save offer.");
                }
              }}
              onBack={() => {
                setActiveJobId(null);
                setNewJob(false);
              }}
            />
          </SplitLayout>
        )}

        {tab === "offers" && (
          <SplitLayout
            sidebar={
              <OffersSidebar
                offers={offers}
                activeId={activeOfferId}
                onSelect={(id) => {
                  setActiveOfferId(id);
                  setNewOffer(false);
                }}
                onAdd={() => {
                  setActiveOfferId(null);
                  setNewOffer(true);
                }}
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
                onSelect={(id) => {
                  setActiveServiceId(id);
                  setNewService(false);
                }}
                onAdd={() => {
                  setActiveServiceId(null);
                  setNewService(true);
                }}
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
