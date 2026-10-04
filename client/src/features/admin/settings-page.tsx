import { useEffect, useRef, useState, type ChangeEvent, type ElementType } from "react";
import { useQuery, useMutation, type UseMutationResult } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLockConflictGuard } from "@/hooks/use-lock-conflict-guard";
import { EditorLockNotice } from "@/components/shared/editor-lock-banner";
import { AdminSidebar } from "./admin-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Mail,
  Cloud,
  Eye,
  EyeOff,
  Pencil,
  Save,
  Plug,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  FileText,
  AlertCircle,
  Link2,
  ExternalLink,
  RefreshCw,
  ImageIcon,
  Type,
  Check,
  Palette,
  MapPin,
  BarChart3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Pilcrow,
  Eraser,
  Code2,
} from "lucide-react";
import {
  BRANDING_FONT_OPTIONS,
  BRANDING_SANS_FONT_OPTIONS,
  BRANDING_SERIF_FONT_OPTIONS,
  fontFamilyForBrandingOption,
  normalizeHexColor,
  type BrandingFontOption,
} from "@/lib/branding";
import { cn } from "@/lib/utils";
import { useEditorLock } from "@/hooks/use-editor-lock";
import { resolveBrandingColor } from "@shared/branding-colors";

type SettingsData = Record<string, Record<string, { value: string; isSecret: boolean }>>;

type BrandingSettingKey = "frontend_logo_url" | "favicon_url";
type BrandingCompanyInfoSettingKey =
  | "company_name"
  | "company_address"
  | "company_phone_numbers"
  | "company_google_business_url";

type BrandingColorSettingKey =
  | "brand_primary_color"
  | "brand_secondary_color"
  | "brand_tertiary_color"
  | "brand_quaternary_color"
  | "text_h1_color"
  | "text_h2_color"
  | "text_h3_h6_color"
  | "text_body_color"
  | "text_heading_subtext_color"
  | "text_supporting_copy_color"
  | "text_helper_text_color"
  | "text_meta_color"
  | "text_link_color"
  | "text_link_hover_color"
  | "text_inverse_color"
  | "text_primary_foreground_color"
  | "text_secondary_foreground_color"
  | "text_tertiary_foreground_color";

const BRANDING_CORE_COLOR_FIELDS: Array<{
  key: BrandingColorSettingKey;
  label: string;
  description: string;
}> = [
  {
    key: "brand_primary_color",
    label: "Primary Color",
    description: "Main brand and button color.",
  },
  {
    key: "brand_secondary_color",
    label: "Secondary Color",
    description: "Support color for secondary UI states.",
  },
  {
    key: "brand_tertiary_color",
    label: "Tertiary Color",
    description: "Accent color used across highlights and links.",
  },
  {
    key: "brand_quaternary_color",
    label: "Quaternary Color",
    description: "Fourth core brand color for additional featured accents and visual variety.",
  },
];

const BRANDING_TYPOGRAPHY_COLOR_FIELDS: Array<{
  key: BrandingColorSettingKey;
  label: string;
  description: string;
}> = [
  { key: "text_h1_color", label: "H1 Color", description: "Primary color for main page headings." },
  {
    key: "text_h2_color",
    label: "H2 Color",
    description: "Color for section-level headings and major titles.",
  },
  {
    key: "text_h3_h6_color",
    label: "H3-H6 Color",
    description: "Color for smaller heading levels and card titles.",
  },
  {
    key: "text_body_color",
    label: "Paragraph Text",
    description: "Default reading color for paragraphs, excerpts, and body copy.",
  },
  {
    key: "text_heading_subtext_color",
    label: "Heading Sub-Text",
    description: "Color for subtitle lines directly beneath major headings.",
  },
  {
    key: "text_supporting_copy_color",
    label: "Supporting Copy",
    description: "Use for section introductions, lead-in copy, and supporting editorial text.",
  },
  {
    key: "text_helper_text_color",
    label: "Helper Messaging",
    description: "Use for empty states, helper notes, and guidance text around UI and content.",
  },
  {
    key: "text_meta_color",
    label: "Meta Text",
    description: "Use for dates, authors, categories, labels, and small metadata.",
  },
  {
    key: "text_link_color",
    label: "Link Color",
    description: "Default color for editorial links and linked text actions.",
  },
  {
    key: "text_link_hover_color",
    label: "Link Hover Color",
    description: "Hover color for links and lightweight text actions.",
  },
  {
    key: "text_inverse_color",
    label: "Inverse Text",
    description: "Text shown on dark surfaces, image overlays, and high-contrast areas.",
  },
];

const BRANDING_UI_TEXT_COLOR_FIELDS: Array<{
  key: BrandingColorSettingKey;
  label: string;
  description: string;
}> = [
  {
    key: "text_primary_foreground_color",
    label: "Primary Text on Color",
    description: "Text shown on primary-colored buttons and badges.",
  },
  {
    key: "text_secondary_foreground_color",
    label: "Secondary Text on Color",
    description: "Text shown on secondary-colored UI surfaces.",
  },
  {
    key: "text_tertiary_foreground_color",
    label: "Tertiary Text on Color",
    description: "Text shown on tertiary/accent-colored UI surfaces.",
  },
];

const BRANDING_COLOR_FIELDS = [
  ...BRANDING_CORE_COLOR_FIELDS,
  ...BRANDING_TYPOGRAPHY_COLOR_FIELDS,
  ...BRANDING_UI_TEXT_COLOR_FIELDS,
] as const;

interface EmailTemplate {
  id: string;
  slug: string;
  name: string;
  subject: string;
  htmlBody: string;
  description: string;
  variables: string[];
  isActive: boolean;
  updatedAt: string;
}

interface IntegrationField {
  key: string;
  label: string;
  isSecret: boolean;
  placeholder: string;
}

