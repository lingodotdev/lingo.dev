import { Command } from "interactive-commander";
import { readConfig } from "../../utils/config";
import { getAllBucketFiles } from "../../utils/files";
import { getLocales } from "../../utils/locales";
import chalk from "chalk";
import { readFileSync } from "fs";
import path from "path";
import Table from "cli-table3";

interface TranslationStats {
  locale: string;
  totalKeys: number;
  translatedKeys: number;
  coverage: number;
  missingKeys: string[];
}

export default new Command()
  .command("stats")
  .description("Show translation coverage statistics for all locales")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    try {
      const config = await readConfig();
      const locales = await getLocales();
      const sourceLocale = config.sourceLocale || "en";
      const bucketFiles = await getAllBucketFiles();
      
      const stats: TranslationStats[] = [];
      
      // Process each locale
      for (const locale of locales) {
        if (locale === sourceLocale) continue;
        
        let totalKeys = 0;
        let translatedKeys = 0;
        const missingKeys: string[] = [];
        
        // Process each bucket file
        for (const file of bucketFiles) {
          try {
            const sourcePath = file.replace("[locale]", sourceLocale);
            const targetPath = file.replace("[locale]", locale);
            
            const sourceContent = readFileSync(sourcePath, 'utf8');
            let targetContent;
            
            try {
              targetContent = readFileSync(targetPath, 'utf8');
            } catch (err) {
              targetContent = "{}";
            }
            
            const sourceKeys = Object.keys(JSON.parse(sourceContent));
            const targetKeys = Object.keys(JSON.parse(targetContent));
            
            totalKeys += sourceKeys.length;
            translatedKeys += targetKeys.length;
            
            // Track missing keys
            const missing = sourceKeys.filter(key => !targetKeys.includes(key));
            if (missing.length > 0) {
              missingKeys.push(...missing.map(key => `${path.basename(file)}: ${key}`));
            }
          } catch (err) {
            // Skip files that can't be parsed
            continue;
          }
        }
        
        const coverage = totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0;
        
        stats.push({
          locale,
          totalKeys,
          translatedKeys,
          coverage,
          missingKeys
        });
      }
      
      // Print overall statistics
      console.log(chalk.bold("\n📊 Translation Coverage Report\n"));
      
      const table = new Table({
        head: ['Locale', 'Total Keys', 'Translated', 'Coverage'],
        style: {
          head: ['cyan'],
          border: ['gray']
        }
      });
      
      for (const stat of stats) {
        const coverageColor = 
          stat.coverage >= 90 ? chalk.green :
          stat.coverage >= 70 ? chalk.yellow :
          chalk.red;
          
        table.push([
          stat.locale,
          stat.totalKeys,
          stat.translatedKeys,
          coverageColor(`${stat.coverage.toFixed(1)}%`)
        ]);
      }
      
      console.log(table.toString());
      
      // Print missing keys
      console.log(chalk.bold("\n❌ Missing Keys:\n"));
      for (const stat of stats) {
        if (stat.missingKeys.length > 0) {
          console.log(chalk.yellow(`\n${stat.locale}:`));
          stat.missingKeys.forEach(key => {
            console.log(`  - ${key}`);
          });
        }
      }
      
      console.log(); // Empty line at end
      
    } catch (error) {
      console.error(chalk.red("Error generating stats:"), error);
      process.exit(1);
    }
  });