"use server";

import { ConferenceSelect } from "@/@types";
import ConfernceCard from "@/components/cards/conference";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { cache, type FC, type HTMLAttributes } from "react";
dayjs.extend(isBetween);

const getConferences = cache(async () => {
  const data = await api.conference.all({
    select: [
      ConferenceSelect.end_time,
      ConferenceSelect.id,
      ConferenceSelect.name,
      ConferenceSelect.end_time,
      ConferenceSelect.start_time,
      ConferenceSelect.streams,
    ],
    // filter: "upcoming",
  });

  return data;
});

type ConferencesViewProps = HTMLAttributes<HTMLDivElement>;

const ConferencesView: FC<ConferencesViewProps> = async ({
  className,
  ...props
}) => {
  let conferences = await getConferences();

  if (!conferences?.length) return null;

  // put past conferences at the bottom using the start time and end time
  conferences = conferences.sort((a, b) => {
    if (dayjs(new Date()).isAfter(a?.end_time ?? a?.end_time)) return 0;
    if (dayjs(new Date()).isAfter(b?.end_time ?? b?.end_time)) return -1;

    return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
  });

  // conferences = conferences.sort(
  //   (a, b) => {
  //     return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
  //   },
  // );

  return (
    <div className="overflow-y-auto">
      <div
        className={cn([
          "flex w-full flex-col gap-3 overflow-hidden",
          className,
        ])}
        {...props}
      >
        {conferences.map((conference, i) => {
          return (
            <div key={conference.id}>
              <ConfernceCard
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                {...(conference as any)}
                isUpNext={i === 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConferencesView;
