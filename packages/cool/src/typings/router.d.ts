import 'vue-router';

declare module 'vue-router' {
  interface RouteMenuConfig {
    label: string;
    key: string;
    icon: string;
    path?: string;
    disabled?: boolean;
    isSubMenu?: boolean;
    children?: RouteMenuConfig[];
  }

  interface RouteBreadcrumbConfig {
    title: string;
    path?: string;
  }
  interface RouteMeta {
    // key: string;
    // breadcrumb?: RouteBreadcrumbConfig[];
    belongsTo?: string;
    menu?: RouteMenuConfig;
    resourceKey?: string;
  }
}

export {};
