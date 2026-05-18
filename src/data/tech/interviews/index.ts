// ── Core questions (by area) ────────────────────────────────────────────────
export { frontendCoreQuestions }   from "./frontend";
export { backendCoreQuestions }    from "./backend";
export { devopsCoreQuestions }     from "./devops";
export { testingCoreQuestions }    from "./testing";
export { generalCoreQuestions }    from "./general";

// ── Extended questions (by framework / ecosystem) ──────────────────────────
export { angularQuestions }                                       from "./angular";
export { vueQuestions, svelteQuestions, nextjsQuestions }        from "./frameworks-frontend";
export { aspnetQuestions, databaseExtraQuestions,
         backendTestingQuestions, drizzlePostgresQuestions }     from "./frameworks-backend";
