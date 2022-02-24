module.exports = {
  onPreBuild: async ({ utils: { build, run, status } }) => {
    try {
      if (process.env.CI) {
        await run.command(
          "npx pnpm install --filter @open-decision/frontend @open-decision/type-classes @open-legal-tech/design-system -r --shamefully-hoist --store=node_modules/.pnpm-store --no-frozen-lockfile"
        );
      } else {
        status.show({ summary: "CI is false, skipping pnpm install." });
      }

      status.show({ summary: "Installed pnpm!" });
    } catch (e) {
      build.failBuild(`An error occured while installing pnpm: ${e.message}`);
    }
  },
};
