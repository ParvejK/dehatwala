import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Loader2, Trash2 } from "lucide-react";

import { useAuthStore } from "../../store/auth-store";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { initialsOf } from "./nav";
import {
  accountErrorMessage,
  useDeleteProfileImage,
  useUploadProfileImage,
} from "../../react-query/account-api";

/** Matches the API's own rule, so an oversized file is rejected before upload. */
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Profile photo with upload, replace and remove.
 *
 * Falls back to the customer's initials, which is also what the header and
 * dashboard show, so an account with no photo still looks deliberate.
 */
const ProfilePhoto = () => {
  const { user, token, setUserData } = useAuthStore();
  const upload = useUploadProfileImage(token ?? "");
  const remove = useDeleteProfileImage(token ?? "");

  const inputRef = useRef<HTMLInputElement>(null);
  const [broken, setBroken] = useState(false);

  const busy = upload.isPending || remove.isPending;

  // Encoded: uploaded filenames routinely contain spaces and brackets.
  const src = user?.profile_img
    ? `${VITE_IMAGE_PATH_URL}/user/${encodeURIComponent(user.profile_img)}`
    : null;

  const choose = async (file?: File) => {
    if (!file) return;

    // Checked here as well as server-side, so the customer is told immediately
    // rather than after waiting for a 2 MB round trip to be rejected.
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_BYTES) {
      toast.error("That image is over 2 MB. Please choose a smaller one.");
      return;
    }

    try {
      const data = await upload.mutateAsync(file);
      setBroken(false);
      setUserData({ ...user, ...data.user }, token ?? "");
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(accountErrorMessage(error, "We could not upload that photo."));
    } finally {
      // Cleared so re-picking the same file still fires a change event.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = async () => {
    try {
      const data = await remove.mutateAsync();
      setUserData({ ...user, ...data.user }, token ?? "");
      toast.success("Profile photo removed.");
    } catch (error) {
      toast.error(accountErrorMessage(error, "We could not remove that photo."));
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        {src && !broken ? (
          <img
            src={src}
            alt={user?.name ? `${user.name}'s profile photo` : "Profile photo"}
            onError={() => setBroken(true)}
            className="size-20 rounded-full object-cover ring-2 ring-[#dce7fb]"
          />
        ) : (
          <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-extrabold uppercase text-white ring-2 ring-[#dce7fb]">
            {initialsOf(user?.name)}
          </span>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={src ? "Change profile photo" : "Upload profile photo"}
          className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full border-2 border-white bg-[#0b3fc4] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Camera size={13} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-3.5 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera size={12} aria-hidden="true" /> {src ? "Change photo" : "Upload photo"}
          </button>

          {src && (
            <button
              type="button"
              onClick={clear}
              disabled={busy}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 text-[11px] font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={12} aria-hidden="true" /> Remove
            </button>
          )}
        </div>

        <p className="mt-2 text-[11px] leading-4 text-[#8fa2c8]">JPG, PNG or WebP · up to 2 MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => choose(event.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePhoto;
