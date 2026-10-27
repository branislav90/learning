// src/ui/steps/VehiclesStep.tsx
import { useState } from "react";
import { MAX_VEHICLES } from "../../form/types";
import { useForm, useFormDispatch } from "../../form/FormProvider";
import { emptyVehicle } from "../../form/initialState";
import { findDuplicatePlateIds } from "../../form/validation/vehicle";
import { VehicleRow } from "./VehicleRow";

export function VehiclesStep() {
  const { values, touched, serverErrors, attempted } = useForm();
  const dispatch = useFormDispatch();
  const [newestId, setNewestId] = useState<string | null>(null);

  const duplicates = findDuplicatePlateIds(values.vehicles);
  const canAdd = values.vehicles.length < MAX_VEHICLES;
  const canRemove = values.vehicles.length > 1;

  function handleAdd() {
    const vehicle = emptyVehicle(); // impure: in the handler
    setNewestId(vehicle.id);
    dispatch({ type: "vehicle/added", vehicle });
  }

  return (
    <>
      {values.vehicles.map((vehicle, index) => (
        <VehicleRow
          key={vehicle.id} // stable identity, NOT the index
          vehicle={vehicle}
          index={index}
          touched={touched.vehicles[vehicle.id]}
          serverErrors={serverErrors.vehicles[vehicle.id]}
          attempted={attempted.vehicles}
          isDuplicate={duplicates.has(vehicle.id)} // primitive: keeps memo effective
          canRemove={canRemove}
          autoFocus={vehicle.id === newestId}
        />
      ))}
      <button type="button" onClick={handleAdd} disabled={!canAdd}>
        Add another vehicle
      </button>
      {!canAdd && <p>You can add up to {MAX_VEHICLES} vehicles.</p>}
    </>
  );
}
