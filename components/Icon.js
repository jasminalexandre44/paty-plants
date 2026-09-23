export default function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }) {
  const paths = {
    leaf: <><path d="M19.5 4.5C12 4.5 5.5 7 4 13c-.8 3.2 1 5.5 4 6.5 5.8 1.9 10.8-4.2 11.5-15Z" /><path d="M4 20c2.6-4.5 6.2-7.4 11-9.5" /></>,
    collection: <><rect x="3" y="4" width="7" height="7" rx="1" /><rect x="14" y="4" width="7" height="7" rx="1" /><rect x="3" y="15" width="7" height="5" rx="1" /><rect x="14" y="15" width="7" height="5" rx="1" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    login: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.leaf}</svg>;
}