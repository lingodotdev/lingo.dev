import { CmdRunContext } from "./_types";

export default async function dryRun(ctx: CmdRunContext): Promise<void> {
  console.log("\n🔍 DRY-RUN MODE - No translations will be performed\n");

  // Calculate statistics
  const totalTasks = ctx.tasks.length;
  const targetLocales = ctx.config?.locale?.targets || [];

  console.log(`📊 Summary:`);
  console.log(`   Total translation tasks: ${totalTasks}`);
  console.log(`   Target locales: ${targetLocales.join(", ")}`);

  console.log("\n✅ Dry-run complete - no changes were made\n");

  // Exit early to prevent actual execution
  process.exit(0);
}
