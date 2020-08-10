import {
    Rule,
    SchematicContext,
    Tree, 
    SchematicsException
    } from '@angular-devkit/schematics';
    
import { getProjectTargetOptions} from '../utils/project';
import { getWorkspace, updateWorkspace} from '@schematics/angular/utility/workspace';
import { workspaces, JsonArray } from '@angular-devkit/core';

import * as info from '../messages';

const LIB_CSS_FILEPATH = 'node_modules/my-lib/assets/lib-style.css';

export function addLibStyles(options: any): Rule {
    return async(tree: Tree, _context: SchematicContext) => {
      const workspace = await getWorkspace(tree);
      const projectName = options.project || workspace.extensions.defaultProject !.toString();
      const project = workspace.projects.get(projectName);
      if (!project) {
        throw new SchematicsException(info.noProject('my-lib'));
      }
  
      _context.logger.info("Importing Library global style path in Angular.json");
      // modify 'angular.json'
      return addLibStyleToAngularJson(workspace, project, tree);
      
    };
  }
  
  /**
   * Modify 'angular.json' to add 'lib-style.css' styles
   */
  function addLibStyleToAngularJson(workspace: workspaces.WorkspaceDefinition, project: workspaces.ProjectDefinition, tree: Tree): Rule {
  const targetOptions = getProjectTargetOptions(project, 'build');
  const styles = (targetOptions.styles as JsonArray | undefined);
  if (!styles) {
    targetOptions.styles = [LIB_CSS_FILEPATH];
  } else {

    const existingStyles = styles.map((s) => typeof s === 'string' ? s : '');
  
    for (const[, stylePath] of existingStyles.entries()) {
      // If the given asset is already specified in the styles, we don't need to do anything.
      if (stylePath === LIB_CSS_FILEPATH) {
        return () => tree;
      }
    }
    styles.unshift(LIB_CSS_FILEPATH);
  }
  
  return updateWorkspace(workspace);
  }
  