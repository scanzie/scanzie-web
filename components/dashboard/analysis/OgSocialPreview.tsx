"use client";
import React, { useState } from "react";
import { OnPageAnalysis } from "./AnalysisDetails"; // adjust import path as needed
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OGSocialPreviewProps {
  on_page: OnPageAnalysis;
  pageUrl: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const truncate = (str: string | undefined, max: number) => {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
};

const domain = (url: string | undefined) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// ─── Google Preview ───────────────────────────────────────────────────────────

const GooglePreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  faviconUrl: string;
  url: string;
}> = ({ og, faviconUrl, url }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 max-w-xl">
    {/* breadcrumb */}
    <div className="flex items-center gap-1.5 mb-1">
      {og?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={faviconUrl}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <span className="text-sm text-[#202124]">{domain(og?.url || url)}</span>
      <span className="text-sm text-[#202124]">›</span>
      <span className="text-sm text-[#202124] truncate max-w-xs">
        {truncate(og?.url || url, 40)}
      </span>
    </div>
    {/* title */}
    <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
      {truncate(og?.title, 60) || "No title"}
    </h3>
    {/* description */}
    <p className="text-sm text-[#4d5156] leading-snug">
      {truncate(og?.description, 160) || "No description available."}
    </p>
  </div>
);

// ─── Bing Preview ────────────────────────────────────────────────────────────

const BingPreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  url: string;
}> = ({ og, url }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 max-w-xl">
    {/* title */}
    <h3 className="text-lg text-[#001ba0] hover:underline cursor-pointer leading-tight mb-0.5">
      {truncate(og?.title, 65) || "No title"}
    </h3>
    {/* url */}
    <div className="text-sm text-[#008000] mb-1">
      {truncate(og?.url || url, 60)}
    </div>
    {/* description */}
    <p className="text-sm text-[#767676] leading-snug">
      {truncate(og?.description, 160) || "No description available."}
    </p>
  </div>
);

// ─── Facebook Preview ─────────────────────────────────────────────────────────

const FacebookPreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  url: string;
}> = ({ og, url }) => (
  <div className="max-w-sm rounded-b-xl overflow-hidden border border-[#dadde1] bg-[#f2f3f5]">
    {og?.image ?
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={og.image}
        alt={og.imageAlt || ""}
        className="w-full object-cover"
        style={{ aspectRatio: "1.91/1" }}
        onError={(e) => {
          (e.target as HTMLImageElement).parentElement!.style.background =
            "#e4e6ea";
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    : <div className="w-full bg-[#e4e6ea]" style={{ aspectRatio: "1.91/1" }} />}
    <div className="px-3 py-2.5 border-t border-[#dadde1]">
      <p className="text-[11px] uppercase text-[#606770] tracking-wide mb-0.5">
        {domain(og?.url || url)}
      </p>
      <p className="text-[15px] font-semibold text-[#1d2129] leading-snug">
        {truncate(og?.title, 60) || "No title"}
      </p>
      <p className="text-[13px] text-[#606770] leading-snug mt-0.5">
        {truncate(og?.description, 100) || ""}
      </p>
    </div>
  </div>
);

// ─── LinkedIn Preview ─────────────────────────────────────────────────────────

const LinkedInPreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  url: string;
}> = ({ og, url }) => (
  <div className="max-w-sm rounded-xl overflow-hidden border border-[#e0e0e0] bg-white shadow-sm">
    {og?.image ?
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={og.image}
        alt={og.imageAlt || ""}
        className="w-full object-cover"
        style={{ aspectRatio: "1.91/1" }}
        onError={(e) => {
          (e.target as HTMLImageElement).parentElement!.style.background =
            "#eef3f8";
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    : <div className="w-full bg-[#eef3f8]" style={{ aspectRatio: "1.91/1" }} />}
    <div className="px-3 py-3 bg-[#f3f6f8] border-t border-[#e0e0e0]">
      <p className="text-[14px] font-semibold text-[#000000e6] leading-snug">
        {truncate(og?.title, 70) || "No title"}
      </p>
      <p className="text-[12px] text-[#00000099] mt-0.5">
        {domain(og?.url || url)}
      </p>
    </div>
  </div>
);

// ─── Twitter / X Preview ──────────────────────────────────────────────────────

const TwitterPreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  tw: OnPageAnalysis["twitterCard"];
  url: string;
}> = ({ og, tw, url }) => {
  const title = tw?.title || og?.title;
  const description = tw?.description || og?.description;
  const image = tw?.image || og?.image;
  const imageAlt = tw?.imageAlt || og?.imageAlt;
  const cardType = tw?.card || "summary_large_image";

  const isLarge = cardType === "summary_large_image";

  return (
    <div
      className={`max-w-sm rounded-2xl overflow-hidden border border-[#2f3336] bg-black text-white ${
        isLarge ? "" : "flex"
      }`}
    >
      {image ?
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={imageAlt || ""}
          className={`object-cover ${
            isLarge ? "w-full" : "w-24 h-24 shrink-0"
          }`}
          style={isLarge ? { aspectRatio: "2/1" } : {}}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      : <div
          className={`bg-[#1a1a1a] ${isLarge ? "w-full" : "w-24 h-24 shrink-0"}`}
          style={isLarge ? { aspectRatio: "2/1" } : {}}
        />
      }
      <div className="px-3 py-2.5">
        <p className="text-[13px] text-[#71767b]">{domain(og?.url || url)}</p>
        <p className="text-[15px] font-bold text-white leading-snug mt-0.5">
          {truncate(title, 60) || "No title"}
        </p>
        {description && (
          <p className="text-[13px] text-[#71767b] mt-0.5">
            {truncate(description, 100)}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Telegram Preview ────────────────────────────────────────────────────────

const TelegramPreview: React.FC<{
  og: OnPageAnalysis["openGraph"];
  url: string;
}> = ({ og, url }) => (
  <div className="max-w-sm">
    {/* Chat bubble wrapper */}
    <div className="bg-[#effdde] rounded-2xl rounded-tl-sm overflow-hidden shadow-sm border border-[#c8e6c9] max-w-xs">
      {og?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={og.image}
          alt={og.imageAlt || ""}
          className="w-full object-cover"
          style={{ aspectRatio: "1.91/1" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="px-3 py-2 border-l-4" style={{ borderColor: "#4fae4e" }}>
        <p className="text-[13px] font-semibold text-[#4fae4e]">
          {og?.siteName || domain(og?.url || url)}
        </p>
        <p className="text-[13px] font-medium text-[#222] leading-snug">
          {truncate(og?.title, 60) || "No title"}
        </p>
        {og?.description && (
          <p className="text-[12px] text-[#555] mt-0.5">
            {truncate(og.description, 80)}
          </p>
        )}
      </div>
    </div>
  </div>
);

// ─── Tab bar helper ───────────────────────────────────────────────────────────

interface TabBarProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, active, onChange }) => (
  <div className="flex gap-6 p-1 w-fit mb-5">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={`flex items-center cursor-pointer gap-2 py-1.5 text-sm font-medium transition-all duration-150 ${
          active === t.id ?
            "border-b-2 border-b-blue-600 text-gray-900 "
          : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

// ─── SVG brand icons (inline, no external deps) ───────────────────────────────

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const BingIcon = () => (
  <Image src="/bing.png" alt="Bing Icon" height={24} width={24} />
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#26A5E4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const OGSocialPreview: React.FC<OGSocialPreviewProps> = ({
  on_page,
  pageUrl,
}) => {
  const [searchTab, setSearchTab] = useState("google");
  const [socialTab, setSocialTab] = useState("linkedin");

  const og = on_page?.openGraph;
  const tw = on_page?.twitterCard;

  const searchTabs = [
    { id: "google", label: "Google", icon: <GoogleIcon /> },
    { id: "bing", label: "Bing", icon: <BingIcon /> },
  ];

  const socialTabs = [
    { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
    { id: "facebook", label: "Facebook", icon: <FacebookIcon /> },
    { id: "twitter", label: "X ", icon: <TwitterXIcon /> },
    { id: "telegram", label: "Telegram", icon: <TelegramIcon /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* ── Search Engine Preview ── */}
      <div className="bg-white rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 duration-300 border border-gray-100">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Search Engine Preview</h3>
          <p className="text-sm text-gray-400 mt-1">
            How your link appears on search results
          </p>
        </div>
        <TabBar tabs={searchTabs} active={searchTab} onChange={setSearchTab} />
        <div className="transition-all duration-200">
          {searchTab === "google" && (
            <GooglePreview
              og={og}
              faviconUrl={on_page.favicon.url}
              url={pageUrl}
            />
          )}
          {searchTab === "bing" && <BingPreview og={og} url={pageUrl} />}
        </div>
      </div>

      {/* ── Social Media Preview ── */}
      <div className="bg-white rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 duration-300 border border-gray-100">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Social Media Preview</h3>
          <p className="text-sm text-gray-400 mt-1">
            How your link appears when shared
          </p>
        </div>
        <TabBar tabs={socialTabs} active={socialTab} onChange={setSocialTab} />
        <div className="mx-auto transition-all duration-200">
          <div className="max-w-sm mx-auto">
            {socialTab === "linkedin" && (
              <LinkedInPreview og={og} url={pageUrl} />
            )}
            {socialTab === "facebook" && (
              <FacebookPreview og={og} url={pageUrl} />
            )}
            {socialTab === "twitter" && (
              <TwitterPreview og={og} tw={tw} url={pageUrl} />
            )}
            {socialTab === "telegram" && (
              <TelegramPreview og={og} url={pageUrl} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OGSocialPreview;
