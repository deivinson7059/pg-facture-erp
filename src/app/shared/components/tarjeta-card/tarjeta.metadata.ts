export interface CardItem {
    title: string;
    subtitle: string;
    icon: string;
    url: string | null | any;
    queryParams: {};
    color: string;
    onClick: Function | void | null;
  }
  
  export interface Menu {
    titulo: string;
    id: string;
    icono: string;
    _id: number;
    bre_id: number;
    breadcrumbs: Breadcrumbs[];
    submenu: Submenu[];
  }
  
  export interface Breadcrumbs {
    _id?: number;
    label: string;
    url?: string | null;
    active: boolean;
  }
  
  export interface Submenu {
    titulo: string;
    subtitle: string;
    url: string;
    urlImagen: string;
    isNew: boolean;
    _id: number;
    bre_id: number;
    breadcrumbs: Breadcrumbs[];
  }
  
  export interface Sucursal {
    cmpy_name: string;
    cmpy: string;
    suc_id: number;
    suc_name: string;
    rol_id: number;
    rol_name: string;
    person_id: number;
    path: string;
    selected: boolean;
  }
  
  export interface Breadcrumbs2 {
    item: BreadcrumbItem;
  }
  
  export interface BreadcrumbItem {
    label: string;
    url?: string;
    active?: boolean;
  }
  
  export interface Cmpy {
    code?: string;
    name?: string;
  }
  
  export interface Mails {
    icon: string;
    url: string;
    content: string;
    footer: string;
    read: boolean;
  }
  
  export interface Notifications {
    class: string;
    url: string;
    details: string;
    content: string;
    read: boolean;
  }
  
  export interface MenuLateral {
    url: string;
    title: string;
    icon: string;
  }
  
  export interface Comments {
    id?: number;
    cmpy: string;
    ware: string;
    father: string;
    cod_father: string | number;
    comment: string;
    user_enter: string;
    user_enter_id: string;
    date_in: string;
    isNew: boolean;
  }
  
  export interface getComments {
    cmpy: string;
    ware: string;
    father: string;
    cod_father: string | number;
  }
  
  export interface commentsResponse {
    code: number;
    total: number;
    success: boolean;
    messages: Messages;
    Comments: Comments[];
  }
  export interface Messages {
    success?: string;
    error?: string;
  }