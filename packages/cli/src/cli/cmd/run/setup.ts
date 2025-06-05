import chalk from "chalk";
import { Listr } from "listr2";
import { colors } from "../../constants";
import { CmdRunContext, flagsSchema } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import { getConfig } from "../../utils/config";
import createLocalizer from "../../localizer";

export default async function setup(input: CmdRunContext) {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  return new Listr<CmdRunContext>(
    [
      {
        title: "Setting up the environment",
        task: async (ctx, task) => {
          // setup gitignore, etc here
          task.title = `Environment setup completed`;
        },
      },
      {
        title: "Loading i18n configuration",
        task: async (ctx, task) => {
          ctx.config = getConfig(true);

          if (!ctx.config) {
            throw new Error(
              "i18n.json not found. Please run `lingo.dev init` to initialize the project.",
            );
          } else if (
            !ctx.config.buckets ||
            !Object.keys(ctx.config.buckets).length
          ) {
            throw new Error(
              "No buckets found in i18n.json. Please add at least one bucket containing i18n content.",
            );
          } else if (
            ctx.flags.bucket?.some(
              (bucket) =>
                !ctx.config?.buckets[bucket as keyof typeof ctx.config.buckets],
            )
          ) {
            throw new Error(
              `One or more specified buckets do not exist in i18n.json. Please add them to the list first and try again.`,
            );
          }
          task.title = `Loaded i18n configuration`;
        },
      },
      {
        title: "Selecting localization provider",
        task: async (ctx, task) => {
          ctx.localizer = createLocalizer(ctx.config?.provider);
          if (!ctx.localizer) {
            throw new Error(
              "Could not create localization provider. Please check your i18n.json configuration.",
            );
          }
          task.title =
            ctx.localizer.id === "Lingo.dev"
              ? `Using ${chalk.hex(colors.green)(ctx.localizer.id)} provider`
              : `Using raw ${chalk.hex(colors.yellow)(ctx.localizer.id)} API`;
        },
      },
      {
        title: "Checking authentication",
        task: async (ctx, task) => {
          const authStatus = await ctx.localizer!.checkAuth();
          if (!authStatus.authenticated) {
            throw new Error(
              `Failed to authenticate with ${chalk.hex(colors.yellow)(ctx.localizer!.id)} provider. Please check your API key and try again.`,
            );
          }
          task.title = `Authenticated as ${chalk.hex(colors.yellow)(authStatus.username)}`;
        },
      },
      {
        title: "Initializing localization provider",
        async task(ctx, task) {
          const isLingoDotDev = ctx.localizer!.id === "Lingo.dev";

          const subTasks = isLingoDotDev
            ? [
                "Brand voice enabled",
                "Translation memory connected",
                "Glossary enabled",
                "Quality assurance enabled",
              ].map((title) => ({ title, task: () => {} }))
            : [
                "Skipping brand voice",
                "Skipping glossary",
                "Skipping translation memory",
                "Skipping quality assurance",
              ].map((title) => ({ title, task: () => {}, skip: true }));

          return task.newListr(subTasks, {
            concurrent: true,
            rendererOptions: { collapseSubtasks: false },
          });
        },
      },
    ],
    {
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}
