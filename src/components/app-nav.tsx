"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

const LEARNER_TABS = [{ href: "/topics", label: "주제 탐색" }];

const ADMIN_TABS = [
  { href: "/topics", label: "주제 탐색" },
  { href: "/admin/research-groups", label: "모둠 구성" },
  { href: "/admin/users", label: "계정 관리" },
];

const tabCls = (active: boolean) =>
  `font-display rounded-lg px-2.5 py-[7px] text-[13px] whitespace-nowrap ${
    active
      ? "bg-accent-soft font-semibold text-accent"
      : "font-medium text-stone-400 hover:text-stone-600"
  }`;

export function AppNav({ role, variant = "desktop" }: { role: Role; variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const tabs = role === "ADMIN" ? ADMIN_TABS : LEARNER_TABS;

  // 탭 수가 적어 모바일에서도 그대로 표시 (별도 햄버거 메뉴 불필요)
  if (variant === "mobile") return null;

  return (
    <nav className="flex gap-1">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={tabCls(isActive(t.href))}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
