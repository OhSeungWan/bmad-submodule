const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * DAE: Data Analysis Expert Module Installer
 * Creates necessary directories for analysis outputs
 */
async function install(options) {
  const { projectRoot, config, logger } = options;

  try {
    logger.log(chalk.blue('Installing DAE: Data Analysis Expert...'));

    // Create analysis output folder
    if (config['analysis_output_folder']) {
      const dirConfig = config['analysis_output_folder'].replace(
        '{project-root}/',
        '',
      );
      const dirPath = path.join(projectRoot, dirConfig);
      if (!(await fs.pathExists(dirPath))) {
        logger.log(chalk.yellow(`Creating directory: ${dirConfig}`));
        await fs.ensureDir(dirPath);
      }
    }

    logger.log(chalk.green('✓ DAE module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing DAE module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
