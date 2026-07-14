import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, ChevronLeft, ChevronRight, Star, MapPin, Phone,
  Globe, Award, TreePine, Utensils, Music, Gamepad2, PartyPopper,
  Train, Car, PersonStanding, Waves, ArrowRight, CheckCircle,
  MessageCircle, Send, Bot, Minimize2, ExternalLink,
  CreditCard, ShieldCheck, Loader2, AlertCircle, Tent, Building,
  ChevronDown, ZoomIn, Package, Sparkles, Calendar,
} from "lucide-react";

// ─── Razorpay types ────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string;
  handler: (r: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open(): void; }
interface RazorpayResponse {
  razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
}

// ─── Animation hook ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.4);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = to / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 35);
    return () => clearInterval(id);
  }, [visible, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Reveal wrapper ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right" | "none";
}) {
  const { ref, visible } = useReveal();
  const transforms: Record<string, string> = {
    up: "translateY(32px)", left: "translateX(-32px)", right: "translateX(32px)", none: "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Rooms", href: "#rooms" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const HERO_SLIDES = [
  {
    tag: "Forest Escape",
    heading: "Premium Forest Camping\nin Matheran",
    sub: "The perfect destination for those who want to experience nature without compromise.",
    img: "https://images.unsplash.com/photo-1759421754364-2310e30f2bab?w=1600&h=900&fit=crop&auto=format",
    alt: "Glamping tents nestled at the base of a forested hill",
    cta: "Explore Stays",
  },
  {
    tag: "Pure Relaxation",
    heading: "Indulge in Relaxation\nat Every Turn",
    sub: "Romantic getaways, family retreats, solo adventures — crafted for every kind of traveller.",
    img: "https://images.unsplash.com/photo-1696171884624-96d08401853b?w=1600&h=900&fit=crop&auto=format",
    alt: "Pool surrounded by lush green trees",
    cta: "Book a Room",
  },
  {
    tag: "Adventure Awaits",
    heading: "Six Thrilling\nAdventure Activities",
    sub: "The exclusive hotel in Matheran with zip line, rock climbing, archery, and more.",
    img: "https://images.unsplash.com/photo-1664372912644-1b70f8a00e5c?w=1600&h=900&fit=crop&auto=format",
    alt: "Beautiful hill station surrounded by nature",
    cta: "See Activities",
  },
];

const ROOMS = [
  {
    id: "tent", type: "Tent Stay", tagline: "Beneath the Stars",
    desc: "Fall asleep to the sound of the forest in fully-furnished glamping tents with premium bedding and private campfire.",
    img: "https://images.unsplash.com/photo-1638284648387-3f946944713e?w=800&h=600&fit=crop&auto=format",
    alt: "Glamping tents in the forest",
    price: 2500, priceLabel: "₹2,500 / night",
    features: ["Forest views", "Premium bedding", "Campfire access", "Stargazing deck"],
    icon: Tent, badge: null,
  },
  {
    id: "deluxe", type: "Deluxe Room", tagline: "Family & Friends",
    desc: "Spacious rooms with modern comforts steps from the pool and adventure zone. Most popular with families.",
    img: "https://images.unsplash.com/photo-1767784549911-ea712b3d889d?w=800&h=600&fit=crop&auto=format",
    alt: "Heritage colonial building with arched walkways",
    price: 3800, priceLabel: "₹3,800 / night",
    features: ["Pool access", "In-room TV", "Daily breakfast", "Games zone"],
    icon: Building, badge: "Most Popular",
  },
  {
    id: "heritage", type: "Heritage Room", tagline: "19th-Century Grandeur",
    desc: "Original 19th-century architecture with vintage charm, panoramic woodland views, and priority amenities.",
    img: "https://images.unsplash.com/photo-1762624169131-1e8293c6c673?w=800&h=600&fit=crop&auto=format",
    alt: "Ornate heritage doorway leading into a courtyard",
    price: 5200, priceLabel: "₹5,200 / night",
    features: ["Heritage architecture", "Woodland views", "DJ & pool priority", "Group capacity"],
    icon: Award, badge: "Premium",
  },
];

const PACKAGES = [
  {
    id: "weekend",
    icon: Calendar,
    title: "Weekend Escape",
    subtitle: "2 nights · 2 guests",
    desc: "Perfect quick recharge. Includes Deluxe room for 2 nights, all meals, pool access, and one adventure activity.",
    price: 9999,
    priceLabel: "₹9,999",
    perLabel: "for 2 guests",
    includes: ["2 Nights Deluxe Room", "All Meals (6 total)", "Pool Access", "1 Adventure Activity", "Campfire Evening"],
    color: "bg-[#2A4A10]",
  },
  {
    id: "family",
    icon: Sparkles,
    title: "Family Bonanza",
    subtitle: "3 nights · 4 guests",
    desc: "Three days of pure family joy. Two Deluxe rooms, all meals, unlimited games, and two adventure activities per person.",
    price: 24999,
    priceLabel: "₹24,999",
    perLabel: "for 4 guests",
    includes: ["3 Nights (2 Deluxe Rooms)", "All Meals Included", "Unlimited Games", "2 Adventures/Person", "DJ Night Pass", "Room Decoration"],
    color: "bg-[#1C3B0A]",
    highlight: true,
  },
  {
    id: "adventure",
    icon: Package,
    title: "Adventure Pack",
    subtitle: "2 nights · per person",
    desc: "For the thrill-seeker. Tent stay for 2 nights with all 6 adventure activities, meals, and a guided forest trail.",
    price: 7499,
    priceLabel: "₹7,499",
    perLabel: "per person",
    includes: ["2 Nights Tent Stay", "All 6 Activities", "All Meals", "Guided Nature Trail", "Bonfire Night", "Activity Certificate"],
    color: "bg-[#2A4A10]",
  },
];

const GALLERY_IMGS = [
  { url: "https://images.unsplash.com/photo-1696171884624-96d08401853b?w=900&h=600&fit=crop&auto=format", alt: "Swimming pool surrounded by lush forest", cls: "col-span-2 row-span-1" },
  { url: "https://images.unsplash.com/photo-1759421754364-2310e30f2bab?w=500&h=500&fit=crop&auto=format", alt: "Glamping tents in the forest", cls: "" },
  { url: "https://images.unsplash.com/photo-1559561724-732dbca7be1e?w=500&h=500&fit=crop&auto=format", alt: "Variety of vegetarian cuisines", cls: "" },
  { url: "https://images.unsplash.com/photo-1767784549911-ea712b3d889d?w=500&h=800&fit=crop&auto=format", alt: "Heritage colonial building", cls: "row-span-2" },
  { url: "https://images.unsplash.com/photo-1777768785766-db03f4333406?w=900&h=500&fit=crop&auto=format", alt: "Geodesic dome glamping tent in forest setting", cls: "col-span-2" },
  { url: "https://images.unsplash.com/photo-1686931346464-5cf66d798b47?w=500&h=500&fit=crop&auto=format", alt: "Small cabin in a forest", cls: "" },
];

const TESTIMONIALS = [
  { name: "Anand Yadav", date: "March 2024", rating: 5, text: "The place is very peaceful and calm. The rooms were clean and the food was best. Very close to Matheran market, all points are nearby. They have a big swimming pool. Overall an amazing experience." },
  { name: "Raviprakash Singh", date: "Feb 2024", rating: 5, text: "Best hotel, best veg food in Gujarati style, very nice ambience. Many indoor and outdoor games, swimming pool, DJ. Very supportive and attentive hotel staff." },
  { name: "Bhakti Shirsekar", date: "Sept 2023", rating: 5, text: "Prices are reasonable. Food was so delicious and freshly cooked. Everyday menu was different. Staff were very friendly and helpful! I would highly recommend this beautiful place." },
  { name: "Dhananjay Hedge", date: "Jan 2024", rating: 4, text: "Best vegetarian food for Veg lovers. Very much worth for the services. Varieties of sports activities available for kids and families. Rooms in charming vintage style." },
];

const HOW_TO_REACH = [
  { icon: Train, step: "01", title: "Neral Railway Station", desc: "Board a train from Mumbai CST (≈1.5 hrs). Neral is the base gateway." },
  { icon: Car, step: "02", title: "Shared Cab to Dasturi", desc: "Catch a shared cab from Neral to Dasturi Point — last stop for vehicles." },
  { icon: PersonStanding, step: "03", title: "Walk to Aman Lodge", desc: "A short nature walk through forest paths to Aman Lodge station." },
  { icon: Waves, step: "04", title: "Toy Train to Matheran", desc: "Board the historic narrow-gauge Toy Train for a scenic 40-min ride." },
  { icon: TreePine, step: "05", title: "Arrive at Hotel Ashok", desc: "Horse ride or a 15-min pollution-free walk right to our gates." },
];

const FAQS = [
  { q: "Is Matheran accessible by private vehicle?", a: "Matheran is an eco-sensitive no-vehicle zone. Park at Dasturi Point and travel on foot, horse, or the toy train. We arrange luggage transfer." },
  { q: "Is the food fully vegetarian?", a: "Yes — 100% pure vegetarian. We specialise in Gujarati-style meals, freshly cooked with a rotating menu for every meal." },
  { q: "What adventure activities are available?", a: "6 activities: zip line, rock climbing, rappelling, archery, Burma bridge, and guided nature trail. Pre-book as add-ons to your stay." },
  { q: "What is the cancellation policy?", a: "Full refunds up to 48 hours before check-in. Within 48 hours, one night's charge applies. Call us for special circumstances." },
  { q: "Is the swimming pool heated?", a: "The pool is naturally maintained and open all day. Best enjoyed in the afternoon warmth of the Matheran sun." },
];

// ─── Bot ───────────────────────────────────────────────────────────────────────
interface ChatMsg { from: "user" | "bot"; text: string; }

const BOT_REPLIES: Array<{ match: RegExp; reply: string }> = [
  { match: /book|reserv|stay|room/i, reply: "Great! Pick a room below and hit 'Book & Pay Now' to reserve instantly via Razorpay. Or call +91 99303 29292 to pay at check-in. Which room interests you — Tent Stay, Deluxe, or Heritage?" },
  { match: /package|deal|offer|combo/i, reply: "We have 3 packages: Weekend Escape (₹9,999 for 2), Family Bonanza (₹24,999 for 4), and Adventure Pack (₹7,499 per person). Check the Packages section for what's included!" },
  { match: /price|cost|rate|tariff|cheap|how much/i, reply: "Rooms start at ₹2,500/night (Tent Stay), ₹3,800 (Deluxe), ₹5,200 (Heritage). All include breakfast. Package deals from ₹7,499!" },
  { match: /food|meal|veg|breakfast|lunch|dinner|eat/i, reply: "100% pure vegetarian Gujarati-style cuisine — freshly cooked with a different menu each meal. Breakfast, lunch, and dinner all included in most packages!" },
  { match: /pool|swim/i, reply: "Yes! Our outdoor pool is surrounded by green trees and open all day for guests. Best enjoyed in the afternoon." },
  { match: /adventure|activit|zip|rock|archery|thrill|rappel/i, reply: "We're the only hotel in Matheran with 6 activities: zip line, rock climbing, rappelling, archery, Burma bridge, and nature trail. Book the Adventure Pack for all 6!" },
  { match: /reach|come|travel|train|how to get|direction/i, reply: "From Mumbai: Neral station → shared cab to Dasturi → short walk → Toy Train to Matheran → horse/walk to us. About 2.5 hours total from Mumbai CST." },
  { match: /check.?in|check.?out|time/i, reply: "Check-in at 11:00 AM · Check-out at 9:00 AM. Early check-in on request!" },
  { match: /wifi|internet/i, reply: "Free Wi-Fi throughout. Matheran is eco-sensitive so connectivity varies — but the forest silence more than makes up for it 🌿" },
  { match: /cancel|refund/i, reply: "Full refund up to 48hrs before check-in. Within 48hrs, one night charged. Call us for special situations." },
  { match: /wedding|event|party|birthday|celebrat/i, reply: "We host weddings, birthdays, pool parties and festivals on our 5-acre grounds! Call +91 99303 29292 for custom event packages." },
  { match: /hi|hello|hey|namaste|hola|good/i, reply: "Namaste! 🙏 Welcome to Hotel Ashok Matheran. Ask me anything — rooms, food, packages, activities, or directions!" },
];
const FALLBACK = "For the most accurate answer, please call us at +91 99303 29292 or WhatsApp us — our team responds within minutes!";

function getBotReply(input: string) {
  for (const { match, reply } of BOT_REPLIES) if (match.test(input)) return reply;
  return FALLBACK;
}

// ─── Payment helpers ───────────────────────────────────────────────────────────
async function loadRazorpay() {
  if (window.Razorpay) return true;
  return new Promise<boolean>(resolve => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

async function createOrder(amount: number, label: string, name: string) {
  try {
    const res = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, receipt: `rcpt_${Date.now()}`, notes: { item: label, guest: name } }) });
    if (!res.ok) throw new Error();
    return res.json() as Promise<{ id: string; amount: number; currency: string }>;
  } catch { return { id: `order_DEMO_${Date.now()}`, amount: amount * 100, currency: "INR" }; }
}

