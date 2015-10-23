import {ModuleRegistry} from "./ModulesRegistry";
import {MicroFrameworkSettings} from "./MicroFrameworkSettings";
import {ConfigLoader} from "./ConfigLoader";
import {Container} from "typedi/Container";
import {Configurator} from "t-configurator/Configurator";
import {Module} from "./Module";
import {defaultConfigurator} from "t-configurator/Configurator";
import {MicroFrameworkConfig} from "./MicroFrameworkConfig";

/**
 * This class runs microframework and its specified modules.
 */
export class MicroFrameworkBootstrapper {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private modulesRegistry: ModuleRegistry;
    private configuration: MicroFrameworkConfig;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private settings: MicroFrameworkSettings) {
        new ConfigLoader(settings).load();
        this.configuration = defaultConfigurator.get('framework');
        this.modulesRegistry = new ModuleRegistry(settings, this.configuration, defaultConfigurator);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Gets the Container of the typedi module.
     */
    get container(): Container {
        return Container;
    }

    /**
     * Gets the configurator used to config framework and its modules.
     */
    get configurator(): Configurator {
        return defaultConfigurator; // todo: find the way to remove global dependency
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Registers all given modules in the framework.
     */
    registerModules(modules: Module[]): MicroFrameworkBootstrapper {
        this.modulesRegistry.registerModules(modules);
        return this;
    }

    /**
     * Registers a new module in the framework.
     */
    registerModule(module: Module): MicroFrameworkBootstrapper {
        this.modulesRegistry.registerModule(module);
        return this;
    }

    /**
     * Bootstraps the framework and all its modules.
     */
    bootstrap(): Promise<MicroFrameworkBootstrapper> {
        return this.modulesRegistry.bootstrapAllModules().then(() => this);
    }

    /**
     * Shutdowns the framework and all its modules.
     */
    shutdown(): Promise<void> {
        return this.modulesRegistry.shutdownAllModules();
    }

}