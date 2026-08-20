import { Signal } from "@angular/core";

export interface ProvidersState<T> {
  value: Signal<T | undefined>;
  isLoading: Signal<boolean>;
  error: Signal<Error | undefined>;
  reload: () => void;
}

export interface TitleDiscover {
  page: number;
  results: Media[];
  total_results: number;
}

export interface Providers {
  results: Provider[];
}

export interface Provider {
  logo_path: string;
  provider_name: string;
  provider_id: number;
}

interface BaseMedia {
  id: number;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieMedia extends BaseMedia {
  media_type: 'movie';
  title: string;
  release_date: string;
}

export interface SeriesMedia extends BaseMedia {
  media_type: 'tv';
  name: string;
  first_air_date: string;
}

export type Media = MovieMedia | SeriesMedia;

export function getMediaTitle(media: Media): string {
  return media.media_type === 'movie' ? media.title : media.name;
}

export function getMediaDate(media: Media): string {
  return media.media_type === 'movie' ? media.release_date : media.first_air_date;
}

export interface TitleCollection {
  id: number;
  description: string;
  items: Media[];
}
