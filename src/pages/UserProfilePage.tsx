import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Share2,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  ShieldCheck,
  Link2,
} from "lucide-react";
import {
  userProfileApi,
  PublicProfileResponse,
} from "../api/userProfileApi";

/* =========================
   TYPES
========================= */

interface UserProfilePageProps {
  handle: string;
}

type IconProps = {
  className?: string;
};

/* =========================
   BRAND ICONS
========================= */

const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2H21.5l-7.51 8.59L22.9 22h-6.955l-5.445-7.12L4.24 22H1l8.03-9.19L1.5 2h7.13l4.92 6.51L18.244 2Zm-1.22 18h1.833L7.06 3.89H5.11L17.024 20Z" />
  </svg>
);

const DiscordIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.196.35-.42.82-.578 1.194a18.27 18.27 0 0 0-5.61 0A11.6 11.6 0 0 0 9.11 3a19.74 19.74 0 0 0-4.435 1.372C1.62 8.845.897 13.21 1.259 17.516a19.9 19.9 0 0 0 6.031 3.048c.486-.66.919-1.36 1.29-2.098a12.9 12.9 0 0 1-2.032-.975c.17-.124.337-.253.498-.386a14.24 14.24 0 0 0 12.191 0c.163.14.33.269.498.386-.646.383-1.327.71-2.035.976.372.737.804 1.437 1.29 2.097a19.83 19.83 0 0 0 6.036-3.047c.425-4.993-.723-9.317-3.71-13.148ZM8.02 14.9c-1.183 0-2.157-1.09-2.157-2.43 0-1.34.955-2.432 2.157-2.432 1.21 0 2.176 1.1 2.157 2.432 0 1.34-.955 2.43-2.157 2.43Zm7.973 0c-1.183 0-2.157-1.09-2.157-2.43 0-1.34.955-2.432 2.157-2.432 1.21 0 2.176 1.1 2.157 2.432 0 1.34-.947 2.43-2.157 2.43Z" />
  </svg>
);

const GithubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.05 3.29 9.33 7.86 10.84.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.07 11.07 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.39-5.27 5.67.42.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.53 11.53 0 0 0 23.5 12.03C23.5 5.74 18.27.5 12 .5Z" />
  </svg>
);

const TelegramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.94 4.3 18.6 20.14c-.25 1.12-.9 1.4-1.83.87l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.49c.41-.36-.09-.56-.63-.2L6.1 12.7l-5.02-1.57c-1.09-.34-1.1-1.09.23-1.61L20.6 3.15c.9-.34 1.7.21 1.34 1.15Z" />
  </svg>
);

const FarcasterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.5 3h13v2.2H17V21h-2.4v-8.6h-5.2V21H7V5.2H5.5V3Zm-2.3 5.1L4.4 11h1.35v7.65H3.2V11h-.9L3.2 8.1Zm17.6 0 1.2 2.9h1.35v7.65h-2.55V11h-.9l1.2-2.9h-.3Z" />
  </svg>
);

const EnsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1 4 12.3l8 4.7 8-4.7L12 1Zm0 7.8 3.9 2.3-3.9 2.3-3.9-2.3L12 8.8ZM4.6 14 12 23l7.4-9-7.4 4.35L4.6 14Z" />
  </svg>
);

const YoutubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.5 6.7a3.02 3.02 0 0 0-2.12-2.14C19.5 4 12 4 12 4s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.7 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.3 3.02 3.02 0 0 0 2.12 2.14C4.5 20 12 20 12 20s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.3ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43A4.9 4.9 0 0 1 3.82 3a4.9 4.9 0 0 1 1.77-1.15c.46-.16 1.26-.35 2.43-.4C9.29 1.4 9.67 1.4 12 1.4Zm0 2c-3.15 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.4-1.13.74a3.1 3.1 0 0 0-.74 1.13c-.14.35-.3.87-.34 1.83C3.16 8.35 3.15 8.7 3.15 12s.01 3.65.07 4.89c.04.96.2 1.48.34 1.83.18.46.4.79.74 1.13.34.34.67.56 1.13.74.35.14.87.3 1.83.34 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.4 1.13-.74.34-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.59.07-4.89s-.01-3.65-.07-4.89c-.04-.96-.2-1.48-.34-1.83a3.1 3.1 0 0 0-.74-1.13 3.1 3.1 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34C15.5 4.21 15.15 4.2 12 4.2Zm0 3.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8Zm0 1.9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.6-2.1a1.03 1.03 0 1 1 0 2.06 1.03 1.03 0 0 1 0-2.06Z" />
  </svg>
);

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
  </svg>
);

