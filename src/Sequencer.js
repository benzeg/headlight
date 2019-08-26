"use strict";
exports.__esModule = true;
var Sequencer = /** @class */ (function () {
    function Sequencer(l) {
        this.count = null;
        this.limit = l;
    }
    Sequencer.prototype.step = function () {
        if (this.count === null) {
            this.count = 0;
        }
        else {
            var next = this.count + 1;
            if (next === this.limit) {
                this.count = 0;
            }
            else {
                this.count = next;
            }
        }
        return this.count;
    };
    return Sequencer;
}());
exports.Sequencer = Sequencer;