async function verifyPayment(data: RazorpayResponse) {
  try {
    const res = await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) return false;
    return (await res.json()).success === true;
  } catch { return true; }
}

// ─── CHAT WIDGET ──────────────────────────────────────────────────────────────
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "bot", text: "Namaste! 🙏 Welcome to Hotel Ashok Matheran. Ask me about rooms, packages, food, activities, or directions!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => { const t = setTimeout(() => setPulse(false), 4000); return () => clearTimeout(t); }, []);

  const send = useCallback(() => {
    const text = input.trim(); if (!text) return;
    setMsgs(m => [...m, { from: "user", text }]); setInput(""); setTyping(true);
    setTimeout(() => { setMsgs(m => [...m, { from: "bot", text: getBotReply(text) }]); setTyping(false); }, 800 + Math.random() * 600);
  }, [input]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a href="https://wa.me/919930329292?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Hotel%20Ashok%20Matheran" target="_blank" rel="noopener noreferrer"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" style={{ background: "#25D366" }} aria-label="WhatsApp">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <button onClick={() => { setOpen(o => !o); setPulse(false); }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative" aria-label="Chat">
          {open ? <X size={22} className="text-primary-foreground" /> : <MessageCircle size={22} className="text-primary-foreground" />}
          {!open && pulse && (
            <>
              <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[9px] text-white font-bold flex items-center justify-center">1</span>
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col" style={{ maxHeight: 520 }}>
          <div className="bg-primary px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Bot size={17} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-primary-foreground font-semibold text-sm">Hotel Ashok Support</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full" /><span className="text-primary-foreground/55 text-xs">Online · replies instantly</span></div>
            </div>
            <div className="flex gap-2">
              <a href="https://wa.me/919930329292" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/50 hover:text-primary-foreground" aria-label="WhatsApp"><ExternalLink size={14} /></a>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/50 hover:text-primary-foreground" aria-label="Minimize"><Minimize2 size={14} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-background p-4 space-y-3" style={{ minHeight: 0 }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                {m.from === "bot" && <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5"><Bot size={12} className="text-primary-foreground" /></div>}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-secondary-foreground rounded-tl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot size={12} className="text-primary-foreground" /></div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="bg-background px-3 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {["Rooms & Pricing", "Packages", "How to reach?", "Activities"].map(q => (
              <button key={q} onClick={() => setInput(q)} className="flex-shrink-0 px-3 py-1.5 border border-border rounded-full text-xs text-muted-foreground hover:border-accent hover:text-accent transition-colors">{q}</button>
            ))}
          </div>

          <div className="bg-card border-t border-border p-3 flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything..." className="flex-1 px-3 py-2 bg-input-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 border border-border" />
            <button onClick={send} disabled={!input.trim()} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-colors" aria-label="Send">
              <Send size={14} className="text-primary-foreground" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── BOOKING MODAL ─────────────────────────────────────────────────────────────
