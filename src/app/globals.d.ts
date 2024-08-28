interface GtagEventParameters {
  event_label: string
  value: string | number
}

interface GtagFunction {
  (command: 'config', targetId: string, config?: object): void
  (command: 'event', eventName: string, eventParams?: GtagEventParameters): void
}

declare var gtag: GtagFunction
