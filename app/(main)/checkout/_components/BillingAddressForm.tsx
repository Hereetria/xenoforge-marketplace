"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Button } from "@/components/ui/button";

export type BillingAddress = {
  country: string;
  state: string;
  city: string;
  postal_code: string;
};

type Props = {
  value: BillingAddress;
  onChange: (next: BillingAddress) => void;
};

export default function BillingAddressForm({ value, onChange }: Props) {
  const handleFieldChange =
    (field: keyof BillingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  return (
    <div className="bg-[#0F1320] border border-[#2E3448] rounded-lg p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Billing address</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange({
              country: "US",
              state: "NY",
              city: "New York",
              postal_code: "10001",
            })
          }
        >
          Autofill New York
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-300" htmlFor="country">
            Country
          </Label>
          <Input
            id="country"
            value={value.country}
            onChange={handleFieldChange("country")}
            placeholder="US"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-300" htmlFor="state">
            State/Region
          </Label>
          <Input
            id="state"
            value={value.state}
            onChange={handleFieldChange("state")}
            placeholder="NY"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-300" htmlFor="city">
            City
          </Label>
          <Input
            id="city"
            value={value.city}
            onChange={handleFieldChange("city")}
            placeholder="New York"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-gray-300" htmlFor="postal_code">
            Postal code
          </Label>
          <Input
            id="postal_code"
            value={value.postal_code}
            onChange={handleFieldChange("postal_code")}
            placeholder="10001"
          />
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mt-3">
        Taxes will be calculated after you provide your billing address.
      </p>
    </div>
  );
}
