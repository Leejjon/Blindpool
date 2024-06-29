/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import {Match} from "./model/Match";

import {defaultCompetitions} from "./locales/i18n";
import "./entry.client.css";

export interface BpSnackbarMessageProps {
  setMessage: (message: string | undefined) => void;
}

export interface BpMatchesProps {
  matches: Array<Match>;
}

export interface BpCompetitionProps {
  competitionsToWatch: Array<number>;
  setCompetitionsToWatch?: (competitions: Array<number>) => void;
}

export interface BpSelectedMatchProps {
  selectedMatchId?: string;
  setSelectedMatchId: (matchId: string | undefined) => void;
}

const localStorageName = "competitions";

function updateCompetitionsInLocalStorage(competitions: Array<number>) {
  const localCompetitions = localStorage.getItem("competitions");
  const competitionsStringified = JSON.stringify(competitions);
  if (JSON.stringify(competitions) === JSON.stringify(defaultCompetitions)) {
      localStorage.removeItem(localStorageName)
  } else if (localCompetitions !== competitionsStringified) {
      localStorage.setItem(localStorageName, competitionsStringified);
  }
}

function getCompetitionsFromLocalStorage(): Array<number> {
  const localCompetitions = localStorage.getItem(localStorageName);
  if (localCompetitions) {
      const localCompetitionsObject: Array<number> = JSON.parse(localCompetitions);
      if (localCompetitionsObject.includes(2018)) {
          return localCompetitionsObject;
      } else {
          localCompetitionsObject.push(2018);
          return localCompetitionsObject.sort(function(a, b) {
              return a - b;
          });
      }
  } else {
      return defaultCompetitions;
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
