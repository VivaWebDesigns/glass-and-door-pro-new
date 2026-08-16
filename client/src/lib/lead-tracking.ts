export const GLASS_DOOR_PRO_LEAD_SUCCESS_EVENT = "glass_door_pro_lead_success";

const LEAD_EVENT_STORAGE_PREFIX = "glassDoorPro_lead_event:";
const pushedLeadEventIds = new Set<string>();

export interface GlassDoorProLeadSuccess {
  leadType: string;
  formName: string;
  leadEventId: string;
}

function wasLeadEventPushed(leadEventId: string) {
  if (pushedLeadEventIds.has(leadEventId)) return true;

  try {
    return window.sessionStorage.getItem(`${LEAD_EVENT_STORAGE_PREFIX}${leadEventId}`) === "1";
  } catch {
    return false;
  }
}

function rememberLeadEvent(leadEventId: string) {
  pushedLeadEventIds.add(leadEventId);

  try {
    window.sessionStorage.setItem(`${LEAD_EVENT_STORAGE_PREFIX}${leadEventId}`, "1");
  } catch {
    // In-memory deduplication still protects the current page when storage is unavailable.
  }
}

export function pushGlassDoorProLeadSuccess({
  leadType,
  formName,
  leadEventId,
}: GlassDoorProLeadSuccess) {
  if (typeof window === "undefined" || !leadEventId || wasLeadEventPushed(leadEventId)) {
    return false;
  }

  rememberLeadEvent(leadEventId);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: GLASS_DOOR_PRO_LEAD_SUCCESS_EVENT,
    lead_type: leadType,
    form_name: formName,
    lead_event_id: leadEventId,
  });

  return true;
}