interface IntegrationConfig {
  category: string;
  title: string;
  description: string;
  icon: ElementType;
  accountUrl: string;
  docsUrl?: string;
  instructions: string[];
  fields: IntegrationField[];
  replitConnected?: boolean;
  supportsConnectionTest?: boolean;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    category: "mailgun",
    title: "Mailgun",
    description: "Transactional email delivery service",
    icon: Mail,
    accountUrl: "https://app.mailgun.com/app/account/security/api_keys",
    docsUrl:
      "https://help.mailgun.com/hc/en-us/articles/203380100-Where-can-I-find-my-API-keys-and-SMTP-credentials",
    instructions: [
      "Open Mailgun API Security and create or copy an API key.",
      "Open Sending > Domains and copy the verified sending domain.",
      "Enter the from address exactly as messages should appear to recipients.",
    ],
    fields: [
      {
        key: "mailgun_api_key",
        label: "API Key",
        isSecret: true,
        placeholder: "key-...",
      },
      {
        key: "mailgun_domain",
        label: "Domain",
        isSecret: false,
        placeholder: "mg.yourdomain.com",
      },
      {
        key: "mailgun_from_address",
        label: "From Address",
        isSecret: false,
        placeholder: "Glass & Door Pro <noreply@yourdomain.com>",
      },
    ],
  },
  {
    category: "google_analytics",
    title: "Google Analytics",
    description:
      "Reserve the GA4 tracking and reporting configuration used by future public analytics and the planned admin Analytics area.",
    icon: BarChart3,
    accountUrl: "https://analytics.google.com/analytics/web/",
    docsUrl: "https://support.google.com/analytics/answer/9539598",
    instructions: [
      "Open Google Analytics Admin and choose the GA4 property for this site.",
      "Copy the Measurement ID from Data streams > Web stream details.",
      "For reporting access, create a Google Cloud service account and add its email to the GA4 property with viewer access.",
    ],
    supportsConnectionTest: false,
    fields: [
      {
        key: "ga4_measurement_id",
        label: "GA4 Measurement ID",
        isSecret: false,
        placeholder: "G-XXXXXXXXXX",
      },
      {
        key: "ga4_property_id",
        label: "GA4 Property ID",
        isSecret: false,
        placeholder: "123456789",
      },
      {
        key: "ga4_reporting_client_email",
        label: "Reporting Service Account Email",
        isSecret: false,
        placeholder: "ga-reporting@your-project.iam.gserviceaccount.com",
      },
      {
        key: "ga4_reporting_private_key",
        label: "Reporting Private Key",
        isSecret: true,
        placeholder: "Paste the complete reporting private key",
      },
    ],
  },
  {
    category: "cloudflare_r2",
    title: "Cloudflare R2",
    description: "Object storage for images and file uploads",
    icon: Cloud,
    accountUrl: "https://dash.cloudflare.com/?to=/:account/r2/api-tokens",
    docsUrl: "https://developers.cloudflare.com/r2/api/s3/tokens/",
    instructions: [
      "Open Cloudflare R2 API tokens for the correct account.",
      "Create an Account API token with Object Read and Write access scoped to this bucket.",
      "Copy the Access Key ID and Secret Access Key immediately; Cloudflare only shows the secret once.",
      "Copy the Account ID from the R2 overview or account overview, then enter the bucket name.",
      "Leave Public URL blank unless you have a custom public domain. Do not use the r2.cloudflarestorage.com API endpoint as the Public URL.",
    ],
    fields: [
      {
        key: "r2_account_id",
        label: "Account ID",
        isSecret: false,
        placeholder: "Your Cloudflare Account ID",
      },
      {
        key: "r2_access_key_id",
        label: "Access Key ID",
        isSecret: true,
        placeholder: "Access key for R2",
      },
      {
        key: "r2_secret_access_key",
        label: "Secret Access Key",
        isSecret: true,
        placeholder: "Secret access key for R2",
      },
      {
        key: "r2_bucket_name",
        label: "Bucket Name",
        isSecret: false,
        placeholder: "core-platform-uploads",
      },
      {
        key: "r2_public_url",
        label: "Public URL",
        isSecret: false,
        placeholder: "https://cdn.yourdomain.com",
      },
    ],
  },
];

