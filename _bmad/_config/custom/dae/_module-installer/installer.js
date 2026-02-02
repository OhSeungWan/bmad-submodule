const fs = require('node:fs');
const path = require('node:path');

/**
 * DAE: Data Analysis Expert Module Installer
 * Creates necessary directories and Claude Code commands
 */
async function install(options) {
  const { projectRoot, config, logger } = options;

  try {
    logger.log('Installing DAE: Data Analysis Expert...');

    // Create analysis output folder
    if (config['analysis_output_folder']) {
      const dirConfig = config['analysis_output_folder'].replace(
        '{project-root}/',
        '',
      );
      const dirPath = path.join(projectRoot, dirConfig);
      if (!fs.existsSync(dirPath)) {
        logger.log(`Creating directory: ${dirConfig}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // Create sidecar memory folder for data-analyst agent
    const sidecarPath = path.join(
      projectRoot,
      '_bmad/_memory/data-analyst-sidecar',
    );
    if (!fs.existsSync(sidecarPath)) {
      logger.log('Creating sidecar memory folder...');
      fs.mkdirSync(path.join(sidecarPath, 'knowledge'), { recursive: true });
      fs.mkdirSync(path.join(sidecarPath, 'workflows'), { recursive: true });

      // Copy sidecar templates if they exist
      const templatePath = path.join(
        projectRoot,
        '_bmad/dae/_sidecar-templates/data-analyst-sidecar',
      );
      if (fs.existsSync(templatePath)) {
        const files = ['instructions.md', 'memories.md'];
        for (const file of files) {
          const src = path.join(templatePath, file);
          const dest = path.join(sidecarPath, file);
          if (fs.existsSync(src) && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }
    }

    // Create Claude Code commands for agents
    const agentCommandsPath = path.join(
      projectRoot,
      '.claude/commands/bmad/dae/agents',
    );
    if (!fs.existsSync(agentCommandsPath)) {
      logger.log('Creating Claude Code agent commands...');
      fs.mkdirSync(agentCommandsPath, { recursive: true });
    }

    // Create data-analyst agent command
    const dataAnalystCommandPath = path.join(
      agentCommandsPath,
      'data-analyst.md',
    );
    if (!fs.existsSync(dataAnalystCommandPath)) {
      const agentCommandContent = `---
name: 'data-analyst'
description: 'Data Analysis Expert'
---

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @_bmad/dae/agents/data-analyst.md
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. Execute ALL activation steps exactly as written in the agent file
4. Follow the agent's persona and menu system precisely
5. Stay in character throughout the session
</agent-activation>
`;
      fs.writeFileSync(dataAnalystCommandPath, agentCommandContent);
      logger.log('Created: .claude/commands/bmad/dae/agents/data-analyst.md');
    }

    // Create Claude Code commands for workflows
    const workflowCommandsPath = path.join(
      projectRoot,
      '.claude/commands/bmad/dae/workflows',
    );
    if (!fs.existsSync(workflowCommandsPath)) {
      logger.log('Creating Claude Code workflow commands...');
      fs.mkdirSync(workflowCommandsPath, { recursive: true });
    }

    // Create data-analysis workflow command
    const dataAnalysisCommandPath = path.join(
      workflowCommandsPath,
      'data-analysis.md',
    );
    if (!fs.existsSync(dataAnalysisCommandPath)) {
      const workflowCommandContent = `---
name: 'data-analysis'
description: 'Amplitude 데이터 조회 및 분석을 통해 사용자 질문에 데이터 기반 답변 제공'
---

<workflow-activation>
1. LOAD the workflow file from @_bmad/dae/workflows/data-analysis/workflow.md
2. READ its entire contents
3. Execute the INITIALIZATION SEQUENCE as written
4. Follow all workflow rules and step sequences precisely
</workflow-activation>
`;
      fs.writeFileSync(dataAnalysisCommandPath, workflowCommandContent);
      logger.log(
        'Created: .claude/commands/bmad/dae/workflows/data-analysis.md',
      );
    }

    logger.log('✓ DAE module installation complete');
    return true;
  } catch (error) {
    logger.error(`Error installing DAE module: ${error.message}`);
    return false;
  }
}

module.exports = { install };
