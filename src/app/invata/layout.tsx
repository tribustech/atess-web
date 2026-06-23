import { getArticlesGroupedByCategory } from "@/lib/academy";
import {
  AcademySidebar,
  AcademyMobileNav,
  type SidebarGroup,
} from "@/components/invata/AcademySidebar";

export default function InvataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups: SidebarGroup[] = getArticlesGroupedByCategory().map((g) => ({
    category: g.category,
    label: g.label,
    articles: g.articles.map((a) => ({ slug: a.slug, title: a.title })),
  }));

  return (
    <div className="relative">
      <div className="mx-auto max-w-[88rem] lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <AcademySidebar groups={groups} />
        <div className="min-w-0">{children}</div>
      </div>
      <AcademyMobileNav groups={groups} />
    </div>
  );
}
