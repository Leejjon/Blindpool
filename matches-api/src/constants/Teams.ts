const eredivisieTeams: {[key: number]: string} = {
    666: 'FC Twente',
    668: 'VVV Venlo',
    671: 'Heracles Almelo',
    672: 'Willem II',
    673: 'SC Heerenveen',
    674: 'PSV',
    675: 'Feyenoord',
    676: 'FC Utrecht',
    677: 'FC Groningen',
    678: 'Ajax',
    679: 'Vitesse',
    680: 'ADO Den Haag',
    682: 'AZ',
    683: 'RKC Waalwijk',
    684: 'PEC Zwolle',
    1914: 'FC Emmen',
    1920: 'Fortuna Sittard',
    6806: 'Sparta Rotterdam'
}

export const getTeamName = (key: number): string => {
    const teamName = eredivisieTeams[key];
    return teamName ? teamName : 'Unknown team';
};