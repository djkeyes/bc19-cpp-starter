import {BCAbstractRobot} from 'battlecode';

import Module from './wasm_lib_GENERATED.js'

// Two slow parts of Emscripten are loading the binary data and instantiating
// WebAssembly module. We can do these two steps ahead of time, since they are
// fast enough to run during initialization.
import {wasmLoader} from './wasm_loader_GENERATED.js';

let ModuleWithCallbacks = {};
let wasmBinary = wasmLoader();
ModuleWithCallbacks["instantiateWasm"] = function (info, receiveInstanceCallback) {
    let module = new WebAssembly.Module(wasmBinary);
    let instance = new WebAssembly.Instance(module, info)
    receiveInstanceCallback(instance, module);
    return instance.exports;
};

let nativeRobot = null;

class MyRobot extends BCAbstractRobot {
    turn() {
        if (!nativeRobot) {
            // This loading time can take a while if your code is large.
            // Lazily run it here, to avoid timeouts in global scope.
            let bindingLoader = Module(ModuleWithCallbacks);
            let bindings = null;
            bindingLoader.then(function (Module) {
                bindings = Module;
            });

            // Initialize the robot
            nativeRobot = bindings.AbstractNativeRobot.createNativeRobotImpl(this);
        }

        return nativeRobot.turn();
    }

}

var robot = new MyRobot();
