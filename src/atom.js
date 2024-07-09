import { atom } from "recoil";

export const wantList = atom({
  key: "want",
  default: [],
});

export const alreadyList = atom({
  key: "already",
  default: [],
});

export const likeList = atom({
  key: "like",
  default: [],
});
