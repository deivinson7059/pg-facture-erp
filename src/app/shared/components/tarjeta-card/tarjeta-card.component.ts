import { Component, Input } from '@angular/core';
import { CardMenu } from './tarjeta.metadata';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'pg-tarjeta-card',
    imports: [RouterModule],
    templateUrl: './tarjeta-card.component.html',
    styleUrls: ['./tarjeta-card.component.scss'],
})
export class TarjetaCardComponent {
    public imgNewUrl = 'assets/img/icons/new.png';
    @Input() cardMenu: CardMenu[] = [];
}