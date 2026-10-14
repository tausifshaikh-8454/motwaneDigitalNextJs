/**
 * Static navigation (decided with the client: menus live in code, not in WordPress).
 * Page content itself always comes from WordPress.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const PRODUCT_LINKS: NavItem[] = [
  { label: "Transformer Monitoring System", href: "/transformer-monitoring-system/" },
  { label: "Busbar Monitoring System", href: "/busbar-iq/" },
  { label: "Energy Monitoring System", href: "/energy-monitoring-system-iq/" },
];

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "#", children: PRODUCT_LINKS },
  { label: "About Us", href: "/about-us/" },
  { label: "Careers", href: "/careers/" },
  {
    label: "Resources",
    href: "#",
    children: [
      { label: "Blogs", href: "/blog/" },
      { label: "Webinars", href: "/webinars/" },
    ],
  },
  { label: "Contact Us", href: "/contact-us/" },
];

export const FOOTER_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/careers/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact-us/" },
];

export const LEGAL_LINKS: NavItem[] = [
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];
