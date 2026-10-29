// lib/faq.ts
import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  PHONE_DISPLAY,
  CONTACT_EMAIL,
  formatNaira,
} from "./constants";

export const FAQ = [
  {
    question: "What are the shipping costs within Nigeria?",
    answer: `We offer a standard delivery fee of ${formatNaira(SHIPPING_FEE)} nationwide. Complimentary delivery is automatically applied to all orders of ${formatNaira(FREE_SHIPPING_THRESHOLD)} or more.`,
  },
  {
    question: "Are your products made with natural ingredients?",
    answer:
      "Yes, our formulations use pure cold-pressed botanical oils, unrefined West African shea butter, and herbal matrices. We use zero harsh synthetics.",
  },
  {
    question: "How can I contact Fulany.ng customer support?",
    answer: `You can reach us directly via WhatsApp at ${PHONE_DISPLAY} or email us at ${CONTACT_EMAIL}.`,
  },
];