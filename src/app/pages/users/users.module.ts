import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { UsersComponent } from "./users.component";
import { AddUsersComponent } from "./component/add-user/add-users.component";
import { UsersListComponent } from "./component/user-list/users-list.component";
import { UsersRoutingModule } from "./module/routing/uses-routing.module";
import { UsersMaterialModule } from "./module/material/users-material.module";
import { ShowChartComponent } from "./component/show-chart/show-chart.component";

@NgModule({
    declarations: [
      UsersComponent,
      UsersListComponent,
      AddUsersComponent,
      ShowChartComponent
        
    ],
    imports: [
        CommonModule,
       ReactiveFormsModule,
        UsersRoutingModule,
        UsersMaterialModule
        
    ]
})
export class UsersModule {}