const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const TiktokIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.6 1h-3.3v14.6a2.87 2.87 0 1 1-2.03-2.75V9.5a6.2 6.2 0 1 0 5.33 6.14V8.1a8.1 8.1 0 0 0 4.9 1.65V6.4a4.85 4.85 0 0 1-4.9-5.4Z" />
  </svg>
);

const RedditIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-1.1-.9-2-2-2-.53 0-1 .2-1.36.53a10.5 10.5 0 0 0-4.9-1.56l.84-3.94 2.74.58a1.5 1.5 0 1 0 .16-.98l-3.06-.65a.5.5 0 0 0-.6.38l-.94 4.4a10.5 10.5 0 0 0-5.02 1.57A1.98 1.98 0 0 0 4.6 10c-.7 0-1.36.4-1.7 1.02a2 2 0 0 0 .29 2.36 3.6 3.6 0 0 0-.07.66c0 2.83 3.53 5.13 7.88 5.13s7.88-2.3 7.88-5.13c0-.22-.02-.44-.06-.65A2 2 0 0 0 22 12ZM8.5 13.25a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Zm7.24 3.15a5.1 5.1 0 0 1-3.74 1.28 5.1 5.1 0 0 1-3.74-1.28.47.47 0 0 1 .66-.66 4.2 4.2 0 0 0 3.08 1.02 4.2 4.2 0 0 0 3.08-1.02.47.47 0 0 1 .66.66Zm-.24-1.9a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
  </svg>
);

const ThreadsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.7 11.37a6.9 6.9 0 0 0-.27-.12c-.16-2.92-1.76-4.6-4.44-4.62-1.5-.01-2.82.62-3.65 1.85l1.44.99c.55-.82 1.4-1 2.16-1h.02c.95.01 1.67.29 2.13.83.34.4.57.94.68 1.63a9.6 9.6 0 0 0-2.3-.14c-2.34.14-3.84 1.5-3.74 3.4.06 1 .59 1.85 1.5 2.4.77.46 1.76.68 2.8.62 1.36-.08 2.43-.6 3.17-1.55.57-.72.93-1.66 1.08-2.83.65.4 1.14.92 1.4 1.55.46 1.08.48 2.86-.97 4.3-1.27 1.26-2.8 1.8-5.1 1.82-2.55-.02-4.48-.84-5.74-2.44-1.19-1.5-1.8-3.66-1.82-6.42.02-2.77.63-4.92 1.82-6.42 1.26-1.6 3.19-2.42 5.74-2.44 2.57.02 4.53.85 5.83 2.46.64.79 1.12 1.78 1.44 2.93l1.65-.44c-.38-1.4-.98-2.6-1.79-3.6C15.9 2.2 13.44 1.16 10.28 1.14h-.01c-3.15.02-5.58 1.06-7.22 3.1-1.46 1.8-2.21 4.32-2.24 7.48v.03c.03 3.16.78 5.68 2.24 7.48 1.64 2.04 4.07 3.08 7.22 3.1h.01c2.79-.02 4.76-.75 6.38-2.35 2.13-2.1 2.07-4.74 1.37-6.36-.5-1.15-1.44-2.09-2.71-2.73l-.02-.02Zm-4.6 4.44c-1.15.07-2.34-.45-2.4-1.55-.04-.82.6-1.72 2.46-1.84.22-.01.43-.02.64-.02.67 0 1.29.07 1.86.2-.21 2.62-1.42 3.13-2.56 3.21Z" />
  </svg>
);

const BlueskyIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 8.5c-1.13-2.2-4.2-6.3-7.05-8.3C2.2-1.6.9-1.03.9 1.4c0 .5.28 4.15.44 4.75.57 2.1 2.6 2.64 4.4 2.35-3.17.5-5.98 1.9-2.29 6 4.07 4.3 5.58-.9 6.36-3.5.03-.1.05-.19.09-.19.03 0 .05.09.09.19.78 2.6 2.29 7.8 6.36 3.5 3.69-4.1.88-5.5-2.29-2.29-6 1.8.29 3.83-.25 4.4-2.35.16-.6.44-4.25.44-4.75 0-2.43-1.3-3-3.95-1.3C16.2 2.2 13.13 6.3 12 8.5Z" />
  </svg>
);

const MastodonIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.5 6.86c0-4.13-2.7-5.34-2.7-5.34C17.4.9 14.9.55 12.3.53h-.06c-2.6.02-5.1.37-6.5 1 0 0-2.7 1.2-2.7 5.34 0 .95-.02 2.08.01 3.28.1 4.28.75 8.5 4.55 9.5 1.75.46 3.26.56 4.47.49 2.2-.12 3.43-.79 3.43-.79l-.07-1.6s-1.57.5-3.34.43c-1.75-.06-3.6-.2-3.88-2.4a4.5 4.5 0 0 1-.04-.63s1.72.42 3.9.52c1.33.06 2.58-.08 3.85-.24 2.44-.3 4.56-1.85 4.83-3.27.42-2.2.38-5.37.38-5.37Zm-3.28 5.47H16.3V8.44c0-1.32-.56-1.99-1.68-1.99-1.24 0-1.86.8-1.86 2.38v3.44h-1.9V8.83c0-1.58-.62-2.38-1.86-2.38-1.12 0-1.68.67-1.68 1.99v3.9H5.4V8.3c0-1.32.34-2.37 1.02-3.14.7-.78 1.62-1.18 2.75-1.18 1.32 0 2.32.5 2.98 1.5l.64 1.08.64-1.08c.66-1 1.66-1.5 2.98-1.5 1.13 0 2.05.4 2.75 1.18.68.77 1.02 1.82 1.02 3.14v4.03Z" />
  </svg>
);

/* =========================
   CRYPTO ICONS
========================= */

const BitcoinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.6 14.9c-1.6 6.4-8.1 10.3-14.5 8.7C2.7 22-1.2 15.5.4 9.1 2 2.7 8.5-1.2 14.9.4c6.4 1.6 10.3 8.1 8.7 14.5Zm-6.4-4.2c.25-1.68-1.03-2.58-2.78-3.18l.57-2.28-1.39-.35-.55 2.22c-.36-.09-.74-.17-1.11-.26l.56-2.24-1.39-.34-.57 2.28c-.3-.07-.6-.14-.88-.2l-1.92-.48-.37 1.49s1.03.24 1.01.25c.57.14.67.5.65.8L8.3 12.4c.04.01.09.03.15.06l-.15-.04-.9 3.63c-.07.17-.24.42-.62.32.01.02-1.01-.25-1.01-.25l-.7 1.6 1.82.45c.34.09.67.17 1 .26l-.58 2.31 1.39.35.57-2.29c.38.1.75.2 1.1.29l-.57 2.27 1.39.35.58-2.3c2.37.45 4.15.27 4.9-1.87.6-1.73-.03-2.72-1.28-3.37.91-.21 1.6-.81 1.78-2.05Zm-3.17 4.46c-.43 1.73-3.34.79-4.28.56l.76-3.05c.94.24 4 .7 3.52 2.49Zm.43-4.48c-.39 1.57-2.81.77-3.6.58l.69-2.77c.79.2 3.32.56 2.91 2.19Z" />
  </svg>
);

const EthereumIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1.5 5 12.3l7 4.15 7-4.15L12 1.5Zm0 8.9L6.6 11.7 12 3.7l5.4 8-5.4-1.3ZM5 13.65 12 22.5v-5.9l-7-4.15v1.2Zm7 2.95v5.9l7-8.85-7 2.95Z" />
  </svg>
);

const SolanaIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.6 15.6c.2-.2.46-.3.75-.3h17.1c.5 0 .74.6.4.94l-3.4 3.4c-.2.2-.46.3-.75.3H1.6c-.5 0-.74-.6-.4-.94l3.4-3.4Zm0-9.2c.2-.2.46-.32.75-.32h17.1c.5 0 .74.6.4.94l-3.4 3.4c-.2.2-.46.3-.75.3H1.6c-.5 0-.74-.6-.4-.94l3.4-3.38ZM19.4 11c-.2-.2-.46-.3-.75-.3H1.55c-.5 0-.74.6-.4.94l3.4 3.4c.2.2.46.3.75.3h17.1c.5 0 .74-.6.4-.94l-3.4-3.4Z" />
  </svg>
);

const PolygonIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16.5 8.4c-.35-.2-.8-.2-1.18 0l-2.7 1.57-1.85 1.02-2.7 1.57c-.35.2-.8.2-1.17 0L4.6 11.1a1.2 1.2 0 0 1-.58-1v-2.3c0-.4.22-.79.58-1l2.28-1.3c.35-.2.8-.2 1.17 0l2.28 1.3c.35.2.58.6.58 1v1.57l1.85-1.08V6.1c0-.4-.22-.79-.58-1L7.9 2.2a1.2 1.2 0 0 0-1.17 0L2.44 5.1a1.2 1.2 0 0 0-.58 1v5.8c0 .4.22.79.58 1l4.29 2.9c.35.2.8.2 1.17 0l2.7-1.57 1.85-1.02 2.7-1.57c.35-.2.8-.2 1.17 0l2.28 1.3c.35.2.58.6.58 1v2.3c0 .4-.22.79-.58 1l-2.28 1.34c-.35.2-.8.2-1.17 0l-2.28-1.3a1.2 1.2 0 0 1-.58-1v-1.53l-1.85 1.08v1.57c0 .4.22.79.58 1l4.28 2.9c.35.2.8.2 1.17 0l4.28-2.9c.35-.2.58-.6.58-1v-5.8c0-.4-.22-.79-.58-1l-4.24-2.75Z" />
  </svg>
);

const BaseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5.5 5.65.5 12c0 6.08 4.71 11.06 10.68 11.47v-8.05H8.2v-2.9h2.98V10.2c0-2.95 1.76-4.58 4.45-4.58 1.29 0 2.63.23 2.63.23v2.9h-1.48c-1.46 0-1.92.9-1.92 1.83v2.2h3.27l-.52 2.9h-2.75v8.42c-.28.03-.56.04-.86.04Z" />
  </svg>
);

const ArbitrumIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5 1 6.4v11.2L12 23.5l11-5.9V6.4L12 .5Zm-1 4.2 1.4-.75 5.9 10.3-1.75 3.05-5.55-9.75V4.7Zm-2.9 1.6 1.75 3.05L5.3 17.3 3.55 14.2 8.1 6.3Zm10.85 8-1.75 3.05-1.75-3.05 1.75-3.05 1.75 3.05ZM12 20.3l-1.5-2.6h3l-1.5 2.6Z" />
  </svg>
);

const OptimismIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .5C5.65.5.5 5.65.5 12S5.65 23.5 12 23.5 23.5 18.35 23.5 12 18.35.5 12 .5ZM8.7 15.4c-1.5 0-2.6-.85-2.6-2.35 0-.3.04-.66.13-1.05.4-1.87 2.06-3.15 3.98-3.15 1.5 0 2.58.87 2.58 2.36 0 .3-.03.65-.12 1.03-.4 1.9-2.05 3.16-3.97 3.16Zm7.4-.1h-1.75l1.5-6.9h1.75l-1.5 6.9Z" />
  </svg>
);

/* =========================
   MAPS
========================= */

const platformIcons: Record<string, React.FC<IconProps>> = {
  twitter: XIcon,
  x: XIcon,
  discord: DiscordIcon,
  github: GithubIcon,
  telegram: TelegramIcon,
  farcaster: FarcasterIcon,
  ens: EnsIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  reddit: RedditIcon,
  threads: ThreadsIcon,
  bluesky: BlueskyIcon,
  mastodon: MastodonIcon,
};

const platformLabels: Record<string, string> = {
  twitter: "X (Twitter)",
  x: "X (Twitter)",
  discord: "Discord",
  github: "GitHub",
  telegram: "Telegram",
  farcaster: "Farcaster",
  ens: "ENS",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  reddit: "Reddit",
  threads: "Threads",
  bluesky: "Bluesky",
  mastodon: "Mastodon",
  website: "Website",
  email: "Email",
  phone: "Phone",
};

const platformAccent: Record<string, string> = {
  twitter: "group-hover:text-white group-hover:bg-black",
  x: "group-hover:text-white group-hover:bg-black",
  discord: "group-hover:text-white group-hover:bg-[#5865F2]",
  github: "group-hover:text-white group-hover:bg-[#181717]",
  telegram: "group-hover:text-white group-hover:bg-[#26A5E4]",
  farcaster: "group-hover:text-white group-hover:bg-[#855DCD]",
  ens: "group-hover:text-white group-hover:bg-[#5284FF]",
  youtube: "group-hover:text-white group-hover:bg-[#FF0000]",
  instagram:
    "group-hover:text-white group-hover:bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]",
  facebook: "group-hover:text-white group-hover:bg-[#1877F2]",
  linkedin: "group-hover:text-white group-hover:bg-[#0A66C2]",
  tiktok: "group-hover:text-white group-hover:bg-black",
  reddit: "group-hover:text-white group-hover:bg-[#FF4500]",
  threads: "group-hover:text-white group-hover:bg-black",
  bluesky: "group-hover:text-white group-hover:bg-[#1185FE]",
  mastodon: "group-hover:text-white group-hover:bg-[#6364FF]",
  website: "group-hover:text-white group-hover:bg-brand-600",
  email: "group-hover:text-white group-hover:bg-brand-600",
  phone: "group-hover:text-white group-hover:bg-brand-600",
};

