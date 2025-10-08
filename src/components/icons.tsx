import {
  Heart,
  PartyPopper,
  Flower2,
  Music,
  Sun,
  Gift,
  Calendar,
  Star,
  Camera,
  Video,
  Users,
  MoonStar,
  House,
  Baby ,
  type LucideIcon,
} from "lucide-react";

// Returns a Lucide icon component best matching a function label/name
export function getFunctionIcon(label?: string): LucideIcon {
  const key = (label || "").toLowerCase();

  if (key.includes("wedding")) return Heart;
  if (key.includes("reception")) return PartyPopper;
  if (key.includes("nikah")) return   MoonStar;
  if (key.includes("sangeet")) return Music;
  if (key.includes("mehendi") || key.includes("mehendi")) return Flower2;
  if (key.includes("haldi")) return Sun;
  if (key.includes("engagement")) return Star;
  if (key.includes("house warming")) return House;
  if (key.includes("anniversary")) return Calendar;
  if (key.includes("noolukett")) return Baby;
  if (key.includes("birthday")) return Gift;
  if (key.includes("save the date")) return Camera;
  if (key.includes("video") || key.includes("cine")) return Video;
  if (key.includes("guests") || key.includes("crew")) return Users;
  if (key.includes("schedule") || key.includes("date") || key.includes("day")) return Calendar;

  return PartyPopper; // default celebratory icon
}
