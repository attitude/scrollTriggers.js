declare interface Window extends EventTarget {
  +document: Document,
  +innerHeight: number,
  +innerWidth: number,
}

declare var window: Window;

declare var addScrollingTriggers: (triggers: ScrollTrigger[]) => void;
declare var setScrollingTriggersFramerate: (newScrollFramerate: number) => void;
