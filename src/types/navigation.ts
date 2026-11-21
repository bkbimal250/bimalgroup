export interface NavLinkItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLinkItem[];
}

export interface NavigationConfig {
  mainNav: NavLinkItem[];
  primaryCta: NavLinkItem;
  footerColumns: FooterColumn[];
  legalLinks: NavLinkItem[];
}