const chainIcons: Record<string, React.FC<IconProps>> = {
  bitcoin: BitcoinIcon,
  ethereum: EthereumIcon,
  solana: SolanaIcon,
  polygon: PolygonIcon,
  base: BaseIcon,
  arbitrum: ArbitrumIcon,
  optimism: OptimismIcon,
};

const chainAccent: Record<string, string> = {
  ethereum:
    "from-[#627EEA]/20 to-transparent border-[#627EEA]/30 text-[#8fa2f2]",
  polygon:
    "from-[#8247E5]/20 to-transparent border-[#8247E5]/30 text-[#b191f0]",
  solana:
    "from-[#14F195]/15 to-transparent border-[#14F195]/30 text-[#6ff7bd]",
  bitcoin:
    "from-[#F7931A]/20 to-transparent border-[#F7931A]/30 text-[#f7b25c]",
  base:
    "from-brand-500/20 to-transparent border-brand-500/30 text-brand-light",
  arbitrum:
    "from-[#28A0F0]/20 to-transparent border-[#28A0F0]/30 text-[#7cc5f5]",
  optimism:
    "from-[#FF0420]/15 to-transparent border-[#FF0420]/30 text-[#ff7c8a]",
};

/* =========================
   HELPERS
========================= */

function shortenAddress(addr: string): string {
  if (!addr || addr.length < 12) {
    return addr;
  }

  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function chainClasses(chain: string): string {
  return (
    chainAccent[chain.toLowerCase()] ||
    "from-ink-700/40 to-transparent border-ink-700 text-ink-300"
  );
}

function getPlatformUrl(
  platform: string,
  handle: string
): string | null {
  if (!handle) {
    return null;
  }

  const raw = handle.trim();

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (/^mailto:/i.test(raw) || /^tel:/i.test(raw)) {
    return raw;
  }

  const key = platform.toLowerCase();
  const clean = raw.replace(/^@/, "").trim();

  switch (key) {
    case "twitter":
    case "x":
      return `https://x.com/${clean}`;

    case "github":
      return `https://github.com/${clean}`;

    case "telegram":
      return `https://t.me/${clean}`;

    case "discord":
      if (
        /^[a-zA-Z0-9-]{2,32}$/.test(clean) &&
        !clean.includes("#")
      ) {
        return `https://discord.gg/${clean}`;
      }

      return `https://discord.com/users/${clean}`;

    case "farcaster":
      return `https://warpcast.com/${clean}`;

    case "ens":
      return `https://app.ens.domains/${clean.includes(".") ? clean : `${clean}.eth`
        }`;

    case "youtube":
      return clean.startsWith("c/") ||
        clean.startsWith("channel/") ||
        clean.startsWith("@")
        ? `https://youtube.com/${clean}`
        : `https://youtube.com/@${clean}`;

    case "instagram":
      return `https://instagram.com/${clean}`;

    case "facebook":
      return `https://facebook.com/${clean}`;

    case "linkedin":
      return clean.includes("/")
        ? `https://linkedin.com/${clean}`
        : `https://linkedin.com/in/${clean}`;

    case "tiktok":
      return `https://tiktok.com/@${clean}`;

    case "reddit":
      return `https://reddit.com/user/${clean}`;

    case "threads":
      return `https://threads.net/@${clean}`;

    case "bluesky":
      return `https://bsky.app/profile/${clean.includes(".") ? clean : `${clean}.bsky.social`
        }`;

    case "mastodon": {
      if (clean.includes("@")) {
        const [user, domain] = clean.split("@");

        if (user && domain) {
          return `https://${domain}/@${user}`;
        }
      }

      return `https://mastodon.social/@${clean}`;
    }

    case "website":
      return raw.startsWith("http")
        ? raw
        : `https://${raw}`;

    case "email":
      return raw.startsWith("mailto:")
        ? raw
        : `mailto:${raw}`;

    case "phone":
      return raw.startsWith("tel:")
        ? raw
        : `tel:${raw.replace(/\s+/g, "")}`;

    default:
      return raw.startsWith("http")
        ? raw
        : null;
  }
}

function PlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const key = platform.toLowerCase();
  const Icon = platformIcons[key];

  if (Icon) {
    return <Icon className={className} />;
  }

  if (key === "website") {
    return <Globe className={className} />;
  }

  if (key === "email") {
    return <Mail className={className} />;
  }

  if (key === "phone") {
    return <Phone className={className} />;
  }

  return <Link2 className={className} />;
}