function IntegrationCard({
  config,
  settings,
}: {
  config: IntegrationConfig;
  settings: SettingsData;
}) {
  const { toast } = useToast();
  const categorySettings = settings[config.category] || {};
  const [values, setValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const hasAnyValue = config.fields.some(
    (f) => categorySettings[f.key]?.value && categorySettings[f.key].value !== "",
  );

  const saveMutation = useMutation({
    mutationFn: async (field: IntegrationField) => {
      const val = values[field.key];
      if (val === undefined || val === "") return;
      await apiRequest("PUT", "/api/admin/settings", {
        key: field.key,
        value: val,
        category: config.category,
        isSecret: field.isSecret,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Setting saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error saving setting", description: err.message, variant: "destructive" });
    },
  });

  const saveAll = async () => {
    const changedFields = config.fields.filter((field) => {
      const val = values[field.key];
      return val !== undefined && val !== "";
    });
    await Promise.all(changedFields.map((field) => saveMutation.mutateAsync(field)));
    setValues({});
  };

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/settings/test-connection", {
        integration: config.category,
      });
      return res.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      toast({
        title: data.success ? "Connection successful" : "Connection failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (err: Error) => {
      toast({ title: "Test failed", description: err.message, variant: "destructive" });
    },
  });

  const supportsConnectionTest = config.supportsConnectionTest !== false;

  const Icon = config.icon;

  return (
    <Card data-testid={`card-integration-${config.category}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {config.replitConnected && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                data-testid={`badge-replit-${config.category}`}
              >
                <span className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> Auto-connected
                </span>
              </Badge>
            )}
            <Badge
              variant={hasAnyValue ? "default" : "outline"}
              data-testid={`badge-status-${config.category}`}
            >
              {hasAnyValue ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Configured
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Not configured
                </span>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {config.replitConnected && (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400 flex items-start gap-2"
            data-testid={`notice-replit-${config.category}`}
          >
            <Link2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              This service is auto-connected via Replit integration. The fields below are optional
              overrides for custom or production keys.
            </span>
          </div>
        )}
        <div className="rounded-md border bg-muted/30 px-3 py-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={config.accountUrl} target="_blank" rel="noreferrer">
                Open {config.title} Account
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
            {config.docsUrl ? (
              <Button asChild variant="ghost" size="sm">
                <a href={config.docsUrl} target="_blank" rel="noreferrer">
                  Setup Docs
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            ) : null}
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
            {config.instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </div>
        {config.fields.map((field) => {
          const existing = categorySettings[field.key];
          const hasExisting = existing && existing.value && existing.value !== "";
          const currentVal = values[field.key] ?? "";
          const isVisible = showSecrets[field.key];
          const shouldAutoPrependHttps =
            /url/i.test(field.label) ||
            field.key.toLowerCase().endsWith("_url") ||
            field.placeholder?.startsWith("https://") === true;

          return (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={field.key}
                    type={field.isSecret && !isVisible ? "password" : "text"}
                    placeholder={
                      hasExisting
                        ? field.isSecret
                          ? "••••••••  (saved — enter new value to update)"
                          : existing.value
                        : field.placeholder
                    }
                    value={currentVal}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    autoPrependHttps={shouldAutoPrependHttps}
                    data-testid={`input-${field.key}`}
                  />
                </div>
                {field.isSecret && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={showSecrets[field.key] ? "Hide value" : "Show value"}
                    onClick={() =>
                      setShowSecrets((prev) => ({
                        ...prev,
                        [field.key]: !prev[field.key],
                      }))
                    }
                    data-testid={`button-toggle-${field.key}`}
                  >
                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={saveAll}
            disabled={saveMutation.isPending || Object.values(values).every((v) => !v)}
            data-testid={`button-save-${config.category}`}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => testMutation.mutate()}
            disabled={testMutation.isPending || !hasAnyValue}
            className={cn(!supportsConnectionTest && "hidden")}
            data-testid={`button-test-${config.category}`}
          >
            {testMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plug className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
        </div>
        {!supportsConnectionTest ? (
          <p className="text-xs text-muted-foreground">
            Tracking and reporting values can be saved now. Connection validation will be added when
            the Analytics feature ships.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function IntegrationsTab({ settings }: { settings: SettingsData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-integrations-heading">
          Integrations
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure third-party service connections. Secret values are encrypted at rest.
        </p>
      </div>
      {INTEGRATIONS.map((config) => (
        <IntegrationCard key={config.category} config={config} settings={settings} />
      ))}
    </div>
  );
}

function HeadTagAdditionsTab({ settings }: { settings: SettingsData }) {
  const { toast } = useToast();
  const storedValue = settings.head_tag_additions?.public_head_html?.value || "";
  const [headHtml, setHeadHtml] = useState(storedValue);

  useEffect(() => {
    setHeadHtml(storedValue);
  }, [storedValue]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/admin/settings", {
        key: "public_head_html",
        value: headHtml,
        category: "head_tag_additions",
        isSecret: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Head tag additions updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Could not save head tag additions",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const hasChanges = headHtml !== storedValue;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-head-tag-additions-heading">
          Head Tag Additions
        </h3>
        <p className="text-sm text-muted-foreground">
          Add raw third-party tags that should be inserted into the public site&apos;s {"<head>"}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Code2 className="h-4 w-4 text-primary" />
            Public Head Markup
          </CardTitle>
          <CardDescription>
            Use this for custom meta tags, verification tags, or vendor scripts that must be added
            globally to the public website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium">A quick note on Google Analytics</p>
            <p className="mt-1">
              The existing <span className="font-medium">Integrations &gt; Google Analytics</span>{" "}
              card is still the right place for your structured GA4 configuration. Use this area
              when you specifically need to paste a raw vendor head tag.
            </p>
            <p className="mt-2">Tags pasted here load directly on the public site.</p>
            <p className="mt-2">
              Don&apos;t paste the Google Analytics snippet here: GA4 already loads through the
              site&apos;s Google Tag Manager container.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="public-head-html">Head tag markup</Label>
            <Textarea
              id="public-head-html"
              value={headHtml}
              onChange={(event) => setHeadHtml(event.target.value)}
              placeholder={`<!-- Example -->\n<meta name="google-site-verification" content="..." />\n<meta name="facebook-domain-verification" content="..." />`}
              className="min-h-[280px] font-mono text-xs"
              data-testid="textarea-public-head-html"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={!hasChanges || saveMutation.isPending}
              data-testid="button-save-head-tag-additions"
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Head Tags
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BrandingImageCard({
  settingKey,
  title,
  description,
  currentUrl,
}: {
  settingKey: BrandingSettingKey;
  title: string;
  description: string;
  currentUrl: string;
}) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const transparencyPreviewStyle = {
    backgroundColor: "#fff",
    backgroundImage:
      "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
    backgroundSize: "16px 16px",
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("settingKey", settingKey);

      const response = await fetch("/api/admin/branding/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || payload.message || "Upload failed");
      }

      return response.json() as Promise<{ key: BrandingSettingKey; url: string }>;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/branding"] }),
      ]);
      toast({ title: `${title} updated` });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    onError: (error: Error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed p-4"
          style={transparencyPreviewStyle}
        >
          {currentUrl ? (
            <img src={currentUrl} alt={title} className="max-h-16 w-auto object-contain" />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p>No image uploaded yet.</p>
              <p className="mt-1 text-xs">
                Transparent PNG and WebP files are preserved during upload.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploadMutation.isPending}
            data-testid={`button-upload-${settingKey}`}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type BrandingSubview = "branding" | "colors" | "typography";

function FontOptionCard({
  option,
  selectedValue,
  onSelect,
  sampleKind,
}: {
  option: BrandingFontOption;
  selectedValue: string;
  onSelect: (value: string) => void;
  sampleKind: "heading" | "body";
}) {
  const isSelected = selectedValue === option.value;
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border/70 bg-background",
      )}
      data-testid={`button-branding-font-${sampleKind}-${option.value}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold" style={{ fontFamily: option.family }}>
            {option.label}
          </p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {option.category === "sans" ? "Sans Serif" : "Serif"}
          </p>
        </div>
        {isSelected && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-3 text-balance text-slate-900",
          sampleKind === "heading" ? "text-xl font-semibold" : "text-sm",
        )}
        style={{ fontFamily: option.family }}
      >
        {sampleKind === "heading"
          ? "The right words should feel understood."
          : "Thoughtful typography helps editors preview the real feeling of the brand before publishing."}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{option.preview}</p>
    </button>
  );
}

const COMPANY_INFO_KEYS: BrandingCompanyInfoSettingKey[] = [
  "company_name",
  "company_address",
  "company_phone_numbers",
  "company_google_business_url",
];

const MUTED_COLOR_FALLBACK_KEYS = new Set<BrandingColorSettingKey>([
  "text_heading_subtext_color",
  "text_supporting_copy_color",
  "text_helper_text_color",
]);

type BrandingSettingsMap = SettingsData[string];

function readBrandingFont(
  settings: BrandingSettingsMap,
  key: "frontend_body_font" | "frontend_heading_font",
) {
  return settings[key]?.value || "__default__";
}

function readCompanyInfo(
  settings: BrandingSettingsMap,
): Record<BrandingCompanyInfoSettingKey, string> {
  return Object.fromEntries(
    COMPANY_INFO_KEYS.map((key) => [key, settings[key]?.value || ""]),
  ) as Record<BrandingCompanyInfoSettingKey, string>;
}

function readBrandingColorValues(
  settings: BrandingSettingsMap,
): Record<BrandingColorSettingKey, string> {
  return Object.fromEntries(
    BRANDING_COLOR_FIELDS.map((field) => {
      const fallback = MUTED_COLOR_FALLBACK_KEYS.has(field.key)
        ? settings.text_muted_color?.value
        : undefined;
      return [field.key, resolveBrandingColor(field.key, settings[field.key]?.value || fallback)];
    }),
  ) as Record<BrandingColorSettingKey, string>;
}

