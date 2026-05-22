declare global {
  interface Window {
    ttq?: {
      track: (event: string, params: Record<string, unknown>) => void;
      page: () => void;
      load: (id: string) => void;
    };
  }
}

const TICKET_PAYLOAD = {
  contents: [
    {
      content_id: "billy-knight-ticket",
      content_type: "product",
      content_name: "Billy Knight Movie Ticket",
    },
  ],
  value: 18,
  currency: "USD",
};

function getTtq() {
  if (typeof window !== "undefined" && window.ttq) {
    return window.ttq;
  }
  return null;
}

export function trackViewContent() {
  const ttq = getTtq();
  if (ttq) {
    ttq.track("ViewContent", TICKET_PAYLOAD);
  }
}

export function trackInitiateCheckout() {
  const ttq = getTtq();
  if (ttq) {
    ttq.track("InitiateCheckout", TICKET_PAYLOAD);
  }
}

export function trackPurchase() {
  const ttq = getTtq();
  if (ttq) {
    ttq.track("Purchase", TICKET_PAYLOAD);
  }
}

export {};
