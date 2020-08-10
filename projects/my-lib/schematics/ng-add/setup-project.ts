import {
    chain,
    Rule,
    SchematicContext,
    Tree
    } from '@angular-devkit/schematics';
    
import {
    addModuleImportToRootModule,
    getProjectFromWorkspace,
    getProjectMainFile,
    hasNgModuleImport
    } from '@angular/cdk/schematics';

import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import { addLibStyles } from './add-lib-style';

  export default function(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      return chain([
        importModuleIntoRootModule(options), addLibStyles(options)
      ])(tree, _context);
    };
  }
  
  function importModuleIntoRootModule(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const MODULE_NAME = 'MyLibModule';
        const workspace = getWorkspace(tree);
        const project = getProjectFromWorkspace(workspace, options.project);
        const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    
        // verify module has not already been imported
        if (hasNgModuleImport(tree, appModulePath, MODULE_NAME)) {
          return console.warn(`Could not import "${MODULE_NAME}" because "${MODULE_NAME}" is already imported.`);
        }
    
        // add NgModule to root NgModule imports
        addModuleImportToRootModule(tree, MODULE_NAME, 'my-lib', project);
    
        _context.logger.info('✅️ Import Module into root module');
      return tree;
    };
}


