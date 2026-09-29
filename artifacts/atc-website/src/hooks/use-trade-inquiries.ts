import { useSyncExternalStore } from "react";
import { getInquirySnapshot, recordLocalInquiry, subscribeInquiriesAndSession } from "@/lib/trade-inquiries";

export function useTradeInquiries() {
  const inquiries = useSyncExternalStore(subscribeInquiriesAndSession, getInquirySnapshot, getInquirySnapshot);
  return { inquiries, record: recordLocalInquiry };
}