function getBrandingSignature(settings: BrandingSettingsMap) {
  const keys = [
    "frontend_body_font",
    "frontend_heading_font",
    ...COMPANY_INFO_KEYS,
    ...BRANDING_COLOR_FIELDS.map((field) => field.key),
    "text_muted_color",
  ];
  return JSON.stringify(keys.map((key) => settings[key]?.value));
}

function familyStyle(fontValue: string) {
  return {
    fontFamily:
      fontFamilyForBrandingOption(fontValue === "__default__" ? null : fontValue) ?? undefined,
  };
}

function getBrandingPreviewStyles(
  colorValues: Record<BrandingColorSettingKey, string>,
  bodyFont: string,
  headingFont: string,
) {
  return {
    previewBodyStyle: familyStyle(bodyFont),
    previewHeadingStyle: familyStyle(headingFont),
    previewPaletteStyle: {
      backgroundColor: colorValues.brand_primary_color || undefined,
      color: colorValues.text_primary_foreground_color || undefined,
    },
    previewLinkStyle: { color: colorValues.text_link_color || undefined },
    previewLinkHoverStyle: {
      color: colorValues.text_link_hover_color || colorValues.text_link_color || undefined,
    },
  };
}

async function saveBrandingSettings(entries: Array<[string, string]>) {
  await Promise.all(
    entries.map(([key, value]) =>
      apiRequest("PUT", "/api/admin/settings", {
        key,
        value,
        category: "branding",
        isSecret: false,
      }),
    ),
  );
}

function useBrandingSettingsMutation({
  save,
  successTitle,
  errorTitle,
}: {
  save: () => Promise<void>;
  successTitle: string;
  errorTitle: string;
}) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: save,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/branding"] }),
      ]);
      toast({ title: successTitle });
    },
    onError: (error: Error) => {
      toast({ title: errorTitle, description: error.message, variant: "destructive" });
    },
  });
}

