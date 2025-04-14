import { DOCUMENT, NgClass } from '@angular/common';
import {
    Component,
    Inject,
    ElementRef,
    OnInit,
    Renderer2,
    HostListener,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { InConfiguration, AuthService, WINDOW, RightSidebarService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { WINDOW_PROVIDERS } from '@core/service/window.service';
import { User } from '@core/models/user.model';

interface Notifications {
    message: string;
    time: string;
    icon: string;
    color: string;
    status: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        RouterLink,
        NgClass,
        MatButtonModule,
        FeatherIconsComponent,
        MatMenuModule,
        NgScrollbar,
    ],
    providers: [RightSidebarService, WINDOW_PROVIDERS]
})
export class HeaderComponent
    extends UnsubscribeOnDestroyAdapter
    implements OnInit {

    currentUser?: User;

    selectedBgColor = 'white';
    isDarkSidebar = false;
    isDarTheme = false;




    public config!: InConfiguration;
    isNavbarCollapsed = true;
    isNavbarShow = true;
    isOpenSidebar?: boolean;
    docElement?: HTMLElement;
    isFullScreen = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
        private renderer: Renderer2,
        public elementRef: ElementRef,
        private configService: ConfigService,
        private authService: AuthService,
        private router: Router,
    ) {
        super();
    }
    isDarkTheme = false;

    notifications: Notifications[] = [
        {
            message: 'Please check your mail',
            time: '14 mins ago',
            icon: 'mail',
            color: 'nfc-green',
            status: 'msg-unread',
        },
        {
            message: 'New Patient Added..',
            time: '22 mins ago',
            icon: 'person_add',
            color: 'nfc-blue',
            status: 'msg-read',
        },
        {
            message: 'Your leave is approved!! ',
            time: '3 hours ago',
            icon: 'event_available',
            color: 'nfc-orange',
            status: 'msg-read',
        },
        {
            message: 'Lets break for lunch...',
            time: '5 hours ago',
            icon: 'lunch_dining',
            color: 'nfc-blue',
            status: 'msg-read',
        },
        {
            message: 'Patient report generated',
            time: '14 mins ago',
            icon: 'description',
            color: 'nfc-green',
            status: 'msg-read',
        },
        {
            message: 'Please check your mail',
            time: '22 mins ago',
            icon: 'mail',
            color: 'nfc-red',
            status: 'msg-read',
        },
        {
            message: 'Salary credited...',
            time: '3 hours ago',
            icon: 'paid',
            color: 'nfc-purple',
            status: 'msg-read',
        },
    ];
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.window.pageYOffset ||
            this.document.documentElement.scrollTop ||
            this.document.body.scrollTop ||
            0;
        // if (offset > 50) {
        //   this.isNavbarShow = true;
        // } else {
        //   this.isNavbarShow = false;
        // }
    }
    ngOnInit() {
        this.currentUser = this.authService.currentUserValue;
        this.config = this.configService.configData;
        this.docElement = document.documentElement;

        this.isDarkTheme = localStorage.getItem('theme') === 'dark';
        this.updateTheme();

        // Escuchar cambios en `localStorage` desde otras pestañas
        /*  window.addEventListener('storage', (event) => {
             if (event.key === 'theme-changed') {
                 this.isDarkTheme = localStorage.getItem('theme') === 'dark';
                 this.updateTheme();
             }
         }); */
    }

    updateTheme() {
        if (this.isDarkTheme) {
            this.darkThemeBtnClick();
        } else {
            this.lightThemeBtnClick();
        }
    }


    toggleDarkMode() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');

        if (this.isDarkTheme === true) {
            this.darkThemeBtnClick();
        } else {
            this.lightThemeBtnClick();
        }
        // Disparar evento en todas las pestañas
        localStorage.setItem('theme-changed', Date.now().toString());
    }

    lightThemeBtnClick() {
        this.renderer.removeClass(this.document.body, 'dark');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
        this.renderer.removeClass(this.document.body, 'menu_dark');
        this.renderer.removeClass(this.document.body, 'logo-black');
        if (localStorage.getItem('choose_skin')) {
            this.renderer.removeClass(
                this.document.body,
                localStorage.getItem('choose_skin') as string
            );
        } else {
            this.renderer.removeClass(
                this.document.body,
                'theme-' + this.config.layout.theme_color
            );
        }

        this.renderer.addClass(this.document.body, 'light');
        this.renderer.addClass(this.document.body, 'submenu-closed');
        this.renderer.addClass(this.document.body, 'menu_light');
        this.renderer.addClass(this.document.body, 'logo-white');
        this.renderer.addClass(this.document.body, 'theme-white');
        const theme = 'light';
        const menuOption = 'menu_light';
        this.selectedBgColor = 'white';
        this.isDarkSidebar = false;
        localStorage.setItem('choose_logoheader', 'logo-white');
        localStorage.setItem('choose_skin', 'theme-white');
        localStorage.setItem('theme', theme);
        localStorage.setItem('menuOption', menuOption);
    }
    darkThemeBtnClick() {
        this.renderer.removeClass(this.document.body, 'light');
        this.renderer.removeClass(this.document.body, 'submenu-closed');
        this.renderer.removeClass(this.document.body, 'menu_light');
        this.renderer.removeClass(this.document.body, 'logo-white');
        if (localStorage.getItem('choose_skin')) {
            this.renderer.removeClass(
                this.document.body,
                localStorage.getItem('choose_skin') as string
            );
        } else {
            this.renderer.removeClass(
                this.document.body,
                'theme-' + this.config.layout.theme_color
            );
        }
        this.renderer.addClass(this.document.body, 'dark');
        this.renderer.addClass(this.document.body, 'submenu-closed');
        this.renderer.addClass(this.document.body, 'menu_dark');
        this.renderer.addClass(this.document.body, 'logo-black');
        this.renderer.addClass(this.document.body, 'theme-black');
        const theme = 'dark';
        const menuOption = 'menu_dark';
        this.selectedBgColor = 'black';
        this.isDarkSidebar = true;
        localStorage.setItem('choose_logoheader', 'logo-black');
        localStorage.setItem('choose_skin', 'theme-black');
        localStorage.setItem('theme', theme);
        localStorage.setItem('menuOption', menuOption);
    }

    callFullscreen() {
        if (!this.isFullScreen) {
            if (this.docElement?.requestFullscreen != null) {
                this.docElement?.requestFullscreen();
            }
        } else {
            document.exitFullscreen();
        }
        this.isFullScreen = !this.isFullScreen;
    }
    mobileMenuSidebarOpen(event: Event, className: string) {
        const hasClass = (event.target as HTMLInputElement).classList.contains(
            className
        );
        if (hasClass) {
            this.renderer.removeClass(this.document.body, className);
        } else {
            this.renderer.addClass(this.document.body, className);
        }
    }
    callSidemenuCollapse() {
        const hasClass = this.document.body.classList.contains('side-closed');
        if (hasClass) {
            this.renderer.removeClass(this.document.body, 'side-closed');
            this.renderer.removeClass(this.document.body, 'submenu-closed');
            localStorage.setItem('collapsed_menu', 'false');
        } else {
            this.renderer.addClass(this.document.body, 'side-closed');
            this.renderer.addClass(this.document.body, 'submenu-closed');
            localStorage.setItem('collapsed_menu', 'true');
        }
    }
    logout() {
        this.subs.sink = this.authService.logout().subscribe((res) => {
            if (!res.success) {
                this.router.navigate(['/authentication/signin']);
            }
        });
    }
}
