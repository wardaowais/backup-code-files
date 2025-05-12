"use client";

import Loading from "@/components/loading";
import { showToast } from "@/components/notify";
import { useAppContext } from "@/context/AppContext";
import { Profile } from "@/models/profile";
import { TimeZone } from "@/models/schedule";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const timezones: TimeZone[] = [
  { value: "Europe/Berlin", label: "Central European Time (CET)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Pacific/Auckland", label: "New Zealand Standard Time (NZST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "America/Sao_Paulo", label: "Brasilia Time (BRT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Standard Time (HST)" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST)" },
  { value: "Asia/Seoul", label: "Korea Standard Time (KST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Europe/Moscow", label: "Moscow Standard Time (MSK)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Bangkok", label: "Indochina Time (ICT)" },
  { value: "America/Phoenix", label: "Mountain Standard Time (MST)" },
];

export default function ProfilePg() {
  const [isProf, setIsProf] = useState(false);
  const [usrImg, setUsrImg] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const upTypes: string[] = ["jpg", "jpeg", "png", "gif", "webp"];
  const {
    getUser,
    getUserImg,
    userNm,
    loading,
    setLoading,
    changeUsrName,
    changeImg,
    userImg,
  } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Profile>();

  const fetchProfile = async () => {
    const supabase = await createClient();
    const userId = await getUser();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      reset({ id: userId, name: userNm ? userNm : "" });
      setIsProf(false);
      return;
    }

    reset(data);
    setIsProf(true);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeleteAvatar = async () => {
    try {
      setIsDeleting(true);
      const supabase = await createClient();
      const userId = await getUser();

      // First, get the current avatar path
      const { data: profileData } = await supabase
        .from("profile")
        .select("avatar")
        .eq("id", userId)
        .single();

      if (profileData && profileData.avatar) {
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from("avatars")
          .remove([profileData.avatar]);

        if (storageError) {
          showToast("error", "Error removing image from storage");
          setIsDeleting(false);
          return;
        }
      }

      // Update the auth user data
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      });

      if (authError) {
        showToast("error", authError.message);
        setIsDeleting(false);
        return;
      }

      // Update the profile in database
      const { error: profileError } = await supabase
        .from("profile")
        .update({ avatar: null })
        .eq("id", userId);

      if (profileError) {
        showToast("error", profileError.message);
        setIsDeleting(false);
        return;
      }

      // Update local state
      setUsrImg(undefined);
      changeImg(null);
      showToast("success", "Profile picture deleted successfully!");
    } catch (error) {
      showToast("error", "Failed to delete profile picture");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();

    if (!upTypes.find((x) => x === fileExt)) {
      showToast("error", "File Must Be jpg/jpeg/png/gif/webp!");
      return false;
    }

    if (file.size >= 4148576) {
      showToast("error", "Image Must Be Under 4 MB!");
      return false;
    }

    try {
      setIsUploading(true);
      const supabase = await createClient();
      const userId = await getUser();

      const fileName = `${userId}-${Date.now().toString()}.${fileExt}`; // Save image as userId.extension
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) {
        showToast("error", error.message);
        return;
      } else {
        const { error: error1 } = await supabase.auth.updateUser({
          data: {
            avatar_url: `${data.path}`,
          },
        });

        if (error1) {
          showToast("error", error1.message);
          return;
        }

        const { error: error2 } = await supabase
          .from("profile")
          .upsert({
            avatar: `${data.path}`,
          })
          .eq("id", userId);

        if (error2) {
          showToast("error", error2.message);
          return;
        }

        changeImg(data.path);
        showToast("success", "Image uploaded successfully!");
      }
    } catch {
      showToast("error", "Image upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (profData: Profile) => {
    const { name, bio, instagram, tiktok, snapchat, timezone } = profData;

    setLoading(true);

    const supabase = await createClient();
    const userId = await getUser();

    if (isProf) {
      const { error } = await supabase
        .from("profile")
        .upsert({
          name,
          bio,
          instagram,
          tiktok,
          snapchat,
          timezone,
        })
        .eq("id", userId);

      if (error) {
        showToast("error", error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("profile").insert({
        id: userId,
        name,
        bio,
        instagram,
        tiktok,
        snapchat,
        timezone,
      });

      if (error) {
        showToast("error", error.message);
        setLoading(false);
        return;
      }
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: name,
      },
    });

    if (authError) {
      showToast("error", authError.message);
      setLoading(false);
      return;
    }

    const { error: error1 } = await supabase
      .from("schedule")
      .update({ timezone: timezone })
      .eq("userId", userId);

    if (error1) {
      showToast("error", error1.message);
      return;
    }

    changeUsrName(name);

    setLoading(false);
    fetchProfile(); // Refresh profile data
    showToast("success", "Profile updated successfully");
  };

  useEffect(() => {
    const userImagePath = async () => {
      const img = await getUserImg();

      setUsrImg(img);
    };

    if (userImg) {
      userImagePath();
    }
  }, [userImg]);

  return (
    <>
      <div className="w-full max-w-lg">
        <h2 className="text-lg text-primary-900 mb-4">Profile</h2>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 bg-primary-900 text-white flex items-center justify-center text-3xl font-bold rounded-full mb-4 relative">
            {isUploading || isDeleting ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary-900 bg-opacity-70">
                <Loading size="md" />
              </div>
            ) : null}
            {usrImg ? (
              <Image
                src={usrImg}
                alt="Profile Image"
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              userNm?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex gap-3 mb-2">
              <input
                type="file"
                name=""
                id="profImg"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <label
                htmlFor="profImg"
                className="text-sm text-black border border-primary-200 px-4 py-2.5 rounded-full hover:bg-primary-200 inline-block transition-all ease-in-out cursor-pointer"
              >
                {usrImg ? "Update Picture" : "Upload Picture"}
              </label>
              
              {usrImg && (
                <button
                  onClick={handleDeleteAvatar}
                  className="text-sm text-primary-900 border border-primary-200 px-4 py-2.5 rounded-full hover:bg-primary-900 hover:text-white inline-flex items-center transition-all ease-in-out cursor-pointer group"
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-primary-900 group-hover:fill-white transition-all ease-in-out mr-2"
                  >
                    <path d="M14.875 2.75H1.125C0.95924 2.75 0.800269 2.81585 0.683058 2.93306C0.565848 3.05027 0.5 3.20924 0.5 3.375C0.5 3.54076 0.565848 3.69973 0.683058 3.81694C0.800269 3.93415 0.95924 4 1.125 4H1.75V15.25C1.75 15.5815 1.8817 15.8995 2.11612 16.1339C2.35054 16.3683 2.66848 16.5 3 16.5H13C13.3315 16.5 13.6495 16.3683 13.8839 16.1339C14.1183 15.8995 14.25 15.5815 14.25 15.25V4H14.875C15.0408 4 15.1997 3.93415 15.3169 3.81694C15.4342 3.69973 15.5 3.54076 15.5 3.375C15.5 3.20924 15.4342 3.05027 15.3169 2.93306C15.1997 2.81585 15.0408 2.75 14.875 2.75ZM13 15.25H3V4H13V15.25ZM4.25 0.875C4.25 0.70924 4.31585 0.550268 4.43306 0.433058C4.55027 0.315848 4.70924 0.25 4.875 0.25H11.125C11.2908 0.25 11.4497 0.315848 11.5669 0.433058C11.6842 0.550268 11.75 0.70924 11.75 0.875C11.75 1.04076 11.6842 1.19973 11.5669 1.31694C11.4497 1.43415 11.2908 1.5 11.125 1.5H4.875C4.70924 1.5 4.55027 1.43415 4.43306 1.31694C4.31585 1.19973 4.25 1.04076 4.25 0.875Z" />
                  </svg>
                  Delete Picture
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              JPG, GIF or PNG. Max size of 5MB.
            </p>
          </div>
        </div>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(handleProfileUpdate)}
        >
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Your Name"
              className={`w-full py-3 px-5 border outline-none transition-all ease-in-out ${
                errors.name
                  ? "border-error focus:border-error"
                  : "border-primary-200 focus:border-primary-900"
              }`}
            />
            {errors.name && (
              <p className="text-sm font-medium text-error mt-2">
                {errors?.name?.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              Bio
            </label>
            <textarea
              {...register("bio")}
              placeholder="I swipe right on good convos and great coffee."
              className="w-full text-base h-32 py-3 px-5 border border-primary-200  outline-none focus:border-primary-900 transition-all ease-in-out"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              Instagram
            </label>
            <input
              type="text"
              {...register("instagram")}
              placeholder="Username"
              className="w-full text-base py-3 px-5 border border-primary-200  outline-none focus:border-primary-900 transition-all ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              TikTok
            </label>
            <input
              type="text"
              {...register("tiktok")}
              placeholder="Username"
              className="w-full text-base py-3 px-5 border border-primary-200  outline-none focus:border-primary-900 transition-all ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              Snapchat
            </label>
            <input
              type="text"
              {...register("snapchat")}
              placeholder="Username"
              className="w-full text-base py-3 px-5 border border-primary-200  outline-none focus:border-primary-900 transition-all ease-in-out"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-1">
              Time Zone
            </label>
            <select
              {...register("timezone")}
              className="w-full text-base py-3 px-5 border border-primary-200  outline-none focus:border-primary-900 transition-all ease-in-out bg-transparent"
            >
              {timezones.map((timezone) => (
                <option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-4 rounded-full font-normal text-based bg-primary-900 text-white hover:bg-primary-700 transition-all ease-in-out"
          >
            {loading ? <Loading /> : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}