function ChainIcon({
  chain,
  className,
}: {
  chain: string;
  className?: string;
}) {
  const Icon = chainIcons[chain.toLowerCase()];

  if (Icon) {
    return <Icon className={className} />;
  }

  return <Globe className={className} />;
}

/* =========================
   COPY BUTTON
========================= */

function CopyIconButton({
  value,
}: {
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      setCopied(false);
    };
  }, []);

  const onCopy = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy wallet address"
      className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-brand-light hover:bg-ink-800/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-90"
    >
      {copied ? (
        <Check
          size={14}
          className="text-brand-light"
        />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}

/* =========================
   REVEAL
========================= */

function Reveal({
  show,
  delay = 0,
  className = "",
  children,
}: {
  show: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] ${show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
        } ${className}`}
      style={{
        transitionDelay: show
          ? `${delay}ms`
          : "0ms",
      }}
    >
      {children}
    </div>
  );
}

/* =========================
   COMPONENT
========================= */

export default function UserProfilePage({
  handle: rawHandle,
}: UserProfilePageProps) {
  const handle = rawHandle
    .replace(/^@/, "")
    .trim()
    .toLowerCase();

  const [profile, setProfile] =
    useState<PublicProfileResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [mounted, setMounted] =
    useState(false);

  const [linkCopied, setLinkCopied] =
    useState(false);

  /* =========================
     MOUNT ANIMATION
  ========================= */

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    let cancelled = false;

    if (!handle) {
      setError("Handle is required");
      setLoading(false);
      setProfile(null);

      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await userProfileApi.getPublicProfileByHandle(
            handle
          );

        if (cancelled || controller.signal.aborted) {
          return;
        }

        setProfile(data);
      } catch (err: any) {
        if (
          cancelled ||
          controller.signal.aborted ||
          err?.name === "AbortError"
        ) {
          return;
        }

        setProfile(null);
        setError(
          err?.message ||
          "Profile not found"
        );
      } finally {
        if (
          !cancelled &&
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [handle]);

  /* =========================
     COPY PROFILE LINK
  ========================= */

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setLinkCopied(true);

      window.setTimeout(() => {
        setLinkCopied(false);
      }, 1600);
    } catch {
      // Clipboard unavailable.
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen grid-bg px-4 py-10 md:py-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <div className="card-surface p-7 text-center relative overflow-hidden rounded-2xl">
            <div className="mx-auto mb-5 h-32 w-32 rounded-full bg-ink-800 animate-pulse" />

            <div className="mx-auto mb-3 h-6 w-36 rounded-lg bg-ink-800 animate-pulse" />

            <div className="mx-auto h-4 w-24 rounded bg-ink-800 animate-pulse" />

            <div
              className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{
                animationName:
                  "profile-shimmer",
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="h-24 rounded-2xl bg-ink-800/60 animate-pulse" />
            <div className="h-24 rounded-2xl bg-ink-800/60 animate-pulse" />
            <div className="h-24 rounded-2xl bg-ink-800/60 animate-pulse" />
          </div>
        </div>

        <style>{`
          @keyframes profile-shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !profile) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center px-4">
        <div
          className={`card-surface w-full max-w-md p-10 text-center rounded-2xl transition-all duration-500 ${mounted
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
            }`}
        >
          <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-ink-800/80 border border-ink-700 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="text-ink-500"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path
                d="M21 21l-4.35-4.35"
                strokeLinecap="round"
              />

              <path
                d="M8.5 8.5l5 5M13.5 8.5l-5 5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-[13px] font-mono tracking-widest text-ink-600 mb-2">
            404 / NOT FOUND
          </div>

          <h1 className="text-xl font-semibold text-ink-50 mb-2">
            This profile doesn&apos;t exist
          </h1>

          <p className="text-ink-400 text-sm">
            No public profile for{" "}
            <span className="font-mono text-brand-light">
              @{handle}
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     PROFILE DATA
  ========================= */

  const primary =
    profile.handles.find(
      (h) => h.is_primary
    )?.handle ||
    profile.handles[0]?.handle ||
    handle;

  const secondary =
    profile.handles.filter(
      (h) =>
        h.handle.toLowerCase() !==
        primary.toLowerCase()
    );

  const memberSince = new Date(
    profile.created_at
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const verifiedCount =
    profile.identities.filter(
      (i) => i.verified
    ).length;

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen grid-bg px-4 py-10 md:py-16">
      <div
        className={`mx-auto max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
          }`}
      >
        {/* TOP UTILITY BAR */}

        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-[10px] font-mono tracking-[0.2em] text-ink-600 uppercase">
            Public profile
          </span>

          <button
            type="button"
            onClick={onCopyLink}
            className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500 hover:text-brand-light transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-2.5 py-1.5 hover:bg-ink-800/50 active:scale-95"
          >
            {linkCopied ? (
              <>
                <Check
                  size={12}
                  className="text-brand-light"
                />
                Copied
              </>
            ) : (
              <>
                <Share2 size={12} />
                Share
              </>
            )}
          </button>
        </div>

        {/* TWO COLUMN */}

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
          {/* LEFT SIDEBAR */}

          <div className="md:sticky md:top-10 card-surface p-7 relative overflow-hidden rounded-2xl border border-ink-800/80 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-52 w-80 rounded-full bg-brand-500/25 blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-purple-500/15 blur-[60px]" />

            <div className="relative flex flex-col items-center text-center">
              {/* AVATAR */}

              <div className="relative group h-32 w-32 mb-5">
                <div
                  className="absolute -inset-[3px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(99,102,241,0.95), rgba(168,85,247,0.55), rgba(99,102,241,0) 55%, rgba(99,102,241,0.95))",
                    animation:
                      "profile-spin 7s linear infinite",
                  }}
                />

                <div className="absolute inset-[3px] rounded-full bg-ink-900" />

                <div className="absolute inset-[5px] rounded-full bg-gradient-to-br from-brand-500/35 to-purple-500/25 border border-ink-700/80 flex items-center justify-center text-5xl font-semibold text-ink-50 select-none transition-transform duration-500 group-hover:scale-[1.04]">
                  {primary
                    .slice(0, 1)
                    .toUpperCase()}
                </div>

                <div className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-full bg-brand-600 border-[3px] border-ink-900 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 z-10">
                  <ShieldCheck size={13} />
                </div>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                <span className="gradient-text">
                  @{primary}
                </span>
              </h1>

              <p className="text-ink-400 text-sm mt-1.5 mb-5">
                Member since {memberSince}
              </p>

              {/* STATS */}

              <div className="w-full flex items-center justify-center gap-2 flex-wrap mb-1">
                <div className="glass px-3 py-1.5 rounded-full text-[11px] font-medium text-ink-300 flex items-center gap-1.5 border border-ink-700/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />

                  {profile.identities.length}{" "}
                  {profile.identities.length ===
                    1
                    ? "identity"
                    : "identities"}
                </div>

                {verifiedCount > 0 && (
                  <div className="glass px-3 py-1.5 rounded-full text-[11px] font-medium text-brand-light flex items-center gap-1.5 border border-brand-500/20">
                    <Check size={11} />

                    {verifiedCount} verified
                  </div>
                )}

                {profile.wallets.length > 0 && (
                  <div className="glass px-3 py-1.5 rounded-full text-[11px] font-medium text-ink-300 flex items-center gap-1.5 border border-ink-700/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

                    {profile.wallets.length}{" "}
                    {profile.wallets.length ===
                      1
                      ? "wallet"
                      : "wallets"}
                  </div>
                )}
              </div>

              {/* ALSO KNOWN AS */}

              {secondary.length > 0 && (
                <div className="w-full mt-6 pt-6 border-t border-ink-800/80">
                  <p className="text-[11px] font-medium text-ink-500 uppercase tracking-widest mb-3">
                    Also known as
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">
                    {secondary.map((h) => (
                      <a
                        key={h.handle}
                        href={`/@${h.handle}`}
                        className="px-3 py-1.5 rounded-full text-sm font-mono bg-ink-800/70 border border-ink-700 text-ink-200 hover:border-brand-500/50 hover:text-brand-light hover:bg-ink-800 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                      >
                        @{h.handle}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <style>{`
              @keyframes profile-spin {
                to {
                  transform: rotate(360deg);
                }
              }

              @media (prefers-reduced-motion: reduce) {
                [style*="profile-spin"] {
                  animation: none !important;
                }
              }
            `}</style>
          </div>

          {/* RIGHT CONTENT */}

          <div className="min-w-0 space-y-9">
            {/* IDENTITIES */}

            {profile.identities.length > 0 && (
              <Reveal
                show={mounted}
                delay={80}
              >
                <div className="flex items-center gap-2 mb-3.5">
                  <h2 className="text-[11px] font-medium text-ink-500 uppercase tracking-widest">
                    Identities
                  </h2>

                  <span className="h-px flex-1 bg-gradient-to-r from-ink-800 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.identities.map(
                    (item, i) => {
                      const key =
                        item.platform.toLowerCase();

                      const href =
                        getPlatformUrl(
                          item.platform,
                          item.handle
                        );

                      const isLink =
                        Boolean(href);

                      const cardClass =
                        `group glass flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-ink-800/60 hover:border-brand-500/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.25)]`;

                      const cardInner = (
                        <>
                          <span
                            className={`h-11 w-11 rounded-xl bg-ink-800/80 flex items-center justify-center shrink-0 text-ink-200 transition-all duration-300 ${platformAccent[key] ||
                              "group-hover:text-white group-hover:bg-brand-600"
                              }`}
                          >
                            <PlatformIcon
                              platform={
                                item.platform
                              }
                              className="h-[18px] w-[18px]"
                            />
                          </span>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-100 tracking-tight">
                              {platformLabels[
                                key
                              ] ||
                                item.platform}
                            </p>

                            <p className="text-sm text-ink-400 font-mono truncate mt-0.5">
                              {item.handle}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.verified && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-600/15 text-brand-light border border-brand-500/25 font-medium flex items-center gap-1">
                                <Check size={9} />
                                verified
                              </span>
                            )}

                            {isLink && (
                              <ExternalLink
                                size={13}
                                className="text-ink-600 group-hover:text-ink-300 transition-colors duration-200"
                              />
                            )}
                          </div>
                        </>
                      );

                      if (isLink && href) {
                        return (
                          <a
                            key={`${item.platform}-${item.handle}`}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cardClass}
                            style={{
                              transitionDelay:
                                mounted
                                  ? `${100 +
                                  i * 40
                                  }ms`
                                  : "0ms",
                            }}
                          >
                            {cardInner}
                          </a>
                        );
                      }

                      return (
                        <div
                          key={`${item.platform}-${item.handle}`}
                          className={`${cardClass} cursor-default`}
                          style={{
                            transitionDelay:
                              mounted
                                ? `${100 +
                                i * 40
                                }ms`
                                : "0ms",
                          }}
                        >
                          {cardInner}
                        </div>
                      );
                    }
                  )}
                </div>
              </Reveal>
            )}

            {/* WALLETS */}

            {profile.wallets.length > 0 && (
              <Reveal
                show={mounted}
                delay={180}
              >
                <div className="flex items-center gap-2 mb-3.5">
                  <h2 className="text-[11px] font-medium text-ink-500 uppercase tracking-widest">
                    Wallets
                  </h2>

                  <span className="h-px flex-1 bg-gradient-to-r from-ink-800 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.wallets.map(
                    (w, i) => (
                      <div
                        key={`${w.chain}-${w.address}-${i}`}
                        className={`glass flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] ${chainClasses(
                          w.chain
                        )}`}
                        style={{
                          transitionDelay:
                            mounted
                              ? `${200 +
                              i * 40
                              }ms`
                              : "0ms",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="h-10 w-10 rounded-xl bg-ink-900/60 flex items-center justify-center shrink-0">
                            <ChainIcon
                              chain={w.chain}
                              className="h-[17px] w-[17px]"
                            />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5 opacity-90">
                              {w.chain}
                            </p>

                            <p className="text-sm font-mono text-ink-200 truncate">
                              {shortenAddress(
                                w.address
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] text-ink-500 capitalize mr-1 hidden sm:inline">
                            {w.network}
                          </span>

                          <CopyIconButton
                            value={w.address}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Reveal>
            )}

            {/* EMPTY */}

            {profile.identities.length === 0 &&
              profile.wallets.length === 0 && (
                <div className="card-surface text-center py-16 rounded-2xl border border-ink-800/60">
                  <p className="text-ink-500 text-sm">
                    No public identities or wallets
                    yet
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
