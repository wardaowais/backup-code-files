"use client";

import { showToast } from "@/components/notify";
import { useAppContext } from "@/context/AppContext";
import { Schedule, ScheduleDay, TimeZone } from "@/models/schedule";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomTimezoneSelect from "@/components/CustomTimezoneSelect";
import CustomTimeSelect from "@/components/CustomTimeSelect";

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

export default function AvailabilityPg() {
  const { getUser, userTkn } = useAppContext();
  const [schedule, setSchedule] = useState<ScheduleDay>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const { register, setValue, handleSubmit, watch } = useForm<Schedule>({
    defaultValues: {
      timezone: "America/Los_Angeles",
      timing: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      },
    },
  });

  // Get the current value of timezone for the custom select
  const currentTimezone = watch("timezone");

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "0:00", end: "0:00" }],
    }));

    setValue("timing", {
      ...schedule,
      [day]: [...schedule[day], { start: "0:00", end: "0:00" }],
    });
    handleSubmit(updateData)();
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));

    setValue("timing", {
      ...schedule,
      [day]: schedule[day].filter((_, i) => i !== index),
    });
    handleSubmit(updateData)();
  };

  useEffect(() => {
    const initSchedule = async () => {
      const userId = await getUser();
      if (userId) setValue("userId", userId);
    };

    initSchedule();
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const userId = await getUser();
        if (!userId) return;

        const supabase = await createClient();
        const { data } = await supabase
          .from("schedule")
          .select("*")
          .eq("userId", userId)
          .single();

        // if (error) {
        //   showToast("error", "Failed to fetch schedule.");
        //   return;
        // }

        if (data) {
          setValue("userId", data.userId);
          setValue("timezone", data.timezone);
          setSchedule(JSON.parse(data.timing));

          if (data.timing) {
            try {
              const timingData = JSON.parse(data.timing);
              setValue("timing", timingData);
            } catch {
              showToast("error", "Failed to parse timing data.");
            }
          }
        } else {
          const { data } = await supabase
            .from("profile")
            .select("*")
            .eq("id", userId)
            .single();

          if (data) {
            setValue("timezone", data.timezone);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };

    if (userTkn) fetchSchedule();
  }, [userTkn]);

  const handleChange = (
    day: string,
    index: number,
    type: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => {
      const updatedDay = [...prev[day]];
      updatedDay[index][type] = value;
      return { ...prev, [day]: updatedDay };
    });
    setValue("timing", {
      ...schedule,
      [day]: schedule[day].map((slot, i) =>
        i === index ? { ...slot, [type]: value } : slot
      ),
    });

    handleSubmit(updateData)();
  };

  const updateData = async (usrData: Schedule) => {
    try {
      const supbase = await createClient();
      const userId = await getUser();

      if (!userId) return;

      // Check if a schedule already exists for this user
      const { data } = await supbase
        .from("schedule")
        .select("id")
        .eq("userId", userId);

      if (data && data.length > 0) {
        const { error } = await supbase
          .from("schedule")
          .update({
            timing: JSON.stringify(usrData.timing),
            timezone: usrData.timezone,
          })
          .eq("id", data[0].id);
        if (error) {
          showToast("error", "Failed to save schedule.");
        }
        showToast("success", "Schedule saved successfully!");
      } else {
        const { error } = await supbase.from("schedule").insert({
          userId: userId,
          timing: JSON.stringify(usrData.timing),
          timezone: usrData.timezone,
        });

        if (error) {
          showToast("error", "Failed to save schedule.");
        }
        showToast("success", "Schedule saved successfully!");
      }

      const { error: error1 } = await supbase
        .from("profile")
        .update({ timezone: usrData.timezone })
        .eq("id", userId);

      if (error1) {
        showToast("error", error1.message);
        return;
      }
    } catch {
      showToast("error", "Failed to save schedule.");
    }
  };

  // Create time options array for time selects
  const timeOptions = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <>
      <div className="max-w-lg w-full">
        {Object.keys(schedule).map((day) => (
          <div key={day} className="mb-5 w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-lg text-primary-900">{day}</h3>
              <button
                onClick={() => addTimeSlot(day)}
                className="bg-primary-900 px-2 py-2 rounded-full cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-white w-4 h-4"
                >
                  <path d="M15.5 8C15.5 8.16576 15.4342 8.32473 15.3169 8.44194C15.1997 8.55915 15.0408 8.625 14.875 8.625H8.625V14.875C8.625 15.0408 8.55915 15.1997 8.44194 15.3169C8.32473 15.4342 8.16576 15.5 8 15.5C7.83424 15.5 7.67527 15.4342 7.55806 15.3169C7.44085 15.1997 7.375 15.0408 7.375 14.875V8.625H1.125C0.95924 8.625 0.800269 8.55915 0.683058 8.44194C0.565848 8.32473 0.5 8.16576 0.5 8C0.5 7.83424 0.565848 7.67527 0.683058 7.55806C0.800269 7.44085 0.95924 7.375 1.125 7.375H7.375V1.125C7.375 0.95924 7.44085 0.800269 7.55806 0.683058C7.67527 0.565848 7.83424 0.5 8 0.5C8.16576 0.5 8.32473 0.565848 8.44194 0.683058C8.55915 0.800269 8.625 0.95924 8.625 1.125V7.375H14.875C15.0408 7.375 15.1997 7.44085 15.3169 7.55806C15.4342 7.67527 15.5 7.83424 15.5 8Z" />
                </svg>
              </button>
            </div>

            {schedule[day].length > 0 ? (
              schedule[day].map((slot, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-[#EAEAEB] ">
                    <CustomTimeSelect
                      value={slot.start}
                      onChange={(e) => handleChange(day, index, "start", e.target.value)}
                      options={timeOptions}
                      className=" "
                    />
                    <span>-</span>
                    <CustomTimeSelect
                      value={slot.end}
                      onChange={(e) => handleChange(day, index, "end", e.target.value)}
                      options={timeOptions}
                      className=" "
                    />
                    <button
                      onClick={() => removeTimeSlot(day, index)}
                      className="bg-[#DADADC] p-[14px] ml-1 text-primary-900 rounded-full cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="2"
                        viewBox="0 0 16 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-primary-900 w-5 h-5"
                      >
                        <path d="M15.5 1C15.5 1.16576 15.4342 1.32473 15.3169 1.44194C15.1997 1.55915 15.0408 1.625 14.875 1.625H1.125C0.95924 1.625 0.800269 1.55915 0.683058 1.44194C0.565848 1.32473 0.5 1.16576 0.5 1C0.5 0.83424 0.565848 0.675269 0.683058 0.558058C0.800269 0.440848 0.95924 0.375 1.125 0.375H14.875C15.0408 0.375 15.1997 0.440848 15.3169 0.558058C15.4342 0.675269 15.5 0.83424 15.5 1Z" />
                      </svg>
                    </button>
                  </div>
                  {parseInt(slot.start.split(":")[0]) >=
                    parseInt(slot.end.split(":")[0]) && (
                    <p className="text-error text-sm mt-1">
                      Choose an end time later than the start time
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-primary-600">Unavailable</p>
            )}
          </div>
        ))}
        <div className="mt-8 mb-4">
          <div className="relative">
            <CustomTimezoneSelect
              id="timezone"
              options={timezones}
              value={currentTimezone}
              onChange={(e) => setValue("timezone", e.target.value)}
              register={register}
              className="text-sm text-primary-600"
            />
          </div>
        </div>
      </div>
    </>
  );
}
