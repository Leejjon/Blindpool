"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateBlindpoolRequest = void 0;
var class_validator_1 = require("class-validator");
var CreateBlindpoolRequest = /** @class */ (function () {
    function CreateBlindpoolRequest(participants, selectedMatch, freeFormatMatch) {
        this.participants = participants;
        this.selectedMatchID = selectedMatch;
        this.freeFormatMatch = freeFormatMatch;
    }
    __decorate([
        (0, class_validator_1.IsString)({ each: true }),
        (0, class_validator_1.Matches)(/^([a-zA-Z0-9 _]{1,20})$/, { each: true })
    ], CreateBlindpoolRequest.prototype, "participants");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateBlindpoolRequest.prototype, "selectedMatchID");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Matches)(/^([-a-zA-Z0-9 ]{5,50})$/)
    ], CreateBlindpoolRequest.prototype, "freeFormatMatch");
    return CreateBlindpoolRequest;
}());
exports.CreateBlindpoolRequest = CreateBlindpoolRequest;
