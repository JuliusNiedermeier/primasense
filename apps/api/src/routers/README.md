`./{router}/schema.ts` contains configuration and validation utils for that router. This has to live outside of `/{router}/index.ts` to avoid a circular dependency error. Module A appearently cannot use exports from module B if module B uses exports from moule A. 

Example error that is thrown if this is ignored.
ReferenceError: Cannot access 'CollectionsRouterParamsSchema' before initialization