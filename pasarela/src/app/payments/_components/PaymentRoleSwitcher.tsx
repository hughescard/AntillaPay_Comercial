'use client';

import { CustomSelect } from "@/common/components/ui/CustomSelect";
import type { PaymentActor } from "../types";

export const PaymentRoleSwitcher = ({
  actor,
  actors,
  onChange,
}: {
  actor: PaymentActor;
  actors: PaymentActor[];
  onChange: (actorId: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Perfil de prueba
        </p>
        <p className="break-words text-sm font-medium text-foreground">
          {actor.name} · {actor.roles.join(' · ')}
        </p>
      </div>
      <div className="w-full min-w-0 sm:w-72 sm:max-w-full">
        <CustomSelect
          value={actor.id}
          onChange={(value) => onChange(value as string)}
          options={actors.map((item) => ({
            value: item.id,
            label: `${item.name} · ${item.roles.join(' · ')}`,
          }))}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};
