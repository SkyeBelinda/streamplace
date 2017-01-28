#!/usr/bin/env node

import program from "commander";
import fs from "mz/fs";
import {resolve} from "path";
import pkg from "../package.json";
import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import terminalComponent from "./terminal/terminalComponent";
import rootReducer from "./reducer";
import getConfig from "./config";
import {commandSync} from "./command/commandActions";
import * as actionNames from "./constants/actionNames";

const configDefault = resolve(process.env.HOME, ".streamplace", "sp-config.yaml");
// const {version} = JSON.parse(pkg);
export default program
  .version(pkg.version)
  .option("--sp-config <file>", "location of sp-config.yaml (default $HOME/.streamplace/sp-config.yaml)", configDefault);

const store = createStore(rootReducer, applyMiddleware(thunk));
terminalComponent(store);

program
  .command(actionNames.COMMAND_SYNC.toLowerCase())
  .description("sync your plugin to a development server")
  .option("--dev-server <url>", "url of your development server")
  .action(function(command, env) {
    const config = getConfig(program);
    store.dispatch(commandSync());
  });

program
  .command(actionNames.COMMAND_SERVE.toLowerCase())
  .description("[in-cluster only] run a development server");

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
