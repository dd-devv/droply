import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from "../common/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { ButtonDialComponent } from "../common/button-dial/button-dial.component";

@Component({
  selector: 'app-layout-admin',
  imports: [RouterOutlet, SidebarComponent, ButtonDialComponent],
  templateUrl: './layout-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutAdminComponent { }
