import DefaultLoader from "@/components/loading/default";
import { Separator } from "@/components/ui/separator";
import ConferencesView from "@/components/views/conferences";
import GamesView from "@/components/views/games";
import HomeConferenceSelectDropdown from "@/components/views/homeConferenceSelectDropdown";
import HomeDropdown from "@/components/views/homeDropdown";

import { Suspense } from "react";

type PageProps = {
  searchParams?: {
    sortGameBy?: "date-asc" | "date-desc";
    search?: string;
    [key: string]: string | undefined;
  };
};

export default async function Home({ searchParams }: PageProps) {
  return (
    <main className="flex min-h-screen flex-col gap-4 p-5 px-4 md:flex-row md:px-10">
      <div className="order-2 flex w-full flex-col gap-4 px-4 md:order-1 md:w-full md:px-0">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Games</h1>
          <div className="flex gap-2">
            <Suspense>
              <HomeDropdown />
            </Suspense>

            <Suspense fallback={<DefaultLoader />}>
              <HomeConferenceSelectDropdown />
            </Suspense>

            {/* <Button variant="outline" size="sm" className="h-8 gap-2">
              <FilterIcon className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button> */}
          </div>
        </div>
        <Suspense fallback={<DefaultLoader />}>
          <GamesView searchParams={searchParams} />
        </Suspense>
      </div>
      <div className="relative order-1 flex h-[600px] w-full justify-end md:order-2 md:w-[30%] md:min-w-[420px]">
        <div className="flex w-full flex-col gap-2 rounded-lg bg-muted/40 p-2">
          <h1 className="text-center text-lg font-bold">Conferences</h1>
          <Separator className="mb-2" />
          <Suspense fallback={<DefaultLoader />}>
            <ConferencesView
              className="w-full pr-3"
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
