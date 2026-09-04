import { computed, Signal } from "@angular/core";
import { Criteria } from "@core/models/media-model";
import { ArrayKeys, RangeKeys } from "@shared/types/collection.types";

export function makeSelectionHelpers<K extends ArrayKeys<Criteria> & keyof Criteria>(key: K, criteria: Signal<Criteria | undefined>) {
    const items = computed<NonNullable<Criteria[K]>>(() => {
        const value = criteria()?.[key];
        return Array.isArray(value) ? value : [];
    });
    const count = computed(() => items().length ?? 0);
    const hasItems = computed(() => count() > 0);
    return { items, count, hasItems };
}

export function makeRangeHelpers<K extends RangeKeys<Criteria> & keyof Criteria>(key: K, criteria: Signal<Criteria | undefined>, defaultValue: NonNullable<Criteria[K]>, isEqualFn?: (a: NonNullable<Criteria[K]>, b: NonNullable<Criteria[K]>) => boolean) {
    const items = computed<NonNullable<Criteria[K]>>(() => {
        return criteria()?.[key] ?? defaultValue;
    });
    const isDefault = computed(() => {
        if (isEqualFn) {
            return isEqualFn(items(), defaultValue);
        }
        return JSON.stringify(items()) === JSON.stringify(defaultValue)
    });
    return { items, isDefault };
}
