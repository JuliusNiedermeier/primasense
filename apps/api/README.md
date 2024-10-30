There is currently an issue with drizzle-kit that I am working around by compiling to JavaScript before using any drizzle-kit command.

This project uses ES modules (package.json has `{"type": "module"}`). For various reasons this is desireable. For example nanoid doesnt support CJS since version 4 and cannot be imported into a CommonJS module.
This setup requires relative paths in import statements to have explicit .js file extensions, even when importing a .ts file. This is how TypeScript works and it will probably not change in the future.

Drizzle kit under the hood seems to be still using CommonJS, and is not able to resolve any import paths with .js if in reality only the .ts file exists.

After some trying, the best approach seems to be compiling the project down to JavaScript and pointing to the build output in drizzle.config.ts. This way it can actually find the files referenced using the explicit .js extension. For convenience I added the build command before the drizzle:push script (`drizzle-kit push`) inside package.json.
