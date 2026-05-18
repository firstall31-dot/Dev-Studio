import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iqx_ng_${i}`;

/** Angular-specific interview questions */
export const angularQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "frontend", difficulty: "junior", category: "Angular",
    question: "What is Angular's component lifecycle and name the key hooks?",
    answer: "Angular components go through: ngOnChanges (input changes), ngOnInit (after first change detection), ngDoCheck, ngAfterContentInit, ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked, ngOnDestroy. Most commonly used: ngOnInit (setup), ngOnDestroy (cleanup subscriptions), ngOnChanges (react to @Input changes).",
    tags: ["angular", "lifecycle", "components"], createdAt: now,
  },
  {
    id: q(2), area: "frontend", difficulty: "mid", category: "Angular",
    question: "How does Angular's dependency injection system work?",
    answer: "Angular has a hierarchical DI system. Services are registered in providers (root injector, module injector, or component injector). When a component requests a service via constructor injection, Angular walks up the injector tree to find a provider. `providedIn: 'root'` makes a service a singleton app-wide. Component-level providers create a new instance per component subtree.",
    tags: ["angular", "dependency-injection", "services"], createdAt: now,
  },
  {
    id: q(3), area: "frontend", difficulty: "senior", category: "Angular",
    question: "What is the difference between Default and OnPush change detection in Angular?",
    answer: "Default: Angular checks the entire component tree on every event/async operation (slow for large apps). OnPush: Angular only checks when 1) an @Input reference changes (immutable data), 2) an event originates from the component or its children, 3) async pipe emits, or 4) markForCheck() is called manually. OnPush requires immutable data patterns and delivers significant performance gains.",
    tags: ["angular", "change-detection", "performance"], favorite: true, createdAt: now,
  },
  {
    id: q(4), area: "frontend", difficulty: "junior", category: "Angular",
    question: "What is the difference between structural and attribute directives in Angular?",
    answer: "Structural directives change DOM layout by adding/removing elements — prefixed with * (*ngIf, *ngFor, *ngSwitch). They use the `<ng-template>` syntax under the hood. Attribute directives change the appearance or behavior of an existing element without changing structure (ngClass, ngStyle, custom directives using @HostListener/@HostBinding).",
    tags: ["angular", "directives"], createdAt: now,
  },
  {
    id: q(5), area: "frontend", difficulty: "mid", category: "Angular",
    question: "What is RxJS and how is it central to Angular?",
    answer: "RxJS is a library for reactive programming using Observables. Angular uses it throughout: HttpClient returns Observables, Router events are streams, Forms have valueChanges/statusChanges Observables, EventEmitter extends Subject. Key operators: map, filter, switchMap (cancel previous), mergeMap (concurrent), takeUntil (cleanup), combineLatest, debounceTime. Always unsubscribe in ngOnDestroy or use async pipe.",
    tags: ["angular", "rxjs", "observables"], favorite: true, createdAt: now,
  },
  {
    id: q(6), area: "frontend", difficulty: "mid", category: "Angular",
    question: "What are Angular Signals and how do they differ from RxJS?",
    answer: "Signals (Angular 16+) are reactive primitives — a signal holds a value and notifies consumers when it changes. Simpler than RxJS for synchronous state: `const count = signal(0); count.set(1); count.update(v => v+1); computed(() => count() * 2)`. Unlike RxJS, signals are synchronous, don't need subscription management, and integrate with OnPush change detection automatically. RxJS remains better for async event streams.",
    tags: ["angular", "signals", "reactivity"], createdAt: now,
  },
  {
    id: q(7), area: "frontend", difficulty: "mid", category: "Angular",
    question: "How does lazy loading work in Angular?",
    answer: "Lazy loading defers loading feature modules/components until their route is activated. In the router: `loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)` or with standalone components: `loadComponent: () => import('./feature.component')`. Reduces initial bundle size. Works with preloading strategies (PreloadAllModules, custom) to fetch lazy chunks in the background after initial load.",
    tags: ["angular", "lazy-loading", "performance", "routing"], createdAt: now,
  },
  {
    id: q(8), area: "frontend", difficulty: "mid", category: "Angular",
    question: "What is the difference between Template-driven and Reactive forms in Angular?",
    answer: "Template-driven: logic lives in the template (ngModel, ngForm), simple and familiar, less testable, async validation is complex. Reactive: form structure defined in component class (FormControl, FormGroup, FormArray), synchronous access to form tree, fully testable, better for complex dynamic forms. Both use `FormsModule` or `ReactiveFormsModule`. Reactive forms are preferred for non-trivial forms.",
    tags: ["angular", "forms"], createdAt: now,
  },
];
