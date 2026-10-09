import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Building2, Home, MapPin, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";

import SectionHeader from "../../components/dashboard/section-header";
import { SkeletonList, SkeletonListRow } from "../../components/skeleton/skeleton";
import {
  deleteUserAddress,
  getCities,
  getStates,
  saveUserAddress,
  setDefaultUserAddress,
  updateUserAddress,
} from "../../react-query/apis";
import { useUserAddresses } from "../../react-query/hooks";
import { useAuthStore } from "../../store/auth-store";
import { CitiesResponse, StateProps, UserAddress } from "../../types";

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-xl border border-[#d8e4f8] bg-white px-4 text-sm font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100";
const labelClass = "block text-xs font-bold text-[#0f1e57]";

const iconFor = (label: string) => {
  const value = label.toLowerCase();
  if (value.includes("home")) return Home;
  if (value.includes("office")) return Building2;
  return MapPin;
};

const emptyDraft = { label: "", address: "", state_id: "", city_id: "", pincode: "", instructions: "" };

const DashboardAddresses = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useUserAddresses(user?.id);
  const addresses = data?.addresses ?? [];

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");

  const { data: states } = useQuery<StateProps, Error>({
    queryKey: ["states"],
    queryFn: getStates,
    staleTime: Infinity,
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery<CitiesResponse, Error>({
    queryKey: ["cities", draft.state_id],
    queryFn: () => getCities(Number(draft.state_id)),
    enabled: !!draft.state_id,
    staleTime: Infinity,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["user-addresses", user?.id] });
  const failed = () => toast.error("We could not save that. Please try again.");

  const saveMutation = useMutation({
    mutationFn: ({ id, values }: { id: number | null; values: typeof emptyDraft }) => {
      const payload = { user_id: user?.id ?? 0, ...values };
      return id ? updateUserAddress(id, payload) : saveUserAddress(payload);
    },
    onSuccess: () => {
      toast.success("Address saved.");
      refresh();
      cancel();
    },
    onError: failed,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      toast.success("Address removed.");
      refresh();
    },
    onError: failed,
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess: refresh,
    onError: failed,
  });

  const startAdd = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setIsAdding(true);
    setError("");
  };

  const startEdit = (item: UserAddress) => {
    setDraft({
      label: item.label,
      address: item.address,
      state_id: item.state_id ? String(item.state_id) : "",
      city_id: item.city_id ? String(item.city_id) : "",
      pincode: item.pincode ?? "",
      instructions: item.instructions ?? "",
    });
    setEditingId(item.id);
    setIsAdding(false);
    setError("");
  };

  function cancel() {
    setIsAdding(false);
    setEditingId(null);
    setError("");
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.label.trim() || !draft.address.trim()) {
      setError("A label and address are both required.");
      return;
    }
    if (draft.pincode && !/^\d{6}$/.test(draft.pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    saveMutation.mutate({ id: editingId, values: draft });
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeader title="Saved Addresses" description="Manage your saved worksite addresses for quick booking." />
        {!isFormOpen && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0]"
          >
            <Plus size={14} aria-hidden="true" /> Add New Address
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={save} noValidate className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
          <h2 className="text-[13px] font-extrabold text-[#0f1e57]">
            {editingId ? "Edit address" : "Add a new address"}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="address-label" className={labelClass}>
                Label
              </label>
              <input
                id="address-label"
                value={draft.label}
                onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                placeholder="Home, Office, Site – Sector 66"
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address-line" className={labelClass}>
                Address
              </label>
              <input
                id="address-line"
                value={draft.address}
                onChange={(event) => setDraft({ ...draft, address: event.target.value })}
                placeholder="House No, Block, Landmark"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="address-state" className={labelClass}>
                State
              </label>
              <select
                id="address-state"
                value={draft.state_id}
                onChange={(event) => setDraft({ ...draft, state_id: event.target.value, city_id: "" })}
                className={fieldClass}
              >
                <option value="">Select state</option>
                {states?.states?.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address-city" className={labelClass}>
                City
              </label>
              <select
                id="address-city"
                value={draft.city_id}
                disabled={!draft.state_id || isLoadingCities}
                onChange={(event) => setDraft({ ...draft, city_id: event.target.value })}
                className={`${fieldClass} disabled:bg-[#f4f7fd] disabled:text-[#63739a]`}
              >
                <option value="">
                  {!draft.state_id ? "Select a state first" : isLoadingCities ? "Loading cities…" : "Select city"}
                </option>
                {/* `cites` is the upstream response key — the typo is in the API. */}
                {cities?.cites?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address-pincode" className={labelClass}>
                Pincode
              </label>
              <input
                id="address-pincode"
                inputMode="numeric"
                maxLength={6}
                value={draft.pincode}
                onChange={(event) => setDraft({ ...draft, pincode: event.target.value.replace(/\D/g, "") })}
                placeholder="122001"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="address-instructions" className={labelClass}>
                Landmark / Instructions
              </label>
              <input
                id="address-instructions"
                value={draft.instructions}
                onChange={(event) => setDraft({ ...draft, instructions: event.target.value })}
                placeholder="Gate number, floor, whom to contact"
                className={fieldClass}
              />
            </div>
          </div>

          {error && <p className="mt-3 text-[11px] font-semibold text-[#d63a3a]">{error}</p>}

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex min-h-10 items-center rounded-lg bg-[#0b3fc4] px-5 text-[11px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:bg-[#9fb4e4]"
            >
              {saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Save address"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex min-h-10 items-center rounded-lg border border-[#cfe0fb] bg-white px-5 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <SkeletonList count={2} label="Loading your saved addresses">
          {(index) => <SkeletonListRow key={index} lines={2} />}
        </SkeletonList>
      ) : isError ? (
        <div className="rounded-2xl border border-[#f3d6b8] bg-[#fff8ef] p-8 text-center" role="alert">
          <h3 className="text-sm font-extrabold text-[#7a5a1f]">We could not load your addresses</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#7a5a1f]">Please try again shortly.</p>
        </div>
      ) : addresses.length === 0 && !isFormOpen ? (
        <div className="rounded-2xl border border-[#dce7fb] bg-white p-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
            <MapPin size={26} aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">No saved addresses</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#63739a]">
            Save the worksites you book for most often and reuse them at checkout.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0]"
          >
            <Plus size={15} aria-hidden="true" /> Add New Address
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((item) => {
            const Icon = iconFor(item.label);

            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#dce7fb] bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0b3fc4]">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
                      {item.label}
                      {item.is_default && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#63739a]">
                      {[item.address, item.city_name, item.state_name, item.pincode].filter(Boolean).join(", ")}
                    </p>
                    {item.instructions && (
                      <p className="mt-0.5 text-[11px] leading-5 text-[#8fa2c8]">{item.instructions}</p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {!item.is_default && (
                    <button
                      type="button"
                      onClick={() => defaultMutation.mutate(item.id)}
                      className="inline-flex min-h-9 items-center rounded-lg border border-[#cfe0fb] bg-white px-3 text-[11px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
                  >
                    <Pencil size={13} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-[#d63a3a] transition hover:bg-red-50"
                  >
                    <Trash2 size={13} aria-hidden="true" /> Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-[#f2f6fe] px-4 py-3 text-[11px] leading-5 text-[#63739a]">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
        Your addresses are only used for booking worksites and are kept secure.
      </p>
    </div>
  );
};

export default DashboardAddresses;
