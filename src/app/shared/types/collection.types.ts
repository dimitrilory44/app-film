import { CriteriaListItem, CriteriaRangeItem, MovieMedia, SeriesMedia } from "@core/models/media-model";

export type ArrayKeys<T> = { [K in keyof T]: T[K] extends any[] | undefined ? K : never }[keyof T];
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type RangeKeys<T> = { [K in keyof T]: T[K] extends object | undefined ? (T[K] extends any[] | undefined ? never : K) : never }[keyof T];

export type Media = MovieMedia | SeriesMedia;

export type CriteriaItem =
  | CriteriaRangeItem<'release'>
  | CriteriaListItem<'genders'>;