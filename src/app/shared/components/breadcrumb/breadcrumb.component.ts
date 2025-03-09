import { Component, Input } from '@angular/core';
import { FeatherIconsComponent } from '../feather-icons/feather-icons.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    imports: [RouterLink]
})
export class BreadcrumbComponent {
  @Input()
  title!: string;
  @Input()
  items!: Items[];
  @Input()
  active_item!: string;

  constructor() {
    //constructor
  }
}

interface Items{
    path:string;
    name:string;
}
