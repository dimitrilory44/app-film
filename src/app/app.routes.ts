import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'popular',
        children: [
            {
                path: '',
                redirectTo: 'movies',
                pathMatch: 'full'
            },
            {
                path: 'movies', 
                loadComponent: () => 
                    import('@features/pages/popular-titles/popular-titles')
                        .then(m => m.PopularTitlesComponent),
                data: { mediaType: 'movie' }
            },
            {
                path: 'series',
                loadComponent: () =>
                    import('@features/pages/popular-titles/popular-titles')
                        .then(m => m.PopularTitlesComponent),
                data: { mediaType: 'tv' }
            }
        ]
        
    },
    {
        path: '**', 
        redirectTo: 'popular/movies',
    },
];
