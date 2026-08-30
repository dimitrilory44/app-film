import { Signal } from "@angular/core";

export interface UserPreferences {
  selectedProviders?: Provider[];
  selectedTitlesGenre?: Genre[];
}

export interface CriteriaList<T> {
  label: string;
  hasOpened: boolean;
  value: Signal<T[]>
}

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

export interface GenreList {
  genres: Genre[];
}

export interface ProvidersApi {
  results: ProviderApi[];
}

export interface Providers {
  results: Provider[];
}

interface ProviderApi {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
  display_priorities: Record<string, number>;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface Genre {
  id: number;
  name: string;
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
