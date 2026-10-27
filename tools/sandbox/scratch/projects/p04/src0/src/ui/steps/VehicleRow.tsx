// src/ui/steps/VehicleRow.tsx
import { memo, useMemo } from "react";
import type { FieldMap, VehicleValues } from "../../form/types";
import { CURRENT_YEAR } from "../../form/validation/steps";
import { validateVehicle } from "../../form/validation/vehicle";
import { useFormDispatch } from "../../form/FormProvider";
import { TextField } from "../fields/TextField";
import { CheckboxField } from "../fields/CheckboxField";
import { visibleError } from "../fields/visibility";

interface VehicleRowProps {
  vehicle: VehicleValues;
  index: number;
  touched: FieldMap<VehicleValues, true> | undefined;
  serverErrors: FieldMap<VehicleValues, string> | undefined;
  attempted: boolean;
  isDuplicate: boolean;
  canRemove: boolean;
  autoFocus: boolean;
}

export const VehicleRow = memo(function VehicleRow({
  vehicle, index, touched, serverErrors, attempted, isDuplicate, canRemove, autoFocus,
}: VehicleRowProps) {
  const dispatch = useFormDispatch(); // stable; the row does not subscribe to form STATE
  const errors = useMemo(
    () => validateVehicle(vehicle, { currentYear: CURRENT_YEAR, isDuplicate }),
    [vehicle, isDuplicate],
  );
  const gate = (field: keyof VehicleValues) => ({ touched: touched?.[field], attempted });
  const change = <K extends keyof VehicleValues>(field: K) => (value: VehicleValues[K]) =>
    dispatch({ type: "vehicle/changed", id: vehicle.id, field, value } as never);
  // ^ `as never` is a smell: see the note below.
  const blur = (field: keyof VehicleValues) => () =>
    dispatch({ type: "vehicle/blurred", id: vehicle.id, field });

  const label = vehicle.registration.trim() || `vehicle ${index + 1}`;

  return (
    <fieldset>
      <legend>Vehicle {index + 1}</legend>

      <TextField
        path={`vehicles.${vehicle.id}.registration`} label="Registration plate" required
        value={vehicle.registration}
        autoFocus={autoFocus}
        onValueChange={change("registration")}
        onBlur={blur("registration")}
        error={visibleError(errors.registration, gate("registration"), serverErrors?.registration)}
      />

      {/* type (select), year (text, inputMode numeric) */}

      <CheckboxField
        path={`vehicles.${vehicle.id}.hasFuelCard`} label="This vehicle needs a fuel card"
        checked={vehicle.hasFuelCard}
        onCheckedChange={change("hasFuelCard")}
      />

      {vehicle.hasFuelCard && (
        <TextField
          path={`vehicles.${vehicle.id}.cardContactEmail`} label="Fuel card contact email" required
          type="email"
          value={vehicle.cardContactEmail}
          onValueChange={change("cardContactEmail")}
          onBlur={blur("cardContactEmail")}
          error={visibleError(errors.cardContactEmail, gate("cardContactEmail"), serverErrors?.cardContactEmail)}
        />
      )}

      {canRemove && (
        <button
          type="button"
          onClick={() => dispatch({ type: "vehicle/removed", id: vehicle.id })}
        >
          Remove {label}
        </button>
      )}
    </fieldset>
  );
});