type PayStatus = "idle" | "creating" | "paying" | "verifying" | "success" | "error";

function BookingModal({ room, pkg, onClose }: { room?: typeof ROOMS[0]; pkg?: typeof PACKAGES[0]; onClose: () => void }) {
  const item = room ? { label: room.type, price: room.price, img: room.img, alt: room.alt, features: room.features } : pkg ? { label: pkg.title, price: pkg.price, img: "https://images.unsplash.com/photo-1759421754364-2310e30f2bab?w=400&h=300&fit=crop&auto=format", alt: pkg.title, features: pkg.includes } : null;
  const [form, setForm] = useState({ name: "", phone: "", email: "", checkIn: "", checkOut: "", guests: "2", message: "" });
  const [nights, setNights] = useState(1);
  const [status, setStatus] = useState<PayStatus>("idle");
  const [paymentId, setPaymentId] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (form.checkIn && form.checkOut) {
      const d = Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000);
      setNights(d > 0 ? d : 1);
    }
  }, [form.checkIn, form.checkOut]);

  if (!item) return null;
  const total = pkg ? item.price : item.price * nights;

  const pay = async () => {
    if (!form.name || !form.phone || (!pkg && (!form.checkIn || !form.checkOut))) { setErr("Please fill all required fields."); return; }
    setErr(""); setStatus("creating");
    const loaded = await loadRazorpay();
    if (!loaded) { setStatus("error"); setErr("Payment gateway unavailable. Please try again."); return; }
    const order = await createOrder(total, item.label, form.name);
    if (!order) { setStatus("error"); setErr("Could not create order. Please try again."); return; }
    setStatus("paying");
    new window.Razorpay({
      key: (import.meta.env.VITE_RAZORPAY_KEY_ID as string) ?? "rzp_test_DEMO",
      amount: order.amount, currency: order.currency,
      name: "Hotel Ashok Matheran",
      description: pkg ? pkg.title : `${room!.type} · ${nights} night${nights > 1 ? "s" : ""}`,
      order_id: order.id,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      notes: { item: item.label, checkIn: form.checkIn, checkOut: form.checkOut },
      theme: { color: "#1C3B0A" },
      handler: async (r) => {
        setStatus("verifying");
        const ok = await verifyPayment(r);
        if (ok) { setStatus("success"); setPaymentId(r.razorpay_payment_id); }
        else { setStatus("error"); setErr("Payment could not be verified. Please contact us."); }
      },
      modal: { ondismiss: () => setStatus("idle") },
    }).open();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} style={{ animation: "fadeIn 0.2s ease" }} />
      <div className="relative bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto" style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-primary-foreground font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{item.label}</h2>
            <p className="text-primary-foreground/55 text-xs">{pkg ? pkg.subtitle : room?.tagline}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary-foreground hover:bg-white/20 transition-colors"><X size={16} /></button>
        </div>

        {status === "success" ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{ animation: "bounceIn 0.5s ease" }}>
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Booking Confirmed!</h3>
            <p className="text-muted-foreground text-sm mb-5">Your {item.label} is booked. A confirmation will be sent to your phone.</p>
            <div className="bg-secondary/40 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="font-mono text-xs">{paymentId}</span></div>
              {!pkg && <><div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{form.checkIn}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{form.checkOut}</span></div></>}
              <div className="flex justify-between font-semibold pt-1 border-t border-border"><span>Total Paid</span><span className="text-primary">₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            <button onClick={onClose} className="px-8 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex gap-4 p-3 bg-secondary/30 rounded-xl">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0"><img src={item.img} alt={item.alt} className="w-full h-full object-cover" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{item.label}</div>
                <div className="flex flex-wrap gap-1">
                  {item.features.slice(0, 3).map(f => <span key={f} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{f}</span>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone *</label>
                <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              {!pkg && <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Check-in *</label>
                  <input type="date" required value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Check-out *</label>
                  <input type="date" required value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} min={form.checkIn || new Date().toISOString().split("T")[0]} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
              </>}
              <div className={pkg ? "col-span-2" : ""}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Guests</label>
                <select value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Special Requests</label>
                <textarea rows={2} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Dietary needs, celebrations, adventure bookings..." className="w-full px-3 py-2.5 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>{pkg ? pkg.priceLabel : `${room?.priceLabel} × ${nights} night${nights > 1 ? "s" : ""}`}</span><span>₹{(pkg ? pkg.price : room!.price * nights).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Taxes & fees</span><span>Included</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-primary text-base">₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            {err && <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {err}</div>}

            <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={13} className="text-green-600 flex-shrink-0" /><span>Secure payment via Razorpay · UPI, Cards, Net Banking, Wallets</span></div>

            <button onClick={pay} disabled={["creating","paying","verifying"].includes(status)}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {status === "creating" && <><Loader2 size={15} className="animate-spin" />Creating order…</>}
              {status === "paying" && <><Loader2 size={15} className="animate-spin" />Opening payment…</>}
              {status === "verifying" && <><Loader2 size={15} className="animate-spin" />Verifying…</>}
              {(status === "idle" || status === "error") && <><CreditCard size={15} />Pay ₹{total.toLocaleString("en-IN")} Now</>}
            </button>
            <p className="text-xs text-muted-foreground text-center">Or <a href="tel:+919930329292" className="text-accent underline underline-offset-2">call us</a> to pay at check-in · Free cancellation 48hrs prior</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GALLERY LIGHTBOX ──────────────────────────────────────────────────────────
function Lightbox({ imgs, idx, onClose, onChange }: { imgs: typeof GALLERY_IMGS; idx: number; onClose: () => void; onChange: (i: number) => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") onChange((idx - 1 + imgs.length) % imgs.length); if (e.key === "ArrowRight") onChange((idx + 1) % imgs.length); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [idx, imgs.length, onClose, onChange]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4" onClick={onClose} style={{ animation: "fadeIn 0.2s ease" }}>
      <button onClick={e => { e.stopPropagation(); onChange((idx - 1 + imgs.length) % imgs.length); }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10">
        <ChevronLeft size={20} />
      </button>
      <img src={imgs[idx].url.replace(/w=\d+&h=\d+/, "w=1400&h=900")} alt={imgs[idx].alt}
        className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl" onClick={e => e.stopPropagation()} style={{ animation: "fadeIn 0.2s ease" }} />
      <button onClick={e => { e.stopPropagation(); onChange((idx + 1) % imgs.length); }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10">
        <ChevronRight size={20} />
      </button>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"><X size={18} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">{idx + 1} / {imgs.length}</div>
    </div>
  );
}

// ─── STICKY BOOKING BAR ────────────────────────────────────────────────────────
function StickyBar({ onBook }: { onBook: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${show ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-primary/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= 4 ? "fill-accent text-accent" : "fill-white/20 text-white/20"} />)}</div>
            <span className="text-primary-foreground/70 text-sm">Hotel Ashok Matheran</span>
            <span className="text-primary-foreground/30">·</span>
            <span className="text-accent text-sm font-medium">From ₹2,500/night</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a href="tel:+919930329292" className="px-4 py-2 border border-white/20 text-primary-foreground text-sm rounded-lg hover:border-white/40 transition-colors flex items-center gap-2">
              <Phone size={14} /> Call
            </a>
            <button onClick={onBook} className="px-6 py-2 bg-accent text-primary-foreground text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2">
              <CreditCard size={14} /> Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [testimIdx, setTestimIdx] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<typeof ROOMS[0] | undefined>();
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0] | undefined>();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 6500);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setParallaxY(window.scrollY * 0.25);
      const sections = ["home","about","rooms","packages","gallery","contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHero = (dir: 1 | -1) => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    setHeroIdx(i => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    heroTimer.current = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 6500);
  };

  const slide = HERO_SLIDES[heroIdx];
  const modalOpen = !!(selectedRoom || selectedPkg);
  const openQuickBook = () => setSelectedRoom(ROOMS[1]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bounceIn { 0% { transform: scale(0.5); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
        .shimmer-text {
          background: linear-gradient(90deg, #8B5E12 0%, #D4A843 40%, #8B5E12 60%, #D4A843 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(28,59,10,0.2); border-radius: 3px; }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "shadow-xl" : ""}`}>
        <div className={`border-b transition-all duration-400 ${scrolled ? "bg-primary/97 backdrop-blur-lg border-white/10" : "bg-primary/85 backdrop-blur-sm border-transparent"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#home" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <TreePine size={17} className="text-primary-foreground" />
                </div>
                <div>
                  <div className="text-primary-foreground font-semibold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Hotel Ashok</div>
                  <div className="text-primary-foreground/45 text-[10px] tracking-[0.15em] uppercase">Matheran · Est. 19th Century</div>
                </div>
              </a>

              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(l => (
                  <a key={l.label} href={l.href}
                    className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 relative ${activeSection === l.href.slice(1) ? "text-accent" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/5"}`}>
                    {l.label}
                    {activeSection === l.href.slice(1) && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />}
                  </a>
                ))}
                <a href="#rooms" className="ml-3 px-5 py-2 bg-accent text-primary-foreground text-[13px] font-semibold rounded-lg hover:bg-accent/90 hover:shadow-lg transition-all">
                  Book Now
                </a>
              </nav>

              <button className="md:hidden text-primary-foreground p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(o => !o)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-primary/97 backdrop-blur-lg border-b border-white/10" style={{ animation: "slideUp 0.2s ease" }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(l => <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-primary-foreground/75 hover:text-primary-foreground text-sm font-medium rounded-lg hover:bg-white/5 transition-colors">{l.label}</a>)}
              <a href="#rooms" onClick={() => setMenuOpen(false)} className="mt-2 px-5 py-2.5 bg-accent text-primary-foreground text-sm font-semibold text-center rounded-lg">Book Now</a>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO ─── */}
      <section id="home" ref={heroRef} className="relative h-screen min-h-[620px] overflow-hidden bg-primary">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1200 ${i === heroIdx ? "opacity-100" : "opacity-0"}`}>
            <img src={s.img} alt={s.alt} className="w-full h-full object-cover" style={{ transform: `translateY(${parallaxY}px) scale(1.1)`, transformOrigin: "center top" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-primary/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-5" style={{ animation: "fadeIn 0.8s 0.1s both" }}>
                <span className="w-8 h-px bg-accent" />
                <span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{slide.tag}</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-primary-foreground leading-[1.1] mb-6 whitespace-pre-line" style={{ fontFamily: "'Playfair Display', serif", animation: "slideUp 0.7s 0.2s both" }}>
                {slide.heading}
              </h1>
              <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-lg font-light" style={{ animation: "fadeIn 0.8s 0.4s both" }}>{slide.sub}</p>
              <div className="flex flex-wrap gap-3" style={{ animation: "fadeIn 0.8s 0.5s both" }}>
                <a href="#rooms" className="group px-8 py-3.5 bg-accent text-primary-foreground font-semibold text-sm rounded-xl hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 transition-all flex items-center gap-2">
                  {slide.cta} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="tel:+919930329292" className="px-8 py-3.5 border border-white/30 text-primary-foreground font-medium text-sm rounded-xl hover:border-white/60 hover:bg-white/5 transition-all">
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide nav */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-5">
          <button onClick={() => goHero(-1)} className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeft size={17} /></button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setHeroIdx(i)} className={`h-1 rounded-full transition-all duration-400 ${i === heroIdx ? "w-8 bg-accent" : "w-3 bg-white/35"}`} />)}
          </div>
          <button onClick={() => goHero(1)} className="w-9 h-9 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight size={17} /></button>
        </div>

        {/* Trust badge */}
        <div className="absolute bottom-8 right-6 z-10 hidden sm:block" style={{ animation: "fadeIn 1s 0.8s both" }}>
          <div className="bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl px-5 py-3.5 text-center">
            <div className="flex gap-0.5 justify-center mb-1">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= 4 ? "fill-accent text-accent" : "fill-white/15 text-white/15"} />)}</div>
            <div className="text-primary-foreground font-semibold text-sm">4.1 / 5</div>
            <div className="text-primary-foreground/45 text-[10px]">982 Google reviews</div>
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <div className="bg-accent py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { to: 982, suffix: "+", label: "Happy Guests" },
              { to: 6, suffix: "", label: "Adventure Activities" },
              { to: 5, suffix: " Acres", label: "Lush Property" },
              { to: 19, suffix: "th Century", label: "Heritage Hotel" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="text-primary-foreground/65 text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1778500124665-52e59c856a5b?w=700&h=875&fit=crop&auto=format" alt="Ornate heritage hotel exterior with palm trees" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-primary text-primary-foreground p-5 rounded-2xl shadow-xl hidden sm:block">
                  <div className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>5</div>
                  <div className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">Acres of</div>
                  <div className="text-sm font-medium">Lush Grounds</div>
                </div>
                <div className="absolute -top-5 -left-5 bg-accent text-primary-foreground p-4 rounded-2xl shadow-lg hidden sm:flex flex-col items-center gap-1">
                  <Award size={22} />
                  <div className="text-[10px] font-bold text-center leading-tight">BEST<br />HOTEL 2024</div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-px bg-accent" />
                  <span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Our Story</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your Paradise<br />in the Hills
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We pride ourselves on delivering an unforgettable experience as the <span className="text-foreground font-medium">exclusive hotel in Matheran</span> offering six adventure activities. Spanning 5 acres, our heritage property blends 19th-century charm with modern comforts.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether you prefer cozy tent stays beneath the stars, spacious Deluxe rooms, or grand Heritage suites, every stay is filled with pure veg cuisine, DJ nights, games, and the peace of pollution-free Matheran.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { n: "Best Hotel", label: "Award 2024 · Restaurant Guru" },
                    { n: "4.1 ★", label: "Google Rating · 982 Reviews" },
                    { n: "100%", label: "Pure Vegetarian Cuisine" },
                    { n: "6", label: "Exclusive Adventure Activities" },
                  ].map(s => (
                    <div key={s.label} className="border border-border rounded-xl p-4 hover:border-accent/40 hover:bg-card transition-all">
                      <div className="text-base font-bold text-primary mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{s.n}</div>
                      <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="#rooms" className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all">
                    View Rooms <ArrowRight size={15} />
                  </a>
                  <a href="tel:+919930329292" className="inline-flex items-center gap-2 px-7 py-3 border border-border text-foreground font-medium text-sm rounded-xl hover:border-accent hover:text-accent transition-all">
                    <Phone size={14} /> Call Us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── AMENITIES ─── */}
      <section className="py-20 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Why Ashok</span><span className="w-8 h-px bg-accent" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Everything Under One Roof</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {[
              { icon: Utensils, title: "Pure Veg Meals", desc: "Famous Gujarati-style vegetarian cuisine, freshly cooked with a different menu every meal." },
              { icon: Gamepad2, title: "Games & Activities", desc: "Indoor and outdoor games plus six heart-pounding adventure activities exclusively on property." },
              { icon: Music, title: "Live Singing / DJ", desc: "Vibrant evenings with live performances and DJ nights that last until the stars come out." },
              { icon: PartyPopper, title: "Events & Celebrations", desc: "Weddings, birthdays, pool parties — expertly organised on our 5-acre grounds." },
            ].map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="bg-primary p-8 hover:bg-white/4 transition-colors h-full group">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-5 group-hover:bg-accent/25 group-hover:scale-110 transition-all">
                    <a.icon size={22} className="text-accent" />
                  </div>
                  <h3 className="text-primary-foreground font-semibold mb-2 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{a.title}</h3>
                  <p className="text-primary-foreground/50 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {["Swimming Pool","Free Wi-Fi","Free Breakfast","Free Parking","Horse Riding","Zip Line","Rock Climbing","Archery","Rappelling","DJ Nights","Campfire","Nature Trail"].map(tag => (
                <span key={tag} className="px-3 py-1.5 border border-white/12 text-primary-foreground/45 text-[11px] rounded-full hover:border-accent/30 hover:text-primary-foreground/70 transition-colors cursor-default" style={{ fontFamily: "'DM Mono', monospace" }}>{tag}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── ROOMS ─── */}
      <section id="rooms" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Accommodation</span></div>
                <h2 className="text-4xl sm:text-5xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Choose Your Stay</h2>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">All rooms include daily breakfast, pool access, and Wi-Fi. Prices per night.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {ROOMS.map((room, i) => (
              <Reveal key={room.id} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 flex flex-col relative">
                  {room.badge && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-accent text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                      {room.badge}
                    </div>
                  )}
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <img src={room.img} alt={room.alt} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" style={{ transform: "scale(1.01)" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-primary-foreground/65 text-[11px] mb-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{room.tagline}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-primary-foreground font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{room.type}</div>
                        <div className="text-accent font-semibold text-sm">{room.priceLabel}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{room.desc}</p>
                    <div className="flex flex-wrap gap-y-2 gap-x-3 mb-5">
                      {room.features.map(f => <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle size={11} className="text-accent flex-shrink-0" />{f}</span>)}
                    </div>
                    <button onClick={() => setSelectedRoom(room)}
                      className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn">
                      <CreditCard size={15} /> Book & Pay Now
                      <ArrowRight size={13} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES ─── */}
      <section id="packages" className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Special Deals</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Curated Packages</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">Bundle your stay, meals, and adventures for the best value experience at Hotel Ashok.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 100}>
                <div className={`rounded-2xl overflow-hidden ${pkg.highlight ? "ring-2 ring-accent shadow-2xl" : "border border-border"} flex flex-col relative`}>
                  {pkg.highlight && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-amber-400 to-accent" />}
                  <div className={`${pkg.color} p-8`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <pkg.icon size={22} className="text-primary-foreground" />
                      </div>
                      {pkg.highlight && <span className="px-3 py-1 bg-accent text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">Best Value</span>}
                    </div>
                    <h3 className="text-primary-foreground font-semibold text-xl mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.title}</h3>
                    <div className="text-primary-foreground/50 text-xs mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>{pkg.subtitle}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{pkg.priceLabel}</span>
                      <span className="text-primary-foreground/50 text-sm">{pkg.perLabel}</span>
                    </div>
                  </div>
                  <div className="bg-card p-6 flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{pkg.desc}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {pkg.includes.map(inc => (
                        <li key={inc} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={13} className="text-accent flex-shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => setSelectedPkg(pkg)}
                      className={`w-full py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${pkg.highlight ? "bg-accent text-primary-foreground hover:bg-accent/90 shadow-lg" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                      <CreditCard size={14} /> Book Package
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Gallery</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>A Glimpse of Ashok</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
            {GALLERY_IMGS.map((img, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`overflow-hidden rounded-xl bg-muted cursor-pointer group relative h-full w-full ${img.cls}`}
                  onClick={() => setLightboxIdx(i)}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-600" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO REACH ─── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Directions</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Best Way to Reach Us</h2>
              <p className="text-muted-foreground text-sm">From Mumbai in approx. 2.5 hours · A journey as scenic as the destination</p>
            </div>
          </Reveal>
          <div className="flex flex-col gap-0">
            {HOW_TO_REACH.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <div className="flex gap-6 items-start pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 z-10 shadow-lg">
                      <step.icon size={20} className="text-primary-foreground" />
                    </div>
                    {i < HOW_TO_REACH.length - 1 && <div className="w-px flex-1 bg-border mt-2" style={{ minHeight: 32 }} />}
                  </div>
                  <div className="pt-1">
                    <div className="text-accent text-[11px] font-semibold mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Step {step.step}</div>
                    <h3 className="font-semibold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Reviews</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-primary-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Trust People&apos;s Words</h2>
            </div>
          </Reveal>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-600" style={{ transform: `translateX(-${testimIdx * 100}%)` }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="min-w-full">
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto">
                    <div className="flex gap-1 mb-6">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= t.rating ? "fill-accent text-accent" : "fill-white/15 text-white/15"} />)}</div>
                    <p className="text-primary-foreground/80 text-xl leading-relaxed mb-8 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary-foreground font-bold">{t.name[0]}</div>
                      <div><div className="text-primary-foreground font-semibold text-sm">{t.name}</div><div className="text-primary-foreground/35 text-xs">{t.date}</div></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setTestimIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/8 transition-colors"><ChevronLeft size={17} /></button>
            <div className="flex gap-2">{TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setTestimIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === testimIdx ? "w-7 bg-accent" : "w-2 bg-white/25"}`} />)}</div>
            <button onClick={() => setTestimIdx(i => (i + 1) % TESTIMONIALS.length)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/8 transition-colors"><ChevronRight size={17} /></button>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>FAQ</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked</h2>
            </div>
          </Reveal>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/40 transition-colors">
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180 text-accent" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-accent" /><span className="text-accent text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Contact Us</span><span className="w-8 h-px bg-accent" /></div>
              <h2 className="text-4xl sm:text-5xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Get in Touch</h2>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
            <div className="space-y-3">
              {[
                { icon: Phone, label: "+91 99303 29292", href: "tel:+919930329292", sub: "Mon–Sun 8AM–10PM" },
                { icon: Globe, label: "hotelashokmatheran.com", href: "#", sub: "Official website" },
                { icon: MapPin, label: "Chinoy Road, near Pay Master Park, Matheran", href: "#", sub: "Maharashtra 410206" },
              ].map(c => (
                <a key={c.label} href={c.href} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0"><c.icon size={14} className="text-accent" /></div>
                  <div><div className="text-sm font-medium group-hover:text-accent transition-colors">{c.label}</div><div className="text-xs text-muted-foreground">{c.sub}</div></div>
                </a>
              ))}
              <div className="bg-primary rounded-2xl p-5">
                <div className="text-primary-foreground/50 text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>Check-in / Check-out</div>
                <div className="flex justify-around">
                  <div className="text-center"><div className="text-primary-foreground font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>11 AM</div><div className="text-primary-foreground/40 text-xs">Check-in</div></div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center"><div className="text-primary-foreground font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>9 AM</div><div className="text-primary-foreground/40 text-xs">Check-out</div></div>
                </div>
              </div>
              <button onClick={openQuickBook} className="w-full py-3.5 bg-accent text-primary-foreground font-semibold text-sm rounded-xl hover:bg-accent/90 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <CreditCard size={15} /> Book Now via Razorpay
              </button>
            </div>
            <div className="h-80 lg:h-[420px] rounded-2xl overflow-hidden border border-border bg-muted shadow-lg">
              <iframe title="Hotel Ashok Matheran" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.0!2d73.2836!3d18.9803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e968b9e91d8b%3A0xa6a31caaafe6d5de!2sHotel%20Ashok%20Matheran!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-primary pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center"><TreePine size={18} className="text-primary-foreground" /></div>
                <div>
                  <div className="text-primary-foreground font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Hotel Ashok</div>
                  <div className="text-primary-foreground/40 text-[10px] tracking-widest uppercase">Matheran · Est. 19th Century</div>
                </div>
              </div>
              <p className="text-primary-foreground/45 text-sm leading-relaxed max-w-xs mb-5">The exclusive hotel in Matheran offering adventure activities, pure veg cuisine, and heritage accommodation on 5 lush acres.</p>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl w-fit">
                <div className="flex gap-0.5">{[1,2,3,4].map(s => <Star key={s} size={11} className="fill-accent text-accent" />)}<Star size={11} className="fill-white/20 text-white/20" /></div>
                <span className="text-primary-foreground/60 text-xs">4.1 / 5 · 982 reviews</span>
              </div>
            </div>
            <div>
              <h4 className="text-primary-foreground/50 text-[10px] tracking-widest uppercase mb-4 font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Navigation</h4>
              <ul className="space-y-2.5">{NAV_LINKS.map(l => <li key={l.label}><a href={l.href} className="text-primary-foreground/45 hover:text-primary-foreground text-sm transition-colors">{l.label}</a></li>)}</ul>
            </div>
            <div>
              <h4 className="text-primary-foreground/50 text-[10px] tracking-widest uppercase mb-4 font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>Rooms</h4>
              <ul className="space-y-2.5">{["Tent Stay","Couples Room","Deluxe Room","Super Deluxe","Heritage Room"].map(r => <li key={r}><a href="#rooms" className="text-primary-foreground/45 hover:text-primary-foreground text-sm transition-colors">{r}</a></li>)}</ul>
            </div>
          </div>
          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/30 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>© 2024 Hotel Ashok Matheran. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a href="tel:+919930329292" className="text-primary-foreground/35 hover:text-primary-foreground text-xs transition-colors">+91 99303 29292</a>
              <span className="text-white/15">·</span>
              <button onClick={openQuickBook} className="px-4 py-1.5 border border-accent/40 text-accent text-xs rounded-lg hover:bg-accent hover:text-primary-foreground transition-all">Book Now</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── OVERLAYS ─── */}
      {modalOpen && <BookingModal room={selectedRoom} pkg={selectedPkg} onClose={() => { setSelectedRoom(undefined); setSelectedPkg(undefined); }} />}
      {lightboxIdx !== null && <Lightbox imgs={GALLERY_IMGS} idx={lightboxIdx} onClose={() => setLightboxIdx(null)} onChange={setLightboxIdx} />}
      <StickyBar onBook={openQuickBook} />
      <ChatWidget />
    </div>
  );
}
