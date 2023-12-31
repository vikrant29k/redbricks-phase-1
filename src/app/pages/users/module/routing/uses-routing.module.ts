import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUsersComponent } from "../../component/add-user/add-users.component";
import { UsersListComponent } from "../../component/user-list/users-list.component";
import { UsersComponent } from "../../users.component";
import { ShowChartComponent } from "../../component/show-chart/show-chart.component";
const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: '',
                redirectTo: 'user-list',
                pathMatch: 'full'
            },
            {
                path: 'add-users',
                component: AddUsersComponent
            },
            {
                path: 'add-users/:id',
                component: AddUsersComponent
            },
            {
                path: 'user-list',
                component: UsersListComponent
            },
            {
                path: 'show-details/:id',
                component: ShowChartComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UsersRoutingModule {}