function BrandingTypographyCard({
  headingFont,
  setHeadingFont,
  bodyFont,
  setBodyFont,
  previewHeadingStyle,
  previewBodyStyle,
  saveFontsMutation,
  hasFontChanges,
}: {
  headingFont: string;
  setHeadingFont: React.Dispatch<React.SetStateAction<string>>;
  bodyFont: string;
  setBodyFont: React.Dispatch<React.SetStateAction<string>>;
  previewHeadingStyle: { fontFamily: string | undefined };
  previewBodyStyle: { fontFamily: string | undefined };
  saveFontsMutation: UseMutationResult<void, Error, void, unknown>;
  hasFontChanges: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Type className="h-4 w-4 text-primary" />
          Frontend Typography
        </CardTitle>
        <CardDescription>
          Choose one font for headings and another for body copy on the public-facing website. Each
          option includes an inline sample so editors can compare type directly in the admin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Heading Font</Label>
            <Select value={headingFont} onValueChange={setHeadingFont}>
              <SelectTrigger data-testid="select-branding-heading-font">
                <SelectValue placeholder="Use current theme font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__default__">Use current theme font</SelectItem>
                {BRANDING_FONT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose from curated sans serif and serif Google fonts.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Body Font</Label>
            <Select value={bodyFont} onValueChange={setBodyFont}>
              <SelectTrigger data-testid="select-branding-body-font">
                <SelectValue placeholder="Use current theme font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__default__">Use current theme font</SelectItem>
                {BRANDING_FONT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose from the same balanced font library for paragraph copy.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Heading Font Picker</CardTitle>
              <CardDescription>
                Preview how each font feels in large editorial headings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sans Serif Options
                  </p>
                </div>
                <div className="grid gap-3">
                  {BRANDING_SANS_FONT_OPTIONS.map((option) => (
                    <FontOptionCard
                      key={option.value}
                      option={option}
                      selectedValue={headingFont}
                      onSelect={setHeadingFont}
                      sampleKind="heading"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Serif Options
                  </p>
                </div>
                <div className="grid gap-3">
                  {BRANDING_SERIF_FONT_OPTIONS.map((option) => (
                    <FontOptionCard
                      key={option.value}
                      option={option}
                      selectedValue={headingFont}
                      onSelect={setHeadingFont}
                      sampleKind="heading"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Body Font Picker</CardTitle>
              <CardDescription>
                Preview how each font reads in paragraph-sized content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sans Serif Options
                  </p>
                </div>
                <div className="grid gap-3">
                  {BRANDING_SANS_FONT_OPTIONS.map((option) => (
                    <FontOptionCard
                      key={option.value}
                      option={option}
                      selectedValue={bodyFont}
                      onSelect={setBodyFont}
                      sampleKind="body"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Serif Options
                  </p>
                </div>
                <div className="grid gap-3">
                  {BRANDING_SERIF_FONT_OPTIONS.map((option) => (
                    <FontOptionCard
                      key={option.value}
                      option={option}
                      selectedValue={bodyFont}
                      onSelect={setBodyFont}
                      sampleKind="body"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-xl border bg-muted/10 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <h4 className="mt-3 text-2xl font-semibold" style={previewHeadingStyle}>
            Glass & Door Pro helps Charlotte-area homes and businesses look their best.
          </h4>
          <p className="mt-3 text-sm text-muted-foreground" style={previewBodyStyle}>
            Use this preview to compare heading and body combinations before saving. These font
            selections only apply to the public-facing website, not the admin dashboard.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => saveFontsMutation.mutate()}
            disabled={!hasFontChanges || saveFontsMutation.isPending}
            data-testid="button-save-branding-fonts"
          >
            {saveFontsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Typography
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/** Empty palette values fall back to the browser default instead of an invalid color. */
function cssColor(value: string | undefined) {
  return value || undefined;
}

/** First non-empty color in a fallback chain. */
function firstColor(...values: Array<string | undefined>) {
  return values.find(Boolean);
}

function BrandingColorPreview({
  previewPaletteStyle,
  colorValues,
  previewHeadingStyle,
  previewBodyStyle,
  previewLinkStyle,
  previewLinkHoverStyle,
}: {
  previewPaletteStyle: { backgroundColor: string | undefined; color: string | undefined };
  colorValues: Record<BrandingColorSettingKey, string>;
  previewHeadingStyle: { fontFamily: string | undefined };
  previewBodyStyle: { fontFamily: string | undefined };
  previewLinkStyle: { color: string | undefined };
  previewLinkHoverStyle: { color: string | undefined };
}) {
  return (
    <div className="rounded-xl border bg-muted/10 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Palette Preview
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="rounded-lg px-4 py-2 text-sm font-medium" style={previewPaletteStyle}>
          Primary Action
        </div>
        <div
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: cssColor(colorValues.brand_secondary_color),
            color: cssColor(colorValues.text_secondary_foreground_color),
          }}
        >
          Secondary Action
        </div>
        <div
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: cssColor(colorValues.brand_tertiary_color),
            color: cssColor(colorValues.text_tertiary_foreground_color),
          }}
        >
          Tertiary Action
        </div>
        <div
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: firstColor(colorValues.brand_quaternary_color, "#A8623A"),
            color: firstColor(
              colorValues.text_inverse_color,
              colorValues.text_primary_foreground_color,
            ),
          }}
        >
          Quaternary Action
        </div>
      </div>
      <div className="mt-5 rounded-xl border bg-background p-5 space-y-3">
        <p
          className="text-3xl font-semibold"
          style={{
            ...previewHeadingStyle,
            color: firstColor(colorValues.text_h1_color, colorValues.text_body_color),
          }}
        >
          H1 headline preview
        </p>
        <p
          className="text-2xl font-semibold"
          style={{
            ...previewHeadingStyle,
            color: firstColor(
              colorValues.text_h2_color,
              colorValues.text_h1_color,
              colorValues.text_body_color,
            ),
          }}
        >
          H2 section heading preview
        </p>
        <p
          className="text-lg font-semibold"
          style={{
            ...previewHeadingStyle,
            color: firstColor(
              colorValues.text_h3_h6_color,
              colorValues.text_h2_color,
              colorValues.text_body_color,
            ),
          }}
        >
          H3-H6 card and supporting heading preview
        </p>
        <p
          className="text-sm"
          style={{
            ...previewBodyStyle,
            color: cssColor(colorValues.text_heading_subtext_color),
          }}
        >
          Heading sub-text preview directly beneath a hero or section heading.
        </p>
        <p
          className="text-sm"
          style={{
            ...previewBodyStyle,
            color: cssColor(colorValues.text_supporting_copy_color),
          }}
        >
          Supporting copy preview for section introductions, lead-ins, and editorial setup.
        </p>
        <p
          className="text-sm"
          style={{
            ...previewBodyStyle,
            color: cssColor(colorValues.text_helper_text_color),
          }}
        >
          Helper messaging preview for empty states, guidance text, and interface hints.
        </p>
        <p
          className="text-sm"
          style={{ ...previewBodyStyle, color: cssColor(colorValues.text_body_color) }}
        >
          Paragraph text preview for reading content, blog excerpts, and general body copy
          throughout the site.
        </p>
        <p
          className="text-xs uppercase tracking-wide"
          style={{
            color: firstColor(colorValues.text_meta_color, colorValues.text_helper_text_color),
          }}
        >
          Meta text preview for dates, authors, categories, and labels
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            id="branding-preview-link"
            href="#branding-preview-link"
            className="underline underline-offset-4"
            style={previewLinkStyle}
          >
            Link color preview
          </a>
          <span className="underline underline-offset-4" style={previewLinkHoverStyle}>
            Link hover preview
          </span>
        </div>
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{
            backgroundColor: firstColor(colorValues.brand_primary_color, "#1F2A44"),
            color: firstColor(
              colorValues.text_inverse_color,
              colorValues.text_primary_foreground_color,
            ),
          }}
        >
          Inverse text preview on dark or branded surfaces
        </div>
      </div>
    </div>
  );
}

function BrandingColorGroups({
  colorValues,
  updateColorValue,
}: {
  colorValues: Record<BrandingColorSettingKey, string>;
  updateColorValue: (key: BrandingColorSettingKey, value: string) => void;
}) {
  return (
    <>
      {[
        {
          title: "Core Colors",
          description:
            "These power the main brand accents, buttons, and highlighted interface states on the public site.",
          fields: BRANDING_CORE_COLOR_FIELDS,
        },
        {
          title: "Typography Colors",
          description:
            "Use these to separate major headings, paragraph copy, section subtext, metadata, and editorial links.",
          fields: BRANDING_TYPOGRAPHY_COLOR_FIELDS,
        },
        {
          title: "Text on Color Surfaces",
          description:
            "These colors are used when text appears on branded buttons, badges, and other colored UI surfaces.",
          fields: BRANDING_UI_TEXT_COLOR_FIELDS,
        },
      ].map((group) => (
        <div key={group.title} className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">{group.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className="space-y-1.5 rounded-xl border p-4">
                <div>
                  <Label>{field.label}</Label>
                  <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={normalizeHexColor(colorValues[field.key]) || "#000000"}
                    onChange={(event) =>
                      updateColorValue(field.key, event.target.value.toUpperCase())
                    }
                    aria-label={`${field.label} color`}
                    className="h-10 w-12 cursor-pointer rounded-md border bg-background p-1"
                    data-testid={`input-color-${field.key}`}
                  />
                  <Input
                    value={colorValues[field.key]}
                    onChange={(event) => updateColorValue(field.key, event.target.value)}
                    placeholder="#000000"
                    data-testid={`input-hex-${field.key}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function BrandingCompanyInfoCard({
  companyInfo,
  setCompanyInfo,
  saveCompanyInfoMutation,
  hasCompanyInfoChanges,
}: {
  companyInfo: Record<BrandingCompanyInfoSettingKey, string>;
  setCompanyInfo: React.Dispatch<
    React.SetStateAction<Record<BrandingCompanyInfoSettingKey, string>>
  >;
  saveCompanyInfoMutation: UseMutationResult<void, Error, void, unknown>;
  hasCompanyInfoChanges: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-primary" />
          Company Information
        </CardTitle>
        <CardDescription>
          These details automatically populate the Location card on the Contact page and the live
          Contact Form block.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name">Business Name</Label>
          <Input
            id="company-name"
            value={companyInfo.company_name}
            onChange={(event) =>
              setCompanyInfo((current) => ({ ...current, company_name: event.target.value }))
            }
            placeholder="Glass & Door Pro"
            data-testid="input-company-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-google-business-url">Google Business Listing URL</Label>
          <Input
            id="company-google-business-url"
            value={companyInfo.company_google_business_url}
            onChange={(event) =>
              setCompanyInfo((current) => ({
                ...current,
                company_google_business_url: event.target.value,
              }))
            }
            placeholder="https://maps.google.com/..."
            autoPrependHttps
            data-testid="input-company-google-business-url"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company-address">Address</Label>
          <Textarea
            id="company-address"
            value={companyInfo.company_address}
            onChange={(event) =>
              setCompanyInfo((current) => ({
                ...current,
                company_address: event.target.value,
              }))
            }
            placeholder={"123 Example Street\nSuite 100\nAtlanta, GA 30303"}
            rows={4}
            data-testid="textarea-company-address"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company-phone-numbers">Phone Number(s)</Label>
          <Textarea
            id="company-phone-numbers"
            value={companyInfo.company_phone_numbers}
            onChange={(event) =>
              setCompanyInfo((current) => ({
                ...current,
                company_phone_numbers: event.target.value,
              }))
            }
            placeholder={"(555) 123-4567\n(555) 765-4321"}
            rows={3}
            data-testid="textarea-company-phone-numbers"
          />
          <p className="text-xs text-muted-foreground">
            Add one phone number per line to display multiple phone numbers.
          </p>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <Button
            type="button"
            onClick={() => saveCompanyInfoMutation.mutate()}
            disabled={!hasCompanyInfoChanges || saveCompanyInfoMutation.isPending}
            data-testid="button-save-company-information"
          >
            {saveCompanyInfoMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Company Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandingTab({
  settings,
  initialSubtab = "branding",
  showHeader = true,
}: {
  settings: SettingsData;
  initialSubtab?: BrandingSubview;
  showHeader?: boolean;
}) {
  const brandingSettings = settings.branding || {};
  const [bodyFont, setBodyFont] = useState(() =>
    readBrandingFont(brandingSettings, "frontend_body_font"),
  );
  const [headingFont, setHeadingFont] = useState(() =>
    readBrandingFont(brandingSettings, "frontend_heading_font"),
  );
  const [companyInfo, setCompanyInfo] = useState(() => readCompanyInfo(brandingSettings));
  const [colorValues, setColorValues] = useState(() => readBrandingColorValues(brandingSettings));

  const brandingSignature = getBrandingSignature(brandingSettings);
  const [syncedBrandingSignature, setSyncedBrandingSignature] = useState(brandingSignature);
  if (brandingSignature !== syncedBrandingSignature) {
    setSyncedBrandingSignature(brandingSignature);
    setBodyFont(readBrandingFont(brandingSettings, "frontend_body_font"));
    setHeadingFont(readBrandingFont(brandingSettings, "frontend_heading_font"));
    setCompanyInfo(readCompanyInfo(brandingSettings));
    setColorValues(readBrandingColorValues(brandingSettings));
  }

  const saveFontsMutation = useBrandingSettingsMutation({
    successTitle: "Branding fonts updated",
    errorTitle: "Could not save branding fonts",
    save: () =>
      saveBrandingSettings([
        ["frontend_body_font", bodyFont === "__default__" ? "" : bodyFont],
        ["frontend_heading_font", headingFont === "__default__" ? "" : headingFont],
      ]),
  });
  const saveCompanyInfoMutation = useBrandingSettingsMutation({
    successTitle: "Company information updated",
    errorTitle: "Could not save company information",
    save: () =>
      saveBrandingSettings(COMPANY_INFO_KEYS.map((key) => [key, companyInfo[key].trim()])),
  });
  const saveColorsMutation = useBrandingSettingsMutation({
    successTitle: "Brand color palette updated",
    errorTitle: "Could not save brand colors",
    save: () =>
      saveBrandingSettings(
        BRANDING_COLOR_FIELDS.map((field) => [
          field.key,
          normalizeHexColor(colorValues[field.key]) || "",
        ]),
      ),
  });

  const hasFontChanges =
    bodyFont !== readBrandingFont(brandingSettings, "frontend_body_font") ||
    headingFont !== readBrandingFont(brandingSettings, "frontend_heading_font");
  const hasCompanyInfoChanges = COMPANY_INFO_KEYS.some(
    (key) => companyInfo[key] !== (brandingSettings[key]?.value || ""),
  );
  const savedColorValues = readBrandingColorValues(brandingSettings);
  const hasColorChanges = BRANDING_COLOR_FIELDS.some(
    (field) => colorValues[field.key] !== savedColorValues[field.key],
  );
  const {
    previewBodyStyle,
    previewHeadingStyle,
    previewPaletteStyle,
    previewLinkStyle,
    previewLinkHoverStyle,
  } = getBrandingPreviewStyles(colorValues, bodyFont, headingFont);

  const updateColorValue = (key: BrandingColorSettingKey, value: string) => {
    setColorValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h3 className="text-lg font-semibold" data-testid="text-branding-heading">
            Branding
          </h3>
          <p className="text-sm text-muted-foreground">
            Control the public logo, favicon, color palette, and frontend typography. Branding
            images are stored in Cloudflare R2 under the `branding/` directory.
          </p>
        </div>
      )}

      <Tabs defaultValue={initialSubtab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3" data-testid="tabs-branding-subtabs">
          <TabsTrigger value="branding" data-testid="tab-branding-subtab-branding">
            Branding
          </TabsTrigger>
          <TabsTrigger value="colors" data-testid="tab-branding-subtab-colors">
            Color Palette
          </TabsTrigger>
          <TabsTrigger value="typography" data-testid="tab-branding-subtab-typography">
            Typography
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <BrandingImageCard
              settingKey="frontend_logo_url"
              title="Frontend Logo"
              description="Shown in the site header and footer."
              currentUrl={brandingSettings.frontend_logo_url?.value || ""}
            />
            <BrandingImageCard
              settingKey="favicon_url"
              title="Favicon"
              description="Shown in the browser tab, bookmarks, and saved shortcuts."
              currentUrl={brandingSettings.favicon_url?.value || ""}
            />
          </div>

          <BrandingCompanyInfoCard
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
            saveCompanyInfoMutation={saveCompanyInfoMutation}
            hasCompanyInfoChanges={hasCompanyInfoChanges}
          />
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-primary" />
                Color Palette
              </CardTitle>
              <CardDescription>
                Set the core frontend brand colors, typography colors, and UI foreground colors.
                This keeps headings, body copy, supporting text, metadata, and links distinct
                without needing one-off overrides.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <BrandingColorGroups colorValues={colorValues} updateColorValue={updateColorValue} />

              <BrandingColorPreview
                previewPaletteStyle={previewPaletteStyle}
                colorValues={colorValues}
                previewHeadingStyle={previewHeadingStyle}
                previewBodyStyle={previewBodyStyle}
                previewLinkStyle={previewLinkStyle}
                previewLinkHoverStyle={previewLinkHoverStyle}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => saveColorsMutation.mutate()}
                  disabled={!hasColorChanges || saveColorsMutation.isPending}
                  data-testid="button-save-branding-colors"
                >
                  {saveColorsMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Color Palette
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <BrandingTypographyCard
            headingFont={headingFont}
            setHeadingFont={setHeadingFont}
            bodyFont={bodyFont}
            setBodyFont={setBodyFont}
            previewHeadingStyle={previewHeadingStyle}
            previewBodyStyle={previewBodyStyle}
            saveFontsMutation={saveFontsMutation}
            hasFontChanges={hasFontChanges}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateEditorFooter({
  updateMutation,
  editorLock,
  previewMutation,
  testMutation,
}: {
  updateMutation: UseMutationResult<void, Error, void, unknown>;
  editorLock: ReturnType<typeof useEditorLock>;
  previewMutation: UseMutationResult<{ subject: string; html: string }, Error, void, unknown>;
  testMutation: UseMutationResult<{ success: boolean; message: string }, Error, void, unknown>;
}) {
  return (
    <SheetFooter>
      <Button
        onClick={() => updateMutation.mutate()}
        disabled={updateMutation.isPending || editorLock.isReadOnly}
        data-testid="button-save-template"
      >
        {updateMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Template
      </Button>
      <Button
        variant="outline"
        onClick={() => previewMutation.mutate()}
        disabled={previewMutation.isPending}
        data-testid="button-preview-template"
      >
        {previewMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Eye className="h-4 w-4 mr-2" />
        )}
        Refresh Preview
      </Button>
      <Button
        variant="outline"
        onClick={() => testMutation.mutate()}
        disabled={testMutation.isPending}
        data-testid="button-test-email"
      >
        {testMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Send Test
      </Button>
    </SheetFooter>
  );
}

function TemplatePreviewPanel({
  previewMutation,
  previewHtml,
}: {
  previewMutation: UseMutationResult<{ subject: string; html: string }, Error, void, unknown>;
  previewHtml: string | null;
}) {
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="bg-muted px-3 py-2 text-xs font-medium flex items-center justify-between">
        <span>Published Preview</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => previewMutation.mutate()}
          disabled={previewMutation.isPending}
          data-testid="button-refresh-template-preview"
        >
          {previewMutation.isPending ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>
      {previewHtml ? (
        <iframe
          srcDoc={previewHtml}
          sandbox=""
          className="w-full h-[420px] bg-white"
          title="Email preview"
          data-testid="iframe-email-preview"
        />
      ) : (
        <div className="flex h-[220px] items-center justify-center bg-white text-sm text-muted-foreground">
          {previewMutation.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading preview…
            </span>
          ) : (
            "Preview unavailable."
          )}
        </div>
      )}
    </div>
  );
}

function TemplateLinkPanel({
  showLinkPanel,
  linkUrl,
  setLinkUrl,
  applyLink,
}: {
  showLinkPanel: boolean;
  linkUrl: string;
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  applyLink: () => void;
}) {
  return (
    <>
      {showLinkPanel ? (
        <div className="border-b bg-muted/15 px-3 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="template-link-url" className="text-xs">
                Link URL
              </Label>
              <Input
                id="template-link-url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
                autoPrependHttps
                className="h-9"
                data-testid="input-template-link-url"
              />
            </div>
            <Button type="button" onClick={applyLink} data-testid="button-template-apply-link">
              Apply Link
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TemplateFormattingToolbar({
  applyCommand,
  focusVisualEditor,
  setShowLinkPanel,
}: {
  applyCommand: (command: string, value?: string) => void;
  focusVisualEditor: () => void;
  setShowLinkPanel: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 px-2 py-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => applyCommand("formatBlock", "<p>")}
      >
        <Pilcrow className="mr-1.5 h-3.5 w-3.5" />
        Paragraph
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => applyCommand("formatBlock", "<h2>")}
      >
        <Heading2 className="mr-1.5 h-3.5 w-3.5" />
        Heading
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bold"
        className="h-8 w-8"
        onClick={() => applyCommand("bold")}
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Italic"
        className="h-8 w-8"
        onClick={() => applyCommand("italic")}
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Underline"
        className="h-8 w-8"
        onClick={() => applyCommand("underline")}
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bulleted list"
        className="h-8 w-8"
        onClick={() => applyCommand("insertUnorderedList")}
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Numbered list"
        className="h-8 w-8"
        onClick={() => applyCommand("insertOrderedList")}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => {
          focusVisualEditor();
          setShowLinkPanel((current) => !current);
        }}
      >
        <Link2 className="mr-1.5 h-3.5 w-3.5" />
        Link
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => applyCommand("removeFormat")}
      >
        <Eraser className="mr-1.5 h-3.5 w-3.5" />
        Clear
      </Button>
    </div>
  );
}

function TemplateVariableChips({
  template,
  insertVariable,
}: {
  template: EmailTemplate;
  insertVariable: (variable: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <span className="text-xs text-muted-foreground mr-1">Variables:</span>
      {template.variables.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => insertVariable(v)}
          className="inline-flex"
          data-testid={`button-template-variable-${v}`}
        >
          <Badge
            variant="secondary"
            className="cursor-pointer text-xs font-mono hover:bg-secondary/80"
          >
            {`{{${v}}}`}
          </Badge>
        </button>
      ))}
    </div>
  );
}

function TemplateEditor({
  template,
  open,
  onClose,
}: {
  template: EmailTemplate;
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [subject, setSubject] = useState(template.subject);
  const [htmlBody, setHtmlBody] = useState(template.htmlBody);
  const [editorTab, setEditorTab] = useState<"visual" | "html">("visual");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const visualEditorRef = useRef<HTMLDivElement | null>(null);
  const isApplyingExternalHtmlRef = useRef(false);
  const editorLock = useEditorLock({
    resourceType: "email_template",
    resourceId: open ? template.slug : null,
    enabled: open,
  });

  const [syncedTemplate, setSyncedTemplate] = useState(template);
  if (template !== syncedTemplate) {
    setSyncedTemplate(template);
    setSubject(template.subject);
    setHtmlBody(template.htmlBody);
    setPreviewHtml(null);
    setEditorTab("visual");
    setLinkUrl("");
    setShowLinkPanel(false);
  }

  useLockConflictGuard({
    active: open,
    resourceId: open ? template.slug : null,
    resourceLabel: "email template",
    editorLock,
    onConflict: onClose,
  });

  useEffect(() => {
    if (!open) return;
    const editor = visualEditorRef.current;
    if (!editor) return;

    const current = editor.innerHTML;
    if (current === htmlBody) return;

    isApplyingExternalHtmlRef.current = true;
    editor.innerHTML = htmlBody;
    requestAnimationFrame(() => {
      isApplyingExternalHtmlRef.current = false;
    });
  }, [htmlBody, open]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", `/api/admin/email-templates/${template.slug}`, {
        subject,
        htmlBody,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Template saved" });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Error saving template", description: err.message, variant: "destructive" });
    },
  });

  const previewMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/email-templates/${template.slug}/preview`, {
        htmlBody,
        subject,
      });
      return res.json();
    },
    onSuccess: (data: { subject: string; html: string }) => {
      setPreviewHtml(data.html);
    },
    onError: (err: Error) => {
      toast({ title: "Preview failed", description: err.message, variant: "destructive" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/email-templates/${template.slug}/test`);
      return res.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      toast({
        title: data.success ? "Test email sent" : "Email not sent",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (err: Error) => {
      toast({ title: "Test email failed", description: err.message, variant: "destructive" });
    },
  });

  const { mutate: requestPreview } = previewMutation;
  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      requestPreview();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [open, subject, htmlBody, requestPreview]);

  const syncVisualHtml = () => {
    const editor = visualEditorRef.current;
    if (!editor || isApplyingExternalHtmlRef.current) return;
    setHtmlBody(editor.innerHTML);
  };

  const focusVisualEditor = () => {
    visualEditorRef.current?.focus();
  };

  const applyCommand = (command: string, value?: string) => {
    focusVisualEditor();
    if (typeof document === "undefined") return;
    document.execCommand(command, false, value);
    syncVisualHtml();
  };

  const insertVariable = (variable: string) => {
    focusVisualEditor();
    if (typeof document === "undefined") return;
    const token = `{{${variable}}}`;
    document.execCommand("insertText", false, token);
    syncVisualHtml();
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) return;
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    applyCommand("createLink", normalized);
    setShowLinkPanel(false);
    setLinkUrl("");
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" size="xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Edit: {template.name}
          </SheetTitle>
          <SheetDescription className="sr-only">Edit email template</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <EditorLockNotice editorLock={editorLock} className="mb-4" />
          <div
            className={cn(
              editorLock.hasLocking &&
                editorLock.isReadOnly &&
                "pointer-events-none select-none opacity-70",
            )}
          >
            <p className="text-sm text-muted-foreground">{template.description}</p>

            <TemplateVariableChips template={template} insertVariable={insertVariable} />

            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label htmlFor="template-subject">Subject</Label>
                <Input
                  id="template-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  data-testid="input-template-subject"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Label>Email Body</Label>
                  <Tabs
                    value={editorTab}
                    onValueChange={(value) => setEditorTab(value as "visual" | "html")}
                  >
                    <TabsList className="h-9 rounded-full">
                      <TabsTrigger
                        value="visual"
                        className="rounded-full px-3 text-xs"
                        data-testid="tab-email-visual"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Visual
                      </TabsTrigger>
                      <TabsTrigger
                        value="html"
                        className="rounded-full px-3 text-xs"
                        data-testid="tab-email-html"
                      >
                        <Code2 className="mr-1.5 h-3.5 w-3.5" />
                        HTML
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visual mode shows the email the way editors expect to work with it. HTML mode
                  remains available for advanced changes.
                </p>

                {editorTab === "visual" ? (
                  <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                    <TemplateFormattingToolbar
                      applyCommand={applyCommand}
                      focusVisualEditor={focusVisualEditor}
                      setShowLinkPanel={setShowLinkPanel}
                    />

                    <TemplateLinkPanel
                      showLinkPanel={showLinkPanel}
                      linkUrl={linkUrl}
                      setLinkUrl={setLinkUrl}
                      applyLink={applyLink}
                    />

                    <div className="bg-muted/20 p-4">
                      <div className="mx-auto max-w-2xl rounded-xl border bg-white shadow-sm">
                        <div className="border-b px-4 py-3 text-xs uppercase tracking-wide text-slate-500">
                          Email content editor
                        </div>
                        <div
                          ref={visualEditorRef}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={syncVisualHtml}
                          onBlur={syncVisualHtml}
                          className="min-h-[320px] px-6 py-5 text-[15px] leading-7 text-slate-700 outline-none"
                          data-testid="visual-template-body"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    id="template-body"
                    value={htmlBody}
                    onChange={(e) => setHtmlBody(e.target.value)}
                    rows={16}
                    className="font-mono text-xs"
                    data-testid="input-template-body"
                  />
                )}
              </div>
            </div>

            <TemplatePreviewPanel previewMutation={previewMutation} previewHtml={previewHtml} />
          </div>
        </SheetBody>
        <TemplateEditorFooter
          updateMutation={updateMutation}
          editorLock={editorLock}
          previewMutation={previewMutation}
          testMutation={testMutation}
        />
      </SheetContent>
    </Sheet>
  );
}

function EmailTemplatesTab() {
  const { toast } = useToast();
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates, isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ["/api/admin/email-templates"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ slug, isActive }: { slug: string; isActive: boolean }) => {
      await apiRequest("PUT", `/api/admin/email-templates/${slug}`, {
        isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Template updated" });
    },
    onError: (err: Error) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/email-templates/restore");
      return res.json();
    },
    onSuccess: async (payload: { restored: number }) => {
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({
        title: "System email templates restored",
        description: `${payload.restored} templates are now available in the library.`,
      });
    },
    onError: (err: Error) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "Restore failed", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold" data-testid="text-templates-heading">
          Email Templates
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage system email templates. Templates use {"{{variable}}"} placeholders for dynamic
          content.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => restoreMutation.mutate()}
          disabled={restoreMutation.isPending}
          data-testid="button-restore-email-templates"
        >
          {restoreMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Restore System Templates
        </Button>
      </div>

      {!templates?.length && (
        <Card>
          <CardContent className="flex items-center gap-3 py-8 justify-center text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span>
              No email templates found. Use “Restore System Templates” to repopulate the defaults.
            </span>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {templates?.map((t) => (
          <Card key={t.slug} data-testid={`card-template-${t.slug}`}>
            <CardContent className="py-4 px-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{t.name}</h4>
                    <Badge
                      variant={t.isActive ? "default" : "outline"}
                      className="text-xs"
                      data-testid={`badge-active-${t.slug}`}
                    >
                      {t.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{t.description}</p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Subject: </span>
                    <span className="font-mono">{t.subject}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Switch
                    checked={t.isActive}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({ slug: t.slug, isActive: checked })
                    }
                    data-testid={`switch-active-${t.slug}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(t)}
                    data-testid={`button-edit-${t.slug}`}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          open={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useQuery<SettingsData>({
    queryKey: ["/api/admin/settings"],
  });

  return (
    <AdminSidebar>
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-heading font-bold mb-1" data-testid="text-settings-title">
          System Settings
        </h1>
        <p className="text-muted-foreground mb-6">
          Manage integrations, head markup, and system email templates.
        </p>

        <Tabs defaultValue="integrations">
          <TabsList data-testid="tabs-settings">
            <TabsTrigger value="integrations" data-testid="tab-integrations">
              Integrations
            </TabsTrigger>
            <TabsTrigger value="head-tags" data-testid="tab-head-tag-additions">
              Head Tag Additions
            </TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">
              Email Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <IntegrationsTab settings={settings || {}} />
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <EmailTemplatesTab />
          </TabsContent>

          <TabsContent value="head-tags" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <HeadTagAdditionsTab settings={settings || {}} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminSidebar>
  );
}
