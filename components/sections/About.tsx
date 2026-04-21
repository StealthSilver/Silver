"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GeistMono } from "geist/font/mono";
import { useTheme } from "next-themes";
import {
  BriefcaseBusiness,
  ArrowUpRight,
  Check,
  Copy,
  Rocket,
  MapPin,
  Clock3,
  Phone,
  Mail,
  Globe,
  UserRound,
} from "lucide-react";
import {
  FaXTwitter,
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaYoutube,
} from "react-icons/fa6";

const aboutItems = [
  { id: "role", icon: BriefcaseBusiness, type: "role" as const },
  { id: "founder", icon: Rocket, value: "Founder @Cluster" },
  { id: "location", icon: MapPin, type: "location" as const },
  { id: "phone", icon: Phone, type: "phone" as const, value: "+91 8533922485" },
  { id: "email", icon: Mail, type: "email" as const, value: "saraswatrajat12@gmail.com" },
  { id: "website", icon: Globe, type: "website" as const, value: "silver.com" },
  { id: "pronouns", icon: UserRound, value: "he/him" },
] as const;

const socialItems = [
  { label: "X", href: "https://x.com/silver_srs", icon: FaXTwitter, themeAware: true },
  { label: "GitHub", href: "https://github.com/StealthSilver", icon: FaGithub, themeAware: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rajat-saraswat-0491a3259/",
    icon: FaLinkedin,
    color: "#0A66C2",
  },
  {
    label: "Chess.com",
    href: "https://www.chess.com/member/lost_penguu",
    iconSvg: "/icons/chess.png",
  },
  { label: "Discord", href: "https://discord.com/users/rajat_28969", icon: FaDiscord, color: "#5865F2" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCzBMm1NyjUM7IOay4A_GE9w",
    icon: FaYoutube,
    color: "#FF0000",
  },
] as const;

function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const asUtcMs = Date.UTC(
    lookup("year"),
    lookup("month") - 1,
    lookup("day"),
    lookup("hour"),
    lookup("minute"),
    lookup("second"),
  );

  return (asUtcMs - date.getTime()) / 60000;
}

function formatHourDelta(hours: number) {
  const absHours = Math.abs(hours);
  const value = Number.isInteger(absHours) ? absHours.toFixed(0) : absHours.toFixed(1);
  if (hours === 0) return "same time zone";
  return hours > 0 ? `${value}h ahead` : `${value}h behind`;
}

export default function About() {
  const [now, setNow] = useState<Date | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1200);
    } catch {
      setCopiedKey(null);
    }
  };

  const timezoneValue = useMemo(() => {
    if (!now) return "--:-- // loading...";

    const bengaluruTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    const viewerOffset = getTimeZoneOffsetMinutes(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
    const bengaluruOffset = getTimeZoneOffsetMinutes(now, "Asia/Kolkata");
    const hourDelta = (bengaluruOffset - viewerOffset) / 60;

    return `${bengaluruTime} // ${formatHourDelta(hourDelta)}`;
  }, [now]);

  return (
    <section id="about" className="relative px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {aboutItems.map(({ id, icon: Icon, value, type }) => (
          <div key={id} className="group flex items-center gap-3 border border-line bg-background px-3 py-2.5">
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
              aria-hidden
            >
              <Icon className="size-4" strokeWidth={1.7} />
            </span>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <p className={`${GeistMono.className} truncate text-[14px] text-foreground`}>
                {type === "role" ? (
                  <>
                    Design Engineer @
                    <a
                      href="https://www.eleken.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline underline-offset-2 transition-all duration-200 ease-out"
                    >
                      eleken
                    </a>
                  </>
                ) : null}

                {type === "location" ? (
                  <a
                    href="https://www.google.com/maps/place/Bangaluru/data=!4m2!3m1!1s0x3bae1670c9b44e6d:0xf8dfc3e8517e4fe0?sa=X&ved=1t:155783&ictx=111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:underline underline-offset-2 transition-all duration-200 ease-out"
                  >
                    Bengaluru, India
                  </a>
                ) : null}

                {type === "email" ? (
                  <a
                    href="mailto:saraswatrajat12@gmail.com"
                    className="no-underline hover:underline underline-offset-2 transition-all duration-200 ease-out"
                  >
                    saraswatrajat12@gmail.com
                  </a>
                ) : null}

                {type === "phone" ? (
                  <a
                    href="tel:+918533922485"
                    className="no-underline hover:underline underline-offset-2 transition-all duration-200 ease-out"
                  >
                    +91 8533922485
                  </a>
                ) : null}

                {type === "website" ? (
                  <a
                    href="https://silver.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:underline underline-offset-2 transition-all duration-200 ease-out"
                  >
                    silver.com
                  </a>
                ) : null}

                {!type ? value : null}
              </p>

              {type === "email" || type === "phone" ? (
                <button
                  type="button"
                  onClick={() => copyToClipboard(type, value)}
                  className="inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground opacity-0 transition-[opacity,color,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none"
                  aria-label={`Copy ${type}`}
                  title={`Copy ${type}`}
                >
                  {copiedKey === type ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              ) : null}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 border border-line bg-background px-3 py-2.5 sm:col-start-2 sm:row-start-4">
          <span
            className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
            aria-hidden
          >
            <Clock3 className="size-4" strokeWidth={1.7} />
          </span>
          <p className={`${GeistMono.className} text-[14px] text-foreground`}>{timezoneValue}</p>
        </div>
      </div>

      <div className="relative left-1/2 my-4 h-px w-screen max-w-none -translate-x-1/2 bg-line" aria-hidden />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {socialItems.map(({ label, href, icon: Icon, color, iconSvg, themeAware }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 border border-line bg-background px-3 py-2.5 transition-colors hover:bg-muted/20"
          >
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
              aria-hidden
            >
              {iconSvg ? (
                <Image src={iconSvg} alt="" width={16} height={16} className="size-4" />
              ) : (
                Icon && (
                  <Icon
                    className="size-4"
                    style={{
                      color: themeAware ? (mounted && resolvedTheme === "dark" ? "#F3F4F6" : "#111111") : color,
                    }}
                  />
                )
              )}
            </span>
            <span
              className={`${GeistMono.className} min-w-0 flex-1 text-[14px] text-foreground no-underline transition-all duration-200 ease-out group-hover:underline underline-offset-2`}
            >
              {label}
            </span>
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden
            />
          </a>
        ))}
      </div>
    </section>
  );
}
