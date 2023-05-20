"use strict";
exports.__esModule = true;
exports.getCompetitionKey = exports.getCompetitionsList = exports.competitions = exports.CompetitionEnum = void 0;
var CompetitionEnum;
(function (CompetitionEnum) {
    CompetitionEnum["EREDIVISIE"] = "Eredivisie";
    CompetitionEnum["PREMIER_LEAGUE"] = "Premier League";
    CompetitionEnum["LA_LIGA"] = "La Liga";
})(CompetitionEnum = exports.CompetitionEnum || (exports.CompetitionEnum = {}));
exports.competitions = {
    // 2000: {name: "World Cup 2022"},
    // 2002: {name: "Bundesliga"},
    2003: { competition: CompetitionEnum.EREDIVISIE },
    2014: { competition: CompetitionEnum.LA_LIGA },
    // 2015: {name: "Ligue 1"},
    // 2019: {name: "Serie A"},
    2021: { competition: CompetitionEnum.PREMIER_LEAGUE }
};
function getCompetitionsList() {
    var competitionKeys = [];
    for (var key in exports.competitions) {
        competitionKeys.push(Number(key));
    }
    return competitionKeys;
}
exports.getCompetitionsList = getCompetitionsList;
function getCompetitionKey(competition) {
    for (var key in exports.competitions) {
        var c = exports.competitions[key];
        if (c.competition === competition) {
            return parseInt(key);
        }
    }
    throw Error("Competition does not exist.");
}
exports.getCompetitionKey = getCompetitionKey;
