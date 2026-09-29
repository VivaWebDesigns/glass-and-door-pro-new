import { Profiler, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { LandingPageWizard } from "@/features/admin/cms/components/landing-page-wizard";
import AdminFormsPage from "@/features/admin/forms-page";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";

function InteractionFixture() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [created, setCreated] = useState("");
  const view = new URLSearchParams(location.search).get("view");
  return (
    <QueryClientProvider client={queryClient}>
      <button
        type="button"
        onClick={() => {
          void queryClient.invalidateQueries();
        }}
      >
        Refresh server data
      </button>
      {view === "editor" ? (
        <Profiler
          id="forms-editor"
          onRender={() => {
            document.body.dataset.editorCommits = String(
              Number(document.body.dataset.editorCommits || 0) + 1,
            );
          }}
        >
          <AdminFormsPage />
        </Profiler>
      ) : view === "wizard" ? (
        <>
          <button type="button" onClick={() => setWizardOpen(true)}>
            Open landing wizard
          </button>
          <LandingPageWizard
            open={wizardOpen}
            onClose={() => setWizardOpen(false)}
            onCreate={(content, title) => {
              setCreated(JSON.stringify({ title, content }));
              setWizardOpen(false);
            }}
          />
          {/* Keep serialized assertions out of the mobile viewport layout. */}
          <output hidden data-testid="created-page">
            {created}
          </output>
        </>
      ) : (
        <main style={{ maxWidth: 800, padding: 24 }}>
          <PublicFormRenderer slug="request" />
          <PublicFormRenderer slug="request" />
        </main>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
createRoot(document.getElementById("root")!).render(<InteractionFixture />);
