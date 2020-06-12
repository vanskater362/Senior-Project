import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'mileage-tracker',
    children: [
      {
        path: '',
        loadChildren: () => import('./mileage-tracker/mileage-tracker.module').then( m => m.MileageTrackerPageModule)
      },
      {
        path: 'miles-tracker-list',
        loadChildren: () => import('./mileage-tracker/miles-tracker-list/miles-tracker-list.module').then( m => m.MilesTrackerListPageModule)
      }
    ]
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
      },
      {
        path: 'register',
        loadChildren: () => import('./login/register/register.module').then( m => m.RegisterPageModule)
      }
    ]
  },
  {
    path: 'mileage-tracker',
    loadChildren: () => import('./mileage-tracker/mileage-tracker.module').then( m => m.MileageTrackerPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
