"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Badge, Input } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { users } from "@/mock-data";
import type { User, UserStatus, UserRole } from "@/types";

export function UsersTable() {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.country.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: UserStatus) => {
    const variant = status === "active" ? "success" : "danger";
    return <Badge variant={variant}>{t(`users.status.${status}`)}</Badge>;
  };

  const getRoleText = (role: UserRole): string => {
    return t(`users.role.${role}`);
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)]">
        <div className="relative max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder={t("users.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {t("users.table.name")}
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {t("users.table.role")}
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                {t("users.table.status")}
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">
                {t("users.table.country")}
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden lg:table-cell">
                {t("users.table.joined")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  {t("users.empty")}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  getRoleText={getRoleText}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
        <p className="text-sm text-[var(--text-secondary)]">
          {t("common.showing")} {filteredUsers.length} {t("common.of")}{" "}
          {users.length} {t("common.results")}
        </p>
      </div>
    </div>
  );
}

interface UserRowProps {
  user: User;
  formatDate: (date: string) => string;
  getStatusBadge: (status: UserStatus) => JSX.Element;
  getRoleText: (role: UserRole) => string;
}

function UserRow({ user, formatDate, getStatusBadge, getRoleText }: UserRowProps) {
  return (
    <tr className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--accent-subtle)] rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-[var(--accent-text)]">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {user.name}
            </p>
            <p className="text-sm text-[var(--text-muted)] truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-[var(--text-primary)]">{getRoleText(user.role)}</span>
      </td>
      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
      <td className="px-6 py-4 hidden md:table-cell">
        <span className="text-sm text-[var(--text-primary)]">{user.country}</span>
      </td>
      <td className="px-6 py-4 hidden lg:table-cell">
        <span className="text-sm text-[var(--text-muted)]">{formatDate(user.joinedAt)}</span>
      </td>
    </tr>
  );
}
