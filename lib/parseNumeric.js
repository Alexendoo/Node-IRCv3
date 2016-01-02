'use strict'
/**
* Common numerics and their string equivalent
* {@link https://tools.ietf.org/html/rfc2812#section-5}
* plus 276, 671
* @type {Object}
*/
const numerics = {
  '001': 'WELCOME',
  '002': 'YOURHOST',
  '003': 'CREATED',
  '004': 'MYINFO',
  '005': 'BOUNCE',
  '200': 'TRACELINK',
  '201': 'TRACECONNECTING',
  '202': 'TRACEHANDSHAKE',
  '203': 'TRACEUNKNOWN',
  '204': 'TRACEOPERATOR',
  '205': 'TRACEUSER',
  '206': 'TRACESERVER',
  '207': 'TRACESERVICE',
  '208': 'TRACENEWTYPE',
  '209': 'TRACECLASS',
  '210': 'TRACERECONNECT',
  '211': 'STATSLINKINFO',
  '212': 'STATSCOMMANDS',
  '219': 'ENDOFSTATS',
  '221': 'UMODEIS',
  '234': 'SERVLIST',
  '235': 'SERVLISTEND',
  '242': 'STATSUPTIME',
  '243': 'STATSOLINE',
  '251': 'LUSERCLIENT',
  '252': 'LUSEROP',
  '253': 'LUSERUNKNOWN',
  '254': 'LUSERCHANNELS',
  '255': 'LUSERME',
  '256': 'ADMINME',
  '257': 'ADMINLOC1',
  '258': 'ADMINLOC2',
  '259': 'ADMINEMAIL',
  '261': 'TRACELOG',
  '262': 'TRACEEND',
  '263': 'TRYAGAIN',
  '276': 'WHOISFINGERPRINT',
  '301': 'AWAY',
  '302': 'USERHOST',
  '303': 'ISON',
  '305': 'UNAWAY',
  '306': 'NOWAWAY',
  '311': 'WHOISUSER',
  '312': 'WHOISSERVER',
  '313': 'WHOISOPERATOR',
  '314': 'WHOWASUSER',
  '315': 'ENDOFWHO',
  '317': 'WHOISIDLE',
  '318': 'ENDOFWHOIS',
  '319': 'WHOISCHANNELS',
  '321': 'LISTSTART',
  '322': 'LIST',
  '323': 'LISTEND',
  '324': 'CHANNELMODEIS',
  '325': 'UNIQOPIS',
  '331': 'NOTOPIC',
  '332': 'TOPIC',
  '341': 'INVITING',
  '342': 'SUMMONING',
  '346': 'INVITELIST',
  '347': 'ENDOFINVITELIST',
  '348': 'EXCEPTLIST',
  '349': 'ENDOFEXCEPTLIST',
  '351': 'VERSION',
  '352': 'WHOREPLY',
  '353': 'NAMREPLY',
  '364': 'LINKS',
  '365': 'ENDOFLINKS',
  '366': 'ENDOFNAMES',
  '367': 'BANLIST',
  '368': 'ENDOFBANLIST',
  '369': 'ENDOFWHOWAS',
  '371': 'INFO',
  '372': 'MOTD',
  '374': 'ENDOFINFO',
  '375': 'MOTDSTART',
  '376': 'ENDOFMOTD',
  '381': 'YOUREOPER',
  '382': 'REHASHING',
  '383': 'YOURESERVICE',
  '391': 'TIME',
  '392': 'USERSSTART',
  '393': 'USERS',
  '394': 'ENDOFUSERS',
  '395': 'NOUSERS',
  '401': 'NOSUCHNICK',
  '402': 'NOSUCHSERVER',
  '403': 'NOSUCHCHANNEL',
  '404': 'CANNOTSENDTOCHAN',
  '405': 'TOOMANYCHANNELS',
  '406': 'WASNOSUCHNICK',
  '407': 'TOOMANYTARGETS',
  '408': 'NOSUCHSERVICE',
  '409': 'NOORIGIN',
  '411': 'NORECIPIENT',
  '412': 'NOTEXTTOSEND',
  '413': 'NOTOPLEVEL',
  '414': 'WILDTOPLEVEL',
  '415': 'BADMASK',
  '421': 'UNKNOWNCOMMAND',
  '422': 'NOMOTD',
  '423': 'NOADMININFO',
  '424': 'FILEERROR',
  '431': 'NONICKNAMEGIVEN',
  '432': 'ERRONEUSNICKNAME',
  '433': 'NICKNAMEINUSE',
  '436': 'NICKCOLLISION',
  '437': 'UNAVAILRESOURCE',
  '441': 'USERNOTINCHANNEL',
  '442': 'NOTONCHANNEL',
  '443': 'USERONCHANNEL',
  '444': 'NOLOGIN',
  '445': 'SUMMONDISABLED',
  '446': 'USERSDISABLED',
  '451': 'NOTREGISTERED',
  '461': 'NEEDMOREPARAMS',
  '462': 'ALREADYREGISTRED',
  '463': 'NOPERMFORHOST',
  '464': 'PASSWDMISMATCH',
  '465': 'YOUREBANNEDCREEP',
  '466': 'YOUWILLBEBANNED',
  '467': 'KEYSET',
  '471': 'CHANNELISFULL',
  '472': 'UNKNOWNMODE',
  '473': 'INVITEONLYCHAN',
  '474': 'BANNEDFROMCHAN',
  '475': 'BADCHANNELKEY',
  '476': 'BADCHANMASK',
  '477': 'NOCHANMODES',
  '478': 'BANLISTFULL',
  '481': 'NOPRIVILEGES',
  '482': 'CHANOPRIVSNEEDED',
  '483': 'CANTKILLSERVER',
  '484': 'RESTRICTED',
  '485': 'UNIQOPPRIVSNEEDED',
  '491': 'NOOPERHOST',
  '501': 'UMODEUNKNOWNFLAG',
  '502': 'USERSDONTMATCH',
  '671': 'WHOISSECURE'
}

/**
 * Translates IRC numeric replies to strings
 * @param  {String} numeric - IRC numeric reply
 * @return {?String}           IRC string reply
 */
module.exports = function parseNumeric(numeric) {
  console.log(numeric);
  if (numerics[numeric]) {
    return numerics[numeric]
  } else {
    return null
  }
}