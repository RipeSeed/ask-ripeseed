interface GtagEventParameters {
    event_category: string;
    event_label: string;
    value?: Object;
  }
  
  interface GtagFunction {
    (command: 'config', targetId: string, config?: object): void;
    (command: 'event', eventName: string, eventParams?: GtagEventParameters): void;
  }
  
  declare var gtag: GtagFunction;