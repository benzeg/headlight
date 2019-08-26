"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Sequencer_1 = require("./Sequencer");
var child_process_1 = require("child_process");
var path_1 = require("path");
;
var Historian = /** @class */ (function () {
    function Historian(queue) {
        this.history = {};
        this.busy = false;
        this.worker = [];
        this.numCPUs = require('os').cpus().length;
        this.dispatcher = new Sequencer_1.Sequencer(this.numCPUs);
        this.timeout = null;
        this.queue = queue || [];
    }
    Historian.prototype.addToQueue = function (l) {
        this.queue.push(l);
        if (!this.busy) {
            this.dequeue();
        }
    };
    Historian.prototype.dequeue = function () {
        var _this = this;
        this.busy = true;
        var i = 0;
        var _loop_1 = function () {
            var pid = this_1.dispatcher.step();
            if (!this_1.worker[pid]) {
                this_1.worker[pid] = child_process_1.fork(path_1.join(__dirname, './headlightProcess.ts'), ['-r', 'ts-node/register'], { env: { PORT_NUM: 3000 + pid } });
            }
            var link = this_1.queue.pop();
            this_1.worker[pid].send(link);
            this_1.worker[pid].on('message', function (audit) { return __awaiter(_this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, audit];
                        case 1:
                            res = _a.sent();
                            this.history[link.url] = res;
                            return [2 /*return*/];
                    }
                });
            }); });
            i++;
        };
        var this_1 = this;
        while (i < this.numCPUs && this.queue.length) {
            _loop_1();
        }
        if (this.queue.length > 0 && !this.timeout) {
            this.timeout = setTimeout(this.dequeue, 2000);
        }
        else if (this.queue.length === 0) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.busy = false;
        }
    };
    Historian.prototype.getReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.values(this.history))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.history];
                }
            });
        });
    };
    return Historian;
}());
exports.Historian = Historian;
