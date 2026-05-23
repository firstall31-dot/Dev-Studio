export const CATEGORIES = [
  { id: "fullstack", label: "Full Stack", query: "full stack developer" },
  { id: "frontend", label: "Frontend", query: "frontend developer" },
  { id: "backend", label: "Backend", query: "backend developer" },
  { id: "devops", label: "DevOps", query: "devops engineer" },
  { id: "mobile", label: "Mobile", query: "react native mobile developer" },
  { id: "data", label: "Data", query: "data engineer" },
  { id: "react", label: "React", query: "react developer" },
  { id: "node", label: "Node.js", query: "node js developer" },
  { id: "python", label: "Python", query: "python developer" },
  { id: "webdesign", label: "Web Design", query: "web designer ui ux" },
  { id: "wordpress", label: "WordPress", query: "wordpress developer" },
];

export const TIME_OPTIONS = [
  { value: 1, label: "Last 24h" },
  { value: 3, label: "Last 3 days" },
  { value: 7, label: "Last week" },
  { value: 30, label: "Last month" },
];

export const SOURCES = [
  { id: "indeed", label: "Indeed", color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  { id: "wuzzuf", label: "Wuzzuf", color: "bg-teal-500/15 text-teal-400 border-teal-500/25" },
  { id: "bayt", label: "Bayt", color: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  { id: "remoteok", label: "RemoteOK", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25" },
  { id: "mostaql", label: "Mostaql", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  { id: "khamsat", label: "Khamsat", color: "bg-rose-500/15 text-rose-400 border-rose-500/25" },
];

export const SOURCE_BADGE: Record<string, string> = {
  indeed: "bg-blue-500/15 text-blue-400",
  wuzzuf: "bg-teal-500/15 text-teal-400",
  bayt: "bg-orange-500/15 text-orange-400",
  remoteok: "bg-cyan-500/15 text-cyan-400",
  mostaql: "bg-amber-500/15 text-amber-400",
  khamsat: "bg-rose-500/15 text-rose-400",
};

export const SOURCE_PLATFORM_NAME: Record<string, string> = {
  indeed: "Indeed",
  wuzzuf: "Wuzzuf",
  bayt: "Bayt",
  remoteok: "RemoteOK",
  mostaql: "Mostaql",
  khamsat: "Khamsat",
};
