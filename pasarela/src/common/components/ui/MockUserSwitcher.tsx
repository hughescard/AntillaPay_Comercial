'use client';

import { useMemo } from "react";
import { CustomSelect } from "./CustomSelect";
import { ROLE_DEFINITIONS } from "@/lib/rbac";
import { useRbacSimulation } from "@/common/context";

export const MockUserSwitcher = () => {
  const { currentUser, users, switchUser } = useRbacSimulation();

  const options = useMemo(
    () =>
      users
        .filter((user) => user.status === 'active')
        .map((user) => ({
        value: user.id,
        label: `${user.name} · ${user.roles.map((role) => ROLE_DEFINITIONS[role].name).join(' · ')}`,
      })),
    [users]
  );

  return (
    <div className="w-[280px] min-w-[220px]">
        <CustomSelect
          value={currentUser.id}
          onChange={(value) => switchUser(value as string)}
          options={options}
          className="rounded-lg py-2"
        />
    </div>
  );
};
