import { Button } from "@/components/Button";
import { Fieldset } from "@/components/Fieldset";
import { Input } from "@/components/Input";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { useCreateParkingLot } from "@/features/map/api/createParkingLot";
import { useDeleteParkingLot } from "@/features/map/api/deleteParkingLot";
import { useEditParkingLot } from "@/features/map/api/editParkingLot";
import useModal from "@/features/modal/modal.store";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LocationPayload, ParkingLotDTO, ParkingLotPayload } from "types";

const getLocationFormValues = (location?: LocationPayload): LocationPayload => {
  return {
    city: location?.city || "Bucuresti",
    country: location?.country || "Romania",
    street: location?.street || "",
    shape: {
      type: location?.shape?.type || "Point",
      coordinates: location?.shape?.coordinates || [],
    },
  };
};

interface Props {
  parkingLot?: ParkingLotDTO;
  location?: LocationPayload;
}

export const ParkingLotForm = ({ parkingLot, location }: Props) => {
  const { register, handleSubmit, setValue, reset, watch } =
    useForm<ParkingLotPayload>({
      defaultValues: {
        name: parkingLot?.name || "",
        capacity: parkingLot?.capacity || 0,
        fee: parkingLot?.fee ? parkingLot.fee / 100 : 0,
        location: getLocationFormValues(parkingLot?.location || location),
      },
    });

  const { setIsOpen: setIsDrawerOpen } = useDrawer();
  const { setIsOpen: setIsModalOpen, setConfig: setModalConfig } = useModal();

  const { mutateAsync: createParkingLot, isLoading: isLoadingCreate } =
    useCreateParkingLot();
  const { mutateAsync: editParkingLot, isLoading: isLoadingEdit } =
    useEditParkingLot();
  const {
    mutateAsync: deleteParkingLot,
    isLoading: isLoadingDelete,
    isSuccess: isSuccessLoadingDelete,
  } = useDeleteParkingLot();

  const onSubmit = useCallback(
    async (payload: ParkingLotPayload) => {
      const onSuccess = () => {
        setIsDrawerOpen(false);
        reset();
      };

      if (parkingLot?._id)
        return await editParkingLot(
          { ...payload, _id: parkingLot._id },
          { onSuccess }
        );

      return await createParkingLot(payload, { onSuccess });
    },
    [parkingLot]
  );

  const onDelete = async () => {
    if (!parkingLot?._id || isLoadingDelete) return;

    setIsModalOpen(false);

    await deleteParkingLot(parkingLot._id, {
      onSuccess: () => {
        setIsDrawerOpen(false);
      },
    });
  };

  const onConfirmDelete = () => {
    if (!parkingLot) return;

    setModalConfig({
      header: dict.en.are_you_sure,
      body: (
        <span>
          {dict.en.are_you_sure_you_want_to_delete_parking_lot}{" "}
          <b>{parkingLot.name}</b>?
        </span>
      ),
      footer: (
        <>
          <Button
            aria-label={dict.en.cancel}
            title={dict.en.cancel}
            onClick={() => setIsModalOpen(false)}
          >
            {dict.en.cancel}
          </Button>

          <Button
            theme="danger"
            aria-label={dict.en.delete}
            title={dict.en.delete}
            className="ml-auto"
            onClick={onDelete}
          >
            {dict.en.delete}
          </Button>
        </>
      ),
      classNames: {
        footer: "flex justify-between items-center",
      },
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (parkingLot) {
      reset({
        capacity: parkingLot.capacity,
        fee: (parkingLot.fee || 0) / 100,
        name: parkingLot.name,
        location: getLocationFormValues(parkingLot.location),
      });

      return;
    }

    if (!location) return;

    reset({
      capacity: 0,
      fee: 0,
      name: "",
      location: getLocationFormValues(location),
    });
  }, [parkingLot, location]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      name="parking-lot"
      className="flex flex-col space-y-6"
    >
      <Fieldset label={dict.en.street}>
        <Input
          type="text"
          placeholder={dict.en.street}
          required
          {...register("location.street", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.city}>
        <Input
          type="text"
          placeholder={dict.en.city}
          required
          {...register("location.city", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.country}>
        <Input
          type="text"
          placeholder={dict.en.country}
          required
          {...register("location.country", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.name}>
        <Input
          type="text"
          placeholder={dict.en.parking_lot_name}
          required
          {...register("name", { required: true })}
        />
      </Fieldset>

      <Fieldset label={dict.en.capacity}>
        <Input
          type="number"
          min={1}
          placeholder={dict.en.parking_lot_capacity}
          required
          {...register("capacity", {
            required: true,
            min: 1,
            valueAsNumber: true,
          })}
        />
      </Fieldset>

      <div className="flex space-x-1">
        <Fieldset label={dict.en.fee}>
          <Input
            type="text"
            min={0}
            placeholder={dict.en.parking_lot_hourly_fee}
            required
            pattern="^\d*\.?\d+$"
            {...register("fee", {
              required: true,
              min: 0,
              pattern: /^\d*\.?\d+$/,
              setValueAs: (value) => value * 100,
            })}
          />
        </Fieldset>

        <div className="self-end bg-white p-1 border font-medium rounded">
          {dict.en.RON}/h
        </div>
      </div>

      <div className="flex justify-between">
        {!parkingLot && (
          <Button
            type="submit"
            aria-label={dict.en.submit}
            title={dict.en.submit}
            disabled={isLoadingCreate}
          >
            {dict.en.submit}
          </Button>
        )}

        {parkingLot && (
          <>
            <Button
              type="submit"
              aria-label={dict.en.edit}
              title={dict.en.edit}
              disabled={isLoadingEdit}
            >
              {dict.en.edit}
            </Button>

            <Button
              theme="danger"
              aria-label={dict.en.delete}
              title={dict.en.delete}
              onClick={onConfirmDelete}
              disabled={isLoadingDelete}
            >
              {dict.en.delete}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};
