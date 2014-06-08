/**
 * ponymark - Next-generation PageDown fork
 * @version v0.1.3
 * @link https://github.com/bevacqua/ponymark
 * @license 
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ponymark=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/*! http://mths.be/he v0.4.1 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// http://whatwg.org/html/tokenization.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// http://whatwg.org/html/tokenization.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = {'\xC1':'Aacute','\xE1':'aacute','\u0102':'Abreve','\u0103':'abreve','\u223E':'ac','\u223F':'acd','\u223E\u0333':'acE','\xC2':'Acirc','\xE2':'acirc','\xB4':'acute','\u0410':'Acy','\u0430':'acy','\xC6':'AElig','\xE6':'aelig','\u2061':'af','\uD835\uDD04':'Afr','\uD835\uDD1E':'afr','\xC0':'Agrave','\xE0':'agrave','\u2135':'aleph','\u0391':'Alpha','\u03B1':'alpha','\u0100':'Amacr','\u0101':'amacr','\u2A3F':'amalg','&':'amp','\u2A55':'andand','\u2A53':'And','\u2227':'and','\u2A5C':'andd','\u2A58':'andslope','\u2A5A':'andv','\u2220':'ang','\u29A4':'ange','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u2221':'angmsd','\u221F':'angrt','\u22BE':'angrtvb','\u299D':'angrtvbd','\u2222':'angsph','\xC5':'angst','\u237C':'angzarr','\u0104':'Aogon','\u0105':'aogon','\uD835\uDD38':'Aopf','\uD835\uDD52':'aopf','\u2A6F':'apacir','\u2248':'ap','\u2A70':'apE','\u224A':'ape','\u224B':'apid','\'':'apos','\xE5':'aring','\uD835\uDC9C':'Ascr','\uD835\uDCB6':'ascr','\u2254':'colone','*':'ast','\u224D':'CupCap','\xC3':'Atilde','\xE3':'atilde','\xC4':'Auml','\xE4':'auml','\u2233':'awconint','\u2A11':'awint','\u224C':'bcong','\u03F6':'bepsi','\u2035':'bprime','\u223D':'bsim','\u22CD':'bsime','\u2216':'setmn','\u2AE7':'Barv','\u22BD':'barvee','\u2305':'barwed','\u2306':'Barwed','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u0411':'Bcy','\u0431':'bcy','\u201E':'bdquo','\u2235':'becaus','\u29B0':'bemptyv','\u212C':'Bscr','\u0392':'Beta','\u03B2':'beta','\u2136':'beth','\u226C':'twixt','\uD835\uDD05':'Bfr','\uD835\uDD1F':'bfr','\u22C2':'xcap','\u25EF':'xcirc','\u22C3':'xcup','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A06':'xsqcup','\u2605':'starf','\u25BD':'xdtri','\u25B3':'xutri','\u2A04':'xuplus','\u22C1':'Vee','\u22C0':'Wedge','\u290D':'rbarr','\u29EB':'lozf','\u25AA':'squf','\u25B4':'utrif','\u25BE':'dtrif','\u25C2':'ltrif','\u25B8':'rtrif','\u2423':'blank','\u2592':'blk12','\u2591':'blk14','\u2593':'blk34','\u2588':'block','=\u20E5':'bne','\u2261\u20E5':'bnequiv','\u2AED':'bNot','\u2310':'bnot','\uD835\uDD39':'Bopf','\uD835\uDD53':'bopf','\u22A5':'bot','\u22C8':'bowtie','\u29C9':'boxbox','\u2510':'boxdl','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u250C':'boxdr','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2500':'boxh','\u2550':'boxH','\u252C':'boxhd','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2534':'boxhu','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u229F':'minusb','\u229E':'plusb','\u22A0':'timesb','\u2518':'boxul','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u2514':'boxur','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u2502':'boxv','\u2551':'boxV','\u253C':'boxvh','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2524':'boxvl','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u251C':'boxvr','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u02D8':'breve','\xA6':'brvbar','\uD835\uDCB7':'bscr','\u204F':'bsemi','\u29C5':'bsolb','\\':'bsol','\u27C8':'bsolhsub','\u2022':'bull','\u224E':'bump','\u2AAE':'bumpE','\u224F':'bumpe','\u0106':'Cacute','\u0107':'cacute','\u2A44':'capand','\u2A49':'capbrcup','\u2A4B':'capcap','\u2229':'cap','\u22D2':'Cap','\u2A47':'capcup','\u2A40':'capdot','\u2145':'DD','\u2229\uFE00':'caps','\u2041':'caret','\u02C7':'caron','\u212D':'Cfr','\u2A4D':'ccaps','\u010C':'Ccaron','\u010D':'ccaron','\xC7':'Ccedil','\xE7':'ccedil','\u0108':'Ccirc','\u0109':'ccirc','\u2230':'Cconint','\u2A4C':'ccups','\u2A50':'ccupssm','\u010A':'Cdot','\u010B':'cdot','\xB8':'cedil','\u29B2':'cemptyv','\xA2':'cent','\xB7':'middot','\uD835\uDD20':'cfr','\u0427':'CHcy','\u0447':'chcy','\u2713':'check','\u03A7':'Chi','\u03C7':'chi','\u02C6':'circ','\u2257':'cire','\u21BA':'olarr','\u21BB':'orarr','\u229B':'oast','\u229A':'ocir','\u229D':'odash','\u2299':'odot','\xAE':'reg','\u24C8':'oS','\u2296':'ominus','\u2295':'oplus','\u2297':'otimes','\u25CB':'cir','\u29C3':'cirE','\u2A10':'cirfnint','\u2AEF':'cirmid','\u29C2':'cirscir','\u2232':'cwconint','\u201D':'rdquo','\u2019':'rsquo','\u2663':'clubs',':':'colon','\u2237':'Colon','\u2A74':'Colone',',':'comma','@':'commat','\u2201':'comp','\u2218':'compfn','\u2102':'Copf','\u2245':'cong','\u2A6D':'congdot','\u2261':'equiv','\u222E':'oint','\u222F':'Conint','\uD835\uDD54':'copf','\u2210':'coprod','\xA9':'copy','\u2117':'copysr','\u21B5':'crarr','\u2717':'cross','\u2A2F':'Cross','\uD835\uDC9E':'Cscr','\uD835\uDCB8':'cscr','\u2ACF':'csub','\u2AD1':'csube','\u2AD0':'csup','\u2AD2':'csupe','\u22EF':'ctdot','\u2938':'cudarrl','\u2935':'cudarrr','\u22DE':'cuepr','\u22DF':'cuesc','\u21B6':'cularr','\u293D':'cularrp','\u2A48':'cupbrcap','\u2A46':'cupcap','\u222A':'cup','\u22D3':'Cup','\u2A4A':'cupcup','\u228D':'cupdot','\u2A45':'cupor','\u222A\uFE00':'cups','\u21B7':'curarr','\u293C':'curarrm','\u22CE':'cuvee','\u22CF':'cuwed','\xA4':'curren','\u2231':'cwint','\u232D':'cylcty','\u2020':'dagger','\u2021':'Dagger','\u2138':'daleth','\u2193':'darr','\u21A1':'Darr','\u21D3':'dArr','\u2010':'dash','\u2AE4':'Dashv','\u22A3':'dashv','\u290F':'rBarr','\u02DD':'dblac','\u010E':'Dcaron','\u010F':'dcaron','\u0414':'Dcy','\u0434':'dcy','\u21CA':'ddarr','\u2146':'dd','\u2911':'DDotrahd','\u2A77':'eDDot','\xB0':'deg','\u2207':'Del','\u0394':'Delta','\u03B4':'delta','\u29B1':'demptyv','\u297F':'dfisht','\uD835\uDD07':'Dfr','\uD835\uDD21':'dfr','\u2965':'dHar','\u21C3':'dharl','\u21C2':'dharr','\u02D9':'dot','`':'grave','\u02DC':'tilde','\u22C4':'diam','\u2666':'diams','\xA8':'die','\u03DD':'gammad','\u22F2':'disin','\xF7':'div','\u22C7':'divonx','\u0402':'DJcy','\u0452':'djcy','\u231E':'dlcorn','\u230D':'dlcrop','$':'dollar','\uD835\uDD3B':'Dopf','\uD835\uDD55':'dopf','\u20DC':'DotDot','\u2250':'doteq','\u2251':'eDot','\u2238':'minusd','\u2214':'plusdo','\u22A1':'sdotb','\u21D0':'lArr','\u21D4':'iff','\u27F8':'xlArr','\u27FA':'xhArr','\u27F9':'xrArr','\u21D2':'rArr','\u22A8':'vDash','\u21D1':'uArr','\u21D5':'vArr','\u2225':'par','\u2913':'DownArrowBar','\u21F5':'duarr','\u0311':'DownBreve','\u2950':'DownLeftRightVector','\u295E':'DownLeftTeeVector','\u2956':'DownLeftVectorBar','\u21BD':'lhard','\u295F':'DownRightTeeVector','\u2957':'DownRightVectorBar','\u21C1':'rhard','\u21A7':'mapstodown','\u22A4':'top','\u2910':'RBarr','\u231F':'drcorn','\u230C':'drcrop','\uD835\uDC9F':'Dscr','\uD835\uDCB9':'dscr','\u0405':'DScy','\u0455':'dscy','\u29F6':'dsol','\u0110':'Dstrok','\u0111':'dstrok','\u22F1':'dtdot','\u25BF':'dtri','\u296F':'duhar','\u29A6':'dwangle','\u040F':'DZcy','\u045F':'dzcy','\u27FF':'dzigrarr','\xC9':'Eacute','\xE9':'eacute','\u2A6E':'easter','\u011A':'Ecaron','\u011B':'ecaron','\xCA':'Ecirc','\xEA':'ecirc','\u2256':'ecir','\u2255':'ecolon','\u042D':'Ecy','\u044D':'ecy','\u0116':'Edot','\u0117':'edot','\u2147':'ee','\u2252':'efDot','\uD835\uDD08':'Efr','\uD835\uDD22':'efr','\u2A9A':'eg','\xC8':'Egrave','\xE8':'egrave','\u2A96':'egs','\u2A98':'egsdot','\u2A99':'el','\u2208':'in','\u23E7':'elinters','\u2113':'ell','\u2A95':'els','\u2A97':'elsdot','\u0112':'Emacr','\u0113':'emacr','\u2205':'empty','\u25FB':'EmptySmallSquare','\u25AB':'EmptyVerySmallSquare','\u2004':'emsp13','\u2005':'emsp14','\u2003':'emsp','\u014A':'ENG','\u014B':'eng','\u2002':'ensp','\u0118':'Eogon','\u0119':'eogon','\uD835\uDD3C':'Eopf','\uD835\uDD56':'eopf','\u22D5':'epar','\u29E3':'eparsl','\u2A71':'eplus','\u03B5':'epsi','\u0395':'Epsilon','\u03F5':'epsiv','\u2242':'esim','\u2A75':'Equal','=':'equals','\u225F':'equest','\u21CC':'rlhar','\u2A78':'equivDD','\u29E5':'eqvparsl','\u2971':'erarr','\u2253':'erDot','\u212F':'escr','\u2130':'Escr','\u2A73':'Esim','\u0397':'Eta','\u03B7':'eta','\xD0':'ETH','\xF0':'eth','\xCB':'Euml','\xEB':'euml','\u20AC':'euro','!':'excl','\u2203':'exist','\u0424':'Fcy','\u0444':'fcy','\u2640':'female','\uFB03':'ffilig','\uFB00':'fflig','\uFB04':'ffllig','\uD835\uDD09':'Ffr','\uD835\uDD23':'ffr','\uFB01':'filig','\u25FC':'FilledSmallSquare','fj':'fjlig','\u266D':'flat','\uFB02':'fllig','\u25B1':'fltns','\u0192':'fnof','\uD835\uDD3D':'Fopf','\uD835\uDD57':'fopf','\u2200':'forall','\u22D4':'fork','\u2AD9':'forkv','\u2131':'Fscr','\u2A0D':'fpartint','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\u2154':'frac23','\u2156':'frac25','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\u2044':'frasl','\u2322':'frown','\uD835\uDCBB':'fscr','\u01F5':'gacute','\u0393':'Gamma','\u03B3':'gamma','\u03DC':'Gammad','\u2A86':'gap','\u011E':'Gbreve','\u011F':'gbreve','\u0122':'Gcedil','\u011C':'Gcirc','\u011D':'gcirc','\u0413':'Gcy','\u0433':'gcy','\u0120':'Gdot','\u0121':'gdot','\u2265':'ge','\u2267':'gE','\u2A8C':'gEl','\u22DB':'gel','\u2A7E':'ges','\u2AA9':'gescc','\u2A80':'gesdot','\u2A82':'gesdoto','\u2A84':'gesdotol','\u22DB\uFE00':'gesl','\u2A94':'gesles','\uD835\uDD0A':'Gfr','\uD835\uDD24':'gfr','\u226B':'gg','\u22D9':'Gg','\u2137':'gimel','\u0403':'GJcy','\u0453':'gjcy','\u2AA5':'gla','\u2277':'gl','\u2A92':'glE','\u2AA4':'glj','\u2A8A':'gnap','\u2A88':'gne','\u2269':'gnE','\u22E7':'gnsim','\uD835\uDD3E':'Gopf','\uD835\uDD58':'gopf','\u2AA2':'GreaterGreater','\u2273':'gsim','\uD835\uDCA2':'Gscr','\u210A':'gscr','\u2A8E':'gsime','\u2A90':'gsiml','\u2AA7':'gtcc','\u2A7A':'gtcir','>':'gt','\u22D7':'gtdot','\u2995':'gtlPar','\u2A7C':'gtquest','\u2978':'gtrarr','\u2269\uFE00':'gvnE','\u200A':'hairsp','\u210B':'Hscr','\u042A':'HARDcy','\u044A':'hardcy','\u2948':'harrcir','\u2194':'harr','\u21AD':'harrw','^':'Hat','\u210F':'hbar','\u0124':'Hcirc','\u0125':'hcirc','\u2665':'hearts','\u2026':'mldr','\u22B9':'hercon','\uD835\uDD25':'hfr','\u210C':'Hfr','\u2925':'searhk','\u2926':'swarhk','\u21FF':'hoarr','\u223B':'homtht','\u21A9':'larrhk','\u21AA':'rarrhk','\uD835\uDD59':'hopf','\u210D':'Hopf','\u2015':'horbar','\uD835\uDCBD':'hscr','\u0126':'Hstrok','\u0127':'hstrok','\u2043':'hybull','\xCD':'Iacute','\xED':'iacute','\u2063':'ic','\xCE':'Icirc','\xEE':'icirc','\u0418':'Icy','\u0438':'icy','\u0130':'Idot','\u0415':'IEcy','\u0435':'iecy','\xA1':'iexcl','\uD835\uDD26':'ifr','\u2111':'Im','\xCC':'Igrave','\xEC':'igrave','\u2148':'ii','\u2A0C':'qint','\u222D':'tint','\u29DC':'iinfin','\u2129':'iiota','\u0132':'IJlig','\u0133':'ijlig','\u012A':'Imacr','\u012B':'imacr','\u2110':'Iscr','\u0131':'imath','\u22B7':'imof','\u01B5':'imped','\u2105':'incare','\u221E':'infin','\u29DD':'infintie','\u22BA':'intcal','\u222B':'int','\u222C':'Int','\u2124':'Zopf','\u2A17':'intlarhk','\u2A3C':'iprod','\u2062':'it','\u0401':'IOcy','\u0451':'iocy','\u012E':'Iogon','\u012F':'iogon','\uD835\uDD40':'Iopf','\uD835\uDD5A':'iopf','\u0399':'Iota','\u03B9':'iota','\xBF':'iquest','\uD835\uDCBE':'iscr','\u22F5':'isindot','\u22F9':'isinE','\u22F4':'isins','\u22F3':'isinsv','\u0128':'Itilde','\u0129':'itilde','\u0406':'Iukcy','\u0456':'iukcy','\xCF':'Iuml','\xEF':'iuml','\u0134':'Jcirc','\u0135':'jcirc','\u0419':'Jcy','\u0439':'jcy','\uD835\uDD0D':'Jfr','\uD835\uDD27':'jfr','\u0237':'jmath','\uD835\uDD41':'Jopf','\uD835\uDD5B':'jopf','\uD835\uDCA5':'Jscr','\uD835\uDCBF':'jscr','\u0408':'Jsercy','\u0458':'jsercy','\u0404':'Jukcy','\u0454':'jukcy','\u039A':'Kappa','\u03BA':'kappa','\u03F0':'kappav','\u0136':'Kcedil','\u0137':'kcedil','\u041A':'Kcy','\u043A':'kcy','\uD835\uDD0E':'Kfr','\uD835\uDD28':'kfr','\u0138':'kgreen','\u0425':'KHcy','\u0445':'khcy','\u040C':'KJcy','\u045C':'kjcy','\uD835\uDD42':'Kopf','\uD835\uDD5C':'kopf','\uD835\uDCA6':'Kscr','\uD835\uDCC0':'kscr','\u21DA':'lAarr','\u0139':'Lacute','\u013A':'lacute','\u29B4':'laemptyv','\u2112':'Lscr','\u039B':'Lambda','\u03BB':'lambda','\u27E8':'lang','\u27EA':'Lang','\u2991':'langd','\u2A85':'lap','\xAB':'laquo','\u21E4':'larrb','\u291F':'larrbfs','\u2190':'larr','\u219E':'Larr','\u291D':'larrfs','\u21AB':'larrlp','\u2939':'larrpl','\u2973':'larrsim','\u21A2':'larrtl','\u2919':'latail','\u291B':'lAtail','\u2AAB':'lat','\u2AAD':'late','\u2AAD\uFE00':'lates','\u290C':'lbarr','\u290E':'lBarr','\u2772':'lbbrk','{':'lcub','[':'lsqb','\u298B':'lbrke','\u298F':'lbrksld','\u298D':'lbrkslu','\u013D':'Lcaron','\u013E':'lcaron','\u013B':'Lcedil','\u013C':'lcedil','\u2308':'lceil','\u041B':'Lcy','\u043B':'lcy','\u2936':'ldca','\u201C':'ldquo','\u2967':'ldrdhar','\u294B':'ldrushar','\u21B2':'ldsh','\u2264':'le','\u2266':'lE','\u21C6':'lrarr','\u27E6':'lobrk','\u2961':'LeftDownTeeVector','\u2959':'LeftDownVectorBar','\u230A':'lfloor','\u21BC':'lharu','\u21C7':'llarr','\u21CB':'lrhar','\u294E':'LeftRightVector','\u21A4':'mapstoleft','\u295A':'LeftTeeVector','\u22CB':'lthree','\u29CF':'LeftTriangleBar','\u22B2':'vltri','\u22B4':'ltrie','\u2951':'LeftUpDownVector','\u2960':'LeftUpTeeVector','\u2958':'LeftUpVectorBar','\u21BF':'uharl','\u2952':'LeftVectorBar','\u2A8B':'lEg','\u22DA':'leg','\u2A7D':'les','\u2AA8':'lescc','\u2A7F':'lesdot','\u2A81':'lesdoto','\u2A83':'lesdotor','\u22DA\uFE00':'lesg','\u2A93':'lesges','\u22D6':'ltdot','\u2276':'lg','\u2AA1':'LessLess','\u2272':'lsim','\u297C':'lfisht','\uD835\uDD0F':'Lfr','\uD835\uDD29':'lfr','\u2A91':'lgE','\u2962':'lHar','\u296A':'lharul','\u2584':'lhblk','\u0409':'LJcy','\u0459':'ljcy','\u226A':'ll','\u22D8':'Ll','\u296B':'llhard','\u25FA':'lltri','\u013F':'Lmidot','\u0140':'lmidot','\u23B0':'lmoust','\u2A89':'lnap','\u2A87':'lne','\u2268':'lnE','\u22E6':'lnsim','\u27EC':'loang','\u21FD':'loarr','\u27F5':'xlarr','\u27F7':'xharr','\u27FC':'xmap','\u27F6':'xrarr','\u21AC':'rarrlp','\u2985':'lopar','\uD835\uDD43':'Lopf','\uD835\uDD5D':'lopf','\u2A2D':'loplus','\u2A34':'lotimes','\u2217':'lowast','_':'lowbar','\u2199':'swarr','\u2198':'searr','\u25CA':'loz','(':'lpar','\u2993':'lparlt','\u296D':'lrhard','\u200E':'lrm','\u22BF':'lrtri','\u2039':'lsaquo','\uD835\uDCC1':'lscr','\u21B0':'lsh','\u2A8D':'lsime','\u2A8F':'lsimg','\u2018':'lsquo','\u201A':'sbquo','\u0141':'Lstrok','\u0142':'lstrok','\u2AA6':'ltcc','\u2A79':'ltcir','<':'lt','\u22C9':'ltimes','\u2976':'ltlarr','\u2A7B':'ltquest','\u25C3':'ltri','\u2996':'ltrPar','\u294A':'lurdshar','\u2966':'luruhar','\u2268\uFE00':'lvnE','\xAF':'macr','\u2642':'male','\u2720':'malt','\u2905':'Map','\u21A6':'map','\u21A5':'mapstoup','\u25AE':'marker','\u2A29':'mcomma','\u041C':'Mcy','\u043C':'mcy','\u2014':'mdash','\u223A':'mDDot','\u205F':'MediumSpace','\u2133':'Mscr','\uD835\uDD10':'Mfr','\uD835\uDD2A':'mfr','\u2127':'mho','\xB5':'micro','\u2AF0':'midcir','\u2223':'mid','\u2212':'minus','\u2A2A':'minusdu','\u2213':'mp','\u2ADB':'mlcp','\u22A7':'models','\uD835\uDD44':'Mopf','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\u039C':'Mu','\u03BC':'mu','\u22B8':'mumap','\u0143':'Nacute','\u0144':'nacute','\u2220\u20D2':'nang','\u2249':'nap','\u2A70\u0338':'napE','\u224B\u0338':'napid','\u0149':'napos','\u266E':'natur','\u2115':'Nopf','\xA0':'nbsp','\u224E\u0338':'nbump','\u224F\u0338':'nbumpe','\u2A43':'ncap','\u0147':'Ncaron','\u0148':'ncaron','\u0145':'Ncedil','\u0146':'ncedil','\u2247':'ncong','\u2A6D\u0338':'ncongdot','\u2A42':'ncup','\u041D':'Ncy','\u043D':'ncy','\u2013':'ndash','\u2924':'nearhk','\u2197':'nearr','\u21D7':'neArr','\u2260':'ne','\u2250\u0338':'nedot','\u200B':'ZeroWidthSpace','\u2262':'nequiv','\u2928':'toea','\u2242\u0338':'nesim','\n':'NewLine','\u2204':'nexist','\uD835\uDD11':'Nfr','\uD835\uDD2B':'nfr','\u2267\u0338':'ngE','\u2271':'nge','\u2A7E\u0338':'nges','\u22D9\u0338':'nGg','\u2275':'ngsim','\u226B\u20D2':'nGt','\u226F':'ngt','\u226B\u0338':'nGtv','\u21AE':'nharr','\u21CE':'nhArr','\u2AF2':'nhpar','\u220B':'ni','\u22FC':'nis','\u22FA':'nisd','\u040A':'NJcy','\u045A':'njcy','\u219A':'nlarr','\u21CD':'nlArr','\u2025':'nldr','\u2266\u0338':'nlE','\u2270':'nle','\u2A7D\u0338':'nles','\u226E':'nlt','\u22D8\u0338':'nLl','\u2274':'nlsim','\u226A\u20D2':'nLt','\u22EA':'nltri','\u22EC':'nltrie','\u226A\u0338':'nLtv','\u2224':'nmid','\u2060':'NoBreak','\uD835\uDD5F':'nopf','\u2AEC':'Not','\xAC':'not','\u226D':'NotCupCap','\u2226':'npar','\u2209':'notin','\u2279':'ntgl','\u22F5\u0338':'notindot','\u22F9\u0338':'notinE','\u22F7':'notinvb','\u22F6':'notinvc','\u29CF\u0338':'NotLeftTriangleBar','\u2278':'ntlg','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA1\u0338':'NotNestedLessLess','\u220C':'notni','\u22FE':'notnivb','\u22FD':'notnivc','\u2280':'npr','\u2AAF\u0338':'npre','\u22E0':'nprcue','\u29D0\u0338':'NotRightTriangleBar','\u22EB':'nrtri','\u22ED':'nrtrie','\u228F\u0338':'NotSquareSubset','\u22E2':'nsqsube','\u2290\u0338':'NotSquareSuperset','\u22E3':'nsqsupe','\u2282\u20D2':'vnsub','\u2288':'nsube','\u2281':'nsc','\u2AB0\u0338':'nsce','\u22E1':'nsccue','\u227F\u0338':'NotSucceedsTilde','\u2283\u20D2':'vnsup','\u2289':'nsupe','\u2241':'nsim','\u2244':'nsime','\u2AFD\u20E5':'nparsl','\u2202\u0338':'npart','\u2A14':'npolint','\u2933\u0338':'nrarrc','\u219B':'nrarr','\u21CF':'nrArr','\u219D\u0338':'nrarrw','\uD835\uDCA9':'Nscr','\uD835\uDCC3':'nscr','\u2284':'nsub','\u2AC5\u0338':'nsubE','\u2285':'nsup','\u2AC6\u0338':'nsupE','\xD1':'Ntilde','\xF1':'ntilde','\u039D':'Nu','\u03BD':'nu','#':'num','\u2116':'numero','\u2007':'numsp','\u224D\u20D2':'nvap','\u22AC':'nvdash','\u22AD':'nvDash','\u22AE':'nVdash','\u22AF':'nVDash','\u2265\u20D2':'nvge','>\u20D2':'nvgt','\u2904':'nvHarr','\u29DE':'nvinfin','\u2902':'nvlArr','\u2264\u20D2':'nvle','<\u20D2':'nvlt','\u22B4\u20D2':'nvltrie','\u2903':'nvrArr','\u22B5\u20D2':'nvrtrie','\u223C\u20D2':'nvsim','\u2923':'nwarhk','\u2196':'nwarr','\u21D6':'nwArr','\u2927':'nwnear','\xD3':'Oacute','\xF3':'oacute','\xD4':'Ocirc','\xF4':'ocirc','\u041E':'Ocy','\u043E':'ocy','\u0150':'Odblac','\u0151':'odblac','\u2A38':'odiv','\u29BC':'odsold','\u0152':'OElig','\u0153':'oelig','\u29BF':'ofcir','\uD835\uDD12':'Ofr','\uD835\uDD2C':'ofr','\u02DB':'ogon','\xD2':'Ograve','\xF2':'ograve','\u29C1':'ogt','\u29B5':'ohbar','\u03A9':'ohm','\u29BE':'olcir','\u29BB':'olcross','\u203E':'oline','\u29C0':'olt','\u014C':'Omacr','\u014D':'omacr','\u03C9':'omega','\u039F':'Omicron','\u03BF':'omicron','\u29B6':'omid','\uD835\uDD46':'Oopf','\uD835\uDD60':'oopf','\u29B7':'opar','\u29B9':'operp','\u2A54':'Or','\u2228':'or','\u2A5D':'ord','\u2134':'oscr','\xAA':'ordf','\xBA':'ordm','\u22B6':'origof','\u2A56':'oror','\u2A57':'orslope','\u2A5B':'orv','\uD835\uDCAA':'Oscr','\xD8':'Oslash','\xF8':'oslash','\u2298':'osol','\xD5':'Otilde','\xF5':'otilde','\u2A36':'otimesas','\u2A37':'Otimes','\xD6':'Ouml','\xF6':'ouml','\u233D':'ovbar','\u23DE':'OverBrace','\u23B4':'tbrk','\u23DC':'OverParenthesis','\xB6':'para','\u2AF3':'parsim','\u2AFD':'parsl','\u2202':'part','\u041F':'Pcy','\u043F':'pcy','%':'percnt','.':'period','\u2030':'permil','\u2031':'pertenk','\uD835\uDD13':'Pfr','\uD835\uDD2D':'pfr','\u03A6':'Phi','\u03C6':'phi','\u03D5':'phiv','\u260E':'phone','\u03A0':'Pi','\u03C0':'pi','\u03D6':'piv','\u210E':'planckh','\u2A23':'plusacir','\u2A22':'pluscir','+':'plus','\u2A25':'plusdu','\u2A72':'pluse','\xB1':'pm','\u2A26':'plussim','\u2A27':'plustwo','\u2A15':'pointint','\uD835\uDD61':'popf','\u2119':'Popf','\xA3':'pound','\u2AB7':'prap','\u2ABB':'Pr','\u227A':'pr','\u227C':'prcue','\u2AAF':'pre','\u227E':'prsim','\u2AB9':'prnap','\u2AB5':'prnE','\u22E8':'prnsim','\u2AB3':'prE','\u2032':'prime','\u2033':'Prime','\u220F':'prod','\u232E':'profalar','\u2312':'profline','\u2313':'profsurf','\u221D':'prop','\u22B0':'prurel','\uD835\uDCAB':'Pscr','\uD835\uDCC5':'pscr','\u03A8':'Psi','\u03C8':'psi','\u2008':'puncsp','\uD835\uDD14':'Qfr','\uD835\uDD2E':'qfr','\uD835\uDD62':'qopf','\u211A':'Qopf','\u2057':'qprime','\uD835\uDCAC':'Qscr','\uD835\uDCC6':'qscr','\u2A16':'quatint','?':'quest','"':'quot','\u21DB':'rAarr','\u223D\u0331':'race','\u0154':'Racute','\u0155':'racute','\u221A':'Sqrt','\u29B3':'raemptyv','\u27E9':'rang','\u27EB':'Rang','\u2992':'rangd','\u29A5':'range','\xBB':'raquo','\u2975':'rarrap','\u21E5':'rarrb','\u2920':'rarrbfs','\u2933':'rarrc','\u2192':'rarr','\u21A0':'Rarr','\u291E':'rarrfs','\u2945':'rarrpl','\u2974':'rarrsim','\u2916':'Rarrtl','\u21A3':'rarrtl','\u219D':'rarrw','\u291A':'ratail','\u291C':'rAtail','\u2236':'ratio','\u2773':'rbbrk','}':'rcub',']':'rsqb','\u298C':'rbrke','\u298E':'rbrksld','\u2990':'rbrkslu','\u0158':'Rcaron','\u0159':'rcaron','\u0156':'Rcedil','\u0157':'rcedil','\u2309':'rceil','\u0420':'Rcy','\u0440':'rcy','\u2937':'rdca','\u2969':'rdldhar','\u21B3':'rdsh','\u211C':'Re','\u211B':'Rscr','\u211D':'Ropf','\u25AD':'rect','\u297D':'rfisht','\u230B':'rfloor','\uD835\uDD2F':'rfr','\u2964':'rHar','\u21C0':'rharu','\u296C':'rharul','\u03A1':'Rho','\u03C1':'rho','\u03F1':'rhov','\u21C4':'rlarr','\u27E7':'robrk','\u295D':'RightDownTeeVector','\u2955':'RightDownVectorBar','\u21C9':'rrarr','\u22A2':'vdash','\u295B':'RightTeeVector','\u22CC':'rthree','\u29D0':'RightTriangleBar','\u22B3':'vrtri','\u22B5':'rtrie','\u294F':'RightUpDownVector','\u295C':'RightUpTeeVector','\u2954':'RightUpVectorBar','\u21BE':'uharr','\u2953':'RightVectorBar','\u02DA':'ring','\u200F':'rlm','\u23B1':'rmoust','\u2AEE':'rnmid','\u27ED':'roang','\u21FE':'roarr','\u2986':'ropar','\uD835\uDD63':'ropf','\u2A2E':'roplus','\u2A35':'rotimes','\u2970':'RoundImplies',')':'rpar','\u2994':'rpargt','\u2A12':'rppolint','\u203A':'rsaquo','\uD835\uDCC7':'rscr','\u21B1':'rsh','\u22CA':'rtimes','\u25B9':'rtri','\u29CE':'rtriltri','\u29F4':'RuleDelayed','\u2968':'ruluhar','\u211E':'rx','\u015A':'Sacute','\u015B':'sacute','\u2AB8':'scap','\u0160':'Scaron','\u0161':'scaron','\u2ABC':'Sc','\u227B':'sc','\u227D':'sccue','\u2AB0':'sce','\u2AB4':'scE','\u015E':'Scedil','\u015F':'scedil','\u015C':'Scirc','\u015D':'scirc','\u2ABA':'scnap','\u2AB6':'scnE','\u22E9':'scnsim','\u2A13':'scpolint','\u227F':'scsim','\u0421':'Scy','\u0441':'scy','\u22C5':'sdot','\u2A66':'sdote','\u21D8':'seArr','\xA7':'sect',';':'semi','\u2929':'tosa','\u2736':'sext','\uD835\uDD16':'Sfr','\uD835\uDD30':'sfr','\u266F':'sharp','\u0429':'SHCHcy','\u0449':'shchcy','\u0428':'SHcy','\u0448':'shcy','\u2191':'uarr','\xAD':'shy','\u03A3':'Sigma','\u03C3':'sigma','\u03C2':'sigmaf','\u223C':'sim','\u2A6A':'simdot','\u2243':'sime','\u2A9E':'simg','\u2AA0':'simgE','\u2A9D':'siml','\u2A9F':'simlE','\u2246':'simne','\u2A24':'simplus','\u2972':'simrarr','\u2A33':'smashp','\u29E4':'smeparsl','\u2323':'smile','\u2AAA':'smt','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u042C':'SOFTcy','\u044C':'softcy','\u233F':'solbar','\u29C4':'solb','/':'sol','\uD835\uDD4A':'Sopf','\uD835\uDD64':'sopf','\u2660':'spades','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u228F':'sqsub','\u2291':'sqsube','\u2290':'sqsup','\u2292':'sqsupe','\u25A1':'squ','\uD835\uDCAE':'Sscr','\uD835\uDCC8':'sscr','\u22C6':'Star','\u2606':'star','\u2282':'sub','\u22D0':'Sub','\u2ABD':'subdot','\u2AC5':'subE','\u2286':'sube','\u2AC3':'subedot','\u2AC1':'submult','\u2ACB':'subnE','\u228A':'subne','\u2ABF':'subplus','\u2979':'subrarr','\u2AC7':'subsim','\u2AD5':'subsub','\u2AD3':'subsup','\u2211':'sum','\u266A':'sung','\xB9':'sup1','\xB2':'sup2','\xB3':'sup3','\u2283':'sup','\u22D1':'Sup','\u2ABE':'supdot','\u2AD8':'supdsub','\u2AC6':'supE','\u2287':'supe','\u2AC4':'supedot','\u27C9':'suphsol','\u2AD7':'suphsub','\u297B':'suplarr','\u2AC2':'supmult','\u2ACC':'supnE','\u228B':'supne','\u2AC0':'supplus','\u2AC8':'supsim','\u2AD4':'supsub','\u2AD6':'supsup','\u21D9':'swArr','\u292A':'swnwar','\xDF':'szlig','\t':'Tab','\u2316':'target','\u03A4':'Tau','\u03C4':'tau','\u0164':'Tcaron','\u0165':'tcaron','\u0162':'Tcedil','\u0163':'tcedil','\u0422':'Tcy','\u0442':'tcy','\u20DB':'tdot','\u2315':'telrec','\uD835\uDD17':'Tfr','\uD835\uDD31':'tfr','\u2234':'there4','\u0398':'Theta','\u03B8':'theta','\u03D1':'thetav','\u205F\u200A':'ThickSpace','\u2009':'thinsp','\xDE':'THORN','\xFE':'thorn','\u2A31':'timesbar','\xD7':'times','\u2A30':'timesd','\u2336':'topbot','\u2AF1':'topcir','\uD835\uDD4B':'Topf','\uD835\uDD65':'topf','\u2ADA':'topfork','\u2034':'tprime','\u2122':'trade','\u25B5':'utri','\u225C':'trie','\u25EC':'tridot','\u2A3A':'triminus','\u2A39':'triplus','\u29CD':'trisb','\u2A3B':'tritime','\u23E2':'trpezium','\uD835\uDCAF':'Tscr','\uD835\uDCC9':'tscr','\u0426':'TScy','\u0446':'tscy','\u040B':'TSHcy','\u045B':'tshcy','\u0166':'Tstrok','\u0167':'tstrok','\xDA':'Uacute','\xFA':'uacute','\u219F':'Uarr','\u2949':'Uarrocir','\u040E':'Ubrcy','\u045E':'ubrcy','\u016C':'Ubreve','\u016D':'ubreve','\xDB':'Ucirc','\xFB':'ucirc','\u0423':'Ucy','\u0443':'ucy','\u21C5':'udarr','\u0170':'Udblac','\u0171':'udblac','\u296E':'udhar','\u297E':'ufisht','\uD835\uDD18':'Ufr','\uD835\uDD32':'ufr','\xD9':'Ugrave','\xF9':'ugrave','\u2963':'uHar','\u2580':'uhblk','\u231C':'ulcorn','\u230F':'ulcrop','\u25F8':'ultri','\u016A':'Umacr','\u016B':'umacr','\u23DF':'UnderBrace','\u23DD':'UnderParenthesis','\u228E':'uplus','\u0172':'Uogon','\u0173':'uogon','\uD835\uDD4C':'Uopf','\uD835\uDD66':'uopf','\u2912':'UpArrowBar','\u2195':'varr','\u03C5':'upsi','\u03D2':'Upsi','\u03A5':'Upsilon','\u21C8':'uuarr','\u231D':'urcorn','\u230E':'urcrop','\u016E':'Uring','\u016F':'uring','\u25F9':'urtri','\uD835\uDCB0':'Uscr','\uD835\uDCCA':'uscr','\u22F0':'utdot','\u0168':'Utilde','\u0169':'utilde','\xDC':'Uuml','\xFC':'uuml','\u29A7':'uwangle','\u299C':'vangrt','\u228A\uFE00':'vsubne','\u2ACB\uFE00':'vsubnE','\u228B\uFE00':'vsupne','\u2ACC\uFE00':'vsupnE','\u2AE8':'vBar','\u2AEB':'Vbar','\u2AE9':'vBarv','\u0412':'Vcy','\u0432':'vcy','\u22A9':'Vdash','\u22AB':'VDash','\u2AE6':'Vdashl','\u22BB':'veebar','\u225A':'veeeq','\u22EE':'vellip','|':'vert','\u2016':'Vert','\u2758':'VerticalSeparator','\u2240':'wr','\uD835\uDD19':'Vfr','\uD835\uDD33':'vfr','\uD835\uDD4D':'Vopf','\uD835\uDD67':'vopf','\uD835\uDCB1':'Vscr','\uD835\uDCCB':'vscr','\u22AA':'Vvdash','\u299A':'vzigzag','\u0174':'Wcirc','\u0175':'wcirc','\u2A5F':'wedbar','\u2259':'wedgeq','\u2118':'wp','\uD835\uDD1A':'Wfr','\uD835\uDD34':'wfr','\uD835\uDD4E':'Wopf','\uD835\uDD68':'wopf','\uD835\uDCB2':'Wscr','\uD835\uDCCC':'wscr','\uD835\uDD1B':'Xfr','\uD835\uDD35':'xfr','\u039E':'Xi','\u03BE':'xi','\u22FB':'xnis','\uD835\uDD4F':'Xopf','\uD835\uDD69':'xopf','\uD835\uDCB3':'Xscr','\uD835\uDCCD':'xscr','\xDD':'Yacute','\xFD':'yacute','\u042F':'YAcy','\u044F':'yacy','\u0176':'Ycirc','\u0177':'ycirc','\u042B':'Ycy','\u044B':'ycy','\xA5':'yen','\uD835\uDD1C':'Yfr','\uD835\uDD36':'yfr','\u0407':'YIcy','\u0457':'yicy','\uD835\uDD50':'Yopf','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDCCE':'yscr','\u042E':'YUcy','\u044E':'yucy','\xFF':'yuml','\u0178':'Yuml','\u0179':'Zacute','\u017A':'zacute','\u017D':'Zcaron','\u017E':'zcaron','\u0417':'Zcy','\u0437':'zcy','\u017B':'Zdot','\u017C':'zdot','\u2128':'Zfr','\u0396':'Zeta','\u03B6':'zeta','\uD835\uDD37':'zfr','\u0416':'ZHcy','\u0436':'zhcy','\u21DD':'zigrarr','\uD835\uDD6B':'zopf','\uD835\uDCB5':'Zscr','\uD835\uDCCF':'zscr','\u200D':'zwj','\u200C':'zwnj'};

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See http://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|iacute|Uacute|plusmn|otilde|Otilde|Agrave|agrave|yacute|Yacute|oslash|Oslash|Atilde|atilde|brvbar|Ccedil|ccedil|ograve|curren|divide|Eacute|eacute|Ograve|oacute|Egrave|egrave|ugrave|frac12|frac14|frac34|Ugrave|Oacute|Iacute|ntilde|Ntilde|uacute|middot|Igrave|igrave|iquest|aacute|laquo|THORN|micro|iexcl|icirc|Icirc|Acirc|ucirc|ecirc|Ocirc|ocirc|Ecirc|Ucirc|aring|Aring|aelig|AElig|acute|pound|raquo|acirc|times|thorn|szlig|cedil|COPY|Auml|ordf|ordm|uuml|macr|Uuml|auml|Ouml|ouml|para|nbsp|Euml|quot|QUOT|euml|yuml|cent|sect|copy|sup1|sup2|sup3|Iuml|iuml|shy|eth|reg|not|yen|amp|AMP|REG|uml|ETH|deg|gt|GT|LT|lt)([=a-zA-Z0-9])?/g;
	var decodeMap = {'Aacute':'\xC1','aacute':'\xE1','Abreve':'\u0102','abreve':'\u0103','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','Acirc':'\xC2','acirc':'\xE2','acute':'\xB4','Acy':'\u0410','acy':'\u0430','AElig':'\xC6','aelig':'\xE6','af':'\u2061','Afr':'\uD835\uDD04','afr':'\uD835\uDD1E','Agrave':'\xC0','agrave':'\xE0','alefsym':'\u2135','aleph':'\u2135','Alpha':'\u0391','alpha':'\u03B1','Amacr':'\u0100','amacr':'\u0101','amalg':'\u2A3F','amp':'&','AMP':'&','andand':'\u2A55','And':'\u2A53','and':'\u2227','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angmsd':'\u2221','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','Aogon':'\u0104','aogon':'\u0105','Aopf':'\uD835\uDD38','aopf':'\uD835\uDD52','apacir':'\u2A6F','ap':'\u2248','apE':'\u2A70','ape':'\u224A','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','Aring':'\xC5','aring':'\xE5','Ascr':'\uD835\uDC9C','ascr':'\uD835\uDCB6','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','Atilde':'\xC3','atilde':'\xE3','Auml':'\xC4','auml':'\xE4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','Bcy':'\u0411','bcy':'\u0431','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','Beta':'\u0392','beta':'\u03B2','beth':'\u2136','between':'\u226C','Bfr':'\uD835\uDD05','bfr':'\uD835\uDD1F','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bNot':'\u2AED','bnot':'\u2310','Bopf':'\uD835\uDD39','bopf':'\uD835\uDD53','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxHd':'\u2564','boxhD':'\u2565','boxHD':'\u2566','boxhu':'\u2534','boxHu':'\u2567','boxhU':'\u2568','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsolb':'\u29C5','bsol':'\\','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpE':'\u2AAE','bumpe':'\u224F','Bumpeq':'\u224E','bumpeq':'\u224F','Cacute':'\u0106','cacute':'\u0107','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','cap':'\u2229','Cap':'\u22D2','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','Ccaron':'\u010C','ccaron':'\u010D','Ccedil':'\xC7','ccedil':'\xE7','Ccirc':'\u0108','ccirc':'\u0109','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','Cdot':'\u010A','cdot':'\u010B','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','CHcy':'\u0427','chcy':'\u0447','check':'\u2713','checkmark':'\u2713','Chi':'\u03A7','chi':'\u03C7','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cir':'\u25CB','cirE':'\u29C3','cire':'\u2257','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','Colone':'\u2A74','colone':'\u2254','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','Cscr':'\uD835\uDC9E','cscr':'\uD835\uDCB8','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cup':'\u222A','Cup':'\u22D3','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','Darr':'\u21A1','dArr':'\u21D3','dash':'\u2010','Dashv':'\u2AE4','dashv':'\u22A3','dbkarow':'\u290F','dblac':'\u02DD','Dcaron':'\u010E','dcaron':'\u010F','Dcy':'\u0414','dcy':'\u0434','ddagger':'\u2021','ddarr':'\u21CA','DD':'\u2145','dd':'\u2146','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','Delta':'\u0394','delta':'\u03B4','demptyv':'\u29B1','dfisht':'\u297F','Dfr':'\uD835\uDD07','dfr':'\uD835\uDD21','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','DJcy':'\u0402','djcy':'\u0452','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','Dopf':'\uD835\uDD3B','dopf':'\uD835\uDD55','Dot':'\xA8','dot':'\u02D9','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','DownArrowBar':'\u2913','downarrow':'\u2193','DownArrow':'\u2193','Downarrow':'\u21D3','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVectorBar':'\u2956','DownLeftVector':'\u21BD','DownRightTeeVector':'\u295F','DownRightVectorBar':'\u2957','DownRightVector':'\u21C1','DownTeeArrow':'\u21A7','DownTee':'\u22A4','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','Dscr':'\uD835\uDC9F','dscr':'\uD835\uDCB9','DScy':'\u0405','dscy':'\u0455','dsol':'\u29F6','Dstrok':'\u0110','dstrok':'\u0111','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','DZcy':'\u040F','dzcy':'\u045F','dzigrarr':'\u27FF','Eacute':'\xC9','eacute':'\xE9','easter':'\u2A6E','Ecaron':'\u011A','ecaron':'\u011B','Ecirc':'\xCA','ecirc':'\xEA','ecir':'\u2256','ecolon':'\u2255','Ecy':'\u042D','ecy':'\u044D','eDDot':'\u2A77','Edot':'\u0116','edot':'\u0117','eDot':'\u2251','ee':'\u2147','efDot':'\u2252','Efr':'\uD835\uDD08','efr':'\uD835\uDD22','eg':'\u2A9A','Egrave':'\xC8','egrave':'\xE8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','Emacr':'\u0112','emacr':'\u0113','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp13':'\u2004','emsp14':'\u2005','emsp':'\u2003','ENG':'\u014A','eng':'\u014B','ensp':'\u2002','Eogon':'\u0118','eogon':'\u0119','Eopf':'\uD835\uDD3C','eopf':'\uD835\uDD56','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','Epsilon':'\u0395','epsilon':'\u03B5','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','Esim':'\u2A73','esim':'\u2242','Eta':'\u0397','eta':'\u03B7','ETH':'\xD0','eth':'\xF0','Euml':'\xCB','euml':'\xEB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','Fcy':'\u0424','fcy':'\u0444','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','Ffr':'\uD835\uDD09','ffr':'\uD835\uDD23','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','Fopf':'\uD835\uDD3D','fopf':'\uD835\uDD57','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','Gamma':'\u0393','gamma':'\u03B3','Gammad':'\u03DC','gammad':'\u03DD','gap':'\u2A86','Gbreve':'\u011E','gbreve':'\u011F','Gcedil':'\u0122','Gcirc':'\u011C','gcirc':'\u011D','Gcy':'\u0413','gcy':'\u0433','Gdot':'\u0120','gdot':'\u0121','ge':'\u2265','gE':'\u2267','gEl':'\u2A8C','gel':'\u22DB','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','gescc':'\u2AA9','ges':'\u2A7E','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','Gfr':'\uD835\uDD0A','gfr':'\uD835\uDD24','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','GJcy':'\u0403','gjcy':'\u0453','gla':'\u2AA5','gl':'\u2277','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','Gopf':'\uD835\uDD3E','gopf':'\uD835\uDD58','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','Gscr':'\uD835\uDCA2','gscr':'\u210A','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gtcc':'\u2AA7','gtcir':'\u2A7A','gt':'>','GT':'>','Gt':'\u226B','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','HARDcy':'\u042A','hardcy':'\u044A','harrcir':'\u2948','harr':'\u2194','hArr':'\u21D4','harrw':'\u21AD','Hat':'^','hbar':'\u210F','Hcirc':'\u0124','hcirc':'\u0125','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','Hstrok':'\u0126','hstrok':'\u0127','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','Iacute':'\xCD','iacute':'\xED','ic':'\u2063','Icirc':'\xCE','icirc':'\xEE','Icy':'\u0418','icy':'\u0438','Idot':'\u0130','IEcy':'\u0415','iecy':'\u0435','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','Igrave':'\xCC','igrave':'\xEC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','IJlig':'\u0132','ijlig':'\u0133','Imacr':'\u012A','imacr':'\u012B','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','Im':'\u2111','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','incare':'\u2105','in':'\u2208','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','intcal':'\u22BA','int':'\u222B','Int':'\u222C','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','IOcy':'\u0401','iocy':'\u0451','Iogon':'\u012E','iogon':'\u012F','Iopf':'\uD835\uDD40','iopf':'\uD835\uDD5A','Iota':'\u0399','iota':'\u03B9','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','Itilde':'\u0128','itilde':'\u0129','Iukcy':'\u0406','iukcy':'\u0456','Iuml':'\xCF','iuml':'\xEF','Jcirc':'\u0134','jcirc':'\u0135','Jcy':'\u0419','jcy':'\u0439','Jfr':'\uD835\uDD0D','jfr':'\uD835\uDD27','jmath':'\u0237','Jopf':'\uD835\uDD41','jopf':'\uD835\uDD5B','Jscr':'\uD835\uDCA5','jscr':'\uD835\uDCBF','Jsercy':'\u0408','jsercy':'\u0458','Jukcy':'\u0404','jukcy':'\u0454','Kappa':'\u039A','kappa':'\u03BA','kappav':'\u03F0','Kcedil':'\u0136','kcedil':'\u0137','Kcy':'\u041A','kcy':'\u043A','Kfr':'\uD835\uDD0E','kfr':'\uD835\uDD28','kgreen':'\u0138','KHcy':'\u0425','khcy':'\u0445','KJcy':'\u040C','kjcy':'\u045C','Kopf':'\uD835\uDD42','kopf':'\uD835\uDD5C','Kscr':'\uD835\uDCA6','kscr':'\uD835\uDCC0','lAarr':'\u21DA','Lacute':'\u0139','lacute':'\u013A','laemptyv':'\u29B4','lagran':'\u2112','Lambda':'\u039B','lambda':'\u03BB','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larrb':'\u21E4','larrbfs':'\u291F','larr':'\u2190','Larr':'\u219E','lArr':'\u21D0','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','latail':'\u2919','lAtail':'\u291B','lat':'\u2AAB','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','Lcaron':'\u013D','lcaron':'\u013E','Lcedil':'\u013B','lcedil':'\u013C','lceil':'\u2308','lcub':'{','Lcy':'\u041B','lcy':'\u043B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','LeftArrowBar':'\u21E4','leftarrow':'\u2190','LeftArrow':'\u2190','Leftarrow':'\u21D0','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVectorBar':'\u2959','LeftDownVector':'\u21C3','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','LeftRightArrow':'\u2194','Leftrightarrow':'\u21D4','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTeeArrow':'\u21A4','LeftTee':'\u22A3','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangleBar':'\u29CF','LeftTriangle':'\u22B2','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVectorBar':'\u2958','LeftUpVector':'\u21BF','LeftVectorBar':'\u2952','LeftVector':'\u21BC','lEg':'\u2A8B','leg':'\u22DA','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','lescc':'\u2AA8','les':'\u2A7D','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','Lfr':'\uD835\uDD0F','lfr':'\uD835\uDD29','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','LJcy':'\u0409','ljcy':'\u0459','llarr':'\u21C7','ll':'\u226A','Ll':'\u22D8','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','Lmidot':'\u013F','lmidot':'\u0140','lmoustache':'\u23B0','lmoust':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','LongLeftArrow':'\u27F5','Longleftarrow':'\u27F8','longleftrightarrow':'\u27F7','LongLeftRightArrow':'\u27F7','Longleftrightarrow':'\u27FA','longmapsto':'\u27FC','longrightarrow':'\u27F6','LongRightArrow':'\u27F6','Longrightarrow':'\u27F9','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','Lopf':'\uD835\uDD43','lopf':'\uD835\uDD5D','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','Lstrok':'\u0141','lstrok':'\u0142','ltcc':'\u2AA6','ltcir':'\u2A79','lt':'<','LT':'<','Lt':'\u226A','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','Map':'\u2905','map':'\u21A6','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','Mcy':'\u041C','mcy':'\u043C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','Mfr':'\uD835\uDD10','mfr':'\uD835\uDD2A','mho':'\u2127','micro':'\xB5','midast':'*','midcir':'\u2AF0','mid':'\u2223','middot':'\xB7','minusb':'\u229F','minus':'\u2212','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','Mopf':'\uD835\uDD44','mopf':'\uD835\uDD5E','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','Mu':'\u039C','mu':'\u03BC','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','Nacute':'\u0143','nacute':'\u0144','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natural':'\u266E','naturals':'\u2115','natur':'\u266E','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','Ncaron':'\u0147','ncaron':'\u0148','Ncedil':'\u0145','ncedil':'\u0146','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','Ncy':'\u041D','ncy':'\u043D','ndash':'\u2013','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','ne':'\u2260','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','Nfr':'\uD835\uDD11','nfr':'\uD835\uDD2B','ngE':'\u2267\u0338','nge':'\u2271','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','nGt':'\u226B\u20D2','ngt':'\u226F','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','NJcy':'\u040A','njcy':'\u045A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nlE':'\u2266\u0338','nle':'\u2270','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nLt':'\u226A\u20D2','nlt':'\u226E','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','Not':'\u2AEC','not':'\xAC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangle':'\u22EA','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangle':'\u22EB','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','nparallel':'\u2226','npar':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','nprec':'\u2280','npreceq':'\u2AAF\u0338','npre':'\u2AAF\u0338','nrarrc':'\u2933\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','Nscr':'\uD835\uDCA9','nscr':'\uD835\uDCC3','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsubE':'\u2AC5\u0338','nsube':'\u2288','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupE':'\u2AC6\u0338','nsupe':'\u2289','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','Ntilde':'\xD1','ntilde':'\xF1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','Nu':'\u039D','nu':'\u03BD','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','Oacute':'\xD3','oacute':'\xF3','oast':'\u229B','Ocirc':'\xD4','ocirc':'\xF4','ocir':'\u229A','Ocy':'\u041E','ocy':'\u043E','odash':'\u229D','Odblac':'\u0150','odblac':'\u0151','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','OElig':'\u0152','oelig':'\u0153','ofcir':'\u29BF','Ofr':'\uD835\uDD12','ofr':'\uD835\uDD2C','ogon':'\u02DB','Ograve':'\xD2','ograve':'\xF2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','Omacr':'\u014C','omacr':'\u014D','Omega':'\u03A9','omega':'\u03C9','Omicron':'\u039F','omicron':'\u03BF','omid':'\u29B6','ominus':'\u2296','Oopf':'\uD835\uDD46','oopf':'\uD835\uDD60','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','orarr':'\u21BB','Or':'\u2A54','or':'\u2228','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','Oscr':'\uD835\uDCAA','oscr':'\u2134','Oslash':'\xD8','oslash':'\xF8','osol':'\u2298','Otilde':'\xD5','otilde':'\xF5','otimesas':'\u2A36','Otimes':'\u2A37','otimes':'\u2297','Ouml':'\xD6','ouml':'\xF6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','para':'\xB6','parallel':'\u2225','par':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','Pcy':'\u041F','pcy':'\u043F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','Pfr':'\uD835\uDD13','pfr':'\uD835\uDD2D','Phi':'\u03A6','phi':'\u03C6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','Pi':'\u03A0','pi':'\u03C0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plus':'+','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','prap':'\u2AB7','Pr':'\u2ABB','pr':'\u227A','prcue':'\u227C','precapprox':'\u2AB7','prec':'\u227A','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','pre':'\u2AAF','prE':'\u2AB3','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportional':'\u221D','Proportion':'\u2237','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','Pscr':'\uD835\uDCAB','pscr':'\uD835\uDCC5','Psi':'\u03A8','psi':'\u03C8','puncsp':'\u2008','Qfr':'\uD835\uDD14','qfr':'\uD835\uDD2E','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','Qscr':'\uD835\uDCAC','qscr':'\uD835\uDCC6','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','Racute':'\u0154','racute':'\u0155','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarr':'\u2192','Rarr':'\u21A0','rArr':'\u21D2','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','Rarrtl':'\u2916','rarrtl':'\u21A3','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','Rcaron':'\u0158','rcaron':'\u0159','Rcedil':'\u0156','rcedil':'\u0157','rceil':'\u2309','rcub':'}','Rcy':'\u0420','rcy':'\u0440','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','Re':'\u211C','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','Rho':'\u03A1','rho':'\u03C1','rhov':'\u03F1','RightAngleBracket':'\u27E9','RightArrowBar':'\u21E5','rightarrow':'\u2192','RightArrow':'\u2192','Rightarrow':'\u21D2','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVectorBar':'\u2955','RightDownVector':'\u21C2','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTeeArrow':'\u21A6','RightTee':'\u22A2','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangleBar':'\u29D0','RightTriangle':'\u22B3','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVectorBar':'\u2954','RightUpVector':'\u21BE','RightVectorBar':'\u2953','RightVector':'\u21C0','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoustache':'\u23B1','rmoust':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','Sacute':'\u015A','sacute':'\u015B','sbquo':'\u201A','scap':'\u2AB8','Scaron':'\u0160','scaron':'\u0161','Sc':'\u2ABC','sc':'\u227B','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','Scedil':'\u015E','scedil':'\u015F','Scirc':'\u015C','scirc':'\u015D','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','Scy':'\u0421','scy':'\u0441','sdotb':'\u22A1','sdot':'\u22C5','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','Sfr':'\uD835\uDD16','sfr':'\uD835\uDD30','sfrown':'\u2322','sharp':'\u266F','SHCHcy':'\u0429','shchcy':'\u0449','SHcy':'\u0428','shcy':'\u0448','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','Sigma':'\u03A3','sigma':'\u03C3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','SOFTcy':'\u042C','softcy':'\u044C','solbar':'\u233F','solb':'\u29C4','sol':'/','Sopf':'\uD835\uDD4A','sopf':'\uD835\uDD64','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squ':'\u25A1','squf':'\u25AA','srarr':'\u2192','Sscr':'\uD835\uDCAE','sscr':'\uD835\uDCC8','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','Star':'\u22C6','star':'\u2606','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','subE':'\u2AC5','sube':'\u2286','subedot':'\u2AC3','submult':'\u2AC1','subnE':'\u2ACB','subne':'\u228A','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succapprox':'\u2AB8','succ':'\u227B','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','sup':'\u2283','Sup':'\u22D1','supdot':'\u2ABE','supdsub':'\u2AD8','supE':'\u2AC6','supe':'\u2287','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supnE':'\u2ACC','supne':'\u228B','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','Tau':'\u03A4','tau':'\u03C4','tbrk':'\u23B4','Tcaron':'\u0164','tcaron':'\u0165','Tcedil':'\u0162','tcedil':'\u0163','Tcy':'\u0422','tcy':'\u0442','tdot':'\u20DB','telrec':'\u2315','Tfr':'\uD835\uDD17','tfr':'\uD835\uDD31','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','Theta':'\u0398','theta':'\u03B8','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','ThinSpace':'\u2009','thinsp':'\u2009','thkap':'\u2248','thksim':'\u223C','THORN':'\xDE','thorn':'\xFE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','timesbar':'\u2A31','timesb':'\u22A0','times':'\xD7','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','topbot':'\u2336','topcir':'\u2AF1','top':'\u22A4','Topf':'\uD835\uDD4B','topf':'\uD835\uDD65','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','Tscr':'\uD835\uDCAF','tscr':'\uD835\uDCC9','TScy':'\u0426','tscy':'\u0446','TSHcy':'\u040B','tshcy':'\u045B','Tstrok':'\u0166','tstrok':'\u0167','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','Uacute':'\xDA','uacute':'\xFA','uarr':'\u2191','Uarr':'\u219F','uArr':'\u21D1','Uarrocir':'\u2949','Ubrcy':'\u040E','ubrcy':'\u045E','Ubreve':'\u016C','ubreve':'\u016D','Ucirc':'\xDB','ucirc':'\xFB','Ucy':'\u0423','ucy':'\u0443','udarr':'\u21C5','Udblac':'\u0170','udblac':'\u0171','udhar':'\u296E','ufisht':'\u297E','Ufr':'\uD835\uDD18','ufr':'\uD835\uDD32','Ugrave':'\xD9','ugrave':'\xF9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','Umacr':'\u016A','umacr':'\u016B','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','Uogon':'\u0172','uogon':'\u0173','Uopf':'\uD835\uDD4C','uopf':'\uD835\uDD66','UpArrowBar':'\u2912','uparrow':'\u2191','UpArrow':'\u2191','Uparrow':'\u21D1','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','UpDownArrow':'\u2195','Updownarrow':'\u21D5','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','Upsilon':'\u03A5','upsilon':'\u03C5','UpTeeArrow':'\u21A5','UpTee':'\u22A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','Uring':'\u016E','uring':'\u016F','urtri':'\u25F9','Uscr':'\uD835\uDCB0','uscr':'\uD835\uDCCA','utdot':'\u22F0','Utilde':'\u0168','utilde':'\u0169','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','Uuml':'\xDC','uuml':'\xFC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','Vcy':'\u0412','vcy':'\u0432','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','veebar':'\u22BB','vee':'\u2228','Vee':'\u22C1','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','Vfr':'\uD835\uDD19','vfr':'\uD835\uDD33','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','Vopf':'\uD835\uDD4D','vopf':'\uD835\uDD67','vprop':'\u221D','vrtri':'\u22B3','Vscr':'\uD835\uDCB1','vscr':'\uD835\uDCCB','vsubnE':'\u2ACB\uFE00','vsubne':'\u228A\uFE00','vsupnE':'\u2ACC\uFE00','vsupne':'\u228B\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','Wcirc':'\u0174','wcirc':'\u0175','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','Wfr':'\uD835\uDD1A','wfr':'\uD835\uDD34','Wopf':'\uD835\uDD4E','wopf':'\uD835\uDD68','wp':'\u2118','wr':'\u2240','wreath':'\u2240','Wscr':'\uD835\uDCB2','wscr':'\uD835\uDCCC','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','Xfr':'\uD835\uDD1B','xfr':'\uD835\uDD35','xharr':'\u27F7','xhArr':'\u27FA','Xi':'\u039E','xi':'\u03BE','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','Xopf':'\uD835\uDD4F','xopf':'\uD835\uDD69','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','Xscr':'\uD835\uDCB3','xscr':'\uD835\uDCCD','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','Yacute':'\xDD','yacute':'\xFD','YAcy':'\u042F','yacy':'\u044F','Ycirc':'\u0176','ycirc':'\u0177','Ycy':'\u042B','ycy':'\u044B','yen':'\xA5','Yfr':'\uD835\uDD1C','yfr':'\uD835\uDD36','YIcy':'\u0407','yicy':'\u0457','Yopf':'\uD835\uDD50','yopf':'\uD835\uDD6A','Yscr':'\uD835\uDCB4','yscr':'\uD835\uDCCE','YUcy':'\u042E','yucy':'\u044E','yuml':'\xFF','Yuml':'\u0178','Zacute':'\u0179','zacute':'\u017A','Zcaron':'\u017D','zcaron':'\u017E','Zcy':'\u0417','zcy':'\u0437','Zdot':'\u017B','zdot':'\u017C','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','Zeta':'\u0396','zeta':'\u03B6','zfr':'\uD835\uDD37','Zfr':'\u2128','ZHcy':'\u0416','zhcy':'\u0436','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','Zscr':'\uD835\uDCB5','zscr':'\uD835\uDCCF','zwj':'\u200D','zwnj':'\u200C'};
	var decodeMapLegacy = {'Aacute':'\xC1','aacute':'\xE1','Acirc':'\xC2','acirc':'\xE2','acute':'\xB4','AElig':'\xC6','aelig':'\xE6','Agrave':'\xC0','agrave':'\xE0','amp':'&','AMP':'&','Aring':'\xC5','aring':'\xE5','Atilde':'\xC3','atilde':'\xE3','Auml':'\xC4','auml':'\xE4','brvbar':'\xA6','Ccedil':'\xC7','ccedil':'\xE7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','Eacute':'\xC9','eacute':'\xE9','Ecirc':'\xCA','ecirc':'\xEA','Egrave':'\xC8','egrave':'\xE8','ETH':'\xD0','eth':'\xF0','Euml':'\xCB','euml':'\xEB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','Iacute':'\xCD','iacute':'\xED','Icirc':'\xCE','icirc':'\xEE','iexcl':'\xA1','Igrave':'\xCC','igrave':'\xEC','iquest':'\xBF','Iuml':'\xCF','iuml':'\xEF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','Ntilde':'\xD1','ntilde':'\xF1','Oacute':'\xD3','oacute':'\xF3','Ocirc':'\xD4','ocirc':'\xF4','Ograve':'\xD2','ograve':'\xF2','ordf':'\xAA','ordm':'\xBA','Oslash':'\xD8','oslash':'\xF8','Otilde':'\xD5','otilde':'\xF5','Ouml':'\xD6','ouml':'\xF6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','THORN':'\xDE','thorn':'\xFE','times':'\xD7','Uacute':'\xDA','uacute':'\xFA','Ucirc':'\xDB','ucirc':'\xFB','Ugrave':'\xD9','ugrave':'\xF9','uml':'\xA8','Uuml':'\xDC','uuml':'\xFC','Yacute':'\xDD','yacute':'\xFD','yen':'\xA5','yuml':'\xFF'};
	var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
	var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see http://mths.be/punycode.
	var codePointToSymbol = function(codePoint, strict) {
		var output = '';
		if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function(symbol) {
		return '&#x' + symbol.charCodeAt(0).toString(16).toUpperCase() + ';';
	};

	var parseError = function(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function(symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return hexEscape(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;')
					.replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			string = string.replace(regexEscape, function(string) {
				return '&' + encodeMap[string] + ';'; // no need to check `has()` here
			});
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string
				.replace(/&gt;\u20D2/g, '&nvgt;')
				.replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function(string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, hexEscape);
		}
		return string
			// Encode astral symbols.
			.replace(regexAstralSymbols, function($0) {
				// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
				var high = $0.charCodeAt(0);
				var low = $0.charCodeAt(1);
				var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
				return '&#x' + codePoint.toString(16).toUpperCase() + ';';
			})
			// Encode any remaining BMP symbols that are not printable ASCII symbols
			// using a hexadecimal escape.
			.replace(regexBmpWhitelist, hexEscape);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false
	};

	var decode = function(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7) {
			var codePoint;
			var semicolon;
			var hexDigits;
			var reference;
			var next;
			if ($1) {
				// Decode decimal escapes, e.g. `&#119558;`.
				codePoint = $1;
				semicolon = $2;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				return codePointToSymbol(codePoint, strict);
			}
			if ($3) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $3;
				semicolon = $4;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}
			if ($5) {
				// Decode named character references with trailing `;`, e.g. `&copy;`.
				reference = $5;
				if (has(decodeMap, reference)) {
					return decodeMap[reference];
				} else {
					// Ambiguous ampersand; see http://mths.be/notes/ambiguous-ampersands.
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					return $0;
				}
			}
			// If we’re still here, it’s a legacy reference for sure. No need for an
			// extra `if` check.
			// Decode named character references without trailing `;`, e.g. `&amp`
			// This is only a parse error if it gets converted to `&`, or if it is
			// followed by `=` in an attribute context.
			reference = $6;
			next = $7;
			if (next && options.isAttributeValue) {
				if (strict && next == '=') {
					parseError('`&` did not start a character reference');
				}
				return $0;
			} else {
				if (strict) {
					parseError(
						'named character reference was not terminated by a semicolon'
					);
				}
				// Note: there is no need to check `has(decodeMapLegacy, reference)`.
				return decodeMapLegacy[reference] + (next || '');
			}
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function(string) {
		return string.replace(regexEscape, function($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '0.4.1',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return he;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = he;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in he) {
				has(he, key) && (freeExports[key] = he[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.he = he;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
module.exports = function(hljs){
  var IDENT_RE_RU = '[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*';
  var OneS_KEYWORDS = 'возврат дата для если и или иначе иначеесли исключение конецесли ' +
    'конецпопытки конецпроцедуры конецфункции конеццикла константа не перейти перем ' +
    'перечисление по пока попытка прервать продолжить процедура строка тогда фс функция цикл ' +
    'число экспорт';
  var OneS_BUILT_IN = 'ansitooem oemtoansi ввестивидсубконто ввестидату ввестизначение ' +
    'ввестиперечисление ввестипериод ввестиплансчетов ввестистроку ввестичисло вопрос ' +
    'восстановитьзначение врег выбранныйплансчетов вызватьисключение датагод датамесяц ' +
    'датачисло добавитьмесяц завершитьработусистемы заголовоксистемы записьжурналарегистрации ' +
    'запуститьприложение зафиксироватьтранзакцию значениевстроку значениевстрокувнутр ' +
    'значениевфайл значениеизстроки значениеизстрокивнутр значениеизфайла имякомпьютера ' +
    'имяпользователя каталогвременныхфайлов каталогиб каталогпользователя каталогпрограммы ' +
    'кодсимв командасистемы конгода конецпериодаби конецрассчитанногопериодаби ' +
    'конецстандартногоинтервала конквартала конмесяца коннедели лев лог лог10 макс ' +
    'максимальноеколичествосубконто мин монопольныйрежим названиеинтерфейса названиенабораправ ' +
    'назначитьвид назначитьсчет найти найтипомеченныенаудаление найтиссылки началопериодаби ' +
    'началостандартногоинтервала начатьтранзакцию начгода начквартала начмесяца начнедели ' +
    'номерднягода номерднянедели номернеделигода нрег обработкаожидания окр описаниеошибки ' +
    'основнойжурналрасчетов основнойплансчетов основнойязык открытьформу открытьформумодально ' +
    'отменитьтранзакцию очиститьокносообщений периодстр полноеимяпользователя получитьвремята ' +
    'получитьдатута получитьдокументта получитьзначенияотбора получитьпозициюта ' +
    'получитьпустоезначение получитьта прав праводоступа предупреждение префиксавтонумерации ' +
    'пустаястрока пустоезначение рабочаядаттьпустоезначение рабочаядата разделительстраниц ' +
    'разделительстрок разм разобратьпозициюдокумента рассчитатьрегистрына ' +
    'рассчитатьрегистрыпо сигнал симв символтабуляции создатьобъект сокрл сокрлп сокрп ' +
    'сообщить состояние сохранитьзначение сред статусвозврата стрдлина стрзаменить ' +
    'стрколичествострок стрполучитьстроку  стрчисловхождений сформироватьпозициюдокумента ' +
    'счетпокоду текущаядата текущеевремя типзначения типзначениястр удалитьобъекты ' +
    'установитьтана установитьтапо фиксшаблон формат цел шаблон';
  var DQUOTE =  {className: 'dquote',  begin: '""'};
  var STR_START = {
      className: 'string',
      begin: '"', end: '"|$',
      contains: [DQUOTE],
      relevance: 0
    };
  var STR_CONT = {
    className: 'string',
    begin: '\\|', end: '"|$',
    contains: [DQUOTE]
  };

  return {
    case_insensitive: true,
    lexems: IDENT_RE_RU,
    keywords: {keyword: OneS_KEYWORDS, built_in: OneS_BUILT_IN},
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.NUMBER_MODE,
      STR_START, STR_CONT,
      {
        className: 'function',
        begin: '(процедура|функция)', end: '$',
        lexems: IDENT_RE_RU,
        keywords: 'процедура функция',
        contains: [
          {className: 'title', begin: IDENT_RE_RU},
          {
            className: 'tail',
            endsWithParent: true,
            contains: [
              {
                className: 'params',
                begin: '\\(', end: '\\)',
                lexems: IDENT_RE_RU,
                keywords: 'знач',
                contains: [STR_START, STR_CONT]
              },
              {
                className: 'export',
                begin: 'экспорт', endsWithParent: true,
                lexems: IDENT_RE_RU,
                keywords: 'экспорт',
                contains: [hljs.C_LINE_COMMENT_MODE]
              }
            ]
          },
          hljs.C_LINE_COMMENT_MODE
        ]
      },
      {className: 'preprocessor', begin: '#', end: '$'},
      {className: 'date', begin: '\'\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})\''}
    ]
  };
};
},{}],3:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var IDENT_RE = '[a-zA-Z_$][a-zA-Z0-9_$]*';
  var IDENT_FUNC_RETURN_TYPE_RE = '([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)';

  var AS3_REST_ARG_MODE = {
    className: 'rest_arg',
    begin: '[.]{3}', end: IDENT_RE,
    relevance: 10
  };
  var TITLE_MODE = {className: 'title', begin: IDENT_RE};

  return {
    keywords: {
      keyword: 'as break case catch class const continue default delete do dynamic each ' +
        'else extends final finally for function get if implements import in include ' +
        'instanceof interface internal is namespace native new override package private ' +
        'protected public return set static super switch this throw try typeof use var void ' +
        'while with',
      literal: 'true false null undefined'
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'package',
        beginWithKeyword: true, end: '{',
        keywords: 'package',
        contains: [TITLE_MODE]
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements'
          },
          TITLE_MODE
        ]
      },
      {
        className: 'preprocessor',
        beginWithKeyword: true, end: ';',
        keywords: 'import include'
      },
      {
        className: 'function',
        beginWithKeyword: true, end: '[{;]',
        keywords: 'function',
        illegal: '\\S',
        contains: [
          TITLE_MODE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.APOS_STRING_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              AS3_REST_ARG_MODE
            ]
          },
          {
            className: 'type',
            begin: ':',
            end: IDENT_FUNC_RETURN_TYPE_RE,
            relevance: 10
          }
        ]
      }
    ]
  };
};
},{}],4:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var NUMBER = {className: 'number', begin: '[\\$%]\\d+'};
  return {
    case_insensitive: true,
    keywords: {
      keyword: 'acceptfilter acceptmutex acceptpathinfo accessfilename action addalt ' +
        'addaltbyencoding addaltbytype addcharset adddefaultcharset adddescription ' +
        'addencoding addhandler addicon addiconbyencoding addiconbytype addinputfilter ' +
        'addlanguage addmoduleinfo addoutputfilter addoutputfilterbytype addtype alias ' +
        'aliasmatch allow allowconnect allowencodedslashes allowoverride anonymous ' +
        'anonymous_logemail anonymous_mustgiveemail anonymous_nouserid anonymous_verifyemail ' +
        'authbasicauthoritative authbasicprovider authdbduserpwquery authdbduserrealmquery ' +
        'authdbmgroupfile authdbmtype authdbmuserfile authdefaultauthoritative ' +
        'authdigestalgorithm authdigestdomain authdigestnccheck authdigestnonceformat ' +
        'authdigestnoncelifetime authdigestprovider authdigestqop authdigestshmemsize ' +
        'authgroupfile authldapbinddn authldapbindpassword authldapcharsetconfig ' +
        'authldapcomparednonserver authldapdereferencealiases authldapgroupattribute ' +
        'authldapgroupattributeisdn authldapremoteuserattribute authldapremoteuserisdn ' +
        'authldapurl authname authnprovideralias authtype authuserfile authzdbmauthoritative ' +
        'authzdbmtype authzdefaultauthoritative authzgroupfileauthoritative ' +
        'authzldapauthoritative authzownerauthoritative authzuserauthoritative ' +
        'balancermember browsermatch browsermatchnocase bufferedlogs cachedefaultexpire ' +
        'cachedirlength cachedirlevels cachedisable cacheenable cachefile ' +
        'cacheignorecachecontrol cacheignoreheaders cacheignorenolastmod ' +
        'cacheignorequerystring cachelastmodifiedfactor cachemaxexpire cachemaxfilesize ' +
        'cacheminfilesize cachenegotiateddocs cacheroot cachestorenostore cachestoreprivate ' +
        'cgimapextension charsetdefault charsetoptions charsetsourceenc checkcaseonly ' +
        'checkspelling chrootdir contentdigest cookiedomain cookieexpires cookielog ' +
        'cookiename cookiestyle cookietracking coredumpdirectory customlog dav ' +
        'davdepthinfinity davgenericlockdb davlockdb davmintimeout dbdexptime dbdkeep ' +
        'dbdmax dbdmin dbdparams dbdpersist dbdpreparesql dbdriver defaulticon ' +
        'defaultlanguage defaulttype deflatebuffersize deflatecompressionlevel ' +
        'deflatefilternote deflatememlevel deflatewindowsize deny directoryindex ' +
        'directorymatch directoryslash documentroot dumpioinput dumpiologlevel dumpiooutput ' +
        'enableexceptionhook enablemmap enablesendfile errordocument errorlog example ' +
        'expiresactive expiresbytype expiresdefault extendedstatus extfilterdefine ' +
        'extfilteroptions fileetag filterchain filterdeclare filterprotocol filterprovider ' +
        'filtertrace forcelanguagepriority forcetype forensiclog gracefulshutdowntimeout ' +
        'group header headername hostnamelookups identitycheck identitychecktimeout ' +
        'imapbase imapdefault imapmenu include indexheadinsert indexignore indexoptions ' +
        'indexorderdefault indexstylesheet isapiappendlogtoerrors isapiappendlogtoquery ' +
        'isapicachefile isapifakeasync isapilognotsupported isapireadaheadbuffer keepalive ' +
        'keepalivetimeout languagepriority ldapcacheentries ldapcachettl ' +
        'ldapconnectiontimeout ldapopcacheentries ldapopcachettl ldapsharedcachefile ' +
        'ldapsharedcachesize ldaptrustedclientcert ldaptrustedglobalcert ldaptrustedmode ' +
        'ldapverifyservercert limitinternalrecursion limitrequestbody limitrequestfields ' +
        'limitrequestfieldsize limitrequestline limitxmlrequestbody listen listenbacklog ' +
        'loadfile loadmodule lockfile logformat loglevel maxclients maxkeepaliverequests ' +
        'maxmemfree maxrequestsperchild maxrequestsperthread maxspareservers maxsparethreads ' +
        'maxthreads mcachemaxobjectcount mcachemaxobjectsize mcachemaxstreamingbuffer ' +
        'mcacheminobjectsize mcacheremovalalgorithm mcachesize metadir metafiles metasuffix ' +
        'mimemagicfile minspareservers minsparethreads mmapfile mod_gzip_on ' +
        'mod_gzip_add_header_count mod_gzip_keep_workfiles mod_gzip_dechunk ' +
        'mod_gzip_min_http mod_gzip_minimum_file_size mod_gzip_maximum_file_size ' +
        'mod_gzip_maximum_inmem_size mod_gzip_temp_dir mod_gzip_item_include ' +
        'mod_gzip_item_exclude mod_gzip_command_version mod_gzip_can_negotiate ' +
        'mod_gzip_handle_methods mod_gzip_static_suffix mod_gzip_send_vary ' +
        'mod_gzip_update_static modmimeusepathinfo multiviewsmatch namevirtualhost noproxy ' +
        'nwssltrustedcerts nwsslupgradeable options order passenv pidfile protocolecho ' +
        'proxybadheader proxyblock proxydomain proxyerroroverride proxyftpdircharset ' +
        'proxyiobuffersize proxymaxforwards proxypass proxypassinterpolateenv ' +
        'proxypassmatch proxypassreverse proxypassreversecookiedomain ' +
        'proxypassreversecookiepath proxypreservehost proxyreceivebuffersize proxyremote ' +
        'proxyremotematch proxyrequests proxyset proxystatus proxytimeout proxyvia ' +
        'readmename receivebuffersize redirect redirectmatch redirectpermanent ' +
        'redirecttemp removecharset removeencoding removehandler removeinputfilter ' +
        'removelanguage removeoutputfilter removetype requestheader require rewritebase ' +
        'rewritecond rewriteengine rewritelock rewritelog rewriteloglevel rewritemap ' +
        'rewriteoptions rewriterule rlimitcpu rlimitmem rlimitnproc satisfy scoreboardfile ' +
        'script scriptalias scriptaliasmatch scriptinterpretersource scriptlog ' +
        'scriptlogbuffer scriptloglength scriptsock securelisten seerequesttail ' +
        'sendbuffersize serveradmin serveralias serverlimit servername serverpath ' +
        'serverroot serversignature servertokens setenv setenvif setenvifnocase sethandler ' +
        'setinputfilter setoutputfilter ssienableaccess ssiendtag ssierrormsg ssistarttag ' +
        'ssitimeformat ssiundefinedecho sslcacertificatefile sslcacertificatepath ' +
        'sslcadnrequestfile sslcadnrequestpath sslcarevocationfile sslcarevocationpath ' +
        'sslcertificatechainfile sslcertificatefile sslcertificatekeyfile sslciphersuite ' +
        'sslcryptodevice sslengine sslhonorciperorder sslmutex ssloptions ' +
        'sslpassphrasedialog sslprotocol sslproxycacertificatefile ' +
        'sslproxycacertificatepath sslproxycarevocationfile sslproxycarevocationpath ' +
        'sslproxyciphersuite sslproxyengine sslproxymachinecertificatefile ' +
        'sslproxymachinecertificatepath sslproxyprotocol sslproxyverify ' +
        'sslproxyverifydepth sslrandomseed sslrequire sslrequiressl sslsessioncache ' +
        'sslsessioncachetimeout sslusername sslverifyclient sslverifydepth startservers ' +
        'startthreads substitute suexecusergroup threadlimit threadsperchild ' +
        'threadstacksize timeout traceenable transferlog typesconfig unsetenv ' +
        'usecanonicalname usecanonicalphysicalport user userdir virtualdocumentroot ' +
        'virtualdocumentrootip virtualscriptalias virtualscriptaliasip ' +
        'win32disableacceptex xbithack',
      literal: 'on off'
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'sqbracket',
        begin: '\\s\\[', end: '\\]$'
      },
      {
        className: 'cbracket',
        begin: '[\\$%]\\{', end: '\\}',
        contains: ['self', NUMBER]
      },
      NUMBER,
      {className: 'tag', begin: '</?', end: '>'},
      hljs.QUOTE_STRING_MODE
    ]
  };
};
},{}],5:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: ''});
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: ['self', hljs.C_NUMBER_MODE, STRING]
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '--', end: '$',
    },
    {
      className: 'comment',
      begin: '\\(\\*', end: '\\*\\)',
      contains: ['self', {begin: '--', end: '$'}] //allow nesting
    },
    hljs.HASH_COMMENT_MODE
  ];

  return {
    keywords: {
      keyword:
        'about above after against and around as at back before beginning ' +
        'behind below beneath beside between but by considering ' +
        'contain contains continue copy div does eighth else end equal ' +
        'equals error every exit fifth first for fourth from front ' +
        'get given global if ignoring in into is it its last local me ' +
        'middle mod my ninth not of on onto or over prop property put ref ' +
        'reference repeat returning script second set seventh since ' +
        'sixth some tell tenth that the then third through thru ' +
        'timeout times to transaction try until where while whose with ' +
        'without',
      constant:
        'AppleScript false linefeed return pi quote result space tab true',
      type:
        'alias application boolean class constant date file integer list ' +
        'number real record string text',
      command:
        'activate beep count delay launch log offset read round ' +
        'run say summarize write',
      property:
        'character characters contents day frontmost id item length ' +
        'month name paragraph paragraphs rest reverse running time version ' +
        'weekday word words year'
    },
    contains: [
      STRING,
      hljs.C_NUMBER_MODE,
      {
        className: 'type',
        begin: '\\bPOSIX file\\b'
      },
      {
        className: 'command',
        begin:
          '\\b(clipboard info|the clipboard|info for|list (disks|folder)|' +
          'mount volume|path to|(close|open for) access|(get|set) eof|' +
          'current date|do shell script|get volume settings|random number|' +
          'set volume|system attribute|system info|time to GMT|' +
          '(load|run|store) script|scripting components|' +
          'ASCII (character|number)|localized string|' +
          'choose (application|color|file|file name|' +
          'folder|from list|remote application|URL)|' +
          'display (alert|dialog))\\b|^\\s*return\\b'
      },
      {
        className: 'constant',
        begin:
          '\\b(text item delimiters|current application|missing value)\\b'
      },
      {
        className: 'keyword',
        begin:
          '\\b(apart from|aside from|instead of|out of|greater than|' +
          "isn't|(doesn't|does not) (equal|come before|come after|contain)|" +
          '(greater|less) than( or equal)?|(starts?|ends|begins?) with|' +
          'contained by|comes (before|after)|a (ref|reference))\\b'
      },
      {
        className: 'property',
        begin:
          '\\b(POSIX path|(date|time) string|quoted form)\\b'
      },
      {
        className: 'function_start',
        beginWithKeyword: true,
        keywords: 'on',
        illegal: '[${=;\\n]',
        contains: [TITLE, PARAMS]
      }
    ].concat(COMMENTS)
  };
};
},{}],6:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        /* mnemonic */
        'adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs ' +
        'brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr ' +
        'clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor ' +
        'fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul ' +
        'muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs ' +
        'sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub ' +
        'subi swap tst wdr',
      built_in:
        /* general purpose registers */
        'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 ' +
        'r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ' +
        /* IO Registers (ATMega128) */
        'ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h ' +
        'tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ' +
        'ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ' +
        'ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk ' +
        'tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ' +
        'ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr ' +
        'porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ' +
        'ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf'
    },
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {className: 'comment', begin: ';',  end: '$'},
      hljs.C_NUMBER_MODE, // 0x..., decimal, float
      hljs.BINARY_NUMBER_MODE, // 0b...
      {
        className: 'number',
        begin: '\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)' // $..., 0o...
      },
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'', end: '[^\\\\]\'',
        illegal: '[^\\\\][^\']'
      },
      {className: 'label',  begin: '^[A-Za-z0-9_.$]+:'},
      {className: 'preprocessor', begin: '#', end: '$'},
      {  // директивы «.include» «.macro» и т.д.
        className: 'preprocessor',
        begin: '\\.[a-zA-Z]+'
      },
      {  // подстановка в «.macro»
        className: 'localvars',
        begin: '@[0-9]+'
      }
    ]
  };
};
},{}],7:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: 'false int abstract private char interface boolean static null if for true ' +
      'while long throw finally protected extends final implements return void enum else ' +
      'break new catch byte super class case short default double public try this switch ' +
      'continue reverse firstfast firstonly forupdate nofetch sum avg minof maxof count ' +
      'order group by asc desc index hint like dispaly edit client server ttsbegin ' +
      'ttscommit str real date container anytype common div mod',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        illegal: ':',
        keywords: 'class interface',
        contains: [
          {
            className: 'inheritance',
            beginWithKeyword: true,
            keywords: 'extends implements',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      }
    ]
  };
};
},{}],8:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var BASH_LITERAL = 'true false';
  var BASH_KEYWORD = 'if then else elif fi for break continue while in do done echo exit return set declare';
  var VAR1 = {
    className: 'variable', begin: '\\$[a-zA-Z0-9_#]+'
  };
  var VAR2 = {
    className: 'variable', begin: '\\${([^}]|\\\\})+}'
  };
  var QUOTE_STRING = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE, VAR1, VAR2],
    relevance: 0
  };
  var APOS_STRING = {
    className: 'string',
    begin: '\'', end: '\'',
    contains: [{begin: '\'\''}],
    relevance: 0
  };
  var TEST_CONDITION = {
    className: 'test_condition',
    begin: '', end: '',
    contains: [QUOTE_STRING, APOS_STRING, VAR1, VAR2],
    keywords: {
      literal: BASH_LITERAL
    },
    relevance: 0
  };

  return {
    keywords: {
      keyword: BASH_KEYWORD,
      literal: BASH_LITERAL
    },
    contains: [
      {
        className: 'shebang',
        begin: '(#!\\/bin\\/bash)|(#!\\/bin\\/sh)',
        relevance: 10
      },
      VAR1,
      VAR2,
      hljs.HASH_COMMENT_MODE,
      QUOTE_STRING,
      APOS_STRING,
      hljs.inherit(TEST_CONDITION, {begin: '\\[ ', end: ' \\]', relevance: 0}),
      hljs.inherit(TEST_CONDITION, {begin: '\\[\\[ ', end: ' \\]\\]'})
    ]
  };
};
},{}],9:[function(_dereq_,module,exports){
module.exports = function(hljs){
  return {
    contains: [
      {
        className: 'comment',
        begin: '[^\\[\\]\\.,\\+\\-<> \r\n]',
        excludeEnd: true,
        end: '[\\[\\]\\.,\\+\\-<> \r\n]',
        relevance: 0
      },
      {
        className: 'title',
        begin: '[\\[\\]]',
        relevance: 0
      },
      {
        className: 'string',
        begin: '[\\.,]'
      },
      {
        className: 'literal',
        begin: '[\\+\\-]'
      }
    ]
  };
};
},{}],10:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var keywords = {
    built_in:
      // Clojure keywords
      'def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem '+
      'quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? '+
      'set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? '+
      'class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? '+
      'string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . '+
      'inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last '+
      'drop-while while intern condp case reduced cycle split-at split-with repeat replicate '+
      'iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext '+
      'nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends '+
      'add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler '+
      'set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter '+
      'monitor-exit defmacro defn defn- macroexpand macroexpand-1 for doseq dosync dotimes and or '+
      'when when-not when-let comp juxt partial sequence memoize constantly complement identity assert '+
      'peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast '+
      'sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import '+
      'intern refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! '+
      'assoc! dissoc! pop! disj! import use class type num float double short byte boolean bigint biginteger '+
      'bigdec print-method print-dup throw-if throw printf format load compile get-in update-in pr pr-on newline '+
      'flush read slurp read-line subvec with-open memfn time ns assert re-find re-groups rand-int rand mod locking '+
      'assert-valid-fdecl alias namespace resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! '+
      'reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! '+
      'new next conj set! memfn to-array future future-call into-array aset gen-class reduce merge map filter find empty '+
      'hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list '+
      'disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer '+
      'chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate '+
      'unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta '+
      'lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize'
   };

  var CLJ_IDENT_RE = '[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$\';]+';
  var SIMPLE_NUMBER_RE = '[\\s:\\(\\{]+\\d+(\\.\\d+)?';

  var NUMBER = {
    className: 'number', begin: SIMPLE_NUMBER_RE,
    relevance: 0
  };
  var STRING = {
    className: 'string',
    begin: '"', end: '"',
    contains: [hljs.BACKSLASH_ESCAPE],
    relevance: 0
  };
  var COMMENT = {
    className: 'comment',
    begin: ';', end: '$',
    relevance: 0
  };
  var COLLECTION = {
    className: 'collection',
    begin: '[\\[\\{]', end: '[\\]\\}]'
  };
  var HINT = {
    className: 'comment',
    begin: '\\^' + CLJ_IDENT_RE
  };
  var HINT_COL = {
    className: 'comment',
    begin: '\\^\\{', end: '\\}'
  };
  var KEY = {
    className: 'attribute',
    begin: '[:]' + CLJ_IDENT_RE
  };
  var LIST = {
    className: 'list',
    begin: '\\(', end: '\\)',
    relevance: 0
  };
  var BODY = {
    endsWithParent: true, excludeEnd: true,
    keywords: {literal: 'true false nil'},
    relevance: 0
  };
  var TITLE = {
    keywords: keywords,
    lexems: CLJ_IDENT_RE,
    className: 'title', begin: CLJ_IDENT_RE,
    starts: BODY
  };

  LIST.contains = [{className: 'comment', begin: 'comment'}, TITLE];
  BODY.contains = [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER];
  COLLECTION.contains = [LIST, STRING, HINT, COMMENT, KEY, COLLECTION, NUMBER];

  return {
    illegal: '\\S',
    contains: [
      COMMENT,
      LIST
    ]
  }
};
},{}],11:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: 'add_custom_command add_custom_target add_definitions add_dependencies ' +
      'add_executable add_library add_subdirectory add_test aux_source_directory ' +
      'break build_command cmake_minimum_required cmake_policy configure_file ' +
      'create_test_sourcelist define_property else elseif enable_language enable_testing ' +
      'endforeach endfunction endif endmacro endwhile execute_process export find_file ' +
      'find_library find_package find_path find_program fltk_wrap_ui foreach function ' +
      'get_cmake_property get_directory_property get_filename_component get_property ' +
      'get_source_file_property get_target_property get_test_property if include ' +
      'include_directories include_external_msproject include_regular_expression install ' +
      'link_directories load_cache load_command macro mark_as_advanced message option ' +
      'output_required_files project qt_wrap_cpp qt_wrap_ui remove_definitions return ' +
      'separate_arguments set set_directory_properties set_property ' +
      'set_source_files_properties set_target_properties set_tests_properties site_name ' +
      'source_group string target_link_libraries try_compile try_run unset variable_watch ' +
      'while build_name exec_program export_library_dependencies install_files ' +
      'install_programs install_targets link_libraries make_directory remove subdir_depends ' +
      'subdirs use_mangled_mesa utility_source variable_requires write_file',
    contains: [
      {
        className: 'envvar',
        begin: '\\${', end: '}'
      },
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE
    ]
  };
};
},{}],12:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var KEYWORDS = {
    keyword:
      // JS keywords
      'in if for while finally new do return else break catch instanceof throw try this ' +
      'switch continue typeof delete debugger super ' +
      // Coffee keywords
      'then unless until loop of by when and or is isnt not',
    literal:
      // JS literals
      'true false null undefined ' +
      // Coffee literals
      'yes no on off ',
    reserved: 'case default function var void with const let enum export import native ' +
      '__hasProp __extends __slice __bind __indexOf'
  };
  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var TITLE = {className: 'title', begin: JS_IDENT_RE};
  var SUBST = {
    className: 'subst',
    begin: '#\\{', end: '}',
    keywords: KEYWORDS,
    contains: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]
  };

  return {
    keywords: KEYWORDS,
    contains: [
      // Numbers
      hljs.BINARY_NUMBER_MODE,
      hljs.C_NUMBER_MODE,
      // Strings
      hljs.APOS_STRING_MODE,
      {
        className: 'string',
        begin: '"""', end: '"""',
        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
      },
      {
        className: 'string',
        begin: '"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE, SUBST],
        relevance: 0
      },
      // Comments
      {
        className: 'comment',
        begin: '###', end: '###'
      },
      hljs.HASH_COMMENT_MODE,
      {
        className: 'regexp',
        begin: '///', end: '///',
        contains: [hljs.HASH_COMMENT_MODE]
      },
      {
        className: 'regexp', begin: '//[gim]*'
      },
      {
        className: 'regexp',
        begin: '/\\S(\\\\.|[^\\n])*/[gim]*' // \S is required to parse x / 2 / 3 as two divisions
      },
      {
        begin: '`', end: '`',
        excludeBegin: true, excludeEnd: true,
        subLanguage: 'javascript'
      },
      {
        className: 'function',
        begin: JS_IDENT_RE + '\\s*=\\s*(\\(.+\\))?\\s*[-=]>',
        returnBegin: true,
        contains: [
          TITLE,
          {
            className: 'params',
            begin: '\\(', end: '\\)'
          }
        ]
      },
      {
        className: 'class',
        beginWithKeyword: true, keywords: 'class',
        end: '$',
        illegal: ':',
        contains: [
          {
            beginWithKeyword: true, keywords: 'extends',
            endsWithParent: true,
            illegal: ':',
            contains: [TITLE]
          },
          TITLE
        ]
      },
      {
        className: 'property',
        begin: '@' + JS_IDENT_RE
      }
    ]
  };
};
},{}],13:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var CPP_KEYWORDS = {
    keyword: 'false int float while private char catch export virtual operator sizeof ' +
      'dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace ' +
      'unsigned long throw volatile static protected bool template mutable if public friend ' +
      'do return goto auto void enum else break new extern using true class asm case typeid ' +
      'short reinterpret_cast|10 default double register explicit signed typename try this ' +
      'switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype ' +
      'noexcept nullptr static_assert thread_local restrict _Bool complex',
    built_in: 'std string cin cout cerr clog stringstream istringstream ostringstream ' +
      'auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set ' +
      'unordered_map unordered_multiset unordered_multimap array shared_ptr'
  };
  return {
    keywords: CPP_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'\\\\?.', end: '\'',
        illegal: '.'
      },
      {
        className: 'number',
        begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)'
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'stl_container',
        begin: '\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<', end: '>',
        keywords: CPP_KEYWORDS,
        relevance: 10,
        contains: ['self']
      }
    ]
  };
};
},{}],14:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      // Normal keywords.
      'abstract as base bool break byte case catch char checked class const continue decimal ' +
      'default delegate do double else enum event explicit extern false finally fixed float ' +
      'for foreach goto if implicit in int interface internal is lock long namespace new null ' +
      'object operator out override params private protected public readonly ref return sbyte ' +
      'sealed short sizeof stackalloc static string struct switch this throw true try typeof ' +
      'uint ulong unchecked unsafe ushort using virtual volatile void while ' +
      // Contextual keywords.
      'ascending descending from get group into join let orderby partial select set value var '+
      'where yield',
    contains: [
      {
        className: 'comment',
        begin: '///', end: '$', returnBegin: true,
        contains: [
          {
            className: 'xmlDocTag',
            begin: '///|<!--|-->'
          },
          {
            className: 'xmlDocTag',
            begin: '</?', end: '>'
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$',
        keywords: 'if else elif endif define undef warning error line region endregion pragma checksum'
      },
      {
        className: 'string',
        begin: '@"', end: '"',
        contains: [{begin: '""'}]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],15:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var FUNCTION = {
    className: 'function',
    begin: hljs.IDENT_RE + '\\(', end: '\\)',
    contains: [hljs.NUMBER_MODE, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
  };
  return {
    case_insensitive: true,
    illegal: '[=/|\']',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'id', begin: '\\#[A-Za-z0-9_-]+'
      },
      {
        className: 'class', begin: '\\.[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'attr_selector',
        begin: '\\[', end: '\\]',
        illegal: '$'
      },
      {
        className: 'pseudo',
        begin: ':(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\"\\\']+'
      },
      {
        className: 'at_rule',
        begin: '@(font-face|page)',
        lexems: '[a-z-]+',
        keywords: 'font-face page'
      },
      {
        className: 'at_rule',
        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
                                 // because it doesn’t let it to be parsed as
                                 // a rule set but instead drops parser into
                                 // the default mode which is how it should be.
        excludeEnd: true,
        keywords: 'import page media charset',
        contains: [
          FUNCTION,
          hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
          hljs.NUMBER_MODE
        ]
      },
      {
        className: 'tag', begin: hljs.IDENT_RE,
        relevance: 0
      },
      {
        className: 'rules',
        begin: '{', end: '}',
        illegal: '[^\\s]',
        relevance: 0,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: 'rule',
            begin: '[^\\s]', returnBegin: true, end: ';', endsWithParent: true,
            contains: [
              {
                className: 'attribute',
                begin: '[A-Z\\_\\.\\-]+', end: ':',
                excludeEnd: true,
                illegal: '[^\\s]',
                starts: {
                  className: 'value',
                  endsWithParent: true, excludeEnd: true,
                  contains: [
                    FUNCTION,
                    hljs.NUMBER_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    {
                      className: 'hexcolor', begin: '\\#[0-9A-F]+'
                    },
                    {
                      className: 'important', begin: '!important'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  };
};
},{}],16:[function(_dereq_,module,exports){
module.exports = /**
 * Known issues:
 *
 * - invalid hex string literals will be recognized as a double quoted strings
 *   but 'x' at the beginning of string will not be matched
 *
 * - delimited string literals are not checked for matching end delimiter
 *   (not possible to do with js regexp)
 *
 * - content of token string is colored as a string (i.e. no keyword coloring inside a token string)
 *   also, content of token string is not validated to contain only valid D tokens
 *
 * - special token sequence rule is not strictly following D grammar (anything following #line
 *   up to the end of line is matched as special token sequence)
 */

function(hljs) {

	/**
	 * Language keywords
	 *
	 * @type {Object}
	 */
	var D_KEYWORDS = {
		keyword:
			'abstract alias align asm assert auto body break byte case cast catch class ' +
			'const continue debug default delete deprecated do else enum export extern final ' +
			'finally for foreach foreach_reverse|10 goto if immutable import in inout int ' +
			'interface invariant is lazy macro mixin module new nothrow out override package ' +
			'pragma private protected public pure ref return scope shared static struct ' +
			'super switch synchronized template this throw try typedef typeid typeof union ' +
			'unittest version void volatile while with __FILE__ __LINE__ __gshared|10 ' +
			'__thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__',
		built_in:
			'bool cdouble cent cfloat char creal dchar delegate double dstring float function ' +
			'idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar ' +
			'wstring',
		literal:
			'false null true'
	};

	/**
	 * Number literal regexps
	 *
	 * @type {String}
	 */
	var decimal_integer_re = '(0|[1-9][\\d_]*)',
		decimal_integer_nosus_re = '(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)',
		binary_integer_re = '0[bB][01_]+',
		hexadecimal_digits_re = '([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)',
		hexadecimal_integer_re = '0[xX]' + hexadecimal_digits_re,

		decimal_exponent_re = '([eE][+-]?' + decimal_integer_nosus_re + ')',
		decimal_float_re = '(' + decimal_integer_nosus_re + '(\\.\\d*|' + decimal_exponent_re + ')|' +
								'\\d+\\.' + decimal_integer_nosus_re + decimal_integer_nosus_re + '|' +
								'\\.' + decimal_integer_re + decimal_exponent_re + '?' +
							')',
		hexadecimal_float_re = '(0[xX](' +
									hexadecimal_digits_re + '\\.' + hexadecimal_digits_re + '|'+
									'\\.?' + hexadecimal_digits_re +
							   ')[pP][+-]?' + decimal_integer_nosus_re + ')',

		integer_re = '(' +
			decimal_integer_re + '|' +
			binary_integer_re  + '|' +
		 	hexadecimal_integer_re   +
		')',

		float_re = '(' +
			hexadecimal_float_re + '|' +
			decimal_float_re  +
		')';

	/**
	 * Escape sequence supported in D string and character literals
	 *
	 * @type {String}
	 */
	var escape_sequence_re = '\\\\(' +
							'[\'"\\?\\\\abfnrtv]|' +	// common escapes
							'u[\\dA-Fa-f]{4}|' + 		// four hex digit unicode codepoint
							'[0-7]{1,3}|' + 			// one to three octal digit ascii char code
							'x[\\dA-Fa-f]{2}|' +		// two hex digit ascii char code
							'U[\\dA-Fa-f]{8}' +			// eight hex digit unicode codepoint
						  ')|' +
						  '&[a-zA-Z\\d]{2,};';			// named character entity


	/**
	 * D integer number literals
	 *
	 * @type {Object}
	 */
	var D_INTEGER_MODE = {
		className: 'number',
    	begin: '\\b' + integer_re + '(L|u|U|Lu|LU|uL|UL)?',
    	relevance: 0
	};

	/**
	 * [D_FLOAT_MODE description]
	 * @type {Object}
	 */
	var D_FLOAT_MODE = {
		className: 'number',
		begin: '\\b(' +
				float_re + '([fF]|L|i|[fF]i|Li)?|' +
				integer_re + '(i|[fF]i|Li)' +
			')',
		relevance: 0
	};

	/**
	 * D character literal
	 *
	 * @type {Object}
	 */
	var D_CHARACTER_MODE = {
		className: 'string',
		begin: '\'(' + escape_sequence_re + '|.)', end: '\'',
		illegal: '.'
	};

	/**
	 * D string escape sequence
	 *
	 * @type {Object}
	 */
	var D_ESCAPE_SEQUENCE = {
		begin: escape_sequence_re,
		relevance: 0
	}

	/**
	 * D double quoted string literal
	 *
	 * @type {Object}
	 */
	var D_STRING_MODE = {
		className: 'string',
		begin: '"',
		contains: [D_ESCAPE_SEQUENCE],
		end: '"[cwd]?',
		relevance: 0
	};

	/**
	 * D wysiwyg and delimited string literals
	 *
	 * @type {Object}
	 */
	var D_WYSIWYG_DELIMITED_STRING_MODE = {
		className: 'string',
		begin: '[rq]"',
		end: '"[cwd]?',
		relevance: 5
	};

	/**
	 * D alternate wysiwyg string literal
	 *
	 * @type {Object}
	 */
	var D_ALTERNATE_WYSIWYG_STRING_MODE = {
		className: 'string',
		begin: '`',
		end: '`[cwd]?'
	};

	/**
	 * D hexadecimal string literal
	 *
	 * @type {Object}
	 */
	var D_HEX_STRING_MODE = {
		className: 'string',
		begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
		relevance: 10
	};

	/**
	 * D delimited string literal
	 *
	 * @type {Object}
	 */
	var D_TOKEN_STRING_MODE = {
		className: 'string',
		begin: 'q"\\{',
		end: '\\}"'
	};

	/**
	 * Hashbang support
	 *
	 * @type {Object}
	 */
	var D_HASHBANG_MODE = {
		className: 'shebang',
		begin: '^#!',
		end: '$',
		relevance: 5
	};

	/**
	 * D special token sequence
	 *
	 * @type {Object}
	 */
	var D_SPECIAL_TOKEN_SEQUENCE_MODE = {
		className: 'preprocessor',
		begin: '#(line)',
		end: '$',
		relevance: 5
	};

	/**
	 * D attributes
	 *
	 * @type {Object}
	 */
	var D_ATTRIBUTE_MODE = {
		className: 'keyword',
		begin: '@[a-zA-Z_][a-zA-Z_\\d]*'
	};

	/**
	 * D nesting comment
	 *
	 * @type {Object}
	 */
	var D_NESTING_COMMENT_MODE = {
		className: 'comment',
		begin: '\\/\\+',
		contains: ['self'],
		end: '\\+\\/',
		relevance: 10
	}

	return {
		lexems: hljs.UNDERSCORE_IDENT_RE,
		keywords: D_KEYWORDS,
		contains: [
			hljs.C_LINE_COMMENT_MODE,
  			hljs.C_BLOCK_COMMENT_MODE,
  			D_NESTING_COMMENT_MODE,
  			D_HEX_STRING_MODE,
  			D_STRING_MODE,
  			D_WYSIWYG_DELIMITED_STRING_MODE,
  			D_ALTERNATE_WYSIWYG_STRING_MODE,
  			D_TOKEN_STRING_MODE,
  			D_FLOAT_MODE,
  			D_INTEGER_MODE,
  			D_CHARACTER_MODE,
  			D_HASHBANG_MODE,
  			D_SPECIAL_TOKEN_SEQUENCE_MODE,
  			D_ATTRIBUTE_MODE
		]
	};
};
},{}],17:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var DELPHI_KEYWORDS = 'and safecall cdecl then string exports library not pascal set ' +
    'virtual file in array label packed end. index while const raise for to implementation ' +
    'with except overload destructor downto finally program exit unit inherited override if ' +
    'type until function do begin repeat goto nil far initialization object else var uses ' +
    'external resourcestring interface end finalization class asm mod case on shr shl of ' +
    'register xorwrite threadvar try record near stored constructor stdcall inline div out or ' +
    'procedure';
  var DELPHI_CLASS_KEYWORDS = 'safecall stdcall pascal stored const implementation ' +
    'finalization except to finally program inherited override then exports string read not ' +
    'mod shr try div shl set library message packed index for near overload label downto exit ' +
    'public goto interface asm on of constructor or private array unit raise destructor var ' +
    'type until function else external with case default record while protected property ' +
    'procedure published and cdecl do threadvar file in if end virtual write far out begin ' +
    'repeat nil initialization object uses resourcestring class register xorwrite inline static';
  var CURLY_COMMENT =  {
    className: 'comment',
    begin: '{', end: '}',
    relevance: 0
  };
  var PAREN_COMMENT = {
    className: 'comment',
    begin: '\\(\\*', end: '\\*\\)',
    relevance: 10
  };
  var STRING = {
    className: 'string',
    begin: '\'', end: '\'',
    contains: [{begin: '\'\''}],
    relevance: 0
  };
  var CHAR_STRING = {
    className: 'string', begin: '(#\\d+)+'
  };
  var FUNCTION = {
    className: 'function',
    beginWithKeyword: true, end: '[:;]',
    keywords: 'function constructor|10 destructor|10 procedure|10',
    contains: [
      {
        className: 'title', begin: hljs.IDENT_RE
      },
      {
        className: 'params',
        begin: '\\(', end: '\\)',
        keywords: DELPHI_KEYWORDS,
        contains: [STRING, CHAR_STRING]
      },
      CURLY_COMMENT, PAREN_COMMENT
    ]
  };
  return {
    case_insensitive: true,
    keywords: DELPHI_KEYWORDS,
    illegal: '("|\\$[G-Zg-z]|\\/\\*|</)',
    contains: [
      CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
      STRING, CHAR_STRING,
      hljs.NUMBER_MODE,
      FUNCTION,
      {
        className: 'class',
        begin: '=\\bclass\\b', end: 'end;',
        keywords: DELPHI_CLASS_KEYWORDS,
        contains: [
          STRING, CHAR_STRING,
          CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
          FUNCTION
        ]
      }
    ]
  };
};
},{}],18:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      {
        className: 'chunk',
        begin: '^\\@\\@ +\\-\\d+,\\d+ +\\+\\d+,\\d+ +\\@\\@$',
        relevance: 10
      },
      {
        className: 'chunk',
        begin: '^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$',
        relevance: 10
      },
      {
        className: 'chunk',
        begin: '^\\-\\-\\- +\\d+,\\d+ +\\-\\-\\-\\-$',
        relevance: 10
      },
      {
        className: 'header',
        begin: 'Index: ', end: '$'
      },
      {
        className: 'header',
        begin: '=====', end: '=====$'
      },
      {
        className: 'header',
        begin: '^\\-\\-\\-', end: '$'
      },
      {
        className: 'header',
        begin: '^\\*{3} ', end: '$'
      },
      {
        className: 'header',
        begin: '^\\+\\+\\+', end: '$'
      },
      {
        className: 'header',
        begin: '\\*{5}', end: '\\*{5}$'
      },
      {
        className: 'addition',
        begin: '^\\+', end: '$'
      },
      {
        className: 'deletion',
        begin: '^\\-', end: '$'
      },
      {
        className: 'change',
        begin: '^\\!', end: '$'
      }
    ]
  };
};
},{}],19:[function(_dereq_,module,exports){
module.exports = function(hljs) {

  function allowsDjangoSyntax(mode, parent) {
    return (
      parent == undefined || // default mode
      (!mode.className && parent.className == 'tag') || // tag_internal
      mode.className == 'value' // value
    );
  }

  function copy(mode, parent) {
    var result = {};
    for (var key in mode) {
      if (key != 'contains') {
        result[key] = mode[key];
      }
      var contains = [];
      for (var i = 0; mode.contains && i < mode.contains.length; i++) {
        contains.push(copy(mode.contains[i], mode));
      }
      if (allowsDjangoSyntax(mode, parent)) {
        contains = DJANGO_CONTAINS.concat(contains);
      }
      if (contains.length) {
        result.contains = contains;
      }
    }
    return result;
  }

  var FILTER = {
    className: 'filter',
    begin: '\\|[A-Za-z]+\\:?', excludeEnd: true,
    keywords:
      'truncatewords removetags linebreaksbr yesno get_digit timesince random striptags ' +
      'filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands ' +
      'title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode ' +
      'timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort ' +
      'dictsortreversed default_if_none pluralize lower join center default ' +
      'truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first ' +
      'escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize ' +
      'localtime utc timezone',
    contains: [
      {className: 'argument', begin: '"', end: '"'}
    ]
  };

  var DJANGO_CONTAINS = [
    {
      className: 'template_comment',
      begin: '{%\\s*comment\\s*%}', end: '{%\\s*endcomment\\s*%}'
    },
    {
      className: 'template_comment',
      begin: '{#', end: '#}'
    },
    {
      className: 'template_tag',
      begin: '{%', end: '%}',
      keywords:
        'comment endcomment load templatetag ifchanged endifchanged if endif firstof for ' +
        'endfor in ifnotequal endifnotequal widthratio extends include spaceless ' +
        'endspaceless regroup by as ifequal endifequal ssi now with cycle url filter ' +
        'endfilter debug block endblock else autoescape endautoescape csrf_token empty elif ' +
        'endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix ' +
        'plural get_current_language language get_available_languages ' +
        'get_current_language_bidi get_language_info get_language_info_list localize ' +
        'endlocalize localtime endlocaltime timezone endtimezone get_current_timezone',
      contains: [FILTER]
    },
    {
      className: 'variable',
      begin: '{{', end: '}}',
      contains: [FILTER]
    }
  ];

  var result = copy(hljs.LANGUAGES.xml);
  result.case_insensitive = true;
  return result;
};
},{}],20:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      flow: 'if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq',
      keyword: 'shift cd dir echo setlocal endlocal set pause copy',
      stream: 'prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux',
      winutils: 'ping net ipconfig taskkill xcopy ren del'
    },
    contains: [
      {
        className: 'envvar', begin: '%%[^ ]'
      },
      {
        className: 'envvar', begin: '%[^ ]+?%'
      },
      {
        className: 'envvar', begin: '![^ ]+?!'
      },
      {
        className: 'number', begin: '\\b\\d+',
        relevance: 0
      },
      {
        className: 'comment',
        begin: '@?rem', end: '$'
      }
    ]
  };
};
},{}],21:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      special_functions:
        'spawn spawn_link self',
      reserved:
        'after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if ' +
        'let not of or orelse|10 query receive rem try when xor'
    },
    contains: [
      {
        className: 'prompt', begin: '^[0-9]+> ',
        relevance: 10
      },
      {
        className: 'comment',
        begin: '%', end: '$'
      },
      {
        className: 'number',
        begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
        relevance: 0
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'constant', begin: '\\?(::)?([A-Z]\\w*(::)?)+'
      },
      {
        className: 'arrow', begin: '->'
      },
      {
        className: 'ok', begin: 'ok'
      },
      {
        className: 'exclamation_mark', begin: '!'
      },
      {
        className: 'function_or_atom',
        begin: '(\\b[a-z\'][a-zA-Z0-9_\']*:[a-z\'][a-zA-Z0-9_\']*)|(\\b[a-z\'][a-zA-Z0-9_\']*)',
        relevance: 0
      },
      {
        className: 'variable',
        begin: '[A-Z][a-zA-Z0-9_\']*',
        relevance: 0
      }
    ]
  };
};
},{}],22:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var BASIC_ATOM_RE = '[a-z\'][a-zA-Z0-9_\']*';
  var FUNCTION_NAME_RE = '(' + BASIC_ATOM_RE + ':' + BASIC_ATOM_RE + '|' + BASIC_ATOM_RE + ')';
  var ERLANG_RESERVED = {
    keyword:
      'after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let ' +
      'not of orelse|10 query receive rem try when xor',
    literal:
      'false true'
  };

  var COMMENT = {
    className: 'comment',
    begin: '%', end: '$',
    relevance: 0
  };
  var NUMBER = {
    className: 'number',
    begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
    relevance: 0
  };
  var NAMED_FUN = {
    begin: 'fun\\s+' + BASIC_ATOM_RE + '/\\d+'
  };
  var FUNCTION_CALL = {
    begin: FUNCTION_NAME_RE + '\\(', end: '\\)',
    returnBegin: true,
    relevance: 0,
    contains: [
      {
        className: 'function_name', begin: FUNCTION_NAME_RE,
        relevance: 0
      },
      {
        begin: '\\(', end: '\\)', endsWithParent: true,
        returnEnd: true,
        relevance: 0
        // "contains" defined later
      }
    ]
  };
  var TUPLE = {
    className: 'tuple',
    begin: '{', end: '}',
    relevance: 0
    // "contains" defined later
  };
  var VAR1 = {
    className: 'variable',
    begin: '\\b_([A-Z][A-Za-z0-9_]*)?',
    relevance: 0
  };
  var VAR2 = {
    className: 'variable',
    begin: '[A-Z][a-zA-Z0-9_]*',
    relevance: 0
  };
  var RECORD_ACCESS = {
    begin: '#', end: '}',
    illegal: '.',
    relevance: 0,
    returnBegin: true,
    contains: [
      {
        className: 'record_name',
        begin: '#' + hljs.UNDERSCORE_IDENT_RE,
        relevance: 0
      },
      {
        begin: '{', endsWithParent: true,
        relevance: 0
        // "contains" defined later
      }
    ]
  };

  var BLOCK_STATEMENTS = {
    keywords: ERLANG_RESERVED,
    begin: '(fun|receive|if|try|case)', end: 'end'
  };
  BLOCK_STATEMENTS.contains = [
    COMMENT,
    NAMED_FUN,
    hljs.inherit(hljs.APOS_STRING_MODE, {className: ''}),
    BLOCK_STATEMENTS,
    FUNCTION_CALL,
    hljs.QUOTE_STRING_MODE,
    NUMBER,
    TUPLE,
    VAR1, VAR2,
    RECORD_ACCESS
  ];

  var BASIC_MODES = [
    COMMENT,
    NAMED_FUN,
    BLOCK_STATEMENTS,
    FUNCTION_CALL,
    hljs.QUOTE_STRING_MODE,
    NUMBER,
    TUPLE,
    VAR1, VAR2,
    RECORD_ACCESS
  ];
  FUNCTION_CALL.contains[1].contains = BASIC_MODES;
  TUPLE.contains = BASIC_MODES;
  RECORD_ACCESS.contains[1].contains = BASIC_MODES;

  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: BASIC_MODES
  };
  return {
    keywords: ERLANG_RESERVED,
    illegal: '(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))',
    contains: [
      {
        className: 'function',
        begin: '^' + BASIC_ATOM_RE + '\\s*\\(', end: '->',
        returnBegin: true,
        illegal: '\\(|#|//|/\\*|\\\\|:',
        contains: [
          PARAMS,
          {
            className: 'title', begin: BASIC_ATOM_RE
          }
        ],
        starts: {
          end: ';|\\.',
          keywords: ERLANG_RESERVED,
          contains: BASIC_MODES
        }
      },
      COMMENT,
      {
        className: 'pp',
        begin: '^-', end: '\\.',
        relevance: 0,
        excludeEnd: true,
        returnBegin: true,
        lexems: '-' + hljs.IDENT_RE,
        keywords:
          '-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn ' +
          '-import -include -include_lib -compile -define -else -endif -file -behaviour ' +
          '-behavior',
        contains: [PARAMS]
      },
      NUMBER,
      hljs.QUOTE_STRING_MODE,
      RECORD_ACCESS,
      VAR1, VAR2,
      TUPLE
    ]
  };
};
},{}],23:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'atomic_uint attribute bool break bvec2 bvec3 bvec4 case centroid coherent const continue default ' +
        'discard dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 dmat3x4 dmat4 dmat4x2 dmat4x3 ' +
        'dmat4x4 do double dvec2 dvec3 dvec4 else flat float for highp if iimage1D iimage1DArray ' +
        'iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer iimageCube ' +
        'iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray image2DRect ' +
        'image3D imageBuffer imageCube imageCubeArray in inout int invariant isampler1D isampler1DArray ' +
        'isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D isamplerBuffer ' +
        'isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 layout lowp mat2 mat2x2 mat2x3 mat2x4 mat3 mat3x2 ' +
        'mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 mediump noperspective out patch precision readonly restrict ' +
        'return sample sampler1D sampler1DArray sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray ' +
        'sampler2DArrayShadow sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow ' +
        'sampler3D samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow smooth ' +
        'struct subroutine switch uimage1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray ' +
        'uimage2DRect uimage3D uimageBuffer uimageCube uimageCubeArray uint uniform usampler1D usampler1DArray ' +
        'usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D usamplerBuffer ' +
        'usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 varying vec2 vec3 vec4 void volatile while writeonly',
      built_in:
        'gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial ' +
        'gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color ' +
        'gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord ' +
        'gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor ' +
        'gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial ' +
        'gl_FrontSecondaryColor gl_InstanceID gl_InvocationID gl_Layer gl_LightModel ' +
        'gl_LightSource gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize ' +
        'gl_MaxClipDistances gl_MaxClipPlanes gl_MaxCombinedAtomicCounterBuffers ' +
        'gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms gl_MaxCombinedImageUnitsAndFragmentOutputs ' +
        'gl_MaxCombinedTextureImageUnits gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers ' +
        'gl_MaxFragmentAtomicCounters gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents ' +
        'gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers ' +
        'gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents ' +
        'gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits ' +
        'gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents ' +
        'gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset ' +
        'gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms ' +
        'gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits ' +
        'gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents ' +
        'gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters ' +
        'gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents ' +
        'gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents ' +
        'gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits ' +
        'gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors ' +
        'gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs ' +
        'gl_MaxVertexImageUniforms gl_MaxVertexOutputComponents gl_MaxVertexTextureImageUnits ' +
        'gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffset'+
        'gl_ModelViewMatrix gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose ' +
        'gl_ModelViewMatrixTranspose gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse ' +
        'gl_ModelViewProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixTranspose ' +
        'gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 ' +
        'gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_Normal gl_NormalMatrix ' +
        'gl_NormalScale gl_ObjectPlaneQ gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn ' +
        'gl_PerVertex gl_Point gl_PointCoord gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn ' +
        'gl_ProjectionMatrix gl_ProjectionMatrixInverse gl_ProjectionMatrixInverseTranspose ' +
        'gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask gl_SampleMaskIn gl_SamplePosition ' +
        'gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter gl_TexCoord gl_TextureEnvColor ' +
        'gl_TextureMatrixInverseTranspose gl_TextureMatrixTranspose gl_Vertex gl_VertexID ' +
        'gl_ViewportIndex gl_in gl_out EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive ' +
        'abs acos acosh all any asin asinh atan atanh atomicCounter atomicCounterDecrement ' +
        'atomicCounterIncrement barrier bitCount bitfieldExtract bitfieldInsert bitfieldReverse ' +
        'ceil clamp cos cosh cross dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward ' +
        'findLSB findMSB floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan ' +
        'greaterThanEqual imageAtomicAdd imageAtomicAnd imageAtomicCompSwap imageAtomicExchange ' +
        'imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad imageStore imulExtended ' +
        'intBitsToFloat interpolateAtCentroid interpolateAtOffset interpolateAtSample inverse inversesqrt ' +
        'isinf isnan ldexp length lessThan lessThanEqual log log2 matrixCompMult max memoryBarrier ' +
        'min mix mod modf noise1 noise2 noise3 noise4 normalize not notEqual outerProduct packDouble2x32 ' +
        'packHalf2x16 packSnorm2x16 packSnorm4x8 packUnorm2x16 packUnorm4x8 pow radians reflect refract ' +
        'round roundEven shadow1D shadow1DLod shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj ' +
        'shadow2DProjLod sign sin sinh smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture ' +
        'texture1D texture1DLod texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj ' +
        'texture2DProjLod texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod ' +
        'textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset textureLod ' +
        'textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset textureProjLod ' +
        'textureProjLodOffset textureProjOffset textureQueryLod textureSize transpose trunc uaddCarry ' +
        'uintBitsToFloat umulExtended unpackDouble2x32 unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 ' +
        'unpackUnorm2x16 unpackUnorm4x8 usubBorrow gl_TextureMatrix gl_TextureMatrixInverse',
      literal: 'true false'
    },
    illegal: '"',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      }
    ]
  };
};
},{}],24:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var GO_KEYWORDS = {
    keyword:
      'break default func interface select case map struct chan else goto package switch ' +
      'const fallthrough if range type continue for import return var go defer',
    constant:
       'true false iota nil',
    typename:
      'bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 ' +
      'uint16 uint32 uint64 int uint uintptr rune',
    built_in:
      'append cap close complex copy imag len make new panic print println real recover delete'
  };
  return {
    keywords: GO_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'', end: '[^\\\\]\'',
        relevance: 0
      },
      {
        className: 'string',
        begin: '`', end: '`'
      },
      {
        className: 'number',
        begin: '[^a-zA-Z_0-9](\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?',
        relevance: 0
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],25:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var TYPE = {
    className: 'type',
    begin: '\\b[A-Z][\\w\']*',
    relevance: 0
  };
  var CONTAINER = {
    className: 'container',
    begin: '\\(', end: '\\)',
    contains: [
      {className: 'type', begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'},
      {className: 'title', begin: '[_a-z][\\w\']*'}
    ]
  };
  var CONTAINER2 = {
    className: 'container',
    begin: '{', end: '}',
    contains: CONTAINER.contains
  }

  return {
    keywords:
      'let in if then else case of where do module import hiding qualified type data ' +
      'newtype deriving class instance not as foreign ccall safe unsafe',
    contains: [
      {
        className: 'comment',
        begin: '--', end: '$'
      },
      {
        className: 'preprocessor',
        begin: '{-#', end: '#-}'
      },
      {
        className: 'comment',
        contains: ['self'],
        begin: '{-', end: '-}'
      },
      {
        className: 'string',
        begin: '\\s+\'', end: '\'',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      },
      hljs.QUOTE_STRING_MODE,
      {
        className: 'import',
        begin: '\\bimport', end: '$',
        keywords: 'import qualified as hiding',
        contains: [CONTAINER],
        illegal: '\\W\\.|;'
      },
      {
        className: 'module',
        begin: '\\bmodule', end: 'where',
        keywords: 'module where',
        contains: [CONTAINER],
        illegal: '\\W\\.|;'
      },
      {
        className: 'class',
        begin: '\\b(class|instance)', end: 'where',
        keywords: 'class where instance',
        contains: [TYPE]
      },
      {
        className: 'typedef',
        begin: '\\b(data|(new)?type)', end: '$',
        keywords: 'data type newtype deriving',
        contains: [TYPE, CONTAINER, CONTAINER2]
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'shebang',
        begin: '#!\\/usr\\/bin\\/env\ runhaskell', end: '$'
      },
      TYPE,
      {
        className: 'title', begin: '^[_a-z][\\w\']*'
      }
    ]
  };
};
},{}],26:[function(_dereq_,module,exports){
var hljs = new function() {

  /* Utility functions */

  function escape(value) {
    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
  }

  function findCode(pre) {
    for (var node = pre.firstChild; node; node = node.nextSibling) {
      if (node.nodeName == 'CODE')
        return node;
      if (!(node.nodeType == 3 && node.nodeValue.match(/\s+/)))
        break;
    }
  }

  function blockText(block, ignoreNewLines) {
    return Array.prototype.map.call(block.childNodes, function(node) {
      if (node.nodeType == 3) {
        return ignoreNewLines ? node.nodeValue.replace(/\n/g, '') : node.nodeValue;
      }
      if (node.nodeName == 'BR') {
        return '\n';
      }
      return blockText(node, ignoreNewLines);
    }).join('');
  }

  function blockLanguage(block) {
    var classes = (block.className + ' ' + block.parentNode.className).split(/\s+/);
    classes = classes.map(function(c) {return c.replace(/^language-/, '')});
    for (var i = 0; i < classes.length; i++) {
      if (languages[classes[i]] || classes[i] == 'no-highlight') {
        return classes[i];
      }
    }
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == 3)
          offset += child.nodeValue.length;
        else if (child.nodeName == 'BR')
          offset += 1;
        else if (child.nodeType == 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          result.push({
            event: 'stop',
            offset: offset,
            node: child
          });
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(stream1, stream2, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (stream1.length && stream2.length) {
        if (stream1[0].offset != stream2[0].offset)
          return (stream1[0].offset < stream2[0].offset) ? stream1 : stream2;
        else {
          /*
          To avoid starting the stream just before it should stop the order is
          ensured that stream1 always starts first and closes last:

          if (event1 == 'start' && event2 == 'start')
            return stream1;
          if (event1 == 'start' && event2 == 'stop')
            return stream2;
          if (event1 == 'stop' && event2 == 'start')
            return stream1;
          if (event1 == 'stop' && event2 == 'stop')
            return stream2;

          ... which is collapsed to:
          */
          return stream2[0].event == 'start' ? stream1 : stream2;
        }
      } else {
        return stream1.length ? stream1 : stream2;
      }
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"'};
      return '<' + node.nodeName + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
    }

    while (stream1.length || stream2.length) {
      var current = selectStream().splice(0, 1)[0];
      result += escape(value.substr(processed, current.offset - processed));
      processed = current.offset;
      if ( current.event == 'start') {
        result += open(current.node);
        nodeStack.push(current.node);
      } else if (current.event == 'stop') {
        var node, i = nodeStack.length;
        do {
          i--;
          node = nodeStack[i];
          result += ('</' + node.nodeName.toLowerCase() + '>');
        } while (node != current.node);
        nodeStack.splice(i, 1);
        while (i < nodeStack.length) {
          result += open(nodeStack[i]);
          i++;
        }
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function compileLanguage(language) {

    function langRe(value, global) {
      return RegExp(
        value,
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      var keywords = []; // used later with beginWithKeyword but filled as a side-effect of keywords compilation
      if (mode.keywords) {
        var compiled_keywords = {};

        function flatten(className, str) {
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
            keywords.push(pair[0]);
          });
        }

        mode.lexemsRe = langRe(mode.lexems || hljs.IDENT_RE, true);
        if (typeof mode.keywords == 'string') { // string
          flatten('keyword', mode.keywords)
        } else {
          for (var className in mode.keywords) {
            if (!mode.keywords.hasOwnProperty(className))
              continue;
            flatten(className, mode.keywords[className]);
          }
        }
        mode.keywords = compiled_keywords;
      }
      if (parent) {
        if (mode.beginWithKeyword) {
          mode.begin = '\\b(' + keywords.join('|') + ')\\s';
        }
        mode.beginRe = langRe(mode.begin ? mode.begin : '\\B|\\b');
        if (!mode.end && !mode.endsWithParent)
          mode.end = '\\B|\\b';
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = mode.end || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance === undefined)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      for (var i = 0; i < mode.contains.length; i++) {
        if (mode.contains[i] == 'self') {
          mode.contains[i] = mode;
        }
        compileMode(mode.contains[i], mode);
      }
      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators = [];
      for (var i = 0; i < mode.contains.length; i++) {
        terminators.push(mode.contains[i].begin);
      }
      if (mode.terminator_end) {
        terminators.push(mode.terminator_end);
      }
      if (mode.illegal) {
        terminators.push(mode.illegal);
      }
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(s) {return null;}};
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name and a string with the
  code to highlight. Returns an object with the following properties:

  - relevance (int)
  - keyword_count (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(language_name, value) {

    function subMode(lexem, mode) {
      for (var i = 0; i < mode.contains.length; i++) {
        var match = mode.contains[i].beginRe.exec(lexem);
        if (match && match.index == 0) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexem) {
      if (mode.end && mode.endRe.test(lexem)) {
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexem);
      }
    }

    function isIllegal(lexem, mode) {
      return mode.illegal && mode.illegalRe.test(lexem);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function processKeywords() {
      var buffer = escape(mode_buffer);
      if (!top.keywords)
        return buffer;
      var result = '';
      var last_index = 0;
      top.lexemsRe.lastIndex = 0;
      var match = top.lexemsRe.exec(buffer);
      while (match) {
        result += buffer.substr(last_index, match.index - last_index);
        var keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          keyword_count += keyword_match[1];
          result += '<span class="'+ keyword_match[0] +'">' + match[0] + '</span>';
        } else {
          result += match[0];
        }
        last_index = top.lexemsRe.lastIndex;
        match = top.lexemsRe.exec(buffer);
      }
      return result + buffer.substr(last_index);
    }

    function processSubLanguage() {
      if (top.subLanguage && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result = top.subLanguage ? highlight(top.subLanguage, mode_buffer) : highlightAuto(mode_buffer);
      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        keyword_count += result.keyword_count;
        relevance += result.relevance;
      }
      return '<span class="' + result.language  + '">' + result.value + '</span>';
    }

    function processBuffer() {
      return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
    }

    function startNewMode(mode, lexem) {
      var markup = mode.className? '<span class="' + mode.className + '">': '';
      if (mode.returnBegin) {
        result += markup;
        mode_buffer = '';
      } else if (mode.excludeBegin) {
        result += escape(lexem) + markup;
        mode_buffer = '';
      } else {
        result += markup;
        mode_buffer = lexem;
      }
      top = Object.create(mode, {parent: {value: top}});
      relevance += mode.relevance;
    }

    function processLexem(buffer, lexem) {
      mode_buffer += buffer;
      if (lexem === undefined) {
        result += processBuffer();
        return 0;
      }

      var new_mode = subMode(lexem, top);
      if (new_mode) {
        result += processBuffer();
        startNewMode(new_mode, lexem);
        return new_mode.returnBegin ? 0 : lexem.length;
      }

      var end_mode = endOfMode(top, lexem);
      if (end_mode) {
        if (!(end_mode.returnEnd || end_mode.excludeEnd)) {
          mode_buffer += lexem;
        }
        result += processBuffer();
        do {
          if (top.className) {
            result += '</span>';
          }
          top = top.parent;
        } while (top != end_mode.parent);
        if (end_mode.excludeEnd) {
          result += escape(lexem);
        }
        mode_buffer = '';
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return end_mode.returnEnd ? 0 : lexem.length;
      }

      if (isIllegal(lexem, top))
        throw 'Illegal';

      /*
      Parser should not reach this point as all types of lexems should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexem;
      return lexem.length || 1;
    }

    var language = languages[language_name];
    compileLanguage(language);
    var top = language;
    var mode_buffer = '';
    var relevance = 0;
    var keyword_count = 0;
    var result = '';
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexem(value.substr(index, match.index - index), match[0]);
        index = match.index + count;
      }
      processLexem(value.substr(index))
      return {
        relevance: relevance,
        keyword_count: keyword_count,
        value: result,
        language: language_name
      };
    } catch (e) {
      if (e == 'Illegal') {
        return {
          relevance: 0,
          keyword_count: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - keyword_count (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text) {
    var result = {
      keyword_count: 0,
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    for (var key in languages) {
      if (!languages.hasOwnProperty(key))
        continue;
      var current = highlight(key, text);
      current.language = key;
      if (current.keyword_count + current.relevance > second_best.keyword_count + second_best.relevance) {
        second_best = current;
      }
      if (current.keyword_count + current.relevance > result.keyword_count + result.relevance) {
        second_best = result;
        result = current;
      }
    }
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value, tabReplace, useBR) {
    if (tabReplace) {
      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1, offset, s) {
        return p1.replace(/\t/g, tabReplace);
      });
    }
    if (useBR) {
      value = value.replace(/\n/g, '<br>');
    }
    return value;
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block, tabReplace, useBR) {
    var text = blockText(block, useBR);
    var language = blockLanguage(block);
    if (language == 'no-highlight')
        return;
    var result = language ? highlight(language, text) : highlightAuto(text);
    language = result.language;
    var original = nodeStream(block);
    if (original.length) {
      var pre = document.createElement('pre');
      pre.innerHTML = result.value;
      result.value = mergeStreams(original, nodeStream(pre), text);
    }
    result.value = fixMarkup(result.value, tabReplace, useBR);

    var class_name = block.className;
    if (!class_name.match('(\\s|^)(language-)?' + language + '(\\s|$)')) {
      class_name = class_name ? (class_name + ' ' + language) : language;
    }
    block.innerHTML = result.value;
    block.className = class_name;
    block.result = {
      language: language,
      kw: result.keyword_count,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        kw: result.second_best.keyword_count,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;
    Array.prototype.map.call(document.getElementsByTagName('pre'), findCode).
      filter(Boolean).
      forEach(function(code){highlightBlock(code, hljs.tabReplace)});
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    window.addEventListener('DOMContentLoaded', initHighlighting, false);
    window.addEventListener('load', initHighlighting, false);
  }

  var languages = {}; // a shortcut to avoid writing "this." everywhere

  /* Interface definition */

  this.LANGUAGES = languages;
  this.highlight = highlight;
  this.highlightAuto = highlightAuto;
  this.fixMarkup = fixMarkup;
  this.highlightBlock = highlightBlock;
  this.initHighlighting = initHighlighting;
  this.initHighlightingOnLoad = initHighlightingOnLoad;

  // Common regexps
  this.IDENT_RE = '[a-zA-Z][a-zA-Z0-9_]*';
  this.UNDERSCORE_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*';
  this.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  this.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  this.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  this.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  this.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  this.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE],
    relevance: 0
  };
  this.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE],
    relevance: 0
  };
  this.C_LINE_COMMENT_MODE = {
    className: 'comment',
    begin: '//', end: '$'
  };
  this.C_BLOCK_COMMENT_MODE = {
    className: 'comment',
    begin: '/\\*', end: '\\*/'
  };
  this.HASH_COMMENT_MODE = {
    className: 'comment',
    begin: '#', end: '$'
  };
  this.NUMBER_MODE = {
    className: 'number',
    begin: this.NUMBER_RE,
    relevance: 0
  };
  this.C_NUMBER_MODE = {
    className: 'number',
    begin: this.C_NUMBER_RE,
    relevance: 0
  };
  this.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: this.BINARY_NUMBER_RE,
    relevance: 0
  };

  // Utility functions
  this.inherit = function(parent, obj) {
    var result = {}
    for (var key in parent)
      result[key] = parent[key];
    if (obj)
      for (var key in obj)
        result[key] = obj[key];
    return result;
  }
}();
hljs.LANGUAGES['bash'] = _dereq_('./bash.js')(hljs);
hljs.LANGUAGES['erlang'] = _dereq_('./erlang.js')(hljs);
hljs.LANGUAGES['cs'] = _dereq_('./cs.js')(hljs);
hljs.LANGUAGES['brainfuck'] = _dereq_('./brainfuck.js')(hljs);
hljs.LANGUAGES['ruby'] = _dereq_('./ruby.js')(hljs);
hljs.LANGUAGES['rust'] = _dereq_('./rust.js')(hljs);
hljs.LANGUAGES['rib'] = _dereq_('./rib.js')(hljs);
hljs.LANGUAGES['diff'] = _dereq_('./diff.js')(hljs);
hljs.LANGUAGES['javascript'] = _dereq_('./javascript.js')(hljs);
hljs.LANGUAGES['glsl'] = _dereq_('./glsl.js')(hljs);
hljs.LANGUAGES['rsl'] = _dereq_('./rsl.js')(hljs);
hljs.LANGUAGES['lua'] = _dereq_('./lua.js')(hljs);
hljs.LANGUAGES['xml'] = _dereq_('./xml.js')(hljs);
hljs.LANGUAGES['markdown'] = _dereq_('./markdown.js')(hljs);
hljs.LANGUAGES['css'] = _dereq_('./css.js')(hljs);
hljs.LANGUAGES['lisp'] = _dereq_('./lisp.js')(hljs);
hljs.LANGUAGES['profile'] = _dereq_('./profile.js')(hljs);
hljs.LANGUAGES['http'] = _dereq_('./http.js')(hljs);
hljs.LANGUAGES['java'] = _dereq_('./java.js')(hljs);
hljs.LANGUAGES['php'] = _dereq_('./php.js')(hljs);
hljs.LANGUAGES['haskell'] = _dereq_('./haskell.js')(hljs);
hljs.LANGUAGES['1c'] = _dereq_('./1c.js')(hljs);
hljs.LANGUAGES['python'] = _dereq_('./python.js')(hljs);
hljs.LANGUAGES['smalltalk'] = _dereq_('./smalltalk.js')(hljs);
hljs.LANGUAGES['tex'] = _dereq_('./tex.js')(hljs);
hljs.LANGUAGES['actionscript'] = _dereq_('./actionscript.js')(hljs);
hljs.LANGUAGES['sql'] = _dereq_('./sql.js')(hljs);
hljs.LANGUAGES['vala'] = _dereq_('./vala.js')(hljs);
hljs.LANGUAGES['ini'] = _dereq_('./ini.js')(hljs);
hljs.LANGUAGES['d'] = _dereq_('./d.js')(hljs);
hljs.LANGUAGES['axapta'] = _dereq_('./axapta.js')(hljs);
hljs.LANGUAGES['perl'] = _dereq_('./perl.js')(hljs);
hljs.LANGUAGES['scala'] = _dereq_('./scala.js')(hljs);
hljs.LANGUAGES['cmake'] = _dereq_('./cmake.js')(hljs);
hljs.LANGUAGES['objectivec'] = _dereq_('./objectivec.js')(hljs);
hljs.LANGUAGES['avrasm'] = _dereq_('./avrasm.js')(hljs);
hljs.LANGUAGES['vhdl'] = _dereq_('./vhdl.js')(hljs);
hljs.LANGUAGES['coffeescript'] = _dereq_('./coffeescript.js')(hljs);
hljs.LANGUAGES['nginx'] = _dereq_('./nginx.js')(hljs);
hljs.LANGUAGES['erlang-repl'] = _dereq_('./erlang-repl.js')(hljs);
hljs.LANGUAGES['r'] = _dereq_('./r.js')(hljs);
hljs.LANGUAGES['json'] = _dereq_('./json.js')(hljs);
hljs.LANGUAGES['django'] = _dereq_('./django.js')(hljs);
hljs.LANGUAGES['delphi'] = _dereq_('./delphi.js')(hljs);
hljs.LANGUAGES['vbscript'] = _dereq_('./vbscript.js')(hljs);
hljs.LANGUAGES['mel'] = _dereq_('./mel.js')(hljs);
hljs.LANGUAGES['dos'] = _dereq_('./dos.js')(hljs);
hljs.LANGUAGES['apache'] = _dereq_('./apache.js')(hljs);
hljs.LANGUAGES['applescript'] = _dereq_('./applescript.js')(hljs);
hljs.LANGUAGES['cpp'] = _dereq_('./cpp.js')(hljs);
hljs.LANGUAGES['matlab'] = _dereq_('./matlab.js')(hljs);
hljs.LANGUAGES['parser3'] = _dereq_('./parser3.js')(hljs);
hljs.LANGUAGES['clojure'] = _dereq_('./clojure.js')(hljs);
hljs.LANGUAGES['go'] = _dereq_('./go.js')(hljs);
module.exports = hljs;
},{"./1c.js":2,"./actionscript.js":3,"./apache.js":4,"./applescript.js":5,"./avrasm.js":6,"./axapta.js":7,"./bash.js":8,"./brainfuck.js":9,"./clojure.js":10,"./cmake.js":11,"./coffeescript.js":12,"./cpp.js":13,"./cs.js":14,"./css.js":15,"./d.js":16,"./delphi.js":17,"./diff.js":18,"./django.js":19,"./dos.js":20,"./erlang-repl.js":21,"./erlang.js":22,"./glsl.js":23,"./go.js":24,"./haskell.js":25,"./http.js":27,"./ini.js":28,"./java.js":29,"./javascript.js":30,"./json.js":31,"./lisp.js":32,"./lua.js":33,"./markdown.js":34,"./matlab.js":35,"./mel.js":36,"./nginx.js":37,"./objectivec.js":38,"./parser3.js":39,"./perl.js":40,"./php.js":41,"./profile.js":42,"./python.js":43,"./r.js":44,"./rib.js":45,"./rsl.js":46,"./ruby.js":47,"./rust.js":48,"./scala.js":49,"./smalltalk.js":50,"./sql.js":51,"./tex.js":52,"./vala.js":53,"./vbscript.js":54,"./vhdl.js":55,"./xml.js":56}],27:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    illegal: '\\S',
    contains: [
      {
        className: 'status',
        begin: '^HTTP/[0-9\\.]+', end: '$',
        contains: [{className: 'number', begin: '\\b\\d{3}\\b'}]
      },
      {
        className: 'request',
        begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$', returnBegin: true, end: '$',
        contains: [
          {
            className: 'string',
            begin: ' ', end: ' ',
            excludeBegin: true, excludeEnd: true
          }
        ]
      },
      {
        className: 'attribute',
        begin: '^\\w', end: ': ', excludeEnd: true,
        illegal: '\\n|\\s|=',
        starts: {className: 'string', end: '$'}
      },
      {
        begin: '\\n\\n',
        starts: {subLanguage: '', endsWithParent: true}
      }
    ]
  };
};
},{}],28:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    illegal: '[^\\s]',
    contains: [
      {
        className: 'comment',
        begin: ';', end: '$'
      },
      {
        className: 'title',
        begin: '^\\[', end: '\\]'
      },
      {
        className: 'setting',
        begin: '^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*', end: '$',
        contains: [
          {
            className: 'value',
            endsWithParent: true,
            keywords: 'on off true false yes no',
            contains: [hljs.QUOTE_STRING_MODE, hljs.NUMBER_MODE]
          }
        ]
      }
    ]
  };
};
},{}],29:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'false synchronized int abstract float private char boolean static null if const ' +
      'for true while long throw strictfp finally protected import native final return void ' +
      'enum else break transient new catch instanceof byte super volatile case assert short ' +
      'package default double public try this switch continue throws',
    contains: [
      {
        className: 'javadoc',
        begin: '/\\*\\*', end: '\\*/',
        contains: [{
          className: 'javadoctag', begin: '@[A-Za-z]+'
        }],
        relevance: 10
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface',
        illegal: ':',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'annotation', begin: '@[A-Za-z]+'
      }
    ]
  };
};
},{}],30:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'in if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const',
      literal:
        'true false null undefined NaN Infinity'
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: 'regexp',
            begin: '/', end: '/[gim]*',
            illegal: '\\n',
            contains: [{begin: '\\\\/'}]
          },
          { // E4X
            begin: '<', end: '>;',
            subLanguage: 'xml'
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginWithKeyword: true, end: '{',
        keywords: 'function',
        contains: [
          {
            className: 'title', begin: '[A-Za-z$_][0-9A-Za-z$_]*'
          },
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ],
            illegal: '["\'\\(]'
          }
        ],
        illegal: '\\[|%'
      }
    ]
  };
};
},{}],31:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var LITERALS = {literal: 'true false null'};
  var TYPES = [
    hljs.QUOTE_STRING_MODE,
    hljs.C_NUMBER_MODE
  ];
  var VALUE_CONTAINER = {
    className: 'value',
    end: ',', endsWithParent: true, excludeEnd: true,
    contains: TYPES,
    keywords: LITERALS
  };
  var OBJECT = {
    begin: '{', end: '}',
    contains: [
      {
        className: 'attribute',
        begin: '\\s*"', end: '"\\s*:\\s*', excludeBegin: true, excludeEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE],
        illegal: '\\n',
        starts: VALUE_CONTAINER
      }
    ],
    illegal: '\\S'
  };
  var ARRAY = {
    begin: '\\[', end: '\\]',
    contains: [hljs.inherit(VALUE_CONTAINER, {className: null})], // inherit is also a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
    illegal: '\\S'
  };
  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
  return {
    contains: TYPES,
    keywords: LITERALS,
    illegal: '\\S'
  };
};
},{}],32:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#]*';
  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?';
  var LITERAL = {
    className: 'literal',
    begin: '\\b(t{1}|nil)\\b'
  };
  var NUMBERS = [
    {
      className: 'number', begin: LISP_SIMPLE_NUMBER_RE
    },
    {
      className: 'number', begin: '#b[0-1]+(/[0-1]+)?'
    },
    {
      className: 'number', begin: '#o[0-7]+(/[0-7]+)?'
    },
    {
      className: 'number', begin: '#x[0-9a-f]+(/[0-9a-f]+)?'
    },
    {
      className: 'number', begin: '#c\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)'
    }
  ]
  var STRING = {
    className: 'string',
    begin: '"', end: '"',
    contains: [hljs.BACKSLASH_ESCAPE],
    relevance: 0
  };
  var COMMENT = {
    className: 'comment',
    begin: ';', end: '$'
  };
  var VARIABLE = {
    className: 'variable',
    begin: '\\*', end: '\\*'
  };
  var KEYWORD = {
    className: 'keyword',
    begin: '[:&]' + LISP_IDENT_RE
  };
  var QUOTED_LIST = {
    begin: '\\(', end: '\\)',
    contains: ['self', LITERAL, STRING].concat(NUMBERS)
  };
  var QUOTED1 = {
    className: 'quoted',
    begin: '[\'`]\\(', end: '\\)',
    contains: NUMBERS.concat([STRING, VARIABLE, KEYWORD, QUOTED_LIST])
  };
  var QUOTED2 = {
    className: 'quoted',
    begin: '\\(quote ', end: '\\)',
    keywords: {title: 'quote'},
    contains: NUMBERS.concat([STRING, VARIABLE, KEYWORD, QUOTED_LIST])
  };
  var LIST = {
    className: 'list',
    begin: '\\(', end: '\\)'
  };
  var BODY = {
    className: 'body',
    endsWithParent: true, excludeEnd: true
  };
  LIST.contains = [{className: 'title', begin: LISP_IDENT_RE}, BODY];
  BODY.contains = [QUOTED1, QUOTED2, LIST, LITERAL].concat(NUMBERS).concat([STRING, COMMENT, VARIABLE, KEYWORD]);

  return {
    illegal: '[^\\s]',
    contains: NUMBERS.concat([
      LITERAL,
      STRING,
      COMMENT,
      QUOTED1, QUOTED2,
      LIST
    ])
  };
};
},{}],33:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var OPENING_LONG_BRACKET = '\\[=*\\[';
  var CLOSING_LONG_BRACKET = '\\]=*\\]';
  var LONG_BRACKETS = {
    begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
    contains: ['self']
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '--(?!' + OPENING_LONG_BRACKET + ')', end: '$'
    },
    {
      className: 'comment',
      begin: '--' + OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
      contains: [LONG_BRACKETS],
      relevance: 10
    }
  ]
  return {
    lexems: hljs.UNDERSCORE_IDENT_RE,
    keywords: {
      keyword:
        'and break do else elseif end false for if in local nil not or repeat return then ' +
        'true until while',
      built_in:
        '_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load ' +
        'loadfile loadstring module next pairs pcall print rawequal rawget rawset require ' +
        'select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug ' +
        'io math os package string table'
    },
    contains: COMMENTS.concat([
      {
        className: 'function',
        beginWithKeyword: true, end: '\\)',
        keywords: 'function',
        contains: [
          {
            className: 'title',
            begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*'
          },
          {
            className: 'params',
            begin: '\\(', endsWithParent: true,
            contains: COMMENTS
          }
        ].concat(COMMENTS)
      },
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
        contains: [LONG_BRACKETS],
        relevance: 10
      }
    ])
  };
};
},{}],34:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      // highlight headers
      {
        className: 'header',
        begin: '^#{1,3}', end: '$'
      },
      {
        className: 'header',
        begin: '^.+?\\n[=-]{2,}$'
      },
      // inline html
      {
        begin: '<', end: '>',
        subLanguage: 'xml',
        relevance: 0
      },
      // lists (indicators only)
      {
        className: 'bullet',
        begin: '^([*+-]|(\\d+\\.))\\s+'
      },
      // strong segments
      {
        className: 'strong',
        begin: '[*_]{2}.+?[*_]{2}'
      },
      // emphasis segments
      {
        className: 'emphasis',
        begin: '\\*.+?\\*'
      },
      {
        className: 'emphasis',
        begin: '_.+?_',
        relevance: 0
      },
      // blockquotes
      {
        className: 'blockquote',
        begin: '^>\\s+', end: '$'
      },
      // code snippets
      {
        className: 'code',
        begin: '`.+?`'
      },
      {
        className: 'code',
        begin: '^    ', end: '$',
        relevance: 0
      },
      // horizontal rules
      {
        className: 'horizontal_rule',
        begin: '^-{3,}', end: '$'
      },
      // using links - title and link
      {
        begin: '\\[.+?\\]\\(.+?\\)',
        returnBegin: true,
        contains: [
          {
            className: 'link_label',
            begin: '\\[.+\\]'
          },
          {
            className: 'link_url',
            begin: '\\(', end: '\\)',
            excludeBegin: true, excludeEnd: true
          }
        ]
      }
    ]
  };
};
},{}],35:[function(_dereq_,module,exports){
module.exports = function(hljs) {

  var COMMON_CONTAINS = [
    hljs.C_NUMBER_MODE,
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}],
      relevance: 0
    }
  ];

  return {
    keywords: {
      keyword:
        'break case catch classdef continue else elseif end enumerated events for function ' +
        'global if methods otherwise parfor persistent properties return spmd switch try while',
      built_in:
        'sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan ' +
        'atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot ' +
        'cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog ' +
        'realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal ' +
        'cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli ' +
        'besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma ' +
        'gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms ' +
        'nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones ' +
        'eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length ' +
        'ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril ' +
        'triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute ' +
        'shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i inf nan ' +
        'isnan isinf isfinite j why compan gallery hadamard hankel hilb invhilb magic pascal ' +
        'rosser toeplitz vander wilkinson'
    },
    illegal: '(//|"|#|/\\*|\\s+/\\w+)',
    contains: [
      {
        className: 'function',
        beginWithKeyword: true, end: '$',
        keywords: 'function',
        contains: [
          {
              className: 'title',
              begin: hljs.UNDERSCORE_IDENT_RE
          },
          {
              className: 'params',
              begin: '\\(', end: '\\)'
          },
          {
              className: 'params',
              begin: '\\[', end: '\\]'
          }
        ]
      },
      {
        className: 'transposed_variable',
        begin: '[a-zA-Z_][a-zA-Z_0-9]*(\'+[\\.\']*|[\\.\']+)', end: ''
      },
      {
        className: 'matrix',
        begin: '\\[', end: '\\]\'*[\\.\']*',
        contains: COMMON_CONTAINS
      },
      {
        className: 'cell',
        begin: '\\{', end: '\\}\'*[\\.\']*',
        contains: COMMON_CONTAINS
      },
      {
        className: 'comment',
        begin: '\\%', end: '$'
      }
    ].concat(COMMON_CONTAINS)
  };
};
},{}],36:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'int float string vector matrix if else switch case default while do for in break ' +
      'continue global proc return about abs addAttr addAttributeEditorNodeHelp addDynamic ' +
      'addNewShelfTab addPP addPanelCategory addPrefixToName advanceToNextDrivenKey ' +
      'affectedNet affects aimConstraint air alias aliasAttr align alignCtx alignCurve ' +
      'alignSurface allViewFit ambientLight angle angleBetween animCone animCurveEditor ' +
      'animDisplay animView annotate appendStringArray applicationName applyAttrPreset ' +
      'applyTake arcLenDimContext arcLengthDimension arclen arrayMapper art3dPaintCtx ' +
      'artAttrCtx artAttrPaintVertexCtx artAttrSkinPaintCtx artAttrTool artBuildPaintMenu ' +
      'artFluidAttrCtx artPuttyCtx artSelectCtx artSetPaintCtx artUserPaintCtx assignCommand ' +
      'assignInputDevice assignViewportFactories attachCurve attachDeviceAttr attachSurface ' +
      'attrColorSliderGrp attrCompatibility attrControlGrp attrEnumOptionMenu ' +
      'attrEnumOptionMenuGrp attrFieldGrp attrFieldSliderGrp attrNavigationControlGrp ' +
      'attrPresetEditWin attributeExists attributeInfo attributeMenu attributeQuery ' +
      'autoKeyframe autoPlace bakeClip bakeFluidShading bakePartialHistory bakeResults ' +
      'bakeSimulation basename basenameEx batchRender bessel bevel bevelPlus binMembership ' +
      'bindSkin blend2 blendShape blendShapeEditor blendShapePanel blendTwoAttr blindDataType ' +
      'boneLattice boundary boxDollyCtx boxZoomCtx bufferCurve buildBookmarkMenu ' +
      'buildKeyframeMenu button buttonManip CBG cacheFile cacheFileCombine cacheFileMerge ' +
      'cacheFileTrack camera cameraView canCreateManip canvas capitalizeString catch ' +
      'catchQuiet ceil changeSubdivComponentDisplayLevel changeSubdivRegion channelBox ' +
      'character characterMap characterOutlineEditor characterize chdir checkBox checkBoxGrp ' +
      'checkDefaultRenderGlobals choice circle circularFillet clamp clear clearCache clip ' +
      'clipEditor clipEditorCurrentTimeCtx clipSchedule clipSchedulerOutliner clipTrimBefore ' +
      'closeCurve closeSurface cluster cmdFileOutput cmdScrollFieldExecuter ' +
      'cmdScrollFieldReporter cmdShell coarsenSubdivSelectionList collision color ' +
      'colorAtPoint colorEditor colorIndex colorIndexSliderGrp colorSliderButtonGrp ' +
      'colorSliderGrp columnLayout commandEcho commandLine commandPort compactHairSystem ' +
      'componentEditor compositingInterop computePolysetVolume condition cone confirmDialog ' +
      'connectAttr connectControl connectDynamic connectJoint connectionInfo constrain ' +
      'constrainValue constructionHistory container containsMultibyte contextInfo control ' +
      'convertFromOldLayers convertIffToPsd convertLightmap convertSolidTx convertTessellation ' +
      'convertUnit copyArray copyFlexor copyKey copySkinWeights cos cpButton cpCache ' +
      'cpClothSet cpCollision cpConstraint cpConvClothToMesh cpForces cpGetSolverAttr cpPanel ' +
      'cpProperty cpRigidCollisionFilter cpSeam cpSetEdit cpSetSolverAttr cpSolver ' +
      'cpSolverTypes cpTool cpUpdateClothUVs createDisplayLayer createDrawCtx createEditor ' +
      'createLayeredPsdFile createMotionField createNewShelf createNode createRenderLayer ' +
      'createSubdivRegion cross crossProduct ctxAbort ctxCompletion ctxEditMode ctxTraverse ' +
      'currentCtx currentTime currentTimeCtx currentUnit currentUnit curve curveAddPtCtx ' +
      'curveCVCtx curveEPCtx curveEditorCtx curveIntersect curveMoveEPCtx curveOnSurface ' +
      'curveSketchCtx cutKey cycleCheck cylinder dagPose date defaultLightListCheckBox ' +
      'defaultNavigation defineDataServer defineVirtualDevice deformer deg_to_rad delete ' +
      'deleteAttr deleteShadingGroupsAndMaterials deleteShelfTab deleteUI deleteUnusedBrushes ' +
      'delrandstr detachCurve detachDeviceAttr detachSurface deviceEditor devicePanel dgInfo ' +
      'dgdirty dgeval dgtimer dimWhen directKeyCtx directionalLight dirmap dirname disable ' +
      'disconnectAttr disconnectJoint diskCache displacementToPoly displayAffected ' +
      'displayColor displayCull displayLevelOfDetail displayPref displayRGBColor ' +
      'displaySmoothness displayStats displayString displaySurface distanceDimContext ' +
      'distanceDimension doBlur dolly dollyCtx dopeSheetEditor dot dotProduct ' +
      'doubleProfileBirailSurface drag dragAttrContext draggerContext dropoffLocator ' +
      'duplicate duplicateCurve duplicateSurface dynCache dynControl dynExport dynExpression ' +
      'dynGlobals dynPaintEditor dynParticleCtx dynPref dynRelEdPanel dynRelEditor ' +
      'dynamicLoad editAttrLimits editDisplayLayerGlobals editDisplayLayerMembers ' +
      'editRenderLayerAdjustment editRenderLayerGlobals editRenderLayerMembers editor ' +
      'editorTemplate effector emit emitter enableDevice encodeString endString endsWith env ' +
      'equivalent equivalentTol erf error eval eval evalDeferred evalEcho event ' +
      'exactWorldBoundingBox exclusiveLightCheckBox exec executeForEachObject exists exp ' +
      'expression expressionEditorListen extendCurve extendSurface extrude fcheck fclose feof ' +
      'fflush fgetline fgetword file fileBrowserDialog fileDialog fileExtension fileInfo ' +
      'filetest filletCurve filter filterCurve filterExpand filterStudioImport ' +
      'findAllIntersections findAnimCurves findKeyframe findMenuItem findRelatedSkinCluster ' +
      'finder firstParentOf fitBspline flexor floatEq floatField floatFieldGrp floatScrollBar ' +
      'floatSlider floatSlider2 floatSliderButtonGrp floatSliderGrp floor flow fluidCacheInfo ' +
      'fluidEmitter fluidVoxelInfo flushUndo fmod fontDialog fopen formLayout format fprint ' +
      'frameLayout fread freeFormFillet frewind fromNativePath fwrite gamma gauss ' +
      'geometryConstraint getApplicationVersionAsFloat getAttr getClassification ' +
      'getDefaultBrush getFileList getFluidAttr getInputDeviceRange getMayaPanelTypes ' +
      'getModifiers getPanel getParticleAttr getPluginResource getenv getpid glRender ' +
      'glRenderEditor globalStitch gmatch goal gotoBindPose grabColor gradientControl ' +
      'gradientControlNoAttr graphDollyCtx graphSelectContext graphTrackCtx gravity grid ' +
      'gridLayout group groupObjectsByName HfAddAttractorToAS HfAssignAS HfBuildEqualMap ' +
      'HfBuildFurFiles HfBuildFurImages HfCancelAFR HfConnectASToHF HfCreateAttractor ' +
      'HfDeleteAS HfEditAS HfPerformCreateAS HfRemoveAttractorFromAS HfSelectAttached ' +
      'HfSelectAttractors HfUnAssignAS hardenPointCurve hardware hardwareRenderPanel ' +
      'headsUpDisplay headsUpMessage help helpLine hermite hide hilite hitTest hotBox hotkey ' +
      'hotkeyCheck hsv_to_rgb hudButton hudSlider hudSliderButton hwReflectionMap hwRender ' +
      'hwRenderLoad hyperGraph hyperPanel hyperShade hypot iconTextButton iconTextCheckBox ' +
      'iconTextRadioButton iconTextRadioCollection iconTextScrollList iconTextStaticLabel ' +
      'ikHandle ikHandleCtx ikHandleDisplayScale ikSolver ikSplineHandleCtx ikSystem ' +
      'ikSystemInfo ikfkDisplayMethod illustratorCurves image imfPlugins inheritTransform ' +
      'insertJoint insertJointCtx insertKeyCtx insertKnotCurve insertKnotSurface instance ' +
      'instanceable instancer intField intFieldGrp intScrollBar intSlider intSliderGrp ' +
      'interToUI internalVar intersect iprEngine isAnimCurve isConnected isDirty isParentOf ' +
      'isSameObject isTrue isValidObjectName isValidString isValidUiName isolateSelect ' +
      'itemFilter itemFilterAttr itemFilterRender itemFilterType joint jointCluster jointCtx ' +
      'jointDisplayScale jointLattice keyTangent keyframe keyframeOutliner ' +
      'keyframeRegionCurrentTimeCtx keyframeRegionDirectKeyCtx keyframeRegionDollyCtx ' +
      'keyframeRegionInsertKeyCtx keyframeRegionMoveKeyCtx keyframeRegionScaleKeyCtx ' +
      'keyframeRegionSelectKeyCtx keyframeRegionSetKeyCtx keyframeRegionTrackCtx ' +
      'keyframeStats lassoContext lattice latticeDeformKeyCtx launch launchImageEditor ' +
      'layerButton layeredShaderPort layeredTexturePort layout layoutDialog lightList ' +
      'lightListEditor lightListPanel lightlink lineIntersection linearPrecision linstep ' +
      'listAnimatable listAttr listCameras listConnections listDeviceAttachments listHistory ' +
      'listInputDeviceAxes listInputDeviceButtons listInputDevices listMenuAnnotation ' +
      'listNodeTypes listPanelCategories listRelatives listSets listTransforms ' +
      'listUnselected listerEditor loadFluid loadNewShelf loadPlugin ' +
      'loadPluginLanguageResources loadPrefObjects localizedPanelLabel lockNode loft log ' +
      'longNameOf lookThru ls lsThroughFilter lsType lsUI Mayatomr mag makeIdentity makeLive ' +
      'makePaintable makeRoll makeSingleSurface makeTubeOn makebot manipMoveContext ' +
      'manipMoveLimitsCtx manipOptions manipRotateContext manipRotateLimitsCtx ' +
      'manipScaleContext manipScaleLimitsCtx marker match max memory menu menuBarLayout ' +
      'menuEditor menuItem menuItemToShelf menuSet menuSetPref messageLine min minimizeApp ' +
      'mirrorJoint modelCurrentTimeCtx modelEditor modelPanel mouse movIn movOut move ' +
      'moveIKtoFK moveKeyCtx moveVertexAlongDirection multiProfileBirailSurface mute ' +
      'nParticle nameCommand nameField namespace namespaceInfo newPanelItems newton nodeCast ' +
      'nodeIconButton nodeOutliner nodePreset nodeType noise nonLinear normalConstraint ' +
      'normalize nurbsBoolean nurbsCopyUVSet nurbsCube nurbsEditUV nurbsPlane nurbsSelect ' +
      'nurbsSquare nurbsToPoly nurbsToPolygonsPref nurbsToSubdiv nurbsToSubdivPref ' +
      'nurbsUVSet nurbsViewDirectionVector objExists objectCenter objectLayer objectType ' +
      'objectTypeUI obsoleteProc oceanNurbsPreviewPlane offsetCurve offsetCurveOnSurface ' +
      'offsetSurface openGLExtension openMayaPref optionMenu optionMenuGrp optionVar orbit ' +
      'orbitCtx orientConstraint outlinerEditor outlinerPanel overrideModifier ' +
      'paintEffectsDisplay pairBlend palettePort paneLayout panel panelConfiguration ' +
      'panelHistory paramDimContext paramDimension paramLocator parent parentConstraint ' +
      'particle particleExists particleInstancer particleRenderInfo partition pasteKey ' +
      'pathAnimation pause pclose percent performanceOptions pfxstrokes pickWalk picture ' +
      'pixelMove planarSrf plane play playbackOptions playblast plugAttr plugNode pluginInfo ' +
      'pluginResourceUtil pointConstraint pointCurveConstraint pointLight pointMatrixMult ' +
      'pointOnCurve pointOnSurface pointPosition poleVectorConstraint polyAppend ' +
      'polyAppendFacetCtx polyAppendVertex polyAutoProjection polyAverageNormal ' +
      'polyAverageVertex polyBevel polyBlendColor polyBlindData polyBoolOp polyBridgeEdge ' +
      'polyCacheMonitor polyCheck polyChipOff polyClipboard polyCloseBorder polyCollapseEdge ' +
      'polyCollapseFacet polyColorBlindData polyColorDel polyColorPerVertex polyColorSet ' +
      'polyCompare polyCone polyCopyUV polyCrease polyCreaseCtx polyCreateFacet ' +
      'polyCreateFacetCtx polyCube polyCut polyCutCtx polyCylinder polyCylindricalProjection ' +
      'polyDelEdge polyDelFacet polyDelVertex polyDuplicateAndConnect polyDuplicateEdge ' +
      'polyEditUV polyEditUVShell polyEvaluate polyExtrudeEdge polyExtrudeFacet ' +
      'polyExtrudeVertex polyFlipEdge polyFlipUV polyForceUV polyGeoSampler polyHelix ' +
      'polyInfo polyInstallAction polyLayoutUV polyListComponentConversion polyMapCut ' +
      'polyMapDel polyMapSew polyMapSewMove polyMergeEdge polyMergeEdgeCtx polyMergeFacet ' +
      'polyMergeFacetCtx polyMergeUV polyMergeVertex polyMirrorFace polyMoveEdge ' +
      'polyMoveFacet polyMoveFacetUV polyMoveUV polyMoveVertex polyNormal polyNormalPerVertex ' +
      'polyNormalizeUV polyOptUvs polyOptions polyOutput polyPipe polyPlanarProjection ' +
      'polyPlane polyPlatonicSolid polyPoke polyPrimitive polyPrism polyProjection ' +
      'polyPyramid polyQuad polyQueryBlindData polyReduce polySelect polySelectConstraint ' +
      'polySelectConstraintMonitor polySelectCtx polySelectEditCtx polySeparate ' +
      'polySetToFaceNormal polySewEdge polyShortestPathCtx polySmooth polySoftEdge ' +
      'polySphere polySphericalProjection polySplit polySplitCtx polySplitEdge polySplitRing ' +
      'polySplitVertex polyStraightenUVBorder polySubdivideEdge polySubdivideFacet ' +
      'polyToSubdiv polyTorus polyTransfer polyTriangulate polyUVSet polyUnite polyWedgeFace ' +
      'popen popupMenu pose pow preloadRefEd print progressBar progressWindow projFileViewer ' +
      'projectCurve projectTangent projectionContext projectionManip promptDialog propModCtx ' +
      'propMove psdChannelOutliner psdEditTextureFile psdExport psdTextureFile putenv pwd ' +
      'python querySubdiv quit rad_to_deg radial radioButton radioButtonGrp radioCollection ' +
      'radioMenuItemCollection rampColorPort rand randomizeFollicles randstate rangeControl ' +
      'readTake rebuildCurve rebuildSurface recordAttr recordDevice redo reference ' +
      'referenceEdit referenceQuery refineSubdivSelectionList refresh refreshAE ' +
      'registerPluginResource rehash reloadImage removeJoint removeMultiInstance ' +
      'removePanelCategory rename renameAttr renameSelectionList renameUI render ' +
      'renderGlobalsNode renderInfo renderLayerButton renderLayerParent ' +
      'renderLayerPostProcess renderLayerUnparent renderManip renderPartition ' +
      'renderQualityNode renderSettings renderThumbnailUpdate renderWindowEditor ' +
      'renderWindowSelectContext renderer reorder reorderDeformers requires reroot ' +
      'resampleFluid resetAE resetPfxToPolyCamera resetTool resolutionNode retarget ' +
      'reverseCurve reverseSurface revolve rgb_to_hsv rigidBody rigidSolver roll rollCtx ' +
      'rootOf rot rotate rotationInterpolation roundConstantRadius rowColumnLayout rowLayout ' +
      'runTimeCommand runup sampleImage saveAllShelves saveAttrPreset saveFluid saveImage ' +
      'saveInitialState saveMenu savePrefObjects savePrefs saveShelf saveToolSettings scale ' +
      'scaleBrushBrightness scaleComponents scaleConstraint scaleKey scaleKeyCtx sceneEditor ' +
      'sceneUIReplacement scmh scriptCtx scriptEditorInfo scriptJob scriptNode scriptTable ' +
      'scriptToShelf scriptedPanel scriptedPanelType scrollField scrollLayout sculpt ' +
      'searchPathArray seed selLoadSettings select selectContext selectCurveCV selectKey ' +
      'selectKeyCtx selectKeyframeRegionCtx selectMode selectPref selectPriority selectType ' +
      'selectedNodes selectionConnection separator setAttr setAttrEnumResource ' +
      'setAttrMapping setAttrNiceNameResource setConstraintRestPosition ' +
      'setDefaultShadingGroup setDrivenKeyframe setDynamic setEditCtx setEditor setFluidAttr ' +
      'setFocus setInfinity setInputDeviceMapping setKeyCtx setKeyPath setKeyframe ' +
      'setKeyframeBlendshapeTargetWts setMenuMode setNodeNiceNameResource setNodeTypeFlag ' +
      'setParent setParticleAttr setPfxToPolyCamera setPluginResource setProject ' +
      'setStampDensity setStartupMessage setState setToolTo setUITemplate setXformManip sets ' +
      'shadingConnection shadingGeometryRelCtx shadingLightRelCtx shadingNetworkCompare ' +
      'shadingNode shapeCompare shelfButton shelfLayout shelfTabLayout shellField ' +
      'shortNameOf showHelp showHidden showManipCtx showSelectionInTitle ' +
      'showShadingGroupAttrEditor showWindow sign simplify sin singleProfileBirailSurface ' +
      'size sizeBytes skinCluster skinPercent smoothCurve smoothTangentSurface smoothstep ' +
      'snap2to2 snapKey snapMode snapTogetherCtx snapshot soft softMod softModCtx sort sound ' +
      'soundControl source spaceLocator sphere sphrand spotLight spotLightPreviewPort ' +
      'spreadSheetEditor spring sqrt squareSurface srtContext stackTrace startString ' +
      'startsWith stitchAndExplodeShell stitchSurface stitchSurfacePoints strcmp ' +
      'stringArrayCatenate stringArrayContains stringArrayCount stringArrayInsertAtIndex ' +
      'stringArrayIntersector stringArrayRemove stringArrayRemoveAtIndex ' +
      'stringArrayRemoveDuplicates stringArrayRemoveExact stringArrayToString ' +
      'stringToStringArray strip stripPrefixFromName stroke subdAutoProjection ' +
      'subdCleanTopology subdCollapse subdDuplicateAndConnect subdEditUV ' +
      'subdListComponentConversion subdMapCut subdMapSewMove subdMatchTopology subdMirror ' +
      'subdToBlind subdToPoly subdTransferUVsToCache subdiv subdivCrease ' +
      'subdivDisplaySmoothness substitute substituteAllString substituteGeometry substring ' +
      'surface surfaceSampler surfaceShaderList swatchDisplayPort switchTable symbolButton ' +
      'symbolCheckBox sysFile system tabLayout tan tangentConstraint texLatticeDeformContext ' +
      'texManipContext texMoveContext texMoveUVShellContext texRotateContext texScaleContext ' +
      'texSelectContext texSelectShortestPathCtx texSmudgeUVContext texWinToolCtx text ' +
      'textCurves textField textFieldButtonGrp textFieldGrp textManip textScrollList ' +
      'textToShelf textureDisplacePlane textureHairColor texturePlacementContext ' +
      'textureWindow threadCount threePointArcCtx timeControl timePort timerX toNativePath ' +
      'toggle toggleAxis toggleWindowVisibility tokenize tokenizeList tolerance tolower ' +
      'toolButton toolCollection toolDropped toolHasOptions toolPropertyWindow torus toupper ' +
      'trace track trackCtx transferAttributes transformCompare transformLimits translator ' +
      'trim trunc truncateFluidCache truncateHairCache tumble tumbleCtx turbulence ' +
      'twoPointArcCtx uiRes uiTemplate unassignInputDevice undo undoInfo ungroup uniform unit ' +
      'unloadPlugin untangleUV untitledFileName untrim upAxis updateAE userCtx uvLink ' +
      'uvSnapshot validateShelfName vectorize view2dToolCtx viewCamera viewClipPlane ' +
      'viewFit viewHeadOn viewLookAt viewManip viewPlace viewSet visor volumeAxis vortex ' +
      'waitCursor warning webBrowser webBrowserPrefs whatIs window windowPref wire ' +
      'wireContext workspace wrinkle wrinkleContext writeTake xbmLangPathList xform',
    illegal: '</',
    contains: [
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '`', end: '`',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'variable',
        begin: '\\$\\d',
        relevance: 5
      },
      {
        className: 'variable',
        begin: '[\\$\\%\\@\\*](\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)'
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ]
  };
};
},{}],37:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var VARS = [
    {
      className: 'variable', begin: '\\$\\d+'
    },
    {
      className: 'variable', begin: '\\${', end: '}'
    },
    {
      className: 'variable', begin: '[\\$\\@]' + hljs.UNDERSCORE_IDENT_RE
    }
  ];
  var DEFAULT = {
    endsWithParent: true,
    lexems: '[a-z/_]+',
    keywords: {
      built_in:
        'on off yes no true false none blocked debug info notice warn error crit ' +
        'select break last permanent redirect kqueue rtsig epoll poll /dev/poll'
    },
    relevance: 0,
    illegal: '=>',
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'string',
        begin: '"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS),
        relevance: 0
      },
      {
        className: 'string',
        begin: "'", end: "'",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS),
        relevance: 0
      },
      {
        className: 'url',
        begin: '([a-z]+):/', end: '\\s', endsWithParent: true, excludeEnd: true
      },
      {
        className: 'regexp',
        begin: "\\s\\^", end: "\\s|{|;", returnEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // regexp locations (~, ~*)
      {
        className: 'regexp',
        begin: "~\\*?\\s+", end: "\\s|{|;", returnEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // *.example.com
      {
        className: 'regexp',
        begin: "\\*(\\.[a-z\\-]+)+",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // sub.example.*
      {
        className: 'regexp',
        begin: "([a-z\\-]+\\.)+\\*",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // IP
      {
        className: 'number',
        begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
      },
      // units
      {
        className: 'number',
        begin: '\\b\\d+[kKmMgGdshdwy]*\\b',
        relevance: 0
      }
    ].concat(VARS)
  };

  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        begin: hljs.UNDERSCORE_IDENT_RE + '\\s', end: ';|{', returnBegin: true,
        contains: [
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE,
            starts: DEFAULT
          }
        ]
      }
    ],
    illegal: '[^\\s\\}]'
  };
};
},{}],38:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var OBJC_KEYWORDS = {
    keyword:
      'int float while private char catch export sizeof typedef const struct for union ' +
      'unsigned long volatile static protected bool mutable if public do return goto void ' +
      'enum else break extern class asm case short default double throw register explicit ' +
      'signed typename try this switch continue wchar_t inline readonly assign property ' +
      'protocol self synchronized end synthesize id optional required implementation ' +
      'nonatomic interface super unichar finally dynamic IBOutlet IBAction selector strong ' +
      'weak readonly',
    literal:
    	'false true FALSE TRUE nil YES NO NULL',
    built_in:
      'NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView ' +
      'UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread ' +
      'UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool ' +
      'UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray ' +
      'NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController ' +
      'UINavigationBar UINavigationController UITabBarController UIPopoverController ' +
      'UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController ' +
      'NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor ' +
      'UIFont UIApplication NSNotFound NSNotificationCenter NSNotification ' +
      'UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar ' +
      'NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection class ' +
      'UIInterfaceOrientation MPMoviePlayerController dispatch_once_t ' +
      'dispatch_queue_t dispatch_sync dispatch_async dispatch_once'
  };
  return {
    keywords: OBJC_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'',
        end: '[^\\\\]\'',
        illegal: '[^\\\\][^\']'
      },

      {
        className: 'preprocessor',
        begin: '#import',
        end: '$',
        contains: [
        {
          className: 'title',
          begin: '\"',
          end: '\"'
        },
        {
          className: 'title',
          begin: '<',
          end: '>'
        }
        ]
      },
      {
        className: 'preprocessor',
        begin: '#',
        end: '$'
      },
      {
        className: 'class',
        beginWithKeyword: true,
        end: '({|$)',
        keywords: 'interface class protocol implementation',
        contains: [{
          className: 'id',
          begin: hljs.UNDERSCORE_IDENT_RE
        }
        ]
      },
      {
        className: 'variable',
        begin: '\\.'+hljs.UNDERSCORE_IDENT_RE
      }
    ]
  };
};
},{}],39:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    subLanguage: 'xml',
    contains: [
      {
        className: 'comment',
        begin: '^#', end: '$'
      },
      {
        className: 'comment',
        begin: '\\^rem{', end: '}',
        relevance: 10,
        contains: [
          {
            begin: '{', end: '}',
            contains: ['self']
          }
        ]
      },
      {
        className: 'preprocessor',
        begin: '^@(?:BASE|USE|CLASS|OPTIONS)$',
        relevance: 10
      },
      {
        className: 'title',
        begin: '@[\\w\\-]+\\[[\\w^;\\-]*\\](?:\\[[\\w^;\\-]*\\])?(?:.*)$'
      },
      {
        className: 'variable',
        begin: '\\$\\{?[\\w\\-\\.\\:]+\\}?'
      },
      {
        className: 'keyword',
        begin: '\\^[\\w\\-\\.\\:]+'
      },
      {
        className: 'number',
        begin: '\\^#[0-9a-fA-F]+'
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],40:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var PERL_KEYWORDS = 'getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ' +
    'ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime ' +
    'readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq' +
    'fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent ' +
    'shutdown dump chomp connect getsockname die socketpair close flock exists index shmget' +
    'sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr ' +
    'unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 ' +
    'getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline ' +
    'endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand ' +
    'mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink ' +
    'getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr ' +
    'untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link ' +
    'getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller ' +
    'lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and ' +
    'sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 ' +
    'chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach ' +
    'tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir' +
    'ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe ' +
    'atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when';
  var SUBST = {
    className: 'subst',
    begin: '[$@]\\{', end: '\\}',
    keywords: PERL_KEYWORDS,
    relevance: 10
  };
  var VAR1 = {
    className: 'variable',
    begin: '\\$\\d'
  };
  var VAR2 = {
    className: 'variable',
    begin: '[\\$\\%\\@\\*](\\^\\w\\b|#\\w+(\\:\\:\\w+)*|[^\\s\\w{]|{\\w+}|\\w+(\\:\\:\\w*)*)'
  };
  var STRING_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST, VAR1, VAR2];
  var METHOD = {
    begin: '->',
    contains: [
      {begin: hljs.IDENT_RE},
      {begin: '{', end: '}'}
    ]
  };
  var COMMENT = {
    className: 'comment',
    begin: '^(__END__|__DATA__)', end: '\\n$',
    relevance: 5
  }
  var PERL_DEFAULT_CONTAINS = [
    VAR1, VAR2,
    hljs.HASH_COMMENT_MODE,
    COMMENT,
    {
      className: 'comment',
      begin: '^\\=\\w', end: '\\=cut', endsWithParent: true
    },
    METHOD,
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\(', end: '\\)',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\[', end: '\\]',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\{', end: '\\}',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\|', end: '\\|',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\<', end: '\\>',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'qw\\s+q', end: 'q',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      contains: STRING_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '`', end: '`',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: '{\\w+}',
      relevance: 0
    },
    {
      className: 'string',
      begin: '\-?\\w+\\s*\\=\\>',
      relevance: 0
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    { // regexp container
      begin: '(' + hljs.RE_STARTERS_RE + '|\\b(split|return|print|reverse|grep)\\b)\\s*',
      keywords: 'split return print reverse grep',
      relevance: 0,
      contains: [
        hljs.HASH_COMMENT_MODE,
        COMMENT,
        {
          className: 'regexp',
          begin: '(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*',
          relevance: 10
        },
        {
          className: 'regexp',
          begin: '(m|qr)?/', end: '/[a-z]*',
          contains: [hljs.BACKSLASH_ESCAPE],
          relevance: 0 // allows empty "//" which is a common comment delimiter in other languages
        }
      ]
    },
    {
      className: 'sub',
      beginWithKeyword: true, end: '(\\s*\\(.*?\\))?[;{]',
      keywords: 'sub',
      relevance: 5
    },
    {
      className: 'operator',
      begin: '-\\w\\b',
      relevance: 0
    }
  ];
  SUBST.contains = PERL_DEFAULT_CONTAINS;
  METHOD.contains[1].contains = PERL_DEFAULT_CONTAINS;

  return {
    keywords: PERL_KEYWORDS,
    contains: PERL_DEFAULT_CONTAINS
  };
};
},{}],41:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var VARIABLE = {
    className: 'variable', begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
  };
  var STRINGS = [
    hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
    hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
    {
      className: 'string',
      begin: 'b"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: 'b\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ];
  var NUMBERS = [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE];
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  return {
    case_insensitive: true,
    keywords:
      'and include_once list abstract global private echo interface as static endswitch ' +
      'array null if endwhile or const for endforeach self var while isset public ' +
      'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
      'return implements parent clone use __CLASS__ __LINE__ else break print eval new ' +
      'catch __METHOD__ case exception php_user_filter default die require __FUNCTION__ ' +
      'enddeclare final try this switch continue endfor endif declare unset true false ' +
      'namespace trait goto instanceof insteadof __DIR__ __NAMESPACE__ __halt_compiler',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.HASH_COMMENT_MODE,
      {
        className: 'comment',
        begin: '/\\*', end: '\\*/',
        contains: [{
            className: 'phpdoc',
            begin: '\\s@[A-Za-z]+'
        }]
      },
      {
          className: 'comment',
          excludeBegin: true,
          begin: '__halt_compiler.+?;', endsWithParent: true
      },
      {
        className: 'string',
        begin: '<<<[\'"]?\\w+[\'"]?$', end: '^\\w+;',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'preprocessor',
        begin: '<\\?php',
        relevance: 10
      },
      {
        className: 'preprocessor',
        begin: '\\?>'
      },
      VARIABLE,
      {
        className: 'function',
        beginWithKeyword: true, end: '{',
        keywords: 'function',
        illegal: '\\$|\\[|%',
        contains: [
          TITLE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              'self',
              VARIABLE,
              hljs.C_BLOCK_COMMENT_MODE
            ].concat(STRINGS).concat(NUMBERS)
          }
        ]
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class',
        illegal: '[:\\(\\$]',
        contains: [
          {
            beginWithKeyword: true, endsWithParent: true,
            keywords: 'extends',
            contains: [TITLE]
          },
          TITLE
        ]
      },
      {
        begin: '=>' // No markup, just a relevance booster
      }
    ].concat(STRINGS).concat(NUMBERS)
  };
};
},{}],42:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      hljs.C_NUMBER_MODE,
      {
        className: 'builtin',
        begin: '{', end: '}$',
        excludeBegin: true, excludeEnd: true,
        contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE],
        relevance: 0
      },
      {
        className: 'filename',
        begin: '[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}', end: ':',
        excludeEnd: true
      },
      {
        className: 'header',
        begin: '(ncalls|tottime|cumtime)', end: '$',
        keywords: 'ncalls tottime|10 cumtime|10 filename',
        relevance: 10
      },
      {
        className: 'summary',
        begin: 'function calls', end: '$',
        contains: [hljs.C_NUMBER_MODE],
        relevance: 10
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'function',
        begin: '\\(', end: '\\)$',
        contains: [{
          className: 'title',
          begin: hljs.UNDERSCORE_IDENT_RE,
          relevance: 0
        }],
        relevance: 0
      }
    ]
  };
};
},{}],43:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var PROMPT = {
    className: 'prompt',  begin: '^(>>>|\\.\\.\\.) '
  }
  var STRINGS = [
    {
      className: 'string',
      begin: '(u|b)?r?\'\'\'', end: '\'\'\'',
      contains: [PROMPT],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|b)?r?"""', end: '"""',
      contains: [PROMPT],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|r|ur)\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|r|ur)"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(b|br)\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: '(b|br)"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ].concat([
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ]);
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: ['self', hljs.C_NUMBER_MODE, PROMPT].concat(STRINGS)
  };
  var FUNC_CLASS_PROTO = {
    beginWithKeyword: true, end: ':',
    illegal: '[${=;\\n]',
    contains: [TITLE, PARAMS],
    relevance: 10
  };

  return {
    keywords: {
      keyword:
        'and elif is global as in if from raise for except finally print import pass return ' +
        'exec else break not with class assert yield try while continue del or def lambda ' +
        'nonlocal|10',
      built_in:
        'None True False Ellipsis NotImplemented'
    },
    illegal: '(</|->|\\?)',
    contains: STRINGS.concat([
      PROMPT,
      hljs.HASH_COMMENT_MODE,
      hljs.inherit(FUNC_CLASS_PROTO, {className: 'function', keywords: 'def'}),
      hljs.inherit(FUNC_CLASS_PROTO, {className: 'class', keywords: 'class'}),
      hljs.C_NUMBER_MODE,
      {
        className: 'decorator',
        begin: '@', end: '$'
      },
      {
        begin: '\\b(print|exec)\\(' // don’t highlight keywords-turned-functions in Python 3
      }
    ])
  };
};
},{}],44:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var IDENT_RE = '([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*';

  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        begin: IDENT_RE,
        lexems: IDENT_RE,
        keywords: {
          keyword:
            'function if in break next repeat else for return switch while try tryCatch|10 ' +
            'stop warning require library attach detach source setMethod setGeneric ' +
            'setGroupGeneric setClass ...|10',
          literal:
            'NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 ' +
            'NA_complex_|10'
        },
        relevance: 0
      },
      {
        // hex value
        className: 'number',
        begin: "0[xX][0-9a-fA-F]+[Li]?\\b",
        relevance: 0
      },
      {
        // explicit integer
        className: 'number',
        begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b",
        relevance: 0
      },
      {
        // number with trailing decimal
        className: 'number',
        begin: "\\d+\\.(?!\\d)(?:i\\b)?",
        relevance: 0
      },
      {
        // number
        className: 'number',
        begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b",
        relevance: 0
      },
      {
        // number with leading decimal
        className: 'number',
        begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b",
        relevance: 0
      },

      {
        // escaped identifier
        begin: '`',
        end: '`',
        relevance: 0
      },

      {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      },
      {
        className: 'string',
        begin: "'",
        end: "'",
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      }
    ]
  };
};
},{}],45:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'ArchiveRecord AreaLightSource Atmosphere Attribute AttributeBegin AttributeEnd Basis ' +
      'Begin Blobby Bound Clipping ClippingPlane Color ColorSamples ConcatTransform Cone ' +
      'CoordinateSystem CoordSysTransform CropWindow Curves Cylinder DepthOfField Detail ' +
      'DetailRange Disk Displacement Display End ErrorHandler Exposure Exterior Format ' +
      'FrameAspectRatio FrameBegin FrameEnd GeneralPolygon GeometricApproximation Geometry ' +
      'Hider Hyperboloid Identity Illuminate Imager Interior LightSource ' +
      'MakeCubeFaceEnvironment MakeLatLongEnvironment MakeShadow MakeTexture Matte ' +
      'MotionBegin MotionEnd NuPatch ObjectBegin ObjectEnd ObjectInstance Opacity Option ' +
      'Orientation Paraboloid Patch PatchMesh Perspective PixelFilter PixelSamples ' +
      'PixelVariance Points PointsGeneralPolygons PointsPolygons Polygon Procedural Projection ' +
      'Quantize ReadArchive RelativeDetail ReverseOrientation Rotate Scale ScreenWindow ' +
      'ShadingInterpolation ShadingRate Shutter Sides Skew SolidBegin SolidEnd Sphere ' +
      'SubdivisionMesh Surface TextureCoordinates Torus Transform TransformBegin TransformEnd ' +
      'TransformPoints Translate TrimCurve WorldBegin WorldEnd',
    illegal: '</',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };
};
},{}],46:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'float color point normal vector matrix while for if do return else break extern continue',
      built_in:
        'abs acos ambient area asin atan atmosphere attribute calculatenormal ceil cellnoise ' +
        'clamp comp concat cos degrees depth Deriv diffuse distance Du Dv environment exp ' +
        'faceforward filterstep floor format fresnel incident length lightsource log match ' +
        'max min mod noise normalize ntransform opposite option phong pnoise pow printf ' +
        'ptlined radians random reflect refract renderinfo round setcomp setxcomp setycomp ' +
        'setzcomp shadow sign sin smoothstep specular specularbrdf spline sqrt step tan ' +
        'texture textureinfo trace transform vtransform xcomp ycomp zcomp'
    },
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'shader',
        beginWithKeyword: true, end: '\\(',
        keywords: 'surface displacement light volume imager'
      },
      {
        className: 'shading',
        beginWithKeyword: true, end: '\\(',
        keywords: 'illuminate illuminance gather'
      }
    ]
  };
};
},{}],47:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var RUBY_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?';
  var RUBY_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
  var RUBY_KEYWORDS = {
    keyword:
      'and false then defined module in return redo if BEGIN retry end for true self when ' +
      'next until do begin unless END rescue nil else break undef not super class case ' +
      'require yield alias while ensure elsif or include'
  };
  var YARDOCTAG = {
    className: 'yardoctag',
    begin: '@[A-Za-z]+'
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '#', end: '$',
      contains: [YARDOCTAG]
    },
    {
      className: 'comment',
      begin: '^\\=begin', end: '^\\=end',
      contains: [YARDOCTAG],
      relevance: 10
    },
    {
      className: 'comment',
      begin: '^__END__', end: '\\n$'
    }
  ];
  var SUBST = {
    className: 'subst',
    begin: '#\\{', end: '}',
    lexems: RUBY_IDENT_RE,
    keywords: RUBY_KEYWORDS
  };
  var STR_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST];
  var STRINGS = [
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '%[qw]?\\(', end: '\\)',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?\\[', end: '\\]',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?{', end: '}',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?<', end: '>',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?/', end: '/',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?%', end: '%',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?-', end: '-',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?\\|', end: '\\|',
      contains: STR_CONTAINS,
      relevance: 10
    }
  ];
  var FUNCTION = {
    className: 'function',
    beginWithKeyword: true, end: ' |$|;',
    keywords: 'def',
    contains: [
      {
        className: 'title',
        begin: RUBY_METHOD_RE,
        lexems: RUBY_IDENT_RE,
        keywords: RUBY_KEYWORDS
      },
      {
        className: 'params',
        begin: '\\(', end: '\\)',
        lexems: RUBY_IDENT_RE,
        keywords: RUBY_KEYWORDS
      }
    ].concat(COMMENTS)
  };

  var RUBY_DEFAULT_CONTAINS = COMMENTS.concat(STRINGS.concat([
    {
      className: 'class',
      beginWithKeyword: true, end: '$|;',
      keywords: 'class module',
      contains: [
        {
          className: 'title',
          begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?',
          relevance: 0
        },
        {
          className: 'inheritance',
          begin: '<\\s*',
          contains: [{
            className: 'parent',
            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
          }]
        }
      ].concat(COMMENTS)
    },
    FUNCTION,
    {
      className: 'constant',
      begin: '(::)?(\\b[A-Z]\\w*(::)?)+',
      relevance: 0
    },
    {
      className: 'symbol',
      begin: ':',
      contains: STRINGS.concat([{begin: RUBY_METHOD_RE}]),
      relevance: 0
    },
    {
      className: 'symbol',
      begin: RUBY_IDENT_RE + ':',
      relevance: 0
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    {
      className: 'number',
      begin: '\\?\\w'
    },
    {
      className: 'variable',
      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))'
    },
    { // regexp container
      begin: '(' + hljs.RE_STARTERS_RE + ')\\s*',
      contains: COMMENTS.concat([
        {
          className: 'regexp',
          begin: '/', end: '/[a-z]*',
          illegal: '\\n',
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        }
      ]),
      relevance: 0
    }
  ]));
  SUBST.contains = RUBY_DEFAULT_CONTAINS;
  FUNCTION.contains[1].contains = RUBY_DEFAULT_CONTAINS;

  return {
    lexems: RUBY_IDENT_RE,
    keywords: RUBY_KEYWORDS,
    contains: RUBY_DEFAULT_CONTAINS
  };
};
},{}],48:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var TITLE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE
  };
  var NUMBER = {
    className: 'number',
    begin: '\\b(0[xb][A-Za-z0-9_]+|[0-9_]+(\\.[0-9_]+)?([uif](8|16|32|64)?)?)',
    relevance: 0
  };
  var KEYWORDS =
    'alt any as assert be bind block bool break char check claim const cont dir do else enum ' +
    'export f32 f64 fail false float fn for i16 i32 i64 i8 if iface impl import in int let ' +
    'log mod mutable native note of prove pure resource ret self str syntax true type u16 u32 ' +
    'u64 u8 uint unchecked unsafe use vec while';
  return {
    keywords: KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
      hljs.APOS_STRING_MODE,
      NUMBER,
      {
        className: 'function',
        beginWithKeyword: true, end: '(\\(|<)',
        keywords: 'fn',
        contains: [TITLE]
      },
      {
        className: 'preprocessor',
        begin: '#\\[', end: '\\]'
      },
      {
        beginWithKeyword: true, end: '(=|<)',
        keywords: 'type',
        contains: [TITLE],
        illegal: '\\S'
      },
      {
        beginWithKeyword: true, end: '({|<)',
        keywords: 'iface enum',
        contains: [TITLE],
        illegal: '\\S'
      }
    ]
  };
};
},{}],49:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var ANNOTATION = {
    className: 'annotation', begin: '@[A-Za-z]+'
  };
  var STRING = {
    className: 'string',
    begin: 'u?r?"""', end: '"""',
    relevance: 10
  };
  return {
    keywords:
      'type yield lazy override def with val var false true sealed abstract private trait ' +
      'object null if for while throw finally protected extends import final return else ' +
      'break new catch super class case package default try this match continue throws',
    contains: [
      {
        className: 'javadoc',
        begin: '/\\*\\*', end: '\\*/',
        contains: [{
          className: 'javadoctag',
          begin: '@[A-Za-z]+'
        }],
        relevance: 10
      },
      hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, STRING,
      {
        className: 'class',
        begin: '((case )?class |object |trait )', end: '({|$)', // beginWithKeyword won't work because a single "case" shouldn't start this mode
        illegal: ':',
        keywords: 'case class trait object',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends with',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          },
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, STRING,
              ANNOTATION
            ]
          }
        ]
      },
      hljs.C_NUMBER_MODE,
      ANNOTATION
    ]
  };
};
},{}],50:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var VAR_IDENT_RE = '[a-z][a-zA-Z0-9_]*';
  var CHAR = {
    className: 'char',
    begin: '\\$.{1}'
  };
  var SYMBOL = {
    className: 'symbol',
    begin: '#' + hljs.UNDERSCORE_IDENT_RE
  };
  return {
    keywords: 'self super nil true false thisContext', // only 6
    contains: [
      {
        className: 'comment',
        begin: '"', end: '"',
        relevance: 0
      },
      hljs.APOS_STRING_MODE,
      {
        className: 'class',
        begin: '\\b[A-Z][A-Za-z0-9_]*',
        relevance: 0
      },
      {
        className: 'method',
        begin: VAR_IDENT_RE + ':'
      },
      hljs.C_NUMBER_MODE,
      SYMBOL,
      CHAR,
      {
        className: 'localvars',
        begin: '\\|\\s*((' + VAR_IDENT_RE + ')\\s*)+\\|'
      },
      {
        className: 'array',
        begin: '\\#\\(', end: '\\)',
        contains: [
          hljs.APOS_STRING_MODE,
          CHAR,
          hljs.C_NUMBER_MODE,
          SYMBOL
        ]
      }
    ]
  };
};
},{}],51:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    contains: [
      {
        className: 'operator',
        begin: '(begin|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant)\\b(?!:)', // negative look-ahead here is specifically to prevent stomping on SmallTalk
        end: ';', endsWithParent: true,
        keywords: {
          keyword: 'all partial global month current_timestamp using go revoke smallint ' +
            'indicator end-exec disconnect zone with character assertion to add current_user ' +
            'usage input local alter match collate real then rollback get read timestamp ' +
            'session_user not integer bit unique day minute desc insert execute like ilike|2 ' +
            'level decimal drop continue isolation found where constraints domain right ' +
            'national some module transaction relative second connect escape close system_user ' +
            'for deferred section cast current sqlstate allocate intersect deallocate numeric ' +
            'public preserve full goto initially asc no key output collation group by union ' +
            'session both last language constraint column of space foreign deferrable prior ' +
            'connection unknown action commit view or first into float year primary cascaded ' +
            'except restrict set references names table outer open select size are rows from ' +
            'prepare distinct leading create only next inner authorization schema ' +
            'corresponding option declare precision immediate else timezone_minute external ' +
            'varying translation true case exception join hour default double scroll value ' +
            'cursor descriptor values dec fetch procedure delete and false int is describe ' +
            'char as at in varchar null trailing any absolute current_time end grant ' +
            'privileges when cross check write current_date pad begin temporary exec time ' +
            'update catalog user sql date on identity timezone_hour natural whenever interval ' +
            'work order cascade diagnostics nchar having left call do handler load replace ' +
            'truncate start lock show pragma exists number',
          aggregate: 'count sum min max avg'
        },
        contains: [
          {
            className: 'string',
            begin: '\'', end: '\'',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}],
            relevance: 0
          },
          {
            className: 'string',
            begin: '"', end: '"',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '""'}],
            relevance: 0
          },
          {
            className: 'string',
            begin: '`', end: '`',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          hljs.C_NUMBER_MODE
        ]
      },
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'comment',
        begin: '--', end: '$'
      }
    ]
  };
};
},{}],52:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var COMMAND1 = {
    className: 'command',
    begin: '\\\\[a-zA-Zа-яА-я]+[\\*]?'
  };
  var COMMAND2 = {
    className: 'command',
    begin: '\\\\[^a-zA-Zа-яА-я0-9]'
  };
  var SPECIAL = {
    className: 'special',
    begin: '[{}\\[\\]\\&#~]',
    relevance: 0
  };

  return {
    contains: [
      { // parameter
        begin: '\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
        returnBegin: true,
        contains: [
          COMMAND1, COMMAND2,
          {
            className: 'number',
            begin: ' *=', end: '-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
            excludeBegin: true
          }
        ],
        relevance: 10
      },
      COMMAND1, COMMAND2,
      SPECIAL,
      {
        className: 'formula',
        begin: '\\$\\$', end: '\\$\\$',
        contains: [COMMAND1, COMMAND2, SPECIAL],
        relevance: 0
      },
      {
        className: 'formula',
        begin: '\\$', end: '\\$',
        contains: [COMMAND1, COMMAND2, SPECIAL],
        relevance: 0
      },
      {
        className: 'comment',
        begin: '%', end: '$',
        relevance: 0
      }
    ]
  };
};
},{}],53:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        // Value types
        'char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 ' +
        'uint16 uint32 uint64 float double bool struct enum string void ' +
        // Reference types
        'weak unowned owned ' +
        // Modifiers
        'async signal static abstract interface override ' +
        // Control Structures
        'while do for foreach else switch case break default return try catch ' +
        // Visibility
        'public private protected internal ' +
        // Other
        'using new this get set const stdout stdin stderr var',
      built_in:
        'DBus GLib CCode Gee Object',
      literal:
        'false true null'
    },
    contains: [
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface delegate namespace',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements'
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'string',
        begin: '"""', end: '"""',
        relevance: 5
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '^#', end: '$',
        relevance: 2
      },
      {
        className: 'constant',
        begin: ' [A-Z_]+ ',
        relevance: 0
      }
    ]
  };
};
},{}],54:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        'call class const dim do loop erase execute executeglobal exit for each next function ' +
        'if then else on error option explicit new private property let get public randomize ' +
        'redim rem select case set stop sub while wend with end to elseif is or xor and not ' +
        'class_initialize class_terminate default preserve in me byval byref step resume goto',
      built_in:
        'lcase month vartype instrrev ubound setlocale getobject rgb getref string ' +
        'weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency ' +
        'conversions csng timevalue second year space abs clng timeserial fixs len asc ' +
        'isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate ' +
        'instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex ' +
        'chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim ' +
        'strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion ' +
        'scriptengine split scriptengineminorversion cint sin datepart ltrim sqr ' +
        'scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw ' +
        'chrw regexp server response request cstr err',
      literal:
        'true false null nothing empty'
    },
    illegal: '//',
    contains: [
      hljs.inherit(hljs.QUOTE_STRING_MODE, {contains: [{begin: '""'}]}),
      {
        className: 'comment',
        begin: '\'', end: '$'
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],55:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        'abs access after alias all and architecture array assert attribute begin block ' +
        'body buffer bus case component configuration constant context cover disconnect ' +
        'downto default else elsif end entity exit fairness file for force function generate ' +
        'generic group guarded if impure in inertial inout is label library linkage literal ' +
        'loop map mod nand new next nor not null of on open or others out package port ' +
        'postponed procedure process property protected pure range record register reject ' +
        'release rem report restrict restrict_guarantee return rol ror select sequence ' +
        'severity shared signal sla sll sra srl strong subtype then to transport type ' +
        'unaffected units until use variable vmode vprop vunit wait when while with xnor xor',
      typename:
        'boolean bit character severity_level integer time delay_length natural positive ' +
        'string bit_vector file_open_kind file_open_status std_ulogic std_ulogic_vector ' +
        'std_logic std_logic_vector unsigned signed boolean_vector integer_vector ' +
        'real_vector time_vector'
    },
    illegal: '{',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,        // VHDL-2008 block commenting.
      {
        className: 'comment',
        begin: '--', end: '$'
      },
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'literal',
        begin: '\'(U|X|0|1|Z|W|L|H|-)\'',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'attribute',
        begin: '\'[A-Za-z](_?[A-Za-z0-9])*',
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  }; // return
};
},{}],56:[function(_dereq_,module,exports){
module.exports = function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    contains: [
      {
        className: 'attribute',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: '="', returnBegin: true, end: '"',
        contains: [{
            className: 'value',
            begin: '"', endsWithParent: true
        }]
      },
      {
        begin: '=\'', returnBegin: true, end: '\'',
        contains: [{
          className: 'value',
          begin: '\'', endsWithParent: true
        }]
      },
      {
        begin: '=',
        contains: [{
          className: 'value',
          begin: '[^\\s/>]+'
        }]
      }
    ]
  };
  return {
    case_insensitive: true,
    contains: [
      {
        className: 'pi',
        begin: '<\\?', end: '\\?>',
        relevance: 10
      },
      {
        className: 'doctype',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      {
        className: 'comment',
        begin: '<!--', end: '-->',
        relevance: 10
      },
      {
        className: 'cdata',
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexem to be recognized
        by hljs.subMode() that tests lexems outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {title: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: 'css'
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {title: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</script>', returnEnd: true,
          subLanguage: 'javascript'
        }
      },
      {
        begin: '<%', end: '%>',
        subLanguage: 'vbscript'
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'title', begin: '[^ />]+'
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
};
},{}],57:[function(_dereq_,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + this.output(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + this.output(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<del>'
        + this.output(cap[1])
        + '</del>';
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  if (cap[0].charAt(0) !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + this.output(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + this.token.depth
        + ' id="'
        + this.token.text.toLowerCase().replace(/[^\w]+/g, '-')
        + '">'
        + this.inline.output(this.token.text)
        + '</h'
        + this.token.depth
        + '>\n';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += '<th';
        if (this.token.align[i]) {
          body += ' style="text-align:' + this.token.align[i] + '"';
        }
        body += '>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += '<td';
          if (this.token.align[j]) {
            body += ' style="text-align:' + this.token.align[j] + '"';
          }
          body += '>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return '<p>'
        + this.inline.output(this.token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + this.parseText()
        + '</p>\n';
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],58:[function(_dereq_,module,exports){
'use strict';

var marked = _dereq_('marked'),
    hljs = _dereq_('highlight.js'),
    exports = module.exports = ultramarked,
    alises = exports.aliases = {
        'js': 'javascript',
        'md': 'markdown',
        'html': 'xml', // next best thing
        'jade': 'css' // next best thing
    };

function merge(obj) {
    var i = 1, target, key;

    for(; i < arguments.length; i++){
        target = arguments[i];

        for(key in target){
            if(Object.prototype.hasOwnProperty.call(target, key)){
                obj[key] = target[key];
            }
        }
    }
    return obj;
}

function ultramarked(src, opt) {
    var options = merge({}, marked.defaults, opt),
        aliases = options.aliases || exports.aliases,
        no = 'no-highlight';

    if (options.ultralight){
        options.langPrefix = 'ultralight-lang-'; // placeholder
        options.highlight = function (code, lang) {
            var lower = (lang || no).toLowerCase();
            try{
                return hljs.highlight(aliases[lower] || lower, code).value;
            } catch (ex) {} // marked will know what to do.
        };
    }

    var tokens = marked.lexer(src, options),
        result = marked.parser(tokens, options);

    if(options.ultralight){ // fix the language class using common aliases
        result = result.replace(/"ultralight-lang-([\w-]+)"/ig, function(match, lang){
            var lower = lang.toLowerCase(),
                result = aliases[lower] || lower || no;

            return '"' + result + '"';
        });
    }

    if(options.ultrasanitize){
        result = _dereq_('./sanitizer.js')(result);
    }else if(options.ultrasanitize_pagedown){
        result = _dereq_('./sanitizer-pagedown.js')(result);
    }

    return result;
}

ultramarked.setOptions = marked.setOptions;

},{"./sanitizer-pagedown.js":59,"./sanitizer.js":60,"highlight.js":26,"marked":57}],59:[function(_dereq_,module,exports){
// used to sanitize HTML while not HTML encoding everything.
// just using a whitelist approach.
// extracted from https://code.google.com/p/pagedown/
'use strict';

function sanitizeHtml(html) {
    return html.replace(/<[^>]*>?/gi, sanitizeTag);
}

// (tags that can be opened/closed) | (tags that stand alone)
var basic_tag_whitelist = /^(<\/?(b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|i|kbd|li|ol|p|pre|s|sup|sub|strong|strike|ul)>|<(br|hr)\s?\/?>)$/i;

// <a href='url...' optional title>|</a>
var a_white = /^(<a\shref='((https?|ftp):\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)]+'(\stitle='[^'<>]+')?\s?>|<\/a>)$/i;

// <img src='url...' optional width  optional height  optional alt  optional title
var img_white = /^(<img\ssrc='(https?:\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)]+'(\swidth='\d{1,3}')?(\sheight='\d{1,3}')?(\salt='[^'<>]*')?(\stitle='[^'<>]*')?\s?\/?>)$/i;

var whitelists = [
    basic_tag_whitelist,
    a_white,
    img_white
];

function sanitizeTag(tag) {
    var i;
    for(i = 0; i < whitelists.length; i++){
        if(tag.match(whitelists[i])){
            return tag;
        }
    }
    return '';
}

// attempt to balance HTML tags in the html string
// by removing any unmatched opening or closing tags
// IMPORTANT: we *assume* HTML has *already* been 
// sanitized and is safe/sane before balancing!
function balanceTags(html) {
    if (html === ''){
        return '';
    }

    var re = /<\/?\w+[^>]*(\s|$|>)/g;

    // convert everything to lower case; this makes
    // our case insensitive comparisons easier
    var tags = html.toLowerCase().match(re);

    // no HTML tags present? nothing to do; exit now
    var tagcount = (tags || []).length;
    if (tagcount === 0){
        return html;
    }

    var tagname, tag;
    var ignoredtags = '<p><img><br><li><hr>';
    var match;
    var tagpaired = [];
    var tagremove = [];
    var needsRemoval = false;

    // loop through matched tags in forward order
    for (var ctag = 0; ctag < tagcount; ctag++) {
        tagname = tags[ctag].replace(/<\/?(\w+).*/, '$1');

        // skip any already paired tags
        // and skip tags in our ignore list; assume they're self-closed
        if (tagpaired[ctag] || ignoredtags.search('<' + tagname + '>') > -1){
            continue;
        }            

        tag = tags[ctag];
        match = -1;

        if (!/^<\//.test(tag)) {

            // this is an opening tag
            // search forwards (next tags), look for closing tags
            for (var ntag = ctag + 1; ntag < tagcount; ntag++) {
                if (!tagpaired[ntag] && tags[ntag] === '</' + tagname + '>') {
                    match = ntag;
                    break;
                }
            }
        }

        if (match === -1){
            needsRemoval = tagremove[ctag] = true; // mark for removal
        }else{
            tagpaired[match] = true; // mark paired            
        }
    }

    if (!needsRemoval){
        return html;
    }

    // delete all orphaned tags from the string
    ctag = 0;
    html = html.replace(re, function (match) {
        var res = tagremove[ctag] ? '' : match;
        ctag++;
        return res;
    });
    return html;
}

module.exports = function(html){
    var sanitized = sanitizeHtml(html),
        balanced = balanceTags(sanitized);

    return balanced;
};
},{}],60:[function(_dereq_,module,exports){
'use strict';

var he = _dereq_('he');

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */

// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
    END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
    ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
    BEGIN_TAG_REGEXP = /^</,
    BEGING_END_TAGE_REGEXP = /^<\s*\//,
    COMMENT_REGEXP = /<!--(.*?)-->/g,
    CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
    URI_REGEXP = /^((ftp|https?):\/\/|mailto:|#|\/)/,
    NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g; // Match everything outside of normal chars and " (quote character)


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = extend({}, optionalEndTagBlockElements, makeMap("address,article,aside," +
                "blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6," +
                "header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b,bdi,bdo," +
                "big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small," +
                "span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = {}; // makeMap("script,style")

var validElements = extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = extend({}, uriAttrs, makeMap(
        'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
        'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
        'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
        'scope,scrolling,shape,span,start,summary,target,title,type,'+
        'valign,value,vspace,width'));

/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
    var index, chars, match, stack = [], last = html;
    stack.lastItem = function() { return stack[ stack.length - 1 ]; };

    while ( html ) {
        chars = true;

        // Make sure we're not in a script or style element
        if ( !stack.lastItem() || !specialElements[ stack.lastItem() ] ) {

            // Comment
            if ( html.indexOf("<!--") === 0 ) {
                index = html.indexOf("-->");

                if ( index >= 0 ) {
                    if (handler.comment){
                        handler.comment( html.substring( 4, index ) );
                    }
                    html = html.substring( index + 3 );
                    chars = false;
                }

            // end tag
            } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
                match = html.match( END_TAG_REGEXP );

                if ( match ) {
                    html = html.substring( match[0].length );
                    match[0].replace( END_TAG_REGEXP, parseEndTag );
                    chars = false;
                }

            // start tag
            } else if ( BEGIN_TAG_REGEXP.test(html) ) {
                match = html.match( START_TAG_REGEXP );

                if ( match ) {
                    html = html.substring( match[0].length );
                    match[0].replace( START_TAG_REGEXP, parseStartTag );
                    chars = false;
                }
            }

            if ( chars ) {
                index = html.indexOf("<");

                var text = index < 0 ? html : html.substring( 0, index );
                html = index < 0 ? "" : html.substring( index );

                if (handler.chars){
                    handler.chars( he.decode(text) );
                }
            }

        } else {
            html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.lastItem() + "[^>]*>", 'i'), function(all, text){
                text = text.
                    replace(COMMENT_REGEXP, "$1").
                    replace(CDATA_REGEXP, "$1");

                if (handler.chars){
                    handler.chars( he.decode(text) );
                }

                return "";
            });

            parseEndTag( "", stack.lastItem() );
        }

        if ( html == last ) {
            throw "Parse Error: " + html;
        }
        last = html;
    }

    // Clean up any remaining tags
    parseEndTag();

    function parseStartTag( tag, tagName, rest, unary ) {
        tagName = lowercase(tagName);
        if ( blockElements[ tagName ] ) {
            while ( stack.lastItem() && inlineElements[ stack.lastItem() ] ) {
                parseEndTag( "", stack.lastItem() );
            }
        }

        if ( optionalEndTagElements[ tagName ] && stack.lastItem() == tagName ) {
            parseEndTag( "", tagName );
        }

        unary = voidElements[ tagName ] || !!unary;

        if ( !unary )
            stack.push( tagName );

        var attrs = {};

        rest.replace(ATTR_REGEXP, function(match, name, doubleQuotedValue, singleQoutedValue, unqoutedValue) {
            var value = doubleQuotedValue
                || singleQoutedValue
                || unqoutedValue
                || '';

            attrs[name] = he.decode(value);
        });
        if (handler.start) handler.start( tagName, attrs, unary );
    }

    function parseEndTag( tag, tagName ) {
        var pos = 0, i;
        tagName = lowercase(tagName);
        if ( tagName )
            // Find the closest opened tag of the same type
            for ( pos = stack.length - 1; pos >= 0; pos-- )
                if ( stack[ pos ] == tagName )
                    break;

        if ( pos >= 0 ) {
            // Close all the open elements, up the stack
            for ( i = stack.length - 1; i >= pos; i-- )
                if (handler.end) handler.end( stack[ i ] );

            // Remove the open elements from the stack
            stack.length = pos;
        }
    }
}

/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 *//*
var hiddenPre=document.createElement("pre");
function decodeEntities(value) {
    hiddenPre.innerHTML=value.replace(/</g,"&lt;");
    return hiddenPre.innerText || hiddenPre.textContent || '';
}*/

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns escaped text
 *//*
function encodeEntities(value) {
    return value.
        replace(/&/g, '&amp;').
        replace(NON_ALPHANUMERIC_REGEXP, function(value){
            return '&#' + value.charCodeAt(0) + ';';
        }).
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;');
}*/

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf){
    var ignore = false;
    var out = bind(buf, buf.push);
    return {
        start: function(tag, attrs, unary){
            tag = lowercase(tag);
            if (!ignore && specialElements[tag]) {
                ignore = tag;
            }
            if (!ignore && validElements[tag] == true) {
                out('<');
                out(tag);
                forEach(attrs, function(value, key){
                    var lkey=lowercase(key);
                    if (validAttrs[lkey]==true && (uriAttrs[lkey]!==true || value.match(URI_REGEXP))) {
                        out(' ');
                        out(key);
                        out('="');
                        out(he.encode(value));
                        out('"');
                    }
                });
                out(unary ? '/>' : '>');
            }
        },
        end: function(tag){
                tag = lowercase(tag);
                if (!ignore && validElements[tag] == true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
        chars: function(chars){
                if (!ignore) {
                    out(he.encode(chars));
                }
            }
    };
}

// utilities

function makeMap(str){
    var obj = {}, items = str.split(','), i;

    for ( i = 0; i < items.length; i++ ){
        obj[ items[i] ] = true;
    }
    return obj;
}

function extend(dst) {
    var args = Array.prototype.slice.call(arguments);
    forEach(args, function(obj){
        if (obj !== dst) {
            forEach(obj, function(value, key){
                dst[key] = value;
            });
        }
    });
    return dst;
}

function forEach(obj, iterator, context) {
  var key;
  if (obj) {
    if (typeof obj === 'function'){
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (Array.isArray(obj)) {
        for (key = 0; key < obj.length; key++){
            iterator.call(context, obj[key], key);
        }
    } else {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key);
            }
          }
    }
  }
  return obj;
}

function bind(self, fn) {
    var slice = Array.prototype.slice;
    var curryArgs = arguments.length > 2 ? slice.call(arguments, 2) : [];
  if (typeof fn === 'function' && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
    return fn;
  }
}

var lowercase = function(string){return typeof string === 'string' ? string.toLowerCase() : string;};

module.exports = function(html){
    var buffer = [];

    htmlParser(html, htmlSanitizeWriter(buffer));

    return buffer.join('');
};
},{"he":1}],61:[function(_dereq_,module,exports){
'use strict';

var settings = { lineLength: 72 };
var re = RegExp;

function CommandManager (pluginHooks, getString) {
  this.hooks = pluginHooks;
  this.getString = getString;
}

var $ = CommandManager.prototype;

$.prefixes = '(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)';

$.unwrap = function (chunk) {
  var txt = new re('([^\\n])\\n(?!(\\n|' + this.prefixes + '))', 'g');
  chunk.selection = chunk.selection.replace(txt, '$1 $2');
};

$.wrap = function (chunk, len) {
  this.unwrap(chunk);
  var regex = new re('(.{1,' + len + '})( +|$\\n?)', 'gm'),
    that = this;

  chunk.selection = chunk.selection.replace(regex, function (line, marked) {
    if (new re('^' + that.prefixes, '').test(line)) {
      return line;
    }
    return marked + '\n';
  });

  chunk.selection = chunk.selection.replace(/\s+$/, '');
};

$.doBold = function (chunk, postProcessing) {
  return this.doBorI(chunk, postProcessing, 2, this.getString('boldexample'));
};

$.doItalic = function (chunk, postProcessing) {
  return this.doBorI(chunk, postProcessing, 1, this.getString('italicexample'));
};

$.doBorI = function (chunk, postProcessing, nStars, insertText) {
  chunk.trimWhitespace();
  chunk.selection = chunk.selection.replace(/\n{2,}/g, '\n');

  var starsBefore = /(\**$)/.exec(chunk.before)[0];
  var starsAfter = /(^\**)/.exec(chunk.after)[0];
  var prevStars = Math.min(starsBefore.length, starsAfter.length);

  if ((prevStars >= nStars) && (prevStars != 2 || nStars != 1)) {
    chunk.before = chunk.before.replace(re('[*]{' + nStars + '}$', ''), '');
    chunk.after = chunk.after.replace(re('^[*]{' + nStars + '}', ''), '');
  } else if (!chunk.selection && starsAfter) {
    chunk.after = chunk.after.replace(/^([*_]*)/, '');
    chunk.before = chunk.before.replace(/(\s?)$/, '');
    var whitespace = re.$1;
    chunk.before = chunk.before + starsAfter + whitespace;
  } else {
    if (!chunk.selection && !starsAfter) {
      chunk.selection = insertText;
    }

    var markup = nStars <= 1 ? '*' : '**';
    chunk.before = chunk.before + markup;
    chunk.after = markup + chunk.after;
  }
};

$.stripLinkDefs = function (text, defsToAdd) {
  var regex = /^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm;

  function replacer (all, id, link, newlines, title) {
    defsToAdd[id] = all.replace(/\s*$/, '');
    if (newlines) {
      defsToAdd[id] = all.replace(/["(](.+?)[")]$/, '');
      return newlines + title;
    }
    return '';
  }

  return text.replace(regex, replacer);
};

$.addLinkDef = function (chunk, linkDef) {
  var refNumber = 0;
  var defsToAdd = {};
  chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
  chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
  chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

  var defs = '';
  var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;

  function addDefNumber (def) {
    refNumber++;
    def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, '  [' + refNumber + ']:');
    defs += '\n' + def;
  }

  function getLink (wholeMatch, before, inner, afterInner, id, end) {
    inner = inner.replace(regex, getLink);
    if (defsToAdd[id]) {
      addDefNumber(defsToAdd[id]);
      return before + inner + afterInner + refNumber + end;
    }
    return wholeMatch;
  }

  chunk.before = chunk.before.replace(regex, getLink);

  if (linkDef) {
    addDefNumber(linkDef);
  } else {
    chunk.selection = chunk.selection.replace(regex, getLink);
  }

  var refOut = refNumber;

  chunk.after = chunk.after.replace(regex, getLink);

  if (chunk.after) {
    chunk.after = chunk.after.replace(/\n*$/, '');
  }
  if (!chunk.after) {
    chunk.selection = chunk.selection.replace(/\n*$/, '');
  }

  chunk.after += '\n\n' + defs;

  return refOut;
};

function properlyEncoded (linkdef) {
  function replacer (wholematch, link, title) {
    link = link.replace(/\?.*$/, function (querypart) {
      return querypart.replace(/\+/g, ' '); // in the query string, a plus and a space are identical
    });
    link = decodeURIComponent(link); // unencode first, to prevent double encoding
    link = encodeURI(link).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
    link = link.replace(/\?.*$/, function (querypart) {
      return querypart.replace(/\+/g, '%2b'); // since we replaced plus with spaces in the query part, all pluses that now appear where originally encoded
    });
    if (title) {
      title = title.trim ? title.trim() : title.replace(/^\s*/, '').replace(/\s*$/, '');
      title = title.replace(/"/g, 'quot;').replace(/\(/g, '&#40;').replace(/\)/g, '&#41;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return title ? link + ' "' + title + '"' : link;
  }
  return linkdef.replace(/^\s*(.*?)(?:\s+"(.+)")?\s*$/, replacer);
}

$.doLinkOrImage = function (chunk, postProcessing, isImage) {
  var background;
  chunk.trimWhitespace();
  chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);

  if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {
    chunk.startTag = chunk.startTag.replace(/!?\[/, '');
    chunk.endTag = '';
    this.addLinkDef(chunk, null);
  } else {
    chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
    chunk.startTag = chunk.endTag = '';

    if (/\n\n/.test(chunk.selection)) {
      this.addLinkDef(chunk, null);
      return;
    }
    var that = this;

    if (isImage) {
      if (!this.hooks.insertImageDialog(linkEnteredCallback)){
        ui.prompt('prompt-image', linkEnteredCallback);
      }
    } else {
      ui.prompt('prompt-link', linkEnteredCallback);
    }
    return true;
  }

  function linkEnteredCallback (link) {
    if (link !== null) {
      chunk.selection = (' ' + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, '$1\\').substr(1);

      var linkDef = ' [999]: ' + properlyEncoded(link);
      var num = that.addLinkDef(chunk, linkDef);
      chunk.startTag = isImage ? '![' : '[';
      chunk.endTag = '][' + num + ']';

      if (!chunk.selection) {
        if (isImage) {
          chunk.selection = that.getString('imagedescription');
        }
        else {
          chunk.selection = that.getString('linkdescription');
        }
      }
    }
    postProcessing();
  }
};

$.doAutoindent = function (chunk, postProcessing) {
  var commandMgr = this;
  var fakeSelection = false;

  chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, '\n\n');
  chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, '\n\n');
  chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, '\n\n');

  if (!chunk.selection && !/^[ \t]*(?:\n|$)/.test(chunk.after)) {
    chunk.after = chunk.after.replace(/^[^\n]*/, function (wholeMatch) {
      chunk.selection = wholeMatch;
      return '';
    });
    fakeSelection = true;
  }

  if (/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)) {
    if (commandMgr.doList) {
      commandMgr.doList(chunk);
    }
  }
  if (/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)) {
    if (commandMgr.doBlockquote) {
      commandMgr.doBlockquote(chunk);
    }
  }
  if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
    if (commandMgr.doCode) {
      commandMgr.doCode(chunk);
    }
  }

  if (fakeSelection) {
    chunk.after = chunk.selection + chunk.after;
    chunk.selection = '';
  }
};

$.doBlockquote = function (chunk, postProcessing) {
  chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/,
    function (totalMatch, newlinesBefore, text, newlinesAfter) {
      chunk.before += newlinesBefore;
      chunk.after = newlinesAfter + chunk.after;
      return text;
    });

  chunk.before = chunk.before.replace(/(>[ \t]*)$/,
    function (totalMatch, blankLine) {
      chunk.selection = blankLine + chunk.selection;
      return '';
    });

  chunk.selection = chunk.selection.replace(/^(\s|>)+$/, '');
  chunk.selection = chunk.selection || this.getString('quoteexample');

  var match = '';
  var leftOver = '';
  var line;

  if (chunk.before) {
    var lines = chunk.before.replace(/\n$/, '').split('\n');
    var inChain = false;
    for (var i = 0; i < lines.length; i++) {
      var good = false;
      line = lines[i];
      inChain = inChain && line.length > 0;
      if (/^>/.test(line)) {
        good = true;
        if (!inChain && line.length > 1)
          inChain = true;
      } else if (/^[ \t]*$/.test(line)) {
        good = true;
      } else {
        good = inChain;
      }
      if (good) {
        match += line + '\n';
      } else {
        leftOver += match + line;
        match = '\n';
      }
    }
    if (!/(^|\n)>/.test(match)) {
      leftOver += match;
      match = '';
    }
  }

  chunk.startTag = match;
  chunk.before = leftOver;

  // end of change

  if (chunk.after) {
    chunk.after = chunk.after.replace(/^\n?/, '\n');
  }

  chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/,
    function (totalMatch) {
      chunk.endTag = totalMatch;
      return '';
    }
  );

  var replaceBlanksInTags = function (useBracket) {

    var replacement = useBracket ? '> ' : '';

    if (chunk.startTag) {
      chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/,
        function (totalMatch, markdown) {
          return '\n' + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + '\n';
        });
    }
    if (chunk.endTag) {
      chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/,
        function (totalMatch, markdown) {
          return '\n' + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + '\n';
        });
    }
  };

  if (/^(?![ ]{0,3}>)/m.test(chunk.selection)) {
    this.wrap(chunk, settings.lineLength - 2);
    chunk.selection = chunk.selection.replace(/^/gm, '> ');
    replaceBlanksInTags(true);
    chunk.skipLines();
  } else {
    chunk.selection = chunk.selection.replace(/^[ ]{0,3}> ?/gm, '');
    this.unwrap(chunk);
    replaceBlanksInTags(false);

    if (!/^(\n|^)[ ]{0,3}>/.test(chunk.selection) && chunk.startTag) {
      chunk.startTag = chunk.startTag.replace(/\n{0,2}$/, '\n\n');
    }

    if (!/(\n|^)[ ]{0,3}>.*$/.test(chunk.selection) && chunk.endTag) {
      chunk.endTag = chunk.endTag.replace(/^\n{0,2}/, '\n\n');
    }
  }

  chunk.selection = this.hooks.postBlockquoteCreation(chunk.selection);

  if (!/\n/.test(chunk.selection)) {
    chunk.selection = chunk.selection.replace(/^(> *)/,
      function (wholeMatch, blanks) {
        chunk.startTag += blanks;
        return '';
      });
  }
};

$.doCode = function (chunk, postProcessing) {

  var hasTextBefore = /\S[ ]*$/.test(chunk.before);
  var hasTextAfter = /^[ ]*\S/.test(chunk.after);

  // Use 'four space' markdown if the selection is on its own
  // line or is multiline.
  if ((!hasTextAfter && !hasTextBefore) || /\n/.test(chunk.selection)) {

    chunk.before = chunk.before.replace(/[ ]{4}$/,
      function (totalMatch) {
        chunk.selection = totalMatch + chunk.selection;
        return '';
      });

    var nLinesBack = 1;
    var nLinesForward = 1;

    if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
      nLinesBack = 0;
    }
    if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
      nLinesForward = 0;
    }

    chunk.skipLines(nLinesBack, nLinesForward);

    if (!chunk.selection) {
      chunk.startTag = '    ';
      chunk.selection = this.getString('codeexample');
    }
    else {
      if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
        if (/\n/.test(chunk.selection))
          chunk.selection = chunk.selection.replace(/^/gm, '    ');
        else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
          chunk.before += '    ';
      }
      else {
        chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, '');
      }
    }
  }
  else {
    // Use backticks (`) to delimit the code block.

    chunk.trimWhitespace();
    chunk.findTags(/`/, /`/);

    if (!chunk.startTag && !chunk.endTag) {
      chunk.startTag = chunk.endTag = '`';
      if (!chunk.selection) {
        chunk.selection = this.getString('codeexample');
      }
    }
    else if (chunk.endTag && !chunk.startTag) {
      chunk.before += chunk.endTag;
      chunk.endTag = '';
    }
    else {
      chunk.startTag = chunk.endTag = '';
    }
  }
};

$.doList = function (chunk, postProcessing, isNumberedList) {
  var previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
  var nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;
  var bullet = '-';
  var num = 1;

  function getItemPrefix () {
    var prefix;
    if (isNumberedList) {
      prefix = ' ' + num + '. ';
      num++;
    }
    else {
      prefix = ' ' + bullet + ' ';
    }
    return prefix;
  };

  function getPrefixedItem (itemText) {
    if (isNumberedList === void 0) {
      isNumberedList = /^\s*\d/.test(itemText);
    }

    itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm, function () {
      return getItemPrefix();
    });

    return itemText;
  };

  chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

  if (chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)) {
    chunk.before += chunk.startTag;
    chunk.startTag = '';
  }

  if (chunk.startTag) {

    var hasDigits = /\d+[.]/.test(chunk.startTag);
    chunk.startTag = '';
    chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, '\n');
    this.unwrap(chunk);
    chunk.skipLines();

    if (hasDigits) {
      chunk.after = chunk.after.replace(nextItemsRegex, getPrefixedItem);
    }
    if (isNumberedList == hasDigits) {
      return;
    }
  }

  var nLinesUp = 1;

  chunk.before = chunk.before.replace(previousItemsRegex,
    function (itemText) {
      if (/^\s*([*+-])/.test(itemText)) {
        bullet = re.$1;
      }
      nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
      return getPrefixedItem(itemText);
    });

  if (!chunk.selection) {
    chunk.selection = this.getString('litem');
  }

  var prefix = getItemPrefix();
  var nLinesDown = 1;

  chunk.after = chunk.after.replace(nextItemsRegex, function (itemText) {
    nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
    return getPrefixedItem(itemText);
  });
  chunk.trimWhitespace(true);
  chunk.skipLines(nLinesUp, nLinesDown, true);
  chunk.startTag = prefix;
  var spaces = prefix.replace(/./g, ' ');
  this.wrap(chunk, settings.lineLength - spaces.length);
  chunk.selection = chunk.selection.replace(/\n/g, '\n' + spaces);

};

$.doHeading = function (chunk, postProcessing) {
  chunk.selection = chunk.selection.replace(/\s+/g, ' ');
  chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, '');

  if (!chunk.selection) {
    chunk.startTag = '## ';
    chunk.selection = this.getString('headingexample');
    chunk.endTag = ' ##';
    return;
  }

  var headerLevel = 0;

  chunk.findTags(/#+[ ]*/, /[ ]*#+/);
  if (/#+/.test(chunk.startTag)) {
    headerLevel = re.lastMatch.length;
  }
  chunk.startTag = chunk.endTag = '';
  chunk.findTags(null, /\s?(-+|=+)/);
  if (/=+/.test(chunk.endTag)) {
    headerLevel = 1;
  }
  if (/-+/.test(chunk.endTag)) {
    headerLevel = 2;
  }

  chunk.startTag = chunk.endTag = '';
  chunk.skipLines(1, 1);

  var headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;
  if (headerLevelToCreate > 0) {
    var headerChar = headerLevelToCreate >= 2 ? '-' : '=';
    var len = chunk.selection.length;
    if (len > settings.lineLength) {
      len = settings.lineLength;
    }
    chunk.endTag = '\n';
    while (len--) {
      chunk.endTag += headerChar;
    }
  }
};

$.doHorizontalRule = function (chunk, postProcessing) {
  chunk.startTag = '----------\n';
  chunk.selection = '';
  chunk.skipLines(2, 1, true);
}

module.exports = CommandManager;

},{}],62:[function(_dereq_,module,exports){
'use strict';

var ui = _dereq_('./ui');
var util = _dereq_('./util');
var position = _dereq_('./position');
var PanelCollection = _dereq_('./PanelCollection');
var UndoManager = _dereq_('./UndoManager');
var UIManager = _dereq_('./UIManager');
var CommandManager = _dereq_('./CommandManager');
var PreviewManager = _dereq_('./PreviewManager');
var HookCollection = _dereq_('./HookCollection');

var defaultsStrings = {
  bold: 'Strong <strong> Ctrl+B',
  boldexample: 'strong text',
  code: 'Code Sample <pre><code> Ctrl+K',
  codeexample: 'enter code here',
  heading: 'Heading <h1>/<h2> Ctrl+H',
  headingexample: 'Heading',
  help: 'Markdown Editing Help',
  hr: 'Horizontal Rule <hr> Ctrl+R',
  image: 'Image <img> Ctrl+G',
  imagedescription: 'enter image description here',
  italic: 'Emphasis <em> Ctrl+I',
  italicexample: 'emphasized text',
  link: 'Hyperlink <a> Ctrl+L',
  linkdescription: 'enter link description here',
  litem: 'List item',
  olist: 'Numbered List <ol> Ctrl+O',
  quote: 'Blockquote <blockquote> Ctrl+Q',
  quoteexample: 'Blockquote',
  redo: 'Redo - Ctrl+Y',
  redomac: 'Redo - Ctrl+Shift+Z',
  ulist: 'Bulleted List <ul> Ctrl+U',
  undo: 'Undo - Ctrl+Z'
};

function Editor (postfix, opts) {
  var options = opts || {};

  if (typeof options.handler === 'function') { //backwards compatible behavior
    options = { helpButton: options };
  }
  options.strings = options.strings || {};
  if (options.helpButton) {
    options.strings.help = options.strings.help || options.helpButton.title;
  }
  function getString (identifier) {
    return options.strings[identifier] || defaultsStrings[identifier];
  }

  var self = this;
  var hooks = self.hooks = new HookCollection();
  var panels;

  hooks.addNoop('onPreviewRefresh');
  hooks.addNoop('postBlockquoteCreation');
  hooks.addFalse('insertImageDialog');

  self.run = function () {
    if (panels) {
      return; // already initialized
    }

    panels = new PanelCollection(postfix);

    var commandManager = new CommandManager(hooks, getString);
    var previewManager = new PreviewManager(panels, function () { hooks.onPreviewRefresh(); });
    var uiManager;

    var undoManager = new UndoManager(function () {
      previewManager.refresh();
      if (uiManager) { // not available on the first call
        uiManager.setUndoRedoButtonStates();
      }
    }, panels);

    uiManager = new UIManager(postfix, panels, undoManager, previewManager, commandManager, options.helpButton, getString);
    uiManager.setUndoRedoButtonStates();

    self.refreshPreview = function () {
      previewManager.refresh(true);
    };
    self.refreshPreview();
  };
}

module.exports = Editor;

},{"./CommandManager":61,"./HookCollection":63,"./PanelCollection":64,"./PreviewManager":65,"./UIManager":67,"./UndoManager":68,"./position":71,"./ui":73,"./util":74}],63:[function(_dereq_,module,exports){
'use strict';

function identity (x) { return x; }
function returnFalse (x) { return false; }

function HookCollection () {
}

HookCollection.prototype = {
  chain: function (name, fn) {
    var original = this[name];
    if (!original) {
      throw new Error('unknown hook ' + name);
    }

    if (original === identity) {
      this[name] = fn;
    } else {
      this[name] = function (x) { return fn(original(x)); }
    }
  },
  set: function (name, fn) {
    if (!this[name]) {
      throw new Error('unknown hook ' + name);
    }
    this[name] = fn;
  },
  addNoop: function (name) {
    this[name] = identity;
  },
  addFalse: function (name) {
    this[name] = returnFalse;
  }
};

module.exports = HookCollection;

},{}],64:[function(_dereq_,module,exports){
'use strict';

function PanelCollection (postfix) {
  this.buttonBar = document.getElementById('pmk-buttons-' + postfix);
  this.preview = document.getElementById('pmk-preview-' + postfix);
  this.input = document.getElementById('pmk-input-' + postfix);
}

module.exports = PanelCollection;

},{}],65:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ua = _dereq_('./ua');
var util = _dereq_('./util');
var parse = _dereq_('./parse');
var position = _dereq_('./position');

function PreviewManager (panels, previewRefreshCallback) {
  var managerObj = this;
  var timeout;
  var elapsedTime;
  var oldInputText;
  var maxDelay = 3000;
  var startType = 'delayed'; // The other legal value is 'manual'

  // Adds event listeners to elements
  var setupEvents = function (inputElem, listener) {

    util.addEvent(inputElem, 'input', listener);
    inputElem.onpaste = listener;
    inputElem.ondrop = listener;

    util.addEvent(inputElem, 'keypress', listener);
    util.addEvent(inputElem, 'keydown', listener);
  };

  var getDocScrollTop = function () {

    var result = 0;

    if (window.innerHeight) {
      result = window.pageYOffset;
    } else if (doc.documentElement && doc.documentElement.scrollTop) {
      result = doc.documentElement.scrollTop;
    } else if (doc.body) {
      result = doc.body.scrollTop;
    }

    return result;
  };

  var makePreviewHtml = function () {

    // If there is no registered preview panel
    // there is nothing to do.
    if (!panels.preview) {
      return;
    }

    var text = panels.input.value;
    if (text && text == oldInputText) {
      return; // Input text hasn't changed.
    } else {
      oldInputText = text;
    }

    var prevTime = new Date().getTime();

    text = parse(text);

    // Calculate the processing time of the HTML creation.
    // It's used as the delay time in the event listener.
    var currTime = new Date().getTime();
    elapsedTime = currTime - prevTime;

    pushPreviewHtml(text);
  };

  // setTimeout is already used.  Used as an event listener.
  var applyTimeout = function () {

    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }

    if (startType !== 'manual') {

      var delay = 0;

      if (startType === 'delayed') {
        delay = elapsedTime;
      }

      if (delay > maxDelay) {
        delay = maxDelay;
      }
      timeout = setTimeout(makePreviewHtml, delay);
    }
  };

  var getScaleFactor = function (panel) {
    if (panel.scrollHeight <= panel.clientHeight) {
      return 1;
    }
    return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
  };

  var setPanelScrollTops = function () {
    if (panels.preview) {
      panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
    }
  };

  this.refresh = function (requiresRefresh) {

    if (requiresRefresh) {
      oldInputText = '';
      makePreviewHtml();
    }
    else {
      applyTimeout();
    }
  };

  this.processingTime = function () {
    return elapsedTime;
  };

  var isFirstTimeFilled = true;

  // IE doesn't let you use innerHTML if the element is contained somewhere in a table
  // (which is the case for inline editing) -- in that case, detach the element, set the
  // value, and reattach. Yes, that *is* ridiculous.
  var ieSafePreviewSet = function (text) {
    var preview = panels.preview;
    var parent = preview.parentNode;
    var sibling = preview.nextSibling;
    parent.removeChild(preview);
    preview.innerHTML = text;
    if (!sibling)
      parent.appendChild(preview);
    else
      parent.insertBefore(preview, sibling);
  }

  var nonSuckyBrowserPreviewSet = function (text) {
    panels.preview.innerHTML = text;
  }

  var previewSetter;

  var previewSet = function (text) {
    if (previewSetter)
      return previewSetter(text);

    try {
      nonSuckyBrowserPreviewSet(text);
      previewSetter = nonSuckyBrowserPreviewSet;
    } catch (e) {
      previewSetter = ieSafePreviewSet;
      previewSetter(text);
    }
  };

  var pushPreviewHtml = function (text) {

    var emptyTop = position.getTop(panels.input) - getDocScrollTop();

    if (panels.preview) {
      previewSet(text);
      previewRefreshCallback();
    }

    setPanelScrollTops();

    if (isFirstTimeFilled) {
      isFirstTimeFilled = false;
      return;
    }

    var fullTop = position.getTop(panels.input) - getDocScrollTop();

    if (ua.isIE) {
      setTimeout(function () {
        window.scrollBy(0, fullTop - emptyTop);
      }, 0);
    }
    else {
      window.scrollBy(0, fullTop - emptyTop);
    }
  };

  var init = function () {

    setupEvents(panels.input, applyTimeout);
    makePreviewHtml();

    if (panels.preview) {
      panels.preview.scrollTop = 0;
    }
  };

  init();
};

module.exports = PreviewManager;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parse":69,"./position":71,"./ua":72,"./util":74}],66:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ua = _dereq_('./ua');
var util = _dereq_('./util');

function TextareaState (panels, isInitialState) {
  var self = this;
  var input = panels.input;

  self.init = function () {
    if (!util.isVisible(input)) {
      return;
    }
    if (!isInitialState && doc.activeElement && doc.activeElement !== input) {
      return;
    }

    self.setInputSelectionStartEnd();
    self.scrollTop = input.scrollTop;
    if (!self.text && input.selectionStart || input.selectionStart === 0) {
      self.text = input.value;
    }
  }

  self.setInputSelection = function () {
    if (!util.isVisible(input)) {
      return;
    }

    if (input.selectionStart !== void 0 && !ua.isOpera) {
      input.focus();
      input.selectionStart = self.start;
      input.selectionEnd = self.end;
      input.scrollTop = self.scrollTop;
    } else if (doc.selection) {
      if (doc.activeElement && doc.activeElement !== input) {
        return;
      }

      input.focus();
      var range = input.createTextRange();
      range.moveStart('character', -input.value.length);
      range.moveEnd('character', -input.value.length);
      range.moveEnd('character', self.end);
      range.moveStart('character', self.start);
      range.select();
    }
  };

  self.setInputSelectionStartEnd = function () {
    if (!panels.ieCachedRange && (input.selectionStart || input.selectionStart === 0)) {
      self.start = input.selectionStart;
      self.end = input.selectionEnd;
    } else if (doc.selection) {
      self.text = util.fixEolChars(input.value);

      var range = panels.ieCachedRange || doc.selection.createRange();
      var fixedRange = util.fixEolChars(range.text);
      var marker = '\x07';
      var markedRange = marker + fixedRange + marker;
      range.text = markedRange;
      var inputText = util.fixEolChars(input.value);

      range.moveStart('character', -markedRange.length);
      range.text = fixedRange;

      self.start = inputText.indexOf(marker);
      self.end = inputText.lastIndexOf(marker) - marker.length;

      var len = self.text.length - util.fixEolChars(input.value).length;
      if (len) {
        range.moveStart('character', -fixedRange.length);
        while (len--) {
          fixedRange += '\n';
          self.end += 1;
        }
        range.text = fixedRange;
      }

      if (panels.ieCachedRange) {
        self.scrollTop = panels.ieCachedScrollTop;
      }
      panels.ieCachedRange = null;
      self.setInputSelection();
    }
  };

 self.restore = function () {
    if (self.text != void 0 && self.text != input.value) {
      input.value = self.text;
    }
    self.setInputSelection();
    input.scrollTop = self.scrollTop;
  };

  self.getChunks = function () {
    var chunk = new Chunks();
    chunk.before = util.fixEolChars(self.text.substring(0, self.start));
    chunk.startTag = '';
    chunk.selection = util.fixEolChars(self.text.substring(self.start, self.end));
    chunk.endTag = '';
    chunk.after = util.fixEolChars(self.text.substring(self.end));
    chunk.scrollTop = self.scrollTop;
    return chunk;
  };

  self.setChunks = function (chunk) {
    chunk.before = chunk.before + chunk.startTag;
    chunk.after = chunk.endTag + chunk.after;
    self.start = chunk.before.length;
    self.end = chunk.before.length + chunk.selection.length;
    self.text = chunk.before + chunk.selection + chunk.after;
    self.scrollTop = chunk.scrollTop;
  };

  self.init();
};

module.exports = TextareaState;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ua":72,"./util":74}],67:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ua = _dereq_('./ua');
var util = _dereq_('./util');
var TextareaState = _dereq_('./TextareaState');

function UIManager (postfix, panels, undoManager, previewManager, commandManager, helpOptions, getString) {
  var inputBox = panels.input;
  var buttons = {};

  makeSpritedButtonRow();

  var keyEvent = 'keydown';
  if (ua.isOpera) {
    keyEvent = 'keypress';
  }

  util.addEvent(inputBox, keyEvent, function (key) {
    if ((!key.ctrlKey && !key.metaKey) || key.altKey || key.shiftKey) {
      return;
    }

    var keyCode = key.charCode || key.keyCode;
    var keyCodeStr = String.fromCharCode(keyCode).toLowerCase();

    switch (keyCodeStr) {
      case 'b': doClick(buttons.bold); break;
      case 'i': doClick(buttons.italic); break;
      case 'l': doClick(buttons.link); break;
      case 'q': doClick(buttons.quote); break;
      case 'k': doClick(buttons.code); break;
      case 'g': doClick(buttons.image); break;
      case 'o': doClick(buttons.olist); break;
      case 'u': doClick(buttons.ulist); break;
      case 'h': doClick(buttons.heading); break;
      case 'r': doClick(buttons.hr); break;
      case 'y': doClick(buttons.redo); break;
      case 'z':
        if (key.shiftKey) {
          doClick(buttons.redo);
        }
        else {
          doClick(buttons.undo);
        }
        break;
      default:
        return;
    }

    if (key.preventDefault) {
      key.preventDefault();
    }
    if (window.event) {
      window.event.returnValue = false;
    }
  });

  util.addEvent(inputBox, 'keyup', function (key) {
    if (key.shiftKey && !key.ctrlKey && !key.metaKey) {
      var keyCode = key.charCode || key.keyCode;

      if (keyCode === 13) {
        var fakeButton = {};
        fakeButton.textOp = bindCommand('doAutoindent');
        doClick(fakeButton);
      }
    }
  });

  if (ua.isIE) {
    util.addEvent(inputBox, 'keydown', function (key) {
      var code = key.keyCode;
      if (code === 27) {
        return false;
      }
    });
  }


  function doClick (button) {
    inputBox.focus();

    if (button.textOp) {
      if (undoManager) {
        undoManager.setCommandMode();
      }

      var state = new TextareaState(panels);

      if (!state) {
        return;
      }

      var chunks = state.getChunks();
      var noCleanup = button.textOp(chunks, fixupInputArea);

      if (!noCleanup) {
        fixupInputArea();
      }
    }
    if (button.execute) {
      button.execute(undoManager);
    }

    function fixupInputArea () {
      inputBox.focus();

      if (chunks) {
        state.setChunks(chunks);
      }
      state.restore();
      previewManager.refresh();
    }
  };

  function setupButton (button, isEnabled) {
    var normalYShift = '0px';
    var disabledYShift = '-20px';
    var highlightYShift = '-40px';
    var image = button.getElementsByTagName('span')[0];
    if (isEnabled) {
      button.onmouseover = function () {
        image.style.backgroundPosition = this.XShift + ' ' + highlightYShift;
      };
      button.onmouseout = function () {
        image.style.backgroundPosition = this.XShift + ' ' + normalYShift;
      };
      button.onmouseout();

      if (ua.isIE) {
        button.onmousedown = function () {
          if (doc.activeElement && doc.activeElement !== panels.input) {
            return;
          }
          panels.ieCachedRange = document.selection.createRange();
          panels.ieCachedScrollTop = panels.input.scrollTop;
        };
      }

      if (!button.isHelp) {
        button.onclick = function () {
          if (this.onmouseout) {
            this.onmouseout();
          }
          doClick(this);
          return false;
        }
      }
    } else {
      image.style.backgroundPosition = button.XShift + ' ' + disabledYShift;
      button.onmouseover = button.onmouseout = button.onclick = function () { };
    }
  }

  function bindCommand (method) {
    if (typeof method === 'string') {
      method = commandManager[method];
    }
    return function () {
      method.apply(commandManager, arguments);
    };
  }

  function makeSpritedButtonRow () {
    var buttonBar = panels.buttonBar;
    var normalYShift = '0px';
    var disabledYShift = '-20px';
    var highlightYShift = '-40px';

    var buttonRow = document.createElement('ul');
    buttonRow.id = 'pmk-button-row-' + postfix;
    buttonRow.className = 'pmk-button-row';
    buttonRow = buttonBar.appendChild(buttonRow);
    var xPosition = 0;

    function makeButton (id, title, XShift, textOp) {
      var button = document.createElement('li');
      button.className = 'pmk-button ' + id;
      button.style.left = xPosition + 'px';
      xPosition += 25;
      var buttonImage = document.createElement('span');
      button.id = id + '-' + postfix;
      button.appendChild(buttonImage);
      button.title = title;
      button.XShift = XShift;
      if (textOp) {
        button.textOp = textOp;
      }
      setupButton(button, true);
      buttonRow.appendChild(button);
      return button;
    }

    function makeSpacer (num) {
      var spacer = document.createElement('li');
      spacer.className = 'pmk-spacer pmk-spacer-' + num;
      spacer.id = 'pmk-spacer-' + postfix + '-' + num;
      buttonRow.appendChild(spacer);
      xPosition += 25;
    }

    buttons.bold = makeButton('pmk-bold-button', getString('bold'), '0px', bindCommand('doBold'));
    buttons.italic = makeButton('pmk-italic-button', getString('italic'), '-20px', bindCommand('doItalic'));
    makeSpacer(1);
    buttons.link = makeButton('pmk-link-button', getString('link'), '-40px', bindCommand(function (chunk, postProcessing) {
      return this.doLinkOrImage(chunk, postProcessing, false);
    }));
    buttons.quote = makeButton('pmk-quote-button', getString('quote'), '-60px', bindCommand('doBlockquote'));
    buttons.code = makeButton('pmk-code-button', getString('code'), '-80px', bindCommand('doCode'));
    buttons.image = makeButton('pmk-image-button', getString('image'), '-100px', bindCommand(function (chunk, postProcessing) {
      return this.doLinkOrImage(chunk, postProcessing, true);
    }));
    makeSpacer(2);
    buttons.olist = makeButton('pmk-olist-button', getString('olist'), '-120px', bindCommand(function (chunk, postProcessing) {
      this.doList(chunk, postProcessing, true);
    }));
    buttons.ulist = makeButton('pmk-ulist-button', getString('ulist'), '-140px', bindCommand(function (chunk, postProcessing) {
      this.doList(chunk, postProcessing, false);
    }));
    buttons.heading = makeButton('pmk-heading-button', getString('heading'), '-160px', bindCommand('doHeading'));
    buttons.hr = makeButton('pmk-hr-button', getString('hr'), '-180px', bindCommand('doHorizontalRule'));
    makeSpacer(3);
    buttons.undo = makeButton('pmk-undo-button', getString('undo'), '-200px', null);
    buttons.undo.execute = function (manager) {
      if (manager) {
        manager.undo();
      }
    };

    var redoTitle = getString(ua.isWidnows ? 'redo' : 'redomac');

    buttons.redo = makeButton('pmk-redo-button', redoTitle, '-220px', null);
    buttons.redo.execute = function (manager) {
      if (manager) {
        manager.redo();
      }
    };

    if (helpOptions) {
      var helpButton = document.createElement('li');
      var helpButtonImage = document.createElement('span');
      helpButton.appendChild(helpButtonImage);
      helpButton.className = 'pmk-button pmk-help-button';
      helpButton.id = 'pmk-help-button-' + postfix;
      helpButton.XShift = '-240px';
      helpButton.isHelp = true;
      helpButton.style.right = '0px';
      helpButton.title = getString('help');
      helpButton.onclick = helpOptions.handler;

      setupButton(helpButton, true);
      buttonRow.appendChild(helpButton);
      buttons.help = helpButton;
    }

    setUndoRedoButtonStates();
  }

  function setUndoRedoButtonStates () {
    if (undoManager) {
      setupButton(buttons.undo, undoManager.canUndo());
      setupButton(buttons.redo, undoManager.canRedo());
    }
  };

  this.setUndoRedoButtonStates = setUndoRedoButtonStates;
}

module.exports = UIManager;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./TextareaState":66,"./ua":72,"./util":74}],68:[function(_dereq_,module,exports){
'use strict';

var ua = _dereq_('./ua');
var util = _dereq_('./util');
var TextareaState = _dereq_('./TextareaState');

function UndoManager (callback, panels) {
  var self = this;
  var undoStack = [];
  var stackPtr = 0;
  var mode = 'none';
  var lastState;
  var timer;
  var inputState;

  function setMode (newMode, noSave) {
    if (mode != newMode) {
      mode = newMode;
      if (!noSave) {
        saveState();
      }
    }

    if (!ua.isIE || mode != 'moving') {
      timer = setTimeout(refreshState, 1);
    } else {
      inputState = null;
    }
  };

  function refreshState (isInitialState) {
    inputState = new TextareaState(panels, isInitialState);
    timer = void 0;
  }

  self.setCommandMode = function () {
    mode = 'command';
    saveState();
    timer = setTimeout(refreshState, 0);
  };

  self.canUndo = function () {
    return stackPtr > 1;
  };

  self.canRedo = function () {
    return undoStack[stackPtr + 1];
  };

  self.undo = function () {
    if (self.canUndo()) {
      if (lastState) {
        lastState.restore();
        lastState = null;
      } else {
        undoStack[stackPtr] = new TextareaState(panels);
        undoStack[--stackPtr].restore();

        if (callback) {
          callback();
        }
      }
    }
    mode = 'none';
    panels.input.focus();
    refreshState();
  };

  self.redo = function () {
    if (self.canRedo()) {
      undoStack[++stackPtr].restore();

      if (callback) {
        callback();
      }
    }

    mode = 'none';
    panels.input.focus();
    refreshState();
  };

  function saveState () {
    var currState = inputState || new TextareaState(panels);

    if (!currState) {
      return false;
    }
    if (mode == 'moving') {
      if (!lastState) {
        lastState = currState;
      }
      return;
    }
    if (lastState) {
      if (undoStack[stackPtr - 1].text != lastState.text) {
        undoStack[stackPtr++] = lastState;
      }
      lastState = null;
    }
    undoStack[stackPtr++] = currState;
    undoStack[stackPtr + 1] = null;
    if (callback) {
      callback();
    }
  }

  function preventCtrlYZ (event) {
    var keyCode = event.charCode || event.keyCode;
    var yz = keyCode == 89 || keyCode == 90;
    var ctrl = event.ctrlKey || event.metaKey;
    if (ctrl && yz) {
      event.preventDefault();
    }
  }
  function handleCtrlYZ (event) {
    var handled = false;
    var keyCode = event.charCode || event.keyCode;
    var keyCodeChar = String.fromCharCode(keyCode);

    if (event.ctrlKey || event.metaKey) {
      switch (keyCodeChar.toLowerCase()) {
        case 'y':
          self.redo();
          handled = true;
          break;

        case 'z':
          if (!event.shiftKey) {
            self.undo();
          }
          else {
            self.redo();
          }
          handled = true;
          break;
      }
    }

    if (handled) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      if (window.event) {
        window.event.returnValue = false;
      }
    }
  }

  function handleModeChange (event) {
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    var keyCode = event.keyCode;

    if ((keyCode >= 33 && keyCode <= 40) || (keyCode >= 63232 && keyCode <= 63235)) {
      setMode('moving');
    } else if (keyCode == 8 || keyCode == 46 || keyCode == 127) {
      setMode('deleting');
    } else if (keyCode == 13) {
      setMode('newlines');
    } else if (keyCode == 27) {
      setMode('escape');
    } else if ((keyCode < 16 || keyCode > 20) && keyCode != 91) {
      setMode('typing');
    }
  };

  function setEventHandlers () {
    util.addEvent(panels.input, 'keypress', preventCtrlYZ);
    util.addEvent(panels.input, 'keydown', handleCtrlYZ);
    util.addEvent(panels.input, 'keydown', handleModeChange);
    util.addEvent(panels.input, 'mousedown', function () {
      setMode('moving');
    });

    panels.input.onpaste = handlePaste;
    panels.input.ondrop = handlePaste;
  }

  function handlePaste () {
    if (ua.isIE || (inputState && inputState.text != panels.input.value)) {
      if (timer == void 0) {
        mode = 'paste';
        saveState();
        refreshState();
      }
    }
  }

  function init () {
    setEventHandlers();
    refreshState(true);
    saveState();
  };

  init();
}

module.exports = UndoManager;

},{"./TextareaState":66,"./ua":72,"./util":74}],69:[function(_dereq_,module,exports){
'use strict';

var ultramarked = _dereq_('ultramarked');

ultramarked.setOptions({
  smartLists: true,
  ultralight: true,
  ultrasanitize: true
});

module.exports = ultramarked;

},{"ultramarked":58}],70:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;
var ui = _dereq_('./ui');
var util = _dereq_('./util');
var Editor = _dereq_('./Editor');
var nextId = 0;

function convertTabs () {
  util.addEventDelegate(doc, 'pmk-input', 'keydown', ui.convertTabs);
}

function ponymark (container) {
  var postfix = nextId++;
  markup(container, postfix);
  var editor = new Editor(postfix);
  editor.run();
}

function markup (container, postfix) {
  var buttonBar = doc.createElement('div');
  var preview = doc.createElement('div');
  var input = doc.createElement('textarea');

  buttonBar.id = 'pmk-buttons-' + postfix;
  buttonBar.className = 'pmk-buttons';
  preview.id = 'pmk-preview-' + postfix;
  preview.className = 'pmk-preview';
  input.id = 'pmk-input-' + postfix;
  input.className = 'pmk-input';

  container.appendChild(buttonBar);
  container.appendChild(input);
  container.appendChild(preview);
}

module.exports = ponymark;

ponymark.Editor = Editor;
ponymark.convertTabs = convertTabs;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Editor":62,"./ui":73,"./util":74}],71:[function(_dereq_,module,exports){
(function (global){
'use strict';

var doc = global.document;

function getTop (elem, isInner) {
  var result = elem.offsetTop;
  if (!isInner) {
    while (elem = elem.offsetParent) {
      result += elem.offsetTop;
    }
  }
  return result;
};

function getHeight (elem) {
  return elem.offsetHeight || elem.scrollHeight;
};

function getWidth (elem) {
  return elem.offsetWidth || elem.scrollWidth;
};

function getPageSize () {
  var scrollWidth, scrollHeight;
  var innerWidth, innerHeight;

  if (self.innerHeight && self.scrollMaxY) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = self.innerHeight + self.scrollMaxY;
  } else if (doc.body.scrollHeight > doc.body.offsetHeight) {
    scrollWidth = doc.body.scrollWidth;
    scrollHeight = doc.body.scrollHeight;
  } else {
    scrollWidth = doc.body.offsetWidth;
    scrollHeight = doc.body.offsetHeight;
  }

  if (self.innerHeight) {
    innerWidth = self.innerWidth;
    innerHeight = self.innerHeight;
  } else if (doc.documentElement && doc.documentElement.clientHeight) {
    innerWidth = doc.documentElement.clientWidth;
    innerHeight = doc.documentElement.clientHeight;
  } else if (doc.body) {
    innerWidth = doc.body.clientWidth;
    innerHeight = doc.body.clientHeight;
  }

  var maxWidth = Math.max(scrollWidth, innerWidth);
  var maxHeight = Math.max(scrollHeight, innerHeight);
  return [maxWidth, maxHeight, innerWidth, innerHeight];
};

module.exports = {
  getTop: getTop,
  getHeight: getHeight,
  getWidth: getWidth,
  getPageSize: getPageSize
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],72:[function(_dereq_,module,exports){
'use strict';

var nav = window.navigator;
var ua = nav.userAgent.toLowerCase();
var uaSniffer = {
  isIE: /msie/.test(ua),
  isIE_5or6: /msie [56]/.test(ua),
  isOpera: /opera/.test(ua),
  isChrome: /chrome/.test(ua),
  isWindows: /win/i.test(nav.platform)
};

module.exports = uaSniffer;

},{}],73:[function(_dereq_,module,exports){
'use strict';

function prompt (partialName, cb) {
  var body = $('body');
  var partial = nbrut.tt.partial(partialName, { complete: complete });

  partial.appendTo(body);

  function complete (text){
    if (text !== null){ // Fixes common pasting errors.
      text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
      if (text[0] !== '/' && !/^(?:https?|ftp):\/\//.test(text)){
        text = 'http://' + text;
      }
    }

    cb(text);
  }
};

function convertTabs (e) {
  var ta = e.target;
  var keyCode = e.charCode || e.keyCode;
  if (keyCode !== 9) {
    return;
  }
  e.preventDefault();

  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var val = ta.value;
  var left = val.substring(0, start);
  var right = val.substring(end);

  ta.value = left + '    ' + right;
  ta.selectionStart = ta.selectionEnd = start + 4;
}

module.exports = {
  prompt: prompt,
  convertTabs: convertTabs
};

},{}],74:[function(_dereq_,module,exports){
'use strict';

function isVisible (elem) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(elem, null).getPropertyValue('display') !== 'none';
  } else if (elem.currentStyle) {
    return elem.currentStyle.display !== 'none';
  }
}

function addEvent (elem, type, listener) {
  if (elem.attachEvent) {
    elem.attachEvent('on' + type, listener);
  } else {
    elem.addEventListener(type, listener, false);
  }
}

function addEventDelegate (elem, className, type, listener) {
  var regex = new RegExp('\b' + className + '\b');

  if (elem.attachEvent) {
    elem.attachEvent('on' + type, delegator);
  } else {
    elem.addEventListener(type, delegator, false);
  }
  function delegator (e) {
    var self = this;
    var args = arguments;
    var elem = e.target;
    if (elem.classList) {
      if (elem.classList.contains(className)) {
        fire();
      }
    } else {
      if (elem.className.match(regex)) {
        fire();
      }
    }

    function fire () {
      listener.apply(self, args);
    }
  }
}

function removeEvent (elem, event, listener) {
  if (elem.detachEvent) {
    elem.detachEvent('on' + event, listener);
  } else {
    elem.removeEventListener(event, listener, false);
  }
}

function fixEolChars (text) {
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\r/g, '\n');
  return text;
}

function extendRegExp (regex, pre, post) {
  if (pre === null || pre === void 0) {
    pre = '';
  }
  if (post === null || post === void 0) {
    post = '';
  }

  var pattern = regex.toString();
  var flags;

  pattern = pattern.replace(/\/([gim]*)$/, function (wholeMatch, flagsPart) {
    flags = flagsPart;
    return '';
  });
  pattern = pattern.replace(/(^\/|\/$)/g, '');
  pattern = pre + pattern + post;
  return new RegExp(pattern, flags);
}

module.exports = {
  isVisible: isVisible,
  addEvent: addEvent,
  addEventDelegate: addEventDelegate,
  removeEvent: removeEvent,
  fixEolChars: fixEolChars,
  extendRegExp: extendRegExp
};

},{}]},{},[70])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oZS9oZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzLzFjLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYWN0aW9uc2NyaXB0LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYXBhY2hlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYXBwbGVzY3JpcHQuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hdnJhc20uanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9heGFwdGEuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9iYXNoLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYnJhaW5mdWNrLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY2xvanVyZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2NtYWtlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY29mZmVlc2NyaXB0LmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY3BwLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY3MuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jc3MuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZGVscGhpLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZGlmZi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2RqYW5nby5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2Rvcy5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2VybGFuZy1yZXBsLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXJsYW5nLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZ2xzbC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2dvLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaGFza2VsbC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2hpZ2hsaWdodC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2h0dHAuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9pbmkuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9qYXZhLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvamF2YXNjcmlwdC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2pzb24uanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9saXNwLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbHVhLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbWFya2Rvd24uanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9tYXRsYWIuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9tZWwuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9uZ2lueC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL29iamVjdGl2ZWMuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9wYXJzZXIzLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGVybC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3BocC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3Byb2ZpbGUuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9weXRob24uanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9yLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcmliLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnNsLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnVieS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3J1c3QuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zY2FsYS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3NtYWxsdGFsay5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3NxbC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3RleC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3ZhbGEuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy92YnNjcmlwdC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3ZoZGwuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy94bWwuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9ub2RlX21vZHVsZXMvdWx0cmFtYXJrZWQvbm9kZV9tb2R1bGVzL21hcmtlZC9saWIvbWFya2VkLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL25vZGVfbW9kdWxlcy91bHRyYW1hcmtlZC9zcmMvc2FuaXRpemVyLXBhZ2Vkb3duLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvbm9kZV9tb2R1bGVzL3VsdHJhbWFya2VkL3NyYy9zYW5pdGl6ZXIuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvQ29tbWFuZE1hbmFnZXIuanMiLCIvVXNlcnMvbmljby9uaWNvL2dpdC9wb255bWFyay9zcmMvRWRpdG9yLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL0hvb2tDb2xsZWN0aW9uLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1BhbmVsQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9QcmV2aWV3TWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9UZXh0YXJlYVN0YXRlLmpzIiwiL1VzZXJzL25pY28vbmljby9naXQvcG9ueW1hcmsvc3JjL1VJTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9VbmRvTWFuYWdlci5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wYXJzZS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb255bWFyay5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy9wb3NpdGlvbi5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91YS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91aS5qcyIsIi9Vc2Vycy9uaWNvL25pY28vZ2l0L3BvbnltYXJrL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL29DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyohIGh0dHA6Ly9tdGhzLmJlL2hlIHYwLjQuMSBieSBAbWF0aGlhcyB8IE1JVCBsaWNlbnNlICovXG47KGZ1bmN0aW9uKHJvb3QpIHtcblxuXHQvLyBEZXRlY3QgZnJlZSB2YXJpYWJsZXMgYGV4cG9ydHNgLlxuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzO1xuXG5cdC8vIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLlxuXHR2YXIgZnJlZU1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmXG5cdFx0bW9kdWxlLmV4cG9ydHMgPT0gZnJlZUV4cG9ydHMgJiYgbW9kdWxlO1xuXG5cdC8vIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgLCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUsXG5cdC8vIGFuZCB1c2UgaXQgYXMgYHJvb3RgLlxuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdC8vIEFsbCBhc3RyYWwgc3ltYm9scy5cblx0dmFyIHJlZ2V4QXN0cmFsU3ltYm9scyA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdL2c7XG5cdC8vIEFsbCBBU0NJSSBzeW1ib2xzIChub3QganVzdCBwcmludGFibGUgQVNDSUkpIGV4Y2VwdCB0aG9zZSBsaXN0ZWQgaW4gdGhlXG5cdC8vIGZpcnN0IGNvbHVtbiBvZiB0aGUgb3ZlcnJpZGVzIHRhYmxlLlxuXHQvLyBodHRwOi8vd2hhdHdnLm9yZy9odG1sL3Rva2VuaXphdGlvbi5odG1sI3RhYmxlLWNoYXJyZWYtb3ZlcnJpZGVzXG5cdHZhciByZWdleEFzY2lpV2hpdGVsaXN0ID0gL1tcXHgwMS1cXHg3Rl0vZztcblx0Ly8gQWxsIEJNUCBzeW1ib2xzIHRoYXQgYXJlIG5vdCBBU0NJSSBuZXdsaW5lcywgcHJpbnRhYmxlIEFTQ0lJIHN5bWJvbHMsIG9yXG5cdC8vIGNvZGUgcG9pbnRzIGxpc3RlZCBpbiB0aGUgZmlyc3QgY29sdW1uIG9mIHRoZSBvdmVycmlkZXMgdGFibGUgb25cblx0Ly8gaHR0cDovL3doYXR3Zy5vcmcvaHRtbC90b2tlbml6YXRpb24uaHRtbCN0YWJsZS1jaGFycmVmLW92ZXJyaWRlcy5cblx0dmFyIHJlZ2V4Qm1wV2hpdGVsaXN0ID0gL1tcXHgwMS1cXHRcXHgwQlxcZlxceDBFLVxceDFGXFx4N0ZcXHg4MVxceDhEXFx4OEZcXHg5MFxceDlEXFx4QTAtXFx1RkZGRl0vZztcblxuXHR2YXIgcmVnZXhFbmNvZGVOb25Bc2NpaSA9IC88XFx1MjBEMnw9XFx1MjBFNXw+XFx1MjBEMnxcXHUyMDVGXFx1MjAwQXxcXHUyMTlEXFx1MDMzOHxcXHUyMjAyXFx1MDMzOHxcXHUyMjIwXFx1MjBEMnxcXHUyMjI5XFx1RkUwMHxcXHUyMjJBXFx1RkUwMHxcXHUyMjNDXFx1MjBEMnxcXHUyMjNEXFx1MDMzMXxcXHUyMjNFXFx1MDMzM3xcXHUyMjQyXFx1MDMzOHxcXHUyMjRCXFx1MDMzOHxcXHUyMjREXFx1MjBEMnxcXHUyMjRFXFx1MDMzOHxcXHUyMjRGXFx1MDMzOHxcXHUyMjUwXFx1MDMzOHxcXHUyMjYxXFx1MjBFNXxcXHUyMjY0XFx1MjBEMnxcXHUyMjY1XFx1MjBEMnxcXHUyMjY2XFx1MDMzOHxcXHUyMjY3XFx1MDMzOHxcXHUyMjY4XFx1RkUwMHxcXHUyMjY5XFx1RkUwMHxcXHUyMjZBXFx1MDMzOHxcXHUyMjZBXFx1MjBEMnxcXHUyMjZCXFx1MDMzOHxcXHUyMjZCXFx1MjBEMnxcXHUyMjdGXFx1MDMzOHxcXHUyMjgyXFx1MjBEMnxcXHUyMjgzXFx1MjBEMnxcXHUyMjhBXFx1RkUwMHxcXHUyMjhCXFx1RkUwMHxcXHUyMjhGXFx1MDMzOHxcXHUyMjkwXFx1MDMzOHxcXHUyMjkzXFx1RkUwMHxcXHUyMjk0XFx1RkUwMHxcXHUyMkI0XFx1MjBEMnxcXHUyMkI1XFx1MjBEMnxcXHUyMkQ4XFx1MDMzOHxcXHUyMkQ5XFx1MDMzOHxcXHUyMkRBXFx1RkUwMHxcXHUyMkRCXFx1RkUwMHxcXHUyMkY1XFx1MDMzOHxcXHUyMkY5XFx1MDMzOHxcXHUyOTMzXFx1MDMzOHxcXHUyOUNGXFx1MDMzOHxcXHUyOUQwXFx1MDMzOHxcXHUyQTZEXFx1MDMzOHxcXHUyQTcwXFx1MDMzOHxcXHUyQTdEXFx1MDMzOHxcXHUyQTdFXFx1MDMzOHxcXHUyQUExXFx1MDMzOHxcXHUyQUEyXFx1MDMzOHxcXHUyQUFDXFx1RkUwMHxcXHUyQUFEXFx1RkUwMHxcXHUyQUFGXFx1MDMzOHxcXHUyQUIwXFx1MDMzOHxcXHUyQUM1XFx1MDMzOHxcXHUyQUM2XFx1MDMzOHxcXHUyQUNCXFx1RkUwMHxcXHUyQUNDXFx1RkUwMHxcXHUyQUZEXFx1MjBFNXxbXFx4QTAtXFx1MDExM1xcdTAxMTYtXFx1MDEyMlxcdTAxMjQtXFx1MDEyQlxcdTAxMkUtXFx1MDE0RFxcdTAxNTAtXFx1MDE3RVxcdTAxOTJcXHUwMUI1XFx1MDFGNVxcdTAyMzdcXHUwMkM2XFx1MDJDN1xcdTAyRDgtXFx1MDJERFxcdTAzMTFcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQTlcXHUwM0IxLVxcdTAzQzlcXHUwM0QxXFx1MDNEMlxcdTAzRDVcXHUwM0Q2XFx1MDNEQ1xcdTAzRERcXHUwM0YwXFx1MDNGMVxcdTAzRjVcXHUwM0Y2XFx1MDQwMS1cXHUwNDBDXFx1MDQwRS1cXHUwNDRGXFx1MDQ1MS1cXHUwNDVDXFx1MDQ1RVxcdTA0NUZcXHUyMDAyLVxcdTIwMDVcXHUyMDA3LVxcdTIwMTBcXHUyMDEzLVxcdTIwMTZcXHUyMDE4LVxcdTIwMUFcXHUyMDFDLVxcdTIwMUVcXHUyMDIwLVxcdTIwMjJcXHUyMDI1XFx1MjAyNlxcdTIwMzAtXFx1MjAzNVxcdTIwMzlcXHUyMDNBXFx1MjAzRVxcdTIwNDFcXHUyMDQzXFx1MjA0NFxcdTIwNEZcXHUyMDU3XFx1MjA1Ri1cXHUyMDYzXFx1MjBBQ1xcdTIwREJcXHUyMERDXFx1MjEwMlxcdTIxMDVcXHUyMTBBLVxcdTIxMTNcXHUyMTE1LVxcdTIxMUVcXHUyMTIyXFx1MjEyNFxcdTIxMjctXFx1MjEyOVxcdTIxMkNcXHUyMTJEXFx1MjEyRi1cXHUyMTMxXFx1MjEzMy1cXHUyMTM4XFx1MjE0NS1cXHUyMTQ4XFx1MjE1My1cXHUyMTVFXFx1MjE5MC1cXHUyMTlCXFx1MjE5RC1cXHUyMUE3XFx1MjFBOS1cXHUyMUFFXFx1MjFCMC1cXHUyMUIzXFx1MjFCNS1cXHUyMUI3XFx1MjFCQS1cXHUyMURCXFx1MjFERFxcdTIxRTRcXHUyMUU1XFx1MjFGNVxcdTIxRkQtXFx1MjIwNVxcdTIyMDctXFx1MjIwOVxcdTIyMEJcXHUyMjBDXFx1MjIwRi1cXHUyMjE0XFx1MjIxNi1cXHUyMjE4XFx1MjIxQVxcdTIyMUQtXFx1MjIzOFxcdTIyM0EtXFx1MjI1N1xcdTIyNTlcXHUyMjVBXFx1MjI1Q1xcdTIyNUYtXFx1MjI2MlxcdTIyNjQtXFx1MjI4QlxcdTIyOEQtXFx1MjI5QlxcdTIyOUQtXFx1MjJBNVxcdTIyQTctXFx1MjJCMFxcdTIyQjItXFx1MjJCQlxcdTIyQkQtXFx1MjJEQlxcdTIyREUtXFx1MjJFM1xcdTIyRTYtXFx1MjJGN1xcdTIyRjktXFx1MjJGRVxcdTIzMDVcXHUyMzA2XFx1MjMwOC1cXHUyMzEwXFx1MjMxMlxcdTIzMTNcXHUyMzE1XFx1MjMxNlxcdTIzMUMtXFx1MjMxRlxcdTIzMjJcXHUyMzIzXFx1MjMyRFxcdTIzMkVcXHUyMzM2XFx1MjMzRFxcdTIzM0ZcXHUyMzdDXFx1MjNCMFxcdTIzQjFcXHUyM0I0LVxcdTIzQjZcXHUyM0RDLVxcdTIzREZcXHUyM0UyXFx1MjNFN1xcdTI0MjNcXHUyNEM4XFx1MjUwMFxcdTI1MDJcXHUyNTBDXFx1MjUxMFxcdTI1MTRcXHUyNTE4XFx1MjUxQ1xcdTI1MjRcXHUyNTJDXFx1MjUzNFxcdTI1M0NcXHUyNTUwLVxcdTI1NkNcXHUyNTgwXFx1MjU4NFxcdTI1ODhcXHUyNTkxLVxcdTI1OTNcXHUyNUExXFx1MjVBQVxcdTI1QUJcXHUyNUFEXFx1MjVBRVxcdTI1QjFcXHUyNUIzLVxcdTI1QjVcXHUyNUI4XFx1MjVCOVxcdTI1QkQtXFx1MjVCRlxcdTI1QzJcXHUyNUMzXFx1MjVDQVxcdTI1Q0JcXHUyNUVDXFx1MjVFRlxcdTI1RjgtXFx1MjVGQ1xcdTI2MDVcXHUyNjA2XFx1MjYwRVxcdTI2NDBcXHUyNjQyXFx1MjY2MFxcdTI2NjNcXHUyNjY1XFx1MjY2NlxcdTI2NkFcXHUyNjZELVxcdTI2NkZcXHUyNzEzXFx1MjcxN1xcdTI3MjBcXHUyNzM2XFx1Mjc1OFxcdTI3NzJcXHUyNzczXFx1MjdDOFxcdTI3QzlcXHUyN0U2LVxcdTI3RURcXHUyN0Y1LVxcdTI3RkFcXHUyN0ZDXFx1MjdGRlxcdTI5MDItXFx1MjkwNVxcdTI5MEMtXFx1MjkxM1xcdTI5MTZcXHUyOTE5LVxcdTI5MjBcXHUyOTIzLVxcdTI5MkFcXHUyOTMzXFx1MjkzNS1cXHUyOTM5XFx1MjkzQ1xcdTI5M0RcXHUyOTQ1XFx1Mjk0OC1cXHUyOTRCXFx1Mjk0RS1cXHUyOTc2XFx1Mjk3OFxcdTI5NzlcXHUyOTdCLVxcdTI5N0ZcXHUyOTg1XFx1Mjk4NlxcdTI5OEItXFx1Mjk5NlxcdTI5OUFcXHUyOTlDXFx1Mjk5RFxcdTI5QTQtXFx1MjlCN1xcdTI5QjlcXHUyOUJCXFx1MjlCQ1xcdTI5QkUtXFx1MjlDNVxcdTI5QzlcXHUyOUNELVxcdTI5RDBcXHUyOURDLVxcdTI5REVcXHUyOUUzLVxcdTI5RTVcXHUyOUVCXFx1MjlGNFxcdTI5RjZcXHUyQTAwLVxcdTJBMDJcXHUyQTA0XFx1MkEwNlxcdTJBMENcXHUyQTBEXFx1MkExMC1cXHUyQTE3XFx1MkEyMi1cXHUyQTI3XFx1MkEyOVxcdTJBMkFcXHUyQTJELVxcdTJBMzFcXHUyQTMzLVxcdTJBM0NcXHUyQTNGXFx1MkE0MFxcdTJBNDItXFx1MkE0RFxcdTJBNTBcXHUyQTUzLVxcdTJBNThcXHUyQTVBLVxcdTJBNURcXHUyQTVGXFx1MkE2NlxcdTJBNkFcXHUyQTZELVxcdTJBNzVcXHUyQTc3LVxcdTJBOUFcXHUyQTlELVxcdTJBQTJcXHUyQUE0LVxcdTJBQjBcXHUyQUIzLVxcdTJBQzhcXHUyQUNCXFx1MkFDQ1xcdTJBQ0YtXFx1MkFEQlxcdTJBRTRcXHUyQUU2LVxcdTJBRTlcXHUyQUVCLVxcdTJBRjNcXHUyQUZEXFx1RkIwMC1cXHVGQjA0XXxcXHVEODM1W1xcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdURDQ0ZcXHVERDA0XFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMUUtXFx1REQzOVxcdUREM0ItXFx1REQzRVxcdURENDAtXFx1REQ0NFxcdURENDZcXHVERDRBLVxcdURENTBcXHVERDUyLVxcdURENkJdL2c7XG5cdHZhciBlbmNvZGVNYXAgPSB7J1xceEMxJzonQWFjdXRlJywnXFx4RTEnOidhYWN1dGUnLCdcXHUwMTAyJzonQWJyZXZlJywnXFx1MDEwMyc6J2FicmV2ZScsJ1xcdTIyM0UnOidhYycsJ1xcdTIyM0YnOidhY2QnLCdcXHUyMjNFXFx1MDMzMyc6J2FjRScsJ1xceEMyJzonQWNpcmMnLCdcXHhFMic6J2FjaXJjJywnXFx4QjQnOidhY3V0ZScsJ1xcdTA0MTAnOidBY3knLCdcXHUwNDMwJzonYWN5JywnXFx4QzYnOidBRWxpZycsJ1xceEU2JzonYWVsaWcnLCdcXHUyMDYxJzonYWYnLCdcXHVEODM1XFx1REQwNCc6J0FmcicsJ1xcdUQ4MzVcXHVERDFFJzonYWZyJywnXFx4QzAnOidBZ3JhdmUnLCdcXHhFMCc6J2FncmF2ZScsJ1xcdTIxMzUnOidhbGVwaCcsJ1xcdTAzOTEnOidBbHBoYScsJ1xcdTAzQjEnOidhbHBoYScsJ1xcdTAxMDAnOidBbWFjcicsJ1xcdTAxMDEnOidhbWFjcicsJ1xcdTJBM0YnOidhbWFsZycsJyYnOidhbXAnLCdcXHUyQTU1JzonYW5kYW5kJywnXFx1MkE1Myc6J0FuZCcsJ1xcdTIyMjcnOidhbmQnLCdcXHUyQTVDJzonYW5kZCcsJ1xcdTJBNTgnOidhbmRzbG9wZScsJ1xcdTJBNUEnOidhbmR2JywnXFx1MjIyMCc6J2FuZycsJ1xcdTI5QTQnOidhbmdlJywnXFx1MjlBOCc6J2FuZ21zZGFhJywnXFx1MjlBOSc6J2FuZ21zZGFiJywnXFx1MjlBQSc6J2FuZ21zZGFjJywnXFx1MjlBQic6J2FuZ21zZGFkJywnXFx1MjlBQyc6J2FuZ21zZGFlJywnXFx1MjlBRCc6J2FuZ21zZGFmJywnXFx1MjlBRSc6J2FuZ21zZGFnJywnXFx1MjlBRic6J2FuZ21zZGFoJywnXFx1MjIyMSc6J2FuZ21zZCcsJ1xcdTIyMUYnOidhbmdydCcsJ1xcdTIyQkUnOidhbmdydHZiJywnXFx1Mjk5RCc6J2FuZ3J0dmJkJywnXFx1MjIyMic6J2FuZ3NwaCcsJ1xceEM1JzonYW5nc3QnLCdcXHUyMzdDJzonYW5nemFycicsJ1xcdTAxMDQnOidBb2dvbicsJ1xcdTAxMDUnOidhb2dvbicsJ1xcdUQ4MzVcXHVERDM4JzonQW9wZicsJ1xcdUQ4MzVcXHVERDUyJzonYW9wZicsJ1xcdTJBNkYnOidhcGFjaXInLCdcXHUyMjQ4JzonYXAnLCdcXHUyQTcwJzonYXBFJywnXFx1MjI0QSc6J2FwZScsJ1xcdTIyNEInOidhcGlkJywnXFwnJzonYXBvcycsJ1xceEU1JzonYXJpbmcnLCdcXHVEODM1XFx1REM5Qyc6J0FzY3InLCdcXHVEODM1XFx1RENCNic6J2FzY3InLCdcXHUyMjU0JzonY29sb25lJywnKic6J2FzdCcsJ1xcdTIyNEQnOidDdXBDYXAnLCdcXHhDMyc6J0F0aWxkZScsJ1xceEUzJzonYXRpbGRlJywnXFx4QzQnOidBdW1sJywnXFx4RTQnOidhdW1sJywnXFx1MjIzMyc6J2F3Y29uaW50JywnXFx1MkExMSc6J2F3aW50JywnXFx1MjI0Qyc6J2Jjb25nJywnXFx1MDNGNic6J2JlcHNpJywnXFx1MjAzNSc6J2JwcmltZScsJ1xcdTIyM0QnOidic2ltJywnXFx1MjJDRCc6J2JzaW1lJywnXFx1MjIxNic6J3NldG1uJywnXFx1MkFFNyc6J0JhcnYnLCdcXHUyMkJEJzonYmFydmVlJywnXFx1MjMwNSc6J2JhcndlZCcsJ1xcdTIzMDYnOidCYXJ3ZWQnLCdcXHUyM0I1JzonYmJyaycsJ1xcdTIzQjYnOidiYnJrdGJyaycsJ1xcdTA0MTEnOidCY3knLCdcXHUwNDMxJzonYmN5JywnXFx1MjAxRSc6J2JkcXVvJywnXFx1MjIzNSc6J2JlY2F1cycsJ1xcdTI5QjAnOidiZW1wdHl2JywnXFx1MjEyQyc6J0JzY3InLCdcXHUwMzkyJzonQmV0YScsJ1xcdTAzQjInOidiZXRhJywnXFx1MjEzNic6J2JldGgnLCdcXHUyMjZDJzondHdpeHQnLCdcXHVEODM1XFx1REQwNSc6J0JmcicsJ1xcdUQ4MzVcXHVERDFGJzonYmZyJywnXFx1MjJDMic6J3hjYXAnLCdcXHUyNUVGJzoneGNpcmMnLCdcXHUyMkMzJzoneGN1cCcsJ1xcdTJBMDAnOid4b2RvdCcsJ1xcdTJBMDEnOid4b3BsdXMnLCdcXHUyQTAyJzoneG90aW1lJywnXFx1MkEwNic6J3hzcWN1cCcsJ1xcdTI2MDUnOidzdGFyZicsJ1xcdTI1QkQnOid4ZHRyaScsJ1xcdTI1QjMnOid4dXRyaScsJ1xcdTJBMDQnOid4dXBsdXMnLCdcXHUyMkMxJzonVmVlJywnXFx1MjJDMCc6J1dlZGdlJywnXFx1MjkwRCc6J3JiYXJyJywnXFx1MjlFQic6J2xvemYnLCdcXHUyNUFBJzonc3F1ZicsJ1xcdTI1QjQnOid1dHJpZicsJ1xcdTI1QkUnOidkdHJpZicsJ1xcdTI1QzInOidsdHJpZicsJ1xcdTI1QjgnOidydHJpZicsJ1xcdTI0MjMnOidibGFuaycsJ1xcdTI1OTInOidibGsxMicsJ1xcdTI1OTEnOidibGsxNCcsJ1xcdTI1OTMnOidibGszNCcsJ1xcdTI1ODgnOidibG9jaycsJz1cXHUyMEU1JzonYm5lJywnXFx1MjI2MVxcdTIwRTUnOidibmVxdWl2JywnXFx1MkFFRCc6J2JOb3QnLCdcXHUyMzEwJzonYm5vdCcsJ1xcdUQ4MzVcXHVERDM5JzonQm9wZicsJ1xcdUQ4MzVcXHVERDUzJzonYm9wZicsJ1xcdTIyQTUnOidib3QnLCdcXHUyMkM4JzonYm93dGllJywnXFx1MjlDOSc6J2JveGJveCcsJ1xcdTI1MTAnOidib3hkbCcsJ1xcdTI1NTUnOidib3hkTCcsJ1xcdTI1NTYnOidib3hEbCcsJ1xcdTI1NTcnOidib3hETCcsJ1xcdTI1MEMnOidib3hkcicsJ1xcdTI1NTInOidib3hkUicsJ1xcdTI1NTMnOidib3hEcicsJ1xcdTI1NTQnOidib3hEUicsJ1xcdTI1MDAnOidib3hoJywnXFx1MjU1MCc6J2JveEgnLCdcXHUyNTJDJzonYm94aGQnLCdcXHUyNTY0JzonYm94SGQnLCdcXHUyNTY1JzonYm94aEQnLCdcXHUyNTY2JzonYm94SEQnLCdcXHUyNTM0JzonYm94aHUnLCdcXHUyNTY3JzonYm94SHUnLCdcXHUyNTY4JzonYm94aFUnLCdcXHUyNTY5JzonYm94SFUnLCdcXHUyMjlGJzonbWludXNiJywnXFx1MjI5RSc6J3BsdXNiJywnXFx1MjJBMCc6J3RpbWVzYicsJ1xcdTI1MTgnOidib3h1bCcsJ1xcdTI1NUInOidib3h1TCcsJ1xcdTI1NUMnOidib3hVbCcsJ1xcdTI1NUQnOidib3hVTCcsJ1xcdTI1MTQnOidib3h1cicsJ1xcdTI1NTgnOidib3h1UicsJ1xcdTI1NTknOidib3hVcicsJ1xcdTI1NUEnOidib3hVUicsJ1xcdTI1MDInOidib3h2JywnXFx1MjU1MSc6J2JveFYnLCdcXHUyNTNDJzonYm94dmgnLCdcXHUyNTZBJzonYm94dkgnLCdcXHUyNTZCJzonYm94VmgnLCdcXHUyNTZDJzonYm94VkgnLCdcXHUyNTI0JzonYm94dmwnLCdcXHUyNTYxJzonYm94dkwnLCdcXHUyNTYyJzonYm94VmwnLCdcXHUyNTYzJzonYm94VkwnLCdcXHUyNTFDJzonYm94dnInLCdcXHUyNTVFJzonYm94dlInLCdcXHUyNTVGJzonYm94VnInLCdcXHUyNTYwJzonYm94VlInLCdcXHUwMkQ4JzonYnJldmUnLCdcXHhBNic6J2JydmJhcicsJ1xcdUQ4MzVcXHVEQ0I3JzonYnNjcicsJ1xcdTIwNEYnOidic2VtaScsJ1xcdTI5QzUnOidic29sYicsJ1xcXFwnOidic29sJywnXFx1MjdDOCc6J2Jzb2xoc3ViJywnXFx1MjAyMic6J2J1bGwnLCdcXHUyMjRFJzonYnVtcCcsJ1xcdTJBQUUnOididW1wRScsJ1xcdTIyNEYnOididW1wZScsJ1xcdTAxMDYnOidDYWN1dGUnLCdcXHUwMTA3JzonY2FjdXRlJywnXFx1MkE0NCc6J2NhcGFuZCcsJ1xcdTJBNDknOidjYXBicmN1cCcsJ1xcdTJBNEInOidjYXBjYXAnLCdcXHUyMjI5JzonY2FwJywnXFx1MjJEMic6J0NhcCcsJ1xcdTJBNDcnOidjYXBjdXAnLCdcXHUyQTQwJzonY2FwZG90JywnXFx1MjE0NSc6J0REJywnXFx1MjIyOVxcdUZFMDAnOidjYXBzJywnXFx1MjA0MSc6J2NhcmV0JywnXFx1MDJDNyc6J2Nhcm9uJywnXFx1MjEyRCc6J0NmcicsJ1xcdTJBNEQnOidjY2FwcycsJ1xcdTAxMEMnOidDY2Fyb24nLCdcXHUwMTBEJzonY2Nhcm9uJywnXFx4QzcnOidDY2VkaWwnLCdcXHhFNyc6J2NjZWRpbCcsJ1xcdTAxMDgnOidDY2lyYycsJ1xcdTAxMDknOidjY2lyYycsJ1xcdTIyMzAnOidDY29uaW50JywnXFx1MkE0Qyc6J2NjdXBzJywnXFx1MkE1MCc6J2NjdXBzc20nLCdcXHUwMTBBJzonQ2RvdCcsJ1xcdTAxMEInOidjZG90JywnXFx4QjgnOidjZWRpbCcsJ1xcdTI5QjInOidjZW1wdHl2JywnXFx4QTInOidjZW50JywnXFx4QjcnOidtaWRkb3QnLCdcXHVEODM1XFx1REQyMCc6J2NmcicsJ1xcdTA0MjcnOidDSGN5JywnXFx1MDQ0Nyc6J2NoY3knLCdcXHUyNzEzJzonY2hlY2snLCdcXHUwM0E3JzonQ2hpJywnXFx1MDNDNyc6J2NoaScsJ1xcdTAyQzYnOidjaXJjJywnXFx1MjI1Nyc6J2NpcmUnLCdcXHUyMUJBJzonb2xhcnInLCdcXHUyMUJCJzonb3JhcnInLCdcXHUyMjlCJzonb2FzdCcsJ1xcdTIyOUEnOidvY2lyJywnXFx1MjI5RCc6J29kYXNoJywnXFx1MjI5OSc6J29kb3QnLCdcXHhBRSc6J3JlZycsJ1xcdTI0QzgnOidvUycsJ1xcdTIyOTYnOidvbWludXMnLCdcXHUyMjk1Jzonb3BsdXMnLCdcXHUyMjk3Jzonb3RpbWVzJywnXFx1MjVDQic6J2NpcicsJ1xcdTI5QzMnOidjaXJFJywnXFx1MkExMCc6J2NpcmZuaW50JywnXFx1MkFFRic6J2Npcm1pZCcsJ1xcdTI5QzInOidjaXJzY2lyJywnXFx1MjIzMic6J2N3Y29uaW50JywnXFx1MjAxRCc6J3JkcXVvJywnXFx1MjAxOSc6J3JzcXVvJywnXFx1MjY2Myc6J2NsdWJzJywnOic6J2NvbG9uJywnXFx1MjIzNyc6J0NvbG9uJywnXFx1MkE3NCc6J0NvbG9uZScsJywnOidjb21tYScsJ0AnOidjb21tYXQnLCdcXHUyMjAxJzonY29tcCcsJ1xcdTIyMTgnOidjb21wZm4nLCdcXHUyMTAyJzonQ29wZicsJ1xcdTIyNDUnOidjb25nJywnXFx1MkE2RCc6J2Nvbmdkb3QnLCdcXHUyMjYxJzonZXF1aXYnLCdcXHUyMjJFJzonb2ludCcsJ1xcdTIyMkYnOidDb25pbnQnLCdcXHVEODM1XFx1REQ1NCc6J2NvcGYnLCdcXHUyMjEwJzonY29wcm9kJywnXFx4QTknOidjb3B5JywnXFx1MjExNyc6J2NvcHlzcicsJ1xcdTIxQjUnOidjcmFycicsJ1xcdTI3MTcnOidjcm9zcycsJ1xcdTJBMkYnOidDcm9zcycsJ1xcdUQ4MzVcXHVEQzlFJzonQ3NjcicsJ1xcdUQ4MzVcXHVEQ0I4JzonY3NjcicsJ1xcdTJBQ0YnOidjc3ViJywnXFx1MkFEMSc6J2NzdWJlJywnXFx1MkFEMCc6J2NzdXAnLCdcXHUyQUQyJzonY3N1cGUnLCdcXHUyMkVGJzonY3Rkb3QnLCdcXHUyOTM4JzonY3VkYXJybCcsJ1xcdTI5MzUnOidjdWRhcnJyJywnXFx1MjJERSc6J2N1ZXByJywnXFx1MjJERic6J2N1ZXNjJywnXFx1MjFCNic6J2N1bGFycicsJ1xcdTI5M0QnOidjdWxhcnJwJywnXFx1MkE0OCc6J2N1cGJyY2FwJywnXFx1MkE0Nic6J2N1cGNhcCcsJ1xcdTIyMkEnOidjdXAnLCdcXHUyMkQzJzonQ3VwJywnXFx1MkE0QSc6J2N1cGN1cCcsJ1xcdTIyOEQnOidjdXBkb3QnLCdcXHUyQTQ1JzonY3Vwb3InLCdcXHUyMjJBXFx1RkUwMCc6J2N1cHMnLCdcXHUyMUI3JzonY3VyYXJyJywnXFx1MjkzQyc6J2N1cmFycm0nLCdcXHUyMkNFJzonY3V2ZWUnLCdcXHUyMkNGJzonY3V3ZWQnLCdcXHhBNCc6J2N1cnJlbicsJ1xcdTIyMzEnOidjd2ludCcsJ1xcdTIzMkQnOidjeWxjdHknLCdcXHUyMDIwJzonZGFnZ2VyJywnXFx1MjAyMSc6J0RhZ2dlcicsJ1xcdTIxMzgnOidkYWxldGgnLCdcXHUyMTkzJzonZGFycicsJ1xcdTIxQTEnOidEYXJyJywnXFx1MjFEMyc6J2RBcnInLCdcXHUyMDEwJzonZGFzaCcsJ1xcdTJBRTQnOidEYXNodicsJ1xcdTIyQTMnOidkYXNodicsJ1xcdTI5MEYnOidyQmFycicsJ1xcdTAyREQnOidkYmxhYycsJ1xcdTAxMEUnOidEY2Fyb24nLCdcXHUwMTBGJzonZGNhcm9uJywnXFx1MDQxNCc6J0RjeScsJ1xcdTA0MzQnOidkY3knLCdcXHUyMUNBJzonZGRhcnInLCdcXHUyMTQ2JzonZGQnLCdcXHUyOTExJzonRERvdHJhaGQnLCdcXHUyQTc3JzonZUREb3QnLCdcXHhCMCc6J2RlZycsJ1xcdTIyMDcnOidEZWwnLCdcXHUwMzk0JzonRGVsdGEnLCdcXHUwM0I0JzonZGVsdGEnLCdcXHUyOUIxJzonZGVtcHR5dicsJ1xcdTI5N0YnOidkZmlzaHQnLCdcXHVEODM1XFx1REQwNyc6J0RmcicsJ1xcdUQ4MzVcXHVERDIxJzonZGZyJywnXFx1Mjk2NSc6J2RIYXInLCdcXHUyMUMzJzonZGhhcmwnLCdcXHUyMUMyJzonZGhhcnInLCdcXHUwMkQ5JzonZG90JywnYCc6J2dyYXZlJywnXFx1MDJEQyc6J3RpbGRlJywnXFx1MjJDNCc6J2RpYW0nLCdcXHUyNjY2JzonZGlhbXMnLCdcXHhBOCc6J2RpZScsJ1xcdTAzREQnOidnYW1tYWQnLCdcXHUyMkYyJzonZGlzaW4nLCdcXHhGNyc6J2RpdicsJ1xcdTIyQzcnOidkaXZvbngnLCdcXHUwNDAyJzonREpjeScsJ1xcdTA0NTInOidkamN5JywnXFx1MjMxRSc6J2RsY29ybicsJ1xcdTIzMEQnOidkbGNyb3AnLCckJzonZG9sbGFyJywnXFx1RDgzNVxcdUREM0InOidEb3BmJywnXFx1RDgzNVxcdURENTUnOidkb3BmJywnXFx1MjBEQyc6J0RvdERvdCcsJ1xcdTIyNTAnOidkb3RlcScsJ1xcdTIyNTEnOidlRG90JywnXFx1MjIzOCc6J21pbnVzZCcsJ1xcdTIyMTQnOidwbHVzZG8nLCdcXHUyMkExJzonc2RvdGInLCdcXHUyMUQwJzonbEFycicsJ1xcdTIxRDQnOidpZmYnLCdcXHUyN0Y4JzoneGxBcnInLCdcXHUyN0ZBJzoneGhBcnInLCdcXHUyN0Y5JzoneHJBcnInLCdcXHUyMUQyJzonckFycicsJ1xcdTIyQTgnOid2RGFzaCcsJ1xcdTIxRDEnOid1QXJyJywnXFx1MjFENSc6J3ZBcnInLCdcXHUyMjI1JzoncGFyJywnXFx1MjkxMyc6J0Rvd25BcnJvd0JhcicsJ1xcdTIxRjUnOidkdWFycicsJ1xcdTAzMTEnOidEb3duQnJldmUnLCdcXHUyOTUwJzonRG93bkxlZnRSaWdodFZlY3RvcicsJ1xcdTI5NUUnOidEb3duTGVmdFRlZVZlY3RvcicsJ1xcdTI5NTYnOidEb3duTGVmdFZlY3RvckJhcicsJ1xcdTIxQkQnOidsaGFyZCcsJ1xcdTI5NUYnOidEb3duUmlnaHRUZWVWZWN0b3InLCdcXHUyOTU3JzonRG93blJpZ2h0VmVjdG9yQmFyJywnXFx1MjFDMSc6J3JoYXJkJywnXFx1MjFBNyc6J21hcHN0b2Rvd24nLCdcXHUyMkE0JzondG9wJywnXFx1MjkxMCc6J1JCYXJyJywnXFx1MjMxRic6J2RyY29ybicsJ1xcdTIzMEMnOidkcmNyb3AnLCdcXHVEODM1XFx1REM5Ric6J0RzY3InLCdcXHVEODM1XFx1RENCOSc6J2RzY3InLCdcXHUwNDA1JzonRFNjeScsJ1xcdTA0NTUnOidkc2N5JywnXFx1MjlGNic6J2Rzb2wnLCdcXHUwMTEwJzonRHN0cm9rJywnXFx1MDExMSc6J2RzdHJvaycsJ1xcdTIyRjEnOidkdGRvdCcsJ1xcdTI1QkYnOidkdHJpJywnXFx1Mjk2Ric6J2R1aGFyJywnXFx1MjlBNic6J2R3YW5nbGUnLCdcXHUwNDBGJzonRFpjeScsJ1xcdTA0NUYnOidkemN5JywnXFx1MjdGRic6J2R6aWdyYXJyJywnXFx4QzknOidFYWN1dGUnLCdcXHhFOSc6J2VhY3V0ZScsJ1xcdTJBNkUnOidlYXN0ZXInLCdcXHUwMTFBJzonRWNhcm9uJywnXFx1MDExQic6J2VjYXJvbicsJ1xceENBJzonRWNpcmMnLCdcXHhFQSc6J2VjaXJjJywnXFx1MjI1Nic6J2VjaXInLCdcXHUyMjU1JzonZWNvbG9uJywnXFx1MDQyRCc6J0VjeScsJ1xcdTA0NEQnOidlY3knLCdcXHUwMTE2JzonRWRvdCcsJ1xcdTAxMTcnOidlZG90JywnXFx1MjE0Nyc6J2VlJywnXFx1MjI1Mic6J2VmRG90JywnXFx1RDgzNVxcdUREMDgnOidFZnInLCdcXHVEODM1XFx1REQyMic6J2VmcicsJ1xcdTJBOUEnOidlZycsJ1xceEM4JzonRWdyYXZlJywnXFx4RTgnOidlZ3JhdmUnLCdcXHUyQTk2JzonZWdzJywnXFx1MkE5OCc6J2Vnc2RvdCcsJ1xcdTJBOTknOidlbCcsJ1xcdTIyMDgnOidpbicsJ1xcdTIzRTcnOidlbGludGVycycsJ1xcdTIxMTMnOidlbGwnLCdcXHUyQTk1JzonZWxzJywnXFx1MkE5Nyc6J2Vsc2RvdCcsJ1xcdTAxMTInOidFbWFjcicsJ1xcdTAxMTMnOidlbWFjcicsJ1xcdTIyMDUnOidlbXB0eScsJ1xcdTI1RkInOidFbXB0eVNtYWxsU3F1YXJlJywnXFx1MjVBQic6J0VtcHR5VmVyeVNtYWxsU3F1YXJlJywnXFx1MjAwNCc6J2Vtc3AxMycsJ1xcdTIwMDUnOidlbXNwMTQnLCdcXHUyMDAzJzonZW1zcCcsJ1xcdTAxNEEnOidFTkcnLCdcXHUwMTRCJzonZW5nJywnXFx1MjAwMic6J2Vuc3AnLCdcXHUwMTE4JzonRW9nb24nLCdcXHUwMTE5JzonZW9nb24nLCdcXHVEODM1XFx1REQzQyc6J0VvcGYnLCdcXHVEODM1XFx1REQ1Nic6J2VvcGYnLCdcXHUyMkQ1JzonZXBhcicsJ1xcdTI5RTMnOidlcGFyc2wnLCdcXHUyQTcxJzonZXBsdXMnLCdcXHUwM0I1JzonZXBzaScsJ1xcdTAzOTUnOidFcHNpbG9uJywnXFx1MDNGNSc6J2Vwc2l2JywnXFx1MjI0Mic6J2VzaW0nLCdcXHUyQTc1JzonRXF1YWwnLCc9JzonZXF1YWxzJywnXFx1MjI1Ric6J2VxdWVzdCcsJ1xcdTIxQ0MnOidybGhhcicsJ1xcdTJBNzgnOidlcXVpdkREJywnXFx1MjlFNSc6J2VxdnBhcnNsJywnXFx1Mjk3MSc6J2VyYXJyJywnXFx1MjI1Myc6J2VyRG90JywnXFx1MjEyRic6J2VzY3InLCdcXHUyMTMwJzonRXNjcicsJ1xcdTJBNzMnOidFc2ltJywnXFx1MDM5Nyc6J0V0YScsJ1xcdTAzQjcnOidldGEnLCdcXHhEMCc6J0VUSCcsJ1xceEYwJzonZXRoJywnXFx4Q0InOidFdW1sJywnXFx4RUInOidldW1sJywnXFx1MjBBQyc6J2V1cm8nLCchJzonZXhjbCcsJ1xcdTIyMDMnOidleGlzdCcsJ1xcdTA0MjQnOidGY3knLCdcXHUwNDQ0JzonZmN5JywnXFx1MjY0MCc6J2ZlbWFsZScsJ1xcdUZCMDMnOidmZmlsaWcnLCdcXHVGQjAwJzonZmZsaWcnLCdcXHVGQjA0JzonZmZsbGlnJywnXFx1RDgzNVxcdUREMDknOidGZnInLCdcXHVEODM1XFx1REQyMyc6J2ZmcicsJ1xcdUZCMDEnOidmaWxpZycsJ1xcdTI1RkMnOidGaWxsZWRTbWFsbFNxdWFyZScsJ2ZqJzonZmpsaWcnLCdcXHUyNjZEJzonZmxhdCcsJ1xcdUZCMDInOidmbGxpZycsJ1xcdTI1QjEnOidmbHRucycsJ1xcdTAxOTInOidmbm9mJywnXFx1RDgzNVxcdUREM0QnOidGb3BmJywnXFx1RDgzNVxcdURENTcnOidmb3BmJywnXFx1MjIwMCc6J2ZvcmFsbCcsJ1xcdTIyRDQnOidmb3JrJywnXFx1MkFEOSc6J2Zvcmt2JywnXFx1MjEzMSc6J0ZzY3InLCdcXHUyQTBEJzonZnBhcnRpbnQnLCdcXHhCRCc6J2hhbGYnLCdcXHUyMTUzJzonZnJhYzEzJywnXFx4QkMnOidmcmFjMTQnLCdcXHUyMTU1JzonZnJhYzE1JywnXFx1MjE1OSc6J2ZyYWMxNicsJ1xcdTIxNUInOidmcmFjMTgnLCdcXHUyMTU0JzonZnJhYzIzJywnXFx1MjE1Nic6J2ZyYWMyNScsJ1xceEJFJzonZnJhYzM0JywnXFx1MjE1Nyc6J2ZyYWMzNScsJ1xcdTIxNUMnOidmcmFjMzgnLCdcXHUyMTU4JzonZnJhYzQ1JywnXFx1MjE1QSc6J2ZyYWM1NicsJ1xcdTIxNUQnOidmcmFjNTgnLCdcXHUyMTVFJzonZnJhYzc4JywnXFx1MjA0NCc6J2ZyYXNsJywnXFx1MjMyMic6J2Zyb3duJywnXFx1RDgzNVxcdURDQkInOidmc2NyJywnXFx1MDFGNSc6J2dhY3V0ZScsJ1xcdTAzOTMnOidHYW1tYScsJ1xcdTAzQjMnOidnYW1tYScsJ1xcdTAzREMnOidHYW1tYWQnLCdcXHUyQTg2JzonZ2FwJywnXFx1MDExRSc6J0dicmV2ZScsJ1xcdTAxMUYnOidnYnJldmUnLCdcXHUwMTIyJzonR2NlZGlsJywnXFx1MDExQyc6J0djaXJjJywnXFx1MDExRCc6J2djaXJjJywnXFx1MDQxMyc6J0djeScsJ1xcdTA0MzMnOidnY3knLCdcXHUwMTIwJzonR2RvdCcsJ1xcdTAxMjEnOidnZG90JywnXFx1MjI2NSc6J2dlJywnXFx1MjI2Nyc6J2dFJywnXFx1MkE4Qyc6J2dFbCcsJ1xcdTIyREInOidnZWwnLCdcXHUyQTdFJzonZ2VzJywnXFx1MkFBOSc6J2dlc2NjJywnXFx1MkE4MCc6J2dlc2RvdCcsJ1xcdTJBODInOidnZXNkb3RvJywnXFx1MkE4NCc6J2dlc2RvdG9sJywnXFx1MjJEQlxcdUZFMDAnOidnZXNsJywnXFx1MkE5NCc6J2dlc2xlcycsJ1xcdUQ4MzVcXHVERDBBJzonR2ZyJywnXFx1RDgzNVxcdUREMjQnOidnZnInLCdcXHUyMjZCJzonZ2cnLCdcXHUyMkQ5JzonR2cnLCdcXHUyMTM3JzonZ2ltZWwnLCdcXHUwNDAzJzonR0pjeScsJ1xcdTA0NTMnOidnamN5JywnXFx1MkFBNSc6J2dsYScsJ1xcdTIyNzcnOidnbCcsJ1xcdTJBOTInOidnbEUnLCdcXHUyQUE0JzonZ2xqJywnXFx1MkE4QSc6J2duYXAnLCdcXHUyQTg4JzonZ25lJywnXFx1MjI2OSc6J2duRScsJ1xcdTIyRTcnOidnbnNpbScsJ1xcdUQ4MzVcXHVERDNFJzonR29wZicsJ1xcdUQ4MzVcXHVERDU4JzonZ29wZicsJ1xcdTJBQTInOidHcmVhdGVyR3JlYXRlcicsJ1xcdTIyNzMnOidnc2ltJywnXFx1RDgzNVxcdURDQTInOidHc2NyJywnXFx1MjEwQSc6J2dzY3InLCdcXHUyQThFJzonZ3NpbWUnLCdcXHUyQTkwJzonZ3NpbWwnLCdcXHUyQUE3JzonZ3RjYycsJ1xcdTJBN0EnOidndGNpcicsJz4nOidndCcsJ1xcdTIyRDcnOidndGRvdCcsJ1xcdTI5OTUnOidndGxQYXInLCdcXHUyQTdDJzonZ3RxdWVzdCcsJ1xcdTI5NzgnOidndHJhcnInLCdcXHUyMjY5XFx1RkUwMCc6J2d2bkUnLCdcXHUyMDBBJzonaGFpcnNwJywnXFx1MjEwQic6J0hzY3InLCdcXHUwNDJBJzonSEFSRGN5JywnXFx1MDQ0QSc6J2hhcmRjeScsJ1xcdTI5NDgnOidoYXJyY2lyJywnXFx1MjE5NCc6J2hhcnInLCdcXHUyMUFEJzonaGFycncnLCdeJzonSGF0JywnXFx1MjEwRic6J2hiYXInLCdcXHUwMTI0JzonSGNpcmMnLCdcXHUwMTI1JzonaGNpcmMnLCdcXHUyNjY1JzonaGVhcnRzJywnXFx1MjAyNic6J21sZHInLCdcXHUyMkI5JzonaGVyY29uJywnXFx1RDgzNVxcdUREMjUnOidoZnInLCdcXHUyMTBDJzonSGZyJywnXFx1MjkyNSc6J3NlYXJoaycsJ1xcdTI5MjYnOidzd2FyaGsnLCdcXHUyMUZGJzonaG9hcnInLCdcXHUyMjNCJzonaG9tdGh0JywnXFx1MjFBOSc6J2xhcnJoaycsJ1xcdTIxQUEnOidyYXJyaGsnLCdcXHVEODM1XFx1REQ1OSc6J2hvcGYnLCdcXHUyMTBEJzonSG9wZicsJ1xcdTIwMTUnOidob3JiYXInLCdcXHVEODM1XFx1RENCRCc6J2hzY3InLCdcXHUwMTI2JzonSHN0cm9rJywnXFx1MDEyNyc6J2hzdHJvaycsJ1xcdTIwNDMnOidoeWJ1bGwnLCdcXHhDRCc6J0lhY3V0ZScsJ1xceEVEJzonaWFjdXRlJywnXFx1MjA2Myc6J2ljJywnXFx4Q0UnOidJY2lyYycsJ1xceEVFJzonaWNpcmMnLCdcXHUwNDE4JzonSWN5JywnXFx1MDQzOCc6J2ljeScsJ1xcdTAxMzAnOidJZG90JywnXFx1MDQxNSc6J0lFY3knLCdcXHUwNDM1JzonaWVjeScsJ1xceEExJzonaWV4Y2wnLCdcXHVEODM1XFx1REQyNic6J2lmcicsJ1xcdTIxMTEnOidJbScsJ1xceENDJzonSWdyYXZlJywnXFx4RUMnOidpZ3JhdmUnLCdcXHUyMTQ4JzonaWknLCdcXHUyQTBDJzoncWludCcsJ1xcdTIyMkQnOid0aW50JywnXFx1MjlEQyc6J2lpbmZpbicsJ1xcdTIxMjknOidpaW90YScsJ1xcdTAxMzInOidJSmxpZycsJ1xcdTAxMzMnOidpamxpZycsJ1xcdTAxMkEnOidJbWFjcicsJ1xcdTAxMkInOidpbWFjcicsJ1xcdTIxMTAnOidJc2NyJywnXFx1MDEzMSc6J2ltYXRoJywnXFx1MjJCNyc6J2ltb2YnLCdcXHUwMUI1JzonaW1wZWQnLCdcXHUyMTA1JzonaW5jYXJlJywnXFx1MjIxRSc6J2luZmluJywnXFx1MjlERCc6J2luZmludGllJywnXFx1MjJCQSc6J2ludGNhbCcsJ1xcdTIyMkInOidpbnQnLCdcXHUyMjJDJzonSW50JywnXFx1MjEyNCc6J1pvcGYnLCdcXHUyQTE3JzonaW50bGFyaGsnLCdcXHUyQTNDJzonaXByb2QnLCdcXHUyMDYyJzonaXQnLCdcXHUwNDAxJzonSU9jeScsJ1xcdTA0NTEnOidpb2N5JywnXFx1MDEyRSc6J0lvZ29uJywnXFx1MDEyRic6J2lvZ29uJywnXFx1RDgzNVxcdURENDAnOidJb3BmJywnXFx1RDgzNVxcdURENUEnOidpb3BmJywnXFx1MDM5OSc6J0lvdGEnLCdcXHUwM0I5JzonaW90YScsJ1xceEJGJzonaXF1ZXN0JywnXFx1RDgzNVxcdURDQkUnOidpc2NyJywnXFx1MjJGNSc6J2lzaW5kb3QnLCdcXHUyMkY5JzonaXNpbkUnLCdcXHUyMkY0JzonaXNpbnMnLCdcXHUyMkYzJzonaXNpbnN2JywnXFx1MDEyOCc6J0l0aWxkZScsJ1xcdTAxMjknOidpdGlsZGUnLCdcXHUwNDA2JzonSXVrY3knLCdcXHUwNDU2JzonaXVrY3knLCdcXHhDRic6J0l1bWwnLCdcXHhFRic6J2l1bWwnLCdcXHUwMTM0JzonSmNpcmMnLCdcXHUwMTM1JzonamNpcmMnLCdcXHUwNDE5JzonSmN5JywnXFx1MDQzOSc6J2pjeScsJ1xcdUQ4MzVcXHVERDBEJzonSmZyJywnXFx1RDgzNVxcdUREMjcnOidqZnInLCdcXHUwMjM3Jzonam1hdGgnLCdcXHVEODM1XFx1REQ0MSc6J0pvcGYnLCdcXHVEODM1XFx1REQ1Qic6J2pvcGYnLCdcXHVEODM1XFx1RENBNSc6J0pzY3InLCdcXHVEODM1XFx1RENCRic6J2pzY3InLCdcXHUwNDA4JzonSnNlcmN5JywnXFx1MDQ1OCc6J2pzZXJjeScsJ1xcdTA0MDQnOidKdWtjeScsJ1xcdTA0NTQnOidqdWtjeScsJ1xcdTAzOUEnOidLYXBwYScsJ1xcdTAzQkEnOidrYXBwYScsJ1xcdTAzRjAnOidrYXBwYXYnLCdcXHUwMTM2JzonS2NlZGlsJywnXFx1MDEzNyc6J2tjZWRpbCcsJ1xcdTA0MUEnOidLY3knLCdcXHUwNDNBJzona2N5JywnXFx1RDgzNVxcdUREMEUnOidLZnInLCdcXHVEODM1XFx1REQyOCc6J2tmcicsJ1xcdTAxMzgnOidrZ3JlZW4nLCdcXHUwNDI1JzonS0hjeScsJ1xcdTA0NDUnOidraGN5JywnXFx1MDQwQyc6J0tKY3knLCdcXHUwNDVDJzona2pjeScsJ1xcdUQ4MzVcXHVERDQyJzonS29wZicsJ1xcdUQ4MzVcXHVERDVDJzona29wZicsJ1xcdUQ4MzVcXHVEQ0E2JzonS3NjcicsJ1xcdUQ4MzVcXHVEQ0MwJzona3NjcicsJ1xcdTIxREEnOidsQWFycicsJ1xcdTAxMzknOidMYWN1dGUnLCdcXHUwMTNBJzonbGFjdXRlJywnXFx1MjlCNCc6J2xhZW1wdHl2JywnXFx1MjExMic6J0xzY3InLCdcXHUwMzlCJzonTGFtYmRhJywnXFx1MDNCQic6J2xhbWJkYScsJ1xcdTI3RTgnOidsYW5nJywnXFx1MjdFQSc6J0xhbmcnLCdcXHUyOTkxJzonbGFuZ2QnLCdcXHUyQTg1JzonbGFwJywnXFx4QUInOidsYXF1bycsJ1xcdTIxRTQnOidsYXJyYicsJ1xcdTI5MUYnOidsYXJyYmZzJywnXFx1MjE5MCc6J2xhcnInLCdcXHUyMTlFJzonTGFycicsJ1xcdTI5MUQnOidsYXJyZnMnLCdcXHUyMUFCJzonbGFycmxwJywnXFx1MjkzOSc6J2xhcnJwbCcsJ1xcdTI5NzMnOidsYXJyc2ltJywnXFx1MjFBMic6J2xhcnJ0bCcsJ1xcdTI5MTknOidsYXRhaWwnLCdcXHUyOTFCJzonbEF0YWlsJywnXFx1MkFBQic6J2xhdCcsJ1xcdTJBQUQnOidsYXRlJywnXFx1MkFBRFxcdUZFMDAnOidsYXRlcycsJ1xcdTI5MEMnOidsYmFycicsJ1xcdTI5MEUnOidsQmFycicsJ1xcdTI3NzInOidsYmJyaycsJ3snOidsY3ViJywnWyc6J2xzcWInLCdcXHUyOThCJzonbGJya2UnLCdcXHUyOThGJzonbGJya3NsZCcsJ1xcdTI5OEQnOidsYnJrc2x1JywnXFx1MDEzRCc6J0xjYXJvbicsJ1xcdTAxM0UnOidsY2Fyb24nLCdcXHUwMTNCJzonTGNlZGlsJywnXFx1MDEzQyc6J2xjZWRpbCcsJ1xcdTIzMDgnOidsY2VpbCcsJ1xcdTA0MUInOidMY3knLCdcXHUwNDNCJzonbGN5JywnXFx1MjkzNic6J2xkY2EnLCdcXHUyMDFDJzonbGRxdW8nLCdcXHUyOTY3JzonbGRyZGhhcicsJ1xcdTI5NEInOidsZHJ1c2hhcicsJ1xcdTIxQjInOidsZHNoJywnXFx1MjI2NCc6J2xlJywnXFx1MjI2Nic6J2xFJywnXFx1MjFDNic6J2xyYXJyJywnXFx1MjdFNic6J2xvYnJrJywnXFx1Mjk2MSc6J0xlZnREb3duVGVlVmVjdG9yJywnXFx1Mjk1OSc6J0xlZnREb3duVmVjdG9yQmFyJywnXFx1MjMwQSc6J2xmbG9vcicsJ1xcdTIxQkMnOidsaGFydScsJ1xcdTIxQzcnOidsbGFycicsJ1xcdTIxQ0InOidscmhhcicsJ1xcdTI5NEUnOidMZWZ0UmlnaHRWZWN0b3InLCdcXHUyMUE0JzonbWFwc3RvbGVmdCcsJ1xcdTI5NUEnOidMZWZ0VGVlVmVjdG9yJywnXFx1MjJDQic6J2x0aHJlZScsJ1xcdTI5Q0YnOidMZWZ0VHJpYW5nbGVCYXInLCdcXHUyMkIyJzondmx0cmknLCdcXHUyMkI0JzonbHRyaWUnLCdcXHUyOTUxJzonTGVmdFVwRG93blZlY3RvcicsJ1xcdTI5NjAnOidMZWZ0VXBUZWVWZWN0b3InLCdcXHUyOTU4JzonTGVmdFVwVmVjdG9yQmFyJywnXFx1MjFCRic6J3VoYXJsJywnXFx1Mjk1Mic6J0xlZnRWZWN0b3JCYXInLCdcXHUyQThCJzonbEVnJywnXFx1MjJEQSc6J2xlZycsJ1xcdTJBN0QnOidsZXMnLCdcXHUyQUE4JzonbGVzY2MnLCdcXHUyQTdGJzonbGVzZG90JywnXFx1MkE4MSc6J2xlc2RvdG8nLCdcXHUyQTgzJzonbGVzZG90b3InLCdcXHUyMkRBXFx1RkUwMCc6J2xlc2cnLCdcXHUyQTkzJzonbGVzZ2VzJywnXFx1MjJENic6J2x0ZG90JywnXFx1MjI3Nic6J2xnJywnXFx1MkFBMSc6J0xlc3NMZXNzJywnXFx1MjI3Mic6J2xzaW0nLCdcXHUyOTdDJzonbGZpc2h0JywnXFx1RDgzNVxcdUREMEYnOidMZnInLCdcXHVEODM1XFx1REQyOSc6J2xmcicsJ1xcdTJBOTEnOidsZ0UnLCdcXHUyOTYyJzonbEhhcicsJ1xcdTI5NkEnOidsaGFydWwnLCdcXHUyNTg0JzonbGhibGsnLCdcXHUwNDA5JzonTEpjeScsJ1xcdTA0NTknOidsamN5JywnXFx1MjI2QSc6J2xsJywnXFx1MjJEOCc6J0xsJywnXFx1Mjk2Qic6J2xsaGFyZCcsJ1xcdTI1RkEnOidsbHRyaScsJ1xcdTAxM0YnOidMbWlkb3QnLCdcXHUwMTQwJzonbG1pZG90JywnXFx1MjNCMCc6J2xtb3VzdCcsJ1xcdTJBODknOidsbmFwJywnXFx1MkE4Nyc6J2xuZScsJ1xcdTIyNjgnOidsbkUnLCdcXHUyMkU2JzonbG5zaW0nLCdcXHUyN0VDJzonbG9hbmcnLCdcXHUyMUZEJzonbG9hcnInLCdcXHUyN0Y1JzoneGxhcnInLCdcXHUyN0Y3JzoneGhhcnInLCdcXHUyN0ZDJzoneG1hcCcsJ1xcdTI3RjYnOid4cmFycicsJ1xcdTIxQUMnOidyYXJybHAnLCdcXHUyOTg1JzonbG9wYXInLCdcXHVEODM1XFx1REQ0Myc6J0xvcGYnLCdcXHVEODM1XFx1REQ1RCc6J2xvcGYnLCdcXHUyQTJEJzonbG9wbHVzJywnXFx1MkEzNCc6J2xvdGltZXMnLCdcXHUyMjE3JzonbG93YXN0JywnXyc6J2xvd2JhcicsJ1xcdTIxOTknOidzd2FycicsJ1xcdTIxOTgnOidzZWFycicsJ1xcdTI1Q0EnOidsb3onLCcoJzonbHBhcicsJ1xcdTI5OTMnOidscGFybHQnLCdcXHUyOTZEJzonbHJoYXJkJywnXFx1MjAwRSc6J2xybScsJ1xcdTIyQkYnOidscnRyaScsJ1xcdTIwMzknOidsc2FxdW8nLCdcXHVEODM1XFx1RENDMSc6J2xzY3InLCdcXHUyMUIwJzonbHNoJywnXFx1MkE4RCc6J2xzaW1lJywnXFx1MkE4Ric6J2xzaW1nJywnXFx1MjAxOCc6J2xzcXVvJywnXFx1MjAxQSc6J3NicXVvJywnXFx1MDE0MSc6J0xzdHJvaycsJ1xcdTAxNDInOidsc3Ryb2snLCdcXHUyQUE2JzonbHRjYycsJ1xcdTJBNzknOidsdGNpcicsJzwnOidsdCcsJ1xcdTIyQzknOidsdGltZXMnLCdcXHUyOTc2JzonbHRsYXJyJywnXFx1MkE3Qic6J2x0cXVlc3QnLCdcXHUyNUMzJzonbHRyaScsJ1xcdTI5OTYnOidsdHJQYXInLCdcXHUyOTRBJzonbHVyZHNoYXInLCdcXHUyOTY2JzonbHVydWhhcicsJ1xcdTIyNjhcXHVGRTAwJzonbHZuRScsJ1xceEFGJzonbWFjcicsJ1xcdTI2NDInOidtYWxlJywnXFx1MjcyMCc6J21hbHQnLCdcXHUyOTA1JzonTWFwJywnXFx1MjFBNic6J21hcCcsJ1xcdTIxQTUnOidtYXBzdG91cCcsJ1xcdTI1QUUnOidtYXJrZXInLCdcXHUyQTI5JzonbWNvbW1hJywnXFx1MDQxQyc6J01jeScsJ1xcdTA0M0MnOidtY3knLCdcXHUyMDE0JzonbWRhc2gnLCdcXHUyMjNBJzonbUREb3QnLCdcXHUyMDVGJzonTWVkaXVtU3BhY2UnLCdcXHUyMTMzJzonTXNjcicsJ1xcdUQ4MzVcXHVERDEwJzonTWZyJywnXFx1RDgzNVxcdUREMkEnOidtZnInLCdcXHUyMTI3JzonbWhvJywnXFx4QjUnOidtaWNybycsJ1xcdTJBRjAnOidtaWRjaXInLCdcXHUyMjIzJzonbWlkJywnXFx1MjIxMic6J21pbnVzJywnXFx1MkEyQSc6J21pbnVzZHUnLCdcXHUyMjEzJzonbXAnLCdcXHUyQURCJzonbWxjcCcsJ1xcdTIyQTcnOidtb2RlbHMnLCdcXHVEODM1XFx1REQ0NCc6J01vcGYnLCdcXHVEODM1XFx1REQ1RSc6J21vcGYnLCdcXHVEODM1XFx1RENDMic6J21zY3InLCdcXHUwMzlDJzonTXUnLCdcXHUwM0JDJzonbXUnLCdcXHUyMkI4JzonbXVtYXAnLCdcXHUwMTQzJzonTmFjdXRlJywnXFx1MDE0NCc6J25hY3V0ZScsJ1xcdTIyMjBcXHUyMEQyJzonbmFuZycsJ1xcdTIyNDknOiduYXAnLCdcXHUyQTcwXFx1MDMzOCc6J25hcEUnLCdcXHUyMjRCXFx1MDMzOCc6J25hcGlkJywnXFx1MDE0OSc6J25hcG9zJywnXFx1MjY2RSc6J25hdHVyJywnXFx1MjExNSc6J05vcGYnLCdcXHhBMCc6J25ic3AnLCdcXHUyMjRFXFx1MDMzOCc6J25idW1wJywnXFx1MjI0RlxcdTAzMzgnOiduYnVtcGUnLCdcXHUyQTQzJzonbmNhcCcsJ1xcdTAxNDcnOidOY2Fyb24nLCdcXHUwMTQ4JzonbmNhcm9uJywnXFx1MDE0NSc6J05jZWRpbCcsJ1xcdTAxNDYnOiduY2VkaWwnLCdcXHUyMjQ3JzonbmNvbmcnLCdcXHUyQTZEXFx1MDMzOCc6J25jb25nZG90JywnXFx1MkE0Mic6J25jdXAnLCdcXHUwNDFEJzonTmN5JywnXFx1MDQzRCc6J25jeScsJ1xcdTIwMTMnOiduZGFzaCcsJ1xcdTI5MjQnOiduZWFyaGsnLCdcXHUyMTk3JzonbmVhcnInLCdcXHUyMUQ3JzonbmVBcnInLCdcXHUyMjYwJzonbmUnLCdcXHUyMjUwXFx1MDMzOCc6J25lZG90JywnXFx1MjAwQic6J1plcm9XaWR0aFNwYWNlJywnXFx1MjI2Mic6J25lcXVpdicsJ1xcdTI5MjgnOid0b2VhJywnXFx1MjI0MlxcdTAzMzgnOiduZXNpbScsJ1xcbic6J05ld0xpbmUnLCdcXHUyMjA0JzonbmV4aXN0JywnXFx1RDgzNVxcdUREMTEnOidOZnInLCdcXHVEODM1XFx1REQyQic6J25mcicsJ1xcdTIyNjdcXHUwMzM4JzonbmdFJywnXFx1MjI3MSc6J25nZScsJ1xcdTJBN0VcXHUwMzM4JzonbmdlcycsJ1xcdTIyRDlcXHUwMzM4JzonbkdnJywnXFx1MjI3NSc6J25nc2ltJywnXFx1MjI2QlxcdTIwRDInOiduR3QnLCdcXHUyMjZGJzonbmd0JywnXFx1MjI2QlxcdTAzMzgnOiduR3R2JywnXFx1MjFBRSc6J25oYXJyJywnXFx1MjFDRSc6J25oQXJyJywnXFx1MkFGMic6J25ocGFyJywnXFx1MjIwQic6J25pJywnXFx1MjJGQyc6J25pcycsJ1xcdTIyRkEnOiduaXNkJywnXFx1MDQwQSc6J05KY3knLCdcXHUwNDVBJzonbmpjeScsJ1xcdTIxOUEnOidubGFycicsJ1xcdTIxQ0QnOidubEFycicsJ1xcdTIwMjUnOidubGRyJywnXFx1MjI2NlxcdTAzMzgnOidubEUnLCdcXHUyMjcwJzonbmxlJywnXFx1MkE3RFxcdTAzMzgnOidubGVzJywnXFx1MjI2RSc6J25sdCcsJ1xcdTIyRDhcXHUwMzM4JzonbkxsJywnXFx1MjI3NCc6J25sc2ltJywnXFx1MjI2QVxcdTIwRDInOiduTHQnLCdcXHUyMkVBJzonbmx0cmknLCdcXHUyMkVDJzonbmx0cmllJywnXFx1MjI2QVxcdTAzMzgnOiduTHR2JywnXFx1MjIyNCc6J25taWQnLCdcXHUyMDYwJzonTm9CcmVhaycsJ1xcdUQ4MzVcXHVERDVGJzonbm9wZicsJ1xcdTJBRUMnOidOb3QnLCdcXHhBQyc6J25vdCcsJ1xcdTIyNkQnOidOb3RDdXBDYXAnLCdcXHUyMjI2JzonbnBhcicsJ1xcdTIyMDknOidub3RpbicsJ1xcdTIyNzknOidudGdsJywnXFx1MjJGNVxcdTAzMzgnOidub3RpbmRvdCcsJ1xcdTIyRjlcXHUwMzM4Jzonbm90aW5FJywnXFx1MjJGNyc6J25vdGludmInLCdcXHUyMkY2Jzonbm90aW52YycsJ1xcdTI5Q0ZcXHUwMzM4JzonTm90TGVmdFRyaWFuZ2xlQmFyJywnXFx1MjI3OCc6J250bGcnLCdcXHUyQUEyXFx1MDMzOCc6J05vdE5lc3RlZEdyZWF0ZXJHcmVhdGVyJywnXFx1MkFBMVxcdTAzMzgnOidOb3ROZXN0ZWRMZXNzTGVzcycsJ1xcdTIyMEMnOidub3RuaScsJ1xcdTIyRkUnOidub3RuaXZiJywnXFx1MjJGRCc6J25vdG5pdmMnLCdcXHUyMjgwJzonbnByJywnXFx1MkFBRlxcdTAzMzgnOiducHJlJywnXFx1MjJFMCc6J25wcmN1ZScsJ1xcdTI5RDBcXHUwMzM4JzonTm90UmlnaHRUcmlhbmdsZUJhcicsJ1xcdTIyRUInOiducnRyaScsJ1xcdTIyRUQnOiducnRyaWUnLCdcXHUyMjhGXFx1MDMzOCc6J05vdFNxdWFyZVN1YnNldCcsJ1xcdTIyRTInOiduc3FzdWJlJywnXFx1MjI5MFxcdTAzMzgnOidOb3RTcXVhcmVTdXBlcnNldCcsJ1xcdTIyRTMnOiduc3FzdXBlJywnXFx1MjI4MlxcdTIwRDInOid2bnN1YicsJ1xcdTIyODgnOiduc3ViZScsJ1xcdTIyODEnOiduc2MnLCdcXHUyQUIwXFx1MDMzOCc6J25zY2UnLCdcXHUyMkUxJzonbnNjY3VlJywnXFx1MjI3RlxcdTAzMzgnOidOb3RTdWNjZWVkc1RpbGRlJywnXFx1MjI4M1xcdTIwRDInOid2bnN1cCcsJ1xcdTIyODknOiduc3VwZScsJ1xcdTIyNDEnOiduc2ltJywnXFx1MjI0NCc6J25zaW1lJywnXFx1MkFGRFxcdTIwRTUnOiducGFyc2wnLCdcXHUyMjAyXFx1MDMzOCc6J25wYXJ0JywnXFx1MkExNCc6J25wb2xpbnQnLCdcXHUyOTMzXFx1MDMzOCc6J25yYXJyYycsJ1xcdTIxOUInOiducmFycicsJ1xcdTIxQ0YnOiduckFycicsJ1xcdTIxOURcXHUwMzM4JzonbnJhcnJ3JywnXFx1RDgzNVxcdURDQTknOidOc2NyJywnXFx1RDgzNVxcdURDQzMnOiduc2NyJywnXFx1MjI4NCc6J25zdWInLCdcXHUyQUM1XFx1MDMzOCc6J25zdWJFJywnXFx1MjI4NSc6J25zdXAnLCdcXHUyQUM2XFx1MDMzOCc6J25zdXBFJywnXFx4RDEnOidOdGlsZGUnLCdcXHhGMSc6J250aWxkZScsJ1xcdTAzOUQnOidOdScsJ1xcdTAzQkQnOidudScsJyMnOidudW0nLCdcXHUyMTE2JzonbnVtZXJvJywnXFx1MjAwNyc6J251bXNwJywnXFx1MjI0RFxcdTIwRDInOidudmFwJywnXFx1MjJBQyc6J252ZGFzaCcsJ1xcdTIyQUQnOidudkRhc2gnLCdcXHUyMkFFJzonblZkYXNoJywnXFx1MjJBRic6J25WRGFzaCcsJ1xcdTIyNjVcXHUyMEQyJzonbnZnZScsJz5cXHUyMEQyJzonbnZndCcsJ1xcdTI5MDQnOidudkhhcnInLCdcXHUyOURFJzonbnZpbmZpbicsJ1xcdTI5MDInOidudmxBcnInLCdcXHUyMjY0XFx1MjBEMic6J252bGUnLCc8XFx1MjBEMic6J252bHQnLCdcXHUyMkI0XFx1MjBEMic6J252bHRyaWUnLCdcXHUyOTAzJzonbnZyQXJyJywnXFx1MjJCNVxcdTIwRDInOidudnJ0cmllJywnXFx1MjIzQ1xcdTIwRDInOidudnNpbScsJ1xcdTI5MjMnOidud2FyaGsnLCdcXHUyMTk2JzonbndhcnInLCdcXHUyMUQ2JzonbndBcnInLCdcXHUyOTI3JzonbnduZWFyJywnXFx4RDMnOidPYWN1dGUnLCdcXHhGMyc6J29hY3V0ZScsJ1xceEQ0JzonT2NpcmMnLCdcXHhGNCc6J29jaXJjJywnXFx1MDQxRSc6J09jeScsJ1xcdTA0M0UnOidvY3knLCdcXHUwMTUwJzonT2RibGFjJywnXFx1MDE1MSc6J29kYmxhYycsJ1xcdTJBMzgnOidvZGl2JywnXFx1MjlCQyc6J29kc29sZCcsJ1xcdTAxNTInOidPRWxpZycsJ1xcdTAxNTMnOidvZWxpZycsJ1xcdTI5QkYnOidvZmNpcicsJ1xcdUQ4MzVcXHVERDEyJzonT2ZyJywnXFx1RDgzNVxcdUREMkMnOidvZnInLCdcXHUwMkRCJzonb2dvbicsJ1xceEQyJzonT2dyYXZlJywnXFx4RjInOidvZ3JhdmUnLCdcXHUyOUMxJzonb2d0JywnXFx1MjlCNSc6J29oYmFyJywnXFx1MDNBOSc6J29obScsJ1xcdTI5QkUnOidvbGNpcicsJ1xcdTI5QkInOidvbGNyb3NzJywnXFx1MjAzRSc6J29saW5lJywnXFx1MjlDMCc6J29sdCcsJ1xcdTAxNEMnOidPbWFjcicsJ1xcdTAxNEQnOidvbWFjcicsJ1xcdTAzQzknOidvbWVnYScsJ1xcdTAzOUYnOidPbWljcm9uJywnXFx1MDNCRic6J29taWNyb24nLCdcXHUyOUI2Jzonb21pZCcsJ1xcdUQ4MzVcXHVERDQ2JzonT29wZicsJ1xcdUQ4MzVcXHVERDYwJzonb29wZicsJ1xcdTI5QjcnOidvcGFyJywnXFx1MjlCOSc6J29wZXJwJywnXFx1MkE1NCc6J09yJywnXFx1MjIyOCc6J29yJywnXFx1MkE1RCc6J29yZCcsJ1xcdTIxMzQnOidvc2NyJywnXFx4QUEnOidvcmRmJywnXFx4QkEnOidvcmRtJywnXFx1MjJCNic6J29yaWdvZicsJ1xcdTJBNTYnOidvcm9yJywnXFx1MkE1Nyc6J29yc2xvcGUnLCdcXHUyQTVCJzonb3J2JywnXFx1RDgzNVxcdURDQUEnOidPc2NyJywnXFx4RDgnOidPc2xhc2gnLCdcXHhGOCc6J29zbGFzaCcsJ1xcdTIyOTgnOidvc29sJywnXFx4RDUnOidPdGlsZGUnLCdcXHhGNSc6J290aWxkZScsJ1xcdTJBMzYnOidvdGltZXNhcycsJ1xcdTJBMzcnOidPdGltZXMnLCdcXHhENic6J091bWwnLCdcXHhGNic6J291bWwnLCdcXHUyMzNEJzonb3ZiYXInLCdcXHUyM0RFJzonT3ZlckJyYWNlJywnXFx1MjNCNCc6J3RicmsnLCdcXHUyM0RDJzonT3ZlclBhcmVudGhlc2lzJywnXFx4QjYnOidwYXJhJywnXFx1MkFGMyc6J3BhcnNpbScsJ1xcdTJBRkQnOidwYXJzbCcsJ1xcdTIyMDInOidwYXJ0JywnXFx1MDQxRic6J1BjeScsJ1xcdTA0M0YnOidwY3knLCclJzoncGVyY250JywnLic6J3BlcmlvZCcsJ1xcdTIwMzAnOidwZXJtaWwnLCdcXHUyMDMxJzoncGVydGVuaycsJ1xcdUQ4MzVcXHVERDEzJzonUGZyJywnXFx1RDgzNVxcdUREMkQnOidwZnInLCdcXHUwM0E2JzonUGhpJywnXFx1MDNDNic6J3BoaScsJ1xcdTAzRDUnOidwaGl2JywnXFx1MjYwRSc6J3Bob25lJywnXFx1MDNBMCc6J1BpJywnXFx1MDNDMCc6J3BpJywnXFx1MDNENic6J3BpdicsJ1xcdTIxMEUnOidwbGFuY2toJywnXFx1MkEyMyc6J3BsdXNhY2lyJywnXFx1MkEyMic6J3BsdXNjaXInLCcrJzoncGx1cycsJ1xcdTJBMjUnOidwbHVzZHUnLCdcXHUyQTcyJzoncGx1c2UnLCdcXHhCMSc6J3BtJywnXFx1MkEyNic6J3BsdXNzaW0nLCdcXHUyQTI3JzoncGx1c3R3bycsJ1xcdTJBMTUnOidwb2ludGludCcsJ1xcdUQ4MzVcXHVERDYxJzoncG9wZicsJ1xcdTIxMTknOidQb3BmJywnXFx4QTMnOidwb3VuZCcsJ1xcdTJBQjcnOidwcmFwJywnXFx1MkFCQic6J1ByJywnXFx1MjI3QSc6J3ByJywnXFx1MjI3Qyc6J3ByY3VlJywnXFx1MkFBRic6J3ByZScsJ1xcdTIyN0UnOidwcnNpbScsJ1xcdTJBQjknOidwcm5hcCcsJ1xcdTJBQjUnOidwcm5FJywnXFx1MjJFOCc6J3BybnNpbScsJ1xcdTJBQjMnOidwckUnLCdcXHUyMDMyJzoncHJpbWUnLCdcXHUyMDMzJzonUHJpbWUnLCdcXHUyMjBGJzoncHJvZCcsJ1xcdTIzMkUnOidwcm9mYWxhcicsJ1xcdTIzMTInOidwcm9mbGluZScsJ1xcdTIzMTMnOidwcm9mc3VyZicsJ1xcdTIyMUQnOidwcm9wJywnXFx1MjJCMCc6J3BydXJlbCcsJ1xcdUQ4MzVcXHVEQ0FCJzonUHNjcicsJ1xcdUQ4MzVcXHVEQ0M1JzoncHNjcicsJ1xcdTAzQTgnOidQc2knLCdcXHUwM0M4JzoncHNpJywnXFx1MjAwOCc6J3B1bmNzcCcsJ1xcdUQ4MzVcXHVERDE0JzonUWZyJywnXFx1RDgzNVxcdUREMkUnOidxZnInLCdcXHVEODM1XFx1REQ2Mic6J3FvcGYnLCdcXHUyMTFBJzonUW9wZicsJ1xcdTIwNTcnOidxcHJpbWUnLCdcXHVEODM1XFx1RENBQyc6J1FzY3InLCdcXHVEODM1XFx1RENDNic6J3FzY3InLCdcXHUyQTE2JzoncXVhdGludCcsJz8nOidxdWVzdCcsJ1wiJzoncXVvdCcsJ1xcdTIxREInOidyQWFycicsJ1xcdTIyM0RcXHUwMzMxJzoncmFjZScsJ1xcdTAxNTQnOidSYWN1dGUnLCdcXHUwMTU1JzoncmFjdXRlJywnXFx1MjIxQSc6J1NxcnQnLCdcXHUyOUIzJzoncmFlbXB0eXYnLCdcXHUyN0U5JzoncmFuZycsJ1xcdTI3RUInOidSYW5nJywnXFx1Mjk5Mic6J3JhbmdkJywnXFx1MjlBNSc6J3JhbmdlJywnXFx4QkInOidyYXF1bycsJ1xcdTI5NzUnOidyYXJyYXAnLCdcXHUyMUU1JzoncmFycmInLCdcXHUyOTIwJzoncmFycmJmcycsJ1xcdTI5MzMnOidyYXJyYycsJ1xcdTIxOTInOidyYXJyJywnXFx1MjFBMCc6J1JhcnInLCdcXHUyOTFFJzoncmFycmZzJywnXFx1Mjk0NSc6J3JhcnJwbCcsJ1xcdTI5NzQnOidyYXJyc2ltJywnXFx1MjkxNic6J1JhcnJ0bCcsJ1xcdTIxQTMnOidyYXJydGwnLCdcXHUyMTlEJzoncmFycncnLCdcXHUyOTFBJzoncmF0YWlsJywnXFx1MjkxQyc6J3JBdGFpbCcsJ1xcdTIyMzYnOidyYXRpbycsJ1xcdTI3NzMnOidyYmJyaycsJ30nOidyY3ViJywnXSc6J3JzcWInLCdcXHUyOThDJzoncmJya2UnLCdcXHUyOThFJzoncmJya3NsZCcsJ1xcdTI5OTAnOidyYnJrc2x1JywnXFx1MDE1OCc6J1JjYXJvbicsJ1xcdTAxNTknOidyY2Fyb24nLCdcXHUwMTU2JzonUmNlZGlsJywnXFx1MDE1Nyc6J3JjZWRpbCcsJ1xcdTIzMDknOidyY2VpbCcsJ1xcdTA0MjAnOidSY3knLCdcXHUwNDQwJzoncmN5JywnXFx1MjkzNyc6J3JkY2EnLCdcXHUyOTY5JzoncmRsZGhhcicsJ1xcdTIxQjMnOidyZHNoJywnXFx1MjExQyc6J1JlJywnXFx1MjExQic6J1JzY3InLCdcXHUyMTFEJzonUm9wZicsJ1xcdTI1QUQnOidyZWN0JywnXFx1Mjk3RCc6J3JmaXNodCcsJ1xcdTIzMEInOidyZmxvb3InLCdcXHVEODM1XFx1REQyRic6J3JmcicsJ1xcdTI5NjQnOidySGFyJywnXFx1MjFDMCc6J3JoYXJ1JywnXFx1Mjk2Qyc6J3JoYXJ1bCcsJ1xcdTAzQTEnOidSaG8nLCdcXHUwM0MxJzoncmhvJywnXFx1MDNGMSc6J3Job3YnLCdcXHUyMUM0JzoncmxhcnInLCdcXHUyN0U3Jzoncm9icmsnLCdcXHUyOTVEJzonUmlnaHREb3duVGVlVmVjdG9yJywnXFx1Mjk1NSc6J1JpZ2h0RG93blZlY3RvckJhcicsJ1xcdTIxQzknOidycmFycicsJ1xcdTIyQTInOid2ZGFzaCcsJ1xcdTI5NUInOidSaWdodFRlZVZlY3RvcicsJ1xcdTIyQ0MnOidydGhyZWUnLCdcXHUyOUQwJzonUmlnaHRUcmlhbmdsZUJhcicsJ1xcdTIyQjMnOid2cnRyaScsJ1xcdTIyQjUnOidydHJpZScsJ1xcdTI5NEYnOidSaWdodFVwRG93blZlY3RvcicsJ1xcdTI5NUMnOidSaWdodFVwVGVlVmVjdG9yJywnXFx1Mjk1NCc6J1JpZ2h0VXBWZWN0b3JCYXInLCdcXHUyMUJFJzondWhhcnInLCdcXHUyOTUzJzonUmlnaHRWZWN0b3JCYXInLCdcXHUwMkRBJzoncmluZycsJ1xcdTIwMEYnOidybG0nLCdcXHUyM0IxJzoncm1vdXN0JywnXFx1MkFFRSc6J3JubWlkJywnXFx1MjdFRCc6J3JvYW5nJywnXFx1MjFGRSc6J3JvYXJyJywnXFx1Mjk4Nic6J3JvcGFyJywnXFx1RDgzNVxcdURENjMnOidyb3BmJywnXFx1MkEyRSc6J3JvcGx1cycsJ1xcdTJBMzUnOidyb3RpbWVzJywnXFx1Mjk3MCc6J1JvdW5kSW1wbGllcycsJyknOidycGFyJywnXFx1Mjk5NCc6J3JwYXJndCcsJ1xcdTJBMTInOidycHBvbGludCcsJ1xcdTIwM0EnOidyc2FxdW8nLCdcXHVEODM1XFx1RENDNyc6J3JzY3InLCdcXHUyMUIxJzoncnNoJywnXFx1MjJDQSc6J3J0aW1lcycsJ1xcdTI1QjknOidydHJpJywnXFx1MjlDRSc6J3J0cmlsdHJpJywnXFx1MjlGNCc6J1J1bGVEZWxheWVkJywnXFx1Mjk2OCc6J3J1bHVoYXInLCdcXHUyMTFFJzoncngnLCdcXHUwMTVBJzonU2FjdXRlJywnXFx1MDE1Qic6J3NhY3V0ZScsJ1xcdTJBQjgnOidzY2FwJywnXFx1MDE2MCc6J1NjYXJvbicsJ1xcdTAxNjEnOidzY2Fyb24nLCdcXHUyQUJDJzonU2MnLCdcXHUyMjdCJzonc2MnLCdcXHUyMjdEJzonc2NjdWUnLCdcXHUyQUIwJzonc2NlJywnXFx1MkFCNCc6J3NjRScsJ1xcdTAxNUUnOidTY2VkaWwnLCdcXHUwMTVGJzonc2NlZGlsJywnXFx1MDE1Qyc6J1NjaXJjJywnXFx1MDE1RCc6J3NjaXJjJywnXFx1MkFCQSc6J3NjbmFwJywnXFx1MkFCNic6J3NjbkUnLCdcXHUyMkU5Jzonc2Nuc2ltJywnXFx1MkExMyc6J3NjcG9saW50JywnXFx1MjI3Ric6J3Njc2ltJywnXFx1MDQyMSc6J1NjeScsJ1xcdTA0NDEnOidzY3knLCdcXHUyMkM1Jzonc2RvdCcsJ1xcdTJBNjYnOidzZG90ZScsJ1xcdTIxRDgnOidzZUFycicsJ1xceEE3Jzonc2VjdCcsJzsnOidzZW1pJywnXFx1MjkyOSc6J3Rvc2EnLCdcXHUyNzM2Jzonc2V4dCcsJ1xcdUQ4MzVcXHVERDE2JzonU2ZyJywnXFx1RDgzNVxcdUREMzAnOidzZnInLCdcXHUyNjZGJzonc2hhcnAnLCdcXHUwNDI5JzonU0hDSGN5JywnXFx1MDQ0OSc6J3NoY2hjeScsJ1xcdTA0MjgnOidTSGN5JywnXFx1MDQ0OCc6J3NoY3knLCdcXHUyMTkxJzondWFycicsJ1xceEFEJzonc2h5JywnXFx1MDNBMyc6J1NpZ21hJywnXFx1MDNDMyc6J3NpZ21hJywnXFx1MDNDMic6J3NpZ21hZicsJ1xcdTIyM0MnOidzaW0nLCdcXHUyQTZBJzonc2ltZG90JywnXFx1MjI0Myc6J3NpbWUnLCdcXHUyQTlFJzonc2ltZycsJ1xcdTJBQTAnOidzaW1nRScsJ1xcdTJBOUQnOidzaW1sJywnXFx1MkE5Ric6J3NpbWxFJywnXFx1MjI0Nic6J3NpbW5lJywnXFx1MkEyNCc6J3NpbXBsdXMnLCdcXHUyOTcyJzonc2ltcmFycicsJ1xcdTJBMzMnOidzbWFzaHAnLCdcXHUyOUU0Jzonc21lcGFyc2wnLCdcXHUyMzIzJzonc21pbGUnLCdcXHUyQUFBJzonc210JywnXFx1MkFBQyc6J3NtdGUnLCdcXHUyQUFDXFx1RkUwMCc6J3NtdGVzJywnXFx1MDQyQyc6J1NPRlRjeScsJ1xcdTA0NEMnOidzb2Z0Y3knLCdcXHUyMzNGJzonc29sYmFyJywnXFx1MjlDNCc6J3NvbGInLCcvJzonc29sJywnXFx1RDgzNVxcdURENEEnOidTb3BmJywnXFx1RDgzNVxcdURENjQnOidzb3BmJywnXFx1MjY2MCc6J3NwYWRlcycsJ1xcdTIyOTMnOidzcWNhcCcsJ1xcdTIyOTNcXHVGRTAwJzonc3FjYXBzJywnXFx1MjI5NCc6J3NxY3VwJywnXFx1MjI5NFxcdUZFMDAnOidzcWN1cHMnLCdcXHUyMjhGJzonc3FzdWInLCdcXHUyMjkxJzonc3FzdWJlJywnXFx1MjI5MCc6J3Nxc3VwJywnXFx1MjI5Mic6J3Nxc3VwZScsJ1xcdTI1QTEnOidzcXUnLCdcXHVEODM1XFx1RENBRSc6J1NzY3InLCdcXHVEODM1XFx1RENDOCc6J3NzY3InLCdcXHUyMkM2JzonU3RhcicsJ1xcdTI2MDYnOidzdGFyJywnXFx1MjI4Mic6J3N1YicsJ1xcdTIyRDAnOidTdWInLCdcXHUyQUJEJzonc3ViZG90JywnXFx1MkFDNSc6J3N1YkUnLCdcXHUyMjg2Jzonc3ViZScsJ1xcdTJBQzMnOidzdWJlZG90JywnXFx1MkFDMSc6J3N1Ym11bHQnLCdcXHUyQUNCJzonc3VibkUnLCdcXHUyMjhBJzonc3VibmUnLCdcXHUyQUJGJzonc3VicGx1cycsJ1xcdTI5NzknOidzdWJyYXJyJywnXFx1MkFDNyc6J3N1YnNpbScsJ1xcdTJBRDUnOidzdWJzdWInLCdcXHUyQUQzJzonc3Vic3VwJywnXFx1MjIxMSc6J3N1bScsJ1xcdTI2NkEnOidzdW5nJywnXFx4QjknOidzdXAxJywnXFx4QjInOidzdXAyJywnXFx4QjMnOidzdXAzJywnXFx1MjI4Myc6J3N1cCcsJ1xcdTIyRDEnOidTdXAnLCdcXHUyQUJFJzonc3VwZG90JywnXFx1MkFEOCc6J3N1cGRzdWInLCdcXHUyQUM2Jzonc3VwRScsJ1xcdTIyODcnOidzdXBlJywnXFx1MkFDNCc6J3N1cGVkb3QnLCdcXHUyN0M5Jzonc3VwaHNvbCcsJ1xcdTJBRDcnOidzdXBoc3ViJywnXFx1Mjk3Qic6J3N1cGxhcnInLCdcXHUyQUMyJzonc3VwbXVsdCcsJ1xcdTJBQ0MnOidzdXBuRScsJ1xcdTIyOEInOidzdXBuZScsJ1xcdTJBQzAnOidzdXBwbHVzJywnXFx1MkFDOCc6J3N1cHNpbScsJ1xcdTJBRDQnOidzdXBzdWInLCdcXHUyQUQ2Jzonc3Vwc3VwJywnXFx1MjFEOSc6J3N3QXJyJywnXFx1MjkyQSc6J3N3bndhcicsJ1xceERGJzonc3psaWcnLCdcXHQnOidUYWInLCdcXHUyMzE2JzondGFyZ2V0JywnXFx1MDNBNCc6J1RhdScsJ1xcdTAzQzQnOid0YXUnLCdcXHUwMTY0JzonVGNhcm9uJywnXFx1MDE2NSc6J3RjYXJvbicsJ1xcdTAxNjInOidUY2VkaWwnLCdcXHUwMTYzJzondGNlZGlsJywnXFx1MDQyMic6J1RjeScsJ1xcdTA0NDInOid0Y3knLCdcXHUyMERCJzondGRvdCcsJ1xcdTIzMTUnOid0ZWxyZWMnLCdcXHVEODM1XFx1REQxNyc6J1RmcicsJ1xcdUQ4MzVcXHVERDMxJzondGZyJywnXFx1MjIzNCc6J3RoZXJlNCcsJ1xcdTAzOTgnOidUaGV0YScsJ1xcdTAzQjgnOid0aGV0YScsJ1xcdTAzRDEnOid0aGV0YXYnLCdcXHUyMDVGXFx1MjAwQSc6J1RoaWNrU3BhY2UnLCdcXHUyMDA5JzondGhpbnNwJywnXFx4REUnOidUSE9STicsJ1xceEZFJzondGhvcm4nLCdcXHUyQTMxJzondGltZXNiYXInLCdcXHhENyc6J3RpbWVzJywnXFx1MkEzMCc6J3RpbWVzZCcsJ1xcdTIzMzYnOid0b3Bib3QnLCdcXHUyQUYxJzondG9wY2lyJywnXFx1RDgzNVxcdURENEInOidUb3BmJywnXFx1RDgzNVxcdURENjUnOid0b3BmJywnXFx1MkFEQSc6J3RvcGZvcmsnLCdcXHUyMDM0JzondHByaW1lJywnXFx1MjEyMic6J3RyYWRlJywnXFx1MjVCNSc6J3V0cmknLCdcXHUyMjVDJzondHJpZScsJ1xcdTI1RUMnOid0cmlkb3QnLCdcXHUyQTNBJzondHJpbWludXMnLCdcXHUyQTM5JzondHJpcGx1cycsJ1xcdTI5Q0QnOid0cmlzYicsJ1xcdTJBM0InOid0cml0aW1lJywnXFx1MjNFMic6J3RycGV6aXVtJywnXFx1RDgzNVxcdURDQUYnOidUc2NyJywnXFx1RDgzNVxcdURDQzknOid0c2NyJywnXFx1MDQyNic6J1RTY3knLCdcXHUwNDQ2JzondHNjeScsJ1xcdTA0MEInOidUU0hjeScsJ1xcdTA0NUInOid0c2hjeScsJ1xcdTAxNjYnOidUc3Ryb2snLCdcXHUwMTY3JzondHN0cm9rJywnXFx4REEnOidVYWN1dGUnLCdcXHhGQSc6J3VhY3V0ZScsJ1xcdTIxOUYnOidVYXJyJywnXFx1Mjk0OSc6J1VhcnJvY2lyJywnXFx1MDQwRSc6J1VicmN5JywnXFx1MDQ1RSc6J3VicmN5JywnXFx1MDE2Qyc6J1VicmV2ZScsJ1xcdTAxNkQnOid1YnJldmUnLCdcXHhEQic6J1VjaXJjJywnXFx4RkInOid1Y2lyYycsJ1xcdTA0MjMnOidVY3knLCdcXHUwNDQzJzondWN5JywnXFx1MjFDNSc6J3VkYXJyJywnXFx1MDE3MCc6J1VkYmxhYycsJ1xcdTAxNzEnOid1ZGJsYWMnLCdcXHUyOTZFJzondWRoYXInLCdcXHUyOTdFJzondWZpc2h0JywnXFx1RDgzNVxcdUREMTgnOidVZnInLCdcXHVEODM1XFx1REQzMic6J3VmcicsJ1xceEQ5JzonVWdyYXZlJywnXFx4RjknOid1Z3JhdmUnLCdcXHUyOTYzJzondUhhcicsJ1xcdTI1ODAnOid1aGJsaycsJ1xcdTIzMUMnOid1bGNvcm4nLCdcXHUyMzBGJzondWxjcm9wJywnXFx1MjVGOCc6J3VsdHJpJywnXFx1MDE2QSc6J1VtYWNyJywnXFx1MDE2Qic6J3VtYWNyJywnXFx1MjNERic6J1VuZGVyQnJhY2UnLCdcXHUyM0REJzonVW5kZXJQYXJlbnRoZXNpcycsJ1xcdTIyOEUnOid1cGx1cycsJ1xcdTAxNzInOidVb2dvbicsJ1xcdTAxNzMnOid1b2dvbicsJ1xcdUQ4MzVcXHVERDRDJzonVW9wZicsJ1xcdUQ4MzVcXHVERDY2JzondW9wZicsJ1xcdTI5MTInOidVcEFycm93QmFyJywnXFx1MjE5NSc6J3ZhcnInLCdcXHUwM0M1JzondXBzaScsJ1xcdTAzRDInOidVcHNpJywnXFx1MDNBNSc6J1Vwc2lsb24nLCdcXHUyMUM4JzondXVhcnInLCdcXHUyMzFEJzondXJjb3JuJywnXFx1MjMwRSc6J3VyY3JvcCcsJ1xcdTAxNkUnOidVcmluZycsJ1xcdTAxNkYnOid1cmluZycsJ1xcdTI1RjknOid1cnRyaScsJ1xcdUQ4MzVcXHVEQ0IwJzonVXNjcicsJ1xcdUQ4MzVcXHVEQ0NBJzondXNjcicsJ1xcdTIyRjAnOid1dGRvdCcsJ1xcdTAxNjgnOidVdGlsZGUnLCdcXHUwMTY5JzondXRpbGRlJywnXFx4REMnOidVdW1sJywnXFx4RkMnOid1dW1sJywnXFx1MjlBNyc6J3V3YW5nbGUnLCdcXHUyOTlDJzondmFuZ3J0JywnXFx1MjI4QVxcdUZFMDAnOid2c3VibmUnLCdcXHUyQUNCXFx1RkUwMCc6J3ZzdWJuRScsJ1xcdTIyOEJcXHVGRTAwJzondnN1cG5lJywnXFx1MkFDQ1xcdUZFMDAnOid2c3VwbkUnLCdcXHUyQUU4JzondkJhcicsJ1xcdTJBRUInOidWYmFyJywnXFx1MkFFOSc6J3ZCYXJ2JywnXFx1MDQxMic6J1ZjeScsJ1xcdTA0MzInOid2Y3knLCdcXHUyMkE5JzonVmRhc2gnLCdcXHUyMkFCJzonVkRhc2gnLCdcXHUyQUU2JzonVmRhc2hsJywnXFx1MjJCQic6J3ZlZWJhcicsJ1xcdTIyNUEnOid2ZWVlcScsJ1xcdTIyRUUnOid2ZWxsaXAnLCd8JzondmVydCcsJ1xcdTIwMTYnOidWZXJ0JywnXFx1Mjc1OCc6J1ZlcnRpY2FsU2VwYXJhdG9yJywnXFx1MjI0MCc6J3dyJywnXFx1RDgzNVxcdUREMTknOidWZnInLCdcXHVEODM1XFx1REQzMyc6J3ZmcicsJ1xcdUQ4MzVcXHVERDREJzonVm9wZicsJ1xcdUQ4MzVcXHVERDY3Jzondm9wZicsJ1xcdUQ4MzVcXHVEQ0IxJzonVnNjcicsJ1xcdUQ4MzVcXHVEQ0NCJzondnNjcicsJ1xcdTIyQUEnOidWdmRhc2gnLCdcXHUyOTlBJzondnppZ3phZycsJ1xcdTAxNzQnOidXY2lyYycsJ1xcdTAxNzUnOid3Y2lyYycsJ1xcdTJBNUYnOid3ZWRiYXInLCdcXHUyMjU5Jzond2VkZ2VxJywnXFx1MjExOCc6J3dwJywnXFx1RDgzNVxcdUREMUEnOidXZnInLCdcXHVEODM1XFx1REQzNCc6J3dmcicsJ1xcdUQ4MzVcXHVERDRFJzonV29wZicsJ1xcdUQ4MzVcXHVERDY4Jzond29wZicsJ1xcdUQ4MzVcXHVEQ0IyJzonV3NjcicsJ1xcdUQ4MzVcXHVEQ0NDJzond3NjcicsJ1xcdUQ4MzVcXHVERDFCJzonWGZyJywnXFx1RDgzNVxcdUREMzUnOid4ZnInLCdcXHUwMzlFJzonWGknLCdcXHUwM0JFJzoneGknLCdcXHUyMkZCJzoneG5pcycsJ1xcdUQ4MzVcXHVERDRGJzonWG9wZicsJ1xcdUQ4MzVcXHVERDY5JzoneG9wZicsJ1xcdUQ4MzVcXHVEQ0IzJzonWHNjcicsJ1xcdUQ4MzVcXHVEQ0NEJzoneHNjcicsJ1xceEREJzonWWFjdXRlJywnXFx4RkQnOid5YWN1dGUnLCdcXHUwNDJGJzonWUFjeScsJ1xcdTA0NEYnOid5YWN5JywnXFx1MDE3Nic6J1ljaXJjJywnXFx1MDE3Nyc6J3ljaXJjJywnXFx1MDQyQic6J1ljeScsJ1xcdTA0NEInOid5Y3knLCdcXHhBNSc6J3llbicsJ1xcdUQ4MzVcXHVERDFDJzonWWZyJywnXFx1RDgzNVxcdUREMzYnOid5ZnInLCdcXHUwNDA3JzonWUljeScsJ1xcdTA0NTcnOid5aWN5JywnXFx1RDgzNVxcdURENTAnOidZb3BmJywnXFx1RDgzNVxcdURENkEnOid5b3BmJywnXFx1RDgzNVxcdURDQjQnOidZc2NyJywnXFx1RDgzNVxcdURDQ0UnOid5c2NyJywnXFx1MDQyRSc6J1lVY3knLCdcXHUwNDRFJzoneXVjeScsJ1xceEZGJzoneXVtbCcsJ1xcdTAxNzgnOidZdW1sJywnXFx1MDE3OSc6J1phY3V0ZScsJ1xcdTAxN0EnOid6YWN1dGUnLCdcXHUwMTdEJzonWmNhcm9uJywnXFx1MDE3RSc6J3pjYXJvbicsJ1xcdTA0MTcnOidaY3knLCdcXHUwNDM3JzonemN5JywnXFx1MDE3Qic6J1pkb3QnLCdcXHUwMTdDJzonemRvdCcsJ1xcdTIxMjgnOidaZnInLCdcXHUwMzk2JzonWmV0YScsJ1xcdTAzQjYnOid6ZXRhJywnXFx1RDgzNVxcdUREMzcnOid6ZnInLCdcXHUwNDE2JzonWkhjeScsJ1xcdTA0MzYnOid6aGN5JywnXFx1MjFERCc6J3ppZ3JhcnInLCdcXHVEODM1XFx1REQ2Qic6J3pvcGYnLCdcXHVEODM1XFx1RENCNSc6J1pzY3InLCdcXHVEODM1XFx1RENDRic6J3pzY3InLCdcXHUyMDBEJzonendqJywnXFx1MjAwQyc6J3p3bmonfTtcblxuXHR2YXIgcmVnZXhFc2NhcGUgPSAvW1wiJic8PmBdL2c7XG5cdHZhciBlc2NhcGVNYXAgPSB7XG5cdFx0J1wiJzogJyZxdW90OycsXG5cdFx0JyYnOiAnJmFtcDsnLFxuXHRcdCdcXCcnOiAnJiN4Mjc7Jyxcblx0XHQnPCc6ICcmbHQ7Jyxcblx0XHQvLyBTZWUgaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHM6IGluIEhUTUwsIHRoZVxuXHRcdC8vIGZvbGxvd2luZyBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IHVubGVzcyBpdOKAmXMgcGFydCBvZiBhIHRhZyBvciBhblxuXHRcdC8vIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS4gV2XigJlyZSBvbmx5IGVzY2FwaW5nIGl0IHRvIHN1cHBvcnQgdGhvc2Vcblx0XHQvLyBzaXR1YXRpb25zLCBhbmQgZm9yIFhNTCBzdXBwb3J0LlxuXHRcdCc+JzogJyZndDsnLFxuXHRcdC8vIEluIEludGVybmV0IEV4cGxvcmVyIOKJpCA4LCB0aGUgYmFja3RpY2sgY2hhcmFjdGVyIGNhbiBiZSB1c2VkXG5cdFx0Ly8gdG8gYnJlYWsgb3V0IG9mICh1bilxdW90ZWQgYXR0cmlidXRlIHZhbHVlcyBvciBIVE1MIGNvbW1lbnRzLlxuXHRcdC8vIFNlZSBodHRwOi8vaHRtbDVzZWMub3JnLyMxMDIsIGh0dHA6Ly9odG1sNXNlYy5vcmcvIzEwOCwgYW5kXG5cdFx0Ly8gaHR0cDovL2h0bWw1c2VjLm9yZy8jMTMzLlxuXHRcdCdgJzogJyYjeDYwOydcblx0fTtcblxuXHR2YXIgcmVnZXhJbnZhbGlkRW50aXR5ID0gLyYjKD86W3hYXVteYS1mQS1GMC05XXxbXjAtOXhYXSkvO1xuXHR2YXIgcmVnZXhJbnZhbGlkUmF3Q29kZVBvaW50ID0gL1tcXDAtXFx4MDhcXHgwQlxceDBFLVxceDFGXFx4N0YtXFx4OUZcXHVGREQwLVxcdUZERUZcXHVGRkZFXFx1RkZGRl18W1xcdUQ4M0ZcXHVEODdGXFx1RDhCRlxcdUQ4RkZcXHVEOTNGXFx1RDk3RlxcdUQ5QkZcXHVEOUZGXFx1REEzRlxcdURBN0ZcXHVEQUJGXFx1REFGRlxcdURCM0ZcXHVEQjdGXFx1REJCRlxcdURCRkZdW1xcdURGRkVcXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXS87XG5cdHZhciByZWdleERlY29kZSA9IC8mIyhbMC05XSspKDs/KXwmI1t4WF0oW2EtZkEtRjAtOV0rKSg7Pyl8JihbMC05YS16QS1aXSspO3wmKEFhY3V0ZXxpYWN1dGV8VWFjdXRlfHBsdXNtbnxvdGlsZGV8T3RpbGRlfEFncmF2ZXxhZ3JhdmV8eWFjdXRlfFlhY3V0ZXxvc2xhc2h8T3NsYXNofEF0aWxkZXxhdGlsZGV8YnJ2YmFyfENjZWRpbHxjY2VkaWx8b2dyYXZlfGN1cnJlbnxkaXZpZGV8RWFjdXRlfGVhY3V0ZXxPZ3JhdmV8b2FjdXRlfEVncmF2ZXxlZ3JhdmV8dWdyYXZlfGZyYWMxMnxmcmFjMTR8ZnJhYzM0fFVncmF2ZXxPYWN1dGV8SWFjdXRlfG50aWxkZXxOdGlsZGV8dWFjdXRlfG1pZGRvdHxJZ3JhdmV8aWdyYXZlfGlxdWVzdHxhYWN1dGV8bGFxdW98VEhPUk58bWljcm98aWV4Y2x8aWNpcmN8SWNpcmN8QWNpcmN8dWNpcmN8ZWNpcmN8T2NpcmN8b2NpcmN8RWNpcmN8VWNpcmN8YXJpbmd8QXJpbmd8YWVsaWd8QUVsaWd8YWN1dGV8cG91bmR8cmFxdW98YWNpcmN8dGltZXN8dGhvcm58c3psaWd8Y2VkaWx8Q09QWXxBdW1sfG9yZGZ8b3JkbXx1dW1sfG1hY3J8VXVtbHxhdW1sfE91bWx8b3VtbHxwYXJhfG5ic3B8RXVtbHxxdW90fFFVT1R8ZXVtbHx5dW1sfGNlbnR8c2VjdHxjb3B5fHN1cDF8c3VwMnxzdXAzfEl1bWx8aXVtbHxzaHl8ZXRofHJlZ3xub3R8eWVufGFtcHxBTVB8UkVHfHVtbHxFVEh8ZGVnfGd0fEdUfExUfGx0KShbPWEtekEtWjAtOV0pPy9nO1xuXHR2YXIgZGVjb2RlTWFwID0geydBYWN1dGUnOidcXHhDMScsJ2FhY3V0ZSc6J1xceEUxJywnQWJyZXZlJzonXFx1MDEwMicsJ2FicmV2ZSc6J1xcdTAxMDMnLCdhYyc6J1xcdTIyM0UnLCdhY2QnOidcXHUyMjNGJywnYWNFJzonXFx1MjIzRVxcdTAzMzMnLCdBY2lyYyc6J1xceEMyJywnYWNpcmMnOidcXHhFMicsJ2FjdXRlJzonXFx4QjQnLCdBY3knOidcXHUwNDEwJywnYWN5JzonXFx1MDQzMCcsJ0FFbGlnJzonXFx4QzYnLCdhZWxpZyc6J1xceEU2JywnYWYnOidcXHUyMDYxJywnQWZyJzonXFx1RDgzNVxcdUREMDQnLCdhZnInOidcXHVEODM1XFx1REQxRScsJ0FncmF2ZSc6J1xceEMwJywnYWdyYXZlJzonXFx4RTAnLCdhbGVmc3ltJzonXFx1MjEzNScsJ2FsZXBoJzonXFx1MjEzNScsJ0FscGhhJzonXFx1MDM5MScsJ2FscGhhJzonXFx1MDNCMScsJ0FtYWNyJzonXFx1MDEwMCcsJ2FtYWNyJzonXFx1MDEwMScsJ2FtYWxnJzonXFx1MkEzRicsJ2FtcCc6JyYnLCdBTVAnOicmJywnYW5kYW5kJzonXFx1MkE1NScsJ0FuZCc6J1xcdTJBNTMnLCdhbmQnOidcXHUyMjI3JywnYW5kZCc6J1xcdTJBNUMnLCdhbmRzbG9wZSc6J1xcdTJBNTgnLCdhbmR2JzonXFx1MkE1QScsJ2FuZyc6J1xcdTIyMjAnLCdhbmdlJzonXFx1MjlBNCcsJ2FuZ2xlJzonXFx1MjIyMCcsJ2FuZ21zZGFhJzonXFx1MjlBOCcsJ2FuZ21zZGFiJzonXFx1MjlBOScsJ2FuZ21zZGFjJzonXFx1MjlBQScsJ2FuZ21zZGFkJzonXFx1MjlBQicsJ2FuZ21zZGFlJzonXFx1MjlBQycsJ2FuZ21zZGFmJzonXFx1MjlBRCcsJ2FuZ21zZGFnJzonXFx1MjlBRScsJ2FuZ21zZGFoJzonXFx1MjlBRicsJ2FuZ21zZCc6J1xcdTIyMjEnLCdhbmdydCc6J1xcdTIyMUYnLCdhbmdydHZiJzonXFx1MjJCRScsJ2FuZ3J0dmJkJzonXFx1Mjk5RCcsJ2FuZ3NwaCc6J1xcdTIyMjInLCdhbmdzdCc6J1xceEM1JywnYW5nemFycic6J1xcdTIzN0MnLCdBb2dvbic6J1xcdTAxMDQnLCdhb2dvbic6J1xcdTAxMDUnLCdBb3BmJzonXFx1RDgzNVxcdUREMzgnLCdhb3BmJzonXFx1RDgzNVxcdURENTInLCdhcGFjaXInOidcXHUyQTZGJywnYXAnOidcXHUyMjQ4JywnYXBFJzonXFx1MkE3MCcsJ2FwZSc6J1xcdTIyNEEnLCdhcGlkJzonXFx1MjI0QicsJ2Fwb3MnOidcXCcnLCdBcHBseUZ1bmN0aW9uJzonXFx1MjA2MScsJ2FwcHJveCc6J1xcdTIyNDgnLCdhcHByb3hlcSc6J1xcdTIyNEEnLCdBcmluZyc6J1xceEM1JywnYXJpbmcnOidcXHhFNScsJ0FzY3InOidcXHVEODM1XFx1REM5QycsJ2FzY3InOidcXHVEODM1XFx1RENCNicsJ0Fzc2lnbic6J1xcdTIyNTQnLCdhc3QnOicqJywnYXN5bXAnOidcXHUyMjQ4JywnYXN5bXBlcSc6J1xcdTIyNEQnLCdBdGlsZGUnOidcXHhDMycsJ2F0aWxkZSc6J1xceEUzJywnQXVtbCc6J1xceEM0JywnYXVtbCc6J1xceEU0JywnYXdjb25pbnQnOidcXHUyMjMzJywnYXdpbnQnOidcXHUyQTExJywnYmFja2NvbmcnOidcXHUyMjRDJywnYmFja2Vwc2lsb24nOidcXHUwM0Y2JywnYmFja3ByaW1lJzonXFx1MjAzNScsJ2JhY2tzaW0nOidcXHUyMjNEJywnYmFja3NpbWVxJzonXFx1MjJDRCcsJ0JhY2tzbGFzaCc6J1xcdTIyMTYnLCdCYXJ2JzonXFx1MkFFNycsJ2JhcnZlZSc6J1xcdTIyQkQnLCdiYXJ3ZWQnOidcXHUyMzA1JywnQmFyd2VkJzonXFx1MjMwNicsJ2JhcndlZGdlJzonXFx1MjMwNScsJ2JicmsnOidcXHUyM0I1JywnYmJya3RicmsnOidcXHUyM0I2JywnYmNvbmcnOidcXHUyMjRDJywnQmN5JzonXFx1MDQxMScsJ2JjeSc6J1xcdTA0MzEnLCdiZHF1byc6J1xcdTIwMUUnLCdiZWNhdXMnOidcXHUyMjM1JywnYmVjYXVzZSc6J1xcdTIyMzUnLCdCZWNhdXNlJzonXFx1MjIzNScsJ2JlbXB0eXYnOidcXHUyOUIwJywnYmVwc2knOidcXHUwM0Y2JywnYmVybm91JzonXFx1MjEyQycsJ0Jlcm5vdWxsaXMnOidcXHUyMTJDJywnQmV0YSc6J1xcdTAzOTInLCdiZXRhJzonXFx1MDNCMicsJ2JldGgnOidcXHUyMTM2JywnYmV0d2Vlbic6J1xcdTIyNkMnLCdCZnInOidcXHVEODM1XFx1REQwNScsJ2Jmcic6J1xcdUQ4MzVcXHVERDFGJywnYmlnY2FwJzonXFx1MjJDMicsJ2JpZ2NpcmMnOidcXHUyNUVGJywnYmlnY3VwJzonXFx1MjJDMycsJ2JpZ29kb3QnOidcXHUyQTAwJywnYmlnb3BsdXMnOidcXHUyQTAxJywnYmlnb3RpbWVzJzonXFx1MkEwMicsJ2JpZ3NxY3VwJzonXFx1MkEwNicsJ2JpZ3N0YXInOidcXHUyNjA1JywnYmlndHJpYW5nbGVkb3duJzonXFx1MjVCRCcsJ2JpZ3RyaWFuZ2xldXAnOidcXHUyNUIzJywnYmlndXBsdXMnOidcXHUyQTA0JywnYmlndmVlJzonXFx1MjJDMScsJ2JpZ3dlZGdlJzonXFx1MjJDMCcsJ2JrYXJvdyc6J1xcdTI5MEQnLCdibGFja2xvemVuZ2UnOidcXHUyOUVCJywnYmxhY2tzcXVhcmUnOidcXHUyNUFBJywnYmxhY2t0cmlhbmdsZSc6J1xcdTI1QjQnLCdibGFja3RyaWFuZ2xlZG93bic6J1xcdTI1QkUnLCdibGFja3RyaWFuZ2xlbGVmdCc6J1xcdTI1QzInLCdibGFja3RyaWFuZ2xlcmlnaHQnOidcXHUyNUI4JywnYmxhbmsnOidcXHUyNDIzJywnYmxrMTInOidcXHUyNTkyJywnYmxrMTQnOidcXHUyNTkxJywnYmxrMzQnOidcXHUyNTkzJywnYmxvY2snOidcXHUyNTg4JywnYm5lJzonPVxcdTIwRTUnLCdibmVxdWl2JzonXFx1MjI2MVxcdTIwRTUnLCdiTm90JzonXFx1MkFFRCcsJ2Jub3QnOidcXHUyMzEwJywnQm9wZic6J1xcdUQ4MzVcXHVERDM5JywnYm9wZic6J1xcdUQ4MzVcXHVERDUzJywnYm90JzonXFx1MjJBNScsJ2JvdHRvbSc6J1xcdTIyQTUnLCdib3d0aWUnOidcXHUyMkM4JywnYm94Ym94JzonXFx1MjlDOScsJ2JveGRsJzonXFx1MjUxMCcsJ2JveGRMJzonXFx1MjU1NScsJ2JveERsJzonXFx1MjU1NicsJ2JveERMJzonXFx1MjU1NycsJ2JveGRyJzonXFx1MjUwQycsJ2JveGRSJzonXFx1MjU1MicsJ2JveERyJzonXFx1MjU1MycsJ2JveERSJzonXFx1MjU1NCcsJ2JveGgnOidcXHUyNTAwJywnYm94SCc6J1xcdTI1NTAnLCdib3hoZCc6J1xcdTI1MkMnLCdib3hIZCc6J1xcdTI1NjQnLCdib3hoRCc6J1xcdTI1NjUnLCdib3hIRCc6J1xcdTI1NjYnLCdib3hodSc6J1xcdTI1MzQnLCdib3hIdSc6J1xcdTI1NjcnLCdib3hoVSc6J1xcdTI1NjgnLCdib3hIVSc6J1xcdTI1NjknLCdib3htaW51cyc6J1xcdTIyOUYnLCdib3hwbHVzJzonXFx1MjI5RScsJ2JveHRpbWVzJzonXFx1MjJBMCcsJ2JveHVsJzonXFx1MjUxOCcsJ2JveHVMJzonXFx1MjU1QicsJ2JveFVsJzonXFx1MjU1QycsJ2JveFVMJzonXFx1MjU1RCcsJ2JveHVyJzonXFx1MjUxNCcsJ2JveHVSJzonXFx1MjU1OCcsJ2JveFVyJzonXFx1MjU1OScsJ2JveFVSJzonXFx1MjU1QScsJ2JveHYnOidcXHUyNTAyJywnYm94Vic6J1xcdTI1NTEnLCdib3h2aCc6J1xcdTI1M0MnLCdib3h2SCc6J1xcdTI1NkEnLCdib3hWaCc6J1xcdTI1NkInLCdib3hWSCc6J1xcdTI1NkMnLCdib3h2bCc6J1xcdTI1MjQnLCdib3h2TCc6J1xcdTI1NjEnLCdib3hWbCc6J1xcdTI1NjInLCdib3hWTCc6J1xcdTI1NjMnLCdib3h2cic6J1xcdTI1MUMnLCdib3h2Uic6J1xcdTI1NUUnLCdib3hWcic6J1xcdTI1NUYnLCdib3hWUic6J1xcdTI1NjAnLCdicHJpbWUnOidcXHUyMDM1JywnYnJldmUnOidcXHUwMkQ4JywnQnJldmUnOidcXHUwMkQ4JywnYnJ2YmFyJzonXFx4QTYnLCdic2NyJzonXFx1RDgzNVxcdURDQjcnLCdCc2NyJzonXFx1MjEyQycsJ2JzZW1pJzonXFx1MjA0RicsJ2JzaW0nOidcXHUyMjNEJywnYnNpbWUnOidcXHUyMkNEJywnYnNvbGInOidcXHUyOUM1JywnYnNvbCc6J1xcXFwnLCdic29saHN1Yic6J1xcdTI3QzgnLCdidWxsJzonXFx1MjAyMicsJ2J1bGxldCc6J1xcdTIwMjInLCdidW1wJzonXFx1MjI0RScsJ2J1bXBFJzonXFx1MkFBRScsJ2J1bXBlJzonXFx1MjI0RicsJ0J1bXBlcSc6J1xcdTIyNEUnLCdidW1wZXEnOidcXHUyMjRGJywnQ2FjdXRlJzonXFx1MDEwNicsJ2NhY3V0ZSc6J1xcdTAxMDcnLCdjYXBhbmQnOidcXHUyQTQ0JywnY2FwYnJjdXAnOidcXHUyQTQ5JywnY2FwY2FwJzonXFx1MkE0QicsJ2NhcCc6J1xcdTIyMjknLCdDYXAnOidcXHUyMkQyJywnY2FwY3VwJzonXFx1MkE0NycsJ2NhcGRvdCc6J1xcdTJBNDAnLCdDYXBpdGFsRGlmZmVyZW50aWFsRCc6J1xcdTIxNDUnLCdjYXBzJzonXFx1MjIyOVxcdUZFMDAnLCdjYXJldCc6J1xcdTIwNDEnLCdjYXJvbic6J1xcdTAyQzcnLCdDYXlsZXlzJzonXFx1MjEyRCcsJ2NjYXBzJzonXFx1MkE0RCcsJ0NjYXJvbic6J1xcdTAxMEMnLCdjY2Fyb24nOidcXHUwMTBEJywnQ2NlZGlsJzonXFx4QzcnLCdjY2VkaWwnOidcXHhFNycsJ0NjaXJjJzonXFx1MDEwOCcsJ2NjaXJjJzonXFx1MDEwOScsJ0Njb25pbnQnOidcXHUyMjMwJywnY2N1cHMnOidcXHUyQTRDJywnY2N1cHNzbSc6J1xcdTJBNTAnLCdDZG90JzonXFx1MDEwQScsJ2Nkb3QnOidcXHUwMTBCJywnY2VkaWwnOidcXHhCOCcsJ0NlZGlsbGEnOidcXHhCOCcsJ2NlbXB0eXYnOidcXHUyOUIyJywnY2VudCc6J1xceEEyJywnY2VudGVyZG90JzonXFx4QjcnLCdDZW50ZXJEb3QnOidcXHhCNycsJ2Nmcic6J1xcdUQ4MzVcXHVERDIwJywnQ2ZyJzonXFx1MjEyRCcsJ0NIY3knOidcXHUwNDI3JywnY2hjeSc6J1xcdTA0NDcnLCdjaGVjayc6J1xcdTI3MTMnLCdjaGVja21hcmsnOidcXHUyNzEzJywnQ2hpJzonXFx1MDNBNycsJ2NoaSc6J1xcdTAzQzcnLCdjaXJjJzonXFx1MDJDNicsJ2NpcmNlcSc6J1xcdTIyNTcnLCdjaXJjbGVhcnJvd2xlZnQnOidcXHUyMUJBJywnY2lyY2xlYXJyb3dyaWdodCc6J1xcdTIxQkInLCdjaXJjbGVkYXN0JzonXFx1MjI5QicsJ2NpcmNsZWRjaXJjJzonXFx1MjI5QScsJ2NpcmNsZWRkYXNoJzonXFx1MjI5RCcsJ0NpcmNsZURvdCc6J1xcdTIyOTknLCdjaXJjbGVkUic6J1xceEFFJywnY2lyY2xlZFMnOidcXHUyNEM4JywnQ2lyY2xlTWludXMnOidcXHUyMjk2JywnQ2lyY2xlUGx1cyc6J1xcdTIyOTUnLCdDaXJjbGVUaW1lcyc6J1xcdTIyOTcnLCdjaXInOidcXHUyNUNCJywnY2lyRSc6J1xcdTI5QzMnLCdjaXJlJzonXFx1MjI1NycsJ2NpcmZuaW50JzonXFx1MkExMCcsJ2Npcm1pZCc6J1xcdTJBRUYnLCdjaXJzY2lyJzonXFx1MjlDMicsJ0Nsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbCc6J1xcdTIyMzInLCdDbG9zZUN1cmx5RG91YmxlUXVvdGUnOidcXHUyMDFEJywnQ2xvc2VDdXJseVF1b3RlJzonXFx1MjAxOScsJ2NsdWJzJzonXFx1MjY2MycsJ2NsdWJzdWl0JzonXFx1MjY2MycsJ2NvbG9uJzonOicsJ0NvbG9uJzonXFx1MjIzNycsJ0NvbG9uZSc6J1xcdTJBNzQnLCdjb2xvbmUnOidcXHUyMjU0JywnY29sb25lcSc6J1xcdTIyNTQnLCdjb21tYSc6JywnLCdjb21tYXQnOidAJywnY29tcCc6J1xcdTIyMDEnLCdjb21wZm4nOidcXHUyMjE4JywnY29tcGxlbWVudCc6J1xcdTIyMDEnLCdjb21wbGV4ZXMnOidcXHUyMTAyJywnY29uZyc6J1xcdTIyNDUnLCdjb25nZG90JzonXFx1MkE2RCcsJ0NvbmdydWVudCc6J1xcdTIyNjEnLCdjb25pbnQnOidcXHUyMjJFJywnQ29uaW50JzonXFx1MjIyRicsJ0NvbnRvdXJJbnRlZ3JhbCc6J1xcdTIyMkUnLCdjb3BmJzonXFx1RDgzNVxcdURENTQnLCdDb3BmJzonXFx1MjEwMicsJ2NvcHJvZCc6J1xcdTIyMTAnLCdDb3Byb2R1Y3QnOidcXHUyMjEwJywnY29weSc6J1xceEE5JywnQ09QWSc6J1xceEE5JywnY29weXNyJzonXFx1MjExNycsJ0NvdW50ZXJDbG9ja3dpc2VDb250b3VySW50ZWdyYWwnOidcXHUyMjMzJywnY3JhcnInOidcXHUyMUI1JywnY3Jvc3MnOidcXHUyNzE3JywnQ3Jvc3MnOidcXHUyQTJGJywnQ3Njcic6J1xcdUQ4MzVcXHVEQzlFJywnY3Njcic6J1xcdUQ4MzVcXHVEQ0I4JywnY3N1Yic6J1xcdTJBQ0YnLCdjc3ViZSc6J1xcdTJBRDEnLCdjc3VwJzonXFx1MkFEMCcsJ2NzdXBlJzonXFx1MkFEMicsJ2N0ZG90JzonXFx1MjJFRicsJ2N1ZGFycmwnOidcXHUyOTM4JywnY3VkYXJycic6J1xcdTI5MzUnLCdjdWVwcic6J1xcdTIyREUnLCdjdWVzYyc6J1xcdTIyREYnLCdjdWxhcnInOidcXHUyMUI2JywnY3VsYXJycCc6J1xcdTI5M0QnLCdjdXBicmNhcCc6J1xcdTJBNDgnLCdjdXBjYXAnOidcXHUyQTQ2JywnQ3VwQ2FwJzonXFx1MjI0RCcsJ2N1cCc6J1xcdTIyMkEnLCdDdXAnOidcXHUyMkQzJywnY3VwY3VwJzonXFx1MkE0QScsJ2N1cGRvdCc6J1xcdTIyOEQnLCdjdXBvcic6J1xcdTJBNDUnLCdjdXBzJzonXFx1MjIyQVxcdUZFMDAnLCdjdXJhcnInOidcXHUyMUI3JywnY3VyYXJybSc6J1xcdTI5M0MnLCdjdXJseWVxcHJlYyc6J1xcdTIyREUnLCdjdXJseWVxc3VjYyc6J1xcdTIyREYnLCdjdXJseXZlZSc6J1xcdTIyQ0UnLCdjdXJseXdlZGdlJzonXFx1MjJDRicsJ2N1cnJlbic6J1xceEE0JywnY3VydmVhcnJvd2xlZnQnOidcXHUyMUI2JywnY3VydmVhcnJvd3JpZ2h0JzonXFx1MjFCNycsJ2N1dmVlJzonXFx1MjJDRScsJ2N1d2VkJzonXFx1MjJDRicsJ2N3Y29uaW50JzonXFx1MjIzMicsJ2N3aW50JzonXFx1MjIzMScsJ2N5bGN0eSc6J1xcdTIzMkQnLCdkYWdnZXInOidcXHUyMDIwJywnRGFnZ2VyJzonXFx1MjAyMScsJ2RhbGV0aCc6J1xcdTIxMzgnLCdkYXJyJzonXFx1MjE5MycsJ0RhcnInOidcXHUyMUExJywnZEFycic6J1xcdTIxRDMnLCdkYXNoJzonXFx1MjAxMCcsJ0Rhc2h2JzonXFx1MkFFNCcsJ2Rhc2h2JzonXFx1MjJBMycsJ2Ria2Fyb3cnOidcXHUyOTBGJywnZGJsYWMnOidcXHUwMkREJywnRGNhcm9uJzonXFx1MDEwRScsJ2RjYXJvbic6J1xcdTAxMEYnLCdEY3knOidcXHUwNDE0JywnZGN5JzonXFx1MDQzNCcsJ2RkYWdnZXInOidcXHUyMDIxJywnZGRhcnInOidcXHUyMUNBJywnREQnOidcXHUyMTQ1JywnZGQnOidcXHUyMTQ2JywnRERvdHJhaGQnOidcXHUyOTExJywnZGRvdHNlcSc6J1xcdTJBNzcnLCdkZWcnOidcXHhCMCcsJ0RlbCc6J1xcdTIyMDcnLCdEZWx0YSc6J1xcdTAzOTQnLCdkZWx0YSc6J1xcdTAzQjQnLCdkZW1wdHl2JzonXFx1MjlCMScsJ2RmaXNodCc6J1xcdTI5N0YnLCdEZnInOidcXHVEODM1XFx1REQwNycsJ2Rmcic6J1xcdUQ4MzVcXHVERDIxJywnZEhhcic6J1xcdTI5NjUnLCdkaGFybCc6J1xcdTIxQzMnLCdkaGFycic6J1xcdTIxQzInLCdEaWFjcml0aWNhbEFjdXRlJzonXFx4QjQnLCdEaWFjcml0aWNhbERvdCc6J1xcdTAyRDknLCdEaWFjcml0aWNhbERvdWJsZUFjdXRlJzonXFx1MDJERCcsJ0RpYWNyaXRpY2FsR3JhdmUnOidgJywnRGlhY3JpdGljYWxUaWxkZSc6J1xcdTAyREMnLCdkaWFtJzonXFx1MjJDNCcsJ2RpYW1vbmQnOidcXHUyMkM0JywnRGlhbW9uZCc6J1xcdTIyQzQnLCdkaWFtb25kc3VpdCc6J1xcdTI2NjYnLCdkaWFtcyc6J1xcdTI2NjYnLCdkaWUnOidcXHhBOCcsJ0RpZmZlcmVudGlhbEQnOidcXHUyMTQ2JywnZGlnYW1tYSc6J1xcdTAzREQnLCdkaXNpbic6J1xcdTIyRjInLCdkaXYnOidcXHhGNycsJ2RpdmlkZSc6J1xceEY3JywnZGl2aWRlb250aW1lcyc6J1xcdTIyQzcnLCdkaXZvbngnOidcXHUyMkM3JywnREpjeSc6J1xcdTA0MDInLCdkamN5JzonXFx1MDQ1MicsJ2RsY29ybic6J1xcdTIzMUUnLCdkbGNyb3AnOidcXHUyMzBEJywnZG9sbGFyJzonJCcsJ0RvcGYnOidcXHVEODM1XFx1REQzQicsJ2RvcGYnOidcXHVEODM1XFx1REQ1NScsJ0RvdCc6J1xceEE4JywnZG90JzonXFx1MDJEOScsJ0RvdERvdCc6J1xcdTIwREMnLCdkb3RlcSc6J1xcdTIyNTAnLCdkb3RlcWRvdCc6J1xcdTIyNTEnLCdEb3RFcXVhbCc6J1xcdTIyNTAnLCdkb3RtaW51cyc6J1xcdTIyMzgnLCdkb3RwbHVzJzonXFx1MjIxNCcsJ2RvdHNxdWFyZSc6J1xcdTIyQTEnLCdkb3VibGViYXJ3ZWRnZSc6J1xcdTIzMDYnLCdEb3VibGVDb250b3VySW50ZWdyYWwnOidcXHUyMjJGJywnRG91YmxlRG90JzonXFx4QTgnLCdEb3VibGVEb3duQXJyb3cnOidcXHUyMUQzJywnRG91YmxlTGVmdEFycm93JzonXFx1MjFEMCcsJ0RvdWJsZUxlZnRSaWdodEFycm93JzonXFx1MjFENCcsJ0RvdWJsZUxlZnRUZWUnOidcXHUyQUU0JywnRG91YmxlTG9uZ0xlZnRBcnJvdyc6J1xcdTI3RjgnLCdEb3VibGVMb25nTGVmdFJpZ2h0QXJyb3cnOidcXHUyN0ZBJywnRG91YmxlTG9uZ1JpZ2h0QXJyb3cnOidcXHUyN0Y5JywnRG91YmxlUmlnaHRBcnJvdyc6J1xcdTIxRDInLCdEb3VibGVSaWdodFRlZSc6J1xcdTIyQTgnLCdEb3VibGVVcEFycm93JzonXFx1MjFEMScsJ0RvdWJsZVVwRG93bkFycm93JzonXFx1MjFENScsJ0RvdWJsZVZlcnRpY2FsQmFyJzonXFx1MjIyNScsJ0Rvd25BcnJvd0Jhcic6J1xcdTI5MTMnLCdkb3duYXJyb3cnOidcXHUyMTkzJywnRG93bkFycm93JzonXFx1MjE5MycsJ0Rvd25hcnJvdyc6J1xcdTIxRDMnLCdEb3duQXJyb3dVcEFycm93JzonXFx1MjFGNScsJ0Rvd25CcmV2ZSc6J1xcdTAzMTEnLCdkb3duZG93bmFycm93cyc6J1xcdTIxQ0EnLCdkb3duaGFycG9vbmxlZnQnOidcXHUyMUMzJywnZG93bmhhcnBvb25yaWdodCc6J1xcdTIxQzInLCdEb3duTGVmdFJpZ2h0VmVjdG9yJzonXFx1Mjk1MCcsJ0Rvd25MZWZ0VGVlVmVjdG9yJzonXFx1Mjk1RScsJ0Rvd25MZWZ0VmVjdG9yQmFyJzonXFx1Mjk1NicsJ0Rvd25MZWZ0VmVjdG9yJzonXFx1MjFCRCcsJ0Rvd25SaWdodFRlZVZlY3Rvcic6J1xcdTI5NUYnLCdEb3duUmlnaHRWZWN0b3JCYXInOidcXHUyOTU3JywnRG93blJpZ2h0VmVjdG9yJzonXFx1MjFDMScsJ0Rvd25UZWVBcnJvdyc6J1xcdTIxQTcnLCdEb3duVGVlJzonXFx1MjJBNCcsJ2RyYmthcm93JzonXFx1MjkxMCcsJ2RyY29ybic6J1xcdTIzMUYnLCdkcmNyb3AnOidcXHUyMzBDJywnRHNjcic6J1xcdUQ4MzVcXHVEQzlGJywnZHNjcic6J1xcdUQ4MzVcXHVEQ0I5JywnRFNjeSc6J1xcdTA0MDUnLCdkc2N5JzonXFx1MDQ1NScsJ2Rzb2wnOidcXHUyOUY2JywnRHN0cm9rJzonXFx1MDExMCcsJ2RzdHJvayc6J1xcdTAxMTEnLCdkdGRvdCc6J1xcdTIyRjEnLCdkdHJpJzonXFx1MjVCRicsJ2R0cmlmJzonXFx1MjVCRScsJ2R1YXJyJzonXFx1MjFGNScsJ2R1aGFyJzonXFx1Mjk2RicsJ2R3YW5nbGUnOidcXHUyOUE2JywnRFpjeSc6J1xcdTA0MEYnLCdkemN5JzonXFx1MDQ1RicsJ2R6aWdyYXJyJzonXFx1MjdGRicsJ0VhY3V0ZSc6J1xceEM5JywnZWFjdXRlJzonXFx4RTknLCdlYXN0ZXInOidcXHUyQTZFJywnRWNhcm9uJzonXFx1MDExQScsJ2VjYXJvbic6J1xcdTAxMUInLCdFY2lyYyc6J1xceENBJywnZWNpcmMnOidcXHhFQScsJ2VjaXInOidcXHUyMjU2JywnZWNvbG9uJzonXFx1MjI1NScsJ0VjeSc6J1xcdTA0MkQnLCdlY3knOidcXHUwNDREJywnZUREb3QnOidcXHUyQTc3JywnRWRvdCc6J1xcdTAxMTYnLCdlZG90JzonXFx1MDExNycsJ2VEb3QnOidcXHUyMjUxJywnZWUnOidcXHUyMTQ3JywnZWZEb3QnOidcXHUyMjUyJywnRWZyJzonXFx1RDgzNVxcdUREMDgnLCdlZnInOidcXHVEODM1XFx1REQyMicsJ2VnJzonXFx1MkE5QScsJ0VncmF2ZSc6J1xceEM4JywnZWdyYXZlJzonXFx4RTgnLCdlZ3MnOidcXHUyQTk2JywnZWdzZG90JzonXFx1MkE5OCcsJ2VsJzonXFx1MkE5OScsJ0VsZW1lbnQnOidcXHUyMjA4JywnZWxpbnRlcnMnOidcXHUyM0U3JywnZWxsJzonXFx1MjExMycsJ2Vscyc6J1xcdTJBOTUnLCdlbHNkb3QnOidcXHUyQTk3JywnRW1hY3InOidcXHUwMTEyJywnZW1hY3InOidcXHUwMTEzJywnZW1wdHknOidcXHUyMjA1JywnZW1wdHlzZXQnOidcXHUyMjA1JywnRW1wdHlTbWFsbFNxdWFyZSc6J1xcdTI1RkInLCdlbXB0eXYnOidcXHUyMjA1JywnRW1wdHlWZXJ5U21hbGxTcXVhcmUnOidcXHUyNUFCJywnZW1zcDEzJzonXFx1MjAwNCcsJ2Vtc3AxNCc6J1xcdTIwMDUnLCdlbXNwJzonXFx1MjAwMycsJ0VORyc6J1xcdTAxNEEnLCdlbmcnOidcXHUwMTRCJywnZW5zcCc6J1xcdTIwMDInLCdFb2dvbic6J1xcdTAxMTgnLCdlb2dvbic6J1xcdTAxMTknLCdFb3BmJzonXFx1RDgzNVxcdUREM0MnLCdlb3BmJzonXFx1RDgzNVxcdURENTYnLCdlcGFyJzonXFx1MjJENScsJ2VwYXJzbCc6J1xcdTI5RTMnLCdlcGx1cyc6J1xcdTJBNzEnLCdlcHNpJzonXFx1MDNCNScsJ0Vwc2lsb24nOidcXHUwMzk1JywnZXBzaWxvbic6J1xcdTAzQjUnLCdlcHNpdic6J1xcdTAzRjUnLCdlcWNpcmMnOidcXHUyMjU2JywnZXFjb2xvbic6J1xcdTIyNTUnLCdlcXNpbSc6J1xcdTIyNDInLCdlcXNsYW50Z3RyJzonXFx1MkE5NicsJ2Vxc2xhbnRsZXNzJzonXFx1MkE5NScsJ0VxdWFsJzonXFx1MkE3NScsJ2VxdWFscyc6Jz0nLCdFcXVhbFRpbGRlJzonXFx1MjI0MicsJ2VxdWVzdCc6J1xcdTIyNUYnLCdFcXVpbGlicml1bSc6J1xcdTIxQ0MnLCdlcXVpdic6J1xcdTIyNjEnLCdlcXVpdkREJzonXFx1MkE3OCcsJ2VxdnBhcnNsJzonXFx1MjlFNScsJ2VyYXJyJzonXFx1Mjk3MScsJ2VyRG90JzonXFx1MjI1MycsJ2VzY3InOidcXHUyMTJGJywnRXNjcic6J1xcdTIxMzAnLCdlc2RvdCc6J1xcdTIyNTAnLCdFc2ltJzonXFx1MkE3MycsJ2VzaW0nOidcXHUyMjQyJywnRXRhJzonXFx1MDM5NycsJ2V0YSc6J1xcdTAzQjcnLCdFVEgnOidcXHhEMCcsJ2V0aCc6J1xceEYwJywnRXVtbCc6J1xceENCJywnZXVtbCc6J1xceEVCJywnZXVybyc6J1xcdTIwQUMnLCdleGNsJzonIScsJ2V4aXN0JzonXFx1MjIwMycsJ0V4aXN0cyc6J1xcdTIyMDMnLCdleHBlY3RhdGlvbic6J1xcdTIxMzAnLCdleHBvbmVudGlhbGUnOidcXHUyMTQ3JywnRXhwb25lbnRpYWxFJzonXFx1MjE0NycsJ2ZhbGxpbmdkb3RzZXEnOidcXHUyMjUyJywnRmN5JzonXFx1MDQyNCcsJ2ZjeSc6J1xcdTA0NDQnLCdmZW1hbGUnOidcXHUyNjQwJywnZmZpbGlnJzonXFx1RkIwMycsJ2ZmbGlnJzonXFx1RkIwMCcsJ2ZmbGxpZyc6J1xcdUZCMDQnLCdGZnInOidcXHVEODM1XFx1REQwOScsJ2Zmcic6J1xcdUQ4MzVcXHVERDIzJywnZmlsaWcnOidcXHVGQjAxJywnRmlsbGVkU21hbGxTcXVhcmUnOidcXHUyNUZDJywnRmlsbGVkVmVyeVNtYWxsU3F1YXJlJzonXFx1MjVBQScsJ2ZqbGlnJzonZmonLCdmbGF0JzonXFx1MjY2RCcsJ2ZsbGlnJzonXFx1RkIwMicsJ2ZsdG5zJzonXFx1MjVCMScsJ2Zub2YnOidcXHUwMTkyJywnRm9wZic6J1xcdUQ4MzVcXHVERDNEJywnZm9wZic6J1xcdUQ4MzVcXHVERDU3JywnZm9yYWxsJzonXFx1MjIwMCcsJ0ZvckFsbCc6J1xcdTIyMDAnLCdmb3JrJzonXFx1MjJENCcsJ2Zvcmt2JzonXFx1MkFEOScsJ0ZvdXJpZXJ0cmYnOidcXHUyMTMxJywnZnBhcnRpbnQnOidcXHUyQTBEJywnZnJhYzEyJzonXFx4QkQnLCdmcmFjMTMnOidcXHUyMTUzJywnZnJhYzE0JzonXFx4QkMnLCdmcmFjMTUnOidcXHUyMTU1JywnZnJhYzE2JzonXFx1MjE1OScsJ2ZyYWMxOCc6J1xcdTIxNUInLCdmcmFjMjMnOidcXHUyMTU0JywnZnJhYzI1JzonXFx1MjE1NicsJ2ZyYWMzNCc6J1xceEJFJywnZnJhYzM1JzonXFx1MjE1NycsJ2ZyYWMzOCc6J1xcdTIxNUMnLCdmcmFjNDUnOidcXHUyMTU4JywnZnJhYzU2JzonXFx1MjE1QScsJ2ZyYWM1OCc6J1xcdTIxNUQnLCdmcmFjNzgnOidcXHUyMTVFJywnZnJhc2wnOidcXHUyMDQ0JywnZnJvd24nOidcXHUyMzIyJywnZnNjcic6J1xcdUQ4MzVcXHVEQ0JCJywnRnNjcic6J1xcdTIxMzEnLCdnYWN1dGUnOidcXHUwMUY1JywnR2FtbWEnOidcXHUwMzkzJywnZ2FtbWEnOidcXHUwM0IzJywnR2FtbWFkJzonXFx1MDNEQycsJ2dhbW1hZCc6J1xcdTAzREQnLCdnYXAnOidcXHUyQTg2JywnR2JyZXZlJzonXFx1MDExRScsJ2dicmV2ZSc6J1xcdTAxMUYnLCdHY2VkaWwnOidcXHUwMTIyJywnR2NpcmMnOidcXHUwMTFDJywnZ2NpcmMnOidcXHUwMTFEJywnR2N5JzonXFx1MDQxMycsJ2djeSc6J1xcdTA0MzMnLCdHZG90JzonXFx1MDEyMCcsJ2dkb3QnOidcXHUwMTIxJywnZ2UnOidcXHUyMjY1JywnZ0UnOidcXHUyMjY3JywnZ0VsJzonXFx1MkE4QycsJ2dlbCc6J1xcdTIyREInLCdnZXEnOidcXHUyMjY1JywnZ2VxcSc6J1xcdTIyNjcnLCdnZXFzbGFudCc6J1xcdTJBN0UnLCdnZXNjYyc6J1xcdTJBQTknLCdnZXMnOidcXHUyQTdFJywnZ2VzZG90JzonXFx1MkE4MCcsJ2dlc2RvdG8nOidcXHUyQTgyJywnZ2VzZG90b2wnOidcXHUyQTg0JywnZ2VzbCc6J1xcdTIyREJcXHVGRTAwJywnZ2VzbGVzJzonXFx1MkE5NCcsJ0dmcic6J1xcdUQ4MzVcXHVERDBBJywnZ2ZyJzonXFx1RDgzNVxcdUREMjQnLCdnZyc6J1xcdTIyNkInLCdHZyc6J1xcdTIyRDknLCdnZ2cnOidcXHUyMkQ5JywnZ2ltZWwnOidcXHUyMTM3JywnR0pjeSc6J1xcdTA0MDMnLCdnamN5JzonXFx1MDQ1MycsJ2dsYSc6J1xcdTJBQTUnLCdnbCc6J1xcdTIyNzcnLCdnbEUnOidcXHUyQTkyJywnZ2xqJzonXFx1MkFBNCcsJ2duYXAnOidcXHUyQThBJywnZ25hcHByb3gnOidcXHUyQThBJywnZ25lJzonXFx1MkE4OCcsJ2duRSc6J1xcdTIyNjknLCdnbmVxJzonXFx1MkE4OCcsJ2duZXFxJzonXFx1MjI2OScsJ2duc2ltJzonXFx1MjJFNycsJ0dvcGYnOidcXHVEODM1XFx1REQzRScsJ2dvcGYnOidcXHVEODM1XFx1REQ1OCcsJ2dyYXZlJzonYCcsJ0dyZWF0ZXJFcXVhbCc6J1xcdTIyNjUnLCdHcmVhdGVyRXF1YWxMZXNzJzonXFx1MjJEQicsJ0dyZWF0ZXJGdWxsRXF1YWwnOidcXHUyMjY3JywnR3JlYXRlckdyZWF0ZXInOidcXHUyQUEyJywnR3JlYXRlckxlc3MnOidcXHUyMjc3JywnR3JlYXRlclNsYW50RXF1YWwnOidcXHUyQTdFJywnR3JlYXRlclRpbGRlJzonXFx1MjI3MycsJ0dzY3InOidcXHVEODM1XFx1RENBMicsJ2dzY3InOidcXHUyMTBBJywnZ3NpbSc6J1xcdTIyNzMnLCdnc2ltZSc6J1xcdTJBOEUnLCdnc2ltbCc6J1xcdTJBOTAnLCdndGNjJzonXFx1MkFBNycsJ2d0Y2lyJzonXFx1MkE3QScsJ2d0JzonPicsJ0dUJzonPicsJ0d0JzonXFx1MjI2QicsJ2d0ZG90JzonXFx1MjJENycsJ2d0bFBhcic6J1xcdTI5OTUnLCdndHF1ZXN0JzonXFx1MkE3QycsJ2d0cmFwcHJveCc6J1xcdTJBODYnLCdndHJhcnInOidcXHUyOTc4JywnZ3RyZG90JzonXFx1MjJENycsJ2d0cmVxbGVzcyc6J1xcdTIyREInLCdndHJlcXFsZXNzJzonXFx1MkE4QycsJ2d0cmxlc3MnOidcXHUyMjc3JywnZ3Ryc2ltJzonXFx1MjI3MycsJ2d2ZXJ0bmVxcSc6J1xcdTIyNjlcXHVGRTAwJywnZ3ZuRSc6J1xcdTIyNjlcXHVGRTAwJywnSGFjZWsnOidcXHUwMkM3JywnaGFpcnNwJzonXFx1MjAwQScsJ2hhbGYnOidcXHhCRCcsJ2hhbWlsdCc6J1xcdTIxMEInLCdIQVJEY3knOidcXHUwNDJBJywnaGFyZGN5JzonXFx1MDQ0QScsJ2hhcnJjaXInOidcXHUyOTQ4JywnaGFycic6J1xcdTIxOTQnLCdoQXJyJzonXFx1MjFENCcsJ2hhcnJ3JzonXFx1MjFBRCcsJ0hhdCc6J14nLCdoYmFyJzonXFx1MjEwRicsJ0hjaXJjJzonXFx1MDEyNCcsJ2hjaXJjJzonXFx1MDEyNScsJ2hlYXJ0cyc6J1xcdTI2NjUnLCdoZWFydHN1aXQnOidcXHUyNjY1JywnaGVsbGlwJzonXFx1MjAyNicsJ2hlcmNvbic6J1xcdTIyQjknLCdoZnInOidcXHVEODM1XFx1REQyNScsJ0hmcic6J1xcdTIxMEMnLCdIaWxiZXJ0U3BhY2UnOidcXHUyMTBCJywnaGtzZWFyb3cnOidcXHUyOTI1JywnaGtzd2Fyb3cnOidcXHUyOTI2JywnaG9hcnInOidcXHUyMUZGJywnaG9tdGh0JzonXFx1MjIzQicsJ2hvb2tsZWZ0YXJyb3cnOidcXHUyMUE5JywnaG9va3JpZ2h0YXJyb3cnOidcXHUyMUFBJywnaG9wZic6J1xcdUQ4MzVcXHVERDU5JywnSG9wZic6J1xcdTIxMEQnLCdob3JiYXInOidcXHUyMDE1JywnSG9yaXpvbnRhbExpbmUnOidcXHUyNTAwJywnaHNjcic6J1xcdUQ4MzVcXHVEQ0JEJywnSHNjcic6J1xcdTIxMEInLCdoc2xhc2gnOidcXHUyMTBGJywnSHN0cm9rJzonXFx1MDEyNicsJ2hzdHJvayc6J1xcdTAxMjcnLCdIdW1wRG93bkh1bXAnOidcXHUyMjRFJywnSHVtcEVxdWFsJzonXFx1MjI0RicsJ2h5YnVsbCc6J1xcdTIwNDMnLCdoeXBoZW4nOidcXHUyMDEwJywnSWFjdXRlJzonXFx4Q0QnLCdpYWN1dGUnOidcXHhFRCcsJ2ljJzonXFx1MjA2MycsJ0ljaXJjJzonXFx4Q0UnLCdpY2lyYyc6J1xceEVFJywnSWN5JzonXFx1MDQxOCcsJ2ljeSc6J1xcdTA0MzgnLCdJZG90JzonXFx1MDEzMCcsJ0lFY3knOidcXHUwNDE1JywnaWVjeSc6J1xcdTA0MzUnLCdpZXhjbCc6J1xceEExJywnaWZmJzonXFx1MjFENCcsJ2lmcic6J1xcdUQ4MzVcXHVERDI2JywnSWZyJzonXFx1MjExMScsJ0lncmF2ZSc6J1xceENDJywnaWdyYXZlJzonXFx4RUMnLCdpaSc6J1xcdTIxNDgnLCdpaWlpbnQnOidcXHUyQTBDJywnaWlpbnQnOidcXHUyMjJEJywnaWluZmluJzonXFx1MjlEQycsJ2lpb3RhJzonXFx1MjEyOScsJ0lKbGlnJzonXFx1MDEzMicsJ2lqbGlnJzonXFx1MDEzMycsJ0ltYWNyJzonXFx1MDEyQScsJ2ltYWNyJzonXFx1MDEyQicsJ2ltYWdlJzonXFx1MjExMScsJ0ltYWdpbmFyeUknOidcXHUyMTQ4JywnaW1hZ2xpbmUnOidcXHUyMTEwJywnaW1hZ3BhcnQnOidcXHUyMTExJywnaW1hdGgnOidcXHUwMTMxJywnSW0nOidcXHUyMTExJywnaW1vZic6J1xcdTIyQjcnLCdpbXBlZCc6J1xcdTAxQjUnLCdJbXBsaWVzJzonXFx1MjFEMicsJ2luY2FyZSc6J1xcdTIxMDUnLCdpbic6J1xcdTIyMDgnLCdpbmZpbic6J1xcdTIyMUUnLCdpbmZpbnRpZSc6J1xcdTI5REQnLCdpbm9kb3QnOidcXHUwMTMxJywnaW50Y2FsJzonXFx1MjJCQScsJ2ludCc6J1xcdTIyMkInLCdJbnQnOidcXHUyMjJDJywnaW50ZWdlcnMnOidcXHUyMTI0JywnSW50ZWdyYWwnOidcXHUyMjJCJywnaW50ZXJjYWwnOidcXHUyMkJBJywnSW50ZXJzZWN0aW9uJzonXFx1MjJDMicsJ2ludGxhcmhrJzonXFx1MkExNycsJ2ludHByb2QnOidcXHUyQTNDJywnSW52aXNpYmxlQ29tbWEnOidcXHUyMDYzJywnSW52aXNpYmxlVGltZXMnOidcXHUyMDYyJywnSU9jeSc6J1xcdTA0MDEnLCdpb2N5JzonXFx1MDQ1MScsJ0lvZ29uJzonXFx1MDEyRScsJ2lvZ29uJzonXFx1MDEyRicsJ0lvcGYnOidcXHVEODM1XFx1REQ0MCcsJ2lvcGYnOidcXHVEODM1XFx1REQ1QScsJ0lvdGEnOidcXHUwMzk5JywnaW90YSc6J1xcdTAzQjknLCdpcHJvZCc6J1xcdTJBM0MnLCdpcXVlc3QnOidcXHhCRicsJ2lzY3InOidcXHVEODM1XFx1RENCRScsJ0lzY3InOidcXHUyMTEwJywnaXNpbic6J1xcdTIyMDgnLCdpc2luZG90JzonXFx1MjJGNScsJ2lzaW5FJzonXFx1MjJGOScsJ2lzaW5zJzonXFx1MjJGNCcsJ2lzaW5zdic6J1xcdTIyRjMnLCdpc2ludic6J1xcdTIyMDgnLCdpdCc6J1xcdTIwNjInLCdJdGlsZGUnOidcXHUwMTI4JywnaXRpbGRlJzonXFx1MDEyOScsJ0l1a2N5JzonXFx1MDQwNicsJ2l1a2N5JzonXFx1MDQ1NicsJ0l1bWwnOidcXHhDRicsJ2l1bWwnOidcXHhFRicsJ0pjaXJjJzonXFx1MDEzNCcsJ2pjaXJjJzonXFx1MDEzNScsJ0pjeSc6J1xcdTA0MTknLCdqY3knOidcXHUwNDM5JywnSmZyJzonXFx1RDgzNVxcdUREMEQnLCdqZnInOidcXHVEODM1XFx1REQyNycsJ2ptYXRoJzonXFx1MDIzNycsJ0pvcGYnOidcXHVEODM1XFx1REQ0MScsJ2pvcGYnOidcXHVEODM1XFx1REQ1QicsJ0pzY3InOidcXHVEODM1XFx1RENBNScsJ2pzY3InOidcXHVEODM1XFx1RENCRicsJ0pzZXJjeSc6J1xcdTA0MDgnLCdqc2VyY3knOidcXHUwNDU4JywnSnVrY3knOidcXHUwNDA0JywnanVrY3knOidcXHUwNDU0JywnS2FwcGEnOidcXHUwMzlBJywna2FwcGEnOidcXHUwM0JBJywna2FwcGF2JzonXFx1MDNGMCcsJ0tjZWRpbCc6J1xcdTAxMzYnLCdrY2VkaWwnOidcXHUwMTM3JywnS2N5JzonXFx1MDQxQScsJ2tjeSc6J1xcdTA0M0EnLCdLZnInOidcXHVEODM1XFx1REQwRScsJ2tmcic6J1xcdUQ4MzVcXHVERDI4Jywna2dyZWVuJzonXFx1MDEzOCcsJ0tIY3knOidcXHUwNDI1Jywna2hjeSc6J1xcdTA0NDUnLCdLSmN5JzonXFx1MDQwQycsJ2tqY3knOidcXHUwNDVDJywnS29wZic6J1xcdUQ4MzVcXHVERDQyJywna29wZic6J1xcdUQ4MzVcXHVERDVDJywnS3Njcic6J1xcdUQ4MzVcXHVEQ0E2Jywna3Njcic6J1xcdUQ4MzVcXHVEQ0MwJywnbEFhcnInOidcXHUyMURBJywnTGFjdXRlJzonXFx1MDEzOScsJ2xhY3V0ZSc6J1xcdTAxM0EnLCdsYWVtcHR5dic6J1xcdTI5QjQnLCdsYWdyYW4nOidcXHUyMTEyJywnTGFtYmRhJzonXFx1MDM5QicsJ2xhbWJkYSc6J1xcdTAzQkInLCdsYW5nJzonXFx1MjdFOCcsJ0xhbmcnOidcXHUyN0VBJywnbGFuZ2QnOidcXHUyOTkxJywnbGFuZ2xlJzonXFx1MjdFOCcsJ2xhcCc6J1xcdTJBODUnLCdMYXBsYWNldHJmJzonXFx1MjExMicsJ2xhcXVvJzonXFx4QUInLCdsYXJyYic6J1xcdTIxRTQnLCdsYXJyYmZzJzonXFx1MjkxRicsJ2xhcnInOidcXHUyMTkwJywnTGFycic6J1xcdTIxOUUnLCdsQXJyJzonXFx1MjFEMCcsJ2xhcnJmcyc6J1xcdTI5MUQnLCdsYXJyaGsnOidcXHUyMUE5JywnbGFycmxwJzonXFx1MjFBQicsJ2xhcnJwbCc6J1xcdTI5MzknLCdsYXJyc2ltJzonXFx1Mjk3MycsJ2xhcnJ0bCc6J1xcdTIxQTInLCdsYXRhaWwnOidcXHUyOTE5JywnbEF0YWlsJzonXFx1MjkxQicsJ2xhdCc6J1xcdTJBQUInLCdsYXRlJzonXFx1MkFBRCcsJ2xhdGVzJzonXFx1MkFBRFxcdUZFMDAnLCdsYmFycic6J1xcdTI5MEMnLCdsQmFycic6J1xcdTI5MEUnLCdsYmJyayc6J1xcdTI3NzInLCdsYnJhY2UnOid7JywnbGJyYWNrJzonWycsJ2xicmtlJzonXFx1Mjk4QicsJ2xicmtzbGQnOidcXHUyOThGJywnbGJya3NsdSc6J1xcdTI5OEQnLCdMY2Fyb24nOidcXHUwMTNEJywnbGNhcm9uJzonXFx1MDEzRScsJ0xjZWRpbCc6J1xcdTAxM0InLCdsY2VkaWwnOidcXHUwMTNDJywnbGNlaWwnOidcXHUyMzA4JywnbGN1Yic6J3snLCdMY3knOidcXHUwNDFCJywnbGN5JzonXFx1MDQzQicsJ2xkY2EnOidcXHUyOTM2JywnbGRxdW8nOidcXHUyMDFDJywnbGRxdW9yJzonXFx1MjAxRScsJ2xkcmRoYXInOidcXHUyOTY3JywnbGRydXNoYXInOidcXHUyOTRCJywnbGRzaCc6J1xcdTIxQjInLCdsZSc6J1xcdTIyNjQnLCdsRSc6J1xcdTIyNjYnLCdMZWZ0QW5nbGVCcmFja2V0JzonXFx1MjdFOCcsJ0xlZnRBcnJvd0Jhcic6J1xcdTIxRTQnLCdsZWZ0YXJyb3cnOidcXHUyMTkwJywnTGVmdEFycm93JzonXFx1MjE5MCcsJ0xlZnRhcnJvdyc6J1xcdTIxRDAnLCdMZWZ0QXJyb3dSaWdodEFycm93JzonXFx1MjFDNicsJ2xlZnRhcnJvd3RhaWwnOidcXHUyMUEyJywnTGVmdENlaWxpbmcnOidcXHUyMzA4JywnTGVmdERvdWJsZUJyYWNrZXQnOidcXHUyN0U2JywnTGVmdERvd25UZWVWZWN0b3InOidcXHUyOTYxJywnTGVmdERvd25WZWN0b3JCYXInOidcXHUyOTU5JywnTGVmdERvd25WZWN0b3InOidcXHUyMUMzJywnTGVmdEZsb29yJzonXFx1MjMwQScsJ2xlZnRoYXJwb29uZG93bic6J1xcdTIxQkQnLCdsZWZ0aGFycG9vbnVwJzonXFx1MjFCQycsJ2xlZnRsZWZ0YXJyb3dzJzonXFx1MjFDNycsJ2xlZnRyaWdodGFycm93JzonXFx1MjE5NCcsJ0xlZnRSaWdodEFycm93JzonXFx1MjE5NCcsJ0xlZnRyaWdodGFycm93JzonXFx1MjFENCcsJ2xlZnRyaWdodGFycm93cyc6J1xcdTIxQzYnLCdsZWZ0cmlnaHRoYXJwb29ucyc6J1xcdTIxQ0InLCdsZWZ0cmlnaHRzcXVpZ2Fycm93JzonXFx1MjFBRCcsJ0xlZnRSaWdodFZlY3Rvcic6J1xcdTI5NEUnLCdMZWZ0VGVlQXJyb3cnOidcXHUyMUE0JywnTGVmdFRlZSc6J1xcdTIyQTMnLCdMZWZ0VGVlVmVjdG9yJzonXFx1Mjk1QScsJ2xlZnR0aHJlZXRpbWVzJzonXFx1MjJDQicsJ0xlZnRUcmlhbmdsZUJhcic6J1xcdTI5Q0YnLCdMZWZ0VHJpYW5nbGUnOidcXHUyMkIyJywnTGVmdFRyaWFuZ2xlRXF1YWwnOidcXHUyMkI0JywnTGVmdFVwRG93blZlY3Rvcic6J1xcdTI5NTEnLCdMZWZ0VXBUZWVWZWN0b3InOidcXHUyOTYwJywnTGVmdFVwVmVjdG9yQmFyJzonXFx1Mjk1OCcsJ0xlZnRVcFZlY3Rvcic6J1xcdTIxQkYnLCdMZWZ0VmVjdG9yQmFyJzonXFx1Mjk1MicsJ0xlZnRWZWN0b3InOidcXHUyMUJDJywnbEVnJzonXFx1MkE4QicsJ2xlZyc6J1xcdTIyREEnLCdsZXEnOidcXHUyMjY0JywnbGVxcSc6J1xcdTIyNjYnLCdsZXFzbGFudCc6J1xcdTJBN0QnLCdsZXNjYyc6J1xcdTJBQTgnLCdsZXMnOidcXHUyQTdEJywnbGVzZG90JzonXFx1MkE3RicsJ2xlc2RvdG8nOidcXHUyQTgxJywnbGVzZG90b3InOidcXHUyQTgzJywnbGVzZyc6J1xcdTIyREFcXHVGRTAwJywnbGVzZ2VzJzonXFx1MkE5MycsJ2xlc3NhcHByb3gnOidcXHUyQTg1JywnbGVzc2RvdCc6J1xcdTIyRDYnLCdsZXNzZXFndHInOidcXHUyMkRBJywnbGVzc2VxcWd0cic6J1xcdTJBOEInLCdMZXNzRXF1YWxHcmVhdGVyJzonXFx1MjJEQScsJ0xlc3NGdWxsRXF1YWwnOidcXHUyMjY2JywnTGVzc0dyZWF0ZXInOidcXHUyMjc2JywnbGVzc2d0cic6J1xcdTIyNzYnLCdMZXNzTGVzcyc6J1xcdTJBQTEnLCdsZXNzc2ltJzonXFx1MjI3MicsJ0xlc3NTbGFudEVxdWFsJzonXFx1MkE3RCcsJ0xlc3NUaWxkZSc6J1xcdTIyNzInLCdsZmlzaHQnOidcXHUyOTdDJywnbGZsb29yJzonXFx1MjMwQScsJ0xmcic6J1xcdUQ4MzVcXHVERDBGJywnbGZyJzonXFx1RDgzNVxcdUREMjknLCdsZyc6J1xcdTIyNzYnLCdsZ0UnOidcXHUyQTkxJywnbEhhcic6J1xcdTI5NjInLCdsaGFyZCc6J1xcdTIxQkQnLCdsaGFydSc6J1xcdTIxQkMnLCdsaGFydWwnOidcXHUyOTZBJywnbGhibGsnOidcXHUyNTg0JywnTEpjeSc6J1xcdTA0MDknLCdsamN5JzonXFx1MDQ1OScsJ2xsYXJyJzonXFx1MjFDNycsJ2xsJzonXFx1MjI2QScsJ0xsJzonXFx1MjJEOCcsJ2xsY29ybmVyJzonXFx1MjMxRScsJ0xsZWZ0YXJyb3cnOidcXHUyMURBJywnbGxoYXJkJzonXFx1Mjk2QicsJ2xsdHJpJzonXFx1MjVGQScsJ0xtaWRvdCc6J1xcdTAxM0YnLCdsbWlkb3QnOidcXHUwMTQwJywnbG1vdXN0YWNoZSc6J1xcdTIzQjAnLCdsbW91c3QnOidcXHUyM0IwJywnbG5hcCc6J1xcdTJBODknLCdsbmFwcHJveCc6J1xcdTJBODknLCdsbmUnOidcXHUyQTg3JywnbG5FJzonXFx1MjI2OCcsJ2xuZXEnOidcXHUyQTg3JywnbG5lcXEnOidcXHUyMjY4JywnbG5zaW0nOidcXHUyMkU2JywnbG9hbmcnOidcXHUyN0VDJywnbG9hcnInOidcXHUyMUZEJywnbG9icmsnOidcXHUyN0U2JywnbG9uZ2xlZnRhcnJvdyc6J1xcdTI3RjUnLCdMb25nTGVmdEFycm93JzonXFx1MjdGNScsJ0xvbmdsZWZ0YXJyb3cnOidcXHUyN0Y4JywnbG9uZ2xlZnRyaWdodGFycm93JzonXFx1MjdGNycsJ0xvbmdMZWZ0UmlnaHRBcnJvdyc6J1xcdTI3RjcnLCdMb25nbGVmdHJpZ2h0YXJyb3cnOidcXHUyN0ZBJywnbG9uZ21hcHN0byc6J1xcdTI3RkMnLCdsb25ncmlnaHRhcnJvdyc6J1xcdTI3RjYnLCdMb25nUmlnaHRBcnJvdyc6J1xcdTI3RjYnLCdMb25ncmlnaHRhcnJvdyc6J1xcdTI3RjknLCdsb29wYXJyb3dsZWZ0JzonXFx1MjFBQicsJ2xvb3BhcnJvd3JpZ2h0JzonXFx1MjFBQycsJ2xvcGFyJzonXFx1Mjk4NScsJ0xvcGYnOidcXHVEODM1XFx1REQ0MycsJ2xvcGYnOidcXHVEODM1XFx1REQ1RCcsJ2xvcGx1cyc6J1xcdTJBMkQnLCdsb3RpbWVzJzonXFx1MkEzNCcsJ2xvd2FzdCc6J1xcdTIyMTcnLCdsb3diYXInOidfJywnTG93ZXJMZWZ0QXJyb3cnOidcXHUyMTk5JywnTG93ZXJSaWdodEFycm93JzonXFx1MjE5OCcsJ2xveic6J1xcdTI1Q0EnLCdsb3plbmdlJzonXFx1MjVDQScsJ2xvemYnOidcXHUyOUVCJywnbHBhcic6JygnLCdscGFybHQnOidcXHUyOTkzJywnbHJhcnInOidcXHUyMUM2JywnbHJjb3JuZXInOidcXHUyMzFGJywnbHJoYXInOidcXHUyMUNCJywnbHJoYXJkJzonXFx1Mjk2RCcsJ2xybSc6J1xcdTIwMEUnLCdscnRyaSc6J1xcdTIyQkYnLCdsc2FxdW8nOidcXHUyMDM5JywnbHNjcic6J1xcdUQ4MzVcXHVEQ0MxJywnTHNjcic6J1xcdTIxMTInLCdsc2gnOidcXHUyMUIwJywnTHNoJzonXFx1MjFCMCcsJ2xzaW0nOidcXHUyMjcyJywnbHNpbWUnOidcXHUyQThEJywnbHNpbWcnOidcXHUyQThGJywnbHNxYic6J1snLCdsc3F1byc6J1xcdTIwMTgnLCdsc3F1b3InOidcXHUyMDFBJywnTHN0cm9rJzonXFx1MDE0MScsJ2xzdHJvayc6J1xcdTAxNDInLCdsdGNjJzonXFx1MkFBNicsJ2x0Y2lyJzonXFx1MkE3OScsJ2x0JzonPCcsJ0xUJzonPCcsJ0x0JzonXFx1MjI2QScsJ2x0ZG90JzonXFx1MjJENicsJ2x0aHJlZSc6J1xcdTIyQ0InLCdsdGltZXMnOidcXHUyMkM5JywnbHRsYXJyJzonXFx1Mjk3NicsJ2x0cXVlc3QnOidcXHUyQTdCJywnbHRyaSc6J1xcdTI1QzMnLCdsdHJpZSc6J1xcdTIyQjQnLCdsdHJpZic6J1xcdTI1QzInLCdsdHJQYXInOidcXHUyOTk2JywnbHVyZHNoYXInOidcXHUyOTRBJywnbHVydWhhcic6J1xcdTI5NjYnLCdsdmVydG5lcXEnOidcXHUyMjY4XFx1RkUwMCcsJ2x2bkUnOidcXHUyMjY4XFx1RkUwMCcsJ21hY3InOidcXHhBRicsJ21hbGUnOidcXHUyNjQyJywnbWFsdCc6J1xcdTI3MjAnLCdtYWx0ZXNlJzonXFx1MjcyMCcsJ01hcCc6J1xcdTI5MDUnLCdtYXAnOidcXHUyMUE2JywnbWFwc3RvJzonXFx1MjFBNicsJ21hcHN0b2Rvd24nOidcXHUyMUE3JywnbWFwc3RvbGVmdCc6J1xcdTIxQTQnLCdtYXBzdG91cCc6J1xcdTIxQTUnLCdtYXJrZXInOidcXHUyNUFFJywnbWNvbW1hJzonXFx1MkEyOScsJ01jeSc6J1xcdTA0MUMnLCdtY3knOidcXHUwNDNDJywnbWRhc2gnOidcXHUyMDE0JywnbUREb3QnOidcXHUyMjNBJywnbWVhc3VyZWRhbmdsZSc6J1xcdTIyMjEnLCdNZWRpdW1TcGFjZSc6J1xcdTIwNUYnLCdNZWxsaW50cmYnOidcXHUyMTMzJywnTWZyJzonXFx1RDgzNVxcdUREMTAnLCdtZnInOidcXHVEODM1XFx1REQyQScsJ21obyc6J1xcdTIxMjcnLCdtaWNybyc6J1xceEI1JywnbWlkYXN0JzonKicsJ21pZGNpcic6J1xcdTJBRjAnLCdtaWQnOidcXHUyMjIzJywnbWlkZG90JzonXFx4QjcnLCdtaW51c2InOidcXHUyMjlGJywnbWludXMnOidcXHUyMjEyJywnbWludXNkJzonXFx1MjIzOCcsJ21pbnVzZHUnOidcXHUyQTJBJywnTWludXNQbHVzJzonXFx1MjIxMycsJ21sY3AnOidcXHUyQURCJywnbWxkcic6J1xcdTIwMjYnLCdtbnBsdXMnOidcXHUyMjEzJywnbW9kZWxzJzonXFx1MjJBNycsJ01vcGYnOidcXHVEODM1XFx1REQ0NCcsJ21vcGYnOidcXHVEODM1XFx1REQ1RScsJ21wJzonXFx1MjIxMycsJ21zY3InOidcXHVEODM1XFx1RENDMicsJ01zY3InOidcXHUyMTMzJywnbXN0cG9zJzonXFx1MjIzRScsJ011JzonXFx1MDM5QycsJ211JzonXFx1MDNCQycsJ211bHRpbWFwJzonXFx1MjJCOCcsJ211bWFwJzonXFx1MjJCOCcsJ25hYmxhJzonXFx1MjIwNycsJ05hY3V0ZSc6J1xcdTAxNDMnLCduYWN1dGUnOidcXHUwMTQ0JywnbmFuZyc6J1xcdTIyMjBcXHUyMEQyJywnbmFwJzonXFx1MjI0OScsJ25hcEUnOidcXHUyQTcwXFx1MDMzOCcsJ25hcGlkJzonXFx1MjI0QlxcdTAzMzgnLCduYXBvcyc6J1xcdTAxNDknLCduYXBwcm94JzonXFx1MjI0OScsJ25hdHVyYWwnOidcXHUyNjZFJywnbmF0dXJhbHMnOidcXHUyMTE1JywnbmF0dXInOidcXHUyNjZFJywnbmJzcCc6J1xceEEwJywnbmJ1bXAnOidcXHUyMjRFXFx1MDMzOCcsJ25idW1wZSc6J1xcdTIyNEZcXHUwMzM4JywnbmNhcCc6J1xcdTJBNDMnLCdOY2Fyb24nOidcXHUwMTQ3JywnbmNhcm9uJzonXFx1MDE0OCcsJ05jZWRpbCc6J1xcdTAxNDUnLCduY2VkaWwnOidcXHUwMTQ2JywnbmNvbmcnOidcXHUyMjQ3JywnbmNvbmdkb3QnOidcXHUyQTZEXFx1MDMzOCcsJ25jdXAnOidcXHUyQTQyJywnTmN5JzonXFx1MDQxRCcsJ25jeSc6J1xcdTA0M0QnLCduZGFzaCc6J1xcdTIwMTMnLCduZWFyaGsnOidcXHUyOTI0JywnbmVhcnInOidcXHUyMTk3JywnbmVBcnInOidcXHUyMUQ3JywnbmVhcnJvdyc6J1xcdTIxOTcnLCduZSc6J1xcdTIyNjAnLCduZWRvdCc6J1xcdTIyNTBcXHUwMzM4JywnTmVnYXRpdmVNZWRpdW1TcGFjZSc6J1xcdTIwMEInLCdOZWdhdGl2ZVRoaWNrU3BhY2UnOidcXHUyMDBCJywnTmVnYXRpdmVUaGluU3BhY2UnOidcXHUyMDBCJywnTmVnYXRpdmVWZXJ5VGhpblNwYWNlJzonXFx1MjAwQicsJ25lcXVpdic6J1xcdTIyNjInLCduZXNlYXInOidcXHUyOTI4JywnbmVzaW0nOidcXHUyMjQyXFx1MDMzOCcsJ05lc3RlZEdyZWF0ZXJHcmVhdGVyJzonXFx1MjI2QicsJ05lc3RlZExlc3NMZXNzJzonXFx1MjI2QScsJ05ld0xpbmUnOidcXG4nLCduZXhpc3QnOidcXHUyMjA0JywnbmV4aXN0cyc6J1xcdTIyMDQnLCdOZnInOidcXHVEODM1XFx1REQxMScsJ25mcic6J1xcdUQ4MzVcXHVERDJCJywnbmdFJzonXFx1MjI2N1xcdTAzMzgnLCduZ2UnOidcXHUyMjcxJywnbmdlcSc6J1xcdTIyNzEnLCduZ2VxcSc6J1xcdTIyNjdcXHUwMzM4JywnbmdlcXNsYW50JzonXFx1MkE3RVxcdTAzMzgnLCduZ2VzJzonXFx1MkE3RVxcdTAzMzgnLCduR2cnOidcXHUyMkQ5XFx1MDMzOCcsJ25nc2ltJzonXFx1MjI3NScsJ25HdCc6J1xcdTIyNkJcXHUyMEQyJywnbmd0JzonXFx1MjI2RicsJ25ndHInOidcXHUyMjZGJywnbkd0dic6J1xcdTIyNkJcXHUwMzM4JywnbmhhcnInOidcXHUyMUFFJywnbmhBcnInOidcXHUyMUNFJywnbmhwYXInOidcXHUyQUYyJywnbmknOidcXHUyMjBCJywnbmlzJzonXFx1MjJGQycsJ25pc2QnOidcXHUyMkZBJywnbml2JzonXFx1MjIwQicsJ05KY3knOidcXHUwNDBBJywnbmpjeSc6J1xcdTA0NUEnLCdubGFycic6J1xcdTIxOUEnLCdubEFycic6J1xcdTIxQ0QnLCdubGRyJzonXFx1MjAyNScsJ25sRSc6J1xcdTIyNjZcXHUwMzM4JywnbmxlJzonXFx1MjI3MCcsJ25sZWZ0YXJyb3cnOidcXHUyMTlBJywnbkxlZnRhcnJvdyc6J1xcdTIxQ0QnLCdubGVmdHJpZ2h0YXJyb3cnOidcXHUyMUFFJywnbkxlZnRyaWdodGFycm93JzonXFx1MjFDRScsJ25sZXEnOidcXHUyMjcwJywnbmxlcXEnOidcXHUyMjY2XFx1MDMzOCcsJ25sZXFzbGFudCc6J1xcdTJBN0RcXHUwMzM4Jywnbmxlcyc6J1xcdTJBN0RcXHUwMzM4Jywnbmxlc3MnOidcXHUyMjZFJywnbkxsJzonXFx1MjJEOFxcdTAzMzgnLCdubHNpbSc6J1xcdTIyNzQnLCduTHQnOidcXHUyMjZBXFx1MjBEMicsJ25sdCc6J1xcdTIyNkUnLCdubHRyaSc6J1xcdTIyRUEnLCdubHRyaWUnOidcXHUyMkVDJywnbkx0dic6J1xcdTIyNkFcXHUwMzM4Jywnbm1pZCc6J1xcdTIyMjQnLCdOb0JyZWFrJzonXFx1MjA2MCcsJ05vbkJyZWFraW5nU3BhY2UnOidcXHhBMCcsJ25vcGYnOidcXHVEODM1XFx1REQ1RicsJ05vcGYnOidcXHUyMTE1JywnTm90JzonXFx1MkFFQycsJ25vdCc6J1xceEFDJywnTm90Q29uZ3J1ZW50JzonXFx1MjI2MicsJ05vdEN1cENhcCc6J1xcdTIyNkQnLCdOb3REb3VibGVWZXJ0aWNhbEJhcic6J1xcdTIyMjYnLCdOb3RFbGVtZW50JzonXFx1MjIwOScsJ05vdEVxdWFsJzonXFx1MjI2MCcsJ05vdEVxdWFsVGlsZGUnOidcXHUyMjQyXFx1MDMzOCcsJ05vdEV4aXN0cyc6J1xcdTIyMDQnLCdOb3RHcmVhdGVyJzonXFx1MjI2RicsJ05vdEdyZWF0ZXJFcXVhbCc6J1xcdTIyNzEnLCdOb3RHcmVhdGVyRnVsbEVxdWFsJzonXFx1MjI2N1xcdTAzMzgnLCdOb3RHcmVhdGVyR3JlYXRlcic6J1xcdTIyNkJcXHUwMzM4JywnTm90R3JlYXRlckxlc3MnOidcXHUyMjc5JywnTm90R3JlYXRlclNsYW50RXF1YWwnOidcXHUyQTdFXFx1MDMzOCcsJ05vdEdyZWF0ZXJUaWxkZSc6J1xcdTIyNzUnLCdOb3RIdW1wRG93bkh1bXAnOidcXHUyMjRFXFx1MDMzOCcsJ05vdEh1bXBFcXVhbCc6J1xcdTIyNEZcXHUwMzM4Jywnbm90aW4nOidcXHUyMjA5Jywnbm90aW5kb3QnOidcXHUyMkY1XFx1MDMzOCcsJ25vdGluRSc6J1xcdTIyRjlcXHUwMzM4Jywnbm90aW52YSc6J1xcdTIyMDknLCdub3RpbnZiJzonXFx1MjJGNycsJ25vdGludmMnOidcXHUyMkY2JywnTm90TGVmdFRyaWFuZ2xlQmFyJzonXFx1MjlDRlxcdTAzMzgnLCdOb3RMZWZ0VHJpYW5nbGUnOidcXHUyMkVBJywnTm90TGVmdFRyaWFuZ2xlRXF1YWwnOidcXHUyMkVDJywnTm90TGVzcyc6J1xcdTIyNkUnLCdOb3RMZXNzRXF1YWwnOidcXHUyMjcwJywnTm90TGVzc0dyZWF0ZXInOidcXHUyMjc4JywnTm90TGVzc0xlc3MnOidcXHUyMjZBXFx1MDMzOCcsJ05vdExlc3NTbGFudEVxdWFsJzonXFx1MkE3RFxcdTAzMzgnLCdOb3RMZXNzVGlsZGUnOidcXHUyMjc0JywnTm90TmVzdGVkR3JlYXRlckdyZWF0ZXInOidcXHUyQUEyXFx1MDMzOCcsJ05vdE5lc3RlZExlc3NMZXNzJzonXFx1MkFBMVxcdTAzMzgnLCdub3RuaSc6J1xcdTIyMEMnLCdub3RuaXZhJzonXFx1MjIwQycsJ25vdG5pdmInOidcXHUyMkZFJywnbm90bml2Yyc6J1xcdTIyRkQnLCdOb3RQcmVjZWRlcyc6J1xcdTIyODAnLCdOb3RQcmVjZWRlc0VxdWFsJzonXFx1MkFBRlxcdTAzMzgnLCdOb3RQcmVjZWRlc1NsYW50RXF1YWwnOidcXHUyMkUwJywnTm90UmV2ZXJzZUVsZW1lbnQnOidcXHUyMjBDJywnTm90UmlnaHRUcmlhbmdsZUJhcic6J1xcdTI5RDBcXHUwMzM4JywnTm90UmlnaHRUcmlhbmdsZSc6J1xcdTIyRUInLCdOb3RSaWdodFRyaWFuZ2xlRXF1YWwnOidcXHUyMkVEJywnTm90U3F1YXJlU3Vic2V0JzonXFx1MjI4RlxcdTAzMzgnLCdOb3RTcXVhcmVTdWJzZXRFcXVhbCc6J1xcdTIyRTInLCdOb3RTcXVhcmVTdXBlcnNldCc6J1xcdTIyOTBcXHUwMzM4JywnTm90U3F1YXJlU3VwZXJzZXRFcXVhbCc6J1xcdTIyRTMnLCdOb3RTdWJzZXQnOidcXHUyMjgyXFx1MjBEMicsJ05vdFN1YnNldEVxdWFsJzonXFx1MjI4OCcsJ05vdFN1Y2NlZWRzJzonXFx1MjI4MScsJ05vdFN1Y2NlZWRzRXF1YWwnOidcXHUyQUIwXFx1MDMzOCcsJ05vdFN1Y2NlZWRzU2xhbnRFcXVhbCc6J1xcdTIyRTEnLCdOb3RTdWNjZWVkc1RpbGRlJzonXFx1MjI3RlxcdTAzMzgnLCdOb3RTdXBlcnNldCc6J1xcdTIyODNcXHUyMEQyJywnTm90U3VwZXJzZXRFcXVhbCc6J1xcdTIyODknLCdOb3RUaWxkZSc6J1xcdTIyNDEnLCdOb3RUaWxkZUVxdWFsJzonXFx1MjI0NCcsJ05vdFRpbGRlRnVsbEVxdWFsJzonXFx1MjI0NycsJ05vdFRpbGRlVGlsZGUnOidcXHUyMjQ5JywnTm90VmVydGljYWxCYXInOidcXHUyMjI0JywnbnBhcmFsbGVsJzonXFx1MjIyNicsJ25wYXInOidcXHUyMjI2JywnbnBhcnNsJzonXFx1MkFGRFxcdTIwRTUnLCducGFydCc6J1xcdTIyMDJcXHUwMzM4JywnbnBvbGludCc6J1xcdTJBMTQnLCducHInOidcXHUyMjgwJywnbnByY3VlJzonXFx1MjJFMCcsJ25wcmVjJzonXFx1MjI4MCcsJ25wcmVjZXEnOidcXHUyQUFGXFx1MDMzOCcsJ25wcmUnOidcXHUyQUFGXFx1MDMzOCcsJ25yYXJyYyc6J1xcdTI5MzNcXHUwMzM4JywnbnJhcnInOidcXHUyMTlCJywnbnJBcnInOidcXHUyMUNGJywnbnJhcnJ3JzonXFx1MjE5RFxcdTAzMzgnLCducmlnaHRhcnJvdyc6J1xcdTIxOUInLCduUmlnaHRhcnJvdyc6J1xcdTIxQ0YnLCducnRyaSc6J1xcdTIyRUInLCducnRyaWUnOidcXHUyMkVEJywnbnNjJzonXFx1MjI4MScsJ25zY2N1ZSc6J1xcdTIyRTEnLCduc2NlJzonXFx1MkFCMFxcdTAzMzgnLCdOc2NyJzonXFx1RDgzNVxcdURDQTknLCduc2NyJzonXFx1RDgzNVxcdURDQzMnLCduc2hvcnRtaWQnOidcXHUyMjI0JywnbnNob3J0cGFyYWxsZWwnOidcXHUyMjI2JywnbnNpbSc6J1xcdTIyNDEnLCduc2ltZSc6J1xcdTIyNDQnLCduc2ltZXEnOidcXHUyMjQ0JywnbnNtaWQnOidcXHUyMjI0JywnbnNwYXInOidcXHUyMjI2JywnbnNxc3ViZSc6J1xcdTIyRTInLCduc3FzdXBlJzonXFx1MjJFMycsJ25zdWInOidcXHUyMjg0JywnbnN1YkUnOidcXHUyQUM1XFx1MDMzOCcsJ25zdWJlJzonXFx1MjI4OCcsJ25zdWJzZXQnOidcXHUyMjgyXFx1MjBEMicsJ25zdWJzZXRlcSc6J1xcdTIyODgnLCduc3Vic2V0ZXFxJzonXFx1MkFDNVxcdTAzMzgnLCduc3VjYyc6J1xcdTIyODEnLCduc3VjY2VxJzonXFx1MkFCMFxcdTAzMzgnLCduc3VwJzonXFx1MjI4NScsJ25zdXBFJzonXFx1MkFDNlxcdTAzMzgnLCduc3VwZSc6J1xcdTIyODknLCduc3Vwc2V0JzonXFx1MjI4M1xcdTIwRDInLCduc3Vwc2V0ZXEnOidcXHUyMjg5JywnbnN1cHNldGVxcSc6J1xcdTJBQzZcXHUwMzM4JywnbnRnbCc6J1xcdTIyNzknLCdOdGlsZGUnOidcXHhEMScsJ250aWxkZSc6J1xceEYxJywnbnRsZyc6J1xcdTIyNzgnLCdudHJpYW5nbGVsZWZ0JzonXFx1MjJFQScsJ250cmlhbmdsZWxlZnRlcSc6J1xcdTIyRUMnLCdudHJpYW5nbGVyaWdodCc6J1xcdTIyRUInLCdudHJpYW5nbGVyaWdodGVxJzonXFx1MjJFRCcsJ051JzonXFx1MDM5RCcsJ251JzonXFx1MDNCRCcsJ251bSc6JyMnLCdudW1lcm8nOidcXHUyMTE2JywnbnVtc3AnOidcXHUyMDA3JywnbnZhcCc6J1xcdTIyNERcXHUyMEQyJywnbnZkYXNoJzonXFx1MjJBQycsJ252RGFzaCc6J1xcdTIyQUQnLCduVmRhc2gnOidcXHUyMkFFJywnblZEYXNoJzonXFx1MjJBRicsJ252Z2UnOidcXHUyMjY1XFx1MjBEMicsJ252Z3QnOic+XFx1MjBEMicsJ252SGFycic6J1xcdTI5MDQnLCdudmluZmluJzonXFx1MjlERScsJ252bEFycic6J1xcdTI5MDInLCdudmxlJzonXFx1MjI2NFxcdTIwRDInLCdudmx0JzonPFxcdTIwRDInLCdudmx0cmllJzonXFx1MjJCNFxcdTIwRDInLCdudnJBcnInOidcXHUyOTAzJywnbnZydHJpZSc6J1xcdTIyQjVcXHUyMEQyJywnbnZzaW0nOidcXHUyMjNDXFx1MjBEMicsJ253YXJoayc6J1xcdTI5MjMnLCdud2Fycic6J1xcdTIxOTYnLCdud0Fycic6J1xcdTIxRDYnLCdud2Fycm93JzonXFx1MjE5NicsJ253bmVhcic6J1xcdTI5MjcnLCdPYWN1dGUnOidcXHhEMycsJ29hY3V0ZSc6J1xceEYzJywnb2FzdCc6J1xcdTIyOUInLCdPY2lyYyc6J1xceEQ0Jywnb2NpcmMnOidcXHhGNCcsJ29jaXInOidcXHUyMjlBJywnT2N5JzonXFx1MDQxRScsJ29jeSc6J1xcdTA0M0UnLCdvZGFzaCc6J1xcdTIyOUQnLCdPZGJsYWMnOidcXHUwMTUwJywnb2RibGFjJzonXFx1MDE1MScsJ29kaXYnOidcXHUyQTM4Jywnb2RvdCc6J1xcdTIyOTknLCdvZHNvbGQnOidcXHUyOUJDJywnT0VsaWcnOidcXHUwMTUyJywnb2VsaWcnOidcXHUwMTUzJywnb2ZjaXInOidcXHUyOUJGJywnT2ZyJzonXFx1RDgzNVxcdUREMTInLCdvZnInOidcXHVEODM1XFx1REQyQycsJ29nb24nOidcXHUwMkRCJywnT2dyYXZlJzonXFx4RDInLCdvZ3JhdmUnOidcXHhGMicsJ29ndCc6J1xcdTI5QzEnLCdvaGJhcic6J1xcdTI5QjUnLCdvaG0nOidcXHUwM0E5Jywnb2ludCc6J1xcdTIyMkUnLCdvbGFycic6J1xcdTIxQkEnLCdvbGNpcic6J1xcdTI5QkUnLCdvbGNyb3NzJzonXFx1MjlCQicsJ29saW5lJzonXFx1MjAzRScsJ29sdCc6J1xcdTI5QzAnLCdPbWFjcic6J1xcdTAxNEMnLCdvbWFjcic6J1xcdTAxNEQnLCdPbWVnYSc6J1xcdTAzQTknLCdvbWVnYSc6J1xcdTAzQzknLCdPbWljcm9uJzonXFx1MDM5RicsJ29taWNyb24nOidcXHUwM0JGJywnb21pZCc6J1xcdTI5QjYnLCdvbWludXMnOidcXHUyMjk2JywnT29wZic6J1xcdUQ4MzVcXHVERDQ2Jywnb29wZic6J1xcdUQ4MzVcXHVERDYwJywnb3Bhcic6J1xcdTI5QjcnLCdPcGVuQ3VybHlEb3VibGVRdW90ZSc6J1xcdTIwMUMnLCdPcGVuQ3VybHlRdW90ZSc6J1xcdTIwMTgnLCdvcGVycCc6J1xcdTI5QjknLCdvcGx1cyc6J1xcdTIyOTUnLCdvcmFycic6J1xcdTIxQkInLCdPcic6J1xcdTJBNTQnLCdvcic6J1xcdTIyMjgnLCdvcmQnOidcXHUyQTVEJywnb3JkZXInOidcXHUyMTM0Jywnb3JkZXJvZic6J1xcdTIxMzQnLCdvcmRmJzonXFx4QUEnLCdvcmRtJzonXFx4QkEnLCdvcmlnb2YnOidcXHUyMkI2Jywnb3Jvcic6J1xcdTJBNTYnLCdvcnNsb3BlJzonXFx1MkE1NycsJ29ydic6J1xcdTJBNUInLCdvUyc6J1xcdTI0QzgnLCdPc2NyJzonXFx1RDgzNVxcdURDQUEnLCdvc2NyJzonXFx1MjEzNCcsJ09zbGFzaCc6J1xceEQ4Jywnb3NsYXNoJzonXFx4RjgnLCdvc29sJzonXFx1MjI5OCcsJ090aWxkZSc6J1xceEQ1Jywnb3RpbGRlJzonXFx4RjUnLCdvdGltZXNhcyc6J1xcdTJBMzYnLCdPdGltZXMnOidcXHUyQTM3Jywnb3RpbWVzJzonXFx1MjI5NycsJ091bWwnOidcXHhENicsJ291bWwnOidcXHhGNicsJ292YmFyJzonXFx1MjMzRCcsJ092ZXJCYXInOidcXHUyMDNFJywnT3ZlckJyYWNlJzonXFx1MjNERScsJ092ZXJCcmFja2V0JzonXFx1MjNCNCcsJ092ZXJQYXJlbnRoZXNpcyc6J1xcdTIzREMnLCdwYXJhJzonXFx4QjYnLCdwYXJhbGxlbCc6J1xcdTIyMjUnLCdwYXInOidcXHUyMjI1JywncGFyc2ltJzonXFx1MkFGMycsJ3BhcnNsJzonXFx1MkFGRCcsJ3BhcnQnOidcXHUyMjAyJywnUGFydGlhbEQnOidcXHUyMjAyJywnUGN5JzonXFx1MDQxRicsJ3BjeSc6J1xcdTA0M0YnLCdwZXJjbnQnOiclJywncGVyaW9kJzonLicsJ3Blcm1pbCc6J1xcdTIwMzAnLCdwZXJwJzonXFx1MjJBNScsJ3BlcnRlbmsnOidcXHUyMDMxJywnUGZyJzonXFx1RDgzNVxcdUREMTMnLCdwZnInOidcXHVEODM1XFx1REQyRCcsJ1BoaSc6J1xcdTAzQTYnLCdwaGknOidcXHUwM0M2JywncGhpdic6J1xcdTAzRDUnLCdwaG1tYXQnOidcXHUyMTMzJywncGhvbmUnOidcXHUyNjBFJywnUGknOidcXHUwM0EwJywncGknOidcXHUwM0MwJywncGl0Y2hmb3JrJzonXFx1MjJENCcsJ3Bpdic6J1xcdTAzRDYnLCdwbGFuY2snOidcXHUyMTBGJywncGxhbmNraCc6J1xcdTIxMEUnLCdwbGFua3YnOidcXHUyMTBGJywncGx1c2FjaXInOidcXHUyQTIzJywncGx1c2InOidcXHUyMjlFJywncGx1c2Npcic6J1xcdTJBMjInLCdwbHVzJzonKycsJ3BsdXNkbyc6J1xcdTIyMTQnLCdwbHVzZHUnOidcXHUyQTI1JywncGx1c2UnOidcXHUyQTcyJywnUGx1c01pbnVzJzonXFx4QjEnLCdwbHVzbW4nOidcXHhCMScsJ3BsdXNzaW0nOidcXHUyQTI2JywncGx1c3R3byc6J1xcdTJBMjcnLCdwbSc6J1xceEIxJywnUG9pbmNhcmVwbGFuZSc6J1xcdTIxMEMnLCdwb2ludGludCc6J1xcdTJBMTUnLCdwb3BmJzonXFx1RDgzNVxcdURENjEnLCdQb3BmJzonXFx1MjExOScsJ3BvdW5kJzonXFx4QTMnLCdwcmFwJzonXFx1MkFCNycsJ1ByJzonXFx1MkFCQicsJ3ByJzonXFx1MjI3QScsJ3ByY3VlJzonXFx1MjI3QycsJ3ByZWNhcHByb3gnOidcXHUyQUI3JywncHJlYyc6J1xcdTIyN0EnLCdwcmVjY3VybHllcSc6J1xcdTIyN0MnLCdQcmVjZWRlcyc6J1xcdTIyN0EnLCdQcmVjZWRlc0VxdWFsJzonXFx1MkFBRicsJ1ByZWNlZGVzU2xhbnRFcXVhbCc6J1xcdTIyN0MnLCdQcmVjZWRlc1RpbGRlJzonXFx1MjI3RScsJ3ByZWNlcSc6J1xcdTJBQUYnLCdwcmVjbmFwcHJveCc6J1xcdTJBQjknLCdwcmVjbmVxcSc6J1xcdTJBQjUnLCdwcmVjbnNpbSc6J1xcdTIyRTgnLCdwcmUnOidcXHUyQUFGJywncHJFJzonXFx1MkFCMycsJ3ByZWNzaW0nOidcXHUyMjdFJywncHJpbWUnOidcXHUyMDMyJywnUHJpbWUnOidcXHUyMDMzJywncHJpbWVzJzonXFx1MjExOScsJ3BybmFwJzonXFx1MkFCOScsJ3BybkUnOidcXHUyQUI1JywncHJuc2ltJzonXFx1MjJFOCcsJ3Byb2QnOidcXHUyMjBGJywnUHJvZHVjdCc6J1xcdTIyMEYnLCdwcm9mYWxhcic6J1xcdTIzMkUnLCdwcm9mbGluZSc6J1xcdTIzMTInLCdwcm9mc3VyZic6J1xcdTIzMTMnLCdwcm9wJzonXFx1MjIxRCcsJ1Byb3BvcnRpb25hbCc6J1xcdTIyMUQnLCdQcm9wb3J0aW9uJzonXFx1MjIzNycsJ3Byb3B0byc6J1xcdTIyMUQnLCdwcnNpbSc6J1xcdTIyN0UnLCdwcnVyZWwnOidcXHUyMkIwJywnUHNjcic6J1xcdUQ4MzVcXHVEQ0FCJywncHNjcic6J1xcdUQ4MzVcXHVEQ0M1JywnUHNpJzonXFx1MDNBOCcsJ3BzaSc6J1xcdTAzQzgnLCdwdW5jc3AnOidcXHUyMDA4JywnUWZyJzonXFx1RDgzNVxcdUREMTQnLCdxZnInOidcXHVEODM1XFx1REQyRScsJ3FpbnQnOidcXHUyQTBDJywncW9wZic6J1xcdUQ4MzVcXHVERDYyJywnUW9wZic6J1xcdTIxMUEnLCdxcHJpbWUnOidcXHUyMDU3JywnUXNjcic6J1xcdUQ4MzVcXHVEQ0FDJywncXNjcic6J1xcdUQ4MzVcXHVEQ0M2JywncXVhdGVybmlvbnMnOidcXHUyMTBEJywncXVhdGludCc6J1xcdTJBMTYnLCdxdWVzdCc6Jz8nLCdxdWVzdGVxJzonXFx1MjI1RicsJ3F1b3QnOidcIicsJ1FVT1QnOidcIicsJ3JBYXJyJzonXFx1MjFEQicsJ3JhY2UnOidcXHUyMjNEXFx1MDMzMScsJ1JhY3V0ZSc6J1xcdTAxNTQnLCdyYWN1dGUnOidcXHUwMTU1JywncmFkaWMnOidcXHUyMjFBJywncmFlbXB0eXYnOidcXHUyOUIzJywncmFuZyc6J1xcdTI3RTknLCdSYW5nJzonXFx1MjdFQicsJ3JhbmdkJzonXFx1Mjk5MicsJ3JhbmdlJzonXFx1MjlBNScsJ3JhbmdsZSc6J1xcdTI3RTknLCdyYXF1byc6J1xceEJCJywncmFycmFwJzonXFx1Mjk3NScsJ3JhcnJiJzonXFx1MjFFNScsJ3JhcnJiZnMnOidcXHUyOTIwJywncmFycmMnOidcXHUyOTMzJywncmFycic6J1xcdTIxOTInLCdSYXJyJzonXFx1MjFBMCcsJ3JBcnInOidcXHUyMUQyJywncmFycmZzJzonXFx1MjkxRScsJ3JhcnJoayc6J1xcdTIxQUEnLCdyYXJybHAnOidcXHUyMUFDJywncmFycnBsJzonXFx1Mjk0NScsJ3JhcnJzaW0nOidcXHUyOTc0JywnUmFycnRsJzonXFx1MjkxNicsJ3JhcnJ0bCc6J1xcdTIxQTMnLCdyYXJydyc6J1xcdTIxOUQnLCdyYXRhaWwnOidcXHUyOTFBJywnckF0YWlsJzonXFx1MjkxQycsJ3JhdGlvJzonXFx1MjIzNicsJ3JhdGlvbmFscyc6J1xcdTIxMUEnLCdyYmFycic6J1xcdTI5MEQnLCdyQmFycic6J1xcdTI5MEYnLCdSQmFycic6J1xcdTI5MTAnLCdyYmJyayc6J1xcdTI3NzMnLCdyYnJhY2UnOid9JywncmJyYWNrJzonXScsJ3JicmtlJzonXFx1Mjk4QycsJ3JicmtzbGQnOidcXHUyOThFJywncmJya3NsdSc6J1xcdTI5OTAnLCdSY2Fyb24nOidcXHUwMTU4JywncmNhcm9uJzonXFx1MDE1OScsJ1JjZWRpbCc6J1xcdTAxNTYnLCdyY2VkaWwnOidcXHUwMTU3JywncmNlaWwnOidcXHUyMzA5JywncmN1Yic6J30nLCdSY3knOidcXHUwNDIwJywncmN5JzonXFx1MDQ0MCcsJ3JkY2EnOidcXHUyOTM3JywncmRsZGhhcic6J1xcdTI5NjknLCdyZHF1byc6J1xcdTIwMUQnLCdyZHF1b3InOidcXHUyMDFEJywncmRzaCc6J1xcdTIxQjMnLCdyZWFsJzonXFx1MjExQycsJ3JlYWxpbmUnOidcXHUyMTFCJywncmVhbHBhcnQnOidcXHUyMTFDJywncmVhbHMnOidcXHUyMTFEJywnUmUnOidcXHUyMTFDJywncmVjdCc6J1xcdTI1QUQnLCdyZWcnOidcXHhBRScsJ1JFRyc6J1xceEFFJywnUmV2ZXJzZUVsZW1lbnQnOidcXHUyMjBCJywnUmV2ZXJzZUVxdWlsaWJyaXVtJzonXFx1MjFDQicsJ1JldmVyc2VVcEVxdWlsaWJyaXVtJzonXFx1Mjk2RicsJ3JmaXNodCc6J1xcdTI5N0QnLCdyZmxvb3InOidcXHUyMzBCJywncmZyJzonXFx1RDgzNVxcdUREMkYnLCdSZnInOidcXHUyMTFDJywnckhhcic6J1xcdTI5NjQnLCdyaGFyZCc6J1xcdTIxQzEnLCdyaGFydSc6J1xcdTIxQzAnLCdyaGFydWwnOidcXHUyOTZDJywnUmhvJzonXFx1MDNBMScsJ3Jobyc6J1xcdTAzQzEnLCdyaG92JzonXFx1MDNGMScsJ1JpZ2h0QW5nbGVCcmFja2V0JzonXFx1MjdFOScsJ1JpZ2h0QXJyb3dCYXInOidcXHUyMUU1JywncmlnaHRhcnJvdyc6J1xcdTIxOTInLCdSaWdodEFycm93JzonXFx1MjE5MicsJ1JpZ2h0YXJyb3cnOidcXHUyMUQyJywnUmlnaHRBcnJvd0xlZnRBcnJvdyc6J1xcdTIxQzQnLCdyaWdodGFycm93dGFpbCc6J1xcdTIxQTMnLCdSaWdodENlaWxpbmcnOidcXHUyMzA5JywnUmlnaHREb3VibGVCcmFja2V0JzonXFx1MjdFNycsJ1JpZ2h0RG93blRlZVZlY3Rvcic6J1xcdTI5NUQnLCdSaWdodERvd25WZWN0b3JCYXInOidcXHUyOTU1JywnUmlnaHREb3duVmVjdG9yJzonXFx1MjFDMicsJ1JpZ2h0Rmxvb3InOidcXHUyMzBCJywncmlnaHRoYXJwb29uZG93bic6J1xcdTIxQzEnLCdyaWdodGhhcnBvb251cCc6J1xcdTIxQzAnLCdyaWdodGxlZnRhcnJvd3MnOidcXHUyMUM0JywncmlnaHRsZWZ0aGFycG9vbnMnOidcXHUyMUNDJywncmlnaHRyaWdodGFycm93cyc6J1xcdTIxQzknLCdyaWdodHNxdWlnYXJyb3cnOidcXHUyMTlEJywnUmlnaHRUZWVBcnJvdyc6J1xcdTIxQTYnLCdSaWdodFRlZSc6J1xcdTIyQTInLCdSaWdodFRlZVZlY3Rvcic6J1xcdTI5NUInLCdyaWdodHRocmVldGltZXMnOidcXHUyMkNDJywnUmlnaHRUcmlhbmdsZUJhcic6J1xcdTI5RDAnLCdSaWdodFRyaWFuZ2xlJzonXFx1MjJCMycsJ1JpZ2h0VHJpYW5nbGVFcXVhbCc6J1xcdTIyQjUnLCdSaWdodFVwRG93blZlY3Rvcic6J1xcdTI5NEYnLCdSaWdodFVwVGVlVmVjdG9yJzonXFx1Mjk1QycsJ1JpZ2h0VXBWZWN0b3JCYXInOidcXHUyOTU0JywnUmlnaHRVcFZlY3Rvcic6J1xcdTIxQkUnLCdSaWdodFZlY3RvckJhcic6J1xcdTI5NTMnLCdSaWdodFZlY3Rvcic6J1xcdTIxQzAnLCdyaW5nJzonXFx1MDJEQScsJ3Jpc2luZ2RvdHNlcSc6J1xcdTIyNTMnLCdybGFycic6J1xcdTIxQzQnLCdybGhhcic6J1xcdTIxQ0MnLCdybG0nOidcXHUyMDBGJywncm1vdXN0YWNoZSc6J1xcdTIzQjEnLCdybW91c3QnOidcXHUyM0IxJywncm5taWQnOidcXHUyQUVFJywncm9hbmcnOidcXHUyN0VEJywncm9hcnInOidcXHUyMUZFJywncm9icmsnOidcXHUyN0U3Jywncm9wYXInOidcXHUyOTg2Jywncm9wZic6J1xcdUQ4MzVcXHVERDYzJywnUm9wZic6J1xcdTIxMUQnLCdyb3BsdXMnOidcXHUyQTJFJywncm90aW1lcyc6J1xcdTJBMzUnLCdSb3VuZEltcGxpZXMnOidcXHUyOTcwJywncnBhcic6JyknLCdycGFyZ3QnOidcXHUyOTk0JywncnBwb2xpbnQnOidcXHUyQTEyJywncnJhcnInOidcXHUyMUM5JywnUnJpZ2h0YXJyb3cnOidcXHUyMURCJywncnNhcXVvJzonXFx1MjAzQScsJ3JzY3InOidcXHVEODM1XFx1RENDNycsJ1JzY3InOidcXHUyMTFCJywncnNoJzonXFx1MjFCMScsJ1JzaCc6J1xcdTIxQjEnLCdyc3FiJzonXScsJ3JzcXVvJzonXFx1MjAxOScsJ3JzcXVvcic6J1xcdTIwMTknLCdydGhyZWUnOidcXHUyMkNDJywncnRpbWVzJzonXFx1MjJDQScsJ3J0cmknOidcXHUyNUI5JywncnRyaWUnOidcXHUyMkI1JywncnRyaWYnOidcXHUyNUI4JywncnRyaWx0cmknOidcXHUyOUNFJywnUnVsZURlbGF5ZWQnOidcXHUyOUY0JywncnVsdWhhcic6J1xcdTI5NjgnLCdyeCc6J1xcdTIxMUUnLCdTYWN1dGUnOidcXHUwMTVBJywnc2FjdXRlJzonXFx1MDE1QicsJ3NicXVvJzonXFx1MjAxQScsJ3NjYXAnOidcXHUyQUI4JywnU2Nhcm9uJzonXFx1MDE2MCcsJ3NjYXJvbic6J1xcdTAxNjEnLCdTYyc6J1xcdTJBQkMnLCdzYyc6J1xcdTIyN0InLCdzY2N1ZSc6J1xcdTIyN0QnLCdzY2UnOidcXHUyQUIwJywnc2NFJzonXFx1MkFCNCcsJ1NjZWRpbCc6J1xcdTAxNUUnLCdzY2VkaWwnOidcXHUwMTVGJywnU2NpcmMnOidcXHUwMTVDJywnc2NpcmMnOidcXHUwMTVEJywnc2NuYXAnOidcXHUyQUJBJywnc2NuRSc6J1xcdTJBQjYnLCdzY25zaW0nOidcXHUyMkU5Jywnc2Nwb2xpbnQnOidcXHUyQTEzJywnc2NzaW0nOidcXHUyMjdGJywnU2N5JzonXFx1MDQyMScsJ3NjeSc6J1xcdTA0NDEnLCdzZG90Yic6J1xcdTIyQTEnLCdzZG90JzonXFx1MjJDNScsJ3Nkb3RlJzonXFx1MkE2NicsJ3NlYXJoayc6J1xcdTI5MjUnLCdzZWFycic6J1xcdTIxOTgnLCdzZUFycic6J1xcdTIxRDgnLCdzZWFycm93JzonXFx1MjE5OCcsJ3NlY3QnOidcXHhBNycsJ3NlbWknOic7Jywnc2Vzd2FyJzonXFx1MjkyOScsJ3NldG1pbnVzJzonXFx1MjIxNicsJ3NldG1uJzonXFx1MjIxNicsJ3NleHQnOidcXHUyNzM2JywnU2ZyJzonXFx1RDgzNVxcdUREMTYnLCdzZnInOidcXHVEODM1XFx1REQzMCcsJ3Nmcm93bic6J1xcdTIzMjInLCdzaGFycCc6J1xcdTI2NkYnLCdTSENIY3knOidcXHUwNDI5Jywnc2hjaGN5JzonXFx1MDQ0OScsJ1NIY3knOidcXHUwNDI4Jywnc2hjeSc6J1xcdTA0NDgnLCdTaG9ydERvd25BcnJvdyc6J1xcdTIxOTMnLCdTaG9ydExlZnRBcnJvdyc6J1xcdTIxOTAnLCdzaG9ydG1pZCc6J1xcdTIyMjMnLCdzaG9ydHBhcmFsbGVsJzonXFx1MjIyNScsJ1Nob3J0UmlnaHRBcnJvdyc6J1xcdTIxOTInLCdTaG9ydFVwQXJyb3cnOidcXHUyMTkxJywnc2h5JzonXFx4QUQnLCdTaWdtYSc6J1xcdTAzQTMnLCdzaWdtYSc6J1xcdTAzQzMnLCdzaWdtYWYnOidcXHUwM0MyJywnc2lnbWF2JzonXFx1MDNDMicsJ3NpbSc6J1xcdTIyM0MnLCdzaW1kb3QnOidcXHUyQTZBJywnc2ltZSc6J1xcdTIyNDMnLCdzaW1lcSc6J1xcdTIyNDMnLCdzaW1nJzonXFx1MkE5RScsJ3NpbWdFJzonXFx1MkFBMCcsJ3NpbWwnOidcXHUyQTlEJywnc2ltbEUnOidcXHUyQTlGJywnc2ltbmUnOidcXHUyMjQ2Jywnc2ltcGx1cyc6J1xcdTJBMjQnLCdzaW1yYXJyJzonXFx1Mjk3MicsJ3NsYXJyJzonXFx1MjE5MCcsJ1NtYWxsQ2lyY2xlJzonXFx1MjIxOCcsJ3NtYWxsc2V0bWludXMnOidcXHUyMjE2Jywnc21hc2hwJzonXFx1MkEzMycsJ3NtZXBhcnNsJzonXFx1MjlFNCcsJ3NtaWQnOidcXHUyMjIzJywnc21pbGUnOidcXHUyMzIzJywnc210JzonXFx1MkFBQScsJ3NtdGUnOidcXHUyQUFDJywnc210ZXMnOidcXHUyQUFDXFx1RkUwMCcsJ1NPRlRjeSc6J1xcdTA0MkMnLCdzb2Z0Y3knOidcXHUwNDRDJywnc29sYmFyJzonXFx1MjMzRicsJ3NvbGInOidcXHUyOUM0Jywnc29sJzonLycsJ1NvcGYnOidcXHVEODM1XFx1REQ0QScsJ3NvcGYnOidcXHVEODM1XFx1REQ2NCcsJ3NwYWRlcyc6J1xcdTI2NjAnLCdzcGFkZXN1aXQnOidcXHUyNjYwJywnc3Bhcic6J1xcdTIyMjUnLCdzcWNhcCc6J1xcdTIyOTMnLCdzcWNhcHMnOidcXHUyMjkzXFx1RkUwMCcsJ3NxY3VwJzonXFx1MjI5NCcsJ3NxY3Vwcyc6J1xcdTIyOTRcXHVGRTAwJywnU3FydCc6J1xcdTIyMUEnLCdzcXN1Yic6J1xcdTIyOEYnLCdzcXN1YmUnOidcXHUyMjkxJywnc3FzdWJzZXQnOidcXHUyMjhGJywnc3FzdWJzZXRlcSc6J1xcdTIyOTEnLCdzcXN1cCc6J1xcdTIyOTAnLCdzcXN1cGUnOidcXHUyMjkyJywnc3FzdXBzZXQnOidcXHUyMjkwJywnc3FzdXBzZXRlcSc6J1xcdTIyOTInLCdzcXVhcmUnOidcXHUyNUExJywnU3F1YXJlJzonXFx1MjVBMScsJ1NxdWFyZUludGVyc2VjdGlvbic6J1xcdTIyOTMnLCdTcXVhcmVTdWJzZXQnOidcXHUyMjhGJywnU3F1YXJlU3Vic2V0RXF1YWwnOidcXHUyMjkxJywnU3F1YXJlU3VwZXJzZXQnOidcXHUyMjkwJywnU3F1YXJlU3VwZXJzZXRFcXVhbCc6J1xcdTIyOTInLCdTcXVhcmVVbmlvbic6J1xcdTIyOTQnLCdzcXVhcmYnOidcXHUyNUFBJywnc3F1JzonXFx1MjVBMScsJ3NxdWYnOidcXHUyNUFBJywnc3JhcnInOidcXHUyMTkyJywnU3Njcic6J1xcdUQ4MzVcXHVEQ0FFJywnc3Njcic6J1xcdUQ4MzVcXHVEQ0M4Jywnc3NldG1uJzonXFx1MjIxNicsJ3NzbWlsZSc6J1xcdTIzMjMnLCdzc3RhcmYnOidcXHUyMkM2JywnU3Rhcic6J1xcdTIyQzYnLCdzdGFyJzonXFx1MjYwNicsJ3N0YXJmJzonXFx1MjYwNScsJ3N0cmFpZ2h0ZXBzaWxvbic6J1xcdTAzRjUnLCdzdHJhaWdodHBoaSc6J1xcdTAzRDUnLCdzdHJucyc6J1xceEFGJywnc3ViJzonXFx1MjI4MicsJ1N1Yic6J1xcdTIyRDAnLCdzdWJkb3QnOidcXHUyQUJEJywnc3ViRSc6J1xcdTJBQzUnLCdzdWJlJzonXFx1MjI4NicsJ3N1YmVkb3QnOidcXHUyQUMzJywnc3VibXVsdCc6J1xcdTJBQzEnLCdzdWJuRSc6J1xcdTJBQ0InLCdzdWJuZSc6J1xcdTIyOEEnLCdzdWJwbHVzJzonXFx1MkFCRicsJ3N1YnJhcnInOidcXHUyOTc5Jywnc3Vic2V0JzonXFx1MjI4MicsJ1N1YnNldCc6J1xcdTIyRDAnLCdzdWJzZXRlcSc6J1xcdTIyODYnLCdzdWJzZXRlcXEnOidcXHUyQUM1JywnU3Vic2V0RXF1YWwnOidcXHUyMjg2Jywnc3Vic2V0bmVxJzonXFx1MjI4QScsJ3N1YnNldG5lcXEnOidcXHUyQUNCJywnc3Vic2ltJzonXFx1MkFDNycsJ3N1YnN1Yic6J1xcdTJBRDUnLCdzdWJzdXAnOidcXHUyQUQzJywnc3VjY2FwcHJveCc6J1xcdTJBQjgnLCdzdWNjJzonXFx1MjI3QicsJ3N1Y2NjdXJseWVxJzonXFx1MjI3RCcsJ1N1Y2NlZWRzJzonXFx1MjI3QicsJ1N1Y2NlZWRzRXF1YWwnOidcXHUyQUIwJywnU3VjY2VlZHNTbGFudEVxdWFsJzonXFx1MjI3RCcsJ1N1Y2NlZWRzVGlsZGUnOidcXHUyMjdGJywnc3VjY2VxJzonXFx1MkFCMCcsJ3N1Y2NuYXBwcm94JzonXFx1MkFCQScsJ3N1Y2NuZXFxJzonXFx1MkFCNicsJ3N1Y2Nuc2ltJzonXFx1MjJFOScsJ3N1Y2NzaW0nOidcXHUyMjdGJywnU3VjaFRoYXQnOidcXHUyMjBCJywnc3VtJzonXFx1MjIxMScsJ1N1bSc6J1xcdTIyMTEnLCdzdW5nJzonXFx1MjY2QScsJ3N1cDEnOidcXHhCOScsJ3N1cDInOidcXHhCMicsJ3N1cDMnOidcXHhCMycsJ3N1cCc6J1xcdTIyODMnLCdTdXAnOidcXHUyMkQxJywnc3VwZG90JzonXFx1MkFCRScsJ3N1cGRzdWInOidcXHUyQUQ4Jywnc3VwRSc6J1xcdTJBQzYnLCdzdXBlJzonXFx1MjI4NycsJ3N1cGVkb3QnOidcXHUyQUM0JywnU3VwZXJzZXQnOidcXHUyMjgzJywnU3VwZXJzZXRFcXVhbCc6J1xcdTIyODcnLCdzdXBoc29sJzonXFx1MjdDOScsJ3N1cGhzdWInOidcXHUyQUQ3Jywnc3VwbGFycic6J1xcdTI5N0InLCdzdXBtdWx0JzonXFx1MkFDMicsJ3N1cG5FJzonXFx1MkFDQycsJ3N1cG5lJzonXFx1MjI4QicsJ3N1cHBsdXMnOidcXHUyQUMwJywnc3Vwc2V0JzonXFx1MjI4MycsJ1N1cHNldCc6J1xcdTIyRDEnLCdzdXBzZXRlcSc6J1xcdTIyODcnLCdzdXBzZXRlcXEnOidcXHUyQUM2Jywnc3Vwc2V0bmVxJzonXFx1MjI4QicsJ3N1cHNldG5lcXEnOidcXHUyQUNDJywnc3Vwc2ltJzonXFx1MkFDOCcsJ3N1cHN1Yic6J1xcdTJBRDQnLCdzdXBzdXAnOidcXHUyQUQ2Jywnc3dhcmhrJzonXFx1MjkyNicsJ3N3YXJyJzonXFx1MjE5OScsJ3N3QXJyJzonXFx1MjFEOScsJ3N3YXJyb3cnOidcXHUyMTk5Jywnc3dud2FyJzonXFx1MjkyQScsJ3N6bGlnJzonXFx4REYnLCdUYWInOidcXHQnLCd0YXJnZXQnOidcXHUyMzE2JywnVGF1JzonXFx1MDNBNCcsJ3RhdSc6J1xcdTAzQzQnLCd0YnJrJzonXFx1MjNCNCcsJ1RjYXJvbic6J1xcdTAxNjQnLCd0Y2Fyb24nOidcXHUwMTY1JywnVGNlZGlsJzonXFx1MDE2MicsJ3RjZWRpbCc6J1xcdTAxNjMnLCdUY3knOidcXHUwNDIyJywndGN5JzonXFx1MDQ0MicsJ3Rkb3QnOidcXHUyMERCJywndGVscmVjJzonXFx1MjMxNScsJ1Rmcic6J1xcdUQ4MzVcXHVERDE3JywndGZyJzonXFx1RDgzNVxcdUREMzEnLCd0aGVyZTQnOidcXHUyMjM0JywndGhlcmVmb3JlJzonXFx1MjIzNCcsJ1RoZXJlZm9yZSc6J1xcdTIyMzQnLCdUaGV0YSc6J1xcdTAzOTgnLCd0aGV0YSc6J1xcdTAzQjgnLCd0aGV0YXN5bSc6J1xcdTAzRDEnLCd0aGV0YXYnOidcXHUwM0QxJywndGhpY2thcHByb3gnOidcXHUyMjQ4JywndGhpY2tzaW0nOidcXHUyMjNDJywnVGhpY2tTcGFjZSc6J1xcdTIwNUZcXHUyMDBBJywnVGhpblNwYWNlJzonXFx1MjAwOScsJ3RoaW5zcCc6J1xcdTIwMDknLCd0aGthcCc6J1xcdTIyNDgnLCd0aGtzaW0nOidcXHUyMjNDJywnVEhPUk4nOidcXHhERScsJ3Rob3JuJzonXFx4RkUnLCd0aWxkZSc6J1xcdTAyREMnLCdUaWxkZSc6J1xcdTIyM0MnLCdUaWxkZUVxdWFsJzonXFx1MjI0MycsJ1RpbGRlRnVsbEVxdWFsJzonXFx1MjI0NScsJ1RpbGRlVGlsZGUnOidcXHUyMjQ4JywndGltZXNiYXInOidcXHUyQTMxJywndGltZXNiJzonXFx1MjJBMCcsJ3RpbWVzJzonXFx4RDcnLCd0aW1lc2QnOidcXHUyQTMwJywndGludCc6J1xcdTIyMkQnLCd0b2VhJzonXFx1MjkyOCcsJ3RvcGJvdCc6J1xcdTIzMzYnLCd0b3BjaXInOidcXHUyQUYxJywndG9wJzonXFx1MjJBNCcsJ1RvcGYnOidcXHVEODM1XFx1REQ0QicsJ3RvcGYnOidcXHVEODM1XFx1REQ2NScsJ3RvcGZvcmsnOidcXHUyQURBJywndG9zYSc6J1xcdTI5MjknLCd0cHJpbWUnOidcXHUyMDM0JywndHJhZGUnOidcXHUyMTIyJywnVFJBREUnOidcXHUyMTIyJywndHJpYW5nbGUnOidcXHUyNUI1JywndHJpYW5nbGVkb3duJzonXFx1MjVCRicsJ3RyaWFuZ2xlbGVmdCc6J1xcdTI1QzMnLCd0cmlhbmdsZWxlZnRlcSc6J1xcdTIyQjQnLCd0cmlhbmdsZXEnOidcXHUyMjVDJywndHJpYW5nbGVyaWdodCc6J1xcdTI1QjknLCd0cmlhbmdsZXJpZ2h0ZXEnOidcXHUyMkI1JywndHJpZG90JzonXFx1MjVFQycsJ3RyaWUnOidcXHUyMjVDJywndHJpbWludXMnOidcXHUyQTNBJywnVHJpcGxlRG90JzonXFx1MjBEQicsJ3RyaXBsdXMnOidcXHUyQTM5JywndHJpc2InOidcXHUyOUNEJywndHJpdGltZSc6J1xcdTJBM0InLCd0cnBleml1bSc6J1xcdTIzRTInLCdUc2NyJzonXFx1RDgzNVxcdURDQUYnLCd0c2NyJzonXFx1RDgzNVxcdURDQzknLCdUU2N5JzonXFx1MDQyNicsJ3RzY3knOidcXHUwNDQ2JywnVFNIY3knOidcXHUwNDBCJywndHNoY3knOidcXHUwNDVCJywnVHN0cm9rJzonXFx1MDE2NicsJ3RzdHJvayc6J1xcdTAxNjcnLCd0d2l4dCc6J1xcdTIyNkMnLCd0d29oZWFkbGVmdGFycm93JzonXFx1MjE5RScsJ3R3b2hlYWRyaWdodGFycm93JzonXFx1MjFBMCcsJ1VhY3V0ZSc6J1xceERBJywndWFjdXRlJzonXFx4RkEnLCd1YXJyJzonXFx1MjE5MScsJ1VhcnInOidcXHUyMTlGJywndUFycic6J1xcdTIxRDEnLCdVYXJyb2Npcic6J1xcdTI5NDknLCdVYnJjeSc6J1xcdTA0MEUnLCd1YnJjeSc6J1xcdTA0NUUnLCdVYnJldmUnOidcXHUwMTZDJywndWJyZXZlJzonXFx1MDE2RCcsJ1VjaXJjJzonXFx4REInLCd1Y2lyYyc6J1xceEZCJywnVWN5JzonXFx1MDQyMycsJ3VjeSc6J1xcdTA0NDMnLCd1ZGFycic6J1xcdTIxQzUnLCdVZGJsYWMnOidcXHUwMTcwJywndWRibGFjJzonXFx1MDE3MScsJ3VkaGFyJzonXFx1Mjk2RScsJ3VmaXNodCc6J1xcdTI5N0UnLCdVZnInOidcXHVEODM1XFx1REQxOCcsJ3Vmcic6J1xcdUQ4MzVcXHVERDMyJywnVWdyYXZlJzonXFx4RDknLCd1Z3JhdmUnOidcXHhGOScsJ3VIYXInOidcXHUyOTYzJywndWhhcmwnOidcXHUyMUJGJywndWhhcnInOidcXHUyMUJFJywndWhibGsnOidcXHUyNTgwJywndWxjb3JuJzonXFx1MjMxQycsJ3VsY29ybmVyJzonXFx1MjMxQycsJ3VsY3JvcCc6J1xcdTIzMEYnLCd1bHRyaSc6J1xcdTI1RjgnLCdVbWFjcic6J1xcdTAxNkEnLCd1bWFjcic6J1xcdTAxNkInLCd1bWwnOidcXHhBOCcsJ1VuZGVyQmFyJzonXycsJ1VuZGVyQnJhY2UnOidcXHUyM0RGJywnVW5kZXJCcmFja2V0JzonXFx1MjNCNScsJ1VuZGVyUGFyZW50aGVzaXMnOidcXHUyM0REJywnVW5pb24nOidcXHUyMkMzJywnVW5pb25QbHVzJzonXFx1MjI4RScsJ1VvZ29uJzonXFx1MDE3MicsJ3VvZ29uJzonXFx1MDE3MycsJ1VvcGYnOidcXHVEODM1XFx1REQ0QycsJ3VvcGYnOidcXHVEODM1XFx1REQ2NicsJ1VwQXJyb3dCYXInOidcXHUyOTEyJywndXBhcnJvdyc6J1xcdTIxOTEnLCdVcEFycm93JzonXFx1MjE5MScsJ1VwYXJyb3cnOidcXHUyMUQxJywnVXBBcnJvd0Rvd25BcnJvdyc6J1xcdTIxQzUnLCd1cGRvd25hcnJvdyc6J1xcdTIxOTUnLCdVcERvd25BcnJvdyc6J1xcdTIxOTUnLCdVcGRvd25hcnJvdyc6J1xcdTIxRDUnLCdVcEVxdWlsaWJyaXVtJzonXFx1Mjk2RScsJ3VwaGFycG9vbmxlZnQnOidcXHUyMUJGJywndXBoYXJwb29ucmlnaHQnOidcXHUyMUJFJywndXBsdXMnOidcXHUyMjhFJywnVXBwZXJMZWZ0QXJyb3cnOidcXHUyMTk2JywnVXBwZXJSaWdodEFycm93JzonXFx1MjE5NycsJ3Vwc2knOidcXHUwM0M1JywnVXBzaSc6J1xcdTAzRDInLCd1cHNpaCc6J1xcdTAzRDInLCdVcHNpbG9uJzonXFx1MDNBNScsJ3Vwc2lsb24nOidcXHUwM0M1JywnVXBUZWVBcnJvdyc6J1xcdTIxQTUnLCdVcFRlZSc6J1xcdTIyQTUnLCd1cHVwYXJyb3dzJzonXFx1MjFDOCcsJ3VyY29ybic6J1xcdTIzMUQnLCd1cmNvcm5lcic6J1xcdTIzMUQnLCd1cmNyb3AnOidcXHUyMzBFJywnVXJpbmcnOidcXHUwMTZFJywndXJpbmcnOidcXHUwMTZGJywndXJ0cmknOidcXHUyNUY5JywnVXNjcic6J1xcdUQ4MzVcXHVEQ0IwJywndXNjcic6J1xcdUQ4MzVcXHVEQ0NBJywndXRkb3QnOidcXHUyMkYwJywnVXRpbGRlJzonXFx1MDE2OCcsJ3V0aWxkZSc6J1xcdTAxNjknLCd1dHJpJzonXFx1MjVCNScsJ3V0cmlmJzonXFx1MjVCNCcsJ3V1YXJyJzonXFx1MjFDOCcsJ1V1bWwnOidcXHhEQycsJ3V1bWwnOidcXHhGQycsJ3V3YW5nbGUnOidcXHUyOUE3JywndmFuZ3J0JzonXFx1Mjk5QycsJ3ZhcmVwc2lsb24nOidcXHUwM0Y1JywndmFya2FwcGEnOidcXHUwM0YwJywndmFybm90aGluZyc6J1xcdTIyMDUnLCd2YXJwaGknOidcXHUwM0Q1JywndmFycGknOidcXHUwM0Q2JywndmFycHJvcHRvJzonXFx1MjIxRCcsJ3ZhcnInOidcXHUyMTk1JywndkFycic6J1xcdTIxRDUnLCd2YXJyaG8nOidcXHUwM0YxJywndmFyc2lnbWEnOidcXHUwM0MyJywndmFyc3Vic2V0bmVxJzonXFx1MjI4QVxcdUZFMDAnLCd2YXJzdWJzZXRuZXFxJzonXFx1MkFDQlxcdUZFMDAnLCd2YXJzdXBzZXRuZXEnOidcXHUyMjhCXFx1RkUwMCcsJ3ZhcnN1cHNldG5lcXEnOidcXHUyQUNDXFx1RkUwMCcsJ3ZhcnRoZXRhJzonXFx1MDNEMScsJ3ZhcnRyaWFuZ2xlbGVmdCc6J1xcdTIyQjInLCd2YXJ0cmlhbmdsZXJpZ2h0JzonXFx1MjJCMycsJ3ZCYXInOidcXHUyQUU4JywnVmJhcic6J1xcdTJBRUInLCd2QmFydic6J1xcdTJBRTknLCdWY3knOidcXHUwNDEyJywndmN5JzonXFx1MDQzMicsJ3ZkYXNoJzonXFx1MjJBMicsJ3ZEYXNoJzonXFx1MjJBOCcsJ1ZkYXNoJzonXFx1MjJBOScsJ1ZEYXNoJzonXFx1MjJBQicsJ1ZkYXNobCc6J1xcdTJBRTYnLCd2ZWViYXInOidcXHUyMkJCJywndmVlJzonXFx1MjIyOCcsJ1ZlZSc6J1xcdTIyQzEnLCd2ZWVlcSc6J1xcdTIyNUEnLCd2ZWxsaXAnOidcXHUyMkVFJywndmVyYmFyJzonfCcsJ1ZlcmJhcic6J1xcdTIwMTYnLCd2ZXJ0JzonfCcsJ1ZlcnQnOidcXHUyMDE2JywnVmVydGljYWxCYXInOidcXHUyMjIzJywnVmVydGljYWxMaW5lJzonfCcsJ1ZlcnRpY2FsU2VwYXJhdG9yJzonXFx1Mjc1OCcsJ1ZlcnRpY2FsVGlsZGUnOidcXHUyMjQwJywnVmVyeVRoaW5TcGFjZSc6J1xcdTIwMEEnLCdWZnInOidcXHVEODM1XFx1REQxOScsJ3Zmcic6J1xcdUQ4MzVcXHVERDMzJywndmx0cmknOidcXHUyMkIyJywndm5zdWInOidcXHUyMjgyXFx1MjBEMicsJ3Zuc3VwJzonXFx1MjI4M1xcdTIwRDInLCdWb3BmJzonXFx1RDgzNVxcdURENEQnLCd2b3BmJzonXFx1RDgzNVxcdURENjcnLCd2cHJvcCc6J1xcdTIyMUQnLCd2cnRyaSc6J1xcdTIyQjMnLCdWc2NyJzonXFx1RDgzNVxcdURDQjEnLCd2c2NyJzonXFx1RDgzNVxcdURDQ0InLCd2c3VibkUnOidcXHUyQUNCXFx1RkUwMCcsJ3ZzdWJuZSc6J1xcdTIyOEFcXHVGRTAwJywndnN1cG5FJzonXFx1MkFDQ1xcdUZFMDAnLCd2c3VwbmUnOidcXHUyMjhCXFx1RkUwMCcsJ1Z2ZGFzaCc6J1xcdTIyQUEnLCd2emlnemFnJzonXFx1Mjk5QScsJ1djaXJjJzonXFx1MDE3NCcsJ3djaXJjJzonXFx1MDE3NScsJ3dlZGJhcic6J1xcdTJBNUYnLCd3ZWRnZSc6J1xcdTIyMjcnLCdXZWRnZSc6J1xcdTIyQzAnLCd3ZWRnZXEnOidcXHUyMjU5Jywnd2VpZXJwJzonXFx1MjExOCcsJ1dmcic6J1xcdUQ4MzVcXHVERDFBJywnd2ZyJzonXFx1RDgzNVxcdUREMzQnLCdXb3BmJzonXFx1RDgzNVxcdURENEUnLCd3b3BmJzonXFx1RDgzNVxcdURENjgnLCd3cCc6J1xcdTIxMTgnLCd3cic6J1xcdTIyNDAnLCd3cmVhdGgnOidcXHUyMjQwJywnV3Njcic6J1xcdUQ4MzVcXHVEQ0IyJywnd3Njcic6J1xcdUQ4MzVcXHVEQ0NDJywneGNhcCc6J1xcdTIyQzInLCd4Y2lyYyc6J1xcdTI1RUYnLCd4Y3VwJzonXFx1MjJDMycsJ3hkdHJpJzonXFx1MjVCRCcsJ1hmcic6J1xcdUQ4MzVcXHVERDFCJywneGZyJzonXFx1RDgzNVxcdUREMzUnLCd4aGFycic6J1xcdTI3RjcnLCd4aEFycic6J1xcdTI3RkEnLCdYaSc6J1xcdTAzOUUnLCd4aSc6J1xcdTAzQkUnLCd4bGFycic6J1xcdTI3RjUnLCd4bEFycic6J1xcdTI3RjgnLCd4bWFwJzonXFx1MjdGQycsJ3huaXMnOidcXHUyMkZCJywneG9kb3QnOidcXHUyQTAwJywnWG9wZic6J1xcdUQ4MzVcXHVERDRGJywneG9wZic6J1xcdUQ4MzVcXHVERDY5JywneG9wbHVzJzonXFx1MkEwMScsJ3hvdGltZSc6J1xcdTJBMDInLCd4cmFycic6J1xcdTI3RjYnLCd4ckFycic6J1xcdTI3RjknLCdYc2NyJzonXFx1RDgzNVxcdURDQjMnLCd4c2NyJzonXFx1RDgzNVxcdURDQ0QnLCd4c3FjdXAnOidcXHUyQTA2JywneHVwbHVzJzonXFx1MkEwNCcsJ3h1dHJpJzonXFx1MjVCMycsJ3h2ZWUnOidcXHUyMkMxJywneHdlZGdlJzonXFx1MjJDMCcsJ1lhY3V0ZSc6J1xceEREJywneWFjdXRlJzonXFx4RkQnLCdZQWN5JzonXFx1MDQyRicsJ3lhY3knOidcXHUwNDRGJywnWWNpcmMnOidcXHUwMTc2JywneWNpcmMnOidcXHUwMTc3JywnWWN5JzonXFx1MDQyQicsJ3ljeSc6J1xcdTA0NEInLCd5ZW4nOidcXHhBNScsJ1lmcic6J1xcdUQ4MzVcXHVERDFDJywneWZyJzonXFx1RDgzNVxcdUREMzYnLCdZSWN5JzonXFx1MDQwNycsJ3lpY3knOidcXHUwNDU3JywnWW9wZic6J1xcdUQ4MzVcXHVERDUwJywneW9wZic6J1xcdUQ4MzVcXHVERDZBJywnWXNjcic6J1xcdUQ4MzVcXHVEQ0I0JywneXNjcic6J1xcdUQ4MzVcXHVEQ0NFJywnWVVjeSc6J1xcdTA0MkUnLCd5dWN5JzonXFx1MDQ0RScsJ3l1bWwnOidcXHhGRicsJ1l1bWwnOidcXHUwMTc4JywnWmFjdXRlJzonXFx1MDE3OScsJ3phY3V0ZSc6J1xcdTAxN0EnLCdaY2Fyb24nOidcXHUwMTdEJywnemNhcm9uJzonXFx1MDE3RScsJ1pjeSc6J1xcdTA0MTcnLCd6Y3knOidcXHUwNDM3JywnWmRvdCc6J1xcdTAxN0InLCd6ZG90JzonXFx1MDE3QycsJ3plZXRyZic6J1xcdTIxMjgnLCdaZXJvV2lkdGhTcGFjZSc6J1xcdTIwMEInLCdaZXRhJzonXFx1MDM5NicsJ3pldGEnOidcXHUwM0I2JywnemZyJzonXFx1RDgzNVxcdUREMzcnLCdaZnInOidcXHUyMTI4JywnWkhjeSc6J1xcdTA0MTYnLCd6aGN5JzonXFx1MDQzNicsJ3ppZ3JhcnInOidcXHUyMUREJywnem9wZic6J1xcdUQ4MzVcXHVERDZCJywnWm9wZic6J1xcdTIxMjQnLCdac2NyJzonXFx1RDgzNVxcdURDQjUnLCd6c2NyJzonXFx1RDgzNVxcdURDQ0YnLCd6d2onOidcXHUyMDBEJywnenduaic6J1xcdTIwMEMnfTtcblx0dmFyIGRlY29kZU1hcExlZ2FjeSA9IHsnQWFjdXRlJzonXFx4QzEnLCdhYWN1dGUnOidcXHhFMScsJ0FjaXJjJzonXFx4QzInLCdhY2lyYyc6J1xceEUyJywnYWN1dGUnOidcXHhCNCcsJ0FFbGlnJzonXFx4QzYnLCdhZWxpZyc6J1xceEU2JywnQWdyYXZlJzonXFx4QzAnLCdhZ3JhdmUnOidcXHhFMCcsJ2FtcCc6JyYnLCdBTVAnOicmJywnQXJpbmcnOidcXHhDNScsJ2FyaW5nJzonXFx4RTUnLCdBdGlsZGUnOidcXHhDMycsJ2F0aWxkZSc6J1xceEUzJywnQXVtbCc6J1xceEM0JywnYXVtbCc6J1xceEU0JywnYnJ2YmFyJzonXFx4QTYnLCdDY2VkaWwnOidcXHhDNycsJ2NjZWRpbCc6J1xceEU3JywnY2VkaWwnOidcXHhCOCcsJ2NlbnQnOidcXHhBMicsJ2NvcHknOidcXHhBOScsJ0NPUFknOidcXHhBOScsJ2N1cnJlbic6J1xceEE0JywnZGVnJzonXFx4QjAnLCdkaXZpZGUnOidcXHhGNycsJ0VhY3V0ZSc6J1xceEM5JywnZWFjdXRlJzonXFx4RTknLCdFY2lyYyc6J1xceENBJywnZWNpcmMnOidcXHhFQScsJ0VncmF2ZSc6J1xceEM4JywnZWdyYXZlJzonXFx4RTgnLCdFVEgnOidcXHhEMCcsJ2V0aCc6J1xceEYwJywnRXVtbCc6J1xceENCJywnZXVtbCc6J1xceEVCJywnZnJhYzEyJzonXFx4QkQnLCdmcmFjMTQnOidcXHhCQycsJ2ZyYWMzNCc6J1xceEJFJywnZ3QnOic+JywnR1QnOic+JywnSWFjdXRlJzonXFx4Q0QnLCdpYWN1dGUnOidcXHhFRCcsJ0ljaXJjJzonXFx4Q0UnLCdpY2lyYyc6J1xceEVFJywnaWV4Y2wnOidcXHhBMScsJ0lncmF2ZSc6J1xceENDJywnaWdyYXZlJzonXFx4RUMnLCdpcXVlc3QnOidcXHhCRicsJ0l1bWwnOidcXHhDRicsJ2l1bWwnOidcXHhFRicsJ2xhcXVvJzonXFx4QUInLCdsdCc6JzwnLCdMVCc6JzwnLCdtYWNyJzonXFx4QUYnLCdtaWNybyc6J1xceEI1JywnbWlkZG90JzonXFx4QjcnLCduYnNwJzonXFx4QTAnLCdub3QnOidcXHhBQycsJ050aWxkZSc6J1xceEQxJywnbnRpbGRlJzonXFx4RjEnLCdPYWN1dGUnOidcXHhEMycsJ29hY3V0ZSc6J1xceEYzJywnT2NpcmMnOidcXHhENCcsJ29jaXJjJzonXFx4RjQnLCdPZ3JhdmUnOidcXHhEMicsJ29ncmF2ZSc6J1xceEYyJywnb3JkZic6J1xceEFBJywnb3JkbSc6J1xceEJBJywnT3NsYXNoJzonXFx4RDgnLCdvc2xhc2gnOidcXHhGOCcsJ090aWxkZSc6J1xceEQ1Jywnb3RpbGRlJzonXFx4RjUnLCdPdW1sJzonXFx4RDYnLCdvdW1sJzonXFx4RjYnLCdwYXJhJzonXFx4QjYnLCdwbHVzbW4nOidcXHhCMScsJ3BvdW5kJzonXFx4QTMnLCdxdW90JzonXCInLCdRVU9UJzonXCInLCdyYXF1byc6J1xceEJCJywncmVnJzonXFx4QUUnLCdSRUcnOidcXHhBRScsJ3NlY3QnOidcXHhBNycsJ3NoeSc6J1xceEFEJywnc3VwMSc6J1xceEI5Jywnc3VwMic6J1xceEIyJywnc3VwMyc6J1xceEIzJywnc3psaWcnOidcXHhERicsJ1RIT1JOJzonXFx4REUnLCd0aG9ybic6J1xceEZFJywndGltZXMnOidcXHhENycsJ1VhY3V0ZSc6J1xceERBJywndWFjdXRlJzonXFx4RkEnLCdVY2lyYyc6J1xceERCJywndWNpcmMnOidcXHhGQicsJ1VncmF2ZSc6J1xceEQ5JywndWdyYXZlJzonXFx4RjknLCd1bWwnOidcXHhBOCcsJ1V1bWwnOidcXHhEQycsJ3V1bWwnOidcXHhGQycsJ1lhY3V0ZSc6J1xceEREJywneWFjdXRlJzonXFx4RkQnLCd5ZW4nOidcXHhBNScsJ3l1bWwnOidcXHhGRid9O1xuXHR2YXIgZGVjb2RlTWFwTnVtZXJpYyA9IHsnMCc6J1xcdUZGRkQnLCcxMjgnOidcXHUyMEFDJywnMTMwJzonXFx1MjAxQScsJzEzMSc6J1xcdTAxOTInLCcxMzInOidcXHUyMDFFJywnMTMzJzonXFx1MjAyNicsJzEzNCc6J1xcdTIwMjAnLCcxMzUnOidcXHUyMDIxJywnMTM2JzonXFx1MDJDNicsJzEzNyc6J1xcdTIwMzAnLCcxMzgnOidcXHUwMTYwJywnMTM5JzonXFx1MjAzOScsJzE0MCc6J1xcdTAxNTInLCcxNDInOidcXHUwMTdEJywnMTQ1JzonXFx1MjAxOCcsJzE0Nic6J1xcdTIwMTknLCcxNDcnOidcXHUyMDFDJywnMTQ4JzonXFx1MjAxRCcsJzE0OSc6J1xcdTIwMjInLCcxNTAnOidcXHUyMDEzJywnMTUxJzonXFx1MjAxNCcsJzE1Mic6J1xcdTAyREMnLCcxNTMnOidcXHUyMTIyJywnMTU0JzonXFx1MDE2MScsJzE1NSc6J1xcdTIwM0EnLCcxNTYnOidcXHUwMTUzJywnMTU4JzonXFx1MDE3RScsJzE1OSc6J1xcdTAxNzgnfTtcblx0dmFyIGludmFsaWRSZWZlcmVuY2VDb2RlUG9pbnRzID0gWzEsMiwzLDQsNSw2LDcsOCwxMSwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwyNiwyNywyOCwyOSwzMCwzMSwxMjcsMTI4LDEyOSwxMzAsMTMxLDEzMiwxMzMsMTM0LDEzNSwxMzYsMTM3LDEzOCwxMzksMTQwLDE0MSwxNDIsMTQzLDE0NCwxNDUsMTQ2LDE0NywxNDgsMTQ5LDE1MCwxNTEsMTUyLDE1MywxNTQsMTU1LDE1NiwxNTcsMTU4LDE1OSw2NDk3Niw2NDk3Nyw2NDk3OCw2NDk3OSw2NDk4MCw2NDk4MSw2NDk4Miw2NDk4Myw2NDk4NCw2NDk4NSw2NDk4Niw2NDk4Nyw2NDk4OCw2NDk4OSw2NDk5MCw2NDk5MSw2NDk5Miw2NDk5Myw2NDk5NCw2NDk5NSw2NDk5Niw2NDk5Nyw2NDk5OCw2NDk5OSw2NTAwMCw2NTAwMSw2NTAwMiw2NTAwMyw2NTAwNCw2NTAwNSw2NTAwNiw2NTAwNyw2NTUzNCw2NTUzNSwxMzEwNzAsMTMxMDcxLDE5NjYwNiwxOTY2MDcsMjYyMTQyLDI2MjE0MywzMjc2NzgsMzI3Njc5LDM5MzIxNCwzOTMyMTUsNDU4NzUwLDQ1ODc1MSw1MjQyODYsNTI0Mjg3LDU4OTgyMiw1ODk4MjMsNjU1MzU4LDY1NTM1OSw3MjA4OTQsNzIwODk1LDc4NjQzMCw3ODY0MzEsODUxOTY2LDg1MTk2Nyw5MTc1MDIsOTE3NTAzLDk4MzAzOCw5ODMwMzksMTA0ODU3NCwxMDQ4NTc1LDExMTQxMTAsMTExNDExMV07XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0dmFyIHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cblx0dmFyIG9iamVjdCA9IHt9O1xuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3QuaGFzT3duUHJvcGVydHk7XG5cdHZhciBoYXMgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5TmFtZSkge1xuXHRcdHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHlOYW1lKTtcblx0fTtcblxuXHR2YXIgY29udGFpbnMgPSBmdW5jdGlvbihhcnJheSwgdmFsdWUpIHtcblx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHR2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG5cdFx0XHRpZiAoYXJyYXlbaW5kZXhdID09IHZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0dmFyIG1lcmdlID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdHMpIHtcblx0XHRpZiAoIW9wdGlvbnMpIHtcblx0XHRcdHJldHVybiBkZWZhdWx0cztcblx0XHR9XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdHZhciBrZXk7XG5cdFx0Zm9yIChrZXkgaW4gZGVmYXVsdHMpIHtcblx0XHRcdC8vIEEgYGhhc093blByb3BlcnR5YCBjaGVjayBpcyBub3QgbmVlZGVkIGhlcmUsIHNpbmNlIG9ubHkgcmVjb2duaXplZFxuXHRcdFx0Ly8gb3B0aW9uIG5hbWVzIGFyZSB1c2VkIGFueXdheS4gQW55IG90aGVycyBhcmUgaWdub3JlZC5cblx0XHRcdHJlc3VsdFtrZXldID0gaGFzKG9wdGlvbnMsIGtleSkgPyBvcHRpb25zW2tleV0gOiBkZWZhdWx0c1trZXldO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8vIE1vZGlmaWVkIHZlcnNpb24gb2YgYHVjczJlbmNvZGVgOyBzZWUgaHR0cDovL210aHMuYmUvcHVueWNvZGUuXG5cdHZhciBjb2RlUG9pbnRUb1N5bWJvbCA9IGZ1bmN0aW9uKGNvZGVQb2ludCwgc3RyaWN0KSB7XG5cdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdGlmICgoY29kZVBvaW50ID49IDB4RDgwMCAmJiBjb2RlUG9pbnQgPD0gMHhERkZGKSB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRikge1xuXHRcdFx0Ly8gU2VlIGlzc3VlICM0OlxuXHRcdFx0Ly8g4oCcT3RoZXJ3aXNlLCBpZiB0aGUgbnVtYmVyIGlzIGluIHRoZSByYW5nZSAweEQ4MDAgdG8gMHhERkZGIG9yIGlzXG5cdFx0XHQvLyBncmVhdGVyIHRoYW4gMHgxMEZGRkYsIHRoZW4gdGhpcyBpcyBhIHBhcnNlIGVycm9yLiBSZXR1cm4gYSBVK0ZGRkRcblx0XHRcdC8vIFJFUExBQ0VNRU5UIENIQVJBQ1RFUi7igJ1cblx0XHRcdGlmIChzdHJpY3QpIHtcblx0XHRcdFx0cGFyc2VFcnJvcignY2hhcmFjdGVyIHJlZmVyZW5jZSBvdXRzaWRlIHRoZSBwZXJtaXNzaWJsZSBVbmljb2RlIHJhbmdlJyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJ1xcdUZGRkQnO1xuXHRcdH1cblx0XHRpZiAoaGFzKGRlY29kZU1hcE51bWVyaWMsIGNvZGVQb2ludCkpIHtcblx0XHRcdGlmIChzdHJpY3QpIHtcblx0XHRcdFx0cGFyc2VFcnJvcignZGlzYWxsb3dlZCBjaGFyYWN0ZXIgcmVmZXJlbmNlJyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGVjb2RlTWFwTnVtZXJpY1tjb2RlUG9pbnRdO1xuXHRcdH1cblx0XHRpZiAoc3RyaWN0ICYmIGNvbnRhaW5zKGludmFsaWRSZWZlcmVuY2VDb2RlUG9pbnRzLCBjb2RlUG9pbnQpKSB7XG5cdFx0XHRwYXJzZUVycm9yKCdkaXNhbGxvd2VkIGNoYXJhY3RlciByZWZlcmVuY2UnKTtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuXHRcdFx0Y29kZVBvaW50IC09IDB4MTAwMDA7XG5cdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMCk7XG5cdFx0XHRjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRjtcblx0XHR9XG5cdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH07XG5cblx0dmFyIGhleEVzY2FwZSA9IGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdHJldHVybiAnJiN4JyArIHN5bWJvbC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICsgJzsnO1xuXHR9O1xuXG5cdHZhciBwYXJzZUVycm9yID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHRcdHRocm93IEVycm9yKCdQYXJzZSBlcnJvcjogJyArIG1lc3NhZ2UpO1xuXHR9O1xuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdHZhciBlbmNvZGUgPSBmdW5jdGlvbihzdHJpbmcsIG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gbWVyZ2Uob3B0aW9ucywgZW5jb2RlLm9wdGlvbnMpO1xuXHRcdHZhciBzdHJpY3QgPSBvcHRpb25zLnN0cmljdDtcblx0XHRpZiAoc3RyaWN0ICYmIHJlZ2V4SW52YWxpZFJhd0NvZGVQb2ludC50ZXN0KHN0cmluZykpIHtcblx0XHRcdHBhcnNlRXJyb3IoJ2ZvcmJpZGRlbiBjb2RlIHBvaW50Jyk7XG5cdFx0fVxuXHRcdHZhciBlbmNvZGVFdmVyeXRoaW5nID0gb3B0aW9ucy5lbmNvZGVFdmVyeXRoaW5nO1xuXHRcdHZhciB1c2VOYW1lZFJlZmVyZW5jZXMgPSBvcHRpb25zLnVzZU5hbWVkUmVmZXJlbmNlcztcblx0XHRpZiAoZW5jb2RlRXZlcnl0aGluZykge1xuXHRcdFx0Ly8gRW5jb2RlIEFTQ0lJIHN5bWJvbHMuXG5cdFx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleEFzY2lpV2hpdGVsaXN0LCBmdW5jdGlvbihzeW1ib2wpIHtcblx0XHRcdFx0Ly8gVXNlIG5hbWVkIHJlZmVyZW5jZXMgaWYgcmVxdWVzdGVkICYgcG9zc2libGUuXG5cdFx0XHRcdGlmICh1c2VOYW1lZFJlZmVyZW5jZXMgJiYgaGFzKGVuY29kZU1hcCwgc3ltYm9sKSkge1xuXHRcdFx0XHRcdHJldHVybiAnJicgKyBlbmNvZGVNYXBbc3ltYm9sXSArICc7Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaGV4RXNjYXBlKHN5bWJvbCk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIFNob3J0ZW4gYSBmZXcgZXNjYXBlcyB0aGF0IHJlcHJlc2VudCB0d28gc3ltYm9scywgb2Ygd2hpY2ggYXQgbGVhc3Qgb25lXG5cdFx0XHQvLyBpcyB3aXRoaW4gdGhlIEFTQ0lJIHJhbmdlLlxuXHRcdFx0aWYgKHVzZU5hbWVkUmVmZXJlbmNlcykge1xuXHRcdFx0XHRzdHJpbmcgPSBzdHJpbmdcblx0XHRcdFx0XHQucmVwbGFjZSgvJmd0O1xcdTIwRDIvZywgJyZudmd0OycpXG5cdFx0XHRcdFx0LnJlcGxhY2UoLyZsdDtcXHUyMEQyL2csICcmbnZsdDsnKVxuXHRcdFx0XHRcdC5yZXBsYWNlKC8mI3g2NjsmI3g2QTsvZywgJyZmamxpZzsnKTtcblx0XHRcdH1cblx0XHRcdC8vIEVuY29kZSBub24tQVNDSUkgc3ltYm9scy5cblx0XHRcdGlmICh1c2VOYW1lZFJlZmVyZW5jZXMpIHtcblx0XHRcdFx0Ly8gRW5jb2RlIG5vbi1BU0NJSSBzeW1ib2xzIHRoYXQgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBuYW1lZCByZWZlcmVuY2UuXG5cdFx0XHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4RW5jb2RlTm9uQXNjaWksIGZ1bmN0aW9uKHN0cmluZykge1xuXHRcdFx0XHRcdC8vIE5vdGU6IHRoZXJlIGlzIG5vIG5lZWQgdG8gY2hlY2sgYGhhcyhlbmNvZGVNYXAsIHN0cmluZylgIGhlcmUuXG5cdFx0XHRcdFx0cmV0dXJuICcmJyArIGVuY29kZU1hcFtzdHJpbmddICsgJzsnO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8vIE5vdGU6IGFueSByZW1haW5pbmcgbm9uLUFTQ0lJIHN5bWJvbHMgYXJlIGhhbmRsZWQgb3V0c2lkZSBvZiB0aGUgYGlmYC5cblx0XHR9IGVsc2UgaWYgKHVzZU5hbWVkUmVmZXJlbmNlcykge1xuXHRcdFx0Ly8gQXBwbHkgbmFtZWQgY2hhcmFjdGVyIHJlZmVyZW5jZXMuXG5cdFx0XHQvLyBFbmNvZGUgYDw+XCInJmAgdXNpbmcgbmFtZWQgY2hhcmFjdGVyIHJlZmVyZW5jZXMuXG5cdFx0XHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleEVzY2FwZSwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiAnJicgKyBlbmNvZGVNYXBbc3RyaW5nXSArICc7JzsgLy8gbm8gbmVlZCB0byBjaGVjayBgaGFzKClgIGhlcmVcblx0XHRcdH0pO1xuXHRcdFx0Ly8gU2hvcnRlbiBlc2NhcGVzIHRoYXQgcmVwcmVzZW50IHR3byBzeW1ib2xzLCBvZiB3aGljaCBhdCBsZWFzdCBvbmUgaXNcblx0XHRcdC8vIGA8PlwiJyZgLlxuXHRcdFx0c3RyaW5nID0gc3RyaW5nXG5cdFx0XHRcdC5yZXBsYWNlKC8mZ3Q7XFx1MjBEMi9nLCAnJm52Z3Q7Jylcblx0XHRcdFx0LnJlcGxhY2UoLyZsdDtcXHUyMEQyL2csICcmbnZsdDsnKTtcblx0XHRcdC8vIEVuY29kZSBub24tQVNDSUkgc3ltYm9scyB0aGF0IGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgbmFtZWQgcmVmZXJlbmNlLlxuXHRcdFx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UocmVnZXhFbmNvZGVOb25Bc2NpaSwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRcdC8vIE5vdGU6IHRoZXJlIGlzIG5vIG5lZWQgdG8gY2hlY2sgYGhhcyhlbmNvZGVNYXAsIHN0cmluZylgIGhlcmUuXG5cdFx0XHRcdHJldHVybiAnJicgKyBlbmNvZGVNYXBbc3RyaW5nXSArICc7Jztcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBFbmNvZGUgYDw+XCInJmAgdXNpbmcgaGV4YWRlY2ltYWwgZXNjYXBlcywgbm93IHRoYXQgdGhleeKAmXJlIG5vdCBoYW5kbGVkXG5cdFx0XHQvLyB1c2luZyBuYW1lZCBjaGFyYWN0ZXIgcmVmZXJlbmNlcy5cblx0XHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4RXNjYXBlLCBoZXhFc2NhcGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RyaW5nXG5cdFx0XHQvLyBFbmNvZGUgYXN0cmFsIHN5bWJvbHMuXG5cdFx0XHQucmVwbGFjZShyZWdleEFzdHJhbFN5bWJvbHMsIGZ1bmN0aW9uKCQwKSB7XG5cdFx0XHRcdC8vIGh0dHA6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG5cdFx0XHRcdHZhciBoaWdoID0gJDAuY2hhckNvZGVBdCgwKTtcblx0XHRcdFx0dmFyIGxvdyA9ICQwLmNoYXJDb2RlQXQoMSk7XG5cdFx0XHRcdHZhciBjb2RlUG9pbnQgPSAoaGlnaCAtIDB4RDgwMCkgKiAweDQwMCArIGxvdyAtIDB4REMwMCArIDB4MTAwMDA7XG5cdFx0XHRcdHJldHVybiAnJiN4JyArIGNvZGVQb2ludC50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSArICc7Jztcblx0XHRcdH0pXG5cdFx0XHQvLyBFbmNvZGUgYW55IHJlbWFpbmluZyBCTVAgc3ltYm9scyB0aGF0IGFyZSBub3QgcHJpbnRhYmxlIEFTQ0lJIHN5bWJvbHNcblx0XHRcdC8vIHVzaW5nIGEgaGV4YWRlY2ltYWwgZXNjYXBlLlxuXHRcdFx0LnJlcGxhY2UocmVnZXhCbXBXaGl0ZWxpc3QsIGhleEVzY2FwZSk7XG5cdH07XG5cdC8vIEV4cG9zZSBkZWZhdWx0IG9wdGlvbnMgKHNvIHRoZXkgY2FuIGJlIG92ZXJyaWRkZW4gZ2xvYmFsbHkpLlxuXHRlbmNvZGUub3B0aW9ucyA9IHtcblx0XHQnZW5jb2RlRXZlcnl0aGluZyc6IGZhbHNlLFxuXHRcdCdzdHJpY3QnOiBmYWxzZSxcblx0XHQndXNlTmFtZWRSZWZlcmVuY2VzJzogZmFsc2Vcblx0fTtcblxuXHR2YXIgZGVjb2RlID0gZnVuY3Rpb24oaHRtbCwgb3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSBtZXJnZShvcHRpb25zLCBkZWNvZGUub3B0aW9ucyk7XG5cdFx0dmFyIHN0cmljdCA9IG9wdGlvbnMuc3RyaWN0O1xuXHRcdGlmIChzdHJpY3QgJiYgcmVnZXhJbnZhbGlkRW50aXR5LnRlc3QoaHRtbCkpIHtcblx0XHRcdHBhcnNlRXJyb3IoJ21hbGZvcm1lZCBjaGFyYWN0ZXIgcmVmZXJlbmNlJyk7XG5cdFx0fVxuXHRcdHJldHVybiBodG1sLnJlcGxhY2UocmVnZXhEZWNvZGUsIGZ1bmN0aW9uKCQwLCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNykge1xuXHRcdFx0dmFyIGNvZGVQb2ludDtcblx0XHRcdHZhciBzZW1pY29sb247XG5cdFx0XHR2YXIgaGV4RGlnaXRzO1xuXHRcdFx0dmFyIHJlZmVyZW5jZTtcblx0XHRcdHZhciBuZXh0O1xuXHRcdFx0aWYgKCQxKSB7XG5cdFx0XHRcdC8vIERlY29kZSBkZWNpbWFsIGVzY2FwZXMsIGUuZy4gYCYjMTE5NTU4O2AuXG5cdFx0XHRcdGNvZGVQb2ludCA9ICQxO1xuXHRcdFx0XHRzZW1pY29sb24gPSAkMjtcblx0XHRcdFx0aWYgKHN0cmljdCAmJiAhc2VtaWNvbG9uKSB7XG5cdFx0XHRcdFx0cGFyc2VFcnJvcignY2hhcmFjdGVyIHJlZmVyZW5jZSB3YXMgbm90IHRlcm1pbmF0ZWQgYnkgYSBzZW1pY29sb24nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY29kZVBvaW50VG9TeW1ib2woY29kZVBvaW50LCBzdHJpY3QpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCQzKSB7XG5cdFx0XHRcdC8vIERlY29kZSBoZXhhZGVjaW1hbCBlc2NhcGVzLCBlLmcuIGAmI3gxRDMwNjtgLlxuXHRcdFx0XHRoZXhEaWdpdHMgPSAkMztcblx0XHRcdFx0c2VtaWNvbG9uID0gJDQ7XG5cdFx0XHRcdGlmIChzdHJpY3QgJiYgIXNlbWljb2xvbikge1xuXHRcdFx0XHRcdHBhcnNlRXJyb3IoJ2NoYXJhY3RlciByZWZlcmVuY2Ugd2FzIG5vdCB0ZXJtaW5hdGVkIGJ5IGEgc2VtaWNvbG9uJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29kZVBvaW50ID0gcGFyc2VJbnQoaGV4RGlnaXRzLCAxNik7XG5cdFx0XHRcdHJldHVybiBjb2RlUG9pbnRUb1N5bWJvbChjb2RlUG9pbnQsIHN0cmljdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoJDUpIHtcblx0XHRcdFx0Ly8gRGVjb2RlIG5hbWVkIGNoYXJhY3RlciByZWZlcmVuY2VzIHdpdGggdHJhaWxpbmcgYDtgLCBlLmcuIGAmY29weTtgLlxuXHRcdFx0XHRyZWZlcmVuY2UgPSAkNTtcblx0XHRcdFx0aWYgKGhhcyhkZWNvZGVNYXAsIHJlZmVyZW5jZSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZGVjb2RlTWFwW3JlZmVyZW5jZV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQW1iaWd1b3VzIGFtcGVyc2FuZDsgc2VlIGh0dHA6Ly9tdGhzLmJlL25vdGVzL2FtYmlndW91cy1hbXBlcnNhbmRzLlxuXHRcdFx0XHRcdGlmIChzdHJpY3QpIHtcblx0XHRcdFx0XHRcdHBhcnNlRXJyb3IoXG5cdFx0XHRcdFx0XHRcdCduYW1lZCBjaGFyYWN0ZXIgcmVmZXJlbmNlIHdhcyBub3QgdGVybWluYXRlZCBieSBhIHNlbWljb2xvbidcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiAkMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgd2XigJlyZSBzdGlsbCBoZXJlLCBpdOKAmXMgYSBsZWdhY3kgcmVmZXJlbmNlIGZvciBzdXJlLiBObyBuZWVkIGZvciBhblxuXHRcdFx0Ly8gZXh0cmEgYGlmYCBjaGVjay5cblx0XHRcdC8vIERlY29kZSBuYW1lZCBjaGFyYWN0ZXIgcmVmZXJlbmNlcyB3aXRob3V0IHRyYWlsaW5nIGA7YCwgZS5nLiBgJmFtcGBcblx0XHRcdC8vIFRoaXMgaXMgb25seSBhIHBhcnNlIGVycm9yIGlmIGl0IGdldHMgY29udmVydGVkIHRvIGAmYCwgb3IgaWYgaXQgaXNcblx0XHRcdC8vIGZvbGxvd2VkIGJ5IGA9YCBpbiBhbiBhdHRyaWJ1dGUgY29udGV4dC5cblx0XHRcdHJlZmVyZW5jZSA9ICQ2O1xuXHRcdFx0bmV4dCA9ICQ3O1xuXHRcdFx0aWYgKG5leHQgJiYgb3B0aW9ucy5pc0F0dHJpYnV0ZVZhbHVlKSB7XG5cdFx0XHRcdGlmIChzdHJpY3QgJiYgbmV4dCA9PSAnPScpIHtcblx0XHRcdFx0XHRwYXJzZUVycm9yKCdgJmAgZGlkIG5vdCBzdGFydCBhIGNoYXJhY3RlciByZWZlcmVuY2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gJDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoc3RyaWN0KSB7XG5cdFx0XHRcdFx0cGFyc2VFcnJvcihcblx0XHRcdFx0XHRcdCduYW1lZCBjaGFyYWN0ZXIgcmVmZXJlbmNlIHdhcyBub3QgdGVybWluYXRlZCBieSBhIHNlbWljb2xvbidcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE5vdGU6IHRoZXJlIGlzIG5vIG5lZWQgdG8gY2hlY2sgYGhhcyhkZWNvZGVNYXBMZWdhY3ksIHJlZmVyZW5jZSlgLlxuXHRcdFx0XHRyZXR1cm4gZGVjb2RlTWFwTGVnYWN5W3JlZmVyZW5jZV0gKyAobmV4dCB8fCAnJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cdC8vIEV4cG9zZSBkZWZhdWx0IG9wdGlvbnMgKHNvIHRoZXkgY2FuIGJlIG92ZXJyaWRkZW4gZ2xvYmFsbHkpLlxuXHRkZWNvZGUub3B0aW9ucyA9IHtcblx0XHQnaXNBdHRyaWJ1dGVWYWx1ZSc6IGZhbHNlLFxuXHRcdCdzdHJpY3QnOiBmYWxzZVxuXHR9O1xuXG5cdHZhciBlc2NhcGUgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVnZXhFc2NhcGUsIGZ1bmN0aW9uKCQwKSB7XG5cdFx0XHQvLyBOb3RlOiB0aGVyZSBpcyBubyBuZWVkIHRvIGNoZWNrIGBoYXMoZXNjYXBlTWFwLCAkMClgIGhlcmUuXG5cdFx0XHRyZXR1cm4gZXNjYXBlTWFwWyQwXTtcblx0XHR9KTtcblx0fTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHR2YXIgaGUgPSB7XG5cdFx0J3ZlcnNpb24nOiAnMC40LjEnLFxuXHRcdCdlbmNvZGUnOiBlbmNvZGUsXG5cdFx0J2RlY29kZSc6IGRlY29kZSxcblx0XHQnZXNjYXBlJzogZXNjYXBlLFxuXHRcdCd1bmVzY2FwZSc6IGRlY29kZVxuXHR9O1xuXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdGRlZmluZS5hbWRcblx0KSB7XG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGhlO1xuXHRcdH0pO1xuXHR9XHRlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiAhZnJlZUV4cG9ydHMubm9kZVR5cGUpIHtcblx0XHRpZiAoZnJlZU1vZHVsZSkgeyAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gaGU7XG5cdFx0fSBlbHNlIHsgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cblx0XHRcdGZvciAodmFyIGtleSBpbiBoZSkge1xuXHRcdFx0XHRoYXMoaGUsIGtleSkgJiYgKGZyZWVFeHBvcnRzW2tleV0gPSBoZVtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LmhlID0gaGU7XG5cdH1cblxufSh0aGlzKSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKXtcbiAgdmFyIElERU5UX1JFX1JVID0gJ1thLXpBLVrQsC3Rj9CQLdCvXVthLXpBLVowLTlf0LAt0Y/QkC3Qr10qJztcbiAgdmFyIE9uZVNfS0VZV09SRFMgPSAn0LLQvtC30LLRgNCw0YIg0LTQsNGC0LAg0LTQu9GPINC10YHQu9C4INC4INC40LvQuCDQuNC90LDRh9C1INC40L3QsNGH0LXQtdGB0LvQuCDQuNGB0LrQu9GO0YfQtdC90LjQtSDQutC+0L3QtdGG0LXRgdC70LggJyArXG4gICAgJ9C60L7QvdC10YbQv9C+0L/Ri9GC0LrQuCDQutC+0L3QtdGG0L/RgNC+0YbQtdC00YPRgNGLINC60L7QvdC10YbRhNGD0L3QutGG0LjQuCDQutC+0L3QtdGG0YbQuNC60LvQsCDQutC+0L3RgdGC0LDQvdGC0LAg0L3QtSDQv9C10YDQtdC50YLQuCDQv9C10YDQtdC8ICcgK1xuICAgICfQv9C10YDQtdGH0LjRgdC70LXQvdC40LUg0L/QviDQv9C+0LrQsCDQv9C+0L/Ri9GC0LrQsCDQv9GA0LXRgNCy0LDRgtGMINC/0YDQvtC00L7Qu9C20LjRgtGMINC/0YDQvtGG0LXQtNGD0YDQsCDRgdGC0YDQvtC60LAg0YLQvtCz0LTQsCDRhNGBINGE0YPQvdC60YbQuNGPINGG0LjQutC7ICcgK1xuICAgICfRh9C40YHQu9C+INGN0LrRgdC/0L7RgNGCJztcbiAgdmFyIE9uZVNfQlVJTFRfSU4gPSAnYW5zaXRvb2VtIG9lbXRvYW5zaSDQstCy0LXRgdGC0LjQstC40LTRgdGD0LHQutC+0L3RgtC+INCy0LLQtdGB0YLQuNC00LDRgtGDINCy0LLQtdGB0YLQuNC30L3QsNGH0LXQvdC40LUgJyArXG4gICAgJ9Cy0LLQtdGB0YLQuNC/0LXRgNC10YfQuNGB0LvQtdC90LjQtSDQstCy0LXRgdGC0LjQv9C10YDQuNC+0LQg0LLQstC10YHRgtC40L/Qu9Cw0L3RgdGH0LXRgtC+0LIg0LLQstC10YHRgtC40YHRgtGA0L7QutGDINCy0LLQtdGB0YLQuNGH0LjRgdC70L4g0LLQvtC/0YDQvtGBICcgK1xuICAgICfQstC+0YHRgdGC0LDQvdC+0LLQuNGC0YzQt9C90LDRh9C10L3QuNC1INCy0YDQtdCzINCy0YvQsdGA0LDQvdC90YvQudC/0LvQsNC90YHRh9C10YLQvtCyINCy0YvQt9Cy0LDRgtGM0LjRgdC60LvRjtGH0LXQvdC40LUg0LTQsNGC0LDQs9C+0LQg0LTQsNGC0LDQvNC10YHRj9GGICcgK1xuICAgICfQtNCw0YLQsNGH0LjRgdC70L4g0LTQvtCx0LDQstC40YLRjNC80LXRgdGP0YYg0LfQsNCy0LXRgNGI0LjRgtGM0YDQsNCx0L7RgtGD0YHQuNGB0YLQtdC80Ysg0LfQsNCz0L7Qu9C+0LLQvtC60YHQuNGB0YLQtdC80Ysg0LfQsNC/0LjRgdGM0LbRg9GA0L3QsNC70LDRgNC10LPQuNGB0YLRgNCw0YbQuNC4ICcgK1xuICAgICfQt9Cw0L/Rg9GB0YLQuNGC0YzQv9GA0LjQu9C+0LbQtdC90LjQtSDQt9Cw0YTQuNC60YHQuNGA0L7QstCw0YLRjNGC0YDQsNC90LfQsNC60YbQuNGOINC30L3QsNGH0LXQvdC40LXQstGB0YLRgNC+0LrRgyDQt9C90LDRh9C10L3QuNC10LLRgdGC0YDQvtC60YPQstC90YPRgtGAICcgK1xuICAgICfQt9C90LDRh9C10L3QuNC10LLRhNCw0LnQuyDQt9C90LDRh9C10L3QuNC10LjQt9GB0YLRgNC+0LrQuCDQt9C90LDRh9C10L3QuNC10LjQt9GB0YLRgNC+0LrQuNCy0L3Rg9GC0YAg0LfQvdCw0YfQtdC90LjQtdC40LfRhNCw0LnQu9CwINC40LzRj9C60L7QvNC/0YzRjtGC0LXRgNCwICcgK1xuICAgICfQuNC80Y/Qv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LrQsNGC0LDQu9C+0LPQstGA0LXQvNC10L3QvdGL0YXRhNCw0LnQu9C+0LIg0LrQsNGC0LDQu9C+0LPQuNCxINC60LDRgtCw0LvQvtCz0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC60LDRgtCw0LvQvtCz0L/RgNC+0LPRgNCw0LzQvNGLICcgK1xuICAgICfQutC+0LTRgdC40LzQsiDQutC+0LzQsNC90LTQsNGB0LjRgdGC0LXQvNGLINC60L7QvdCz0L7QtNCwINC60L7QvdC10YbQv9C10YDQuNC+0LTQsNCx0Lgg0LrQvtC90LXRhtGA0LDRgdGB0YfQuNGC0LDQvdC90L7Qs9C+0L/QtdGA0LjQvtC00LDQsdC4ICcgK1xuICAgICfQutC+0L3QtdGG0YHRgtCw0L3QtNCw0YDRgtC90L7Qs9C+0LjQvdGC0LXRgNCy0LDQu9CwINC60L7QvdC60LLQsNGA0YLQsNC70LAg0LrQvtC90LzQtdGB0Y/RhtCwINC60L7QvdC90LXQtNC10LvQuCDQu9C10LIg0LvQvtCzINC70L7QszEwINC80LDQutGBICcgK1xuICAgICfQvNCw0LrRgdC40LzQsNC70YzQvdC+0LXQutC+0LvQuNGH0LXRgdGC0LLQvtGB0YPQsdC60L7QvdGC0L4g0LzQuNC9INC80L7QvdC+0L/QvtC70YzQvdGL0LnRgNC10LbQuNC8INC90LDQt9Cy0LDQvdC40LXQuNC90YLQtdGA0YTQtdC50YHQsCDQvdCw0LfQstCw0L3QuNC10L3QsNCx0L7RgNCw0L/RgNCw0LIgJyArXG4gICAgJ9C90LDQt9C90LDRh9C40YLRjNCy0LjQtCDQvdCw0LfQvdCw0YfQuNGC0YzRgdGH0LXRgiDQvdCw0LnRgtC4INC90LDQudGC0LjQv9C+0LzQtdGH0LXQvdC90YvQtdC90LDRg9C00LDQu9C10L3QuNC1INC90LDQudGC0LjRgdGB0YvQu9C60Lgg0L3QsNGH0LDQu9C+0L/QtdGA0LjQvtC00LDQsdC4ICcgK1xuICAgICfQvdCw0YfQsNC70L7RgdGC0LDQvdC00LDRgNGC0L3QvtCz0L7QuNC90YLQtdGA0LLQsNC70LAg0L3QsNGH0LDRgtGM0YLRgNCw0L3Qt9Cw0LrRhtC40Y4g0L3QsNGH0LPQvtC00LAg0L3QsNGH0LrQstCw0YDRgtCw0LvQsCDQvdCw0YfQvNC10YHRj9GG0LAg0L3QsNGH0L3QtdC00LXQu9C4ICcgK1xuICAgICfQvdC+0LzQtdGA0LTQvdGP0LPQvtC00LAg0L3QvtC80LXRgNC00L3Rj9C90LXQtNC10LvQuCDQvdC+0LzQtdGA0L3QtdC00LXQu9C40LPQvtC00LAg0L3RgNC10LMg0L7QsdGA0LDQsdC+0YLQutCw0L7QttC40LTQsNC90LjRjyDQvtC60YAg0L7Qv9C40YHQsNC90LjQtdC+0YjQuNCx0LrQuCAnICtcbiAgICAn0L7RgdC90L7QstC90L7QudC20YPRgNC90LDQu9GA0LDRgdGH0LXRgtC+0LIg0L7RgdC90L7QstC90L7QudC/0LvQsNC90YHRh9C10YLQvtCyINC+0YHQvdC+0LLQvdC+0LnRj9C30YvQuiDQvtGC0LrRgNGL0YLRjNGE0L7RgNC80YMg0L7RgtC60YDRi9GC0YzRhNC+0YDQvNGD0LzQvtC00LDQu9GM0L3QviAnICtcbiAgICAn0L7RgtC80LXQvdC40YLRjNGC0YDQsNC90LfQsNC60YbQuNGOINC+0YfQuNGB0YLQuNGC0YzQvtC60L3QvtGB0L7QvtCx0YnQtdC90LjQuSDQv9C10YDQuNC+0LTRgdGC0YAg0L/QvtC70L3QvtC10LjQvNGP0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC/0L7Qu9GD0YfQuNGC0YzQstGA0LXQvNGP0YLQsCAnICtcbiAgICAn0L/QvtC70YPRh9C40YLRjNC00LDRgtGD0YLQsCDQv9C+0LvRg9GH0LjRgtGM0LTQvtC60YPQvNC10L3RgtGC0LAg0L/QvtC70YPRh9C40YLRjNC30L3QsNGH0LXQvdC40Y/QvtGC0LHQvtGA0LAg0L/QvtC70YPRh9C40YLRjNC/0L7Qt9C40YbQuNGO0YLQsCAnICtcbiAgICAn0L/QvtC70YPRh9C40YLRjNC/0YPRgdGC0L7QtdC30L3QsNGH0LXQvdC40LUg0L/QvtC70YPRh9C40YLRjNGC0LAg0L/RgNCw0LIg0L/RgNCw0LLQvtC00L7RgdGC0YPQv9CwINC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LUg0L/RgNC10YTQuNC60YHQsNCy0YLQvtC90YPQvNC10YDQsNGG0LjQuCAnICtcbiAgICAn0L/Rg9GB0YLQsNGP0YHRgtGA0L7QutCwINC/0YPRgdGC0L7QtdC30L3QsNGH0LXQvdC40LUg0YDQsNCx0L7Rh9Cw0Y/QtNCw0YLRgtGM0L/Rg9GB0YLQvtC10LfQvdCw0YfQtdC90LjQtSDRgNCw0LHQvtGH0LDRj9C00LDRgtCwINGA0LDQt9C00LXQu9C40YLQtdC70YzRgdGC0YDQsNC90LjRhiAnICtcbiAgICAn0YDQsNC30LTQtdC70LjRgtC10LvRjNGB0YLRgNC+0Log0YDQsNC30Lwg0YDQsNC30L7QsdGA0LDRgtGM0L/QvtC30LjRhtC40Y7QtNC+0LrRg9C80LXQvdGC0LAg0YDQsNGB0YHRh9C40YLQsNGC0YzRgNC10LPQuNGB0YLRgNGL0L3QsCAnICtcbiAgICAn0YDQsNGB0YHRh9C40YLQsNGC0YzRgNC10LPQuNGB0YLRgNGL0L/QviDRgdC40LPQvdCw0Lsg0YHQuNC80LIg0YHQuNC80LLQvtC70YLQsNCx0YPQu9GP0YbQuNC4INGB0L7Qt9C00LDRgtGM0L7QsdGK0LXQutGCINGB0L7QutGA0Lsg0YHQvtC60YDQu9C/INGB0L7QutGA0L8gJyArXG4gICAgJ9GB0L7QvtCx0YnQuNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0L7RhdGA0LDQvdC40YLRjNC30L3QsNGH0LXQvdC40LUg0YHRgNC10LQg0YHRgtCw0YLRg9GB0LLQvtC30LLRgNCw0YLQsCDRgdGC0YDQtNC70LjQvdCwINGB0YLRgNC30LDQvNC10L3QuNGC0YwgJyArXG4gICAgJ9GB0YLRgNC60L7Qu9C40YfQtdGB0YLQstC+0YHRgtGA0L7QuiDRgdGC0YDQv9C+0LvRg9GH0LjRgtGM0YHRgtGA0L7QutGDICDRgdGC0YDRh9C40YHQu9C+0LLRhdC+0LbQtNC10L3QuNC5INGB0YTQvtGA0LzQuNGA0L7QstCw0YLRjNC/0L7Qt9C40YbQuNGO0LTQvtC60YPQvNC10L3RgtCwICcgK1xuICAgICfRgdGH0LXRgtC/0L7QutC+0LTRgyDRgtC10LrRg9GJ0LDRj9C00LDRgtCwINGC0LXQutGD0YnQtdC10LLRgNC10LzRjyDRgtC40L/Qt9C90LDRh9C10L3QuNGPINGC0LjQv9C30L3QsNGH0LXQvdC40Y/RgdGC0YAg0YPQtNCw0LvQuNGC0YzQvtCx0YrQtdC60YLRiyAnICtcbiAgICAn0YPRgdGC0LDQvdC+0LLQuNGC0YzRgtCw0L3QsCDRg9GB0YLQsNC90L7QstC40YLRjNGC0LDQv9C+INGE0LjQutGB0YjQsNCx0LvQvtC9INGE0L7RgNC80LDRgiDRhtC10Lsg0YjQsNCx0LvQvtC9JztcbiAgdmFyIERRVU9URSA9ICB7Y2xhc3NOYW1lOiAnZHF1b3RlJywgIGJlZ2luOiAnXCJcIid9O1xuICB2YXIgU1RSX1NUQVJUID0ge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcInwkJyxcbiAgICAgIGNvbnRhaW5zOiBbRFFVT1RFXSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH07XG4gIHZhciBTVFJfQ09OVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFxcXHwnLCBlbmQ6ICdcInwkJyxcbiAgICBjb250YWluczogW0RRVU9URV1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICBrZXl3b3Jkczoge2tleXdvcmQ6IE9uZVNfS0VZV09SRFMsIGJ1aWx0X2luOiBPbmVTX0JVSUxUX0lOfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIFNUUl9TVEFSVCwgU1RSX0NPTlQsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46ICco0L/RgNC+0YbQtdC00YPRgNCwfNGE0YPQvdC60YbQuNGPKScsIGVuZDogJyQnLFxuICAgICAgICBsZXhlbXM6IElERU5UX1JFX1JVLFxuICAgICAgICBrZXl3b3JkczogJ9C/0YDQvtGG0LXQtNGD0YDQsCDRhNGD0L3QutGG0LjRjycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IElERU5UX1JFX1JVfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0YWlsJyxcbiAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgICAgICBsZXhlbXM6IElERU5UX1JFX1JVLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiAn0LfQvdCw0YcnLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbU1RSX1NUQVJULCBTVFJfQ09OVF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2V4cG9ydCcsXG4gICAgICAgICAgICAgICAgYmVnaW46ICfRjdC60YHQv9C+0YDRgicsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgIGxleGVtczogSURFTlRfUkVfUlUsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6ICfRjdC60YHQv9C+0YDRgicsXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLkNfTElORV9DT01NRU5UX01PREVdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge2NsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsIGJlZ2luOiAnIycsIGVuZDogJyQnfSxcbiAgICAgIHtjbGFzc05hbWU6ICdkYXRlJywgYmVnaW46ICdcXCdcXFxcZHsyfVxcXFwuXFxcXGR7Mn1cXFxcLihcXFxcZHsyfXxcXFxcZHs0fSlcXCcnfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBJREVOVF9SRSA9ICdbYS16QS1aXyRdW2EtekEtWjAtOV8kXSonO1xuICB2YXIgSURFTlRfRlVOQ19SRVRVUk5fVFlQRV9SRSA9ICcoWypdfFthLXpBLVpfJF1bYS16QS1aMC05XyRdKiknO1xuXG4gIHZhciBBUzNfUkVTVF9BUkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdyZXN0X2FyZycsXG4gICAgYmVnaW46ICdbLl17M30nLCBlbmQ6IElERU5UX1JFLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcbiAgdmFyIFRJVExFX01PREUgPSB7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogSURFTlRfUkV9O1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6ICdhcyBicmVhayBjYXNlIGNhdGNoIGNsYXNzIGNvbnN0IGNvbnRpbnVlIGRlZmF1bHQgZGVsZXRlIGRvIGR5bmFtaWMgZWFjaCAnICtcbiAgICAgICAgJ2Vsc2UgZXh0ZW5kcyBmaW5hbCBmaW5hbGx5IGZvciBmdW5jdGlvbiBnZXQgaWYgaW1wbGVtZW50cyBpbXBvcnQgaW4gaW5jbHVkZSAnICtcbiAgICAgICAgJ2luc3RhbmNlb2YgaW50ZXJmYWNlIGludGVybmFsIGlzIG5hbWVzcGFjZSBuYXRpdmUgbmV3IG92ZXJyaWRlIHBhY2thZ2UgcHJpdmF0ZSAnICtcbiAgICAgICAgJ3Byb3RlY3RlZCBwdWJsaWMgcmV0dXJuIHNldCBzdGF0aWMgc3VwZXIgc3dpdGNoIHRoaXMgdGhyb3cgdHJ5IHR5cGVvZiB1c2UgdmFyIHZvaWQgJyArXG4gICAgICAgICd3aGlsZSB3aXRoJyxcbiAgICAgIGxpdGVyYWw6ICd0cnVlIGZhbHNlIG51bGwgdW5kZWZpbmVkJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwYWNrYWdlJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAncGFja2FnZScsXG4gICAgICAgIGNvbnRhaW5zOiBbVElUTEVfTU9ERV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUSVRMRV9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJzsnLFxuICAgICAgICBrZXl3b3JkczogJ2ltcG9ydCBpbmNsdWRlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdbeztdJyxcbiAgICAgICAga2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcUycsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEVfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICBBUzNfUkVTVF9BUkdfTU9ERVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgICAgICBiZWdpbjogJzonLFxuICAgICAgICAgICAgZW5kOiBJREVOVF9GVU5DX1JFVFVSTl9UWVBFX1JFLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBOVU1CRVIgPSB7Y2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICdbXFxcXCQlXVxcXFxkKyd9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6ICdhY2NlcHRmaWx0ZXIgYWNjZXB0bXV0ZXggYWNjZXB0cGF0aGluZm8gYWNjZXNzZmlsZW5hbWUgYWN0aW9uIGFkZGFsdCAnICtcbiAgICAgICAgJ2FkZGFsdGJ5ZW5jb2RpbmcgYWRkYWx0Ynl0eXBlIGFkZGNoYXJzZXQgYWRkZGVmYXVsdGNoYXJzZXQgYWRkZGVzY3JpcHRpb24gJyArXG4gICAgICAgICdhZGRlbmNvZGluZyBhZGRoYW5kbGVyIGFkZGljb24gYWRkaWNvbmJ5ZW5jb2RpbmcgYWRkaWNvbmJ5dHlwZSBhZGRpbnB1dGZpbHRlciAnICtcbiAgICAgICAgJ2FkZGxhbmd1YWdlIGFkZG1vZHVsZWluZm8gYWRkb3V0cHV0ZmlsdGVyIGFkZG91dHB1dGZpbHRlcmJ5dHlwZSBhZGR0eXBlIGFsaWFzICcgK1xuICAgICAgICAnYWxpYXNtYXRjaCBhbGxvdyBhbGxvd2Nvbm5lY3QgYWxsb3dlbmNvZGVkc2xhc2hlcyBhbGxvd292ZXJyaWRlIGFub255bW91cyAnICtcbiAgICAgICAgJ2Fub255bW91c19sb2dlbWFpbCBhbm9ueW1vdXNfbXVzdGdpdmVlbWFpbCBhbm9ueW1vdXNfbm91c2VyaWQgYW5vbnltb3VzX3ZlcmlmeWVtYWlsICcgK1xuICAgICAgICAnYXV0aGJhc2ljYXV0aG9yaXRhdGl2ZSBhdXRoYmFzaWNwcm92aWRlciBhdXRoZGJkdXNlcnB3cXVlcnkgYXV0aGRiZHVzZXJyZWFsbXF1ZXJ5ICcgK1xuICAgICAgICAnYXV0aGRibWdyb3VwZmlsZSBhdXRoZGJtdHlwZSBhdXRoZGJtdXNlcmZpbGUgYXV0aGRlZmF1bHRhdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYXV0aGRpZ2VzdGFsZ29yaXRobSBhdXRoZGlnZXN0ZG9tYWluIGF1dGhkaWdlc3RuY2NoZWNrIGF1dGhkaWdlc3Rub25jZWZvcm1hdCAnICtcbiAgICAgICAgJ2F1dGhkaWdlc3Rub25jZWxpZmV0aW1lIGF1dGhkaWdlc3Rwcm92aWRlciBhdXRoZGlnZXN0cW9wIGF1dGhkaWdlc3RzaG1lbXNpemUgJyArXG4gICAgICAgICdhdXRoZ3JvdXBmaWxlIGF1dGhsZGFwYmluZGRuIGF1dGhsZGFwYmluZHBhc3N3b3JkIGF1dGhsZGFwY2hhcnNldGNvbmZpZyAnICtcbiAgICAgICAgJ2F1dGhsZGFwY29tcGFyZWRub25zZXJ2ZXIgYXV0aGxkYXBkZXJlZmVyZW5jZWFsaWFzZXMgYXV0aGxkYXBncm91cGF0dHJpYnV0ZSAnICtcbiAgICAgICAgJ2F1dGhsZGFwZ3JvdXBhdHRyaWJ1dGVpc2RuIGF1dGhsZGFwcmVtb3RldXNlcmF0dHJpYnV0ZSBhdXRobGRhcHJlbW90ZXVzZXJpc2RuICcgK1xuICAgICAgICAnYXV0aGxkYXB1cmwgYXV0aG5hbWUgYXV0aG5wcm92aWRlcmFsaWFzIGF1dGh0eXBlIGF1dGh1c2VyZmlsZSBhdXRoemRibWF1dGhvcml0YXRpdmUgJyArXG4gICAgICAgICdhdXRoemRibXR5cGUgYXV0aHpkZWZhdWx0YXV0aG9yaXRhdGl2ZSBhdXRoemdyb3VwZmlsZWF1dGhvcml0YXRpdmUgJyArXG4gICAgICAgICdhdXRoemxkYXBhdXRob3JpdGF0aXZlIGF1dGh6b3duZXJhdXRob3JpdGF0aXZlIGF1dGh6dXNlcmF1dGhvcml0YXRpdmUgJyArXG4gICAgICAgICdiYWxhbmNlcm1lbWJlciBicm93c2VybWF0Y2ggYnJvd3Nlcm1hdGNobm9jYXNlIGJ1ZmZlcmVkbG9ncyBjYWNoZWRlZmF1bHRleHBpcmUgJyArXG4gICAgICAgICdjYWNoZWRpcmxlbmd0aCBjYWNoZWRpcmxldmVscyBjYWNoZWRpc2FibGUgY2FjaGVlbmFibGUgY2FjaGVmaWxlICcgK1xuICAgICAgICAnY2FjaGVpZ25vcmVjYWNoZWNvbnRyb2wgY2FjaGVpZ25vcmVoZWFkZXJzIGNhY2hlaWdub3Jlbm9sYXN0bW9kICcgK1xuICAgICAgICAnY2FjaGVpZ25vcmVxdWVyeXN0cmluZyBjYWNoZWxhc3Rtb2RpZmllZGZhY3RvciBjYWNoZW1heGV4cGlyZSBjYWNoZW1heGZpbGVzaXplICcgK1xuICAgICAgICAnY2FjaGVtaW5maWxlc2l6ZSBjYWNoZW5lZ290aWF0ZWRkb2NzIGNhY2hlcm9vdCBjYWNoZXN0b3Jlbm9zdG9yZSBjYWNoZXN0b3JlcHJpdmF0ZSAnICtcbiAgICAgICAgJ2NnaW1hcGV4dGVuc2lvbiBjaGFyc2V0ZGVmYXVsdCBjaGFyc2V0b3B0aW9ucyBjaGFyc2V0c291cmNlZW5jIGNoZWNrY2FzZW9ubHkgJyArXG4gICAgICAgICdjaGVja3NwZWxsaW5nIGNocm9vdGRpciBjb250ZW50ZGlnZXN0IGNvb2tpZWRvbWFpbiBjb29raWVleHBpcmVzIGNvb2tpZWxvZyAnICtcbiAgICAgICAgJ2Nvb2tpZW5hbWUgY29va2llc3R5bGUgY29va2lldHJhY2tpbmcgY29yZWR1bXBkaXJlY3RvcnkgY3VzdG9tbG9nIGRhdiAnICtcbiAgICAgICAgJ2RhdmRlcHRoaW5maW5pdHkgZGF2Z2VuZXJpY2xvY2tkYiBkYXZsb2NrZGIgZGF2bWludGltZW91dCBkYmRleHB0aW1lIGRiZGtlZXAgJyArXG4gICAgICAgICdkYmRtYXggZGJkbWluIGRiZHBhcmFtcyBkYmRwZXJzaXN0IGRiZHByZXBhcmVzcWwgZGJkcml2ZXIgZGVmYXVsdGljb24gJyArXG4gICAgICAgICdkZWZhdWx0bGFuZ3VhZ2UgZGVmYXVsdHR5cGUgZGVmbGF0ZWJ1ZmZlcnNpemUgZGVmbGF0ZWNvbXByZXNzaW9ubGV2ZWwgJyArXG4gICAgICAgICdkZWZsYXRlZmlsdGVybm90ZSBkZWZsYXRlbWVtbGV2ZWwgZGVmbGF0ZXdpbmRvd3NpemUgZGVueSBkaXJlY3RvcnlpbmRleCAnICtcbiAgICAgICAgJ2RpcmVjdG9yeW1hdGNoIGRpcmVjdG9yeXNsYXNoIGRvY3VtZW50cm9vdCBkdW1waW9pbnB1dCBkdW1waW9sb2dsZXZlbCBkdW1waW9vdXRwdXQgJyArXG4gICAgICAgICdlbmFibGVleGNlcHRpb25ob29rIGVuYWJsZW1tYXAgZW5hYmxlc2VuZGZpbGUgZXJyb3Jkb2N1bWVudCBlcnJvcmxvZyBleGFtcGxlICcgK1xuICAgICAgICAnZXhwaXJlc2FjdGl2ZSBleHBpcmVzYnl0eXBlIGV4cGlyZXNkZWZhdWx0IGV4dGVuZGVkc3RhdHVzIGV4dGZpbHRlcmRlZmluZSAnICtcbiAgICAgICAgJ2V4dGZpbHRlcm9wdGlvbnMgZmlsZWV0YWcgZmlsdGVyY2hhaW4gZmlsdGVyZGVjbGFyZSBmaWx0ZXJwcm90b2NvbCBmaWx0ZXJwcm92aWRlciAnICtcbiAgICAgICAgJ2ZpbHRlcnRyYWNlIGZvcmNlbGFuZ3VhZ2Vwcmlvcml0eSBmb3JjZXR5cGUgZm9yZW5zaWNsb2cgZ3JhY2VmdWxzaHV0ZG93bnRpbWVvdXQgJyArXG4gICAgICAgICdncm91cCBoZWFkZXIgaGVhZGVybmFtZSBob3N0bmFtZWxvb2t1cHMgaWRlbnRpdHljaGVjayBpZGVudGl0eWNoZWNrdGltZW91dCAnICtcbiAgICAgICAgJ2ltYXBiYXNlIGltYXBkZWZhdWx0IGltYXBtZW51IGluY2x1ZGUgaW5kZXhoZWFkaW5zZXJ0IGluZGV4aWdub3JlIGluZGV4b3B0aW9ucyAnICtcbiAgICAgICAgJ2luZGV4b3JkZXJkZWZhdWx0IGluZGV4c3R5bGVzaGVldCBpc2FwaWFwcGVuZGxvZ3RvZXJyb3JzIGlzYXBpYXBwZW5kbG9ndG9xdWVyeSAnICtcbiAgICAgICAgJ2lzYXBpY2FjaGVmaWxlIGlzYXBpZmFrZWFzeW5jIGlzYXBpbG9nbm90c3VwcG9ydGVkIGlzYXBpcmVhZGFoZWFkYnVmZmVyIGtlZXBhbGl2ZSAnICtcbiAgICAgICAgJ2tlZXBhbGl2ZXRpbWVvdXQgbGFuZ3VhZ2Vwcmlvcml0eSBsZGFwY2FjaGVlbnRyaWVzIGxkYXBjYWNoZXR0bCAnICtcbiAgICAgICAgJ2xkYXBjb25uZWN0aW9udGltZW91dCBsZGFwb3BjYWNoZWVudHJpZXMgbGRhcG9wY2FjaGV0dGwgbGRhcHNoYXJlZGNhY2hlZmlsZSAnICtcbiAgICAgICAgJ2xkYXBzaGFyZWRjYWNoZXNpemUgbGRhcHRydXN0ZWRjbGllbnRjZXJ0IGxkYXB0cnVzdGVkZ2xvYmFsY2VydCBsZGFwdHJ1c3RlZG1vZGUgJyArXG4gICAgICAgICdsZGFwdmVyaWZ5c2VydmVyY2VydCBsaW1pdGludGVybmFscmVjdXJzaW9uIGxpbWl0cmVxdWVzdGJvZHkgbGltaXRyZXF1ZXN0ZmllbGRzICcgK1xuICAgICAgICAnbGltaXRyZXF1ZXN0ZmllbGRzaXplIGxpbWl0cmVxdWVzdGxpbmUgbGltaXR4bWxyZXF1ZXN0Ym9keSBsaXN0ZW4gbGlzdGVuYmFja2xvZyAnICtcbiAgICAgICAgJ2xvYWRmaWxlIGxvYWRtb2R1bGUgbG9ja2ZpbGUgbG9nZm9ybWF0IGxvZ2xldmVsIG1heGNsaWVudHMgbWF4a2VlcGFsaXZlcmVxdWVzdHMgJyArXG4gICAgICAgICdtYXhtZW1mcmVlIG1heHJlcXVlc3RzcGVyY2hpbGQgbWF4cmVxdWVzdHNwZXJ0aHJlYWQgbWF4c3BhcmVzZXJ2ZXJzIG1heHNwYXJldGhyZWFkcyAnICtcbiAgICAgICAgJ21heHRocmVhZHMgbWNhY2hlbWF4b2JqZWN0Y291bnQgbWNhY2hlbWF4b2JqZWN0c2l6ZSBtY2FjaGVtYXhzdHJlYW1pbmdidWZmZXIgJyArXG4gICAgICAgICdtY2FjaGVtaW5vYmplY3RzaXplIG1jYWNoZXJlbW92YWxhbGdvcml0aG0gbWNhY2hlc2l6ZSBtZXRhZGlyIG1ldGFmaWxlcyBtZXRhc3VmZml4ICcgK1xuICAgICAgICAnbWltZW1hZ2ljZmlsZSBtaW5zcGFyZXNlcnZlcnMgbWluc3BhcmV0aHJlYWRzIG1tYXBmaWxlIG1vZF9nemlwX29uICcgK1xuICAgICAgICAnbW9kX2d6aXBfYWRkX2hlYWRlcl9jb3VudCBtb2RfZ3ppcF9rZWVwX3dvcmtmaWxlcyBtb2RfZ3ppcF9kZWNodW5rICcgK1xuICAgICAgICAnbW9kX2d6aXBfbWluX2h0dHAgbW9kX2d6aXBfbWluaW11bV9maWxlX3NpemUgbW9kX2d6aXBfbWF4aW11bV9maWxlX3NpemUgJyArXG4gICAgICAgICdtb2RfZ3ppcF9tYXhpbXVtX2lubWVtX3NpemUgbW9kX2d6aXBfdGVtcF9kaXIgbW9kX2d6aXBfaXRlbV9pbmNsdWRlICcgK1xuICAgICAgICAnbW9kX2d6aXBfaXRlbV9leGNsdWRlIG1vZF9nemlwX2NvbW1hbmRfdmVyc2lvbiBtb2RfZ3ppcF9jYW5fbmVnb3RpYXRlICcgK1xuICAgICAgICAnbW9kX2d6aXBfaGFuZGxlX21ldGhvZHMgbW9kX2d6aXBfc3RhdGljX3N1ZmZpeCBtb2RfZ3ppcF9zZW5kX3ZhcnkgJyArXG4gICAgICAgICdtb2RfZ3ppcF91cGRhdGVfc3RhdGljIG1vZG1pbWV1c2VwYXRoaW5mbyBtdWx0aXZpZXdzbWF0Y2ggbmFtZXZpcnR1YWxob3N0IG5vcHJveHkgJyArXG4gICAgICAgICdud3NzbHRydXN0ZWRjZXJ0cyBud3NzbHVwZ3JhZGVhYmxlIG9wdGlvbnMgb3JkZXIgcGFzc2VudiBwaWRmaWxlIHByb3RvY29sZWNobyAnICtcbiAgICAgICAgJ3Byb3h5YmFkaGVhZGVyIHByb3h5YmxvY2sgcHJveHlkb21haW4gcHJveHllcnJvcm92ZXJyaWRlIHByb3h5ZnRwZGlyY2hhcnNldCAnICtcbiAgICAgICAgJ3Byb3h5aW9idWZmZXJzaXplIHByb3h5bWF4Zm9yd2FyZHMgcHJveHlwYXNzIHByb3h5cGFzc2ludGVycG9sYXRlZW52ICcgK1xuICAgICAgICAncHJveHlwYXNzbWF0Y2ggcHJveHlwYXNzcmV2ZXJzZSBwcm94eXBhc3NyZXZlcnNlY29va2llZG9tYWluICcgK1xuICAgICAgICAncHJveHlwYXNzcmV2ZXJzZWNvb2tpZXBhdGggcHJveHlwcmVzZXJ2ZWhvc3QgcHJveHlyZWNlaXZlYnVmZmVyc2l6ZSBwcm94eXJlbW90ZSAnICtcbiAgICAgICAgJ3Byb3h5cmVtb3RlbWF0Y2ggcHJveHlyZXF1ZXN0cyBwcm94eXNldCBwcm94eXN0YXR1cyBwcm94eXRpbWVvdXQgcHJveHl2aWEgJyArXG4gICAgICAgICdyZWFkbWVuYW1lIHJlY2VpdmVidWZmZXJzaXplIHJlZGlyZWN0IHJlZGlyZWN0bWF0Y2ggcmVkaXJlY3RwZXJtYW5lbnQgJyArXG4gICAgICAgICdyZWRpcmVjdHRlbXAgcmVtb3ZlY2hhcnNldCByZW1vdmVlbmNvZGluZyByZW1vdmVoYW5kbGVyIHJlbW92ZWlucHV0ZmlsdGVyICcgK1xuICAgICAgICAncmVtb3ZlbGFuZ3VhZ2UgcmVtb3Zlb3V0cHV0ZmlsdGVyIHJlbW92ZXR5cGUgcmVxdWVzdGhlYWRlciByZXF1aXJlIHJld3JpdGViYXNlICcgK1xuICAgICAgICAncmV3cml0ZWNvbmQgcmV3cml0ZWVuZ2luZSByZXdyaXRlbG9jayByZXdyaXRlbG9nIHJld3JpdGVsb2dsZXZlbCByZXdyaXRlbWFwICcgK1xuICAgICAgICAncmV3cml0ZW9wdGlvbnMgcmV3cml0ZXJ1bGUgcmxpbWl0Y3B1IHJsaW1pdG1lbSBybGltaXRucHJvYyBzYXRpc2Z5IHNjb3JlYm9hcmRmaWxlICcgK1xuICAgICAgICAnc2NyaXB0IHNjcmlwdGFsaWFzIHNjcmlwdGFsaWFzbWF0Y2ggc2NyaXB0aW50ZXJwcmV0ZXJzb3VyY2Ugc2NyaXB0bG9nICcgK1xuICAgICAgICAnc2NyaXB0bG9nYnVmZmVyIHNjcmlwdGxvZ2xlbmd0aCBzY3JpcHRzb2NrIHNlY3VyZWxpc3RlbiBzZWVyZXF1ZXN0dGFpbCAnICtcbiAgICAgICAgJ3NlbmRidWZmZXJzaXplIHNlcnZlcmFkbWluIHNlcnZlcmFsaWFzIHNlcnZlcmxpbWl0IHNlcnZlcm5hbWUgc2VydmVycGF0aCAnICtcbiAgICAgICAgJ3NlcnZlcnJvb3Qgc2VydmVyc2lnbmF0dXJlIHNlcnZlcnRva2VucyBzZXRlbnYgc2V0ZW52aWYgc2V0ZW52aWZub2Nhc2Ugc2V0aGFuZGxlciAnICtcbiAgICAgICAgJ3NldGlucHV0ZmlsdGVyIHNldG91dHB1dGZpbHRlciBzc2llbmFibGVhY2Nlc3Mgc3NpZW5kdGFnIHNzaWVycm9ybXNnIHNzaXN0YXJ0dGFnICcgK1xuICAgICAgICAnc3NpdGltZWZvcm1hdCBzc2l1bmRlZmluZWRlY2hvIHNzbGNhY2VydGlmaWNhdGVmaWxlIHNzbGNhY2VydGlmaWNhdGVwYXRoICcgK1xuICAgICAgICAnc3NsY2FkbnJlcXVlc3RmaWxlIHNzbGNhZG5yZXF1ZXN0cGF0aCBzc2xjYXJldm9jYXRpb25maWxlIHNzbGNhcmV2b2NhdGlvbnBhdGggJyArXG4gICAgICAgICdzc2xjZXJ0aWZpY2F0ZWNoYWluZmlsZSBzc2xjZXJ0aWZpY2F0ZWZpbGUgc3NsY2VydGlmaWNhdGVrZXlmaWxlIHNzbGNpcGhlcnN1aXRlICcgK1xuICAgICAgICAnc3NsY3J5cHRvZGV2aWNlIHNzbGVuZ2luZSBzc2xob25vcmNpcGVyb3JkZXIgc3NsbXV0ZXggc3Nsb3B0aW9ucyAnICtcbiAgICAgICAgJ3NzbHBhc3NwaHJhc2VkaWFsb2cgc3NscHJvdG9jb2wgc3NscHJveHljYWNlcnRpZmljYXRlZmlsZSAnICtcbiAgICAgICAgJ3NzbHByb3h5Y2FjZXJ0aWZpY2F0ZXBhdGggc3NscHJveHljYXJldm9jYXRpb25maWxlIHNzbHByb3h5Y2FyZXZvY2F0aW9ucGF0aCAnICtcbiAgICAgICAgJ3NzbHByb3h5Y2lwaGVyc3VpdGUgc3NscHJveHllbmdpbmUgc3NscHJveHltYWNoaW5lY2VydGlmaWNhdGVmaWxlICcgK1xuICAgICAgICAnc3NscHJveHltYWNoaW5lY2VydGlmaWNhdGVwYXRoIHNzbHByb3h5cHJvdG9jb2wgc3NscHJveHl2ZXJpZnkgJyArXG4gICAgICAgICdzc2xwcm94eXZlcmlmeWRlcHRoIHNzbHJhbmRvbXNlZWQgc3NscmVxdWlyZSBzc2xyZXF1aXJlc3NsIHNzbHNlc3Npb25jYWNoZSAnICtcbiAgICAgICAgJ3NzbHNlc3Npb25jYWNoZXRpbWVvdXQgc3NsdXNlcm5hbWUgc3NsdmVyaWZ5Y2xpZW50IHNzbHZlcmlmeWRlcHRoIHN0YXJ0c2VydmVycyAnICtcbiAgICAgICAgJ3N0YXJ0dGhyZWFkcyBzdWJzdGl0dXRlIHN1ZXhlY3VzZXJncm91cCB0aHJlYWRsaW1pdCB0aHJlYWRzcGVyY2hpbGQgJyArXG4gICAgICAgICd0aHJlYWRzdGFja3NpemUgdGltZW91dCB0cmFjZWVuYWJsZSB0cmFuc2ZlcmxvZyB0eXBlc2NvbmZpZyB1bnNldGVudiAnICtcbiAgICAgICAgJ3VzZWNhbm9uaWNhbG5hbWUgdXNlY2Fub25pY2FscGh5c2ljYWxwb3J0IHVzZXIgdXNlcmRpciB2aXJ0dWFsZG9jdW1lbnRyb290ICcgK1xuICAgICAgICAndmlydHVhbGRvY3VtZW50cm9vdGlwIHZpcnR1YWxzY3JpcHRhbGlhcyB2aXJ0dWFsc2NyaXB0YWxpYXNpcCAnICtcbiAgICAgICAgJ3dpbjMyZGlzYWJsZWFjY2VwdGV4IHhiaXRoYWNrJyxcbiAgICAgIGxpdGVyYWw6ICdvbiBvZmYnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3FicmFja2V0JyxcbiAgICAgICAgYmVnaW46ICdcXFxcc1xcXFxbJywgZW5kOiAnXFxcXF0kJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2JyYWNrZXQnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcJCVdXFxcXHsnLCBlbmQ6ICdcXFxcfScsXG4gICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBOVU1CRVJdXG4gICAgICB9LFxuICAgICAgTlVNQkVSLFxuICAgICAge2NsYXNzTmFtZTogJ3RhZycsIGJlZ2luOiAnPC8/JywgZW5kOiAnPid9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBTVFJJTkcgPSBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwge2lsbGVnYWw6ICcnfSk7XG4gIHZhciBUSVRMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgdmFyIFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFsnc2VsZicsIGhsanMuQ19OVU1CRVJfTU9ERSwgU1RSSU5HXVxuICB9O1xuICB2YXIgQ09NTUVOVFMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnXFxcXChcXFxcKicsIGVuZDogJ1xcXFwqXFxcXCknLFxuICAgICAgY29udGFpbnM6IFsnc2VsZicsIHtiZWdpbjogJy0tJywgZW5kOiAnJCd9XSAvL2FsbG93IG5lc3RpbmdcbiAgICB9LFxuICAgIGhsanMuSEFTSF9DT01NRU5UX01PREVcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYWJvdXQgYWJvdmUgYWZ0ZXIgYWdhaW5zdCBhbmQgYXJvdW5kIGFzIGF0IGJhY2sgYmVmb3JlIGJlZ2lubmluZyAnICtcbiAgICAgICAgJ2JlaGluZCBiZWxvdyBiZW5lYXRoIGJlc2lkZSBiZXR3ZWVuIGJ1dCBieSBjb25zaWRlcmluZyAnICtcbiAgICAgICAgJ2NvbnRhaW4gY29udGFpbnMgY29udGludWUgY29weSBkaXYgZG9lcyBlaWdodGggZWxzZSBlbmQgZXF1YWwgJyArXG4gICAgICAgICdlcXVhbHMgZXJyb3IgZXZlcnkgZXhpdCBmaWZ0aCBmaXJzdCBmb3IgZm91cnRoIGZyb20gZnJvbnQgJyArXG4gICAgICAgICdnZXQgZ2l2ZW4gZ2xvYmFsIGlmIGlnbm9yaW5nIGluIGludG8gaXMgaXQgaXRzIGxhc3QgbG9jYWwgbWUgJyArXG4gICAgICAgICdtaWRkbGUgbW9kIG15IG5pbnRoIG5vdCBvZiBvbiBvbnRvIG9yIG92ZXIgcHJvcCBwcm9wZXJ0eSBwdXQgcmVmICcgK1xuICAgICAgICAncmVmZXJlbmNlIHJlcGVhdCByZXR1cm5pbmcgc2NyaXB0IHNlY29uZCBzZXQgc2V2ZW50aCBzaW5jZSAnICtcbiAgICAgICAgJ3NpeHRoIHNvbWUgdGVsbCB0ZW50aCB0aGF0IHRoZSB0aGVuIHRoaXJkIHRocm91Z2ggdGhydSAnICtcbiAgICAgICAgJ3RpbWVvdXQgdGltZXMgdG8gdHJhbnNhY3Rpb24gdHJ5IHVudGlsIHdoZXJlIHdoaWxlIHdob3NlIHdpdGggJyArXG4gICAgICAgICd3aXRob3V0JyxcbiAgICAgIGNvbnN0YW50OlxuICAgICAgICAnQXBwbGVTY3JpcHQgZmFsc2UgbGluZWZlZWQgcmV0dXJuIHBpIHF1b3RlIHJlc3VsdCBzcGFjZSB0YWIgdHJ1ZScsXG4gICAgICB0eXBlOlxuICAgICAgICAnYWxpYXMgYXBwbGljYXRpb24gYm9vbGVhbiBjbGFzcyBjb25zdGFudCBkYXRlIGZpbGUgaW50ZWdlciBsaXN0ICcgK1xuICAgICAgICAnbnVtYmVyIHJlYWwgcmVjb3JkIHN0cmluZyB0ZXh0JyxcbiAgICAgIGNvbW1hbmQ6XG4gICAgICAgICdhY3RpdmF0ZSBiZWVwIGNvdW50IGRlbGF5IGxhdW5jaCBsb2cgb2Zmc2V0IHJlYWQgcm91bmQgJyArXG4gICAgICAgICdydW4gc2F5IHN1bW1hcml6ZSB3cml0ZScsXG4gICAgICBwcm9wZXJ0eTpcbiAgICAgICAgJ2NoYXJhY3RlciBjaGFyYWN0ZXJzIGNvbnRlbnRzIGRheSBmcm9udG1vc3QgaWQgaXRlbSBsZW5ndGggJyArXG4gICAgICAgICdtb250aCBuYW1lIHBhcmFncmFwaCBwYXJhZ3JhcGhzIHJlc3QgcmV2ZXJzZSBydW5uaW5nIHRpbWUgdmVyc2lvbiAnICtcbiAgICAgICAgJ3dlZWtkYXkgd29yZCB3b3JkcyB5ZWFyJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFNUUklORyxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJQT1NJWCBmaWxlXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tYW5kJyxcbiAgICAgICAgYmVnaW46XG4gICAgICAgICAgJ1xcXFxiKGNsaXBib2FyZCBpbmZvfHRoZSBjbGlwYm9hcmR8aW5mbyBmb3J8bGlzdCAoZGlza3N8Zm9sZGVyKXwnICtcbiAgICAgICAgICAnbW91bnQgdm9sdW1lfHBhdGggdG98KGNsb3NlfG9wZW4gZm9yKSBhY2Nlc3N8KGdldHxzZXQpIGVvZnwnICtcbiAgICAgICAgICAnY3VycmVudCBkYXRlfGRvIHNoZWxsIHNjcmlwdHxnZXQgdm9sdW1lIHNldHRpbmdzfHJhbmRvbSBudW1iZXJ8JyArXG4gICAgICAgICAgJ3NldCB2b2x1bWV8c3lzdGVtIGF0dHJpYnV0ZXxzeXN0ZW0gaW5mb3x0aW1lIHRvIEdNVHwnICtcbiAgICAgICAgICAnKGxvYWR8cnVufHN0b3JlKSBzY3JpcHR8c2NyaXB0aW5nIGNvbXBvbmVudHN8JyArXG4gICAgICAgICAgJ0FTQ0lJIChjaGFyYWN0ZXJ8bnVtYmVyKXxsb2NhbGl6ZWQgc3RyaW5nfCcgK1xuICAgICAgICAgICdjaG9vc2UgKGFwcGxpY2F0aW9ufGNvbG9yfGZpbGV8ZmlsZSBuYW1lfCcgK1xuICAgICAgICAgICdmb2xkZXJ8ZnJvbSBsaXN0fHJlbW90ZSBhcHBsaWNhdGlvbnxVUkwpfCcgK1xuICAgICAgICAgICdkaXNwbGF5IChhbGVydHxkaWFsb2cpKVxcXFxifF5cXFxccypyZXR1cm5cXFxcYidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbnN0YW50JyxcbiAgICAgICAgYmVnaW46XG4gICAgICAgICAgJ1xcXFxiKHRleHQgaXRlbSBkZWxpbWl0ZXJzfGN1cnJlbnQgYXBwbGljYXRpb258bWlzc2luZyB2YWx1ZSlcXFxcYidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIoYXBhcnQgZnJvbXxhc2lkZSBmcm9tfGluc3RlYWQgb2Z8b3V0IG9mfGdyZWF0ZXIgdGhhbnwnICtcbiAgICAgICAgICBcImlzbid0fChkb2Vzbid0fGRvZXMgbm90KSAoZXF1YWx8Y29tZSBiZWZvcmV8Y29tZSBhZnRlcnxjb250YWluKXxcIiArXG4gICAgICAgICAgJyhncmVhdGVyfGxlc3MpIHRoYW4oIG9yIGVxdWFsKT98KHN0YXJ0cz98ZW5kc3xiZWdpbnM/KSB3aXRofCcgK1xuICAgICAgICAgICdjb250YWluZWQgYnl8Y29tZXMgKGJlZm9yZXxhZnRlcil8YSAocmVmfHJlZmVyZW5jZSkpXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcm9wZXJ0eScsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYihQT1NJWCBwYXRofChkYXRlfHRpbWUpIHN0cmluZ3xxdW90ZWQgZm9ybSlcXFxcYidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uX3N0YXJ0JyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAga2V5d29yZHM6ICdvbicsXG4gICAgICAgIGlsbGVnYWw6ICdbJHs9O1xcXFxuXScsXG4gICAgICAgIGNvbnRhaW5zOiBbVElUTEUsIFBBUkFNU11cbiAgICAgIH1cbiAgICBdLmNvbmNhdChDT01NRU5UUylcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgLyogbW5lbW9uaWMgKi9cbiAgICAgICAgJ2FkYyBhZGQgYWRpdyBhbmQgYW5kaSBhc3IgYmNsciBibGQgYnJiYyBicmJzIGJyY2MgYnJjcyBicmVhayBicmVxIGJyZ2UgYnJoYyBicmhzICcgK1xuICAgICAgICAnYnJpZCBicmllIGJybG8gYnJsdCBicm1pIGJybmUgYnJwbCBicnNoIGJydGMgYnJ0cyBicnZjIGJydnMgYnNldCBic3QgY2FsbCBjYmkgY2JyICcgK1xuICAgICAgICAnY2xjIGNsaCBjbGkgY2xuIGNsciBjbHMgY2x0IGNsdiBjbHogY29tIGNwIGNwYyBjcGkgY3BzZSBkZWMgZWljYWxsIGVpam1wIGVscG0gZW9yICcgK1xuICAgICAgICAnZm11bCBmbXVscyBmbXVsc3UgaWNhbGwgaWptcCBpbiBpbmMgam1wIGxkIGxkZCBsZGkgbGRzIGxwbSBsc2wgbHNyIG1vdiBtb3Z3IG11bCAnICtcbiAgICAgICAgJ211bHMgbXVsc3UgbmVnIG5vcCBvciBvcmkgb3V0IHBvcCBwdXNoIHJjYWxsIHJldCByZXRpIHJqbXAgcm9sIHJvciBzYmMgc2JyIHNicmMgc2JycyAnICtcbiAgICAgICAgJ3NlYyBzZWggc2JpIHNiY2kgc2JpYyBzYmlzIHNiaXcgc2VpIHNlbiBzZXIgc2VzIHNldCBzZXYgc2V6IHNsZWVwIHNwbSBzdCBzdGQgc3RzIHN1YiAnICtcbiAgICAgICAgJ3N1Ymkgc3dhcCB0c3Qgd2RyJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAvKiBnZW5lcmFsIHB1cnBvc2UgcmVnaXN0ZXJzICovXG4gICAgICAgICdyMCByMSByMiByMyByNCByNSByNiByNyByOCByOSByMTAgcjExIHIxMiByMTMgcjE0IHIxNSByMTYgcjE3IHIxOCByMTkgcjIwIHIyMSByMjIgJyArXG4gICAgICAgICdyMjMgcjI0IHIyNSByMjYgcjI3IHIyOCByMjkgcjMwIHIzMSB4fDAgeGggeGwgeXwwIHloIHlsIHp8MCB6aCB6bCAnICtcbiAgICAgICAgLyogSU8gUmVnaXN0ZXJzIChBVE1lZ2ExMjgpICovXG4gICAgICAgICd1Y3NyMWMgdWRyMSB1Y3NyMWEgdWNzcjFiIHVicnIxbCB1YnJyMWggdWNzcjBjIHVicnIwaCB0Y2NyM2MgdGNjcjNhIHRjY3IzYiB0Y250M2ggJyArXG4gICAgICAgICd0Y250M2wgb2NyM2FoIG9jcjNhbCBvY3IzYmggb2NyM2JsIG9jcjNjaCBvY3IzY2wgaWNyM2ggaWNyM2wgZXRpbXNrIGV0aWZyIHRjY3IxYyAnICtcbiAgICAgICAgJ29jcjFjaCBvY3IxY2wgdHdjciB0d2RyIHR3YXIgdHdzciB0d2JyIG9zY2NhbCB4bWNyYSB4bWNyYiBlaWNyYSBzcG1jc3Igc3BtY3IgcG9ydGcgJyArXG4gICAgICAgICdkZHJnIHBpbmcgcG9ydGYgZGRyZiBzcmVnIHNwaCBzcGwgeGRpdiByYW1weiBlaWNyYiBlaW1zayBnaW1zayBnaWNyIGVpZnIgZ2lmciB0aW1zayAnICtcbiAgICAgICAgJ3RpZnIgbWN1Y3IgbWN1Y3NyIHRjY3IwIHRjbnQwIG9jcjAgYXNzciB0Y2NyMWEgdGNjcjFiIHRjbnQxaCB0Y250MWwgb2NyMWFoIG9jcjFhbCAnICtcbiAgICAgICAgJ29jcjFiaCBvY3IxYmwgaWNyMWggaWNyMWwgdGNjcjIgdGNudDIgb2NyMiBvY2RyIHdkdGNyIHNmaW9yIGVlYXJoIGVlYXJsIGVlZHIgZWVjciAnICtcbiAgICAgICAgJ3BvcnRhIGRkcmEgcGluYSBwb3J0YiBkZHJiIHBpbmIgcG9ydGMgZGRyYyBwaW5jIHBvcnRkIGRkcmQgcGluZCBzcGRyIHNwc3Igc3BjciB1ZHIwICcgK1xuICAgICAgICAndWNzcjBhIHVjc3IwYiB1YnJyMGwgYWNzciBhZG11eCBhZGNzciBhZGNoIGFkY2wgcG9ydGUgZGRyZSBwaW5lIHBpbmYnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtjbGFzc05hbWU6ICdjb21tZW50JywgYmVnaW46ICc7JywgIGVuZDogJyQnfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSwgLy8gMHguLi4sIGRlY2ltYWwsIGZsb2F0XG4gICAgICBobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSwgLy8gMGIuLi5cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihcXFxcJFthLXpBLVowLTldK3wwb1swLTddKyknIC8vICQuLi4sIDBvLi4uXG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdbXlxcXFxcXFxcXVxcJycsXG4gICAgICAgIGlsbGVnYWw6ICdbXlxcXFxcXFxcXVteXFwnXSdcbiAgICAgIH0sXG4gICAgICB7Y2xhc3NOYW1lOiAnbGFiZWwnLCAgYmVnaW46ICdeW0EtWmEtejAtOV8uJF0rOid9LFxuICAgICAge2NsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsIGJlZ2luOiAnIycsIGVuZDogJyQnfSxcbiAgICAgIHsgIC8vINC00LjRgNC10LrRgtC40LLRiyDCqy5pbmNsdWRlwrsgwqsubWFjcm/CuyDQuCDRgi7QtC5cbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdcXFxcLlthLXpBLVpdKydcbiAgICAgIH0sXG4gICAgICB7ICAvLyDQv9C+0LTRgdGC0LDQvdC+0LLQutCwINCyIMKrLm1hY3JvwrtcbiAgICAgICAgY2xhc3NOYW1lOiAnbG9jYWx2YXJzJyxcbiAgICAgICAgYmVnaW46ICdAWzAtOV0rJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6ICdmYWxzZSBpbnQgYWJzdHJhY3QgcHJpdmF0ZSBjaGFyIGludGVyZmFjZSBib29sZWFuIHN0YXRpYyBudWxsIGlmIGZvciB0cnVlICcgK1xuICAgICAgJ3doaWxlIGxvbmcgdGhyb3cgZmluYWxseSBwcm90ZWN0ZWQgZXh0ZW5kcyBmaW5hbCBpbXBsZW1lbnRzIHJldHVybiB2b2lkIGVudW0gZWxzZSAnICtcbiAgICAgICdicmVhayBuZXcgY2F0Y2ggYnl0ZSBzdXBlciBjbGFzcyBjYXNlIHNob3J0IGRlZmF1bHQgZG91YmxlIHB1YmxpYyB0cnkgdGhpcyBzd2l0Y2ggJyArXG4gICAgICAnY29udGludWUgcmV2ZXJzZSBmaXJzdGZhc3QgZmlyc3Rvbmx5IGZvcnVwZGF0ZSBub2ZldGNoIHN1bSBhdmcgbWlub2YgbWF4b2YgY291bnQgJyArXG4gICAgICAnb3JkZXIgZ3JvdXAgYnkgYXNjIGRlc2MgaW5kZXggaGludCBsaWtlIGRpc3BhbHkgZWRpdCBjbGllbnQgc2VydmVyIHR0c2JlZ2luICcgK1xuICAgICAgJ3R0c2NvbW1pdCBzdHIgcmVhbCBkYXRlIGNvbnRhaW5lciBhbnl0eXBlIGNvbW1vbiBkaXYgbW9kJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdpbmhlcml0YW5jZScsXG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBCQVNIX0xJVEVSQUwgPSAndHJ1ZSBmYWxzZSc7XG4gIHZhciBCQVNIX0tFWVdPUkQgPSAnaWYgdGhlbiBlbHNlIGVsaWYgZmkgZm9yIGJyZWFrIGNvbnRpbnVlIHdoaWxlIGluIGRvIGRvbmUgZWNobyBleGl0IHJldHVybiBzZXQgZGVjbGFyZSc7XG4gIHZhciBWQVIxID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdcXFxcJFthLXpBLVowLTlfI10rJ1xuICB9O1xuICB2YXIgVkFSMiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCR7KFtefV18XFxcXFxcXFx9KSt9J1xuICB9O1xuICB2YXIgUVVPVEVfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBWQVIxLCBWQVIyXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIEFQT1NfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgVEVTVF9DT05ESVRJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAndGVzdF9jb25kaXRpb24nLFxuICAgIGJlZ2luOiAnJywgZW5kOiAnJyxcbiAgICBjb250YWluczogW1FVT1RFX1NUUklORywgQVBPU19TVFJJTkcsIFZBUjEsIFZBUjJdLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBsaXRlcmFsOiBCQVNIX0xJVEVSQUxcbiAgICB9LFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6IEJBU0hfS0VZV09SRCxcbiAgICAgIGxpdGVyYWw6IEJBU0hfTElURVJBTFxuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hlYmFuZycsXG4gICAgICAgIGJlZ2luOiAnKCMhXFxcXC9iaW5cXFxcL2Jhc2gpfCgjIVxcXFwvYmluXFxcXC9zaCknLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgVkFSMSxcbiAgICAgIFZBUjIsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgUVVPVEVfU1RSSU5HLFxuICAgICAgQVBPU19TVFJJTkcsXG4gICAgICBobGpzLmluaGVyaXQoVEVTVF9DT05ESVRJT04sIHtiZWdpbjogJ1xcXFxbICcsIGVuZDogJyBcXFxcXScsIHJlbGV2YW5jZTogMH0pLFxuICAgICAgaGxqcy5pbmhlcml0KFRFU1RfQ09ORElUSU9OLCB7YmVnaW46ICdcXFxcW1xcXFxbICcsIGVuZDogJyBcXFxcXVxcXFxdJ30pXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpe1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1teXFxcXFtcXFxcXVxcXFwuLFxcXFwrXFxcXC08PiBcXHJcXG5dJyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgZW5kOiAnW1xcXFxbXFxcXF1cXFxcLixcXFxcK1xcXFwtPD4gXFxyXFxuXScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcW1xcXFxdXScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXC4sXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcK1xcXFwtXSdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIga2V5d29yZHMgPSB7XG4gICAgYnVpbHRfaW46XG4gICAgICAvLyBDbG9qdXJlIGtleXdvcmRzXG4gICAgICAnZGVmIGNvbmQgYXBwbHkgaWYtbm90IGlmLWxldCBpZiBub3Qgbm90PSA9ICZsdDsgPCA+ICZsdDs9IDw9ID49ID09ICsgLyAqIC0gcmVtICcrXG4gICAgICAncXVvdCBuZWc/IHBvcz8gZGVsYXk/IHN5bWJvbD8ga2V5d29yZD8gdHJ1ZT8gZmFsc2U/IGludGVnZXI/IGVtcHR5PyBjb2xsPyBsaXN0PyAnK1xuICAgICAgJ3NldD8gaWZuPyBmbj8gYXNzb2NpYXRpdmU/IHNlcXVlbnRpYWw/IHNvcnRlZD8gY291bnRlZD8gcmV2ZXJzaWJsZT8gbnVtYmVyPyBkZWNpbWFsPyAnK1xuICAgICAgJ2NsYXNzPyBkaXN0aW5jdD8gaXNhPyBmbG9hdD8gcmF0aW9uYWw/IHJlZHVjZWQ/IHJhdGlvPyBvZGQ/IGV2ZW4/IGNoYXI/IHNlcT8gdmVjdG9yPyAnK1xuICAgICAgJ3N0cmluZz8gbWFwPyBuaWw/IGNvbnRhaW5zPyB6ZXJvPyBpbnN0YW5jZT8gbm90LWV2ZXJ5PyBub3QtYW55PyBsaWJzcGVjPyAtPiAtPj4gLi4gLiAnK1xuICAgICAgJ2luYyBjb21wYXJlIGRvIGRvdGltZXMgbWFwY2F0IHRha2UgcmVtb3ZlIHRha2Utd2hpbGUgZHJvcCBsZXRmbiBkcm9wLWxhc3QgdGFrZS1sYXN0ICcrXG4gICAgICAnZHJvcC13aGlsZSB3aGlsZSBpbnRlcm4gY29uZHAgY2FzZSByZWR1Y2VkIGN5Y2xlIHNwbGl0LWF0IHNwbGl0LXdpdGggcmVwZWF0IHJlcGxpY2F0ZSAnK1xuICAgICAgJ2l0ZXJhdGUgcmFuZ2UgbWVyZ2UgemlwbWFwIGRlY2xhcmUgbGluZS1zZXEgc29ydCBjb21wYXJhdG9yIHNvcnQtYnkgZG9ydW4gZG9hbGwgbnRobmV4dCAnK1xuICAgICAgJ250aHJlc3QgcGFydGl0aW9uIGV2YWwgZG9zZXEgYXdhaXQgYXdhaXQtZm9yIGxldCBhZ2VudCBhdG9tIHNlbmQgc2VuZC1vZmYgcmVsZWFzZS1wZW5kaW5nLXNlbmRzICcrXG4gICAgICAnYWRkLXdhdGNoIG1hcHYgZmlsdGVydiByZW1vdmUtd2F0Y2ggYWdlbnQtZXJyb3IgcmVzdGFydC1hZ2VudCBzZXQtZXJyb3ItaGFuZGxlciBlcnJvci1oYW5kbGVyICcrXG4gICAgICAnc2V0LWVycm9yLW1vZGUhIGVycm9yLW1vZGUgc2h1dGRvd24tYWdlbnRzIHF1b3RlIHZhciBmbiBsb29wIHJlY3VyIHRocm93IHRyeSBtb25pdG9yLWVudGVyICcrXG4gICAgICAnbW9uaXRvci1leGl0IGRlZm1hY3JvIGRlZm4gZGVmbi0gbWFjcm9leHBhbmQgbWFjcm9leHBhbmQtMSBmb3IgZG9zZXEgZG9zeW5jIGRvdGltZXMgYW5kIG9yICcrXG4gICAgICAnd2hlbiB3aGVuLW5vdCB3aGVuLWxldCBjb21wIGp1eHQgcGFydGlhbCBzZXF1ZW5jZSBtZW1vaXplIGNvbnN0YW50bHkgY29tcGxlbWVudCBpZGVudGl0eSBhc3NlcnQgJytcbiAgICAgICdwZWVrIHBvcCBkb3RvIHByb3h5IGRlZnN0cnVjdCBmaXJzdCByZXN0IGNvbnMgZGVmcHJvdG9jb2wgY2FzdCBjb2xsIGRlZnR5cGUgZGVmcmVjb3JkIGxhc3QgYnV0bGFzdCAnK1xuICAgICAgJ3NpZ3MgcmVpZnkgc2Vjb25kIGZmaXJzdCBmbmV4dCBuZmlyc3Qgbm5leHQgZGVmbXVsdGkgZGVmbWV0aG9kIG1ldGEgd2l0aC1tZXRhIG5zIGluLW5zIGNyZWF0ZS1ucyBpbXBvcnQgJytcbiAgICAgICdpbnRlcm4gcmVmZXIga2V5cyBzZWxlY3Qta2V5cyB2YWxzIGtleSB2YWwgcnNlcSBuYW1lIG5hbWVzcGFjZSBwcm9taXNlIGludG8gdHJhbnNpZW50IHBlcnNpc3RlbnQhIGNvbmohICcrXG4gICAgICAnYXNzb2MhIGRpc3NvYyEgcG9wISBkaXNqISBpbXBvcnQgdXNlIGNsYXNzIHR5cGUgbnVtIGZsb2F0IGRvdWJsZSBzaG9ydCBieXRlIGJvb2xlYW4gYmlnaW50IGJpZ2ludGVnZXIgJytcbiAgICAgICdiaWdkZWMgcHJpbnQtbWV0aG9kIHByaW50LWR1cCB0aHJvdy1pZiB0aHJvdyBwcmludGYgZm9ybWF0IGxvYWQgY29tcGlsZSBnZXQtaW4gdXBkYXRlLWluIHByIHByLW9uIG5ld2xpbmUgJytcbiAgICAgICdmbHVzaCByZWFkIHNsdXJwIHJlYWQtbGluZSBzdWJ2ZWMgd2l0aC1vcGVuIG1lbWZuIHRpbWUgbnMgYXNzZXJ0IHJlLWZpbmQgcmUtZ3JvdXBzIHJhbmQtaW50IHJhbmQgbW9kIGxvY2tpbmcgJytcbiAgICAgICdhc3NlcnQtdmFsaWQtZmRlY2wgYWxpYXMgbmFtZXNwYWNlIHJlc29sdmUgcmVmIGRlcmVmIHJlZnNldCBzd2FwISByZXNldCEgc2V0LXZhbGlkYXRvciEgY29tcGFyZS1hbmQtc2V0ISBhbHRlci1tZXRhISAnK1xuICAgICAgJ3Jlc2V0LW1ldGEhIGNvbW11dGUgZ2V0LXZhbGlkYXRvciBhbHRlciByZWYtc2V0IHJlZi1oaXN0b3J5LWNvdW50IHJlZi1taW4taGlzdG9yeSByZWYtbWF4LWhpc3RvcnkgZW5zdXJlIHN5bmMgaW8hICcrXG4gICAgICAnbmV3IG5leHQgY29uaiBzZXQhIG1lbWZuIHRvLWFycmF5IGZ1dHVyZSBmdXR1cmUtY2FsbCBpbnRvLWFycmF5IGFzZXQgZ2VuLWNsYXNzIHJlZHVjZSBtZXJnZSBtYXAgZmlsdGVyIGZpbmQgZW1wdHkgJytcbiAgICAgICdoYXNoLW1hcCBoYXNoLXNldCBzb3J0ZWQtbWFwIHNvcnRlZC1tYXAtYnkgc29ydGVkLXNldCBzb3J0ZWQtc2V0LWJ5IHZlYyB2ZWN0b3Igc2VxIGZsYXR0ZW4gcmV2ZXJzZSBhc3NvYyBkaXNzb2MgbGlzdCAnK1xuICAgICAgJ2Rpc2ogZ2V0IHVuaW9uIGRpZmZlcmVuY2UgaW50ZXJzZWN0aW9uIGV4dGVuZCBleHRlbmQtdHlwZSBleHRlbmQtcHJvdG9jb2wgaW50IG50aCBkZWxheSBjb3VudCBjb25jYXQgY2h1bmsgY2h1bmstYnVmZmVyICcrXG4gICAgICAnY2h1bmstYXBwZW5kIGNodW5rLWZpcnN0IGNodW5rLXJlc3QgbWF4IG1pbiBkZWMgdW5jaGVja2VkLWluYy1pbnQgdW5jaGVja2VkLWluYyB1bmNoZWNrZWQtZGVjLWluYyB1bmNoZWNrZWQtZGVjIHVuY2hlY2tlZC1uZWdhdGUgJytcbiAgICAgICd1bmNoZWNrZWQtYWRkLWludCB1bmNoZWNrZWQtYWRkIHVuY2hlY2tlZC1zdWJ0cmFjdC1pbnQgdW5jaGVja2VkLXN1YnRyYWN0IGNodW5rLW5leHQgY2h1bmstY29ucyBjaHVua2VkLXNlcT8gcHJuIHZhcnktbWV0YSAnK1xuICAgICAgJ2xhenktc2VxIHNwcmVhZCBsaXN0KiBzdHIgZmluZC1rZXl3b3JkIGtleXdvcmQgc3ltYm9sIGdlbnN5bSBmb3JjZSByYXRpb25hbGl6ZSdcbiAgIH07XG5cbiAgdmFyIENMSl9JREVOVF9SRSA9ICdbYS16QS1aXzAtOVxcXFwhXFxcXC5cXFxcP1xcXFwtXFxcXCtcXFxcKlxcXFwvXFxcXDxcXFxcPVxcXFw+XFxcXCZcXFxcI1xcXFwkXFwnO10rJztcbiAgdmFyIFNJTVBMRV9OVU1CRVJfUkUgPSAnW1xcXFxzOlxcXFwoXFxcXHtdK1xcXFxkKyhcXFxcLlxcXFxkKyk/JztcblxuICB2YXIgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiBTSU1QTEVfTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnOycsIGVuZDogJyQnLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09MTEVDVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdjb2xsZWN0aW9uJyxcbiAgICBiZWdpbjogJ1tcXFxcW1xcXFx7XScsIGVuZDogJ1tcXFxcXVxcXFx9XSdcbiAgfTtcbiAgdmFyIEhJTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdcXFxcXicgKyBDTEpfSURFTlRfUkVcbiAgfTtcbiAgdmFyIEhJTlRfQ09MID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXFxcXF5cXFxceycsIGVuZDogJ1xcXFx9J1xuICB9O1xuICB2YXIgS0VZID0ge1xuICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgYmVnaW46ICdbOl0nICsgQ0xKX0lERU5UX1JFXG4gIH07XG4gIHZhciBMSVNUID0ge1xuICAgIGNsYXNzTmFtZTogJ2xpc3QnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBCT0RZID0ge1xuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7bGl0ZXJhbDogJ3RydWUgZmFsc2UgbmlsJ30sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBUSVRMRSA9IHtcbiAgICBrZXl3b3Jkczoga2V5d29yZHMsXG4gICAgbGV4ZW1zOiBDTEpfSURFTlRfUkUsXG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogQ0xKX0lERU5UX1JFLFxuICAgIHN0YXJ0czogQk9EWVxuICB9O1xuXG4gIExJU1QuY29udGFpbnMgPSBbe2NsYXNzTmFtZTogJ2NvbW1lbnQnLCBiZWdpbjogJ2NvbW1lbnQnfSwgVElUTEVdO1xuICBCT0RZLmNvbnRhaW5zID0gW0xJU1QsIFNUUklORywgSElOVCwgSElOVF9DT0wsIENPTU1FTlQsIEtFWSwgQ09MTEVDVElPTiwgTlVNQkVSXTtcbiAgQ09MTEVDVElPTi5jb250YWlucyA9IFtMSVNULCBTVFJJTkcsIEhJTlQsIENPTU1FTlQsIEtFWSwgQ09MTEVDVElPTiwgTlVNQkVSXTtcblxuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdcXFxcUycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIENPTU1FTlQsXG4gICAgICBMSVNUXG4gICAgXVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6ICdhZGRfY3VzdG9tX2NvbW1hbmQgYWRkX2N1c3RvbV90YXJnZXQgYWRkX2RlZmluaXRpb25zIGFkZF9kZXBlbmRlbmNpZXMgJyArXG4gICAgICAnYWRkX2V4ZWN1dGFibGUgYWRkX2xpYnJhcnkgYWRkX3N1YmRpcmVjdG9yeSBhZGRfdGVzdCBhdXhfc291cmNlX2RpcmVjdG9yeSAnICtcbiAgICAgICdicmVhayBidWlsZF9jb21tYW5kIGNtYWtlX21pbmltdW1fcmVxdWlyZWQgY21ha2VfcG9saWN5IGNvbmZpZ3VyZV9maWxlICcgK1xuICAgICAgJ2NyZWF0ZV90ZXN0X3NvdXJjZWxpc3QgZGVmaW5lX3Byb3BlcnR5IGVsc2UgZWxzZWlmIGVuYWJsZV9sYW5ndWFnZSBlbmFibGVfdGVzdGluZyAnICtcbiAgICAgICdlbmRmb3JlYWNoIGVuZGZ1bmN0aW9uIGVuZGlmIGVuZG1hY3JvIGVuZHdoaWxlIGV4ZWN1dGVfcHJvY2VzcyBleHBvcnQgZmluZF9maWxlICcgK1xuICAgICAgJ2ZpbmRfbGlicmFyeSBmaW5kX3BhY2thZ2UgZmluZF9wYXRoIGZpbmRfcHJvZ3JhbSBmbHRrX3dyYXBfdWkgZm9yZWFjaCBmdW5jdGlvbiAnICtcbiAgICAgICdnZXRfY21ha2VfcHJvcGVydHkgZ2V0X2RpcmVjdG9yeV9wcm9wZXJ0eSBnZXRfZmlsZW5hbWVfY29tcG9uZW50IGdldF9wcm9wZXJ0eSAnICtcbiAgICAgICdnZXRfc291cmNlX2ZpbGVfcHJvcGVydHkgZ2V0X3RhcmdldF9wcm9wZXJ0eSBnZXRfdGVzdF9wcm9wZXJ0eSBpZiBpbmNsdWRlICcgK1xuICAgICAgJ2luY2x1ZGVfZGlyZWN0b3JpZXMgaW5jbHVkZV9leHRlcm5hbF9tc3Byb2plY3QgaW5jbHVkZV9yZWd1bGFyX2V4cHJlc3Npb24gaW5zdGFsbCAnICtcbiAgICAgICdsaW5rX2RpcmVjdG9yaWVzIGxvYWRfY2FjaGUgbG9hZF9jb21tYW5kIG1hY3JvIG1hcmtfYXNfYWR2YW5jZWQgbWVzc2FnZSBvcHRpb24gJyArXG4gICAgICAnb3V0cHV0X3JlcXVpcmVkX2ZpbGVzIHByb2plY3QgcXRfd3JhcF9jcHAgcXRfd3JhcF91aSByZW1vdmVfZGVmaW5pdGlvbnMgcmV0dXJuICcgK1xuICAgICAgJ3NlcGFyYXRlX2FyZ3VtZW50cyBzZXQgc2V0X2RpcmVjdG9yeV9wcm9wZXJ0aWVzIHNldF9wcm9wZXJ0eSAnICtcbiAgICAgICdzZXRfc291cmNlX2ZpbGVzX3Byb3BlcnRpZXMgc2V0X3RhcmdldF9wcm9wZXJ0aWVzIHNldF90ZXN0c19wcm9wZXJ0aWVzIHNpdGVfbmFtZSAnICtcbiAgICAgICdzb3VyY2VfZ3JvdXAgc3RyaW5nIHRhcmdldF9saW5rX2xpYnJhcmllcyB0cnlfY29tcGlsZSB0cnlfcnVuIHVuc2V0IHZhcmlhYmxlX3dhdGNoICcgK1xuICAgICAgJ3doaWxlIGJ1aWxkX25hbWUgZXhlY19wcm9ncmFtIGV4cG9ydF9saWJyYXJ5X2RlcGVuZGVuY2llcyBpbnN0YWxsX2ZpbGVzICcgK1xuICAgICAgJ2luc3RhbGxfcHJvZ3JhbXMgaW5zdGFsbF90YXJnZXRzIGxpbmtfbGlicmFyaWVzIG1ha2VfZGlyZWN0b3J5IHJlbW92ZSBzdWJkaXJfZGVwZW5kcyAnICtcbiAgICAgICdzdWJkaXJzIHVzZV9tYW5nbGVkX21lc2EgdXRpbGl0eV9zb3VyY2UgdmFyaWFibGVfcmVxdWlyZXMgd3JpdGVfZmlsZScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW52dmFyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcJHsnLCBlbmQ6ICd9J1xuICAgICAgfSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgLy8gSlMga2V5d29yZHNcbiAgICAgICdpbiBpZiBmb3Igd2hpbGUgZmluYWxseSBuZXcgZG8gcmV0dXJuIGVsc2UgYnJlYWsgY2F0Y2ggaW5zdGFuY2VvZiB0aHJvdyB0cnkgdGhpcyAnICtcbiAgICAgICdzd2l0Y2ggY29udGludWUgdHlwZW9mIGRlbGV0ZSBkZWJ1Z2dlciBzdXBlciAnICtcbiAgICAgIC8vIENvZmZlZSBrZXl3b3Jkc1xuICAgICAgJ3RoZW4gdW5sZXNzIHVudGlsIGxvb3Agb2YgYnkgd2hlbiBhbmQgb3IgaXMgaXNudCBub3QnLFxuICAgIGxpdGVyYWw6XG4gICAgICAvLyBKUyBsaXRlcmFsc1xuICAgICAgJ3RydWUgZmFsc2UgbnVsbCB1bmRlZmluZWQgJyArXG4gICAgICAvLyBDb2ZmZWUgbGl0ZXJhbHNcbiAgICAgICd5ZXMgbm8gb24gb2ZmICcsXG4gICAgcmVzZXJ2ZWQ6ICdjYXNlIGRlZmF1bHQgZnVuY3Rpb24gdmFyIHZvaWQgd2l0aCBjb25zdCBsZXQgZW51bSBleHBvcnQgaW1wb3J0IG5hdGl2ZSAnICtcbiAgICAgICdfX2hhc1Byb3AgX19leHRlbmRzIF9fc2xpY2UgX19iaW5kIF9faW5kZXhPZidcbiAgfTtcbiAgdmFyIEpTX0lERU5UX1JFID0gJ1tBLVphLXokX11bMC05QS1aYS16JF9dKic7XG4gIHZhciBUSVRMRSA9IHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBKU19JREVOVF9SRX07XG4gIHZhciBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICcjXFxcXHsnLCBlbmQ6ICd9JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSwgaGxqcy5DX05VTUJFUl9NT0RFXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBOdW1iZXJzXG4gICAgICBobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIC8vIFN0cmluZ3NcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIlwiXCInLCBlbmQ6ICdcIlwiXCInLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgU1VCU1RdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgU1VCU1RdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBDb21tZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICcjIyMnLCBlbmQ6ICcjIyMnXG4gICAgICB9LFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46ICcvLy8nLCBlbmQ6ICcvLy8nLFxuICAgICAgICBjb250YWluczogW2hsanMuSEFTSF9DT01NRU5UX01PREVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLCBiZWdpbjogJy8vW2dpbV0qJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46ICcvXFxcXFMoXFxcXFxcXFwufFteXFxcXG5dKSovW2dpbV0qJyAvLyBcXFMgaXMgcmVxdWlyZWQgdG8gcGFyc2UgeCAvIDIgLyAzIGFzIHR3byBkaXZpc2lvbnNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAnamF2YXNjcmlwdCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46IEpTX0lERU5UX1JFICsgJ1xcXFxzKj1cXFxccyooXFxcXCguK1xcXFwpKT9cXFxccypbLT1dPicsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGtleXdvcmRzOiAnY2xhc3MnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGtleXdvcmRzOiAnZXh0ZW5kcycsXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbVElUTEVdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUSVRMRVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcm9wZXJ0eScsXG4gICAgICAgIGJlZ2luOiAnQCcgKyBKU19JREVOVF9SRVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBDUFBfS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDogJ2ZhbHNlIGludCBmbG9hdCB3aGlsZSBwcml2YXRlIGNoYXIgY2F0Y2ggZXhwb3J0IHZpcnR1YWwgb3BlcmF0b3Igc2l6ZW9mICcgK1xuICAgICAgJ2R5bmFtaWNfY2FzdHwxMCB0eXBlZGVmIGNvbnN0X2Nhc3R8MTAgY29uc3Qgc3RydWN0IGZvciBzdGF0aWNfY2FzdHwxMCB1bmlvbiBuYW1lc3BhY2UgJyArXG4gICAgICAndW5zaWduZWQgbG9uZyB0aHJvdyB2b2xhdGlsZSBzdGF0aWMgcHJvdGVjdGVkIGJvb2wgdGVtcGxhdGUgbXV0YWJsZSBpZiBwdWJsaWMgZnJpZW5kICcgK1xuICAgICAgJ2RvIHJldHVybiBnb3RvIGF1dG8gdm9pZCBlbnVtIGVsc2UgYnJlYWsgbmV3IGV4dGVybiB1c2luZyB0cnVlIGNsYXNzIGFzbSBjYXNlIHR5cGVpZCAnICtcbiAgICAgICdzaG9ydCByZWludGVycHJldF9jYXN0fDEwIGRlZmF1bHQgZG91YmxlIHJlZ2lzdGVyIGV4cGxpY2l0IHNpZ25lZCB0eXBlbmFtZSB0cnkgdGhpcyAnICtcbiAgICAgICdzd2l0Y2ggY29udGludWUgd2NoYXJfdCBpbmxpbmUgZGVsZXRlIGFsaWdub2YgY2hhcjE2X3QgY2hhcjMyX3QgY29uc3RleHByIGRlY2x0eXBlICcgK1xuICAgICAgJ25vZXhjZXB0IG51bGxwdHIgc3RhdGljX2Fzc2VydCB0aHJlYWRfbG9jYWwgcmVzdHJpY3QgX0Jvb2wgY29tcGxleCcsXG4gICAgYnVpbHRfaW46ICdzdGQgc3RyaW5nIGNpbiBjb3V0IGNlcnIgY2xvZyBzdHJpbmdzdHJlYW0gaXN0cmluZ3N0cmVhbSBvc3RyaW5nc3RyZWFtICcgK1xuICAgICAgJ2F1dG9fcHRyIGRlcXVlIGxpc3QgcXVldWUgc3RhY2sgdmVjdG9yIG1hcCBzZXQgYml0c2V0IG11bHRpc2V0IG11bHRpbWFwIHVub3JkZXJlZF9zZXQgJyArXG4gICAgICAndW5vcmRlcmVkX21hcCB1bm9yZGVyZWRfbXVsdGlzZXQgdW5vcmRlcmVkX211bHRpbWFwIGFycmF5IHNoYXJlZF9wdHInXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCdcXFxcXFxcXD8uJywgZW5kOiAnXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJy4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKFxcXFxkKyhcXFxcLlxcXFxkKik/fFxcXFwuXFxcXGQrKSh1fFV8bHxMfHVsfFVMfGZ8RiknXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RsX2NvbnRhaW5lcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoZGVxdWV8bGlzdHxxdWV1ZXxzdGFja3x2ZWN0b3J8bWFwfHNldHxiaXRzZXR8bXVsdGlzZXR8bXVsdGltYXB8dW5vcmRlcmVkX21hcHx1bm9yZGVyZWRfc2V0fHVub3JkZXJlZF9tdWx0aXNldHx1bm9yZGVyZWRfbXVsdGltYXB8YXJyYXkpXFxcXHMqPCcsIGVuZDogJz4nLFxuICAgICAgICBrZXl3b3JkczogQ1BQX0tFWVdPUkRTLFxuICAgICAgICByZWxldmFuY2U6IDEwLFxuICAgICAgICBjb250YWluczogWydzZWxmJ11cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgLy8gTm9ybWFsIGtleXdvcmRzLlxuICAgICAgJ2Fic3RyYWN0IGFzIGJhc2UgYm9vbCBicmVhayBieXRlIGNhc2UgY2F0Y2ggY2hhciBjaGVja2VkIGNsYXNzIGNvbnN0IGNvbnRpbnVlIGRlY2ltYWwgJyArXG4gICAgICAnZGVmYXVsdCBkZWxlZ2F0ZSBkbyBkb3VibGUgZWxzZSBlbnVtIGV2ZW50IGV4cGxpY2l0IGV4dGVybiBmYWxzZSBmaW5hbGx5IGZpeGVkIGZsb2F0ICcgK1xuICAgICAgJ2ZvciBmb3JlYWNoIGdvdG8gaWYgaW1wbGljaXQgaW4gaW50IGludGVyZmFjZSBpbnRlcm5hbCBpcyBsb2NrIGxvbmcgbmFtZXNwYWNlIG5ldyBudWxsICcgK1xuICAgICAgJ29iamVjdCBvcGVyYXRvciBvdXQgb3ZlcnJpZGUgcGFyYW1zIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyByZWFkb25seSByZWYgcmV0dXJuIHNieXRlICcgK1xuICAgICAgJ3NlYWxlZCBzaG9ydCBzaXplb2Ygc3RhY2thbGxvYyBzdGF0aWMgc3RyaW5nIHN0cnVjdCBzd2l0Y2ggdGhpcyB0aHJvdyB0cnVlIHRyeSB0eXBlb2YgJyArXG4gICAgICAndWludCB1bG9uZyB1bmNoZWNrZWQgdW5zYWZlIHVzaG9ydCB1c2luZyB2aXJ0dWFsIHZvbGF0aWxlIHZvaWQgd2hpbGUgJyArXG4gICAgICAvLyBDb250ZXh0dWFsIGtleXdvcmRzLlxuICAgICAgJ2FzY2VuZGluZyBkZXNjZW5kaW5nIGZyb20gZ2V0IGdyb3VwIGludG8gam9pbiBsZXQgb3JkZXJieSBwYXJ0aWFsIHNlbGVjdCBzZXQgdmFsdWUgdmFyICcrXG4gICAgICAnd2hlcmUgeWllbGQnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy8vLycsIGVuZDogJyQnLCByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd4bWxEb2NUYWcnLFxuICAgICAgICAgICAgYmVnaW46ICcvLy98PCEtLXwtLT4nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd4bWxEb2NUYWcnLFxuICAgICAgICAgICAgYmVnaW46ICc8Lz8nLCBlbmQ6ICc+J1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2lmIGVsc2UgZWxpZiBlbmRpZiBkZWZpbmUgdW5kZWYgd2FybmluZyBlcnJvciBsaW5lIHJlZ2lvbiBlbmRyZWdpb24gcHJhZ21hIGNoZWNrc3VtJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdAXCInLCBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXCJcIid9XVxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luOiBobGpzLklERU5UX1JFICsgJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5OVU1CRVJfTU9ERSwgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgaWxsZWdhbDogJ1s9L3xcXCddJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaWQnLCBiZWdpbjogJ1xcXFwjW0EtWmEtejAtOV8tXSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsIGJlZ2luOiAnXFxcXC5bQS1aYS16MC05Xy1dKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cl9zZWxlY3RvcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICAgIGlsbGVnYWw6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHNldWRvJyxcbiAgICAgICAgYmVnaW46ICc6KDopP1thLXpBLVowLTlcXFxcX1xcXFwtXFxcXCtcXFxcKFxcXFwpXFxcXFwiXFxcXFxcJ10rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXRfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnQChmb250LWZhY2V8cGFnZSknLFxuICAgICAgICBsZXhlbXM6ICdbYS16LV0rJyxcbiAgICAgICAga2V5d29yZHM6ICdmb250LWZhY2UgcGFnZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0X3J1bGUnLFxuICAgICAgICBiZWdpbjogJ0AnLCBlbmQ6ICdbeztdJywgLy8gYXRfcnVsZSBlYXRpbmcgZmlyc3QgXCJ7XCIgaXMgYSBnb29kIHRoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGl0IGRvZXNu4oCZdCBsZXQgaXQgdG8gYmUgcGFyc2VkIGFzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhIHJ1bGUgc2V0IGJ1dCBpbnN0ZWFkIGRyb3BzIHBhcnNlciBpbnRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGVmYXVsdCBtb2RlIHdoaWNoIGlzIGhvdyBpdCBzaG91bGQgYmUuXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGtleXdvcmRzOiAnaW1wb3J0IHBhZ2UgbWVkaWEgY2hhcnNldCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgRlVOQ1RJT04sXG4gICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJywgYmVnaW46IGhsanMuSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncnVsZXMnLFxuICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICAgICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncnVsZScsXG4gICAgICAgICAgICBiZWdpbjogJ1teXFxcXHNdJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJzsnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAnW0EtWlxcXFxfXFxcXC5cXFxcLV0rJywgZW5kOiAnOicsXG4gICAgICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgICAgICAgICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAgICAgICBGVU5DVElPTixcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaGV4Y29sb3InLCBiZWdpbjogJ1xcXFwjWzAtOUEtRl0rJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaW1wb3J0YW50JywgYmVnaW46ICchaW1wb3J0YW50J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IC8qKlxuICogS25vd24gaXNzdWVzOlxuICpcbiAqIC0gaW52YWxpZCBoZXggc3RyaW5nIGxpdGVyYWxzIHdpbGwgYmUgcmVjb2duaXplZCBhcyBhIGRvdWJsZSBxdW90ZWQgc3RyaW5nc1xuICogICBidXQgJ3gnIGF0IHRoZSBiZWdpbm5pbmcgb2Ygc3RyaW5nIHdpbGwgbm90IGJlIG1hdGNoZWRcbiAqXG4gKiAtIGRlbGltaXRlZCBzdHJpbmcgbGl0ZXJhbHMgYXJlIG5vdCBjaGVja2VkIGZvciBtYXRjaGluZyBlbmQgZGVsaW1pdGVyXG4gKiAgIChub3QgcG9zc2libGUgdG8gZG8gd2l0aCBqcyByZWdleHApXG4gKlxuICogLSBjb250ZW50IG9mIHRva2VuIHN0cmluZyBpcyBjb2xvcmVkIGFzIGEgc3RyaW5nIChpLmUuIG5vIGtleXdvcmQgY29sb3JpbmcgaW5zaWRlIGEgdG9rZW4gc3RyaW5nKVxuICogICBhbHNvLCBjb250ZW50IG9mIHRva2VuIHN0cmluZyBpcyBub3QgdmFsaWRhdGVkIHRvIGNvbnRhaW4gb25seSB2YWxpZCBEIHRva2Vuc1xuICpcbiAqIC0gc3BlY2lhbCB0b2tlbiBzZXF1ZW5jZSBydWxlIGlzIG5vdCBzdHJpY3RseSBmb2xsb3dpbmcgRCBncmFtbWFyIChhbnl0aGluZyBmb2xsb3dpbmcgI2xpbmVcbiAqICAgdXAgdG8gdGhlIGVuZCBvZiBsaW5lIGlzIG1hdGNoZWQgYXMgc3BlY2lhbCB0b2tlbiBzZXF1ZW5jZSlcbiAqL1xuXG5mdW5jdGlvbihobGpzKSB7XG5cblx0LyoqXG5cdCAqIExhbmd1YWdlIGtleXdvcmRzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9LRVlXT1JEUyA9IHtcblx0XHRrZXl3b3JkOlxuXHRcdFx0J2Fic3RyYWN0IGFsaWFzIGFsaWduIGFzbSBhc3NlcnQgYXV0byBib2R5IGJyZWFrIGJ5dGUgY2FzZSBjYXN0IGNhdGNoIGNsYXNzICcgK1xuXHRcdFx0J2NvbnN0IGNvbnRpbnVlIGRlYnVnIGRlZmF1bHQgZGVsZXRlIGRlcHJlY2F0ZWQgZG8gZWxzZSBlbnVtIGV4cG9ydCBleHRlcm4gZmluYWwgJyArXG5cdFx0XHQnZmluYWxseSBmb3IgZm9yZWFjaCBmb3JlYWNoX3JldmVyc2V8MTAgZ290byBpZiBpbW11dGFibGUgaW1wb3J0IGluIGlub3V0IGludCAnICtcblx0XHRcdCdpbnRlcmZhY2UgaW52YXJpYW50IGlzIGxhenkgbWFjcm8gbWl4aW4gbW9kdWxlIG5ldyBub3Rocm93IG91dCBvdmVycmlkZSBwYWNrYWdlICcgK1xuXHRcdFx0J3ByYWdtYSBwcml2YXRlIHByb3RlY3RlZCBwdWJsaWMgcHVyZSByZWYgcmV0dXJuIHNjb3BlIHNoYXJlZCBzdGF0aWMgc3RydWN0ICcgK1xuXHRcdFx0J3N1cGVyIHN3aXRjaCBzeW5jaHJvbml6ZWQgdGVtcGxhdGUgdGhpcyB0aHJvdyB0cnkgdHlwZWRlZiB0eXBlaWQgdHlwZW9mIHVuaW9uICcgK1xuXHRcdFx0J3VuaXR0ZXN0IHZlcnNpb24gdm9pZCB2b2xhdGlsZSB3aGlsZSB3aXRoIF9fRklMRV9fIF9fTElORV9fIF9fZ3NoYXJlZHwxMCAnICtcblx0XHRcdCdfX3RocmVhZCBfX3RyYWl0cyBfX0RBVEVfXyBfX0VPRl9fIF9fVElNRV9fIF9fVElNRVNUQU1QX18gX19WRU5ET1JfXyBfX1ZFUlNJT05fXycsXG5cdFx0YnVpbHRfaW46XG5cdFx0XHQnYm9vbCBjZG91YmxlIGNlbnQgY2Zsb2F0IGNoYXIgY3JlYWwgZGNoYXIgZGVsZWdhdGUgZG91YmxlIGRzdHJpbmcgZmxvYXQgZnVuY3Rpb24gJyArXG5cdFx0XHQnaWRvdWJsZSBpZmxvYXQgaXJlYWwgbG9uZyByZWFsIHNob3J0IHN0cmluZyB1Ynl0ZSB1Y2VudCB1aW50IHVsb25nIHVzaG9ydCB3Y2hhciAnICtcblx0XHRcdCd3c3RyaW5nJyxcblx0XHRsaXRlcmFsOlxuXHRcdFx0J2ZhbHNlIG51bGwgdHJ1ZSdcblx0fTtcblxuXHQvKipcblx0ICogTnVtYmVyIGxpdGVyYWwgcmVnZXhwc1xuXHQgKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dmFyIGRlY2ltYWxfaW50ZWdlcl9yZSA9ICcoMHxbMS05XVtcXFxcZF9dKiknLFxuXHRcdGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSA9ICcoMHxbMS05XVtcXFxcZF9dKnxcXFxcZFtcXFxcZF9dKnxbXFxcXGRfXSs/XFxcXGQpJyxcblx0XHRiaW5hcnlfaW50ZWdlcl9yZSA9ICcwW2JCXVswMV9dKycsXG5cdFx0aGV4YWRlY2ltYWxfZGlnaXRzX3JlID0gJyhbXFxcXGRhLWZBLUZdW1xcXFxkYS1mQS1GX10qfF9bXFxcXGRhLWZBLUZdW1xcXFxkYS1mQS1GX10qKScsXG5cdFx0aGV4YWRlY2ltYWxfaW50ZWdlcl9yZSA9ICcwW3hYXScgKyBoZXhhZGVjaW1hbF9kaWdpdHNfcmUsXG5cblx0XHRkZWNpbWFsX2V4cG9uZW50X3JlID0gJyhbZUVdWystXT8nICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgJyknLFxuXHRcdGRlY2ltYWxfZmxvYXRfcmUgPSAnKCcgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyAnKFxcXFwuXFxcXGQqfCcgKyBkZWNpbWFsX2V4cG9uZW50X3JlICsgJyl8JyArXG5cdFx0XHRcdFx0XHRcdFx0J1xcXFxkK1xcXFwuJyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICd8JyArXG5cdFx0XHRcdFx0XHRcdFx0J1xcXFwuJyArIGRlY2ltYWxfaW50ZWdlcl9yZSArIGRlY2ltYWxfZXhwb25lbnRfcmUgKyAnPycgK1xuXHRcdFx0XHRcdFx0XHQnKScsXG5cdFx0aGV4YWRlY2ltYWxfZmxvYXRfcmUgPSAnKDBbeFhdKCcgK1xuXHRcdFx0XHRcdFx0XHRcdFx0aGV4YWRlY2ltYWxfZGlnaXRzX3JlICsgJ1xcXFwuJyArIGhleGFkZWNpbWFsX2RpZ2l0c19yZSArICd8Jytcblx0XHRcdFx0XHRcdFx0XHRcdCdcXFxcLj8nICsgaGV4YWRlY2ltYWxfZGlnaXRzX3JlICtcblx0XHRcdFx0XHRcdFx0ICAgJylbcFBdWystXT8nICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgJyknLFxuXG5cdFx0aW50ZWdlcl9yZSA9ICcoJyArXG5cdFx0XHRkZWNpbWFsX2ludGVnZXJfcmUgKyAnfCcgK1xuXHRcdFx0YmluYXJ5X2ludGVnZXJfcmUgICsgJ3wnICtcblx0XHQgXHRoZXhhZGVjaW1hbF9pbnRlZ2VyX3JlICAgK1xuXHRcdCcpJyxcblxuXHRcdGZsb2F0X3JlID0gJygnICtcblx0XHRcdGhleGFkZWNpbWFsX2Zsb2F0X3JlICsgJ3wnICtcblx0XHRcdGRlY2ltYWxfZmxvYXRfcmUgICtcblx0XHQnKSc7XG5cblx0LyoqXG5cdCAqIEVzY2FwZSBzZXF1ZW5jZSBzdXBwb3J0ZWQgaW4gRCBzdHJpbmcgYW5kIGNoYXJhY3RlciBsaXRlcmFsc1xuXHQgKlxuXHQgKiBAdHlwZSB7U3RyaW5nfVxuXHQgKi9cblx0dmFyIGVzY2FwZV9zZXF1ZW5jZV9yZSA9ICdcXFxcXFxcXCgnICtcblx0XHRcdFx0XHRcdFx0J1tcXCdcIlxcXFw/XFxcXFxcXFxhYmZucnR2XXwnICtcdC8vIGNvbW1vbiBlc2NhcGVzXG5cdFx0XHRcdFx0XHRcdCd1W1xcXFxkQS1GYS1mXXs0fXwnICsgXHRcdC8vIGZvdXIgaGV4IGRpZ2l0IHVuaWNvZGUgY29kZXBvaW50XG5cdFx0XHRcdFx0XHRcdCdbMC03XXsxLDN9fCcgKyBcdFx0XHQvLyBvbmUgdG8gdGhyZWUgb2N0YWwgZGlnaXQgYXNjaWkgY2hhciBjb2RlXG5cdFx0XHRcdFx0XHRcdCd4W1xcXFxkQS1GYS1mXXsyfXwnICtcdFx0Ly8gdHdvIGhleCBkaWdpdCBhc2NpaSBjaGFyIGNvZGVcblx0XHRcdFx0XHRcdFx0J1VbXFxcXGRBLUZhLWZdezh9JyArXHRcdFx0Ly8gZWlnaHQgaGV4IGRpZ2l0IHVuaWNvZGUgY29kZXBvaW50XG5cdFx0XHRcdFx0XHQgICcpfCcgK1xuXHRcdFx0XHRcdFx0ICAnJlthLXpBLVpcXFxcZF17Mix9Oyc7XHRcdFx0Ly8gbmFtZWQgY2hhcmFjdGVyIGVudGl0eVxuXG5cblx0LyoqXG5cdCAqIEQgaW50ZWdlciBudW1iZXIgbGl0ZXJhbHNcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0lOVEVHRVJfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIFx0YmVnaW46ICdcXFxcYicgKyBpbnRlZ2VyX3JlICsgJyhMfHV8VXxMdXxMVXx1THxVTCk/JyxcbiAgICBcdHJlbGV2YW5jZTogMFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBbRF9GTE9BVF9NT0RFIGRlc2NyaXB0aW9uXVxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfRkxPQVRfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdudW1iZXInLFxuXHRcdGJlZ2luOiAnXFxcXGIoJyArXG5cdFx0XHRcdGZsb2F0X3JlICsgJyhbZkZdfEx8aXxbZkZdaXxMaSk/fCcgK1xuXHRcdFx0XHRpbnRlZ2VyX3JlICsgJyhpfFtmRl1pfExpKScgK1xuXHRcdFx0JyknLFxuXHRcdHJlbGV2YW5jZTogMFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGNoYXJhY3RlciBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9DSEFSQUNURVJfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnXFwnKCcgKyBlc2NhcGVfc2VxdWVuY2VfcmUgKyAnfC4pJywgZW5kOiAnXFwnJyxcblx0XHRpbGxlZ2FsOiAnLidcblx0fTtcblxuXHQvKipcblx0ICogRCBzdHJpbmcgZXNjYXBlIHNlcXVlbmNlXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9FU0NBUEVfU0VRVUVOQ0UgPSB7XG5cdFx0YmVnaW46IGVzY2FwZV9zZXF1ZW5jZV9yZSxcblx0XHRyZWxldmFuY2U6IDBcblx0fVxuXG5cdC8qKlxuXHQgKiBEIGRvdWJsZSBxdW90ZWQgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdcIicsXG5cdFx0Y29udGFpbnM6IFtEX0VTQ0FQRV9TRVFVRU5DRV0sXG5cdFx0ZW5kOiAnXCJbY3dkXT8nLFxuXHRcdHJlbGV2YW5jZTogMFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIHd5c2l3eWcgYW5kIGRlbGltaXRlZCBzdHJpbmcgbGl0ZXJhbHNcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX1dZU0lXWUdfREVMSU1JVEVEX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdbcnFdXCInLFxuXHRcdGVuZDogJ1wiW2N3ZF0/Jyxcblx0XHRyZWxldmFuY2U6IDVcblx0fTtcblxuXHQvKipcblx0ICogRCBhbHRlcm5hdGUgd3lzaXd5ZyBzdHJpbmcgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfQUxURVJOQVRFX1dZU0lXWUdfU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ2AnLFxuXHRcdGVuZDogJ2BbY3dkXT8nXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgaGV4YWRlY2ltYWwgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0hFWF9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAneFwiW1xcXFxkYS1mQS1GXFxcXHNcXFxcblxcXFxyXSpcIltjd2RdPycsXG5cdFx0cmVsZXZhbmNlOiAxMFxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGRlbGltaXRlZCBzdHJpbmcgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfVE9LRU5fU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ3FcIlxcXFx7Jyxcblx0XHRlbmQ6ICdcXFxcfVwiJ1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBIYXNoYmFuZyBzdXBwb3J0XG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9IQVNIQkFOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3NoZWJhbmcnLFxuXHRcdGJlZ2luOiAnXiMhJyxcblx0XHRlbmQ6ICckJyxcblx0XHRyZWxldmFuY2U6IDVcblx0fTtcblxuXHQvKipcblx0ICogRCBzcGVjaWFsIHRva2VuIHNlcXVlbmNlXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9TUEVDSUFMX1RPS0VOX1NFUVVFTkNFX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcblx0XHRiZWdpbjogJyMobGluZSknLFxuXHRcdGVuZDogJyQnLFxuXHRcdHJlbGV2YW5jZTogNVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGF0dHJpYnV0ZXNcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0FUVFJJQlVURV9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuXHRcdGJlZ2luOiAnQFthLXpBLVpfXVthLXpBLVpfXFxcXGRdKidcblx0fTtcblxuXHQvKipcblx0ICogRCBuZXN0aW5nIGNvbW1lbnRcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX05FU1RJTkdfQ09NTUVOVF9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuXHRcdGJlZ2luOiAnXFxcXC9cXFxcKycsXG5cdFx0Y29udGFpbnM6IFsnc2VsZiddLFxuXHRcdGVuZDogJ1xcXFwrXFxcXC8nLFxuXHRcdHJlbGV2YW5jZTogMTBcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bGV4ZW1zOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG5cdFx0a2V5d29yZHM6IERfS0VZV09SRFMsXG5cdFx0Y29udGFpbnM6IFtcblx0XHRcdGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgXHRcdFx0aGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgXHRcdFx0RF9ORVNUSU5HX0NPTU1FTlRfTU9ERSxcbiAgXHRcdFx0RF9IRVhfU1RSSU5HX01PREUsXG4gIFx0XHRcdERfU1RSSU5HX01PREUsXG4gIFx0XHRcdERfV1lTSVdZR19ERUxJTUlURURfU1RSSU5HX01PREUsXG4gIFx0XHRcdERfQUxURVJOQVRFX1dZU0lXWUdfU1RSSU5HX01PREUsXG4gIFx0XHRcdERfVE9LRU5fU1RSSU5HX01PREUsXG4gIFx0XHRcdERfRkxPQVRfTU9ERSxcbiAgXHRcdFx0RF9JTlRFR0VSX01PREUsXG4gIFx0XHRcdERfQ0hBUkFDVEVSX01PREUsXG4gIFx0XHRcdERfSEFTSEJBTkdfTU9ERSxcbiAgXHRcdFx0RF9TUEVDSUFMX1RPS0VOX1NFUVVFTkNFX01PREUsXG4gIFx0XHRcdERfQVRUUklCVVRFX01PREVcblx0XHRdXG5cdH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgREVMUEhJX0tFWVdPUkRTID0gJ2FuZCBzYWZlY2FsbCBjZGVjbCB0aGVuIHN0cmluZyBleHBvcnRzIGxpYnJhcnkgbm90IHBhc2NhbCBzZXQgJyArXG4gICAgJ3ZpcnR1YWwgZmlsZSBpbiBhcnJheSBsYWJlbCBwYWNrZWQgZW5kLiBpbmRleCB3aGlsZSBjb25zdCByYWlzZSBmb3IgdG8gaW1wbGVtZW50YXRpb24gJyArXG4gICAgJ3dpdGggZXhjZXB0IG92ZXJsb2FkIGRlc3RydWN0b3IgZG93bnRvIGZpbmFsbHkgcHJvZ3JhbSBleGl0IHVuaXQgaW5oZXJpdGVkIG92ZXJyaWRlIGlmICcgK1xuICAgICd0eXBlIHVudGlsIGZ1bmN0aW9uIGRvIGJlZ2luIHJlcGVhdCBnb3RvIG5pbCBmYXIgaW5pdGlhbGl6YXRpb24gb2JqZWN0IGVsc2UgdmFyIHVzZXMgJyArXG4gICAgJ2V4dGVybmFsIHJlc291cmNlc3RyaW5nIGludGVyZmFjZSBlbmQgZmluYWxpemF0aW9uIGNsYXNzIGFzbSBtb2QgY2FzZSBvbiBzaHIgc2hsIG9mICcgK1xuICAgICdyZWdpc3RlciB4b3J3cml0ZSB0aHJlYWR2YXIgdHJ5IHJlY29yZCBuZWFyIHN0b3JlZCBjb25zdHJ1Y3RvciBzdGRjYWxsIGlubGluZSBkaXYgb3V0IG9yICcgK1xuICAgICdwcm9jZWR1cmUnO1xuICB2YXIgREVMUEhJX0NMQVNTX0tFWVdPUkRTID0gJ3NhZmVjYWxsIHN0ZGNhbGwgcGFzY2FsIHN0b3JlZCBjb25zdCBpbXBsZW1lbnRhdGlvbiAnICtcbiAgICAnZmluYWxpemF0aW9uIGV4Y2VwdCB0byBmaW5hbGx5IHByb2dyYW0gaW5oZXJpdGVkIG92ZXJyaWRlIHRoZW4gZXhwb3J0cyBzdHJpbmcgcmVhZCBub3QgJyArXG4gICAgJ21vZCBzaHIgdHJ5IGRpdiBzaGwgc2V0IGxpYnJhcnkgbWVzc2FnZSBwYWNrZWQgaW5kZXggZm9yIG5lYXIgb3ZlcmxvYWQgbGFiZWwgZG93bnRvIGV4aXQgJyArXG4gICAgJ3B1YmxpYyBnb3RvIGludGVyZmFjZSBhc20gb24gb2YgY29uc3RydWN0b3Igb3IgcHJpdmF0ZSBhcnJheSB1bml0IHJhaXNlIGRlc3RydWN0b3IgdmFyICcgK1xuICAgICd0eXBlIHVudGlsIGZ1bmN0aW9uIGVsc2UgZXh0ZXJuYWwgd2l0aCBjYXNlIGRlZmF1bHQgcmVjb3JkIHdoaWxlIHByb3RlY3RlZCBwcm9wZXJ0eSAnICtcbiAgICAncHJvY2VkdXJlIHB1Ymxpc2hlZCBhbmQgY2RlY2wgZG8gdGhyZWFkdmFyIGZpbGUgaW4gaWYgZW5kIHZpcnR1YWwgd3JpdGUgZmFyIG91dCBiZWdpbiAnICtcbiAgICAncmVwZWF0IG5pbCBpbml0aWFsaXphdGlvbiBvYmplY3QgdXNlcyByZXNvdXJjZXN0cmluZyBjbGFzcyByZWdpc3RlciB4b3J3cml0ZSBpbmxpbmUgc3RhdGljJztcbiAgdmFyIENVUkxZX0NPTU1FTlQgPSAge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgUEFSRU5fQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ1xcXFwoXFxcXConLCBlbmQ6ICdcXFxcKlxcXFwpJyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHZhciBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgY29udGFpbnM6IFt7YmVnaW46ICdcXCdcXCcnfV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDSEFSX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLCBiZWdpbjogJygjXFxcXGQrKSsnXG4gIH07XG4gIHZhciBGVU5DVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnWzo7XScsXG4gICAga2V5d29yZHM6ICdmdW5jdGlvbiBjb25zdHJ1Y3RvcnwxMCBkZXN0cnVjdG9yfDEwIHByb2NlZHVyZXwxMCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5JREVOVF9SRVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAga2V5d29yZHM6IERFTFBISV9LRVlXT1JEUyxcbiAgICAgICAgY29udGFpbnM6IFtTVFJJTkcsIENIQVJfU1RSSU5HXVxuICAgICAgfSxcbiAgICAgIENVUkxZX0NPTU1FTlQsIFBBUkVOX0NPTU1FTlRcbiAgICBdXG4gIH07XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczogREVMUEhJX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICcoXCJ8XFxcXCRbRy1aZy16XXxcXFxcL1xcXFwqfDwvKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIENVUkxZX0NPTU1FTlQsIFBBUkVOX0NPTU1FTlQsIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIFNUUklORywgQ0hBUl9TVFJJTkcsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgRlVOQ1RJT04sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICc9XFxcXGJjbGFzc1xcXFxiJywgZW5kOiAnZW5kOycsXG4gICAgICAgIGtleXdvcmRzOiBERUxQSElfQ0xBU1NfS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgU1RSSU5HLCBDSEFSX1NUUklORyxcbiAgICAgICAgICBDVVJMWV9DT01NRU5ULCBQQVJFTl9DT01NRU5ULCBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgRlVOQ1RJT05cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2h1bmsnLFxuICAgICAgICBiZWdpbjogJ15cXFxcQFxcXFxAICtcXFxcLVxcXFxkKyxcXFxcZCsgK1xcXFwrXFxcXGQrLFxcXFxkKyArXFxcXEBcXFxcQCQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjaHVuaycsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwqXFxcXCpcXFxcKiArXFxcXGQrLFxcXFxkKyArXFxcXCpcXFxcKlxcXFwqXFxcXCokJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2h1bmsnLFxuICAgICAgICBiZWdpbjogJ15cXFxcLVxcXFwtXFxcXC0gK1xcXFxkKyxcXFxcZCsgK1xcXFwtXFxcXC1cXFxcLVxcXFwtJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnSW5kZXg6ICcsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJz09PT09JywgZW5kOiAnPT09PT0kJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXC1cXFxcLVxcXFwtJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwqezN9ICcsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ15cXFxcK1xcXFwrXFxcXCsnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKns1fScsIGVuZDogJ1xcXFwqezV9JCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2FkZGl0aW9uJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCsnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZGVsZXRpb24nLFxuICAgICAgICBiZWdpbjogJ15cXFxcLScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjaGFuZ2UnLFxuICAgICAgICBiZWdpbjogJ15cXFxcIScsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcblxuICBmdW5jdGlvbiBhbGxvd3NEamFuZ29TeW50YXgobW9kZSwgcGFyZW50KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHBhcmVudCA9PSB1bmRlZmluZWQgfHwgLy8gZGVmYXVsdCBtb2RlXG4gICAgICAoIW1vZGUuY2xhc3NOYW1lICYmIHBhcmVudC5jbGFzc05hbWUgPT0gJ3RhZycpIHx8IC8vIHRhZ19pbnRlcm5hbFxuICAgICAgbW9kZS5jbGFzc05hbWUgPT0gJ3ZhbHVlJyAvLyB2YWx1ZVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBjb3B5KG1vZGUsIHBhcmVudCkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbW9kZSkge1xuICAgICAgaWYgKGtleSAhPSAnY29udGFpbnMnKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gbW9kZVtrZXldO1xuICAgICAgfVxuICAgICAgdmFyIGNvbnRhaW5zID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgbW9kZS5jb250YWlucyAmJiBpIDwgbW9kZS5jb250YWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb250YWlucy5wdXNoKGNvcHkobW9kZS5jb250YWluc1tpXSwgbW9kZSkpO1xuICAgICAgfVxuICAgICAgaWYgKGFsbG93c0RqYW5nb1N5bnRheChtb2RlLCBwYXJlbnQpKSB7XG4gICAgICAgIGNvbnRhaW5zID0gREpBTkdPX0NPTlRBSU5TLmNvbmNhdChjb250YWlucyk7XG4gICAgICB9XG4gICAgICBpZiAoY29udGFpbnMubGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdC5jb250YWlucyA9IGNvbnRhaW5zO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdmFyIEZJTFRFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdmaWx0ZXInLFxuICAgIGJlZ2luOiAnXFxcXHxbQS1aYS16XStcXFxcOj8nLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGtleXdvcmRzOlxuICAgICAgJ3RydW5jYXRld29yZHMgcmVtb3ZldGFncyBsaW5lYnJlYWtzYnIgeWVzbm8gZ2V0X2RpZ2l0IHRpbWVzaW5jZSByYW5kb20gc3RyaXB0YWdzICcgK1xuICAgICAgJ2ZpbGVzaXplZm9ybWF0IGVzY2FwZSBsaW5lYnJlYWtzIGxlbmd0aF9pcyBsanVzdCByanVzdCBjdXQgdXJsaXplIGZpeF9hbXBlcnNhbmRzICcgK1xuICAgICAgJ3RpdGxlIGZsb2F0Zm9ybWF0IGNhcGZpcnN0IHBwcmludCBkaXZpc2libGVieSBhZGQgbWFrZV9saXN0IHVub3JkZXJlZF9saXN0IHVybGVuY29kZSAnICtcbiAgICAgICd0aW1ldW50aWwgdXJsaXpldHJ1bmMgd29yZGNvdW50IHN0cmluZ2Zvcm1hdCBsaW5lbnVtYmVycyBzbGljZSBkYXRlIGRpY3Rzb3J0ICcgK1xuICAgICAgJ2RpY3Rzb3J0cmV2ZXJzZWQgZGVmYXVsdF9pZl9ub25lIHBsdXJhbGl6ZSBsb3dlciBqb2luIGNlbnRlciBkZWZhdWx0ICcgK1xuICAgICAgJ3RydW5jYXRld29yZHNfaHRtbCB1cHBlciBsZW5ndGggcGhvbmUybnVtZXJpYyB3b3Jkd3JhcCB0aW1lIGFkZHNsYXNoZXMgc2x1Z2lmeSBmaXJzdCAnICtcbiAgICAgICdlc2NhcGVqcyBmb3JjZV9lc2NhcGUgaXJpZW5jb2RlIGxhc3Qgc2FmZSBzYWZlc2VxIHRydW5jYXRlY2hhcnMgbG9jYWxpemUgdW5sb2NhbGl6ZSAnICtcbiAgICAgICdsb2NhbHRpbWUgdXRjIHRpbWV6b25lJyxcbiAgICBjb250YWluczogW1xuICAgICAge2NsYXNzTmFtZTogJ2FyZ3VtZW50JywgYmVnaW46ICdcIicsIGVuZDogJ1wiJ31cbiAgICBdXG4gIH07XG5cbiAgdmFyIERKQU5HT19DT05UQUlOUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZV9jb21tZW50JyxcbiAgICAgIGJlZ2luOiAneyVcXFxccypjb21tZW50XFxcXHMqJX0nLCBlbmQ6ICd7JVxcXFxzKmVuZGNvbW1lbnRcXFxccyolfSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlX2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICd7IycsIGVuZDogJyN9J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndGVtcGxhdGVfdGFnJyxcbiAgICAgIGJlZ2luOiAneyUnLCBlbmQ6ICclfScsXG4gICAgICBrZXl3b3JkczpcbiAgICAgICAgJ2NvbW1lbnQgZW5kY29tbWVudCBsb2FkIHRlbXBsYXRldGFnIGlmY2hhbmdlZCBlbmRpZmNoYW5nZWQgaWYgZW5kaWYgZmlyc3RvZiBmb3IgJyArXG4gICAgICAgICdlbmRmb3IgaW4gaWZub3RlcXVhbCBlbmRpZm5vdGVxdWFsIHdpZHRocmF0aW8gZXh0ZW5kcyBpbmNsdWRlIHNwYWNlbGVzcyAnICtcbiAgICAgICAgJ2VuZHNwYWNlbGVzcyByZWdyb3VwIGJ5IGFzIGlmZXF1YWwgZW5kaWZlcXVhbCBzc2kgbm93IHdpdGggY3ljbGUgdXJsIGZpbHRlciAnICtcbiAgICAgICAgJ2VuZGZpbHRlciBkZWJ1ZyBibG9jayBlbmRibG9jayBlbHNlIGF1dG9lc2NhcGUgZW5kYXV0b2VzY2FwZSBjc3JmX3Rva2VuIGVtcHR5IGVsaWYgJyArXG4gICAgICAgICdlbmR3aXRoIHN0YXRpYyB0cmFucyBibG9ja3RyYW5zIGVuZGJsb2NrdHJhbnMgZ2V0X3N0YXRpY19wcmVmaXggZ2V0X21lZGlhX3ByZWZpeCAnICtcbiAgICAgICAgJ3BsdXJhbCBnZXRfY3VycmVudF9sYW5ndWFnZSBsYW5ndWFnZSBnZXRfYXZhaWxhYmxlX2xhbmd1YWdlcyAnICtcbiAgICAgICAgJ2dldF9jdXJyZW50X2xhbmd1YWdlX2JpZGkgZ2V0X2xhbmd1YWdlX2luZm8gZ2V0X2xhbmd1YWdlX2luZm9fbGlzdCBsb2NhbGl6ZSAnICtcbiAgICAgICAgJ2VuZGxvY2FsaXplIGxvY2FsdGltZSBlbmRsb2NhbHRpbWUgdGltZXpvbmUgZW5kdGltZXpvbmUgZ2V0X2N1cnJlbnRfdGltZXpvbmUnLFxuICAgICAgY29udGFpbnM6IFtGSUxURVJdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICBiZWdpbjogJ3t7JywgZW5kOiAnfX0nLFxuICAgICAgY29udGFpbnM6IFtGSUxURVJdXG4gICAgfVxuICBdO1xuXG4gIHZhciByZXN1bHQgPSBjb3B5KGhsanMuTEFOR1VBR0VTLnhtbCk7XG4gIHJlc3VsdC5jYXNlX2luc2Vuc2l0aXZlID0gdHJ1ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgZmxvdzogJ2lmIGVsc2UgZ290byBmb3IgaW4gZG8gY2FsbCBleGl0IG5vdCBleGlzdCBlcnJvcmxldmVsIGRlZmluZWQgZXF1IG5lcSBsc3MgbGVxIGd0ciBnZXEnLFxuICAgICAga2V5d29yZDogJ3NoaWZ0IGNkIGRpciBlY2hvIHNldGxvY2FsIGVuZGxvY2FsIHNldCBwYXVzZSBjb3B5JyxcbiAgICAgIHN0cmVhbTogJ3BybiBudWwgbHB0MyBscHQyIGxwdDEgY29uIGNvbTQgY29tMyBjb20yIGNvbTEgYXV4JyxcbiAgICAgIHdpbnV0aWxzOiAncGluZyBuZXQgaXBjb25maWcgdGFza2tpbGwgeGNvcHkgcmVuIGRlbCdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsIGJlZ2luOiAnJSVbXiBdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW52dmFyJywgYmVnaW46ICclW14gXSs/JSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsIGJlZ2luOiAnIVteIF0rPyEnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJ1xcXFxiXFxcXGQrJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdAP3JlbScsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAgc3BlY2lhbF9mdW5jdGlvbnM6XG4gICAgICAgICdzcGF3biBzcGF3bl9saW5rIHNlbGYnLFxuICAgICAgcmVzZXJ2ZWQ6XG4gICAgICAgICdhZnRlciBhbmQgYW5kYWxzb3wxMCBiYW5kIGJlZ2luIGJub3QgYm9yIGJzbCBic3IgYnhvciBjYXNlIGNhdGNoIGNvbmQgZGl2IGVuZCBmdW4gaWYgJyArXG4gICAgICAgICdsZXQgbm90IG9mIG9yIG9yZWxzZXwxMCBxdWVyeSByZWNlaXZlIHJlbSB0cnkgd2hlbiB4b3InXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcm9tcHQnLCBiZWdpbjogJ15bMC05XSs+ICcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJyUnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihcXFxcZCsjW2EtZkEtRjAtOV0rfFxcXFxkKyhcXFxcLlxcXFxkKyk/KFtlRV1bLStdP1xcXFxkKyk/KScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbnN0YW50JywgYmVnaW46ICdcXFxcPyg6Oik/KFtBLVpdXFxcXHcqKDo6KT8pKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Fycm93JywgYmVnaW46ICctPidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ29rJywgYmVnaW46ICdvaydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2V4Y2xhbWF0aW9uX21hcmsnLCBiZWdpbjogJyEnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbl9vcl9hdG9tJyxcbiAgICAgICAgYmVnaW46ICcoXFxcXGJbYS16XFwnXVthLXpBLVowLTlfXFwnXSo6W2EtelxcJ11bYS16QS1aMC05X1xcJ10qKXwoXFxcXGJbYS16XFwnXVthLXpBLVowLTlfXFwnXSopJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnW0EtWl1bYS16QS1aMC05X1xcJ10qJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEJBU0lDX0FUT01fUkUgPSAnW2EtelxcJ11bYS16QS1aMC05X1xcJ10qJztcbiAgdmFyIEZVTkNUSU9OX05BTUVfUkUgPSAnKCcgKyBCQVNJQ19BVE9NX1JFICsgJzonICsgQkFTSUNfQVRPTV9SRSArICd8JyArIEJBU0lDX0FUT01fUkUgKyAnKSc7XG4gIHZhciBFUkxBTkdfUkVTRVJWRUQgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdhZnRlciBhbmQgYW5kYWxzb3wxMCBiYW5kIGJlZ2luIGJub3QgYm9yIGJzbCBienIgYnhvciBjYXNlIGNhdGNoIGNvbmQgZGl2IGVuZCBmdW4gbGV0ICcgK1xuICAgICAgJ25vdCBvZiBvcmVsc2V8MTAgcXVlcnkgcmVjZWl2ZSByZW0gdHJ5IHdoZW4geG9yJyxcbiAgICBsaXRlcmFsOlxuICAgICAgJ2ZhbHNlIHRydWUnXG4gIH07XG5cbiAgdmFyIENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICclJywgZW5kOiAnJCcsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogJ1xcXFxiKFxcXFxkKyNbYS1mQS1GMC05XSt8XFxcXGQrKFxcXFwuXFxcXGQrKT8oW2VFXVstK10/XFxcXGQrKT8pJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIE5BTUVEX0ZVTiA9IHtcbiAgICBiZWdpbjogJ2Z1blxcXFxzKycgKyBCQVNJQ19BVE9NX1JFICsgJy9cXFxcZCsnXG4gIH07XG4gIHZhciBGVU5DVElPTl9DQUxMID0ge1xuICAgIGJlZ2luOiBGVU5DVElPTl9OQU1FX1JFICsgJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbl9uYW1lJywgYmVnaW46IEZVTkNUSU9OX05BTUVfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIC8vIFwiY29udGFpbnNcIiBkZWZpbmVkIGxhdGVyXG4gICAgICB9XG4gICAgXVxuICB9O1xuICB2YXIgVFVQTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndHVwbGUnLFxuICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgIHJlbGV2YW5jZTogMFxuICAgIC8vIFwiY29udGFpbnNcIiBkZWZpbmVkIGxhdGVyXG4gIH07XG4gIHZhciBWQVIxID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1xcXFxiXyhbQS1aXVtBLVphLXowLTlfXSopPycsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBWQVIyID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1tBLVpdW2EtekEtWjAtOV9dKicsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBSRUNPUkRfQUNDRVNTID0ge1xuICAgIGJlZ2luOiAnIycsIGVuZDogJ30nLFxuICAgIGlsbGVnYWw6ICcuJyxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVjb3JkX25hbWUnLFxuICAgICAgICBiZWdpbjogJyMnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAneycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgLy8gXCJjb250YWluc1wiIGRlZmluZWQgbGF0ZXJcbiAgICAgIH1cbiAgICBdXG4gIH07XG5cbiAgdmFyIEJMT0NLX1NUQVRFTUVOVFMgPSB7XG4gICAga2V5d29yZHM6IEVSTEFOR19SRVNFUlZFRCxcbiAgICBiZWdpbjogJyhmdW58cmVjZWl2ZXxpZnx0cnl8Y2FzZSknLCBlbmQ6ICdlbmQnXG4gIH07XG4gIEJMT0NLX1NUQVRFTUVOVFMuY29udGFpbnMgPSBbXG4gICAgQ09NTUVOVCxcbiAgICBOQU1FRF9GVU4sXG4gICAgaGxqcy5pbmhlcml0KGhsanMuQVBPU19TVFJJTkdfTU9ERSwge2NsYXNzTmFtZTogJyd9KSxcbiAgICBCTE9DS19TVEFURU1FTlRTLFxuICAgIEZVTkNUSU9OX0NBTEwsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBOVU1CRVIsXG4gICAgVFVQTEUsXG4gICAgVkFSMSwgVkFSMixcbiAgICBSRUNPUkRfQUNDRVNTXG4gIF07XG5cbiAgdmFyIEJBU0lDX01PREVTID0gW1xuICAgIENPTU1FTlQsXG4gICAgTkFNRURfRlVOLFxuICAgIEJMT0NLX1NUQVRFTUVOVFMsXG4gICAgRlVOQ1RJT05fQ0FMTCxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIE5VTUJFUixcbiAgICBUVVBMRSxcbiAgICBWQVIxLCBWQVIyLFxuICAgIFJFQ09SRF9BQ0NFU1NcbiAgXTtcbiAgRlVOQ1RJT05fQ0FMTC5jb250YWluc1sxXS5jb250YWlucyA9IEJBU0lDX01PREVTO1xuICBUVVBMRS5jb250YWlucyA9IEJBU0lDX01PREVTO1xuICBSRUNPUkRfQUNDRVNTLmNvbnRhaW5zWzFdLmNvbnRhaW5zID0gQkFTSUNfTU9ERVM7XG5cbiAgdmFyIFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IEJBU0lDX01PREVTXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IEVSTEFOR19SRVNFUlZFRCxcbiAgICBpbGxlZ2FsOiAnKDwvfFxcXFwqPXxcXFxcKz18LT18Lz18L1xcXFwqfFxcXFwqL3xcXFxcKFxcXFwqfFxcXFwqXFxcXCkpJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnXicgKyBCQVNJQ19BVE9NX1JFICsgJ1xcXFxzKlxcXFwoJywgZW5kOiAnLT4nLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFwofCN8Ly98L1xcXFwqfFxcXFxcXFxcfDonLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFBBUkFNUyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBCQVNJQ19BVE9NX1JFXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6ICc7fFxcXFwuJyxcbiAgICAgICAgICBrZXl3b3JkczogRVJMQU5HX1JFU0VSVkVELFxuICAgICAgICAgIGNvbnRhaW5zOiBCQVNJQ19NT0RFU1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ09NTUVOVCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHAnLFxuICAgICAgICBiZWdpbjogJ14tJywgZW5kOiAnXFxcXC4nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBsZXhlbXM6ICctJyArIGhsanMuSURFTlRfUkUsXG4gICAgICAgIGtleXdvcmRzOlxuICAgICAgICAgICctbW9kdWxlIC1yZWNvcmQgLXVuZGVmIC1leHBvcnQgLWlmZGVmIC1pZm5kZWYgLWF1dGhvciAtY29weXJpZ2h0IC1kb2MgLXZzbiAnICtcbiAgICAgICAgICAnLWltcG9ydCAtaW5jbHVkZSAtaW5jbHVkZV9saWIgLWNvbXBpbGUgLWRlZmluZSAtZWxzZSAtZW5kaWYgLWZpbGUgLWJlaGF2aW91ciAnICtcbiAgICAgICAgICAnLWJlaGF2aW9yJyxcbiAgICAgICAgY29udGFpbnM6IFtQQVJBTVNdXG4gICAgICB9LFxuICAgICAgTlVNQkVSLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIFJFQ09SRF9BQ0NFU1MsXG4gICAgICBWQVIxLCBWQVIyLFxuICAgICAgVFVQTEVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYXRvbWljX3VpbnQgYXR0cmlidXRlIGJvb2wgYnJlYWsgYnZlYzIgYnZlYzMgYnZlYzQgY2FzZSBjZW50cm9pZCBjb2hlcmVudCBjb25zdCBjb250aW51ZSBkZWZhdWx0ICcgK1xuICAgICAgICAnZGlzY2FyZCBkbWF0MiBkbWF0MngyIGRtYXQyeDMgZG1hdDJ4NCBkbWF0MyBkbWF0M3gyIGRtYXQzeDMgZG1hdDN4NCBkbWF0NCBkbWF0NHgyIGRtYXQ0eDMgJyArXG4gICAgICAgICdkbWF0NHg0IGRvIGRvdWJsZSBkdmVjMiBkdmVjMyBkdmVjNCBlbHNlIGZsYXQgZmxvYXQgZm9yIGhpZ2hwIGlmIGlpbWFnZTFEIGlpbWFnZTFEQXJyYXkgJyArXG4gICAgICAgICdpaW1hZ2UyRCBpaW1hZ2UyREFycmF5IGlpbWFnZTJETVMgaWltYWdlMkRNU0FycmF5IGlpbWFnZTJEUmVjdCBpaW1hZ2UzRCBpaW1hZ2VCdWZmZXIgaWltYWdlQ3ViZSAnICtcbiAgICAgICAgJ2lpbWFnZUN1YmVBcnJheSBpbWFnZTFEIGltYWdlMURBcnJheSBpbWFnZTJEIGltYWdlMkRBcnJheSBpbWFnZTJETVMgaW1hZ2UyRE1TQXJyYXkgaW1hZ2UyRFJlY3QgJyArXG4gICAgICAgICdpbWFnZTNEIGltYWdlQnVmZmVyIGltYWdlQ3ViZSBpbWFnZUN1YmVBcnJheSBpbiBpbm91dCBpbnQgaW52YXJpYW50IGlzYW1wbGVyMUQgaXNhbXBsZXIxREFycmF5ICcgK1xuICAgICAgICAnaXNhbXBsZXIyRCBpc2FtcGxlcjJEQXJyYXkgaXNhbXBsZXIyRE1TIGlzYW1wbGVyMkRNU0FycmF5IGlzYW1wbGVyMkRSZWN0IGlzYW1wbGVyM0QgaXNhbXBsZXJCdWZmZXIgJyArXG4gICAgICAgICdpc2FtcGxlckN1YmUgaXNhbXBsZXJDdWJlQXJyYXkgaXZlYzIgaXZlYzMgaXZlYzQgbGF5b3V0IGxvd3AgbWF0MiBtYXQyeDIgbWF0MngzIG1hdDJ4NCBtYXQzIG1hdDN4MiAnICtcbiAgICAgICAgJ21hdDN4MyBtYXQzeDQgbWF0NCBtYXQ0eDIgbWF0NHgzIG1hdDR4NCBtZWRpdW1wIG5vcGVyc3BlY3RpdmUgb3V0IHBhdGNoIHByZWNpc2lvbiByZWFkb25seSByZXN0cmljdCAnICtcbiAgICAgICAgJ3JldHVybiBzYW1wbGUgc2FtcGxlcjFEIHNhbXBsZXIxREFycmF5IHNhbXBsZXIxREFycmF5U2hhZG93IHNhbXBsZXIxRFNoYWRvdyBzYW1wbGVyMkQgc2FtcGxlcjJEQXJyYXkgJyArXG4gICAgICAgICdzYW1wbGVyMkRBcnJheVNoYWRvdyBzYW1wbGVyMkRNUyBzYW1wbGVyMkRNU0FycmF5IHNhbXBsZXIyRFJlY3Qgc2FtcGxlcjJEUmVjdFNoYWRvdyBzYW1wbGVyMkRTaGFkb3cgJyArXG4gICAgICAgICdzYW1wbGVyM0Qgc2FtcGxlckJ1ZmZlciBzYW1wbGVyQ3ViZSBzYW1wbGVyQ3ViZUFycmF5IHNhbXBsZXJDdWJlQXJyYXlTaGFkb3cgc2FtcGxlckN1YmVTaGFkb3cgc21vb3RoICcgK1xuICAgICAgICAnc3RydWN0IHN1YnJvdXRpbmUgc3dpdGNoIHVpbWFnZTFEIHVpbWFnZTFEQXJyYXkgdWltYWdlMkQgdWltYWdlMkRBcnJheSB1aW1hZ2UyRE1TIHVpbWFnZTJETVNBcnJheSAnICtcbiAgICAgICAgJ3VpbWFnZTJEUmVjdCB1aW1hZ2UzRCB1aW1hZ2VCdWZmZXIgdWltYWdlQ3ViZSB1aW1hZ2VDdWJlQXJyYXkgdWludCB1bmlmb3JtIHVzYW1wbGVyMUQgdXNhbXBsZXIxREFycmF5ICcgK1xuICAgICAgICAndXNhbXBsZXIyRCB1c2FtcGxlcjJEQXJyYXkgdXNhbXBsZXIyRE1TIHVzYW1wbGVyMkRNU0FycmF5IHVzYW1wbGVyMkRSZWN0IHVzYW1wbGVyM0QgdXNhbXBsZXJCdWZmZXIgJyArXG4gICAgICAgICd1c2FtcGxlckN1YmUgdXNhbXBsZXJDdWJlQXJyYXkgdXZlYzIgdXZlYzMgdXZlYzQgdmFyeWluZyB2ZWMyIHZlYzMgdmVjNCB2b2lkIHZvbGF0aWxlIHdoaWxlIHdyaXRlb25seScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ2dsX0JhY2tDb2xvciBnbF9CYWNrTGlnaHRNb2RlbFByb2R1Y3QgZ2xfQmFja0xpZ2h0UHJvZHVjdCBnbF9CYWNrTWF0ZXJpYWwgJyArXG4gICAgICAgICdnbF9CYWNrU2Vjb25kYXJ5Q29sb3IgZ2xfQ2xpcERpc3RhbmNlIGdsX0NsaXBQbGFuZSBnbF9DbGlwVmVydGV4IGdsX0NvbG9yICcgK1xuICAgICAgICAnZ2xfRGVwdGhSYW5nZSBnbF9FeWVQbGFuZVEgZ2xfRXllUGxhbmVSIGdsX0V5ZVBsYW5lUyBnbF9FeWVQbGFuZVQgZ2xfRm9nIGdsX0ZvZ0Nvb3JkICcgK1xuICAgICAgICAnZ2xfRm9nRnJhZ0Nvb3JkIGdsX0ZyYWdDb2xvciBnbF9GcmFnQ29vcmQgZ2xfRnJhZ0RhdGEgZ2xfRnJhZ0RlcHRoIGdsX0Zyb250Q29sb3IgJyArXG4gICAgICAgICdnbF9Gcm9udEZhY2luZyBnbF9Gcm9udExpZ2h0TW9kZWxQcm9kdWN0IGdsX0Zyb250TGlnaHRQcm9kdWN0IGdsX0Zyb250TWF0ZXJpYWwgJyArXG4gICAgICAgICdnbF9Gcm9udFNlY29uZGFyeUNvbG9yIGdsX0luc3RhbmNlSUQgZ2xfSW52b2NhdGlvbklEIGdsX0xheWVyIGdsX0xpZ2h0TW9kZWwgJyArXG4gICAgICAgICdnbF9MaWdodFNvdXJjZSBnbF9NYXhBdG9taWNDb3VudGVyQmluZGluZ3MgZ2xfTWF4QXRvbWljQ291bnRlckJ1ZmZlclNpemUgJyArXG4gICAgICAgICdnbF9NYXhDbGlwRGlzdGFuY2VzIGdsX01heENsaXBQbGFuZXMgZ2xfTWF4Q29tYmluZWRBdG9taWNDb3VudGVyQnVmZmVycyAnICtcbiAgICAgICAgJ2dsX01heENvbWJpbmVkQXRvbWljQ291bnRlcnMgZ2xfTWF4Q29tYmluZWRJbWFnZVVuaWZvcm1zIGdsX01heENvbWJpbmVkSW1hZ2VVbml0c0FuZEZyYWdtZW50T3V0cHV0cyAnICtcbiAgICAgICAgJ2dsX01heENvbWJpbmVkVGV4dHVyZUltYWdlVW5pdHMgZ2xfTWF4RHJhd0J1ZmZlcnMgZ2xfTWF4RnJhZ21lbnRBdG9taWNDb3VudGVyQnVmZmVycyAnICtcbiAgICAgICAgJ2dsX01heEZyYWdtZW50QXRvbWljQ291bnRlcnMgZ2xfTWF4RnJhZ21lbnRJbWFnZVVuaWZvcm1zIGdsX01heEZyYWdtZW50SW5wdXRDb21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4RnJhZ21lbnRVbmlmb3JtQ29tcG9uZW50cyBnbF9NYXhGcmFnbWVudFVuaWZvcm1WZWN0b3JzIGdsX01heEdlb21ldHJ5QXRvbWljQ291bnRlckJ1ZmZlcnMgJyArXG4gICAgICAgICdnbF9NYXhHZW9tZXRyeUF0b21pY0NvdW50ZXJzIGdsX01heEdlb21ldHJ5SW1hZ2VVbmlmb3JtcyBnbF9NYXhHZW9tZXRyeUlucHV0Q29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heEdlb21ldHJ5T3V0cHV0Q29tcG9uZW50cyBnbF9NYXhHZW9tZXRyeU91dHB1dFZlcnRpY2VzIGdsX01heEdlb21ldHJ5VGV4dHVyZUltYWdlVW5pdHMgJyArXG4gICAgICAgICdnbF9NYXhHZW9tZXRyeVRvdGFsT3V0cHV0Q29tcG9uZW50cyBnbF9NYXhHZW9tZXRyeVVuaWZvcm1Db21wb25lbnRzIGdsX01heEdlb21ldHJ5VmFyeWluZ0NvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhJbWFnZVNhbXBsZXMgZ2xfTWF4SW1hZ2VVbml0cyBnbF9NYXhMaWdodHMgZ2xfTWF4UGF0Y2hWZXJ0aWNlcyBnbF9NYXhQcm9ncmFtVGV4ZWxPZmZzZXQgJyArXG4gICAgICAgICdnbF9NYXhUZXNzQ29udHJvbEF0b21pY0NvdW50ZXJCdWZmZXJzIGdsX01heFRlc3NDb250cm9sQXRvbWljQ291bnRlcnMgZ2xfTWF4VGVzc0NvbnRyb2xJbWFnZVVuaWZvcm1zICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0NvbnRyb2xJbnB1dENvbXBvbmVudHMgZ2xfTWF4VGVzc0NvbnRyb2xPdXRwdXRDb21wb25lbnRzIGdsX01heFRlc3NDb250cm9sVGV4dHVyZUltYWdlVW5pdHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzQ29udHJvbFRvdGFsT3V0cHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzQ29udHJvbFVuaWZvcm1Db21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0V2YWx1YXRpb25BdG9taWNDb3VudGVyQnVmZmVycyBnbF9NYXhUZXNzRXZhbHVhdGlvbkF0b21pY0NvdW50ZXJzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0V2YWx1YXRpb25JbWFnZVVuaWZvcm1zIGdsX01heFRlc3NFdmFsdWF0aW9uSW5wdXRDb21wb25lbnRzIGdsX01heFRlc3NFdmFsdWF0aW9uT3V0cHV0Q29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NFdmFsdWF0aW9uVGV4dHVyZUltYWdlVW5pdHMgZ2xfTWF4VGVzc0V2YWx1YXRpb25Vbmlmb3JtQ29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NHZW5MZXZlbCBnbF9NYXhUZXNzUGF0Y2hDb21wb25lbnRzIGdsX01heFRleHR1cmVDb29yZHMgZ2xfTWF4VGV4dHVyZUltYWdlVW5pdHMgJyArXG4gICAgICAgICdnbF9NYXhUZXh0dXJlVW5pdHMgZ2xfTWF4VmFyeWluZ0NvbXBvbmVudHMgZ2xfTWF4VmFyeWluZ0Zsb2F0cyBnbF9NYXhWYXJ5aW5nVmVjdG9ycyAnICtcbiAgICAgICAgJ2dsX01heFZlcnRleEF0b21pY0NvdW50ZXJCdWZmZXJzIGdsX01heFZlcnRleEF0b21pY0NvdW50ZXJzIGdsX01heFZlcnRleEF0dHJpYnMgJyArXG4gICAgICAgICdnbF9NYXhWZXJ0ZXhJbWFnZVVuaWZvcm1zIGdsX01heFZlcnRleE91dHB1dENvbXBvbmVudHMgZ2xfTWF4VmVydGV4VGV4dHVyZUltYWdlVW5pdHMgJyArXG4gICAgICAgICdnbF9NYXhWZXJ0ZXhVbmlmb3JtQ29tcG9uZW50cyBnbF9NYXhWZXJ0ZXhVbmlmb3JtVmVjdG9ycyBnbF9NYXhWaWV3cG9ydHMgZ2xfTWluUHJvZ3JhbVRleGVsT2Zmc2V0JytcbiAgICAgICAgJ2dsX01vZGVsVmlld01hdHJpeCBnbF9Nb2RlbFZpZXdNYXRyaXhJbnZlcnNlIGdsX01vZGVsVmlld01hdHJpeEludmVyc2VUcmFuc3Bvc2UgJyArXG4gICAgICAgICdnbF9Nb2RlbFZpZXdNYXRyaXhUcmFuc3Bvc2UgZ2xfTW9kZWxWaWV3UHJvamVjdGlvbk1hdHJpeCBnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4SW52ZXJzZSAnICtcbiAgICAgICAgJ2dsX01vZGVsVmlld1Byb2plY3Rpb25NYXRyaXhJbnZlcnNlVHJhbnNwb3NlIGdsX01vZGVsVmlld1Byb2plY3Rpb25NYXRyaXhUcmFuc3Bvc2UgJyArXG4gICAgICAgICdnbF9NdWx0aVRleENvb3JkMCBnbF9NdWx0aVRleENvb3JkMSBnbF9NdWx0aVRleENvb3JkMiBnbF9NdWx0aVRleENvb3JkMyBnbF9NdWx0aVRleENvb3JkNCAnICtcbiAgICAgICAgJ2dsX011bHRpVGV4Q29vcmQ1IGdsX011bHRpVGV4Q29vcmQ2IGdsX011bHRpVGV4Q29vcmQ3IGdsX05vcm1hbCBnbF9Ob3JtYWxNYXRyaXggJyArXG4gICAgICAgICdnbF9Ob3JtYWxTY2FsZSBnbF9PYmplY3RQbGFuZVEgZ2xfT2JqZWN0UGxhbmVSIGdsX09iamVjdFBsYW5lUyBnbF9PYmplY3RQbGFuZVQgZ2xfUGF0Y2hWZXJ0aWNlc0luICcgK1xuICAgICAgICAnZ2xfUGVyVmVydGV4IGdsX1BvaW50IGdsX1BvaW50Q29vcmQgZ2xfUG9pbnRTaXplIGdsX1Bvc2l0aW9uIGdsX1ByaW1pdGl2ZUlEIGdsX1ByaW1pdGl2ZUlESW4gJyArXG4gICAgICAgICdnbF9Qcm9qZWN0aW9uTWF0cml4IGdsX1Byb2plY3Rpb25NYXRyaXhJbnZlcnNlIGdsX1Byb2plY3Rpb25NYXRyaXhJbnZlcnNlVHJhbnNwb3NlICcgK1xuICAgICAgICAnZ2xfUHJvamVjdGlvbk1hdHJpeFRyYW5zcG9zZSBnbF9TYW1wbGVJRCBnbF9TYW1wbGVNYXNrIGdsX1NhbXBsZU1hc2tJbiBnbF9TYW1wbGVQb3NpdGlvbiAnICtcbiAgICAgICAgJ2dsX1NlY29uZGFyeUNvbG9yIGdsX1Rlc3NDb29yZCBnbF9UZXNzTGV2ZWxJbm5lciBnbF9UZXNzTGV2ZWxPdXRlciBnbF9UZXhDb29yZCBnbF9UZXh0dXJlRW52Q29sb3IgJyArXG4gICAgICAgICdnbF9UZXh0dXJlTWF0cml4SW52ZXJzZVRyYW5zcG9zZSBnbF9UZXh0dXJlTWF0cml4VHJhbnNwb3NlIGdsX1ZlcnRleCBnbF9WZXJ0ZXhJRCAnICtcbiAgICAgICAgJ2dsX1ZpZXdwb3J0SW5kZXggZ2xfaW4gZ2xfb3V0IEVtaXRTdHJlYW1WZXJ0ZXggRW1pdFZlcnRleCBFbmRQcmltaXRpdmUgRW5kU3RyZWFtUHJpbWl0aXZlICcgK1xuICAgICAgICAnYWJzIGFjb3MgYWNvc2ggYWxsIGFueSBhc2luIGFzaW5oIGF0YW4gYXRhbmggYXRvbWljQ291bnRlciBhdG9taWNDb3VudGVyRGVjcmVtZW50ICcgK1xuICAgICAgICAnYXRvbWljQ291bnRlckluY3JlbWVudCBiYXJyaWVyIGJpdENvdW50IGJpdGZpZWxkRXh0cmFjdCBiaXRmaWVsZEluc2VydCBiaXRmaWVsZFJldmVyc2UgJyArXG4gICAgICAgICdjZWlsIGNsYW1wIGNvcyBjb3NoIGNyb3NzIGRGZHggZEZkeSBkZWdyZWVzIGRldGVybWluYW50IGRpc3RhbmNlIGRvdCBlcXVhbCBleHAgZXhwMiBmYWNlZm9yd2FyZCAnICtcbiAgICAgICAgJ2ZpbmRMU0IgZmluZE1TQiBmbG9hdEJpdHNUb0ludCBmbG9hdEJpdHNUb1VpbnQgZmxvb3IgZm1hIGZyYWN0IGZyZXhwIGZ0cmFuc2Zvcm0gZndpZHRoIGdyZWF0ZXJUaGFuICcgK1xuICAgICAgICAnZ3JlYXRlclRoYW5FcXVhbCBpbWFnZUF0b21pY0FkZCBpbWFnZUF0b21pY0FuZCBpbWFnZUF0b21pY0NvbXBTd2FwIGltYWdlQXRvbWljRXhjaGFuZ2UgJyArXG4gICAgICAgICdpbWFnZUF0b21pY01heCBpbWFnZUF0b21pY01pbiBpbWFnZUF0b21pY09yIGltYWdlQXRvbWljWG9yIGltYWdlTG9hZCBpbWFnZVN0b3JlIGltdWxFeHRlbmRlZCAnICtcbiAgICAgICAgJ2ludEJpdHNUb0Zsb2F0IGludGVycG9sYXRlQXRDZW50cm9pZCBpbnRlcnBvbGF0ZUF0T2Zmc2V0IGludGVycG9sYXRlQXRTYW1wbGUgaW52ZXJzZSBpbnZlcnNlc3FydCAnICtcbiAgICAgICAgJ2lzaW5mIGlzbmFuIGxkZXhwIGxlbmd0aCBsZXNzVGhhbiBsZXNzVGhhbkVxdWFsIGxvZyBsb2cyIG1hdHJpeENvbXBNdWx0IG1heCBtZW1vcnlCYXJyaWVyICcgK1xuICAgICAgICAnbWluIG1peCBtb2QgbW9kZiBub2lzZTEgbm9pc2UyIG5vaXNlMyBub2lzZTQgbm9ybWFsaXplIG5vdCBub3RFcXVhbCBvdXRlclByb2R1Y3QgcGFja0RvdWJsZTJ4MzIgJyArXG4gICAgICAgICdwYWNrSGFsZjJ4MTYgcGFja1Nub3JtMngxNiBwYWNrU25vcm00eDggcGFja1Vub3JtMngxNiBwYWNrVW5vcm00eDggcG93IHJhZGlhbnMgcmVmbGVjdCByZWZyYWN0ICcgK1xuICAgICAgICAncm91bmQgcm91bmRFdmVuIHNoYWRvdzFEIHNoYWRvdzFETG9kIHNoYWRvdzFEUHJvaiBzaGFkb3cxRFByb2pMb2Qgc2hhZG93MkQgc2hhZG93MkRMb2Qgc2hhZG93MkRQcm9qICcgK1xuICAgICAgICAnc2hhZG93MkRQcm9qTG9kIHNpZ24gc2luIHNpbmggc21vb3Roc3RlcCBzcXJ0IHN0ZXAgdGFuIHRhbmggdGV4ZWxGZXRjaCB0ZXhlbEZldGNoT2Zmc2V0IHRleHR1cmUgJyArXG4gICAgICAgICd0ZXh0dXJlMUQgdGV4dHVyZTFETG9kIHRleHR1cmUxRFByb2ogdGV4dHVyZTFEUHJvakxvZCB0ZXh0dXJlMkQgdGV4dHVyZTJETG9kIHRleHR1cmUyRFByb2ogJyArXG4gICAgICAgICd0ZXh0dXJlMkRQcm9qTG9kIHRleHR1cmUzRCB0ZXh0dXJlM0RMb2QgdGV4dHVyZTNEUHJvaiB0ZXh0dXJlM0RQcm9qTG9kIHRleHR1cmVDdWJlIHRleHR1cmVDdWJlTG9kICcgK1xuICAgICAgICAndGV4dHVyZUdhdGhlciB0ZXh0dXJlR2F0aGVyT2Zmc2V0IHRleHR1cmVHYXRoZXJPZmZzZXRzIHRleHR1cmVHcmFkIHRleHR1cmVHcmFkT2Zmc2V0IHRleHR1cmVMb2QgJyArXG4gICAgICAgICd0ZXh0dXJlTG9kT2Zmc2V0IHRleHR1cmVPZmZzZXQgdGV4dHVyZVByb2ogdGV4dHVyZVByb2pHcmFkIHRleHR1cmVQcm9qR3JhZE9mZnNldCB0ZXh0dXJlUHJvakxvZCAnICtcbiAgICAgICAgJ3RleHR1cmVQcm9qTG9kT2Zmc2V0IHRleHR1cmVQcm9qT2Zmc2V0IHRleHR1cmVRdWVyeUxvZCB0ZXh0dXJlU2l6ZSB0cmFuc3Bvc2UgdHJ1bmMgdWFkZENhcnJ5ICcgK1xuICAgICAgICAndWludEJpdHNUb0Zsb2F0IHVtdWxFeHRlbmRlZCB1bnBhY2tEb3VibGUyeDMyIHVucGFja0hhbGYyeDE2IHVucGFja1Nub3JtMngxNiB1bnBhY2tTbm9ybTR4OCAnICtcbiAgICAgICAgJ3VucGFja1Vub3JtMngxNiB1bnBhY2tVbm9ybTR4OCB1c3ViQm9ycm93IGdsX1RleHR1cmVNYXRyaXggZ2xfVGV4dHVyZU1hdHJpeEludmVyc2UnLFxuICAgICAgbGl0ZXJhbDogJ3RydWUgZmFsc2UnXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnXCInLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBHT19LRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2JyZWFrIGRlZmF1bHQgZnVuYyBpbnRlcmZhY2Ugc2VsZWN0IGNhc2UgbWFwIHN0cnVjdCBjaGFuIGVsc2UgZ290byBwYWNrYWdlIHN3aXRjaCAnICtcbiAgICAgICdjb25zdCBmYWxsdGhyb3VnaCBpZiByYW5nZSB0eXBlIGNvbnRpbnVlIGZvciBpbXBvcnQgcmV0dXJuIHZhciBnbyBkZWZlcicsXG4gICAgY29uc3RhbnQ6XG4gICAgICAgJ3RydWUgZmFsc2UgaW90YSBuaWwnLFxuICAgIHR5cGVuYW1lOlxuICAgICAgJ2Jvb2wgYnl0ZSBjb21wbGV4NjQgY29tcGxleDEyOCBmbG9hdDMyIGZsb2F0NjQgaW50OCBpbnQxNiBpbnQzMiBpbnQ2NCBzdHJpbmcgdWludDggJyArXG4gICAgICAndWludDE2IHVpbnQzMiB1aW50NjQgaW50IHVpbnQgdWludHB0ciBydW5lJyxcbiAgICBidWlsdF9pbjpcbiAgICAgICdhcHBlbmQgY2FwIGNsb3NlIGNvbXBsZXggY29weSBpbWFnIGxlbiBtYWtlIG5ldyBwYW5pYyBwcmludCBwcmludGxuIHJlYWwgcmVjb3ZlciBkZWxldGUnXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IEdPX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1teXFxcXFxcXFxdXFwnJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdbXmEtekEtWl8wLTldKFxcXFwtfFxcXFwrKT9cXFxcZCsoXFxcXC5cXFxcZCt8XFxcXC9cXFxcZCspPygoZHxlfGZ8bHxzKShcXFxcK3xcXFxcLSk/XFxcXGQrKT8nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVFlQRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICBiZWdpbjogJ1xcXFxiW0EtWl1bXFxcXHdcXCddKicsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDT05UQUlORVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29udGFpbmVyJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7Y2xhc3NOYW1lOiAndHlwZScsIGJlZ2luOiAnXFxcXGJbQS1aXVtcXFxcd10qKFxcXFwoKFxcXFwuXFxcXC58LHxcXFxcdyspXFxcXCkpPyd9LFxuICAgICAge2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdbX2Etel1bXFxcXHdcXCddKid9XG4gICAgXVxuICB9O1xuICB2YXIgQ09OVEFJTkVSMiA9IHtcbiAgICBjbGFzc05hbWU6ICdjb250YWluZXInLFxuICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgIGNvbnRhaW5zOiBDT05UQUlORVIuY29udGFpbnNcbiAgfVxuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAnbGV0IGluIGlmIHRoZW4gZWxzZSBjYXNlIG9mIHdoZXJlIGRvIG1vZHVsZSBpbXBvcnQgaGlkaW5nIHF1YWxpZmllZCB0eXBlIGRhdGEgJyArXG4gICAgICAnbmV3dHlwZSBkZXJpdmluZyBjbGFzcyBpbnN0YW5jZSBub3QgYXMgZm9yZWlnbiBjY2FsbCBzYWZlIHVuc2FmZScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnLS0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICd7LSMnLCBlbmQ6ICcjLX0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgY29udGFpbnM6IFsnc2VsZiddLFxuICAgICAgICBiZWdpbjogJ3stJywgZW5kOiAnLX0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcXFxzK1xcJycsIGVuZDogJ1xcJycsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaW1wb3J0JyxcbiAgICAgICAgYmVnaW46ICdcXFxcYmltcG9ydCcsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2ltcG9ydCBxdWFsaWZpZWQgYXMgaGlkaW5nJyxcbiAgICAgICAgY29udGFpbnM6IFtDT05UQUlORVJdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFdcXFxcLnw7J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbW9kdWxlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYm1vZHVsZScsIGVuZDogJ3doZXJlJyxcbiAgICAgICAga2V5d29yZHM6ICdtb2R1bGUgd2hlcmUnLFxuICAgICAgICBjb250YWluczogW0NPTlRBSU5FUl0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcV1xcXFwufDsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoY2xhc3N8aW5zdGFuY2UpJywgZW5kOiAnd2hlcmUnLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIHdoZXJlIGluc3RhbmNlJyxcbiAgICAgICAgY29udGFpbnM6IFtUWVBFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndHlwZWRlZicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoZGF0YXwobmV3KT90eXBlKScsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2RhdGEgdHlwZSBuZXd0eXBlIGRlcml2aW5nJyxcbiAgICAgICAgY29udGFpbnM6IFtUWVBFLCBDT05UQUlORVIsIENPTlRBSU5FUjJdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGViYW5nJyxcbiAgICAgICAgYmVnaW46ICcjIVxcXFwvdXNyXFxcXC9iaW5cXFxcL2VudlxcIHJ1bmhhc2tlbGwnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIFRZUEUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdeW19hLXpdW1xcXFx3XFwnXSonXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJ2YXIgaGxqcyA9IG5ldyBmdW5jdGlvbigpIHtcblxuICAvKiBVdGlsaXR5IGZ1bmN0aW9ucyAqL1xuXG4gIGZ1bmN0aW9uIGVzY2FwZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8mL2dtLCAnJmFtcDsnKS5yZXBsYWNlKC88L2dtLCAnJmx0OycpLnJlcGxhY2UoLz4vZ20sICcmZ3Q7Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kQ29kZShwcmUpIHtcbiAgICBmb3IgKHZhciBub2RlID0gcHJlLmZpcnN0Q2hpbGQ7IG5vZGU7IG5vZGUgPSBub2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PSAnQ09ERScpXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgaWYgKCEobm9kZS5ub2RlVHlwZSA9PSAzICYmIG5vZGUubm9kZVZhbHVlLm1hdGNoKC9cXHMrLykpKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBibG9ja1RleHQoYmxvY2ssIGlnbm9yZU5ld0xpbmVzKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChibG9jay5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PSAzKSB7XG4gICAgICAgIHJldHVybiBpZ25vcmVOZXdMaW5lcyA/IG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xcbi9nLCAnJykgOiBub2RlLm5vZGVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm5vZGVOYW1lID09ICdCUicpIHtcbiAgICAgICAgcmV0dXJuICdcXG4nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJsb2NrVGV4dChub2RlLCBpZ25vcmVOZXdMaW5lcyk7XG4gICAgfSkuam9pbignJyk7XG4gIH1cblxuICBmdW5jdGlvbiBibG9ja0xhbmd1YWdlKGJsb2NrKSB7XG4gICAgdmFyIGNsYXNzZXMgPSAoYmxvY2suY2xhc3NOYW1lICsgJyAnICsgYmxvY2sucGFyZW50Tm9kZS5jbGFzc05hbWUpLnNwbGl0KC9cXHMrLyk7XG4gICAgY2xhc3NlcyA9IGNsYXNzZXMubWFwKGZ1bmN0aW9uKGMpIHtyZXR1cm4gYy5yZXBsYWNlKC9ebGFuZ3VhZ2UtLywgJycpfSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGFuZ3VhZ2VzW2NsYXNzZXNbaV1dIHx8IGNsYXNzZXNbaV0gPT0gJ25vLWhpZ2hsaWdodCcpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXNbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyogU3RyZWFtIG1lcmdpbmcgKi9cblxuICBmdW5jdGlvbiBub2RlU3RyZWFtKG5vZGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgKGZ1bmN0aW9uIF9ub2RlU3RyZWFtKG5vZGUsIG9mZnNldCkge1xuICAgICAgZm9yICh2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7IGNoaWxkOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PSAzKVxuICAgICAgICAgIG9mZnNldCArPSBjaGlsZC5ub2RlVmFsdWUubGVuZ3RoO1xuICAgICAgICBlbHNlIGlmIChjaGlsZC5ub2RlTmFtZSA9PSAnQlInKVxuICAgICAgICAgIG9mZnNldCArPSAxO1xuICAgICAgICBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgZXZlbnQ6ICdzdGFydCcsXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgIG5vZGU6IGNoaWxkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb2Zmc2V0ID0gX25vZGVTdHJlYW0oY2hpbGQsIG9mZnNldCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgZXZlbnQ6ICdzdG9wJyxcbiAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgICAgICAgbm9kZTogY2hpbGRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICB9KShub2RlLCAwKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VTdHJlYW1zKHN0cmVhbTEsIHN0cmVhbTIsIHZhbHVlKSB7XG4gICAgdmFyIHByb2Nlc3NlZCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBub2RlU3RhY2sgPSBbXTtcblxuICAgIGZ1bmN0aW9uIHNlbGVjdFN0cmVhbSgpIHtcbiAgICAgIGlmIChzdHJlYW0xLmxlbmd0aCAmJiBzdHJlYW0yLmxlbmd0aCkge1xuICAgICAgICBpZiAoc3RyZWFtMVswXS5vZmZzZXQgIT0gc3RyZWFtMlswXS5vZmZzZXQpXG4gICAgICAgICAgcmV0dXJuIChzdHJlYW0xWzBdLm9mZnNldCA8IHN0cmVhbTJbMF0ub2Zmc2V0KSA/IHN0cmVhbTEgOiBzdHJlYW0yO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgIFRvIGF2b2lkIHN0YXJ0aW5nIHRoZSBzdHJlYW0ganVzdCBiZWZvcmUgaXQgc2hvdWxkIHN0b3AgdGhlIG9yZGVyIGlzXG4gICAgICAgICAgZW5zdXJlZCB0aGF0IHN0cmVhbTEgYWx3YXlzIHN0YXJ0cyBmaXJzdCBhbmQgY2xvc2VzIGxhc3Q6XG5cbiAgICAgICAgICBpZiAoZXZlbnQxID09ICdzdGFydCcgJiYgZXZlbnQyID09ICdzdGFydCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMTtcbiAgICAgICAgICBpZiAoZXZlbnQxID09ICdzdGFydCcgJiYgZXZlbnQyID09ICdzdG9wJylcbiAgICAgICAgICAgIHJldHVybiBzdHJlYW0yO1xuICAgICAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTE7XG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RvcCcgJiYgZXZlbnQyID09ICdzdG9wJylcbiAgICAgICAgICAgIHJldHVybiBzdHJlYW0yO1xuXG4gICAgICAgICAgLi4uIHdoaWNoIGlzIGNvbGxhcHNlZCB0bzpcbiAgICAgICAgICAqL1xuICAgICAgICAgIHJldHVybiBzdHJlYW0yWzBdLmV2ZW50ID09ICdzdGFydCcgPyBzdHJlYW0xIDogc3RyZWFtMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbTEubGVuZ3RoID8gc3RyZWFtMSA6IHN0cmVhbTI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb3Blbihub2RlKSB7XG4gICAgICBmdW5jdGlvbiBhdHRyX3N0cihhKSB7cmV0dXJuICcgJyArIGEubm9kZU5hbWUgKyAnPVwiJyArIGVzY2FwZShhLnZhbHVlKSArICdcIid9O1xuICAgICAgcmV0dXJuICc8JyArIG5vZGUubm9kZU5hbWUgKyBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwobm9kZS5hdHRyaWJ1dGVzLCBhdHRyX3N0cikuam9pbignJykgKyAnPic7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0cmVhbTEubGVuZ3RoIHx8IHN0cmVhbTIubGVuZ3RoKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHNlbGVjdFN0cmVhbSgpLnNwbGljZSgwLCAxKVswXTtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGUodmFsdWUuc3Vic3RyKHByb2Nlc3NlZCwgY3VycmVudC5vZmZzZXQgLSBwcm9jZXNzZWQpKTtcbiAgICAgIHByb2Nlc3NlZCA9IGN1cnJlbnQub2Zmc2V0O1xuICAgICAgaWYgKCBjdXJyZW50LmV2ZW50ID09ICdzdGFydCcpIHtcbiAgICAgICAgcmVzdWx0ICs9IG9wZW4oY3VycmVudC5ub2RlKTtcbiAgICAgICAgbm9kZVN0YWNrLnB1c2goY3VycmVudC5ub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5ldmVudCA9PSAnc3RvcCcpIHtcbiAgICAgICAgdmFyIG5vZGUsIGkgPSBub2RlU3RhY2subGVuZ3RoO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICAgIG5vZGUgPSBub2RlU3RhY2tbaV07XG4gICAgICAgICAgcmVzdWx0ICs9ICgnPC8nICsgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgJz4nKTtcbiAgICAgICAgfSB3aGlsZSAobm9kZSAhPSBjdXJyZW50Lm5vZGUpO1xuICAgICAgICBub2RlU3RhY2suc3BsaWNlKGksIDEpO1xuICAgICAgICB3aGlsZSAoaSA8IG5vZGVTdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICByZXN1bHQgKz0gb3Blbihub2RlU3RhY2tbaV0pO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0ICsgZXNjYXBlKHZhbHVlLnN1YnN0cihwcm9jZXNzZWQpKTtcbiAgfVxuXG4gIC8qIEluaXRpYWxpemF0aW9uICovXG5cbiAgZnVuY3Rpb24gY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKSB7XG5cbiAgICBmdW5jdGlvbiBsYW5nUmUodmFsdWUsIGdsb2JhbCkge1xuICAgICAgcmV0dXJuIFJlZ0V4cChcbiAgICAgICAgdmFsdWUsXG4gICAgICAgICdtJyArIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlID8gJ2knIDogJycpICsgKGdsb2JhbCA/ICdnJyA6ICcnKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21waWxlTW9kZShtb2RlLCBwYXJlbnQpIHtcbiAgICAgIGlmIChtb2RlLmNvbXBpbGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtb2RlLmNvbXBpbGVkID0gdHJ1ZTtcblxuICAgICAgdmFyIGtleXdvcmRzID0gW107IC8vIHVzZWQgbGF0ZXIgd2l0aCBiZWdpbldpdGhLZXl3b3JkIGJ1dCBmaWxsZWQgYXMgYSBzaWRlLWVmZmVjdCBvZiBrZXl3b3JkcyBjb21waWxhdGlvblxuICAgICAgaWYgKG1vZGUua2V5d29yZHMpIHtcbiAgICAgICAgdmFyIGNvbXBpbGVkX2tleXdvcmRzID0ge307XG5cbiAgICAgICAgZnVuY3Rpb24gZmxhdHRlbihjbGFzc05hbWUsIHN0cikge1xuICAgICAgICAgIHN0ci5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24oa3cpIHtcbiAgICAgICAgICAgIHZhciBwYWlyID0ga3cuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgIGNvbXBpbGVkX2tleXdvcmRzW3BhaXJbMF1dID0gW2NsYXNzTmFtZSwgcGFpclsxXSA/IE51bWJlcihwYWlyWzFdKSA6IDFdO1xuICAgICAgICAgICAga2V5d29yZHMucHVzaChwYWlyWzBdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGUubGV4ZW1zUmUgPSBsYW5nUmUobW9kZS5sZXhlbXMgfHwgaGxqcy5JREVOVF9SRSwgdHJ1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kZS5rZXl3b3JkcyA9PSAnc3RyaW5nJykgeyAvLyBzdHJpbmdcbiAgICAgICAgICBmbGF0dGVuKCdrZXl3b3JkJywgbW9kZS5rZXl3b3JkcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKHZhciBjbGFzc05hbWUgaW4gbW9kZS5rZXl3b3Jkcykge1xuICAgICAgICAgICAgaWYgKCFtb2RlLmtleXdvcmRzLmhhc093blByb3BlcnR5KGNsYXNzTmFtZSkpXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgZmxhdHRlbihjbGFzc05hbWUsIG1vZGUua2V5d29yZHNbY2xhc3NOYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1vZGUua2V5d29yZHMgPSBjb21waWxlZF9rZXl3b3JkcztcbiAgICAgIH1cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKG1vZGUuYmVnaW5XaXRoS2V5d29yZCkge1xuICAgICAgICAgIG1vZGUuYmVnaW4gPSAnXFxcXGIoJyArIGtleXdvcmRzLmpvaW4oJ3wnKSArICcpXFxcXHMnO1xuICAgICAgICB9XG4gICAgICAgIG1vZGUuYmVnaW5SZSA9IGxhbmdSZShtb2RlLmJlZ2luID8gbW9kZS5iZWdpbiA6ICdcXFxcQnxcXFxcYicpO1xuICAgICAgICBpZiAoIW1vZGUuZW5kICYmICFtb2RlLmVuZHNXaXRoUGFyZW50KVxuICAgICAgICAgIG1vZGUuZW5kID0gJ1xcXFxCfFxcXFxiJztcbiAgICAgICAgaWYgKG1vZGUuZW5kKVxuICAgICAgICAgIG1vZGUuZW5kUmUgPSBsYW5nUmUobW9kZS5lbmQpO1xuICAgICAgICBtb2RlLnRlcm1pbmF0b3JfZW5kID0gbW9kZS5lbmQgfHwgJyc7XG4gICAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50ICYmIHBhcmVudC50ZXJtaW5hdG9yX2VuZClcbiAgICAgICAgICBtb2RlLnRlcm1pbmF0b3JfZW5kICs9IChtb2RlLmVuZCA/ICd8JyA6ICcnKSArIHBhcmVudC50ZXJtaW5hdG9yX2VuZDtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmlsbGVnYWwpXG4gICAgICAgIG1vZGUuaWxsZWdhbFJlID0gbGFuZ1JlKG1vZGUuaWxsZWdhbCk7XG4gICAgICBpZiAobW9kZS5yZWxldmFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgbW9kZS5yZWxldmFuY2UgPSAxO1xuICAgICAgaWYgKCFtb2RlLmNvbnRhaW5zKSB7XG4gICAgICAgIG1vZGUuY29udGFpbnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZS5jb250YWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobW9kZS5jb250YWluc1tpXSA9PSAnc2VsZicpIHtcbiAgICAgICAgICBtb2RlLmNvbnRhaW5zW2ldID0gbW9kZTtcbiAgICAgICAgfVxuICAgICAgICBjb21waWxlTW9kZShtb2RlLmNvbnRhaW5zW2ldLCBtb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLnN0YXJ0cykge1xuICAgICAgICBjb21waWxlTW9kZShtb2RlLnN0YXJ0cywgcGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRlcm1pbmF0b3JzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGVybWluYXRvcnMucHVzaChtb2RlLmNvbnRhaW5zW2ldLmJlZ2luKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLnRlcm1pbmF0b3JfZW5kKSB7XG4gICAgICAgIHRlcm1pbmF0b3JzLnB1c2gobW9kZS50ZXJtaW5hdG9yX2VuZCk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5pbGxlZ2FsKSB7XG4gICAgICAgIHRlcm1pbmF0b3JzLnB1c2gobW9kZS5pbGxlZ2FsKTtcbiAgICAgIH1cbiAgICAgIG1vZGUudGVybWluYXRvcnMgPSB0ZXJtaW5hdG9ycy5sZW5ndGggPyBsYW5nUmUodGVybWluYXRvcnMuam9pbignfCcpLCB0cnVlKSA6IHtleGVjOiBmdW5jdGlvbihzKSB7cmV0dXJuIG51bGw7fX07XG4gICAgfVxuXG4gICAgY29tcGlsZU1vZGUobGFuZ3VhZ2UpO1xuICB9XG5cbiAgLypcbiAgQ29yZSBoaWdobGlnaHRpbmcgZnVuY3Rpb24uIEFjY2VwdHMgYSBsYW5ndWFnZSBuYW1lIGFuZCBhIHN0cmluZyB3aXRoIHRoZVxuICBjb2RlIHRvIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cbiAgLSByZWxldmFuY2UgKGludClcbiAgLSBrZXl3b3JkX2NvdW50IChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcblxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHQobGFuZ3VhZ2VfbmFtZSwgdmFsdWUpIHtcblxuICAgIGZ1bmN0aW9uIHN1Yk1vZGUobGV4ZW0sIG1vZGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZS5jb250YWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbWF0Y2ggPSBtb2RlLmNvbnRhaW5zW2ldLmJlZ2luUmUuZXhlYyhsZXhlbSk7XG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5pbmRleCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZGUuY29udGFpbnNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZk1vZGUobW9kZSwgbGV4ZW0pIHtcbiAgICAgIGlmIChtb2RlLmVuZCAmJiBtb2RlLmVuZFJlLnRlc3QobGV4ZW0pKSB7XG4gICAgICAgIHJldHVybiBtb2RlO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVuZE9mTW9kZShtb2RlLnBhcmVudCwgbGV4ZW0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzSWxsZWdhbChsZXhlbSwgbW9kZSkge1xuICAgICAgcmV0dXJuIG1vZGUuaWxsZWdhbCAmJiBtb2RlLmlsbGVnYWxSZS50ZXN0KGxleGVtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrZXl3b3JkTWF0Y2gobW9kZSwgbWF0Y2gpIHtcbiAgICAgIHZhciBtYXRjaF9zdHIgPSBsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlID8gbWF0Y2hbMF0udG9Mb3dlckNhc2UoKSA6IG1hdGNoWzBdO1xuICAgICAgcmV0dXJuIG1vZGUua2V5d29yZHMuaGFzT3duUHJvcGVydHkobWF0Y2hfc3RyKSAmJiBtb2RlLmtleXdvcmRzW21hdGNoX3N0cl07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0tleXdvcmRzKCkge1xuICAgICAgdmFyIGJ1ZmZlciA9IGVzY2FwZShtb2RlX2J1ZmZlcik7XG4gICAgICBpZiAoIXRvcC5rZXl3b3JkcylcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgIHZhciByZXN1bHQgPSAnJztcbiAgICAgIHZhciBsYXN0X2luZGV4ID0gMDtcbiAgICAgIHRvcC5sZXhlbXNSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIG1hdGNoID0gdG9wLmxleGVtc1JlLmV4ZWMoYnVmZmVyKTtcbiAgICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICByZXN1bHQgKz0gYnVmZmVyLnN1YnN0cihsYXN0X2luZGV4LCBtYXRjaC5pbmRleCAtIGxhc3RfaW5kZXgpO1xuICAgICAgICB2YXIga2V5d29yZF9tYXRjaCA9IGtleXdvcmRNYXRjaCh0b3AsIG1hdGNoKTtcbiAgICAgICAgaWYgKGtleXdvcmRfbWF0Y2gpIHtcbiAgICAgICAgICBrZXl3b3JkX2NvdW50ICs9IGtleXdvcmRfbWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0ICs9ICc8c3BhbiBjbGFzcz1cIicrIGtleXdvcmRfbWF0Y2hbMF0gKydcIj4nICsgbWF0Y2hbMF0gKyAnPC9zcGFuPic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ICs9IG1hdGNoWzBdO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RfaW5kZXggPSB0b3AubGV4ZW1zUmUubGFzdEluZGV4O1xuICAgICAgICBtYXRjaCA9IHRvcC5sZXhlbXNSZS5leGVjKGJ1ZmZlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0ICsgYnVmZmVyLnN1YnN0cihsYXN0X2luZGV4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSB7XG4gICAgICBpZiAodG9wLnN1Ykxhbmd1YWdlICYmICFsYW5ndWFnZXNbdG9wLnN1Ykxhbmd1YWdlXSkge1xuICAgICAgICByZXR1cm4gZXNjYXBlKG1vZGVfYnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHQgPSB0b3Auc3ViTGFuZ3VhZ2UgPyBoaWdobGlnaHQodG9wLnN1Ykxhbmd1YWdlLCBtb2RlX2J1ZmZlcikgOiBoaWdobGlnaHRBdXRvKG1vZGVfYnVmZmVyKTtcbiAgICAgIC8vIENvdW50aW5nIGVtYmVkZGVkIGxhbmd1YWdlIHNjb3JlIHRvd2FyZHMgdGhlIGhvc3QgbGFuZ3VhZ2UgbWF5IGJlIGRpc2FibGVkXG4gICAgICAvLyB3aXRoIHplcm9pbmcgdGhlIGNvbnRhaW5pbmcgbW9kZSByZWxldmFuY2UuIFVzZWNhc2UgaW4gcG9pbnQgaXMgTWFya2Rvd24gdGhhdFxuICAgICAgLy8gYWxsb3dzIFhNTCBldmVyeXdoZXJlIGFuZCBtYWtlcyBldmVyeSBYTUwgc25pcHBldCB0byBoYXZlIGEgbXVjaCBsYXJnZXIgTWFya2Rvd25cbiAgICAgIC8vIHNjb3JlLlxuICAgICAgaWYgKHRvcC5yZWxldmFuY2UgPiAwKSB7XG4gICAgICAgIGtleXdvcmRfY291bnQgKz0gcmVzdWx0LmtleXdvcmRfY291bnQ7XG4gICAgICAgIHJlbGV2YW5jZSArPSByZXN1bHQucmVsZXZhbmNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyByZXN1bHQubGFuZ3VhZ2UgICsgJ1wiPicgKyByZXN1bHQudmFsdWUgKyAnPC9zcGFuPic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0J1ZmZlcigpIHtcbiAgICAgIHJldHVybiB0b3Auc3ViTGFuZ3VhZ2UgIT09IHVuZGVmaW5lZCA/IHByb2Nlc3NTdWJMYW5ndWFnZSgpIDogcHJvY2Vzc0tleXdvcmRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnROZXdNb2RlKG1vZGUsIGxleGVtKSB7XG4gICAgICB2YXIgbWFya3VwID0gbW9kZS5jbGFzc05hbWU/ICc8c3BhbiBjbGFzcz1cIicgKyBtb2RlLmNsYXNzTmFtZSArICdcIj4nOiAnJztcbiAgICAgIGlmIChtb2RlLnJldHVybkJlZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUuZXhjbHVkZUJlZ2luKSB7XG4gICAgICAgIHJlc3VsdCArPSBlc2NhcGUobGV4ZW0pICsgbWFya3VwO1xuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9IG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSBsZXhlbTtcbiAgICAgIH1cbiAgICAgIHRvcCA9IE9iamVjdC5jcmVhdGUobW9kZSwge3BhcmVudDoge3ZhbHVlOiB0b3B9fSk7XG4gICAgICByZWxldmFuY2UgKz0gbW9kZS5yZWxldmFuY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0xleGVtKGJ1ZmZlciwgbGV4ZW0pIHtcbiAgICAgIG1vZGVfYnVmZmVyICs9IGJ1ZmZlcjtcbiAgICAgIGlmIChsZXhlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3X21vZGUgPSBzdWJNb2RlKGxleGVtLCB0b3ApO1xuICAgICAgaWYgKG5ld19tb2RlKSB7XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIHN0YXJ0TmV3TW9kZShuZXdfbW9kZSwgbGV4ZW0pO1xuICAgICAgICByZXR1cm4gbmV3X21vZGUucmV0dXJuQmVnaW4gPyAwIDogbGV4ZW0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5kX21vZGUgPSBlbmRPZk1vZGUodG9wLCBsZXhlbSk7XG4gICAgICBpZiAoZW5kX21vZGUpIHtcbiAgICAgICAgaWYgKCEoZW5kX21vZGUucmV0dXJuRW5kIHx8IGVuZF9tb2RlLmV4Y2x1ZGVFbmQpKSB7XG4gICAgICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGlmICh0b3AuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gJzwvc3Bhbj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b3AgPSB0b3AucGFyZW50O1xuICAgICAgICB9IHdoaWxlICh0b3AgIT0gZW5kX21vZGUucGFyZW50KTtcbiAgICAgICAgaWYgKGVuZF9tb2RlLmV4Y2x1ZGVFbmQpIHtcbiAgICAgICAgICByZXN1bHQgKz0gZXNjYXBlKGxleGVtKTtcbiAgICAgICAgfVxuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgICBpZiAoZW5kX21vZGUuc3RhcnRzKSB7XG4gICAgICAgICAgc3RhcnROZXdNb2RlKGVuZF9tb2RlLnN0YXJ0cywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmRfbW9kZS5yZXR1cm5FbmQgPyAwIDogbGV4ZW0ubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNJbGxlZ2FsKGxleGVtLCB0b3ApKVxuICAgICAgICB0aHJvdyAnSWxsZWdhbCc7XG5cbiAgICAgIC8qXG4gICAgICBQYXJzZXIgc2hvdWxkIG5vdCByZWFjaCB0aGlzIHBvaW50IGFzIGFsbCB0eXBlcyBvZiBsZXhlbXMgc2hvdWxkIGJlIGNhdWdodFxuICAgICAgZWFybGllciwgYnV0IGlmIGl0IGRvZXMgZHVlIHRvIHNvbWUgYnVnIG1ha2Ugc3VyZSBpdCBhZHZhbmNlcyBhdCBsZWFzdCBvbmVcbiAgICAgIGNoYXJhY3RlciBmb3J3YXJkIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcGluZy5cbiAgICAgICovXG4gICAgICBtb2RlX2J1ZmZlciArPSBsZXhlbTtcbiAgICAgIHJldHVybiBsZXhlbS5sZW5ndGggfHwgMTtcbiAgICB9XG5cbiAgICB2YXIgbGFuZ3VhZ2UgPSBsYW5ndWFnZXNbbGFuZ3VhZ2VfbmFtZV07XG4gICAgY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKTtcbiAgICB2YXIgdG9wID0gbGFuZ3VhZ2U7XG4gICAgdmFyIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgdmFyIHJlbGV2YW5jZSA9IDA7XG4gICAgdmFyIGtleXdvcmRfY291bnQgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB0cnkge1xuICAgICAgdmFyIG1hdGNoLCBjb3VudCwgaW5kZXggPSAwO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdG9wLnRlcm1pbmF0b3JzLmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgICBtYXRjaCA9IHRvcC50ZXJtaW5hdG9ycy5leGVjKHZhbHVlKTtcbiAgICAgICAgaWYgKCFtYXRjaClcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY291bnQgPSBwcm9jZXNzTGV4ZW0odmFsdWUuc3Vic3RyKGluZGV4LCBtYXRjaC5pbmRleCAtIGluZGV4KSwgbWF0Y2hbMF0pO1xuICAgICAgICBpbmRleCA9IG1hdGNoLmluZGV4ICsgY291bnQ7XG4gICAgICB9XG4gICAgICBwcm9jZXNzTGV4ZW0odmFsdWUuc3Vic3RyKGluZGV4KSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlbGV2YW5jZTogcmVsZXZhbmNlLFxuICAgICAgICBrZXl3b3JkX2NvdW50OiBrZXl3b3JkX2NvdW50LFxuICAgICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2VfbmFtZVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSA9PSAnSWxsZWdhbCcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAga2V5d29yZF9jb3VudDogMCxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKHZhbHVlKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICBIaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBkZXRlY3Rpb24uIEFjY2VwdHMgYSBzdHJpbmcgd2l0aCB0aGUgY29kZSB0b1xuICBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gbGFuZ3VhZ2UgKGRldGVjdGVkIGxhbmd1YWdlKVxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIGtleXdvcmRfY291bnQgKGludClcbiAgLSB2YWx1ZSAoYW4gSFRNTCBzdHJpbmcgd2l0aCBoaWdobGlnaHRpbmcgbWFya3VwKVxuICAtIHNlY29uZF9iZXN0IChvYmplY3Qgd2l0aCB0aGUgc2FtZSBzdHJ1Y3R1cmUgZm9yIHNlY29uZC1iZXN0IGhldXJpc3RpY2FsbHlcbiAgICBkZXRlY3RlZCBsYW5ndWFnZSwgbWF5IGJlIGFic2VudClcblxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRBdXRvKHRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAga2V5d29yZF9jb3VudDogMCxcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIHZhbHVlOiBlc2NhcGUodGV4dClcbiAgICB9O1xuICAgIHZhciBzZWNvbmRfYmVzdCA9IHJlc3VsdDtcbiAgICBmb3IgKHZhciBrZXkgaW4gbGFuZ3VhZ2VzKSB7XG4gICAgICBpZiAoIWxhbmd1YWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIHZhciBjdXJyZW50ID0gaGlnaGxpZ2h0KGtleSwgdGV4dCk7XG4gICAgICBjdXJyZW50Lmxhbmd1YWdlID0ga2V5O1xuICAgICAgaWYgKGN1cnJlbnQua2V5d29yZF9jb3VudCArIGN1cnJlbnQucmVsZXZhbmNlID4gc2Vjb25kX2Jlc3Qua2V5d29yZF9jb3VudCArIHNlY29uZF9iZXN0LnJlbGV2YW5jZSkge1xuICAgICAgICBzZWNvbmRfYmVzdCA9IGN1cnJlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudC5rZXl3b3JkX2NvdW50ICsgY3VycmVudC5yZWxldmFuY2UgPiByZXN1bHQua2V5d29yZF9jb3VudCArIHJlc3VsdC5yZWxldmFuY2UpIHtcbiAgICAgICAgc2Vjb25kX2Jlc3QgPSByZXN1bHQ7XG4gICAgICAgIHJlc3VsdCA9IGN1cnJlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzZWNvbmRfYmVzdC5sYW5ndWFnZSkge1xuICAgICAgcmVzdWx0LnNlY29uZF9iZXN0ID0gc2Vjb25kX2Jlc3Q7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKlxuICBQb3N0LXByb2Nlc3Npbmcgb2YgdGhlIGhpZ2hsaWdodGVkIG1hcmt1cDpcblxuICAtIHJlcGxhY2UgVEFCcyB3aXRoIHNvbWV0aGluZyBtb3JlIHVzZWZ1bFxuICAtIHJlcGxhY2UgcmVhbCBsaW5lLWJyZWFrcyB3aXRoICc8YnI+JyBmb3Igbm9uLXByZSBjb250YWluZXJzXG5cbiAgKi9cbiAgZnVuY3Rpb24gZml4TWFya3VwKHZhbHVlLCB0YWJSZXBsYWNlLCB1c2VCUikge1xuICAgIGlmICh0YWJSZXBsYWNlKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL14oKDxbXj5dKz58XFx0KSspL2dtLCBmdW5jdGlvbihtYXRjaCwgcDEsIG9mZnNldCwgcykge1xuICAgICAgICByZXR1cm4gcDEucmVwbGFjZSgvXFx0L2csIHRhYlJlcGxhY2UpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh1c2VCUikge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLypcbiAgQXBwbGllcyBoaWdobGlnaHRpbmcgdG8gYSBET00gbm9kZSBjb250YWluaW5nIGNvZGUuIEFjY2VwdHMgYSBET00gbm9kZSBhbmRcbiAgdHdvIG9wdGlvbmFsIHBhcmFtZXRlcnMgZm9yIGZpeE1hcmt1cC5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QmxvY2soYmxvY2ssIHRhYlJlcGxhY2UsIHVzZUJSKSB7XG4gICAgdmFyIHRleHQgPSBibG9ja1RleHQoYmxvY2ssIHVzZUJSKTtcbiAgICB2YXIgbGFuZ3VhZ2UgPSBibG9ja0xhbmd1YWdlKGJsb2NrKTtcbiAgICBpZiAobGFuZ3VhZ2UgPT0gJ25vLWhpZ2hsaWdodCcpXG4gICAgICAgIHJldHVybjtcbiAgICB2YXIgcmVzdWx0ID0gbGFuZ3VhZ2UgPyBoaWdobGlnaHQobGFuZ3VhZ2UsIHRleHQpIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcbiAgICBsYW5ndWFnZSA9IHJlc3VsdC5sYW5ndWFnZTtcbiAgICB2YXIgb3JpZ2luYWwgPSBub2RlU3RyZWFtKGJsb2NrKTtcbiAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICB2YXIgcHJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XG4gICAgICBwcmUuaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgICAgcmVzdWx0LnZhbHVlID0gbWVyZ2VTdHJlYW1zKG9yaWdpbmFsLCBub2RlU3RyZWFtKHByZSksIHRleHQpO1xuICAgIH1cbiAgICByZXN1bHQudmFsdWUgPSBmaXhNYXJrdXAocmVzdWx0LnZhbHVlLCB0YWJSZXBsYWNlLCB1c2VCUik7XG5cbiAgICB2YXIgY2xhc3NfbmFtZSA9IGJsb2NrLmNsYXNzTmFtZTtcbiAgICBpZiAoIWNsYXNzX25hbWUubWF0Y2goJyhcXFxcc3xeKShsYW5ndWFnZS0pPycgKyBsYW5ndWFnZSArICcoXFxcXHN8JCknKSkge1xuICAgICAgY2xhc3NfbmFtZSA9IGNsYXNzX25hbWUgPyAoY2xhc3NfbmFtZSArICcgJyArIGxhbmd1YWdlKSA6IGxhbmd1YWdlO1xuICAgIH1cbiAgICBibG9jay5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgYmxvY2suY2xhc3NOYW1lID0gY2xhc3NfbmFtZTtcbiAgICBibG9jay5yZXN1bHQgPSB7XG4gICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICBrdzogcmVzdWx0LmtleXdvcmRfY291bnQsXG4gICAgICByZTogcmVzdWx0LnJlbGV2YW5jZVxuICAgIH07XG4gICAgaWYgKHJlc3VsdC5zZWNvbmRfYmVzdCkge1xuICAgICAgYmxvY2suc2Vjb25kX2Jlc3QgPSB7XG4gICAgICAgIGxhbmd1YWdlOiByZXN1bHQuc2Vjb25kX2Jlc3QubGFuZ3VhZ2UsXG4gICAgICAgIGt3OiByZXN1bHQuc2Vjb25kX2Jlc3Qua2V5d29yZF9jb3VudCxcbiAgICAgICAgcmU6IHJlc3VsdC5zZWNvbmRfYmVzdC5yZWxldmFuY2VcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLypcbiAgQXBwbGllcyBoaWdobGlnaHRpbmcgdG8gYWxsIDxwcmU+PGNvZGU+Li48L2NvZGU+PC9wcmU+IGJsb2NrcyBvbiBhIHBhZ2UuXG4gICovXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmcoKSB7XG4gICAgaWYgKGluaXRIaWdobGlnaHRpbmcuY2FsbGVkKVxuICAgICAgcmV0dXJuO1xuICAgIGluaXRIaWdobGlnaHRpbmcuY2FsbGVkID0gdHJ1ZTtcbiAgICBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3ByZScpLCBmaW5kQ29kZSkuXG4gICAgICBmaWx0ZXIoQm9vbGVhbikuXG4gICAgICBmb3JFYWNoKGZ1bmN0aW9uKGNvZGUpe2hpZ2hsaWdodEJsb2NrKGNvZGUsIGhsanMudGFiUmVwbGFjZSl9KTtcbiAgfVxuXG4gIC8qXG4gIEF0dGFjaGVzIGhpZ2hsaWdodGluZyB0byB0aGUgcGFnZSBsb2FkIGV2ZW50LlxuICAqL1xuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdEhpZ2hsaWdodGluZywgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdEhpZ2hsaWdodGluZywgZmFsc2UpO1xuICB9XG5cbiAgdmFyIGxhbmd1YWdlcyA9IHt9OyAvLyBhIHNob3J0Y3V0IHRvIGF2b2lkIHdyaXRpbmcgXCJ0aGlzLlwiIGV2ZXJ5d2hlcmVcblxuICAvKiBJbnRlcmZhY2UgZGVmaW5pdGlvbiAqL1xuXG4gIHRoaXMuTEFOR1VBR0VTID0gbGFuZ3VhZ2VzO1xuICB0aGlzLmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcbiAgdGhpcy5oaWdobGlnaHRBdXRvID0gaGlnaGxpZ2h0QXV0bztcbiAgdGhpcy5maXhNYXJrdXAgPSBmaXhNYXJrdXA7XG4gIHRoaXMuaGlnaGxpZ2h0QmxvY2sgPSBoaWdobGlnaHRCbG9jaztcbiAgdGhpcy5pbml0SGlnaGxpZ2h0aW5nID0gaW5pdEhpZ2hsaWdodGluZztcbiAgdGhpcy5pbml0SGlnaGxpZ2h0aW5nT25Mb2FkID0gaW5pdEhpZ2hsaWdodGluZ09uTG9hZDtcblxuICAvLyBDb21tb24gcmVnZXhwc1xuICB0aGlzLklERU5UX1JFID0gJ1thLXpBLVpdW2EtekEtWjAtOV9dKic7XG4gIHRoaXMuVU5ERVJTQ09SRV9JREVOVF9SRSA9ICdbYS16QS1aX11bYS16QS1aMC05X10qJztcbiAgdGhpcy5OVU1CRVJfUkUgPSAnXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG4gIHRoaXMuQ19OVU1CRVJfUkUgPSAnKFxcXFxiMFt4WF1bYS1mQS1GMC05XSt8KFxcXFxiXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KSc7IC8vIDB4Li4uLCAwLi4uLCBkZWNpbWFsLCBmbG9hdFxuICB0aGlzLkJJTkFSWV9OVU1CRVJfUkUgPSAnXFxcXGIoMGJbMDFdKyknOyAvLyAwYi4uLlxuICB0aGlzLlJFX1NUQVJURVJTX1JFID0gJyF8IT18IT09fCV8JT18JnwmJnwmPXxcXFxcKnxcXFxcKj18XFxcXCt8XFxcXCs9fCx8XFxcXC58LXwtPXwvfC89fDp8O3w8fDw8fDw8PXw8PXw9fD09fD09PXw+fD49fD4+fD4+PXw+Pj58Pj4+PXxcXFxcP3xcXFxcW3xcXFxce3xcXFxcKHxcXFxcXnxcXFxcXj18XFxcXHx8XFxcXHw9fFxcXFx8XFxcXHx8fic7XG5cbiAgLy8gQ29tbW9uIG1vZGVzXG4gIHRoaXMuQkFDS1NMQVNIX0VTQ0FQRSA9IHtcbiAgICBiZWdpbjogJ1xcXFxcXFxcW1xcXFxzXFxcXFNdJywgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQVBPU19TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIGNvbnRhaW5zOiBbdGhpcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5RVU9URV9TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQ19MSU5FX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJy8vJywgZW5kOiAnJCdcbiAgfTtcbiAgdGhpcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJy9cXFxcKicsIGVuZDogJ1xcXFwqLydcbiAgfTtcbiAgdGhpcy5IQVNIX0NPTU1FTlRfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICB9O1xuICB0aGlzLk5VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkNfTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5DX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5CSU5BUllfTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5CSU5BUllfTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIC8vIFV0aWxpdHkgZnVuY3Rpb25zXG4gIHRoaXMuaW5oZXJpdCA9IGZ1bmN0aW9uKHBhcmVudCwgb2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9XG4gICAgZm9yICh2YXIga2V5IGluIHBhcmVudClcbiAgICAgIHJlc3VsdFtrZXldID0gcGFyZW50W2tleV07XG4gICAgaWYgKG9iailcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopXG4gICAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSgpO1xuaGxqcy5MQU5HVUFHRVNbJ2Jhc2gnXSA9IHJlcXVpcmUoJy4vYmFzaC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2VybGFuZyddID0gcmVxdWlyZSgnLi9lcmxhbmcuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjcyddID0gcmVxdWlyZSgnLi9jcy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2JyYWluZnVjayddID0gcmVxdWlyZSgnLi9icmFpbmZ1Y2suanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydydWJ5J10gPSByZXF1aXJlKCcuL3J1YnkuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydydXN0J10gPSByZXF1aXJlKCcuL3J1c3QuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydyaWInXSA9IHJlcXVpcmUoJy4vcmliLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZGlmZiddID0gcmVxdWlyZSgnLi9kaWZmLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snamF2YXNjcmlwdCddID0gcmVxdWlyZSgnLi9qYXZhc2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZ2xzbCddID0gcmVxdWlyZSgnLi9nbHNsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncnNsJ10gPSByZXF1aXJlKCcuL3JzbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2x1YSddID0gcmVxdWlyZSgnLi9sdWEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd4bWwnXSA9IHJlcXVpcmUoJy4veG1sLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbWFya2Rvd24nXSA9IHJlcXVpcmUoJy4vbWFya2Rvd24uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjc3MnXSA9IHJlcXVpcmUoJy4vY3NzLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbGlzcCddID0gcmVxdWlyZSgnLi9saXNwLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncHJvZmlsZSddID0gcmVxdWlyZSgnLi9wcm9maWxlLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snaHR0cCddID0gcmVxdWlyZSgnLi9odHRwLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snamF2YSddID0gcmVxdWlyZSgnLi9qYXZhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncGhwJ10gPSByZXF1aXJlKCcuL3BocC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2hhc2tlbGwnXSA9IHJlcXVpcmUoJy4vaGFza2VsbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJzFjJ10gPSByZXF1aXJlKCcuLzFjLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncHl0aG9uJ10gPSByZXF1aXJlKCcuL3B5dGhvbi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3NtYWxsdGFsayddID0gcmVxdWlyZSgnLi9zbWFsbHRhbGsuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd0ZXgnXSA9IHJlcXVpcmUoJy4vdGV4LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYWN0aW9uc2NyaXB0J10gPSByZXF1aXJlKCcuL2FjdGlvbnNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3NxbCddID0gcmVxdWlyZSgnLi9zcWwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd2YWxhJ10gPSByZXF1aXJlKCcuL3ZhbGEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydpbmknXSA9IHJlcXVpcmUoJy4vaW5pLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZCddID0gcmVxdWlyZSgnLi9kLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXhhcHRhJ10gPSByZXF1aXJlKCcuL2F4YXB0YS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3BlcmwnXSA9IHJlcXVpcmUoJy4vcGVybC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3NjYWxhJ10gPSByZXF1aXJlKCcuL3NjYWxhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY21ha2UnXSA9IHJlcXVpcmUoJy4vY21ha2UuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydvYmplY3RpdmVjJ10gPSByZXF1aXJlKCcuL29iamVjdGl2ZWMuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydhdnJhc20nXSA9IHJlcXVpcmUoJy4vYXZyYXNtLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndmhkbCddID0gcmVxdWlyZSgnLi92aGRsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY29mZmVlc2NyaXB0J10gPSByZXF1aXJlKCcuL2NvZmZlZXNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ25naW54J10gPSByZXF1aXJlKCcuL25naW54LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZXJsYW5nLXJlcGwnXSA9IHJlcXVpcmUoJy4vZXJsYW5nLXJlcGwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydyJ10gPSByZXF1aXJlKCcuL3IuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydqc29uJ10gPSByZXF1aXJlKCcuL2pzb24uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkamFuZ28nXSA9IHJlcXVpcmUoJy4vZGphbmdvLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZGVscGhpJ10gPSByZXF1aXJlKCcuL2RlbHBoaS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3Zic2NyaXB0J10gPSByZXF1aXJlKCcuL3Zic2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbWVsJ10gPSByZXF1aXJlKCcuL21lbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RvcyddID0gcmVxdWlyZSgnLi9kb3MuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydhcGFjaGUnXSA9IHJlcXVpcmUoJy4vYXBhY2hlLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXBwbGVzY3JpcHQnXSA9IHJlcXVpcmUoJy4vYXBwbGVzY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjcHAnXSA9IHJlcXVpcmUoJy4vY3BwLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbWF0bGFiJ10gPSByZXF1aXJlKCcuL21hdGxhYi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3BhcnNlcjMnXSA9IHJlcXVpcmUoJy4vcGFyc2VyMy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2Nsb2p1cmUnXSA9IHJlcXVpcmUoJy4vY2xvanVyZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2dvJ10gPSByZXF1aXJlKCcuL2dvLmpzJykoaGxqcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGhsanM7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgaWxsZWdhbDogJ1xcXFxTJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdGF0dXMnLFxuICAgICAgICBiZWdpbjogJ15IVFRQL1swLTlcXFxcLl0rJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbe2NsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnXFxcXGJcXFxcZHszfVxcXFxiJ31dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZXF1ZXN0JyxcbiAgICAgICAgYmVnaW46ICdeW0EtWl0rICguKj8pIEhUVFAvWzAtOVxcXFwuXSskJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJyAnLCBlbmQ6ICcgJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXHcnLCBlbmQ6ICc6ICcsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbnxcXFxcc3w9JyxcbiAgICAgICAgc3RhcnRzOiB7Y2xhc3NOYW1lOiAnc3RyaW5nJywgZW5kOiAnJCd9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxuXFxcXG4nLFxuICAgICAgICBzdGFydHM6IHtzdWJMYW5ndWFnZTogJycsIGVuZHNXaXRoUGFyZW50OiB0cnVlfVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJzsnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogJ15cXFxcWycsIGVuZDogJ1xcXFxdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2V0dGluZycsXG4gICAgICAgIGJlZ2luOiAnXlthLXowLTlcXFxcW1xcXFxdXy1dK1sgXFxcXHRdKj1bIFxcXFx0XSonLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnb24gb2ZmIHRydWUgZmFsc2UgeWVzIG5vJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgaGxqcy5OVU1CRVJfTU9ERV1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ2ZhbHNlIHN5bmNocm9uaXplZCBpbnQgYWJzdHJhY3QgZmxvYXQgcHJpdmF0ZSBjaGFyIGJvb2xlYW4gc3RhdGljIG51bGwgaWYgY29uc3QgJyArXG4gICAgICAnZm9yIHRydWUgd2hpbGUgbG9uZyB0aHJvdyBzdHJpY3RmcCBmaW5hbGx5IHByb3RlY3RlZCBpbXBvcnQgbmF0aXZlIGZpbmFsIHJldHVybiB2b2lkICcgK1xuICAgICAgJ2VudW0gZWxzZSBicmVhayB0cmFuc2llbnQgbmV3IGNhdGNoIGluc3RhbmNlb2YgYnl0ZSBzdXBlciB2b2xhdGlsZSBjYXNlIGFzc2VydCBzaG9ydCAnICtcbiAgICAgICdwYWNrYWdlIGRlZmF1bHQgZG91YmxlIHB1YmxpYyB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgdGhyb3dzJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jJyxcbiAgICAgICAgYmVnaW46ICcvXFxcXCpcXFxcKicsIGVuZDogJ1xcXFwqLycsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2phdmFkb2N0YWcnLCBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICAgIH1dLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlJyxcbiAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cycsXG4gICAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhbm5vdGF0aW9uJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdpbiBpZiBmb3Igd2hpbGUgZmluYWxseSB2YXIgbmV3IGZ1bmN0aW9uIGRvIHJldHVybiB2b2lkIGVsc2UgYnJlYWsgY2F0Y2ggJyArXG4gICAgICAgICdpbnN0YW5jZW9mIHdpdGggdGhyb3cgY2FzZSBkZWZhdWx0IHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB0eXBlb2YgZGVsZXRlICcgK1xuICAgICAgICAnbGV0IHlpZWxkIGNvbnN0JyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlIG51bGwgdW5kZWZpbmVkIE5hTiBJbmZpbml0eSdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHsgLy8gXCJ2YWx1ZVwiIGNvbnRhaW5lclxuICAgICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICd8XFxcXGIoY2FzZXxyZXR1cm58dGhyb3cpXFxcXGIpXFxcXHMqJyxcbiAgICAgICAga2V5d29yZHM6ICdyZXR1cm4gdGhyb3cgY2FzZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgICAgIGJlZ2luOiAnLycsIGVuZDogJy9bZ2ltXSonLFxuICAgICAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFxcXFxcXFwvJ31dXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IC8vIEU0WFxuICAgICAgICAgICAgYmVnaW46ICc8JywgZW5kOiAnPjsnLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdbQS1aYS16JF9dWzAtOUEtWmEteiRfXSonXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlsbGVnYWw6ICdbXCJcXCdcXFxcKF0nXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFt8JSdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgTElURVJBTFMgPSB7bGl0ZXJhbDogJ3RydWUgZmFsc2UgbnVsbCd9O1xuICB2YXIgVFlQRVMgPSBbXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgXTtcbiAgdmFyIFZBTFVFX0NPTlRBSU5FUiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgZW5kOiAnLCcsIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBUWVBFUyxcbiAgICBrZXl3b3JkczogTElURVJBTFNcbiAgfTtcbiAgdmFyIE9CSkVDVCA9IHtcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxzKlwiJywgZW5kOiAnXCJcXFxccyo6XFxcXHMqJywgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgIHN0YXJ0czogVkFMVUVfQ09OVEFJTkVSXG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIHZhciBBUlJBWSA9IHtcbiAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5pbmhlcml0KFZBTFVFX0NPTlRBSU5FUiwge2NsYXNzTmFtZTogbnVsbH0pXSwgLy8gaW5oZXJpdCBpcyBhbHNvIGEgd29ya2Fyb3VuZCBmb3IgYSBidWcgdGhhdCBtYWtlcyBzaGFyZWQgbW9kZXMgd2l0aCBlbmRzV2l0aFBhcmVudCBjb21waWxlIG9ubHkgdGhlIGVuZGluZyBvZiBvbmUgb2YgdGhlIHBhcmVudHNcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIFRZUEVTLnNwbGljZShUWVBFUy5sZW5ndGgsIDAsIE9CSkVDVCwgQVJSQVkpO1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBUWVBFUyxcbiAgICBrZXl3b3JkczogTElURVJBTFMsXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIExJU1BfSURFTlRfUkUgPSAnW2EtekEtWl9cXFxcLVxcXFwrXFxcXCpcXFxcL1xcXFw8XFxcXD1cXFxcPlxcXFwmXFxcXCNdW2EtekEtWjAtOV9cXFxcLVxcXFwrXFxcXCpcXFxcL1xcXFw8XFxcXD1cXFxcPlxcXFwmXFxcXCNdKic7XG4gIHZhciBMSVNQX1NJTVBMRV9OVU1CRVJfUkUgPSAnKFxcXFwtfFxcXFwrKT9cXFxcZCsoXFxcXC5cXFxcZCt8XFxcXC9cXFxcZCspPygoZHxlfGZ8bHxzKShcXFxcK3xcXFxcLSk/XFxcXGQrKT8nO1xuICB2YXIgTElURVJBTCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICBiZWdpbjogJ1xcXFxiKHR7MX18bmlsKVxcXFxiJ1xuICB9O1xuICB2YXIgTlVNQkVSUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogTElTUF9TSU1QTEVfTlVNQkVSX1JFXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJyNiWzAtMV0rKC9bMC0xXSspPydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnI29bMC03XSsoL1swLTddKyk/J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjeFswLTlhLWZdKygvWzAtOWEtZl0rKT8nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJyNjXFxcXCgnICsgTElTUF9TSU1QTEVfTlVNQkVSX1JFICsgJyArJyArIExJU1BfU0lNUExFX05VTUJFUl9SRSwgZW5kOiAnXFxcXCknXG4gICAgfVxuICBdXG4gIHZhciBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICc7JywgZW5kOiAnJCdcbiAgfTtcbiAgdmFyIFZBUklBQkxFID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1xcXFwqJywgZW5kOiAnXFxcXConXG4gIH07XG4gIHZhciBLRVlXT1JEID0ge1xuICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgIGJlZ2luOiAnWzomXScgKyBMSVNQX0lERU5UX1JFXG4gIH07XG4gIHZhciBRVU9URURfTElTVCA9IHtcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBMSVRFUkFMLCBTVFJJTkddLmNvbmNhdChOVU1CRVJTKVxuICB9O1xuICB2YXIgUVVPVEVEMSA9IHtcbiAgICBjbGFzc05hbWU6ICdxdW90ZWQnLFxuICAgIGJlZ2luOiAnW1xcJ2BdXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IE5VTUJFUlMuY29uY2F0KFtTVFJJTkcsIFZBUklBQkxFLCBLRVlXT1JELCBRVU9URURfTElTVF0pXG4gIH07XG4gIHZhciBRVU9URUQyID0ge1xuICAgIGNsYXNzTmFtZTogJ3F1b3RlZCcsXG4gICAgYmVnaW46ICdcXFxcKHF1b3RlICcsIGVuZDogJ1xcXFwpJyxcbiAgICBrZXl3b3Jkczoge3RpdGxlOiAncXVvdGUnfSxcbiAgICBjb250YWluczogTlVNQkVSUy5jb25jYXQoW1NUUklORywgVkFSSUFCTEUsIEtFWVdPUkQsIFFVT1RFRF9MSVNUXSlcbiAgfTtcbiAgdmFyIExJU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGlzdCcsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJ1xuICB9O1xuICB2YXIgQk9EWSA9IHtcbiAgICBjbGFzc05hbWU6ICdib2R5JyxcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICB9O1xuICBMSVNULmNvbnRhaW5zID0gW3tjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBMSVNQX0lERU5UX1JFfSwgQk9EWV07XG4gIEJPRFkuY29udGFpbnMgPSBbUVVPVEVEMSwgUVVPVEVEMiwgTElTVCwgTElURVJBTF0uY29uY2F0KE5VTUJFUlMpLmNvbmNhdChbU1RSSU5HLCBDT01NRU5ULCBWQVJJQUJMRSwgS0VZV09SRF0pO1xuXG4gIHJldHVybiB7XG4gICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICBjb250YWluczogTlVNQkVSUy5jb25jYXQoW1xuICAgICAgTElURVJBTCxcbiAgICAgIFNUUklORyxcbiAgICAgIENPTU1FTlQsXG4gICAgICBRVU9URUQxLCBRVU9URUQyLFxuICAgICAgTElTVFxuICAgIF0pXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgT1BFTklOR19MT05HX0JSQUNLRVQgPSAnXFxcXFs9KlxcXFxbJztcbiAgdmFyIENMT1NJTkdfTE9OR19CUkFDS0VUID0gJ1xcXFxdPSpcXFxcXSc7XG4gIHZhciBMT05HX0JSQUNLRVRTID0ge1xuICAgIGJlZ2luOiBPUEVOSU5HX0xPTkdfQlJBQ0tFVCwgZW5kOiBDTE9TSU5HX0xPTkdfQlJBQ0tFVCxcbiAgICBjb250YWluczogWydzZWxmJ11cbiAgfTtcbiAgdmFyIENPTU1FTlRTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICctLSg/IScgKyBPUEVOSU5HX0xPTkdfQlJBQ0tFVCArICcpJywgZW5kOiAnJCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICctLScgKyBPUEVOSU5HX0xPTkdfQlJBQ0tFVCwgZW5kOiBDTE9TSU5HX0xPTkdfQlJBQ0tFVCxcbiAgICAgIGNvbnRhaW5zOiBbTE9OR19CUkFDS0VUU10sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfVxuICBdXG4gIHJldHVybiB7XG4gICAgbGV4ZW1zOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhbmQgYnJlYWsgZG8gZWxzZSBlbHNlaWYgZW5kIGZhbHNlIGZvciBpZiBpbiBsb2NhbCBuaWwgbm90IG9yIHJlcGVhdCByZXR1cm4gdGhlbiAnICtcbiAgICAgICAgJ3RydWUgdW50aWwgd2hpbGUnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdfRyBfVkVSU0lPTiBhc3NlcnQgY29sbGVjdGdhcmJhZ2UgZG9maWxlIGVycm9yIGdldGZlbnYgZ2V0bWV0YXRhYmxlIGlwYWlycyBsb2FkICcgK1xuICAgICAgICAnbG9hZGZpbGUgbG9hZHN0cmluZyBtb2R1bGUgbmV4dCBwYWlycyBwY2FsbCBwcmludCByYXdlcXVhbCByYXdnZXQgcmF3c2V0IHJlcXVpcmUgJyArXG4gICAgICAgICdzZWxlY3Qgc2V0ZmVudiBzZXRtZXRhdGFibGUgdG9udW1iZXIgdG9zdHJpbmcgdHlwZSB1bnBhY2sgeHBjYWxsIGNvcm91dGluZSBkZWJ1ZyAnICtcbiAgICAgICAgJ2lvIG1hdGggb3MgcGFja2FnZSBzdHJpbmcgdGFibGUnXG4gICAgfSxcbiAgICBjb250YWluczogQ09NTUVOVFMuY29uY2F0KFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnKFtfYS16QS1aXVxcXFx3KlxcXFwuKSooW19hLXpBLVpdXFxcXHcqOik/W19hLXpBLVpdXFxcXHcqJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBDT01NRU5UU1xuICAgICAgICAgIH1cbiAgICAgICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IE9QRU5JTkdfTE9OR19CUkFDS0VULCBlbmQ6IENMT1NJTkdfTE9OR19CUkFDS0VULFxuICAgICAgICBjb250YWluczogW0xPTkdfQlJBQ0tFVFNdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9XG4gICAgXSlcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIC8vIGhpZ2hsaWdodCBoZWFkZXJzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXiN7MSwzfScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ14uKz9cXFxcbls9LV17Mix9JCdcbiAgICAgIH0sXG4gICAgICAvLyBpbmxpbmUgaHRtbFxuICAgICAge1xuICAgICAgICBiZWdpbjogJzwnLCBlbmQ6ICc+JyxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBsaXN0cyAoaW5kaWNhdG9ycyBvbmx5KVxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdidWxsZXQnLFxuICAgICAgICBiZWdpbjogJ14oWyorLV18KFxcXFxkK1xcXFwuKSlcXFxccysnXG4gICAgICB9LFxuICAgICAgLy8gc3Ryb25nIHNlZ21lbnRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cm9uZycsXG4gICAgICAgIGJlZ2luOiAnWypfXXsyfS4rP1sqX117Mn0nXG4gICAgICB9LFxuICAgICAgLy8gZW1waGFzaXMgc2VnbWVudHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW1waGFzaXMnLFxuICAgICAgICBiZWdpbjogJ1xcXFwqLis/XFxcXConXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICAgIGJlZ2luOiAnXy4rP18nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBibG9ja3F1b3Rlc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdibG9ja3F1b3RlJyxcbiAgICAgICAgYmVnaW46ICdePlxcXFxzKycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgLy8gY29kZSBzbmlwcGV0c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgYmVnaW46ICdgLis/YCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvZGUnLFxuICAgICAgICBiZWdpbjogJ14gICAgJywgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIGhvcml6b250YWwgcnVsZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaG9yaXpvbnRhbF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdeLXszLH0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIC8vIHVzaW5nIGxpbmtzIC0gdGl0bGUgYW5kIGxpbmtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcWy4rP1xcXFxdXFxcXCguKz9cXFxcKScsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfbGFiZWwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcWy4rXFxcXF0nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5rX3VybCcsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcblxuICB2YXIgQ09NTU9OX0NPTlRBSU5TID0gW1xuICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIHtiZWdpbjogJ1xcJ1xcJyd9XSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH1cbiAgXTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYnJlYWsgY2FzZSBjYXRjaCBjbGFzc2RlZiBjb250aW51ZSBlbHNlIGVsc2VpZiBlbmQgZW51bWVyYXRlZCBldmVudHMgZm9yIGZ1bmN0aW9uICcgK1xuICAgICAgICAnZ2xvYmFsIGlmIG1ldGhvZHMgb3RoZXJ3aXNlIHBhcmZvciBwZXJzaXN0ZW50IHByb3BlcnRpZXMgcmV0dXJuIHNwbWQgc3dpdGNoIHRyeSB3aGlsZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ3NpbiBzaW5kIHNpbmggYXNpbiBhc2luZCBhc2luaCBjb3MgY29zZCBjb3NoIGFjb3MgYWNvc2QgYWNvc2ggdGFuIHRhbmQgdGFuaCBhdGFuICcgK1xuICAgICAgICAnYXRhbmQgYXRhbjIgYXRhbmggc2VjIHNlY2Qgc2VjaCBhc2VjIGFzZWNkIGFzZWNoIGNzYyBjc2NkIGNzY2ggYWNzYyBhY3NjZCBhY3NjaCBjb3QgJyArXG4gICAgICAgICdjb3RkIGNvdGggYWNvdCBhY290ZCBhY290aCBoeXBvdCBleHAgZXhwbTEgbG9nIGxvZzFwIGxvZzEwIGxvZzIgcG93MiByZWFscG93IHJlYWxsb2cgJyArXG4gICAgICAgICdyZWFsc3FydCBzcXJ0IG50aHJvb3QgbmV4dHBvdzIgYWJzIGFuZ2xlIGNvbXBsZXggY29uaiBpbWFnIHJlYWwgdW53cmFwIGlzcmVhbCAnICtcbiAgICAgICAgJ2NwbHhwYWlyIGZpeCBmbG9vciBjZWlsIHJvdW5kIG1vZCByZW0gc2lnbiBhaXJ5IGJlc3NlbGogYmVzc2VseSBiZXNzZWxoIGJlc3NlbGkgJyArXG4gICAgICAgICdiZXNzZWxrIGJldGEgYmV0YWluYyBiZXRhbG4gZWxsaXBqIGVsbGlwa2UgZXJmIGVyZmMgZXJmY3ggZXJmaW52IGV4cGludCBnYW1tYSAnICtcbiAgICAgICAgJ2dhbW1haW5jIGdhbW1hbG4gcHNpIGxlZ2VuZHJlIGNyb3NzIGRvdCBmYWN0b3IgaXNwcmltZSBwcmltZXMgZ2NkIGxjbSByYXQgcmF0cyBwZXJtcyAnICtcbiAgICAgICAgJ25jaG9vc2VrIGZhY3RvcmlhbCBjYXJ0MnNwaCBjYXJ0MnBvbCBwb2wyY2FydCBzcGgyY2FydCBoc3YycmdiIHJnYjJoc3YgemVyb3Mgb25lcyAnICtcbiAgICAgICAgJ2V5ZSByZXBtYXQgcmFuZCByYW5kbiBsaW5zcGFjZSBsb2dzcGFjZSBmcmVxc3BhY2UgbWVzaGdyaWQgYWNjdW1hcnJheSBzaXplIGxlbmd0aCAnICtcbiAgICAgICAgJ25kaW1zIG51bWVsIGRpc3AgaXNlbXB0eSBpc2VxdWFsIGlzZXF1YWx3aXRoZXF1YWxuYW5zIGNhdCByZXNoYXBlIGRpYWcgYmxrZGlhZyB0cmlsICcgK1xuICAgICAgICAndHJpdSBmbGlwbHIgZmxpcHVkIGZsaXBkaW0gcm90OTAgZmluZCBzdWIyaW5kIGluZDJzdWIgYnN4ZnVuIG5kZ3JpZCBwZXJtdXRlIGlwZXJtdXRlICcgK1xuICAgICAgICAnc2hpZnRkaW0gY2lyY3NoaWZ0IHNxdWVlemUgaXNzY2FsYXIgaXN2ZWN0b3IgYW5zIGVwcyByZWFsbWF4IHJlYWxtaW4gcGkgaSBpbmYgbmFuICcgK1xuICAgICAgICAnaXNuYW4gaXNpbmYgaXNmaW5pdGUgaiB3aHkgY29tcGFuIGdhbGxlcnkgaGFkYW1hcmQgaGFua2VsIGhpbGIgaW52aGlsYiBtYWdpYyBwYXNjYWwgJyArXG4gICAgICAgICdyb3NzZXIgdG9lcGxpdHogdmFuZGVyIHdpbGtpbnNvbidcbiAgICB9LFxuICAgIGlsbGVnYWw6ICcoLy98XCJ8I3wvXFxcXCp8XFxcXHMrL1xcXFx3KyknLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndHJhbnNwb3NlZF92YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnW2EtekEtWl9dW2EtekEtWl8wLTldKihcXCcrW1xcXFwuXFwnXSp8W1xcXFwuXFwnXSspJywgZW5kOiAnJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWF0cml4JyxcbiAgICAgICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdXFwnKltcXFxcLlxcJ10qJyxcbiAgICAgICAgY29udGFpbnM6IENPTU1PTl9DT05UQUlOU1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2VsbCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXHsnLCBlbmQ6ICdcXFxcfVxcJypbXFxcXC5cXCddKicsXG4gICAgICAgIGNvbnRhaW5zOiBDT01NT05fQ09OVEFJTlNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1xcXFwlJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdLmNvbmNhdChDT01NT05fQ09OVEFJTlMpXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ2ludCBmbG9hdCBzdHJpbmcgdmVjdG9yIG1hdHJpeCBpZiBlbHNlIHN3aXRjaCBjYXNlIGRlZmF1bHQgd2hpbGUgZG8gZm9yIGluIGJyZWFrICcgK1xuICAgICAgJ2NvbnRpbnVlIGdsb2JhbCBwcm9jIHJldHVybiBhYm91dCBhYnMgYWRkQXR0ciBhZGRBdHRyaWJ1dGVFZGl0b3JOb2RlSGVscCBhZGREeW5hbWljICcgK1xuICAgICAgJ2FkZE5ld1NoZWxmVGFiIGFkZFBQIGFkZFBhbmVsQ2F0ZWdvcnkgYWRkUHJlZml4VG9OYW1lIGFkdmFuY2VUb05leHREcml2ZW5LZXkgJyArXG4gICAgICAnYWZmZWN0ZWROZXQgYWZmZWN0cyBhaW1Db25zdHJhaW50IGFpciBhbGlhcyBhbGlhc0F0dHIgYWxpZ24gYWxpZ25DdHggYWxpZ25DdXJ2ZSAnICtcbiAgICAgICdhbGlnblN1cmZhY2UgYWxsVmlld0ZpdCBhbWJpZW50TGlnaHQgYW5nbGUgYW5nbGVCZXR3ZWVuIGFuaW1Db25lIGFuaW1DdXJ2ZUVkaXRvciAnICtcbiAgICAgICdhbmltRGlzcGxheSBhbmltVmlldyBhbm5vdGF0ZSBhcHBlbmRTdHJpbmdBcnJheSBhcHBsaWNhdGlvbk5hbWUgYXBwbHlBdHRyUHJlc2V0ICcgK1xuICAgICAgJ2FwcGx5VGFrZSBhcmNMZW5EaW1Db250ZXh0IGFyY0xlbmd0aERpbWVuc2lvbiBhcmNsZW4gYXJyYXlNYXBwZXIgYXJ0M2RQYWludEN0eCAnICtcbiAgICAgICdhcnRBdHRyQ3R4IGFydEF0dHJQYWludFZlcnRleEN0eCBhcnRBdHRyU2tpblBhaW50Q3R4IGFydEF0dHJUb29sIGFydEJ1aWxkUGFpbnRNZW51ICcgK1xuICAgICAgJ2FydEZsdWlkQXR0ckN0eCBhcnRQdXR0eUN0eCBhcnRTZWxlY3RDdHggYXJ0U2V0UGFpbnRDdHggYXJ0VXNlclBhaW50Q3R4IGFzc2lnbkNvbW1hbmQgJyArXG4gICAgICAnYXNzaWduSW5wdXREZXZpY2UgYXNzaWduVmlld3BvcnRGYWN0b3JpZXMgYXR0YWNoQ3VydmUgYXR0YWNoRGV2aWNlQXR0ciBhdHRhY2hTdXJmYWNlICcgK1xuICAgICAgJ2F0dHJDb2xvclNsaWRlckdycCBhdHRyQ29tcGF0aWJpbGl0eSBhdHRyQ29udHJvbEdycCBhdHRyRW51bU9wdGlvbk1lbnUgJyArXG4gICAgICAnYXR0ckVudW1PcHRpb25NZW51R3JwIGF0dHJGaWVsZEdycCBhdHRyRmllbGRTbGlkZXJHcnAgYXR0ck5hdmlnYXRpb25Db250cm9sR3JwICcgK1xuICAgICAgJ2F0dHJQcmVzZXRFZGl0V2luIGF0dHJpYnV0ZUV4aXN0cyBhdHRyaWJ1dGVJbmZvIGF0dHJpYnV0ZU1lbnUgYXR0cmlidXRlUXVlcnkgJyArXG4gICAgICAnYXV0b0tleWZyYW1lIGF1dG9QbGFjZSBiYWtlQ2xpcCBiYWtlRmx1aWRTaGFkaW5nIGJha2VQYXJ0aWFsSGlzdG9yeSBiYWtlUmVzdWx0cyAnICtcbiAgICAgICdiYWtlU2ltdWxhdGlvbiBiYXNlbmFtZSBiYXNlbmFtZUV4IGJhdGNoUmVuZGVyIGJlc3NlbCBiZXZlbCBiZXZlbFBsdXMgYmluTWVtYmVyc2hpcCAnICtcbiAgICAgICdiaW5kU2tpbiBibGVuZDIgYmxlbmRTaGFwZSBibGVuZFNoYXBlRWRpdG9yIGJsZW5kU2hhcGVQYW5lbCBibGVuZFR3b0F0dHIgYmxpbmREYXRhVHlwZSAnICtcbiAgICAgICdib25lTGF0dGljZSBib3VuZGFyeSBib3hEb2xseUN0eCBib3hab29tQ3R4IGJ1ZmZlckN1cnZlIGJ1aWxkQm9va21hcmtNZW51ICcgK1xuICAgICAgJ2J1aWxkS2V5ZnJhbWVNZW51IGJ1dHRvbiBidXR0b25NYW5pcCBDQkcgY2FjaGVGaWxlIGNhY2hlRmlsZUNvbWJpbmUgY2FjaGVGaWxlTWVyZ2UgJyArXG4gICAgICAnY2FjaGVGaWxlVHJhY2sgY2FtZXJhIGNhbWVyYVZpZXcgY2FuQ3JlYXRlTWFuaXAgY2FudmFzIGNhcGl0YWxpemVTdHJpbmcgY2F0Y2ggJyArXG4gICAgICAnY2F0Y2hRdWlldCBjZWlsIGNoYW5nZVN1YmRpdkNvbXBvbmVudERpc3BsYXlMZXZlbCBjaGFuZ2VTdWJkaXZSZWdpb24gY2hhbm5lbEJveCAnICtcbiAgICAgICdjaGFyYWN0ZXIgY2hhcmFjdGVyTWFwIGNoYXJhY3Rlck91dGxpbmVFZGl0b3IgY2hhcmFjdGVyaXplIGNoZGlyIGNoZWNrQm94IGNoZWNrQm94R3JwICcgK1xuICAgICAgJ2NoZWNrRGVmYXVsdFJlbmRlckdsb2JhbHMgY2hvaWNlIGNpcmNsZSBjaXJjdWxhckZpbGxldCBjbGFtcCBjbGVhciBjbGVhckNhY2hlIGNsaXAgJyArXG4gICAgICAnY2xpcEVkaXRvciBjbGlwRWRpdG9yQ3VycmVudFRpbWVDdHggY2xpcFNjaGVkdWxlIGNsaXBTY2hlZHVsZXJPdXRsaW5lciBjbGlwVHJpbUJlZm9yZSAnICtcbiAgICAgICdjbG9zZUN1cnZlIGNsb3NlU3VyZmFjZSBjbHVzdGVyIGNtZEZpbGVPdXRwdXQgY21kU2Nyb2xsRmllbGRFeGVjdXRlciAnICtcbiAgICAgICdjbWRTY3JvbGxGaWVsZFJlcG9ydGVyIGNtZFNoZWxsIGNvYXJzZW5TdWJkaXZTZWxlY3Rpb25MaXN0IGNvbGxpc2lvbiBjb2xvciAnICtcbiAgICAgICdjb2xvckF0UG9pbnQgY29sb3JFZGl0b3IgY29sb3JJbmRleCBjb2xvckluZGV4U2xpZGVyR3JwIGNvbG9yU2xpZGVyQnV0dG9uR3JwICcgK1xuICAgICAgJ2NvbG9yU2xpZGVyR3JwIGNvbHVtbkxheW91dCBjb21tYW5kRWNobyBjb21tYW5kTGluZSBjb21tYW5kUG9ydCBjb21wYWN0SGFpclN5c3RlbSAnICtcbiAgICAgICdjb21wb25lbnRFZGl0b3IgY29tcG9zaXRpbmdJbnRlcm9wIGNvbXB1dGVQb2x5c2V0Vm9sdW1lIGNvbmRpdGlvbiBjb25lIGNvbmZpcm1EaWFsb2cgJyArXG4gICAgICAnY29ubmVjdEF0dHIgY29ubmVjdENvbnRyb2wgY29ubmVjdER5bmFtaWMgY29ubmVjdEpvaW50IGNvbm5lY3Rpb25JbmZvIGNvbnN0cmFpbiAnICtcbiAgICAgICdjb25zdHJhaW5WYWx1ZSBjb25zdHJ1Y3Rpb25IaXN0b3J5IGNvbnRhaW5lciBjb250YWluc011bHRpYnl0ZSBjb250ZXh0SW5mbyBjb250cm9sICcgK1xuICAgICAgJ2NvbnZlcnRGcm9tT2xkTGF5ZXJzIGNvbnZlcnRJZmZUb1BzZCBjb252ZXJ0TGlnaHRtYXAgY29udmVydFNvbGlkVHggY29udmVydFRlc3NlbGxhdGlvbiAnICtcbiAgICAgICdjb252ZXJ0VW5pdCBjb3B5QXJyYXkgY29weUZsZXhvciBjb3B5S2V5IGNvcHlTa2luV2VpZ2h0cyBjb3MgY3BCdXR0b24gY3BDYWNoZSAnICtcbiAgICAgICdjcENsb3RoU2V0IGNwQ29sbGlzaW9uIGNwQ29uc3RyYWludCBjcENvbnZDbG90aFRvTWVzaCBjcEZvcmNlcyBjcEdldFNvbHZlckF0dHIgY3BQYW5lbCAnICtcbiAgICAgICdjcFByb3BlcnR5IGNwUmlnaWRDb2xsaXNpb25GaWx0ZXIgY3BTZWFtIGNwU2V0RWRpdCBjcFNldFNvbHZlckF0dHIgY3BTb2x2ZXIgJyArXG4gICAgICAnY3BTb2x2ZXJUeXBlcyBjcFRvb2wgY3BVcGRhdGVDbG90aFVWcyBjcmVhdGVEaXNwbGF5TGF5ZXIgY3JlYXRlRHJhd0N0eCBjcmVhdGVFZGl0b3IgJyArXG4gICAgICAnY3JlYXRlTGF5ZXJlZFBzZEZpbGUgY3JlYXRlTW90aW9uRmllbGQgY3JlYXRlTmV3U2hlbGYgY3JlYXRlTm9kZSBjcmVhdGVSZW5kZXJMYXllciAnICtcbiAgICAgICdjcmVhdGVTdWJkaXZSZWdpb24gY3Jvc3MgY3Jvc3NQcm9kdWN0IGN0eEFib3J0IGN0eENvbXBsZXRpb24gY3R4RWRpdE1vZGUgY3R4VHJhdmVyc2UgJyArXG4gICAgICAnY3VycmVudEN0eCBjdXJyZW50VGltZSBjdXJyZW50VGltZUN0eCBjdXJyZW50VW5pdCBjdXJyZW50VW5pdCBjdXJ2ZSBjdXJ2ZUFkZFB0Q3R4ICcgK1xuICAgICAgJ2N1cnZlQ1ZDdHggY3VydmVFUEN0eCBjdXJ2ZUVkaXRvckN0eCBjdXJ2ZUludGVyc2VjdCBjdXJ2ZU1vdmVFUEN0eCBjdXJ2ZU9uU3VyZmFjZSAnICtcbiAgICAgICdjdXJ2ZVNrZXRjaEN0eCBjdXRLZXkgY3ljbGVDaGVjayBjeWxpbmRlciBkYWdQb3NlIGRhdGUgZGVmYXVsdExpZ2h0TGlzdENoZWNrQm94ICcgK1xuICAgICAgJ2RlZmF1bHROYXZpZ2F0aW9uIGRlZmluZURhdGFTZXJ2ZXIgZGVmaW5lVmlydHVhbERldmljZSBkZWZvcm1lciBkZWdfdG9fcmFkIGRlbGV0ZSAnICtcbiAgICAgICdkZWxldGVBdHRyIGRlbGV0ZVNoYWRpbmdHcm91cHNBbmRNYXRlcmlhbHMgZGVsZXRlU2hlbGZUYWIgZGVsZXRlVUkgZGVsZXRlVW51c2VkQnJ1c2hlcyAnICtcbiAgICAgICdkZWxyYW5kc3RyIGRldGFjaEN1cnZlIGRldGFjaERldmljZUF0dHIgZGV0YWNoU3VyZmFjZSBkZXZpY2VFZGl0b3IgZGV2aWNlUGFuZWwgZGdJbmZvICcgK1xuICAgICAgJ2RnZGlydHkgZGdldmFsIGRndGltZXIgZGltV2hlbiBkaXJlY3RLZXlDdHggZGlyZWN0aW9uYWxMaWdodCBkaXJtYXAgZGlybmFtZSBkaXNhYmxlICcgK1xuICAgICAgJ2Rpc2Nvbm5lY3RBdHRyIGRpc2Nvbm5lY3RKb2ludCBkaXNrQ2FjaGUgZGlzcGxhY2VtZW50VG9Qb2x5IGRpc3BsYXlBZmZlY3RlZCAnICtcbiAgICAgICdkaXNwbGF5Q29sb3IgZGlzcGxheUN1bGwgZGlzcGxheUxldmVsT2ZEZXRhaWwgZGlzcGxheVByZWYgZGlzcGxheVJHQkNvbG9yICcgK1xuICAgICAgJ2Rpc3BsYXlTbW9vdGhuZXNzIGRpc3BsYXlTdGF0cyBkaXNwbGF5U3RyaW5nIGRpc3BsYXlTdXJmYWNlIGRpc3RhbmNlRGltQ29udGV4dCAnICtcbiAgICAgICdkaXN0YW5jZURpbWVuc2lvbiBkb0JsdXIgZG9sbHkgZG9sbHlDdHggZG9wZVNoZWV0RWRpdG9yIGRvdCBkb3RQcm9kdWN0ICcgK1xuICAgICAgJ2RvdWJsZVByb2ZpbGVCaXJhaWxTdXJmYWNlIGRyYWcgZHJhZ0F0dHJDb250ZXh0IGRyYWdnZXJDb250ZXh0IGRyb3BvZmZMb2NhdG9yICcgK1xuICAgICAgJ2R1cGxpY2F0ZSBkdXBsaWNhdGVDdXJ2ZSBkdXBsaWNhdGVTdXJmYWNlIGR5bkNhY2hlIGR5bkNvbnRyb2wgZHluRXhwb3J0IGR5bkV4cHJlc3Npb24gJyArXG4gICAgICAnZHluR2xvYmFscyBkeW5QYWludEVkaXRvciBkeW5QYXJ0aWNsZUN0eCBkeW5QcmVmIGR5blJlbEVkUGFuZWwgZHluUmVsRWRpdG9yICcgK1xuICAgICAgJ2R5bmFtaWNMb2FkIGVkaXRBdHRyTGltaXRzIGVkaXREaXNwbGF5TGF5ZXJHbG9iYWxzIGVkaXREaXNwbGF5TGF5ZXJNZW1iZXJzICcgK1xuICAgICAgJ2VkaXRSZW5kZXJMYXllckFkanVzdG1lbnQgZWRpdFJlbmRlckxheWVyR2xvYmFscyBlZGl0UmVuZGVyTGF5ZXJNZW1iZXJzIGVkaXRvciAnICtcbiAgICAgICdlZGl0b3JUZW1wbGF0ZSBlZmZlY3RvciBlbWl0IGVtaXR0ZXIgZW5hYmxlRGV2aWNlIGVuY29kZVN0cmluZyBlbmRTdHJpbmcgZW5kc1dpdGggZW52ICcgK1xuICAgICAgJ2VxdWl2YWxlbnQgZXF1aXZhbGVudFRvbCBlcmYgZXJyb3IgZXZhbCBldmFsIGV2YWxEZWZlcnJlZCBldmFsRWNobyBldmVudCAnICtcbiAgICAgICdleGFjdFdvcmxkQm91bmRpbmdCb3ggZXhjbHVzaXZlTGlnaHRDaGVja0JveCBleGVjIGV4ZWN1dGVGb3JFYWNoT2JqZWN0IGV4aXN0cyBleHAgJyArXG4gICAgICAnZXhwcmVzc2lvbiBleHByZXNzaW9uRWRpdG9yTGlzdGVuIGV4dGVuZEN1cnZlIGV4dGVuZFN1cmZhY2UgZXh0cnVkZSBmY2hlY2sgZmNsb3NlIGZlb2YgJyArXG4gICAgICAnZmZsdXNoIGZnZXRsaW5lIGZnZXR3b3JkIGZpbGUgZmlsZUJyb3dzZXJEaWFsb2cgZmlsZURpYWxvZyBmaWxlRXh0ZW5zaW9uIGZpbGVJbmZvICcgK1xuICAgICAgJ2ZpbGV0ZXN0IGZpbGxldEN1cnZlIGZpbHRlciBmaWx0ZXJDdXJ2ZSBmaWx0ZXJFeHBhbmQgZmlsdGVyU3R1ZGlvSW1wb3J0ICcgK1xuICAgICAgJ2ZpbmRBbGxJbnRlcnNlY3Rpb25zIGZpbmRBbmltQ3VydmVzIGZpbmRLZXlmcmFtZSBmaW5kTWVudUl0ZW0gZmluZFJlbGF0ZWRTa2luQ2x1c3RlciAnICtcbiAgICAgICdmaW5kZXIgZmlyc3RQYXJlbnRPZiBmaXRCc3BsaW5lIGZsZXhvciBmbG9hdEVxIGZsb2F0RmllbGQgZmxvYXRGaWVsZEdycCBmbG9hdFNjcm9sbEJhciAnICtcbiAgICAgICdmbG9hdFNsaWRlciBmbG9hdFNsaWRlcjIgZmxvYXRTbGlkZXJCdXR0b25HcnAgZmxvYXRTbGlkZXJHcnAgZmxvb3IgZmxvdyBmbHVpZENhY2hlSW5mbyAnICtcbiAgICAgICdmbHVpZEVtaXR0ZXIgZmx1aWRWb3hlbEluZm8gZmx1c2hVbmRvIGZtb2QgZm9udERpYWxvZyBmb3BlbiBmb3JtTGF5b3V0IGZvcm1hdCBmcHJpbnQgJyArXG4gICAgICAnZnJhbWVMYXlvdXQgZnJlYWQgZnJlZUZvcm1GaWxsZXQgZnJld2luZCBmcm9tTmF0aXZlUGF0aCBmd3JpdGUgZ2FtbWEgZ2F1c3MgJyArXG4gICAgICAnZ2VvbWV0cnlDb25zdHJhaW50IGdldEFwcGxpY2F0aW9uVmVyc2lvbkFzRmxvYXQgZ2V0QXR0ciBnZXRDbGFzc2lmaWNhdGlvbiAnICtcbiAgICAgICdnZXREZWZhdWx0QnJ1c2ggZ2V0RmlsZUxpc3QgZ2V0Rmx1aWRBdHRyIGdldElucHV0RGV2aWNlUmFuZ2UgZ2V0TWF5YVBhbmVsVHlwZXMgJyArXG4gICAgICAnZ2V0TW9kaWZpZXJzIGdldFBhbmVsIGdldFBhcnRpY2xlQXR0ciBnZXRQbHVnaW5SZXNvdXJjZSBnZXRlbnYgZ2V0cGlkIGdsUmVuZGVyICcgK1xuICAgICAgJ2dsUmVuZGVyRWRpdG9yIGdsb2JhbFN0aXRjaCBnbWF0Y2ggZ29hbCBnb3RvQmluZFBvc2UgZ3JhYkNvbG9yIGdyYWRpZW50Q29udHJvbCAnICtcbiAgICAgICdncmFkaWVudENvbnRyb2xOb0F0dHIgZ3JhcGhEb2xseUN0eCBncmFwaFNlbGVjdENvbnRleHQgZ3JhcGhUcmFja0N0eCBncmF2aXR5IGdyaWQgJyArXG4gICAgICAnZ3JpZExheW91dCBncm91cCBncm91cE9iamVjdHNCeU5hbWUgSGZBZGRBdHRyYWN0b3JUb0FTIEhmQXNzaWduQVMgSGZCdWlsZEVxdWFsTWFwICcgK1xuICAgICAgJ0hmQnVpbGRGdXJGaWxlcyBIZkJ1aWxkRnVySW1hZ2VzIEhmQ2FuY2VsQUZSIEhmQ29ubmVjdEFTVG9IRiBIZkNyZWF0ZUF0dHJhY3RvciAnICtcbiAgICAgICdIZkRlbGV0ZUFTIEhmRWRpdEFTIEhmUGVyZm9ybUNyZWF0ZUFTIEhmUmVtb3ZlQXR0cmFjdG9yRnJvbUFTIEhmU2VsZWN0QXR0YWNoZWQgJyArXG4gICAgICAnSGZTZWxlY3RBdHRyYWN0b3JzIEhmVW5Bc3NpZ25BUyBoYXJkZW5Qb2ludEN1cnZlIGhhcmR3YXJlIGhhcmR3YXJlUmVuZGVyUGFuZWwgJyArXG4gICAgICAnaGVhZHNVcERpc3BsYXkgaGVhZHNVcE1lc3NhZ2UgaGVscCBoZWxwTGluZSBoZXJtaXRlIGhpZGUgaGlsaXRlIGhpdFRlc3QgaG90Qm94IGhvdGtleSAnICtcbiAgICAgICdob3RrZXlDaGVjayBoc3ZfdG9fcmdiIGh1ZEJ1dHRvbiBodWRTbGlkZXIgaHVkU2xpZGVyQnV0dG9uIGh3UmVmbGVjdGlvbk1hcCBod1JlbmRlciAnICtcbiAgICAgICdod1JlbmRlckxvYWQgaHlwZXJHcmFwaCBoeXBlclBhbmVsIGh5cGVyU2hhZGUgaHlwb3QgaWNvblRleHRCdXR0b24gaWNvblRleHRDaGVja0JveCAnICtcbiAgICAgICdpY29uVGV4dFJhZGlvQnV0dG9uIGljb25UZXh0UmFkaW9Db2xsZWN0aW9uIGljb25UZXh0U2Nyb2xsTGlzdCBpY29uVGV4dFN0YXRpY0xhYmVsICcgK1xuICAgICAgJ2lrSGFuZGxlIGlrSGFuZGxlQ3R4IGlrSGFuZGxlRGlzcGxheVNjYWxlIGlrU29sdmVyIGlrU3BsaW5lSGFuZGxlQ3R4IGlrU3lzdGVtICcgK1xuICAgICAgJ2lrU3lzdGVtSW5mbyBpa2ZrRGlzcGxheU1ldGhvZCBpbGx1c3RyYXRvckN1cnZlcyBpbWFnZSBpbWZQbHVnaW5zIGluaGVyaXRUcmFuc2Zvcm0gJyArXG4gICAgICAnaW5zZXJ0Sm9pbnQgaW5zZXJ0Sm9pbnRDdHggaW5zZXJ0S2V5Q3R4IGluc2VydEtub3RDdXJ2ZSBpbnNlcnRLbm90U3VyZmFjZSBpbnN0YW5jZSAnICtcbiAgICAgICdpbnN0YW5jZWFibGUgaW5zdGFuY2VyIGludEZpZWxkIGludEZpZWxkR3JwIGludFNjcm9sbEJhciBpbnRTbGlkZXIgaW50U2xpZGVyR3JwICcgK1xuICAgICAgJ2ludGVyVG9VSSBpbnRlcm5hbFZhciBpbnRlcnNlY3QgaXByRW5naW5lIGlzQW5pbUN1cnZlIGlzQ29ubmVjdGVkIGlzRGlydHkgaXNQYXJlbnRPZiAnICtcbiAgICAgICdpc1NhbWVPYmplY3QgaXNUcnVlIGlzVmFsaWRPYmplY3ROYW1lIGlzVmFsaWRTdHJpbmcgaXNWYWxpZFVpTmFtZSBpc29sYXRlU2VsZWN0ICcgK1xuICAgICAgJ2l0ZW1GaWx0ZXIgaXRlbUZpbHRlckF0dHIgaXRlbUZpbHRlclJlbmRlciBpdGVtRmlsdGVyVHlwZSBqb2ludCBqb2ludENsdXN0ZXIgam9pbnRDdHggJyArXG4gICAgICAnam9pbnREaXNwbGF5U2NhbGUgam9pbnRMYXR0aWNlIGtleVRhbmdlbnQga2V5ZnJhbWUga2V5ZnJhbWVPdXRsaW5lciAnICtcbiAgICAgICdrZXlmcmFtZVJlZ2lvbkN1cnJlbnRUaW1lQ3R4IGtleWZyYW1lUmVnaW9uRGlyZWN0S2V5Q3R4IGtleWZyYW1lUmVnaW9uRG9sbHlDdHggJyArXG4gICAgICAna2V5ZnJhbWVSZWdpb25JbnNlcnRLZXlDdHgga2V5ZnJhbWVSZWdpb25Nb3ZlS2V5Q3R4IGtleWZyYW1lUmVnaW9uU2NhbGVLZXlDdHggJyArXG4gICAgICAna2V5ZnJhbWVSZWdpb25TZWxlY3RLZXlDdHgga2V5ZnJhbWVSZWdpb25TZXRLZXlDdHgga2V5ZnJhbWVSZWdpb25UcmFja0N0eCAnICtcbiAgICAgICdrZXlmcmFtZVN0YXRzIGxhc3NvQ29udGV4dCBsYXR0aWNlIGxhdHRpY2VEZWZvcm1LZXlDdHggbGF1bmNoIGxhdW5jaEltYWdlRWRpdG9yICcgK1xuICAgICAgJ2xheWVyQnV0dG9uIGxheWVyZWRTaGFkZXJQb3J0IGxheWVyZWRUZXh0dXJlUG9ydCBsYXlvdXQgbGF5b3V0RGlhbG9nIGxpZ2h0TGlzdCAnICtcbiAgICAgICdsaWdodExpc3RFZGl0b3IgbGlnaHRMaXN0UGFuZWwgbGlnaHRsaW5rIGxpbmVJbnRlcnNlY3Rpb24gbGluZWFyUHJlY2lzaW9uIGxpbnN0ZXAgJyArXG4gICAgICAnbGlzdEFuaW1hdGFibGUgbGlzdEF0dHIgbGlzdENhbWVyYXMgbGlzdENvbm5lY3Rpb25zIGxpc3REZXZpY2VBdHRhY2htZW50cyBsaXN0SGlzdG9yeSAnICtcbiAgICAgICdsaXN0SW5wdXREZXZpY2VBeGVzIGxpc3RJbnB1dERldmljZUJ1dHRvbnMgbGlzdElucHV0RGV2aWNlcyBsaXN0TWVudUFubm90YXRpb24gJyArXG4gICAgICAnbGlzdE5vZGVUeXBlcyBsaXN0UGFuZWxDYXRlZ29yaWVzIGxpc3RSZWxhdGl2ZXMgbGlzdFNldHMgbGlzdFRyYW5zZm9ybXMgJyArXG4gICAgICAnbGlzdFVuc2VsZWN0ZWQgbGlzdGVyRWRpdG9yIGxvYWRGbHVpZCBsb2FkTmV3U2hlbGYgbG9hZFBsdWdpbiAnICtcbiAgICAgICdsb2FkUGx1Z2luTGFuZ3VhZ2VSZXNvdXJjZXMgbG9hZFByZWZPYmplY3RzIGxvY2FsaXplZFBhbmVsTGFiZWwgbG9ja05vZGUgbG9mdCBsb2cgJyArXG4gICAgICAnbG9uZ05hbWVPZiBsb29rVGhydSBscyBsc1Rocm91Z2hGaWx0ZXIgbHNUeXBlIGxzVUkgTWF5YXRvbXIgbWFnIG1ha2VJZGVudGl0eSBtYWtlTGl2ZSAnICtcbiAgICAgICdtYWtlUGFpbnRhYmxlIG1ha2VSb2xsIG1ha2VTaW5nbGVTdXJmYWNlIG1ha2VUdWJlT24gbWFrZWJvdCBtYW5pcE1vdmVDb250ZXh0ICcgK1xuICAgICAgJ21hbmlwTW92ZUxpbWl0c0N0eCBtYW5pcE9wdGlvbnMgbWFuaXBSb3RhdGVDb250ZXh0IG1hbmlwUm90YXRlTGltaXRzQ3R4ICcgK1xuICAgICAgJ21hbmlwU2NhbGVDb250ZXh0IG1hbmlwU2NhbGVMaW1pdHNDdHggbWFya2VyIG1hdGNoIG1heCBtZW1vcnkgbWVudSBtZW51QmFyTGF5b3V0ICcgK1xuICAgICAgJ21lbnVFZGl0b3IgbWVudUl0ZW0gbWVudUl0ZW1Ub1NoZWxmIG1lbnVTZXQgbWVudVNldFByZWYgbWVzc2FnZUxpbmUgbWluIG1pbmltaXplQXBwICcgK1xuICAgICAgJ21pcnJvckpvaW50IG1vZGVsQ3VycmVudFRpbWVDdHggbW9kZWxFZGl0b3IgbW9kZWxQYW5lbCBtb3VzZSBtb3ZJbiBtb3ZPdXQgbW92ZSAnICtcbiAgICAgICdtb3ZlSUt0b0ZLIG1vdmVLZXlDdHggbW92ZVZlcnRleEFsb25nRGlyZWN0aW9uIG11bHRpUHJvZmlsZUJpcmFpbFN1cmZhY2UgbXV0ZSAnICtcbiAgICAgICduUGFydGljbGUgbmFtZUNvbW1hbmQgbmFtZUZpZWxkIG5hbWVzcGFjZSBuYW1lc3BhY2VJbmZvIG5ld1BhbmVsSXRlbXMgbmV3dG9uIG5vZGVDYXN0ICcgK1xuICAgICAgJ25vZGVJY29uQnV0dG9uIG5vZGVPdXRsaW5lciBub2RlUHJlc2V0IG5vZGVUeXBlIG5vaXNlIG5vbkxpbmVhciBub3JtYWxDb25zdHJhaW50ICcgK1xuICAgICAgJ25vcm1hbGl6ZSBudXJic0Jvb2xlYW4gbnVyYnNDb3B5VVZTZXQgbnVyYnNDdWJlIG51cmJzRWRpdFVWIG51cmJzUGxhbmUgbnVyYnNTZWxlY3QgJyArXG4gICAgICAnbnVyYnNTcXVhcmUgbnVyYnNUb1BvbHkgbnVyYnNUb1BvbHlnb25zUHJlZiBudXJic1RvU3ViZGl2IG51cmJzVG9TdWJkaXZQcmVmICcgK1xuICAgICAgJ251cmJzVVZTZXQgbnVyYnNWaWV3RGlyZWN0aW9uVmVjdG9yIG9iakV4aXN0cyBvYmplY3RDZW50ZXIgb2JqZWN0TGF5ZXIgb2JqZWN0VHlwZSAnICtcbiAgICAgICdvYmplY3RUeXBlVUkgb2Jzb2xldGVQcm9jIG9jZWFuTnVyYnNQcmV2aWV3UGxhbmUgb2Zmc2V0Q3VydmUgb2Zmc2V0Q3VydmVPblN1cmZhY2UgJyArXG4gICAgICAnb2Zmc2V0U3VyZmFjZSBvcGVuR0xFeHRlbnNpb24gb3Blbk1heWFQcmVmIG9wdGlvbk1lbnUgb3B0aW9uTWVudUdycCBvcHRpb25WYXIgb3JiaXQgJyArXG4gICAgICAnb3JiaXRDdHggb3JpZW50Q29uc3RyYWludCBvdXRsaW5lckVkaXRvciBvdXRsaW5lclBhbmVsIG92ZXJyaWRlTW9kaWZpZXIgJyArXG4gICAgICAncGFpbnRFZmZlY3RzRGlzcGxheSBwYWlyQmxlbmQgcGFsZXR0ZVBvcnQgcGFuZUxheW91dCBwYW5lbCBwYW5lbENvbmZpZ3VyYXRpb24gJyArXG4gICAgICAncGFuZWxIaXN0b3J5IHBhcmFtRGltQ29udGV4dCBwYXJhbURpbWVuc2lvbiBwYXJhbUxvY2F0b3IgcGFyZW50IHBhcmVudENvbnN0cmFpbnQgJyArXG4gICAgICAncGFydGljbGUgcGFydGljbGVFeGlzdHMgcGFydGljbGVJbnN0YW5jZXIgcGFydGljbGVSZW5kZXJJbmZvIHBhcnRpdGlvbiBwYXN0ZUtleSAnICtcbiAgICAgICdwYXRoQW5pbWF0aW9uIHBhdXNlIHBjbG9zZSBwZXJjZW50IHBlcmZvcm1hbmNlT3B0aW9ucyBwZnhzdHJva2VzIHBpY2tXYWxrIHBpY3R1cmUgJyArXG4gICAgICAncGl4ZWxNb3ZlIHBsYW5hclNyZiBwbGFuZSBwbGF5IHBsYXliYWNrT3B0aW9ucyBwbGF5Ymxhc3QgcGx1Z0F0dHIgcGx1Z05vZGUgcGx1Z2luSW5mbyAnICtcbiAgICAgICdwbHVnaW5SZXNvdXJjZVV0aWwgcG9pbnRDb25zdHJhaW50IHBvaW50Q3VydmVDb25zdHJhaW50IHBvaW50TGlnaHQgcG9pbnRNYXRyaXhNdWx0ICcgK1xuICAgICAgJ3BvaW50T25DdXJ2ZSBwb2ludE9uU3VyZmFjZSBwb2ludFBvc2l0aW9uIHBvbGVWZWN0b3JDb25zdHJhaW50IHBvbHlBcHBlbmQgJyArXG4gICAgICAncG9seUFwcGVuZEZhY2V0Q3R4IHBvbHlBcHBlbmRWZXJ0ZXggcG9seUF1dG9Qcm9qZWN0aW9uIHBvbHlBdmVyYWdlTm9ybWFsICcgK1xuICAgICAgJ3BvbHlBdmVyYWdlVmVydGV4IHBvbHlCZXZlbCBwb2x5QmxlbmRDb2xvciBwb2x5QmxpbmREYXRhIHBvbHlCb29sT3AgcG9seUJyaWRnZUVkZ2UgJyArXG4gICAgICAncG9seUNhY2hlTW9uaXRvciBwb2x5Q2hlY2sgcG9seUNoaXBPZmYgcG9seUNsaXBib2FyZCBwb2x5Q2xvc2VCb3JkZXIgcG9seUNvbGxhcHNlRWRnZSAnICtcbiAgICAgICdwb2x5Q29sbGFwc2VGYWNldCBwb2x5Q29sb3JCbGluZERhdGEgcG9seUNvbG9yRGVsIHBvbHlDb2xvclBlclZlcnRleCBwb2x5Q29sb3JTZXQgJyArXG4gICAgICAncG9seUNvbXBhcmUgcG9seUNvbmUgcG9seUNvcHlVViBwb2x5Q3JlYXNlIHBvbHlDcmVhc2VDdHggcG9seUNyZWF0ZUZhY2V0ICcgK1xuICAgICAgJ3BvbHlDcmVhdGVGYWNldEN0eCBwb2x5Q3ViZSBwb2x5Q3V0IHBvbHlDdXRDdHggcG9seUN5bGluZGVyIHBvbHlDeWxpbmRyaWNhbFByb2plY3Rpb24gJyArXG4gICAgICAncG9seURlbEVkZ2UgcG9seURlbEZhY2V0IHBvbHlEZWxWZXJ0ZXggcG9seUR1cGxpY2F0ZUFuZENvbm5lY3QgcG9seUR1cGxpY2F0ZUVkZ2UgJyArXG4gICAgICAncG9seUVkaXRVViBwb2x5RWRpdFVWU2hlbGwgcG9seUV2YWx1YXRlIHBvbHlFeHRydWRlRWRnZSBwb2x5RXh0cnVkZUZhY2V0ICcgK1xuICAgICAgJ3BvbHlFeHRydWRlVmVydGV4IHBvbHlGbGlwRWRnZSBwb2x5RmxpcFVWIHBvbHlGb3JjZVVWIHBvbHlHZW9TYW1wbGVyIHBvbHlIZWxpeCAnICtcbiAgICAgICdwb2x5SW5mbyBwb2x5SW5zdGFsbEFjdGlvbiBwb2x5TGF5b3V0VVYgcG9seUxpc3RDb21wb25lbnRDb252ZXJzaW9uIHBvbHlNYXBDdXQgJyArXG4gICAgICAncG9seU1hcERlbCBwb2x5TWFwU2V3IHBvbHlNYXBTZXdNb3ZlIHBvbHlNZXJnZUVkZ2UgcG9seU1lcmdlRWRnZUN0eCBwb2x5TWVyZ2VGYWNldCAnICtcbiAgICAgICdwb2x5TWVyZ2VGYWNldEN0eCBwb2x5TWVyZ2VVViBwb2x5TWVyZ2VWZXJ0ZXggcG9seU1pcnJvckZhY2UgcG9seU1vdmVFZGdlICcgK1xuICAgICAgJ3BvbHlNb3ZlRmFjZXQgcG9seU1vdmVGYWNldFVWIHBvbHlNb3ZlVVYgcG9seU1vdmVWZXJ0ZXggcG9seU5vcm1hbCBwb2x5Tm9ybWFsUGVyVmVydGV4ICcgK1xuICAgICAgJ3BvbHlOb3JtYWxpemVVViBwb2x5T3B0VXZzIHBvbHlPcHRpb25zIHBvbHlPdXRwdXQgcG9seVBpcGUgcG9seVBsYW5hclByb2plY3Rpb24gJyArXG4gICAgICAncG9seVBsYW5lIHBvbHlQbGF0b25pY1NvbGlkIHBvbHlQb2tlIHBvbHlQcmltaXRpdmUgcG9seVByaXNtIHBvbHlQcm9qZWN0aW9uICcgK1xuICAgICAgJ3BvbHlQeXJhbWlkIHBvbHlRdWFkIHBvbHlRdWVyeUJsaW5kRGF0YSBwb2x5UmVkdWNlIHBvbHlTZWxlY3QgcG9seVNlbGVjdENvbnN0cmFpbnQgJyArXG4gICAgICAncG9seVNlbGVjdENvbnN0cmFpbnRNb25pdG9yIHBvbHlTZWxlY3RDdHggcG9seVNlbGVjdEVkaXRDdHggcG9seVNlcGFyYXRlICcgK1xuICAgICAgJ3BvbHlTZXRUb0ZhY2VOb3JtYWwgcG9seVNld0VkZ2UgcG9seVNob3J0ZXN0UGF0aEN0eCBwb2x5U21vb3RoIHBvbHlTb2Z0RWRnZSAnICtcbiAgICAgICdwb2x5U3BoZXJlIHBvbHlTcGhlcmljYWxQcm9qZWN0aW9uIHBvbHlTcGxpdCBwb2x5U3BsaXRDdHggcG9seVNwbGl0RWRnZSBwb2x5U3BsaXRSaW5nICcgK1xuICAgICAgJ3BvbHlTcGxpdFZlcnRleCBwb2x5U3RyYWlnaHRlblVWQm9yZGVyIHBvbHlTdWJkaXZpZGVFZGdlIHBvbHlTdWJkaXZpZGVGYWNldCAnICtcbiAgICAgICdwb2x5VG9TdWJkaXYgcG9seVRvcnVzIHBvbHlUcmFuc2ZlciBwb2x5VHJpYW5ndWxhdGUgcG9seVVWU2V0IHBvbHlVbml0ZSBwb2x5V2VkZ2VGYWNlICcgK1xuICAgICAgJ3BvcGVuIHBvcHVwTWVudSBwb3NlIHBvdyBwcmVsb2FkUmVmRWQgcHJpbnQgcHJvZ3Jlc3NCYXIgcHJvZ3Jlc3NXaW5kb3cgcHJvakZpbGVWaWV3ZXIgJyArXG4gICAgICAncHJvamVjdEN1cnZlIHByb2plY3RUYW5nZW50IHByb2plY3Rpb25Db250ZXh0IHByb2plY3Rpb25NYW5pcCBwcm9tcHREaWFsb2cgcHJvcE1vZEN0eCAnICtcbiAgICAgICdwcm9wTW92ZSBwc2RDaGFubmVsT3V0bGluZXIgcHNkRWRpdFRleHR1cmVGaWxlIHBzZEV4cG9ydCBwc2RUZXh0dXJlRmlsZSBwdXRlbnYgcHdkICcgK1xuICAgICAgJ3B5dGhvbiBxdWVyeVN1YmRpdiBxdWl0IHJhZF90b19kZWcgcmFkaWFsIHJhZGlvQnV0dG9uIHJhZGlvQnV0dG9uR3JwIHJhZGlvQ29sbGVjdGlvbiAnICtcbiAgICAgICdyYWRpb01lbnVJdGVtQ29sbGVjdGlvbiByYW1wQ29sb3JQb3J0IHJhbmQgcmFuZG9taXplRm9sbGljbGVzIHJhbmRzdGF0ZSByYW5nZUNvbnRyb2wgJyArXG4gICAgICAncmVhZFRha2UgcmVidWlsZEN1cnZlIHJlYnVpbGRTdXJmYWNlIHJlY29yZEF0dHIgcmVjb3JkRGV2aWNlIHJlZG8gcmVmZXJlbmNlICcgK1xuICAgICAgJ3JlZmVyZW5jZUVkaXQgcmVmZXJlbmNlUXVlcnkgcmVmaW5lU3ViZGl2U2VsZWN0aW9uTGlzdCByZWZyZXNoIHJlZnJlc2hBRSAnICtcbiAgICAgICdyZWdpc3RlclBsdWdpblJlc291cmNlIHJlaGFzaCByZWxvYWRJbWFnZSByZW1vdmVKb2ludCByZW1vdmVNdWx0aUluc3RhbmNlICcgK1xuICAgICAgJ3JlbW92ZVBhbmVsQ2F0ZWdvcnkgcmVuYW1lIHJlbmFtZUF0dHIgcmVuYW1lU2VsZWN0aW9uTGlzdCByZW5hbWVVSSByZW5kZXIgJyArXG4gICAgICAncmVuZGVyR2xvYmFsc05vZGUgcmVuZGVySW5mbyByZW5kZXJMYXllckJ1dHRvbiByZW5kZXJMYXllclBhcmVudCAnICtcbiAgICAgICdyZW5kZXJMYXllclBvc3RQcm9jZXNzIHJlbmRlckxheWVyVW5wYXJlbnQgcmVuZGVyTWFuaXAgcmVuZGVyUGFydGl0aW9uICcgK1xuICAgICAgJ3JlbmRlclF1YWxpdHlOb2RlIHJlbmRlclNldHRpbmdzIHJlbmRlclRodW1ibmFpbFVwZGF0ZSByZW5kZXJXaW5kb3dFZGl0b3IgJyArXG4gICAgICAncmVuZGVyV2luZG93U2VsZWN0Q29udGV4dCByZW5kZXJlciByZW9yZGVyIHJlb3JkZXJEZWZvcm1lcnMgcmVxdWlyZXMgcmVyb290ICcgK1xuICAgICAgJ3Jlc2FtcGxlRmx1aWQgcmVzZXRBRSByZXNldFBmeFRvUG9seUNhbWVyYSByZXNldFRvb2wgcmVzb2x1dGlvbk5vZGUgcmV0YXJnZXQgJyArXG4gICAgICAncmV2ZXJzZUN1cnZlIHJldmVyc2VTdXJmYWNlIHJldm9sdmUgcmdiX3RvX2hzdiByaWdpZEJvZHkgcmlnaWRTb2x2ZXIgcm9sbCByb2xsQ3R4ICcgK1xuICAgICAgJ3Jvb3RPZiByb3Qgcm90YXRlIHJvdGF0aW9uSW50ZXJwb2xhdGlvbiByb3VuZENvbnN0YW50UmFkaXVzIHJvd0NvbHVtbkxheW91dCByb3dMYXlvdXQgJyArXG4gICAgICAncnVuVGltZUNvbW1hbmQgcnVudXAgc2FtcGxlSW1hZ2Ugc2F2ZUFsbFNoZWx2ZXMgc2F2ZUF0dHJQcmVzZXQgc2F2ZUZsdWlkIHNhdmVJbWFnZSAnICtcbiAgICAgICdzYXZlSW5pdGlhbFN0YXRlIHNhdmVNZW51IHNhdmVQcmVmT2JqZWN0cyBzYXZlUHJlZnMgc2F2ZVNoZWxmIHNhdmVUb29sU2V0dGluZ3Mgc2NhbGUgJyArXG4gICAgICAnc2NhbGVCcnVzaEJyaWdodG5lc3Mgc2NhbGVDb21wb25lbnRzIHNjYWxlQ29uc3RyYWludCBzY2FsZUtleSBzY2FsZUtleUN0eCBzY2VuZUVkaXRvciAnICtcbiAgICAgICdzY2VuZVVJUmVwbGFjZW1lbnQgc2NtaCBzY3JpcHRDdHggc2NyaXB0RWRpdG9ySW5mbyBzY3JpcHRKb2Igc2NyaXB0Tm9kZSBzY3JpcHRUYWJsZSAnICtcbiAgICAgICdzY3JpcHRUb1NoZWxmIHNjcmlwdGVkUGFuZWwgc2NyaXB0ZWRQYW5lbFR5cGUgc2Nyb2xsRmllbGQgc2Nyb2xsTGF5b3V0IHNjdWxwdCAnICtcbiAgICAgICdzZWFyY2hQYXRoQXJyYXkgc2VlZCBzZWxMb2FkU2V0dGluZ3Mgc2VsZWN0IHNlbGVjdENvbnRleHQgc2VsZWN0Q3VydmVDViBzZWxlY3RLZXkgJyArXG4gICAgICAnc2VsZWN0S2V5Q3R4IHNlbGVjdEtleWZyYW1lUmVnaW9uQ3R4IHNlbGVjdE1vZGUgc2VsZWN0UHJlZiBzZWxlY3RQcmlvcml0eSBzZWxlY3RUeXBlICcgK1xuICAgICAgJ3NlbGVjdGVkTm9kZXMgc2VsZWN0aW9uQ29ubmVjdGlvbiBzZXBhcmF0b3Igc2V0QXR0ciBzZXRBdHRyRW51bVJlc291cmNlICcgK1xuICAgICAgJ3NldEF0dHJNYXBwaW5nIHNldEF0dHJOaWNlTmFtZVJlc291cmNlIHNldENvbnN0cmFpbnRSZXN0UG9zaXRpb24gJyArXG4gICAgICAnc2V0RGVmYXVsdFNoYWRpbmdHcm91cCBzZXREcml2ZW5LZXlmcmFtZSBzZXREeW5hbWljIHNldEVkaXRDdHggc2V0RWRpdG9yIHNldEZsdWlkQXR0ciAnICtcbiAgICAgICdzZXRGb2N1cyBzZXRJbmZpbml0eSBzZXRJbnB1dERldmljZU1hcHBpbmcgc2V0S2V5Q3R4IHNldEtleVBhdGggc2V0S2V5ZnJhbWUgJyArXG4gICAgICAnc2V0S2V5ZnJhbWVCbGVuZHNoYXBlVGFyZ2V0V3RzIHNldE1lbnVNb2RlIHNldE5vZGVOaWNlTmFtZVJlc291cmNlIHNldE5vZGVUeXBlRmxhZyAnICtcbiAgICAgICdzZXRQYXJlbnQgc2V0UGFydGljbGVBdHRyIHNldFBmeFRvUG9seUNhbWVyYSBzZXRQbHVnaW5SZXNvdXJjZSBzZXRQcm9qZWN0ICcgK1xuICAgICAgJ3NldFN0YW1wRGVuc2l0eSBzZXRTdGFydHVwTWVzc2FnZSBzZXRTdGF0ZSBzZXRUb29sVG8gc2V0VUlUZW1wbGF0ZSBzZXRYZm9ybU1hbmlwIHNldHMgJyArXG4gICAgICAnc2hhZGluZ0Nvbm5lY3Rpb24gc2hhZGluZ0dlb21ldHJ5UmVsQ3R4IHNoYWRpbmdMaWdodFJlbEN0eCBzaGFkaW5nTmV0d29ya0NvbXBhcmUgJyArXG4gICAgICAnc2hhZGluZ05vZGUgc2hhcGVDb21wYXJlIHNoZWxmQnV0dG9uIHNoZWxmTGF5b3V0IHNoZWxmVGFiTGF5b3V0IHNoZWxsRmllbGQgJyArXG4gICAgICAnc2hvcnROYW1lT2Ygc2hvd0hlbHAgc2hvd0hpZGRlbiBzaG93TWFuaXBDdHggc2hvd1NlbGVjdGlvbkluVGl0bGUgJyArXG4gICAgICAnc2hvd1NoYWRpbmdHcm91cEF0dHJFZGl0b3Igc2hvd1dpbmRvdyBzaWduIHNpbXBsaWZ5IHNpbiBzaW5nbGVQcm9maWxlQmlyYWlsU3VyZmFjZSAnICtcbiAgICAgICdzaXplIHNpemVCeXRlcyBza2luQ2x1c3RlciBza2luUGVyY2VudCBzbW9vdGhDdXJ2ZSBzbW9vdGhUYW5nZW50U3VyZmFjZSBzbW9vdGhzdGVwICcgK1xuICAgICAgJ3NuYXAydG8yIHNuYXBLZXkgc25hcE1vZGUgc25hcFRvZ2V0aGVyQ3R4IHNuYXBzaG90IHNvZnQgc29mdE1vZCBzb2Z0TW9kQ3R4IHNvcnQgc291bmQgJyArXG4gICAgICAnc291bmRDb250cm9sIHNvdXJjZSBzcGFjZUxvY2F0b3Igc3BoZXJlIHNwaHJhbmQgc3BvdExpZ2h0IHNwb3RMaWdodFByZXZpZXdQb3J0ICcgK1xuICAgICAgJ3NwcmVhZFNoZWV0RWRpdG9yIHNwcmluZyBzcXJ0IHNxdWFyZVN1cmZhY2Ugc3J0Q29udGV4dCBzdGFja1RyYWNlIHN0YXJ0U3RyaW5nICcgK1xuICAgICAgJ3N0YXJ0c1dpdGggc3RpdGNoQW5kRXhwbG9kZVNoZWxsIHN0aXRjaFN1cmZhY2Ugc3RpdGNoU3VyZmFjZVBvaW50cyBzdHJjbXAgJyArXG4gICAgICAnc3RyaW5nQXJyYXlDYXRlbmF0ZSBzdHJpbmdBcnJheUNvbnRhaW5zIHN0cmluZ0FycmF5Q291bnQgc3RyaW5nQXJyYXlJbnNlcnRBdEluZGV4ICcgK1xuICAgICAgJ3N0cmluZ0FycmF5SW50ZXJzZWN0b3Igc3RyaW5nQXJyYXlSZW1vdmUgc3RyaW5nQXJyYXlSZW1vdmVBdEluZGV4ICcgK1xuICAgICAgJ3N0cmluZ0FycmF5UmVtb3ZlRHVwbGljYXRlcyBzdHJpbmdBcnJheVJlbW92ZUV4YWN0IHN0cmluZ0FycmF5VG9TdHJpbmcgJyArXG4gICAgICAnc3RyaW5nVG9TdHJpbmdBcnJheSBzdHJpcCBzdHJpcFByZWZpeEZyb21OYW1lIHN0cm9rZSBzdWJkQXV0b1Byb2plY3Rpb24gJyArXG4gICAgICAnc3ViZENsZWFuVG9wb2xvZ3kgc3ViZENvbGxhcHNlIHN1YmREdXBsaWNhdGVBbmRDb25uZWN0IHN1YmRFZGl0VVYgJyArXG4gICAgICAnc3ViZExpc3RDb21wb25lbnRDb252ZXJzaW9uIHN1YmRNYXBDdXQgc3ViZE1hcFNld01vdmUgc3ViZE1hdGNoVG9wb2xvZ3kgc3ViZE1pcnJvciAnICtcbiAgICAgICdzdWJkVG9CbGluZCBzdWJkVG9Qb2x5IHN1YmRUcmFuc2ZlclVWc1RvQ2FjaGUgc3ViZGl2IHN1YmRpdkNyZWFzZSAnICtcbiAgICAgICdzdWJkaXZEaXNwbGF5U21vb3RobmVzcyBzdWJzdGl0dXRlIHN1YnN0aXR1dGVBbGxTdHJpbmcgc3Vic3RpdHV0ZUdlb21ldHJ5IHN1YnN0cmluZyAnICtcbiAgICAgICdzdXJmYWNlIHN1cmZhY2VTYW1wbGVyIHN1cmZhY2VTaGFkZXJMaXN0IHN3YXRjaERpc3BsYXlQb3J0IHN3aXRjaFRhYmxlIHN5bWJvbEJ1dHRvbiAnICtcbiAgICAgICdzeW1ib2xDaGVja0JveCBzeXNGaWxlIHN5c3RlbSB0YWJMYXlvdXQgdGFuIHRhbmdlbnRDb25zdHJhaW50IHRleExhdHRpY2VEZWZvcm1Db250ZXh0ICcgK1xuICAgICAgJ3RleE1hbmlwQ29udGV4dCB0ZXhNb3ZlQ29udGV4dCB0ZXhNb3ZlVVZTaGVsbENvbnRleHQgdGV4Um90YXRlQ29udGV4dCB0ZXhTY2FsZUNvbnRleHQgJyArXG4gICAgICAndGV4U2VsZWN0Q29udGV4dCB0ZXhTZWxlY3RTaG9ydGVzdFBhdGhDdHggdGV4U211ZGdlVVZDb250ZXh0IHRleFdpblRvb2xDdHggdGV4dCAnICtcbiAgICAgICd0ZXh0Q3VydmVzIHRleHRGaWVsZCB0ZXh0RmllbGRCdXR0b25HcnAgdGV4dEZpZWxkR3JwIHRleHRNYW5pcCB0ZXh0U2Nyb2xsTGlzdCAnICtcbiAgICAgICd0ZXh0VG9TaGVsZiB0ZXh0dXJlRGlzcGxhY2VQbGFuZSB0ZXh0dXJlSGFpckNvbG9yIHRleHR1cmVQbGFjZW1lbnRDb250ZXh0ICcgK1xuICAgICAgJ3RleHR1cmVXaW5kb3cgdGhyZWFkQ291bnQgdGhyZWVQb2ludEFyY0N0eCB0aW1lQ29udHJvbCB0aW1lUG9ydCB0aW1lclggdG9OYXRpdmVQYXRoICcgK1xuICAgICAgJ3RvZ2dsZSB0b2dnbGVBeGlzIHRvZ2dsZVdpbmRvd1Zpc2liaWxpdHkgdG9rZW5pemUgdG9rZW5pemVMaXN0IHRvbGVyYW5jZSB0b2xvd2VyICcgK1xuICAgICAgJ3Rvb2xCdXR0b24gdG9vbENvbGxlY3Rpb24gdG9vbERyb3BwZWQgdG9vbEhhc09wdGlvbnMgdG9vbFByb3BlcnR5V2luZG93IHRvcnVzIHRvdXBwZXIgJyArXG4gICAgICAndHJhY2UgdHJhY2sgdHJhY2tDdHggdHJhbnNmZXJBdHRyaWJ1dGVzIHRyYW5zZm9ybUNvbXBhcmUgdHJhbnNmb3JtTGltaXRzIHRyYW5zbGF0b3IgJyArXG4gICAgICAndHJpbSB0cnVuYyB0cnVuY2F0ZUZsdWlkQ2FjaGUgdHJ1bmNhdGVIYWlyQ2FjaGUgdHVtYmxlIHR1bWJsZUN0eCB0dXJidWxlbmNlICcgK1xuICAgICAgJ3R3b1BvaW50QXJjQ3R4IHVpUmVzIHVpVGVtcGxhdGUgdW5hc3NpZ25JbnB1dERldmljZSB1bmRvIHVuZG9JbmZvIHVuZ3JvdXAgdW5pZm9ybSB1bml0ICcgK1xuICAgICAgJ3VubG9hZFBsdWdpbiB1bnRhbmdsZVVWIHVudGl0bGVkRmlsZU5hbWUgdW50cmltIHVwQXhpcyB1cGRhdGVBRSB1c2VyQ3R4IHV2TGluayAnICtcbiAgICAgICd1dlNuYXBzaG90IHZhbGlkYXRlU2hlbGZOYW1lIHZlY3Rvcml6ZSB2aWV3MmRUb29sQ3R4IHZpZXdDYW1lcmEgdmlld0NsaXBQbGFuZSAnICtcbiAgICAgICd2aWV3Rml0IHZpZXdIZWFkT24gdmlld0xvb2tBdCB2aWV3TWFuaXAgdmlld1BsYWNlIHZpZXdTZXQgdmlzb3Igdm9sdW1lQXhpcyB2b3J0ZXggJyArXG4gICAgICAnd2FpdEN1cnNvciB3YXJuaW5nIHdlYkJyb3dzZXIgd2ViQnJvd3NlclByZWZzIHdoYXRJcyB3aW5kb3cgd2luZG93UHJlZiB3aXJlICcgK1xuICAgICAgJ3dpcmVDb250ZXh0IHdvcmtzcGFjZSB3cmlua2xlIHdyaW5rbGVDb250ZXh0IHdyaXRlVGFrZSB4Ym1MYW5nUGF0aExpc3QgeGZvcm0nLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcJFxcXFxkJyxcbiAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwkXFxcXCVcXFxcQFxcXFwqXShcXFxcXlxcXFx3XFxcXGJ8I1xcXFx3K3xbXlxcXFxzXFxcXHd7XXx7XFxcXHcrfXxcXFxcdyspJ1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVkFSUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCRcXFxcZCsnXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCR7JywgZW5kOiAnfSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdbXFxcXCRcXFxcQF0nICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgfVxuICBdO1xuICB2YXIgREVGQVVMVCA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICBsZXhlbXM6ICdbYS16L19dKycsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnb24gb2ZmIHllcyBubyB0cnVlIGZhbHNlIG5vbmUgYmxvY2tlZCBkZWJ1ZyBpbmZvIG5vdGljZSB3YXJuIGVycm9yIGNyaXQgJyArXG4gICAgICAgICdzZWxlY3QgYnJlYWsgbGFzdCBwZXJtYW5lbnQgcmVkaXJlY3Qga3F1ZXVlIHJ0c2lnIGVwb2xsIHBvbGwgL2Rldi9wb2xsJ1xuICAgIH0sXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGlsbGVnYWw6ICc9PicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUyksXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IFwiJ1wiLCBlbmQ6IFwiJ1wiLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3VybCcsXG4gICAgICAgIGJlZ2luOiAnKFthLXpdKyk6LycsIGVuZDogJ1xcXFxzJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIlxcXFxzXFxcXF5cIiwgZW5kOiBcIlxcXFxzfHt8O1wiLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUylcbiAgICAgIH0sXG4gICAgICAvLyByZWdleHAgbG9jYXRpb25zICh+LCB+KilcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46IFwiflxcXFwqP1xcXFxzK1wiLCBlbmQ6IFwiXFxcXHN8e3w7XCIsIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKVxuICAgICAgfSxcbiAgICAgIC8vICouZXhhbXBsZS5jb21cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXCooXFxcXC5bYS16XFxcXC1dKykrXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUylcbiAgICAgIH0sXG4gICAgICAvLyBzdWIuZXhhbXBsZS4qXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIihbYS16XFxcXC1dK1xcXFwuKStcXFxcKlwiLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gSVBcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkezEsM31cXFxcLlxcXFxkezEsM31cXFxcLlxcXFxkezEsM31cXFxcLlxcXFxkezEsM30oOlxcXFxkezEsNX0pP1xcXFxiJ1xuICAgICAgfSxcbiAgICAgIC8vIHVuaXRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJcXFxcZCtba0ttTWdHZHNoZHd5XSpcXFxcYicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF0uY29uY2F0KFZBUlMpXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSArICdcXFxccycsIGVuZDogJzt8eycsIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgICBzdGFydHM6IERFRkFVTFRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIGlsbGVnYWw6ICdbXlxcXFxzXFxcXH1dJ1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIE9CSkNfS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdpbnQgZmxvYXQgd2hpbGUgcHJpdmF0ZSBjaGFyIGNhdGNoIGV4cG9ydCBzaXplb2YgdHlwZWRlZiBjb25zdCBzdHJ1Y3QgZm9yIHVuaW9uICcgK1xuICAgICAgJ3Vuc2lnbmVkIGxvbmcgdm9sYXRpbGUgc3RhdGljIHByb3RlY3RlZCBib29sIG11dGFibGUgaWYgcHVibGljIGRvIHJldHVybiBnb3RvIHZvaWQgJyArXG4gICAgICAnZW51bSBlbHNlIGJyZWFrIGV4dGVybiBjbGFzcyBhc20gY2FzZSBzaG9ydCBkZWZhdWx0IGRvdWJsZSB0aHJvdyByZWdpc3RlciBleHBsaWNpdCAnICtcbiAgICAgICdzaWduZWQgdHlwZW5hbWUgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIHdjaGFyX3QgaW5saW5lIHJlYWRvbmx5IGFzc2lnbiBwcm9wZXJ0eSAnICtcbiAgICAgICdwcm90b2NvbCBzZWxmIHN5bmNocm9uaXplZCBlbmQgc3ludGhlc2l6ZSBpZCBvcHRpb25hbCByZXF1aXJlZCBpbXBsZW1lbnRhdGlvbiAnICtcbiAgICAgICdub25hdG9taWMgaW50ZXJmYWNlIHN1cGVyIHVuaWNoYXIgZmluYWxseSBkeW5hbWljIElCT3V0bGV0IElCQWN0aW9uIHNlbGVjdG9yIHN0cm9uZyAnICtcbiAgICAgICd3ZWFrIHJlYWRvbmx5JyxcbiAgICBsaXRlcmFsOlxuICAgIFx0J2ZhbHNlIHRydWUgRkFMU0UgVFJVRSBuaWwgWUVTIE5PIE5VTEwnLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ05TU3RyaW5nIE5TRGljdGlvbmFyeSBDR1JlY3QgQ0dQb2ludCBVSUJ1dHRvbiBVSUxhYmVsIFVJVGV4dFZpZXcgVUlXZWJWaWV3IE1LTWFwVmlldyAnICtcbiAgICAgICdVSVNlZ21lbnRlZENvbnRyb2wgTlNPYmplY3QgVUlUYWJsZVZpZXdEZWxlZ2F0ZSBVSVRhYmxlVmlld0RhdGFTb3VyY2UgTlNUaHJlYWQgJyArXG4gICAgICAnVUlBY3Rpdml0eUluZGljYXRvciBVSVRhYmJhciBVSVRvb2xCYXIgVUlCYXJCdXR0b25JdGVtIFVJSW1hZ2VWaWV3IE5TQXV0b3JlbGVhc2VQb29sICcgK1xuICAgICAgJ1VJVGFibGVWaWV3IEJPT0wgTlNJbnRlZ2VyIENHRmxvYXQgTlNFeGNlcHRpb24gTlNMb2cgTlNNdXRhYmxlU3RyaW5nIE5TTXV0YWJsZUFycmF5ICcgK1xuICAgICAgJ05TTXV0YWJsZURpY3Rpb25hcnkgTlNVUkwgTlNJbmRleFBhdGggQ0dTaXplIFVJVGFibGVWaWV3Q2VsbCBVSVZpZXcgVUlWaWV3Q29udHJvbGxlciAnICtcbiAgICAgICdVSU5hdmlnYXRpb25CYXIgVUlOYXZpZ2F0aW9uQ29udHJvbGxlciBVSVRhYkJhckNvbnRyb2xsZXIgVUlQb3BvdmVyQ29udHJvbGxlciAnICtcbiAgICAgICdVSVBvcG92ZXJDb250cm9sbGVyRGVsZWdhdGUgVUlJbWFnZSBOU051bWJlciBVSVNlYXJjaEJhciBOU0ZldGNoZWRSZXN1bHRzQ29udHJvbGxlciAnICtcbiAgICAgICdOU0ZldGNoZWRSZXN1bHRzQ2hhbmdlVHlwZSBVSVNjcm9sbFZpZXcgVUlTY3JvbGxWaWV3RGVsZWdhdGUgVUlFZGdlSW5zZXRzIFVJQ29sb3IgJyArXG4gICAgICAnVUlGb250IFVJQXBwbGljYXRpb24gTlNOb3RGb3VuZCBOU05vdGlmaWNhdGlvbkNlbnRlciBOU05vdGlmaWNhdGlvbiAnICtcbiAgICAgICdVSUxvY2FsTm90aWZpY2F0aW9uIE5TQnVuZGxlIE5TRmlsZU1hbmFnZXIgTlNUaW1lSW50ZXJ2YWwgTlNEYXRlIE5TQ2FsZW5kYXIgJyArXG4gICAgICAnTlNVc2VyRGVmYXVsdHMgVUlXaW5kb3cgTlNSYW5nZSBOU0FycmF5IE5TRXJyb3IgTlNVUkxSZXF1ZXN0IE5TVVJMQ29ubmVjdGlvbiBjbGFzcyAnICtcbiAgICAgICdVSUludGVyZmFjZU9yaWVudGF0aW9uIE1QTW92aWVQbGF5ZXJDb250cm9sbGVyIGRpc3BhdGNoX29uY2VfdCAnICtcbiAgICAgICdkaXNwYXRjaF9xdWV1ZV90IGRpc3BhdGNoX3N5bmMgZGlzcGF0Y2hfYXN5bmMgZGlzcGF0Y2hfb25jZSdcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogT0JKQ19LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCcnLFxuICAgICAgICBlbmQ6ICdbXlxcXFxcXFxcXVxcJycsXG4gICAgICAgIGlsbGVnYWw6ICdbXlxcXFxcXFxcXVteXFwnXSdcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjaW1wb3J0JyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgYmVnaW46ICdcXFwiJyxcbiAgICAgICAgICBlbmQ6ICdcXFwiJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiAnPCcsXG4gICAgICAgICAgZW5kOiAnPidcbiAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLFxuICAgICAgICBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICBlbmQ6ICcoe3wkKScsXG4gICAgICAgIGtleXdvcmRzOiAnaW50ZXJmYWNlIGNsYXNzIHByb3RvY29sIGltcGxlbWVudGF0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnaWQnLFxuICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXC4nK2hsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ14jJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1xcXFxecmVteycsIGVuZDogJ30nLFxuICAgICAgICByZWxldmFuY2U6IDEwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgICAgICAgICAgY29udGFpbnM6IFsnc2VsZiddXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJ15AKD86QkFTRXxVU0V8Q0xBU1N8T1BUSU9OUykkJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogJ0BbXFxcXHdcXFxcLV0rXFxcXFtbXFxcXHdeO1xcXFwtXSpcXFxcXSg/OlxcXFxbW1xcXFx3XjtcXFxcLV0qXFxcXF0pPyg/Oi4qKSQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCRcXFxcez9bXFxcXHdcXFxcLVxcXFwuXFxcXDpdK1xcXFx9PydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2tleXdvcmQnLFxuICAgICAgICBiZWdpbjogJ1xcXFxeW1xcXFx3XFxcXC1cXFxcLlxcXFw6XSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxeI1swLTlhLWZBLUZdKydcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgUEVSTF9LRVlXT1JEUyA9ICdnZXRwd2VudCBnZXRzZXJ2ZW50IHF1b3RlbWV0YSBtc2dyY3Ygc2NhbGFyIGtpbGwgZGJtY2xvc2UgdW5kZWYgbGMgJyArXG4gICAgJ21hIHN5c3dyaXRlIHRyIHNlbmQgdW1hc2sgc3lzb3BlbiBzaG13cml0ZSB2ZWMgcXggdXRpbWUgbG9jYWwgb2N0IHNlbWN0bCBsb2NhbHRpbWUgJyArXG4gICAgJ3JlYWRwaXBlIGRvIHJldHVybiBmb3JtYXQgcmVhZCBzcHJpbnRmIGRibW9wZW4gcG9wIGdldHBncnAgbm90IGdldHB3bmFtIHJld2luZGRpciBxcScgK1xuICAgICdmaWxlbm8gcXcgZW5kcHJvdG9lbnQgd2FpdCBzZXRob3N0ZW50IGJsZXNzIHN8MCBvcGVuZGlyIGNvbnRpbnVlIGVhY2ggc2xlZXAgZW5kZ3JlbnQgJyArXG4gICAgJ3NodXRkb3duIGR1bXAgY2hvbXAgY29ubmVjdCBnZXRzb2NrbmFtZSBkaWUgc29ja2V0cGFpciBjbG9zZSBmbG9jayBleGlzdHMgaW5kZXggc2htZ2V0JyArXG4gICAgJ3N1YiBmb3IgZW5kcHdlbnQgcmVkbyBsc3RhdCBtc2djdGwgc2V0cGdycCBhYnMgZXhpdCBzZWxlY3QgcHJpbnQgcmVmIGdldGhvc3RieWFkZHIgJyArXG4gICAgJ3Vuc2hpZnQgZmNudGwgc3lzY2FsbCBnb3RvIGdldG5ldGJ5YWRkciBqb2luIGdtdGltZSBzeW1saW5rIHNlbWdldCBzcGxpY2UgeHwwICcgK1xuICAgICdnZXRwZWVybmFtZSByZWN2IGxvZyBzZXRzb2Nrb3B0IGNvcyBsYXN0IHJldmVyc2UgZ2V0aG9zdGJ5bmFtZSBnZXRncm5hbSBzdHVkeSBmb3JtbGluZSAnICtcbiAgICAnZW5kaG9zdGVudCB0aW1lcyBjaG9wIGxlbmd0aCBnZXRob3N0ZW50IGdldG5ldGVudCBwYWNrIGdldHByb3RvZW50IGdldHNlcnZieW5hbWUgcmFuZCAnICtcbiAgICAnbWtkaXIgcG9zIGNobW9kIHl8MCBzdWJzdHIgZW5kbmV0ZW50IHByaW50ZiBuZXh0IG9wZW4gbXNnc25kIHJlYWRkaXIgdXNlIHVubGluayAnICtcbiAgICAnZ2V0c29ja29wdCBnZXRwcmlvcml0eSByaW5kZXggd2FudGFycmF5IGhleCBzeXN0ZW0gZ2V0c2VydmJ5cG9ydCBlbmRzZXJ2ZW50IGludCBjaHIgJyArXG4gICAgJ3VudGllIHJtZGlyIHByb3RvdHlwZSB0ZWxsIGxpc3RlbiBmb3JrIHNobXJlYWQgdWNmaXJzdCBzZXRwcm90b2VudCBlbHNlIHN5c3NlZWsgbGluayAnICtcbiAgICAnZ2V0Z3JnaWQgc2htY3RsIHdhaXRwaWQgdW5wYWNrIGdldG5ldGJ5bmFtZSByZXNldCBjaGRpciBncmVwIHNwbGl0IHJlcXVpcmUgY2FsbGVyICcgK1xuICAgICdsY2ZpcnN0IHVudGlsIHdhcm4gd2hpbGUgdmFsdWVzIHNoaWZ0IHRlbGxkaXIgZ2V0cHd1aWQgbXkgZ2V0cHJvdG9ieW51bWJlciBkZWxldGUgYW5kICcgK1xuICAgICdzb3J0IHVjIGRlZmluZWQgc3JhbmQgYWNjZXB0IHBhY2thZ2Ugc2Vla2RpciBnZXRwcm90b2J5bmFtZSBzZW1vcCBvdXIgcmVuYW1lIHNlZWsgaWYgcXwwICcgK1xuICAgICdjaHJvb3Qgc3lzcmVhZCBzZXRwd2VudCBubyBjcnlwdCBnZXRjIGNob3duIHNxcnQgd3JpdGUgc2V0bmV0ZW50IHNldHByaW9yaXR5IGZvcmVhY2ggJyArXG4gICAgJ3RpZSBzaW4gbXNnZ2V0IG1hcCBzdGF0IGdldGxvZ2luIHVubGVzcyBlbHNpZiB0cnVuY2F0ZSBleGVjIGtleXMgZ2xvYiB0aWVkIGNsb3NlZGlyJyArXG4gICAgJ2lvY3RsIHNvY2tldCByZWFkbGluayBldmFsIHhvciByZWFkbGluZSBiaW5tb2RlIHNldHNlcnZlbnQgZW9mIG9yZCBiaW5kIGFsYXJtIHBpcGUgJyArXG4gICAgJ2F0YW4yIGdldGdyZW50IGV4cCB0aW1lIHB1c2ggc2V0Z3JlbnQgZ3QgbHQgb3IgbmUgbXwwIGJyZWFrIGdpdmVuIHNheSBzdGF0ZSB3aGVuJztcbiAgdmFyIFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJ1skQF1cXFxceycsIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogUEVSTF9LRVlXT1JEUyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHZhciBWQVIxID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1xcXFwkXFxcXGQnXG4gIH07XG4gIHZhciBWQVIyID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICBiZWdpbjogJ1tcXFxcJFxcXFwlXFxcXEBcXFxcKl0oXFxcXF5cXFxcd1xcXFxifCNcXFxcdysoXFxcXDpcXFxcOlxcXFx3KykqfFteXFxcXHNcXFxcd3tdfHtcXFxcdyt9fFxcXFx3KyhcXFxcOlxcXFw6XFxcXHcqKSopJ1xuICB9O1xuICB2YXIgU1RSSU5HX0NPTlRBSU5TID0gW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgU1VCU1QsIFZBUjEsIFZBUjJdO1xuICB2YXIgTUVUSE9EID0ge1xuICAgIGJlZ2luOiAnLT4nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7YmVnaW46IGhsanMuSURFTlRfUkV9LFxuICAgICAge2JlZ2luOiAneycsIGVuZDogJ30nfVxuICAgIF1cbiAgfTtcbiAgdmFyIENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdeKF9fRU5EX198X19EQVRBX18pJywgZW5kOiAnXFxcXG4kJyxcbiAgICByZWxldmFuY2U6IDVcbiAgfVxuICB2YXIgUEVSTF9ERUZBVUxUX0NPTlRBSU5TID0gW1xuICAgIFZBUjEsIFZBUjIsXG4gICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICBDT01NRU5ULFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICdeXFxcXD1cXFxcdycsIGVuZDogJ1xcXFw9Y3V0JywgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICB9LFxuICAgIE1FVEhPRCxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXHsnLCBlbmQ6ICdcXFxcfScsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFx8JywgZW5kOiAnXFxcXHwnLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcPCcsIGVuZDogJ1xcXFw+JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3F3XFxcXHMrcScsIGVuZDogJ3EnLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCcsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3tcXFxcdyt9JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwtP1xcXFx3K1xcXFxzKlxcXFw9XFxcXD4nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgYmVnaW46ICcoXFxcXGIwWzAtN19dKyl8KFxcXFxiMHhbMC05YS1mQS1GX10rKXwoXFxcXGJbMS05XVswLTlfXSooXFxcXC5bMC05X10rKT8pfFswX11cXFxcYicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHsgLy8gcmVnZXhwIGNvbnRhaW5lclxuICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKHNwbGl0fHJldHVybnxwcmludHxyZXZlcnNlfGdyZXApXFxcXGIpXFxcXHMqJyxcbiAgICAgIGtleXdvcmRzOiAnc3BsaXQgcmV0dXJuIHByaW50IHJldmVyc2UgZ3JlcCcsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICBjb250YWluczogW1xuICAgICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgICBDT01NRU5ULFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgICBiZWdpbjogJyhzfHRyfHkpLyhcXFxcXFxcXC58W14vXSkqLyhcXFxcXFxcXC58W14vXSkqL1thLXpdKicsXG4gICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgICBiZWdpbjogJyhtfHFyKT8vJywgZW5kOiAnL1thLXpdKicsXG4gICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICAgIHJlbGV2YW5jZTogMCAvLyBhbGxvd3MgZW1wdHkgXCIvL1wiIHdoaWNoIGlzIGEgY29tbW9uIGNvbW1lbnQgZGVsaW1pdGVyIGluIG90aGVyIGxhbmd1YWdlc1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdWInLFxuICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnKFxcXFxzKlxcXFwoLio/XFxcXCkpP1s7e10nLFxuICAgICAga2V5d29yZHM6ICdzdWInLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdvcGVyYXRvcicsXG4gICAgICBiZWdpbjogJy1cXFxcd1xcXFxiJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH1cbiAgXTtcbiAgU1VCU1QuY29udGFpbnMgPSBQRVJMX0RFRkFVTFRfQ09OVEFJTlM7XG4gIE1FVEhPRC5jb250YWluc1sxXS5jb250YWlucyA9IFBFUkxfREVGQVVMVF9DT05UQUlOUztcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBQRVJMX0tFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBQRVJMX0RFRkFVTFRfQ09OVEFJTlNcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBWQVJJQUJMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCQrW2EtekEtWl9cXHg3Zi1cXHhmZl1bYS16QS1aMC05X1xceDdmLVxceGZmXSonXG4gIH07XG4gIHZhciBTVFJJTkdTID0gW1xuICAgIGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiBudWxsfSksXG4gICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiBudWxsfSksXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYlwiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdiXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH1cbiAgXTtcbiAgdmFyIE5VTUJFUlMgPSBbaGxqcy5CSU5BUllfTlVNQkVSX01PREUsIGhsanMuQ19OVU1CRVJfTU9ERV07XG4gIHZhciBUSVRMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOlxuICAgICAgJ2FuZCBpbmNsdWRlX29uY2UgbGlzdCBhYnN0cmFjdCBnbG9iYWwgcHJpdmF0ZSBlY2hvIGludGVyZmFjZSBhcyBzdGF0aWMgZW5kc3dpdGNoICcgK1xuICAgICAgJ2FycmF5IG51bGwgaWYgZW5kd2hpbGUgb3IgY29uc3QgZm9yIGVuZGZvcmVhY2ggc2VsZiB2YXIgd2hpbGUgaXNzZXQgcHVibGljICcgK1xuICAgICAgJ3Byb3RlY3RlZCBleGl0IGZvcmVhY2ggdGhyb3cgZWxzZWlmIGluY2x1ZGUgX19GSUxFX18gZW1wdHkgcmVxdWlyZV9vbmNlIGRvIHhvciAnICtcbiAgICAgICdyZXR1cm4gaW1wbGVtZW50cyBwYXJlbnQgY2xvbmUgdXNlIF9fQ0xBU1NfXyBfX0xJTkVfXyBlbHNlIGJyZWFrIHByaW50IGV2YWwgbmV3ICcgK1xuICAgICAgJ2NhdGNoIF9fTUVUSE9EX18gY2FzZSBleGNlcHRpb24gcGhwX3VzZXJfZmlsdGVyIGRlZmF1bHQgZGllIHJlcXVpcmUgX19GVU5DVElPTl9fICcgK1xuICAgICAgJ2VuZGRlY2xhcmUgZmluYWwgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIGVuZGZvciBlbmRpZiBkZWNsYXJlIHVuc2V0IHRydWUgZmFsc2UgJyArXG4gICAgICAnbmFtZXNwYWNlIHRyYWl0IGdvdG8gaW5zdGFuY2VvZiBpbnN0ZWFkb2YgX19ESVJfXyBfX05BTUVTUEFDRV9fIF9faGFsdF9jb21waWxlcicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy9cXFxcKicsIGVuZDogJ1xcXFwqLycsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGhwZG9jJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXHNAW0EtWmEtel0rJ1xuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgYmVnaW46ICdfX2hhbHRfY29tcGlsZXIuKz87JywgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnPDw8W1xcJ1wiXT9cXFxcdytbXFwnXCJdPyQnLCBlbmQ6ICdeXFxcXHcrOycsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICc8XFxcXD9waHAnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJ1xcXFw/PidcbiAgICAgIH0sXG4gICAgICBWQVJJQUJMRSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcJHxcXFxcW3wlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBUSVRMRSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICAgICAgVkFSSUFCTEUsXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICAgICAgICAgIF0uY29uY2F0KFNUUklOR1MpLmNvbmNhdChOVU1CRVJTKVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcycsXG4gICAgICAgIGlsbGVnYWw6ICdbOlxcXFwoXFxcXCRdJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcycsXG4gICAgICAgICAgICBjb250YWluczogW1RJVExFXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgVElUTEVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc9PicgLy8gTm8gbWFya3VwLCBqdXN0IGEgcmVsZXZhbmNlIGJvb3N0ZXJcbiAgICAgIH1cbiAgICBdLmNvbmNhdChTVFJJTkdTKS5jb25jYXQoTlVNQkVSUylcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVpbHRpbicsXG4gICAgICAgIGJlZ2luOiAneycsIGVuZDogJ30kJyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZmlsZW5hbWUnLFxuICAgICAgICBiZWdpbjogJ1thLXpBLVpfXVtcXFxcZGEtekEtWl9dK1xcXFwuW1xcXFxkYS16QS1aX117MSwzfScsIGVuZDogJzonLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJyhuY2FsbHN8dG90dGltZXxjdW10aW1lKScsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ25jYWxscyB0b3R0aW1lfDEwIGN1bXRpbWV8MTAgZmlsZW5hbWUnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdW1tYXJ5JyxcbiAgICAgICAgYmVnaW46ICdmdW5jdGlvbiBjYWxscycsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW2hsanMuQ19OVU1CRVJfTU9ERV0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKSQnLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgfV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBQUk9NUFQgPSB7XG4gICAgY2xhc3NOYW1lOiAncHJvbXB0JywgIGJlZ2luOiAnXig+Pj58XFxcXC5cXFxcLlxcXFwuKSAnXG4gIH1cbiAgdmFyIFNUUklOR1MgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKHV8Yik/cj9cXCdcXCdcXCcnLCBlbmQ6ICdcXCdcXCdcXCcnLFxuICAgICAgY29udGFpbnM6IFtQUk9NUFRdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKHV8Yik/cj9cIlwiXCInLCBlbmQ6ICdcIlwiXCInLFxuICAgICAgY29udGFpbnM6IFtQUk9NUFRdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKHV8cnx1cilcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKHV8cnx1cilcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyhifGJyKVxcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyhifGJyKVwiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfVxuICBdLmNvbmNhdChbXG4gICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgXSk7XG4gIHZhciBUSVRMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgdmFyIFBBUkFNUyA9IHtcbiAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFsnc2VsZicsIGhsanMuQ19OVU1CRVJfTU9ERSwgUFJPTVBUXS5jb25jYXQoU1RSSU5HUylcbiAgfTtcbiAgdmFyIEZVTkNfQ0xBU1NfUFJPVE8gPSB7XG4gICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnOicsXG4gICAgaWxsZWdhbDogJ1skez07XFxcXG5dJyxcbiAgICBjb250YWluczogW1RJVExFLCBQQVJBTVNdLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYW5kIGVsaWYgaXMgZ2xvYmFsIGFzIGluIGlmIGZyb20gcmFpc2UgZm9yIGV4Y2VwdCBmaW5hbGx5IHByaW50IGltcG9ydCBwYXNzIHJldHVybiAnICtcbiAgICAgICAgJ2V4ZWMgZWxzZSBicmVhayBub3Qgd2l0aCBjbGFzcyBhc3NlcnQgeWllbGQgdHJ5IHdoaWxlIGNvbnRpbnVlIGRlbCBvciBkZWYgbGFtYmRhICcgK1xuICAgICAgICAnbm9ubG9jYWx8MTAnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdOb25lIFRydWUgRmFsc2UgRWxsaXBzaXMgTm90SW1wbGVtZW50ZWQnXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnKDwvfC0+fFxcXFw/KScsXG4gICAgY29udGFpbnM6IFNUUklOR1MuY29uY2F0KFtcbiAgICAgIFBST01QVCxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLmluaGVyaXQoRlVOQ19DTEFTU19QUk9UTywge2NsYXNzTmFtZTogJ2Z1bmN0aW9uJywga2V5d29yZHM6ICdkZWYnfSksXG4gICAgICBobGpzLmluaGVyaXQoRlVOQ19DTEFTU19QUk9UTywge2NsYXNzTmFtZTogJ2NsYXNzJywga2V5d29yZHM6ICdjbGFzcyd9KSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZGVjb3JhdG9yJyxcbiAgICAgICAgYmVnaW46ICdAJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXGIocHJpbnR8ZXhlYylcXFxcKCcgLy8gZG9u4oCZdCBoaWdobGlnaHQga2V5d29yZHMtdHVybmVkLWZ1bmN0aW9ucyBpbiBQeXRob24gM1xuICAgICAgfVxuICAgIF0pXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgSURFTlRfUkUgPSAnKFthLXpBLVpdfFxcXFwuW2EtekEtWi5dKVthLXpBLVowLTkuX10qJztcblxuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBiZWdpbjogSURFTlRfUkUsXG4gICAgICAgIGxleGVtczogSURFTlRfUkUsXG4gICAgICAgIGtleXdvcmRzOiB7XG4gICAgICAgICAga2V5d29yZDpcbiAgICAgICAgICAgICdmdW5jdGlvbiBpZiBpbiBicmVhayBuZXh0IHJlcGVhdCBlbHNlIGZvciByZXR1cm4gc3dpdGNoIHdoaWxlIHRyeSB0cnlDYXRjaHwxMCAnICtcbiAgICAgICAgICAgICdzdG9wIHdhcm5pbmcgcmVxdWlyZSBsaWJyYXJ5IGF0dGFjaCBkZXRhY2ggc291cmNlIHNldE1ldGhvZCBzZXRHZW5lcmljICcgK1xuICAgICAgICAgICAgJ3NldEdyb3VwR2VuZXJpYyBzZXRDbGFzcyAuLi58MTAnLFxuICAgICAgICAgIGxpdGVyYWw6XG4gICAgICAgICAgICAnTlVMTCBOQSBUUlVFIEZBTFNFIFQgRiBJbmYgTmFOIE5BX2ludGVnZXJffDEwIE5BX3JlYWxffDEwIE5BX2NoYXJhY3Rlcl98MTAgJyArXG4gICAgICAgICAgICAnTkFfY29tcGxleF98MTAnXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gaGV4IHZhbHVlXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIjBbeFhdWzAtOWEtZkEtRl0rW0xpXT9cXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIGV4cGxpY2l0IGludGVnZXJcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXGQrKD86W2VFXVsrXFxcXC1dP1xcXFxkKik/TFxcXFxiXCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gbnVtYmVyIHdpdGggdHJhaWxpbmcgZGVjaW1hbFxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcZCtcXFxcLig/IVxcXFxkKSg/OmlcXFxcYik/XCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gbnVtYmVyXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIlxcXFxkKyg/OlxcXFwuXFxcXGQqKT8oPzpbZUVdWytcXFxcLV0/XFxcXGQqKT9pP1xcXFxiXCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gbnVtYmVyIHdpdGggbGVhZGluZyBkZWNpbWFsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIlxcXFwuXFxcXGQrKD86W2VFXVsrXFxcXC1dP1xcXFxkKik/aT9cXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgLy8gZXNjYXBlZCBpZGVudGlmaWVyXG4gICAgICAgIGJlZ2luOiAnYCcsXG4gICAgICAgIGVuZDogJ2AnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG5cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIicsXG4gICAgICAgIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiBcIidcIixcbiAgICAgICAgZW5kOiBcIidcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ0FyY2hpdmVSZWNvcmQgQXJlYUxpZ2h0U291cmNlIEF0bW9zcGhlcmUgQXR0cmlidXRlIEF0dHJpYnV0ZUJlZ2luIEF0dHJpYnV0ZUVuZCBCYXNpcyAnICtcbiAgICAgICdCZWdpbiBCbG9iYnkgQm91bmQgQ2xpcHBpbmcgQ2xpcHBpbmdQbGFuZSBDb2xvciBDb2xvclNhbXBsZXMgQ29uY2F0VHJhbnNmb3JtIENvbmUgJyArXG4gICAgICAnQ29vcmRpbmF0ZVN5c3RlbSBDb29yZFN5c1RyYW5zZm9ybSBDcm9wV2luZG93IEN1cnZlcyBDeWxpbmRlciBEZXB0aE9mRmllbGQgRGV0YWlsICcgK1xuICAgICAgJ0RldGFpbFJhbmdlIERpc2sgRGlzcGxhY2VtZW50IERpc3BsYXkgRW5kIEVycm9ySGFuZGxlciBFeHBvc3VyZSBFeHRlcmlvciBGb3JtYXQgJyArXG4gICAgICAnRnJhbWVBc3BlY3RSYXRpbyBGcmFtZUJlZ2luIEZyYW1lRW5kIEdlbmVyYWxQb2x5Z29uIEdlb21ldHJpY0FwcHJveGltYXRpb24gR2VvbWV0cnkgJyArXG4gICAgICAnSGlkZXIgSHlwZXJib2xvaWQgSWRlbnRpdHkgSWxsdW1pbmF0ZSBJbWFnZXIgSW50ZXJpb3IgTGlnaHRTb3VyY2UgJyArXG4gICAgICAnTWFrZUN1YmVGYWNlRW52aXJvbm1lbnQgTWFrZUxhdExvbmdFbnZpcm9ubWVudCBNYWtlU2hhZG93IE1ha2VUZXh0dXJlIE1hdHRlICcgK1xuICAgICAgJ01vdGlvbkJlZ2luIE1vdGlvbkVuZCBOdVBhdGNoIE9iamVjdEJlZ2luIE9iamVjdEVuZCBPYmplY3RJbnN0YW5jZSBPcGFjaXR5IE9wdGlvbiAnICtcbiAgICAgICdPcmllbnRhdGlvbiBQYXJhYm9sb2lkIFBhdGNoIFBhdGNoTWVzaCBQZXJzcGVjdGl2ZSBQaXhlbEZpbHRlciBQaXhlbFNhbXBsZXMgJyArXG4gICAgICAnUGl4ZWxWYXJpYW5jZSBQb2ludHMgUG9pbnRzR2VuZXJhbFBvbHlnb25zIFBvaW50c1BvbHlnb25zIFBvbHlnb24gUHJvY2VkdXJhbCBQcm9qZWN0aW9uICcgK1xuICAgICAgJ1F1YW50aXplIFJlYWRBcmNoaXZlIFJlbGF0aXZlRGV0YWlsIFJldmVyc2VPcmllbnRhdGlvbiBSb3RhdGUgU2NhbGUgU2NyZWVuV2luZG93ICcgK1xuICAgICAgJ1NoYWRpbmdJbnRlcnBvbGF0aW9uIFNoYWRpbmdSYXRlIFNodXR0ZXIgU2lkZXMgU2tldyBTb2xpZEJlZ2luIFNvbGlkRW5kIFNwaGVyZSAnICtcbiAgICAgICdTdWJkaXZpc2lvbk1lc2ggU3VyZmFjZSBUZXh0dXJlQ29vcmRpbmF0ZXMgVG9ydXMgVHJhbnNmb3JtIFRyYW5zZm9ybUJlZ2luIFRyYW5zZm9ybUVuZCAnICtcbiAgICAgICdUcmFuc2Zvcm1Qb2ludHMgVHJhbnNsYXRlIFRyaW1DdXJ2ZSBXb3JsZEJlZ2luIFdvcmxkRW5kJyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdmbG9hdCBjb2xvciBwb2ludCBub3JtYWwgdmVjdG9yIG1hdHJpeCB3aGlsZSBmb3IgaWYgZG8gcmV0dXJuIGVsc2UgYnJlYWsgZXh0ZXJuIGNvbnRpbnVlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnYWJzIGFjb3MgYW1iaWVudCBhcmVhIGFzaW4gYXRhbiBhdG1vc3BoZXJlIGF0dHJpYnV0ZSBjYWxjdWxhdGVub3JtYWwgY2VpbCBjZWxsbm9pc2UgJyArXG4gICAgICAgICdjbGFtcCBjb21wIGNvbmNhdCBjb3MgZGVncmVlcyBkZXB0aCBEZXJpdiBkaWZmdXNlIGRpc3RhbmNlIER1IER2IGVudmlyb25tZW50IGV4cCAnICtcbiAgICAgICAgJ2ZhY2Vmb3J3YXJkIGZpbHRlcnN0ZXAgZmxvb3IgZm9ybWF0IGZyZXNuZWwgaW5jaWRlbnQgbGVuZ3RoIGxpZ2h0c291cmNlIGxvZyBtYXRjaCAnICtcbiAgICAgICAgJ21heCBtaW4gbW9kIG5vaXNlIG5vcm1hbGl6ZSBudHJhbnNmb3JtIG9wcG9zaXRlIG9wdGlvbiBwaG9uZyBwbm9pc2UgcG93IHByaW50ZiAnICtcbiAgICAgICAgJ3B0bGluZWQgcmFkaWFucyByYW5kb20gcmVmbGVjdCByZWZyYWN0IHJlbmRlcmluZm8gcm91bmQgc2V0Y29tcCBzZXR4Y29tcCBzZXR5Y29tcCAnICtcbiAgICAgICAgJ3NldHpjb21wIHNoYWRvdyBzaWduIHNpbiBzbW9vdGhzdGVwIHNwZWN1bGFyIHNwZWN1bGFyYnJkZiBzcGxpbmUgc3FydCBzdGVwIHRhbiAnICtcbiAgICAgICAgJ3RleHR1cmUgdGV4dHVyZWluZm8gdHJhY2UgdHJhbnNmb3JtIHZ0cmFuc2Zvcm0geGNvbXAgeWNvbXAgemNvbXAnXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoYWRlcicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1xcXFwoJyxcbiAgICAgICAga2V5d29yZHM6ICdzdXJmYWNlIGRpc3BsYWNlbWVudCBsaWdodCB2b2x1bWUgaW1hZ2VyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hhZGluZycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1xcXFwoJyxcbiAgICAgICAga2V5d29yZHM6ICdpbGx1bWluYXRlIGlsbHVtaW5hbmNlIGdhdGhlcidcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgUlVCWV9JREVOVF9SRSA9ICdbYS16QS1aX11bYS16QS1aMC05X10qKFxcXFwhfFxcXFw/KT8nO1xuICB2YXIgUlVCWV9NRVRIT0RfUkUgPSAnW2EtekEtWl9dXFxcXHcqWyE/PV0/fFstK35dXFxcXEB8PDx8Pj58PX58PT09P3w8PT58Wzw+XT0/fFxcXFwqXFxcXCp8Wy0vKyVeJip+YHxdfFxcXFxbXFxcXF09Pyc7XG4gIHZhciBSVUJZX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnYW5kIGZhbHNlIHRoZW4gZGVmaW5lZCBtb2R1bGUgaW4gcmV0dXJuIHJlZG8gaWYgQkVHSU4gcmV0cnkgZW5kIGZvciB0cnVlIHNlbGYgd2hlbiAnICtcbiAgICAgICduZXh0IHVudGlsIGRvIGJlZ2luIHVubGVzcyBFTkQgcmVzY3VlIG5pbCBlbHNlIGJyZWFrIHVuZGVmIG5vdCBzdXBlciBjbGFzcyBjYXNlICcgK1xuICAgICAgJ3JlcXVpcmUgeWllbGQgYWxpYXMgd2hpbGUgZW5zdXJlIGVsc2lmIG9yIGluY2x1ZGUnXG4gIH07XG4gIHZhciBZQVJET0NUQUcgPSB7XG4gICAgY2xhc3NOYW1lOiAneWFyZG9jdGFnJyxcbiAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gIH07XG4gIHZhciBDT01NRU5UUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnLFxuICAgICAgY29udGFpbnM6IFtZQVJET0NUQUddXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnXlxcXFw9YmVnaW4nLCBlbmQ6ICdeXFxcXD1lbmQnLFxuICAgICAgY29udGFpbnM6IFtZQVJET0NUQUddLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ15fX0VORF9fJywgZW5kOiAnXFxcXG4kJ1xuICAgIH1cbiAgXTtcbiAgdmFyIFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJyNcXFxceycsIGVuZDogJ30nLFxuICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICBrZXl3b3JkczogUlVCWV9LRVlXT1JEU1xuICB9O1xuICB2YXIgU1RSX0NPTlRBSU5TID0gW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgU1VCU1RdO1xuICB2YXIgU1RSSU5HUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT9cXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlNcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddP1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOU1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/eycsIGVuZDogJ30nLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOU1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/PCcsIGVuZDogJz4nLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPy8nLCBlbmQ6ICcvJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT8lJywgZW5kOiAnJScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/LScsIGVuZDogJy0nLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddP1xcXFx8JywgZW5kOiAnXFxcXHwnLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9XG4gIF07XG4gIHZhciBGVU5DVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnIHwkfDsnLFxuICAgIGtleXdvcmRzOiAnZGVmJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIGJlZ2luOiBSVUJZX01FVEhPRF9SRSxcbiAgICAgICAgbGV4ZW1zOiBSVUJZX0lERU5UX1JFLFxuICAgICAgICBrZXl3b3JkczogUlVCWV9LRVlXT1JEU1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgbGV4ZW1zOiBSVUJZX0lERU5UX1JFLFxuICAgICAgICBrZXl3b3JkczogUlVCWV9LRVlXT1JEU1xuICAgICAgfVxuICAgIF0uY29uY2F0KENPTU1FTlRTKVxuICB9O1xuXG4gIHZhciBSVUJZX0RFRkFVTFRfQ09OVEFJTlMgPSBDT01NRU5UUy5jb25jYXQoU1RSSU5HUy5jb25jYXQoW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyR8OycsXG4gICAgICBrZXl3b3JkczogJ2NsYXNzIG1vZHVsZScsXG4gICAgICBjb250YWluczogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiAnW0EtWmEtel9dXFxcXHcqKDo6XFxcXHcrKSooXFxcXD98XFxcXCEpPycsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdpbmhlcml0YW5jZScsXG4gICAgICAgICAgYmVnaW46ICc8XFxcXHMqJyxcbiAgICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmVudCcsXG4gICAgICAgICAgICBiZWdpbjogJygnICsgaGxqcy5JREVOVF9SRSArICc6Oik/JyArIGhsanMuSURFTlRfUkVcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICBdLmNvbmNhdChDT01NRU5UUylcbiAgICB9LFxuICAgIEZVTkNUSU9OLFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbnN0YW50JyxcbiAgICAgIGJlZ2luOiAnKDo6KT8oXFxcXGJbQS1aXVxcXFx3Kig6Oik/KSsnLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgICAgYmVnaW46ICc6JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdTLmNvbmNhdChbe2JlZ2luOiBSVUJZX01FVEhPRF9SRX1dKSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgIGJlZ2luOiBSVUJZX0lERU5UX1JFICsgJzonLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgYmVnaW46ICcoXFxcXGIwWzAtN19dKyl8KFxcXFxiMHhbMC05YS1mQS1GX10rKXwoXFxcXGJbMS05XVswLTlfXSooXFxcXC5bMC05X10rKT8pfFswX11cXFxcYicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICBiZWdpbjogJ1xcXFw/XFxcXHcnXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICBiZWdpbjogJyhcXFxcJFxcXFxXKXwoKFxcXFwkfFxcXFxAXFxcXEA/KShcXFxcdyspKSdcbiAgICB9LFxuICAgIHsgLy8gcmVnZXhwIGNvbnRhaW5lclxuICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnKVxcXFxzKicsXG4gICAgICBjb250YWluczogQ09NTUVOVFMuY29uY2F0KFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgYmVnaW46ICcvJywgZW5kOiAnL1thLXpdKicsXG4gICAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgU1VCU1RdXG4gICAgICAgIH1cbiAgICAgIF0pLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfVxuICBdKSk7XG4gIFNVQlNULmNvbnRhaW5zID0gUlVCWV9ERUZBVUxUX0NPTlRBSU5TO1xuICBGVU5DVElPTi5jb250YWluc1sxXS5jb250YWlucyA9IFJVQllfREVGQVVMVF9DT05UQUlOUztcblxuICByZXR1cm4ge1xuICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICBrZXl3b3JkczogUlVCWV9LRVlXT1JEUyxcbiAgICBjb250YWluczogUlVCWV9ERUZBVUxUX0NPTlRBSU5TXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgdmFyIE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiAnXFxcXGIoMFt4Yl1bQS1aYS16MC05X10rfFswLTlfXSsoXFxcXC5bMC05X10rKT8oW3VpZl0oOHwxNnwzMnw2NCk/KT8pJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIEtFWVdPUkRTID1cbiAgICAnYWx0IGFueSBhcyBhc3NlcnQgYmUgYmluZCBibG9jayBib29sIGJyZWFrIGNoYXIgY2hlY2sgY2xhaW0gY29uc3QgY29udCBkaXIgZG8gZWxzZSBlbnVtICcgK1xuICAgICdleHBvcnQgZjMyIGY2NCBmYWlsIGZhbHNlIGZsb2F0IGZuIGZvciBpMTYgaTMyIGk2NCBpOCBpZiBpZmFjZSBpbXBsIGltcG9ydCBpbiBpbnQgbGV0ICcgK1xuICAgICdsb2cgbW9kIG11dGFibGUgbmF0aXZlIG5vdGUgb2YgcHJvdmUgcHVyZSByZXNvdXJjZSByZXQgc2VsZiBzdHIgc3ludGF4IHRydWUgdHlwZSB1MTYgdTMyICcgK1xuICAgICd1NjQgdTggdWludCB1bmNoZWNrZWQgdW5zYWZlIHVzZSB2ZWMgd2hpbGUnO1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiBudWxsfSksXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBOVU1CRVIsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnKFxcXFwofDwpJyxcbiAgICAgICAga2V5d29yZHM6ICdmbicsXG4gICAgICAgIGNvbnRhaW5zOiBbVElUTEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyNcXFxcWycsIGVuZDogJ1xcXFxdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnKD18PCknLFxuICAgICAgICBrZXl3b3JkczogJ3R5cGUnLFxuICAgICAgICBjb250YWluczogW1RJVExFXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxTJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnKHt8PCknLFxuICAgICAgICBrZXl3b3JkczogJ2lmYWNlIGVudW0nLFxuICAgICAgICBjb250YWluczogW1RJVExFXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxTJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBBTk5PVEFUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Fubm90YXRpb24nLCBiZWdpbjogJ0BbQS1aYS16XSsnXG4gIH07XG4gIHZhciBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ3U/cj9cIlwiXCInLCBlbmQ6ICdcIlwiXCInLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICd0eXBlIHlpZWxkIGxhenkgb3ZlcnJpZGUgZGVmIHdpdGggdmFsIHZhciBmYWxzZSB0cnVlIHNlYWxlZCBhYnN0cmFjdCBwcml2YXRlIHRyYWl0ICcgK1xuICAgICAgJ29iamVjdCBudWxsIGlmIGZvciB3aGlsZSB0aHJvdyBmaW5hbGx5IHByb3RlY3RlZCBleHRlbmRzIGltcG9ydCBmaW5hbCByZXR1cm4gZWxzZSAnICtcbiAgICAgICdicmVhayBuZXcgY2F0Y2ggc3VwZXIgY2xhc3MgY2FzZSBwYWNrYWdlIGRlZmF1bHQgdHJ5IHRoaXMgbWF0Y2ggY29udGludWUgdGhyb3dzJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jJyxcbiAgICAgICAgYmVnaW46ICcvXFxcXCpcXFxcKicsIGVuZDogJ1xcXFwqLycsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2phdmFkb2N0YWcnLFxuICAgICAgICAgIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgICAgICAgfV0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREUsIFNUUklORyxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJygoY2FzZSApP2NsYXNzIHxvYmplY3QgfHRyYWl0ICknLCBlbmQ6ICcoe3wkKScsIC8vIGJlZ2luV2l0aEtleXdvcmQgd29uJ3Qgd29yayBiZWNhdXNlIGEgc2luZ2xlIFwiY2FzZVwiIHNob3VsZG4ndCBzdGFydCB0aGlzIG1vZGVcbiAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICBrZXl3b3JkczogJ2Nhc2UgY2xhc3MgdHJhaXQgb2JqZWN0JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIHdpdGgnLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREUsIFNUUklORyxcbiAgICAgICAgICAgICAgQU5OT1RBVElPTlxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIEFOTk9UQVRJT05cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVkFSX0lERU5UX1JFID0gJ1thLXpdW2EtekEtWjAtOV9dKic7XG4gIHZhciBDSEFSID0ge1xuICAgIGNsYXNzTmFtZTogJ2NoYXInLFxuICAgIGJlZ2luOiAnXFxcXCQuezF9J1xuICB9O1xuICB2YXIgU1lNQk9MID0ge1xuICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgYmVnaW46ICcjJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiAnc2VsZiBzdXBlciBuaWwgdHJ1ZSBmYWxzZSB0aGlzQ29udGV4dCcsIC8vIG9ubHkgNlxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYltBLVpdW0EtWmEtejAtOV9dKicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0aG9kJyxcbiAgICAgICAgYmVnaW46IFZBUl9JREVOVF9SRSArICc6J1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIFNZTUJPTCxcbiAgICAgIENIQVIsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xvY2FsdmFycycsXG4gICAgICAgIGJlZ2luOiAnXFxcXHxcXFxccyooKCcgKyBWQVJfSURFTlRfUkUgKyAnKVxcXFxzKikrXFxcXHwnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhcnJheScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCNcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgQ0hBUixcbiAgICAgICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAgICAgU1lNQk9MXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnb3BlcmF0b3InLFxuICAgICAgICBiZWdpbjogJyhiZWdpbnxzdGFydHxjb21taXR8cm9sbGJhY2t8c2F2ZXBvaW50fGxvY2t8YWx0ZXJ8Y3JlYXRlfGRyb3B8cmVuYW1lfGNhbGx8ZGVsZXRlfGRvfGhhbmRsZXJ8aW5zZXJ0fGxvYWR8cmVwbGFjZXxzZWxlY3R8dHJ1bmNhdGV8dXBkYXRlfHNldHxzaG93fHByYWdtYXxncmFudClcXFxcYig/ITopJywgLy8gbmVnYXRpdmUgbG9vay1haGVhZCBoZXJlIGlzIHNwZWNpZmljYWxseSB0byBwcmV2ZW50IHN0b21waW5nIG9uIFNtYWxsVGFsa1xuICAgICAgICBlbmQ6ICc7JywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgIGtleXdvcmRzOiB7XG4gICAgICAgICAga2V5d29yZDogJ2FsbCBwYXJ0aWFsIGdsb2JhbCBtb250aCBjdXJyZW50X3RpbWVzdGFtcCB1c2luZyBnbyByZXZva2Ugc21hbGxpbnQgJyArXG4gICAgICAgICAgICAnaW5kaWNhdG9yIGVuZC1leGVjIGRpc2Nvbm5lY3Qgem9uZSB3aXRoIGNoYXJhY3RlciBhc3NlcnRpb24gdG8gYWRkIGN1cnJlbnRfdXNlciAnICtcbiAgICAgICAgICAgICd1c2FnZSBpbnB1dCBsb2NhbCBhbHRlciBtYXRjaCBjb2xsYXRlIHJlYWwgdGhlbiByb2xsYmFjayBnZXQgcmVhZCB0aW1lc3RhbXAgJyArXG4gICAgICAgICAgICAnc2Vzc2lvbl91c2VyIG5vdCBpbnRlZ2VyIGJpdCB1bmlxdWUgZGF5IG1pbnV0ZSBkZXNjIGluc2VydCBleGVjdXRlIGxpa2UgaWxpa2V8MiAnICtcbiAgICAgICAgICAgICdsZXZlbCBkZWNpbWFsIGRyb3AgY29udGludWUgaXNvbGF0aW9uIGZvdW5kIHdoZXJlIGNvbnN0cmFpbnRzIGRvbWFpbiByaWdodCAnICtcbiAgICAgICAgICAgICduYXRpb25hbCBzb21lIG1vZHVsZSB0cmFuc2FjdGlvbiByZWxhdGl2ZSBzZWNvbmQgY29ubmVjdCBlc2NhcGUgY2xvc2Ugc3lzdGVtX3VzZXIgJyArXG4gICAgICAgICAgICAnZm9yIGRlZmVycmVkIHNlY3Rpb24gY2FzdCBjdXJyZW50IHNxbHN0YXRlIGFsbG9jYXRlIGludGVyc2VjdCBkZWFsbG9jYXRlIG51bWVyaWMgJyArXG4gICAgICAgICAgICAncHVibGljIHByZXNlcnZlIGZ1bGwgZ290byBpbml0aWFsbHkgYXNjIG5vIGtleSBvdXRwdXQgY29sbGF0aW9uIGdyb3VwIGJ5IHVuaW9uICcgK1xuICAgICAgICAgICAgJ3Nlc3Npb24gYm90aCBsYXN0IGxhbmd1YWdlIGNvbnN0cmFpbnQgY29sdW1uIG9mIHNwYWNlIGZvcmVpZ24gZGVmZXJyYWJsZSBwcmlvciAnICtcbiAgICAgICAgICAgICdjb25uZWN0aW9uIHVua25vd24gYWN0aW9uIGNvbW1pdCB2aWV3IG9yIGZpcnN0IGludG8gZmxvYXQgeWVhciBwcmltYXJ5IGNhc2NhZGVkICcgK1xuICAgICAgICAgICAgJ2V4Y2VwdCByZXN0cmljdCBzZXQgcmVmZXJlbmNlcyBuYW1lcyB0YWJsZSBvdXRlciBvcGVuIHNlbGVjdCBzaXplIGFyZSByb3dzIGZyb20gJyArXG4gICAgICAgICAgICAncHJlcGFyZSBkaXN0aW5jdCBsZWFkaW5nIGNyZWF0ZSBvbmx5IG5leHQgaW5uZXIgYXV0aG9yaXphdGlvbiBzY2hlbWEgJyArXG4gICAgICAgICAgICAnY29ycmVzcG9uZGluZyBvcHRpb24gZGVjbGFyZSBwcmVjaXNpb24gaW1tZWRpYXRlIGVsc2UgdGltZXpvbmVfbWludXRlIGV4dGVybmFsICcgK1xuICAgICAgICAgICAgJ3ZhcnlpbmcgdHJhbnNsYXRpb24gdHJ1ZSBjYXNlIGV4Y2VwdGlvbiBqb2luIGhvdXIgZGVmYXVsdCBkb3VibGUgc2Nyb2xsIHZhbHVlICcgK1xuICAgICAgICAgICAgJ2N1cnNvciBkZXNjcmlwdG9yIHZhbHVlcyBkZWMgZmV0Y2ggcHJvY2VkdXJlIGRlbGV0ZSBhbmQgZmFsc2UgaW50IGlzIGRlc2NyaWJlICcgK1xuICAgICAgICAgICAgJ2NoYXIgYXMgYXQgaW4gdmFyY2hhciBudWxsIHRyYWlsaW5nIGFueSBhYnNvbHV0ZSBjdXJyZW50X3RpbWUgZW5kIGdyYW50ICcgK1xuICAgICAgICAgICAgJ3ByaXZpbGVnZXMgd2hlbiBjcm9zcyBjaGVjayB3cml0ZSBjdXJyZW50X2RhdGUgcGFkIGJlZ2luIHRlbXBvcmFyeSBleGVjIHRpbWUgJyArXG4gICAgICAgICAgICAndXBkYXRlIGNhdGFsb2cgdXNlciBzcWwgZGF0ZSBvbiBpZGVudGl0eSB0aW1lem9uZV9ob3VyIG5hdHVyYWwgd2hlbmV2ZXIgaW50ZXJ2YWwgJyArXG4gICAgICAgICAgICAnd29yayBvcmRlciBjYXNjYWRlIGRpYWdub3N0aWNzIG5jaGFyIGhhdmluZyBsZWZ0IGNhbGwgZG8gaGFuZGxlciBsb2FkIHJlcGxhY2UgJyArXG4gICAgICAgICAgICAndHJ1bmNhdGUgc3RhcnQgbG9jayBzaG93IHByYWdtYSBleGlzdHMgbnVtYmVyJyxcbiAgICAgICAgICBhZ2dyZWdhdGU6ICdjb3VudCBzdW0gbWluIG1heCBhdmcnXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCB7YmVnaW46ICdcXCdcXCcnfV0sXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIHtiZWdpbjogJ1wiXCInfV0sXG4gICAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICctLScsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIENPTU1BTkQxID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1hbmQnLFxuICAgIGJlZ2luOiAnXFxcXFxcXFxbYS16QS1a0LAt0Y/QkC3Rj10rW1xcXFwqXT8nXG4gIH07XG4gIHZhciBDT01NQU5EMiA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tYW5kJyxcbiAgICBiZWdpbjogJ1xcXFxcXFxcW15hLXpBLVrQsC3Rj9CQLdGPMC05XSdcbiAgfTtcbiAgdmFyIFNQRUNJQUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3BlY2lhbCcsXG4gICAgYmVnaW46ICdbe31cXFxcW1xcXFxdXFxcXCYjfl0nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIHsgLy8gcGFyYW1ldGVyXG4gICAgICAgIGJlZ2luOiAnXFxcXFxcXFxbYS16QS1a0LAt0Y/QkC3Rj10rW1xcXFwqXT8gKj0gKi0/XFxcXGQqXFxcXC4/XFxcXGQrKHB0fHBjfG1tfGNtfGlufGRkfGNjfGV4fGVtKT8nLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBDT01NQU5EMSwgQ09NTUFORDIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIGJlZ2luOiAnICo9JywgZW5kOiAnLT9cXFxcZCpcXFxcLj9cXFxcZCsocHR8cGN8bW18Y218aW58ZGR8Y2N8ZXh8ZW0pPycsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBDT01NQU5EMSwgQ09NTUFORDIsXG4gICAgICBTUEVDSUFMLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmb3JtdWxhJyxcbiAgICAgICAgYmVnaW46ICdcXFxcJFxcXFwkJywgZW5kOiAnXFxcXCRcXFxcJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09NTUFORDEsIENPTU1BTkQyLCBTUEVDSUFMXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmb3JtdWxhJyxcbiAgICAgICAgYmVnaW46ICdcXFxcJCcsIGVuZDogJ1xcXFwkJyxcbiAgICAgICAgY29udGFpbnM6IFtDT01NQU5EMSwgQ09NTUFORDIsIFNQRUNJQUxdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJyUnLCBlbmQ6ICckJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgLy8gVmFsdWUgdHlwZXNcbiAgICAgICAgJ2NoYXIgdWNoYXIgdW5pY2hhciBpbnQgdWludCBsb25nIHVsb25nIHNob3J0IHVzaG9ydCBpbnQ4IGludDE2IGludDMyIGludDY0IHVpbnQ4ICcgK1xuICAgICAgICAndWludDE2IHVpbnQzMiB1aW50NjQgZmxvYXQgZG91YmxlIGJvb2wgc3RydWN0IGVudW0gc3RyaW5nIHZvaWQgJyArXG4gICAgICAgIC8vIFJlZmVyZW5jZSB0eXBlc1xuICAgICAgICAnd2VhayB1bm93bmVkIG93bmVkICcgK1xuICAgICAgICAvLyBNb2RpZmllcnNcbiAgICAgICAgJ2FzeW5jIHNpZ25hbCBzdGF0aWMgYWJzdHJhY3QgaW50ZXJmYWNlIG92ZXJyaWRlICcgK1xuICAgICAgICAvLyBDb250cm9sIFN0cnVjdHVyZXNcbiAgICAgICAgJ3doaWxlIGRvIGZvciBmb3JlYWNoIGVsc2Ugc3dpdGNoIGNhc2UgYnJlYWsgZGVmYXVsdCByZXR1cm4gdHJ5IGNhdGNoICcgK1xuICAgICAgICAvLyBWaXNpYmlsaXR5XG4gICAgICAgICdwdWJsaWMgcHJpdmF0ZSBwcm90ZWN0ZWQgaW50ZXJuYWwgJyArXG4gICAgICAgIC8vIE90aGVyXG4gICAgICAgICd1c2luZyBuZXcgdGhpcyBnZXQgc2V0IGNvbnN0IHN0ZG91dCBzdGRpbiBzdGRlcnIgdmFyJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnREJ1cyBHTGliIENDb2RlIEdlZSBPYmplY3QnLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJ2ZhbHNlIHRydWUgbnVsbCdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MgaW50ZXJmYWNlIGRlbGVnYXRlIG5hbWVzcGFjZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICAgICAgcmVsZXZhbmNlOiA1XG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdeIycsIGVuZDogJyQnLFxuICAgICAgICByZWxldmFuY2U6IDJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbnN0YW50JyxcbiAgICAgICAgYmVnaW46ICcgW0EtWl9dKyAnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdjYWxsIGNsYXNzIGNvbnN0IGRpbSBkbyBsb29wIGVyYXNlIGV4ZWN1dGUgZXhlY3V0ZWdsb2JhbCBleGl0IGZvciBlYWNoIG5leHQgZnVuY3Rpb24gJyArXG4gICAgICAgICdpZiB0aGVuIGVsc2Ugb24gZXJyb3Igb3B0aW9uIGV4cGxpY2l0IG5ldyBwcml2YXRlIHByb3BlcnR5IGxldCBnZXQgcHVibGljIHJhbmRvbWl6ZSAnICtcbiAgICAgICAgJ3JlZGltIHJlbSBzZWxlY3QgY2FzZSBzZXQgc3RvcCBzdWIgd2hpbGUgd2VuZCB3aXRoIGVuZCB0byBlbHNlaWYgaXMgb3IgeG9yIGFuZCBub3QgJyArXG4gICAgICAgICdjbGFzc19pbml0aWFsaXplIGNsYXNzX3Rlcm1pbmF0ZSBkZWZhdWx0IHByZXNlcnZlIGluIG1lIGJ5dmFsIGJ5cmVmIHN0ZXAgcmVzdW1lIGdvdG8nLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdsY2FzZSBtb250aCB2YXJ0eXBlIGluc3RycmV2IHVib3VuZCBzZXRsb2NhbGUgZ2V0b2JqZWN0IHJnYiBnZXRyZWYgc3RyaW5nICcgK1xuICAgICAgICAnd2Vla2RheW5hbWUgcm5kIGRhdGVhZGQgbW9udGhuYW1lIG5vdyBkYXkgbWludXRlIGlzYXJyYXkgY2Jvb2wgcm91bmQgZm9ybWF0Y3VycmVuY3kgJyArXG4gICAgICAgICdjb252ZXJzaW9ucyBjc25nIHRpbWV2YWx1ZSBzZWNvbmQgeWVhciBzcGFjZSBhYnMgY2xuZyB0aW1lc2VyaWFsIGZpeHMgbGVuIGFzYyAnICtcbiAgICAgICAgJ2lzZW1wdHkgbWF0aHMgZGF0ZXNlcmlhbCBhdG4gdGltZXIgaXNvYmplY3QgZmlsdGVyIHdlZWtkYXkgZGF0ZXZhbHVlIGNjdXIgaXNkYXRlICcgK1xuICAgICAgICAnaW5zdHIgZGF0ZWRpZmYgZm9ybWF0ZGF0ZXRpbWUgcmVwbGFjZSBpc251bGwgcmlnaHQgc2duIGFycmF5IHNudW1lcmljIGxvZyBjZGJsIGhleCAnICtcbiAgICAgICAgJ2NociBsYm91bmQgbXNnYm94IHVjYXNlIGdldGxvY2FsZSBjb3MgY2RhdGUgY2J5dGUgcnRyaW0gam9pbiBob3VyIG9jdCB0eXBlbmFtZSB0cmltICcgK1xuICAgICAgICAnc3RyY29tcCBpbnQgY3JlYXRlb2JqZWN0IGxvYWRwaWN0dXJlIHRhbiBmb3JtYXRudW1iZXIgbWlkIHNjcmlwdGVuZ2luZWJ1aWxkdmVyc2lvbiAnICtcbiAgICAgICAgJ3NjcmlwdGVuZ2luZSBzcGxpdCBzY3JpcHRlbmdpbmVtaW5vcnZlcnNpb24gY2ludCBzaW4gZGF0ZXBhcnQgbHRyaW0gc3FyICcgK1xuICAgICAgICAnc2NyaXB0ZW5naW5lbWFqb3J2ZXJzaW9uIHRpbWUgZGVyaXZlZCBldmFsIGRhdGUgZm9ybWF0cGVyY2VudCBleHAgaW5wdXRib3ggbGVmdCBhc2N3ICcgK1xuICAgICAgICAnY2hydyByZWdleHAgc2VydmVyIHJlc3BvbnNlIHJlcXVlc3QgY3N0ciBlcnInLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJ3RydWUgZmFsc2UgbnVsbCBub3RoaW5nIGVtcHR5J1xuICAgIH0sXG4gICAgaWxsZWdhbDogJy8vJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtjb250YWluczogW3tiZWdpbjogJ1wiXCInfV19KSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhYnMgYWNjZXNzIGFmdGVyIGFsaWFzIGFsbCBhbmQgYXJjaGl0ZWN0dXJlIGFycmF5IGFzc2VydCBhdHRyaWJ1dGUgYmVnaW4gYmxvY2sgJyArXG4gICAgICAgICdib2R5IGJ1ZmZlciBidXMgY2FzZSBjb21wb25lbnQgY29uZmlndXJhdGlvbiBjb25zdGFudCBjb250ZXh0IGNvdmVyIGRpc2Nvbm5lY3QgJyArXG4gICAgICAgICdkb3dudG8gZGVmYXVsdCBlbHNlIGVsc2lmIGVuZCBlbnRpdHkgZXhpdCBmYWlybmVzcyBmaWxlIGZvciBmb3JjZSBmdW5jdGlvbiBnZW5lcmF0ZSAnICtcbiAgICAgICAgJ2dlbmVyaWMgZ3JvdXAgZ3VhcmRlZCBpZiBpbXB1cmUgaW4gaW5lcnRpYWwgaW5vdXQgaXMgbGFiZWwgbGlicmFyeSBsaW5rYWdlIGxpdGVyYWwgJyArXG4gICAgICAgICdsb29wIG1hcCBtb2QgbmFuZCBuZXcgbmV4dCBub3Igbm90IG51bGwgb2Ygb24gb3BlbiBvciBvdGhlcnMgb3V0IHBhY2thZ2UgcG9ydCAnICtcbiAgICAgICAgJ3Bvc3Rwb25lZCBwcm9jZWR1cmUgcHJvY2VzcyBwcm9wZXJ0eSBwcm90ZWN0ZWQgcHVyZSByYW5nZSByZWNvcmQgcmVnaXN0ZXIgcmVqZWN0ICcgK1xuICAgICAgICAncmVsZWFzZSByZW0gcmVwb3J0IHJlc3RyaWN0IHJlc3RyaWN0X2d1YXJhbnRlZSByZXR1cm4gcm9sIHJvciBzZWxlY3Qgc2VxdWVuY2UgJyArXG4gICAgICAgICdzZXZlcml0eSBzaGFyZWQgc2lnbmFsIHNsYSBzbGwgc3JhIHNybCBzdHJvbmcgc3VidHlwZSB0aGVuIHRvIHRyYW5zcG9ydCB0eXBlICcgK1xuICAgICAgICAndW5hZmZlY3RlZCB1bml0cyB1bnRpbCB1c2UgdmFyaWFibGUgdm1vZGUgdnByb3AgdnVuaXQgd2FpdCB3aGVuIHdoaWxlIHdpdGggeG5vciB4b3InLFxuICAgICAgdHlwZW5hbWU6XG4gICAgICAgICdib29sZWFuIGJpdCBjaGFyYWN0ZXIgc2V2ZXJpdHlfbGV2ZWwgaW50ZWdlciB0aW1lIGRlbGF5X2xlbmd0aCBuYXR1cmFsIHBvc2l0aXZlICcgK1xuICAgICAgICAnc3RyaW5nIGJpdF92ZWN0b3IgZmlsZV9vcGVuX2tpbmQgZmlsZV9vcGVuX3N0YXR1cyBzdGRfdWxvZ2ljIHN0ZF91bG9naWNfdmVjdG9yICcgK1xuICAgICAgICAnc3RkX2xvZ2ljIHN0ZF9sb2dpY192ZWN0b3IgdW5zaWduZWQgc2lnbmVkIGJvb2xlYW5fdmVjdG9yIGludGVnZXJfdmVjdG9yICcgK1xuICAgICAgICAncmVhbF92ZWN0b3IgdGltZV92ZWN0b3InXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAneycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsICAgICAgICAvLyBWSERMLTIwMDggYmxvY2sgY29tbWVudGluZy5cbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnLS0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgICAgICBiZWdpbjogJ1xcJyhVfFh8MHwxfFp8V3xMfEh8LSlcXCcnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXFwnW0EtWmEtel0oXz9bQS1aYS16MC05XSkqJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9XG4gICAgXVxuICB9OyAvLyByZXR1cm5cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBYTUxfSURFTlRfUkUgPSAnW0EtWmEtejAtOVxcXFwuXzotXSsnO1xuICB2YXIgVEFHX0lOVEVSTkFMUyA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogWE1MX0lERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPVwiJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICBiZWdpbjogJ1wiJywgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPVxcJycsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICdcXCcnLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgYmVnaW46ICdcXCcnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc9JyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgIGJlZ2luOiAnW15cXFxccy8+XSsnXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGknLFxuICAgICAgICBiZWdpbjogJzxcXFxcPycsIGVuZDogJ1xcXFw/PicsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RvY3R5cGUnLFxuICAgICAgICBiZWdpbjogJzwhRE9DVFlQRScsIGVuZDogJz4nLFxuICAgICAgICByZWxldmFuY2U6IDEwLFxuICAgICAgICBjb250YWluczogW3tiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJzwhLS0nLCBlbmQ6ICctLT4nLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjZGF0YScsXG4gICAgICAgIGJlZ2luOiAnPFxcXFwhXFxcXFtDREFUQVxcXFxbJywgZW5kOiAnXFxcXF1cXFxcXT4nLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLFxuICAgICAgICAvKlxuICAgICAgICBUaGUgbG9va2FoZWFkIHBhdHRlcm4gKD89Li4uKSBlbnN1cmVzIHRoYXQgJ2JlZ2luJyBvbmx5IG1hdGNoZXNcbiAgICAgICAgJzxzdHlsZScgYXMgYSBzaW5nbGUgd29yZCwgZm9sbG93ZWQgYnkgYSB3aGl0ZXNwYWNlIG9yIGFuXG4gICAgICAgIGVuZGluZyBicmFrZXQuIFRoZSAnJCcgaXMgbmVlZGVkIGZvciB0aGUgbGV4ZW0gdG8gYmUgcmVjb2duaXplZFxuICAgICAgICBieSBobGpzLnN1Yk1vZGUoKSB0aGF0IHRlc3RzIGxleGVtcyBvdXRzaWRlIHRoZSBzdHJlYW0uXG4gICAgICAgICovXG4gICAgICAgIGJlZ2luOiAnPHN0eWxlKD89XFxcXHN8PnwkKScsIGVuZDogJz4nLFxuICAgICAgICBrZXl3b3Jkczoge3RpdGxlOiAnc3R5bGUnfSxcbiAgICAgICAgY29udGFpbnM6IFtUQUdfSU5URVJOQUxTXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnPC9zdHlsZT4nLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdjc3MnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8vIFNlZSB0aGUgY29tbWVudCBpbiB0aGUgPHN0eWxlIHRhZyBhYm91dCB0aGUgbG9va2FoZWFkIHBhdHRlcm5cbiAgICAgICAgYmVnaW46ICc8c2NyaXB0KD89XFxcXHN8PnwkKScsIGVuZDogJz4nLFxuICAgICAgICBrZXl3b3Jkczoge3RpdGxlOiAnc2NyaXB0J30sXG4gICAgICAgIGNvbnRhaW5zOiBbVEFHX0lOVEVSTkFMU10sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzwvc2NyaXB0PicsIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2phdmFzY3JpcHQnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPCUnLCBlbmQ6ICclPicsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAndmJzY3JpcHQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLFxuICAgICAgICBiZWdpbjogJzwvPycsIGVuZDogJy8/PicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogJ1teIC8+XSsnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUQUdfSU5URVJOQUxTXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKlxuICogbWFya2VkIC0gYSBtYXJrZG93biBwYXJzZXJcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDEzLCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkXG4gKi9cblxuOyhmdW5jdGlvbigpIHtcblxuLyoqXG4gKiBCbG9jay1MZXZlbCBHcmFtbWFyXG4gKi9cblxudmFyIGJsb2NrID0ge1xuICBuZXdsaW5lOiAvXlxcbisvLFxuICBjb2RlOiAvXiggezR9W15cXG5dK1xcbiopKy8sXG4gIGZlbmNlczogbm9vcCxcbiAgaHI6IC9eKCAqWy0qX10pezMsfSAqKD86XFxuK3wkKS8sXG4gIGhlYWRpbmc6IC9eICooI3sxLDZ9KSAqKFteXFxuXSs/KSAqIyogKig/Olxcbit8JCkvLFxuICBucHRhYmxlOiBub29wLFxuICBsaGVhZGluZzogL14oW15cXG5dKylcXG4gKig9fC0pezIsfSAqKD86XFxuK3wkKS8sXG4gIGJsb2NrcXVvdGU6IC9eKCAqPlteXFxuXSsoXFxuW15cXG5dKykqXFxuKikrLyxcbiAgbGlzdDogL14oICopKGJ1bGwpIFtcXHNcXFNdKz8oPzpocnxcXG57Mix9KD8hICkoPyFcXDFidWxsIClcXG4qfFxccyokKS8sXG4gIGh0bWw6IC9eICooPzpjb21tZW50fGNsb3NlZHxjbG9zaW5nKSAqKD86XFxuezIsfXxcXHMqJCkvLFxuICBkZWY6IC9eICpcXFsoW15cXF1dKylcXF06ICo8PyhbXlxccz5dKyk+Pyg/OiArW1wiKF0oW15cXG5dKylbXCIpXSk/ICooPzpcXG4rfCQpLyxcbiAgdGFibGU6IG5vb3AsXG4gIHBhcmFncmFwaDogL14oKD86W15cXG5dK1xcbj8oPyFocnxoZWFkaW5nfGxoZWFkaW5nfGJsb2NrcXVvdGV8dGFnfGRlZikpKylcXG4qLyxcbiAgdGV4dDogL15bXlxcbl0rL1xufTtcblxuYmxvY2suYnVsbGV0ID0gLyg/OlsqKy1dfFxcZCtcXC4pLztcbmJsb2NrLml0ZW0gPSAvXiggKikoYnVsbCkgW15cXG5dKig/Olxcbig/IVxcMWJ1bGwgKVteXFxuXSopKi87XG5ibG9jay5pdGVtID0gcmVwbGFjZShibG9jay5pdGVtLCAnZ20nKVxuICAoL2J1bGwvZywgYmxvY2suYnVsbGV0KVxuICAoKTtcblxuYmxvY2subGlzdCA9IHJlcGxhY2UoYmxvY2subGlzdClcbiAgKC9idWxsL2csIGJsb2NrLmJ1bGxldClcbiAgKCdocicsIC9cXG4rKD89KD86ICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpKS8pXG4gICgpO1xuXG5ibG9jay5fdGFnID0gJyg/ISg/OidcbiAgKyAnYXxlbXxzdHJvbmd8c21hbGx8c3xjaXRlfHF8ZGZufGFiYnJ8ZGF0YXx0aW1lfGNvZGUnXG4gICsgJ3x2YXJ8c2FtcHxrYmR8c3VifHN1cHxpfGJ8dXxtYXJrfHJ1Ynl8cnR8cnB8YmRpfGJkbydcbiAgKyAnfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKVxcXFxiKVxcXFx3Kyg/ITovfEApXFxcXGInO1xuXG5ibG9jay5odG1sID0gcmVwbGFjZShibG9jay5odG1sKVxuICAoJ2NvbW1lbnQnLCAvPCEtLVtcXHNcXFNdKj8tLT4vKVxuICAoJ2Nsb3NlZCcsIC88KHRhZylbXFxzXFxTXSs/PFxcL1xcMT4vKVxuICAoJ2Nsb3NpbmcnLCAvPHRhZyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8pXG4gICgvdGFnL2csIGJsb2NrLl90YWcpXG4gICgpO1xuXG5ibG9jay5wYXJhZ3JhcGggPSByZXBsYWNlKGJsb2NrLnBhcmFncmFwaClcbiAgKCdocicsIGJsb2NrLmhyKVxuICAoJ2hlYWRpbmcnLCBibG9jay5oZWFkaW5nKVxuICAoJ2xoZWFkaW5nJywgYmxvY2subGhlYWRpbmcpXG4gICgnYmxvY2txdW90ZScsIGJsb2NrLmJsb2NrcXVvdGUpXG4gICgndGFnJywgJzwnICsgYmxvY2suX3RhZylcbiAgKCdkZWYnLCBibG9jay5kZWYpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2subm9ybWFsID0gbWVyZ2Uoe30sIGJsb2NrKTtcblxuLyoqXG4gKiBHRk0gQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLmdmbSA9IG1lcmdlKHt9LCBibG9jay5ub3JtYWwsIHtcbiAgZmVuY2VzOiAvXiAqKGB7Myx9fH57Myx9KSAqKFxcUyspPyAqXFxuKFtcXHNcXFNdKz8pXFxzKlxcMSAqKD86XFxuK3wkKS8sXG4gIHBhcmFncmFwaDogL14vXG59KTtcblxuYmxvY2suZ2ZtLnBhcmFncmFwaCA9IHJlcGxhY2UoYmxvY2sucGFyYWdyYXBoKVxuICAoJyg/IScsICcoPyEnXG4gICAgKyBibG9jay5nZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpICsgJ3wnXG4gICAgKyBibG9jay5saXN0LnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMycpICsgJ3wnKVxuICAoKTtcblxuLyoqXG4gKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLnRhYmxlcyA9IG1lcmdlKHt9LCBibG9jay5nZm0sIHtcbiAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi9cbn0pO1xuXG4vKipcbiAqIEJsb2NrIExleGVyXG4gKi9cblxuZnVuY3Rpb24gTGV4ZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2Vucy5saW5rcyA9IHt9O1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5ydWxlcyA9IGJsb2NrLm5vcm1hbDtcblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudGFibGVzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2sudGFibGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2suZ2ZtO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBCbG9jayBSdWxlc1xuICovXG5cbkxleGVyLnJ1bGVzID0gYmxvY2s7XG5cbi8qKlxuICogU3RhdGljIExleCBNZXRob2RcbiAqL1xuXG5MZXhlci5sZXggPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMpIHtcbiAgdmFyIGxleGVyID0gbmV3IExleGVyKG9wdGlvbnMpO1xuICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG59O1xuXG4vKipcbiAqIFByZXByb2Nlc3NpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24oc3JjKSB7XG4gIHNyYyA9IHNyY1xuICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csICcgJylcbiAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJyk7XG5cbiAgcmV0dXJuIHRoaXMudG9rZW4oc3JjLCB0cnVlKTtcbn07XG5cbi8qKlxuICogTGV4aW5nXG4gKi9cblxuTGV4ZXIucHJvdG90eXBlLnRva2VuID0gZnVuY3Rpb24oc3JjLCB0b3ApIHtcbiAgdmFyIHNyYyA9IHNyYy5yZXBsYWNlKC9eICskL2dtLCAnJylcbiAgICAsIG5leHRcbiAgICAsIGxvb3NlXG4gICAgLCBjYXBcbiAgICAsIGJ1bGxcbiAgICAsIGJcbiAgICAsIGl0ZW1cbiAgICAsIHNwYWNlXG4gICAgLCBpXG4gICAgLCBsO1xuXG4gIHdoaWxlIChzcmMpIHtcbiAgICAvLyBuZXdsaW5lXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubmV3bGluZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBpZiAoY2FwWzBdLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ3NwYWNlJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb2RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuY29kZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIHRleHQ6ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICA/IGNhcC5yZXBsYWNlKC9cXG4rJC8sICcnKVxuICAgICAgICAgIDogY2FwXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZlbmNlcyAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmZlbmNlcy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICBsYW5nOiBjYXBbMl0sXG4gICAgICAgIHRleHQ6IGNhcFszXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaGVhZGluZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICBkZXB0aDogY2FwWzFdLmxlbmd0aCxcbiAgICAgICAgdGV4dDogY2FwWzJdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIG5vIGxlYWRpbmcgcGlwZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMubnB0YWJsZS5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuXG4gICAgICBpdGVtID0ge1xuICAgICAgICB0eXBlOiAndGFibGUnLFxuICAgICAgICBoZWFkZXI6IGNhcFsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGFsaWduOiBjYXBbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgY2VsbHM6IGNhcFszXS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKVxuICAgICAgfTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtLmNlbGxzW2ldID0gaXRlbS5jZWxsc1tpXS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaGVhZGluZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxoZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMl0gPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICB0ZXh0OiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oci5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hyJ1xuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBibG9ja3F1b3RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYmxvY2txdW90ZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9zdGFydCdcbiAgICAgIH0pO1xuXG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiAqPiA/L2dtLCAnJyk7XG5cbiAgICAgIC8vIFBhc3MgYHRvcGAgdG8ga2VlcCB0aGUgY3VycmVudFxuICAgICAgLy8gXCJ0b3BsZXZlbFwiIHN0YXRlLiBUaGlzIGlzIGV4YWN0bHlcbiAgICAgIC8vIGhvdyBtYXJrZG93bi5wbCB3b3Jrcy5cbiAgICAgIHRoaXMudG9rZW4oY2FwLCB0b3ApO1xuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Jsb2NrcXVvdGVfZW5kJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxpc3RcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5saXN0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGJ1bGwgPSBjYXBbMl07XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9zdGFydCcsXG4gICAgICAgIG9yZGVyZWQ6IGJ1bGwubGVuZ3RoID4gMVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtLlxuICAgICAgY2FwID0gY2FwWzBdLm1hdGNoKHRoaXMucnVsZXMuaXRlbSk7XG5cbiAgICAgIG5leHQgPSBmYWxzZTtcbiAgICAgIGwgPSBjYXAubGVuZ3RoO1xuICAgICAgaSA9IDA7XG5cbiAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBjYXBbaV07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGl0ZW0ncyBidWxsZXRcbiAgICAgICAgLy8gc28gaXQgaXMgc2VlbiBhcyB0aGUgbmV4dCB0b2tlbi5cbiAgICAgICAgc3BhY2UgPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXiAqKFsqKy1dfFxcZCtcXC4pICsvLCAnJyk7XG5cbiAgICAgICAgLy8gT3V0ZGVudCB3aGF0ZXZlciB0aGVcbiAgICAgICAgLy8gbGlzdCBpdGVtIGNvbnRhaW5zLiBIYWNreS5cbiAgICAgICAgaWYgKH5pdGVtLmluZGV4T2YoJ1xcbiAnKSkge1xuICAgICAgICAgIHNwYWNlIC09IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgIGl0ZW0gPSAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICA/IGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCdeIHsxLCcgKyBzcGFjZSArICd9JywgJ2dtJyksICcnKVxuICAgICAgICAgICAgOiBpdGVtLnJlcGxhY2UoL14gezEsNH0vZ20sICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBuZXh0IGxpc3QgaXRlbSBiZWxvbmdzIGhlcmUuXG4gICAgICAgIC8vIEJhY2twZWRhbCBpZiBpdCBkb2VzIG5vdCBiZWxvbmcgaW4gdGhpcyBsaXN0LlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtYXJ0TGlzdHMgJiYgaSAhPT0gbCAtIDEpIHtcbiAgICAgICAgICBiID0gYmxvY2suYnVsbGV0LmV4ZWMoY2FwW2kgKyAxXSlbMF07XG4gICAgICAgICAgaWYgKGJ1bGwgIT09IGIgJiYgIShidWxsLmxlbmd0aCA+IDEgJiYgYi5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgc3JjID0gY2FwLnNsaWNlKGkgKyAxKS5qb2luKCdcXG4nKSArIHNyYztcbiAgICAgICAgICAgIGkgPSBsIC0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBpdGVtIGlzIGxvb3NlIG9yIG5vdC5cbiAgICAgICAgLy8gVXNlOiAvKF58XFxuKSg/ISApW15cXG5dK1xcblxcbig/IVxccyokKS9cbiAgICAgICAgLy8gZm9yIGRpc2NvdW50IGJlaGF2aW9yLlxuICAgICAgICBsb29zZSA9IG5leHQgfHwgL1xcblxcbig/IVxccyokKS8udGVzdChpdGVtKTtcbiAgICAgICAgaWYgKGkgIT09IGwgLSAxKSB7XG4gICAgICAgICAgbmV4dCA9IGl0ZW0uY2hhckF0KGl0ZW0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nO1xuICAgICAgICAgIGlmICghbG9vc2UpIGxvb3NlID0gbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IGxvb3NlXG4gICAgICAgICAgICA/ICdsb29zZV9pdGVtX3N0YXJ0J1xuICAgICAgICAgICAgOiAnbGlzdF9pdGVtX3N0YXJ0J1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWN1cnNlLlxuICAgICAgICB0aGlzLnRva2VuKGl0ZW0sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbGlzdF9pdGVtX2VuZCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHRtbFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gJ3BhcmFncmFwaCdcbiAgICAgICAgICA6ICdodG1sJyxcbiAgICAgICAgcHJlOiBjYXBbMV0gPT09ICdwcmUnIHx8IGNhcFsxXSA9PT0gJ3NjcmlwdCcgfHwgY2FwWzFdID09PSAnc3R5bGUnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVmXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5kZWYuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLmxpbmtzW2NhcFsxXS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgKGdmbSlcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoLyg/OiAqXFx8ICopP1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldXG4gICAgICAgICAgLnJlcGxhY2UoL14gKlxcfCAqfCAqXFx8ICokL2csICcnKVxuICAgICAgICAgIC5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5wYXJhZ3JhcGguZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgdGV4dDogY2FwWzFdLmNoYXJBdChjYXBbMV0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nXG4gICAgICAgICAgPyBjYXBbMV0uc2xpY2UoMCwgLTEpXG4gICAgICAgICAgOiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGV4dFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhzcmMpKSB7XG4gICAgICAvLyBUb3AtbGV2ZWwgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUuXG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgdGV4dDogY2FwWzBdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHRocm93IG5ld1xuICAgICAgICBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLnRva2Vucztcbn07XG5cbi8qKlxuICogSW5saW5lLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgaW5saW5lID0ge1xuICBlc2NhcGU6IC9eXFxcXChbXFxcXGAqe31cXFtcXF0oKSMrXFwtLiFfPl0pLyxcbiAgYXV0b2xpbms6IC9ePChbXiA+XSsoQHw6XFwvKVteID5dKyk+LyxcbiAgdXJsOiBub29wLFxuICB0YWc6IC9ePCEtLVtcXHNcXFNdKj8tLT58XjxcXC8/XFx3Kyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8sXG4gIGxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxcKGhyZWZcXCkvLFxuICByZWZsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXHMqXFxbKFteXFxdXSopXFxdLyxcbiAgbm9saW5rOiAvXiE/XFxbKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopXFxdLyxcbiAgc3Ryb25nOiAvXl9fKFtcXHNcXFNdKz8pX18oPyFfKXxeXFwqXFwqKFtcXHNcXFNdKz8pXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXlxcYl8oKD86X198W1xcc1xcU10pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgY29kZTogL14oYCspXFxzKihbXFxzXFxTXSo/W15gXSlcXHMqXFwxKD8hYCkvLFxuICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gIGRlbDogbm9vcCxcbiAgdGV4dDogL15bXFxzXFxTXSs/KD89W1xcXFw8IVxcW18qYF18IHsyLH1cXG58JCkvXG59O1xuXG5pbmxpbmUuX2luc2lkZSA9IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxbXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLztcbmlubGluZS5faHJlZiA9IC9cXHMqPD8oW1xcc1xcU10qPyk+Pyg/OlxccytbJ1wiXShbXFxzXFxTXSo/KVsnXCJdKT9cXHMqLztcblxuaW5saW5lLmxpbmsgPSByZXBsYWNlKGlubGluZS5saW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoJ2hyZWYnLCBpbmxpbmUuX2hyZWYpXG4gICgpO1xuXG5pbmxpbmUucmVmbGluayA9IHJlcGxhY2UoaW5saW5lLnJlZmxpbmspXG4gICgnaW5zaWRlJywgaW5saW5lLl9pbnNpZGUpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5ub3JtYWwgPSBtZXJnZSh7fSwgaW5saW5lKTtcblxuLyoqXG4gKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5wZWRhbnRpYyA9IG1lcmdlKHt9LCBpbmxpbmUubm9ybWFsLCB7XG4gIHN0cm9uZzogL15fXyg/PVxcUykoW1xcc1xcU10qP1xcUylfXyg/IV8pfF5cXCpcXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pfF5cXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqKD8hXFwqKS9cbn0pO1xuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5nZm0gPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBlc2NhcGU6IHJlcGxhY2UoaW5saW5lLmVzY2FwZSkoJ10pJywgJ358XSknKSgpLFxuICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS50ZXh0KVxuICAgICgnXXwnLCAnfl18JylcbiAgICAoJ3wnLCAnfGh0dHBzPzovL3wnKVxuICAgICgpXG59KTtcblxuLyoqXG4gKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5icmVha3MgPSBtZXJnZSh7fSwgaW5saW5lLmdmbSwge1xuICBicjogcmVwbGFjZShpbmxpbmUuYnIpKCd7Mix9JywgJyonKSgpLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS5nZm0udGV4dCkoJ3syLH0nLCAnKicpKClcbn0pO1xuXG4vKipcbiAqIElubGluZSBMZXhlciAmIENvbXBpbGVyXG4gKi9cblxuZnVuY3Rpb24gSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG4gIHRoaXMubGlua3MgPSBsaW5rcztcbiAgdGhpcy5ydWxlcyA9IGlubGluZS5ub3JtYWw7XG5cbiAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgdGhyb3cgbmV3XG4gICAgICBFcnJvcignVG9rZW5zIGFycmF5IHJlcXVpcmVzIGEgYGxpbmtzYCBwcm9wZXJ0eS4nKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBpbmxpbmUuYnJlYWtzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmdmbTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgdGhpcy5ydWxlcyA9IGlubGluZS5wZWRhbnRpYztcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBJbmxpbmUgUnVsZXNcbiAqL1xuXG5JbmxpbmVMZXhlci5ydWxlcyA9IGlubGluZTtcblxuLyoqXG4gKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2RcbiAqL1xuXG5JbmxpbmVMZXhlci5vdXRwdXQgPSBmdW5jdGlvbihzcmMsIGxpbmtzLCBvcHRpb25zKSB7XG4gIHZhciBpbmxpbmUgPSBuZXcgSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpO1xuICByZXR1cm4gaW5saW5lLm91dHB1dChzcmMpO1xufTtcblxuLyoqXG4gKiBMZXhpbmcvQ29tcGlsaW5nXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKHNyYykge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGxpbmtcbiAgICAsIHRleHRcbiAgICAsIGhyZWZcbiAgICAsIGNhcDtcblxuICB3aGlsZSAoc3JjKSB7XG4gICAgLy8gZXNjYXBlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZXNjYXBlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBjYXBbMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBhdXRvbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICB0ZXh0ID0gY2FwWzFdLmNoYXJBdCg2KSA9PT0gJzonXG4gICAgICAgICAgPyB0aGlzLm1hbmdsZShjYXBbMV0uc3Vic3RyaW5nKDcpKVxuICAgICAgICAgIDogdGhpcy5tYW5nbGUoY2FwWzFdKTtcbiAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnPGEgaHJlZj1cIidcbiAgICAgICAgKyBocmVmXG4gICAgICAgICsgJ1wiPidcbiAgICAgICAgKyB0ZXh0XG4gICAgICAgICsgJzwvYT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdXJsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudXJsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRleHQgPSBlc2NhcGUoY2FwWzFdKTtcbiAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgb3V0ICs9ICc8YSBocmVmPVwiJ1xuICAgICAgICArIGhyZWZcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRleHRcbiAgICAgICAgKyAnPC9hPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50YWcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICA/IGVzY2FwZShjYXBbMF0pXG4gICAgICAgIDogY2FwWzBdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpbmsuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhjYXAsIHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHJlZmxpbmssIG5vbGlua1xuICAgIGlmICgoY2FwID0gdGhpcy5ydWxlcy5yZWZsaW5rLmV4ZWMoc3JjKSlcbiAgICAgICAgfHwgKGNhcCA9IHRoaXMucnVsZXMubm9saW5rLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBsaW5rID0gKGNhcFsyXSB8fCBjYXBbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgIGxpbmsgPSB0aGlzLmxpbmtzW2xpbmsudG9Mb3dlckNhc2UoKV07XG4gICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICBvdXQgKz0gY2FwWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgc3JjID0gY2FwWzBdLnN1YnN0cmluZygxKSArIHNyYztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGNhcCwgbGluayk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBzdHJvbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5zdHJvbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8c3Ryb25nPidcbiAgICAgICAgKyB0aGlzLm91dHB1dChjYXBbMl0gfHwgY2FwWzFdKVxuICAgICAgICArICc8L3N0cm9uZz4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZW1cbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5lbS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxlbT4nXG4gICAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzJdIHx8IGNhcFsxXSlcbiAgICAgICAgKyAnPC9lbT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gY29kZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmNvZGUuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8Y29kZT4nXG4gICAgICAgICsgZXNjYXBlKGNhcFsyXSwgdHJ1ZSlcbiAgICAgICAgKyAnPC9jb2RlPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBiclxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmJyLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGJyPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBkZWwgKGdmbSlcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5kZWwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8ZGVsPidcbiAgICAgICAgKyB0aGlzLm91dHB1dChjYXBbMV0pXG4gICAgICAgICsgJzwvZGVsPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGV4dC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gZXNjYXBlKHRoaXMuc21hcnR5cGFudHMoY2FwWzBdKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3JjKSB7XG4gICAgICB0aHJvdyBuZXdcbiAgICAgICAgRXJyb3IoJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb21waWxlIExpbmtcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUub3V0cHV0TGluayA9IGZ1bmN0aW9uKGNhcCwgbGluaykge1xuICBpZiAoY2FwWzBdLmNoYXJBdCgwKSAhPT0gJyEnKSB7XG4gICAgcmV0dXJuICc8YSBocmVmPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay5ocmVmKVxuICAgICAgKyAnXCInXG4gICAgICArIChsaW5rLnRpdGxlXG4gICAgICA/ICcgdGl0bGU9XCInXG4gICAgICArIGVzY2FwZShsaW5rLnRpdGxlKVxuICAgICAgKyAnXCInXG4gICAgICA6ICcnKVxuICAgICAgKyAnPidcbiAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzFdKVxuICAgICAgKyAnPC9hPic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8aW1nIHNyYz1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsuaHJlZilcbiAgICAgICsgJ1wiIGFsdD1cIidcbiAgICAgICsgZXNjYXBlKGNhcFsxXSlcbiAgICAgICsgJ1wiJ1xuICAgICAgKyAobGluay50aXRsZVxuICAgICAgPyAnIHRpdGxlPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay50aXRsZSlcbiAgICAgICsgJ1wiJ1xuICAgICAgOiAnJylcbiAgICAgICsgJz4nO1xuICB9XG59O1xuXG4vKipcbiAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9uc1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5zbWFydHlwYW50cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHJldHVybiB0ZXh0O1xuICByZXR1cm4gdGV4dFxuICAgIC8vIGVtLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxNCcpXG4gICAgLy8gb3BlbmluZyBzaW5nbGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1wiXFxzXSknL2csICckMVxcdTIwMTgnKVxuICAgIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgLnJlcGxhY2UoLycvZywgJ1xcdTIwMTknKVxuICAgIC8vIG9wZW5pbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCAnJDFcXHUyMDFjJylcbiAgICAvLyBjbG9zaW5nIGRvdWJsZXNcbiAgICAucmVwbGFjZSgvXCIvZywgJ1xcdTIwMWQnKVxuICAgIC8vIGVsbGlwc2VzXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpO1xufTtcblxuLyoqXG4gKiBNYW5nbGUgTGlua3NcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUubWFuZ2xlID0gZnVuY3Rpb24odGV4dCkge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGwgPSB0ZXh0Lmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIGNoO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2ggPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgIGNoID0gJ3gnICsgY2gudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICBvdXQgKz0gJyYjJyArIGNoICsgJzsnO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZ1xuICovXG5cbmZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW4gPSBudWxsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbn1cblxuLyoqXG4gKiBTdGF0aWMgUGFyc2UgTWV0aG9kXG4gKi9cblxuUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24oc3JjLCBvcHRpb25zKSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICByZXR1cm4gcGFyc2VyLnBhcnNlKHNyYyk7XG59O1xuXG4vKipcbiAqIFBhcnNlIExvb3BcbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oc3JjKSB7XG4gIHRoaXMuaW5saW5lID0gbmV3IElubGluZUxleGVyKHNyYy5saW5rcywgdGhpcy5vcHRpb25zKTtcbiAgdGhpcy50b2tlbnMgPSBzcmMucmV2ZXJzZSgpO1xuXG4gIHZhciBvdXQgPSAnJztcbiAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgb3V0ICs9IHRoaXMudG9rKCk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOZXh0IFRva2VuXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRva2VuID0gdGhpcy50b2tlbnMucG9wKCk7XG59O1xuXG4vKipcbiAqIFByZXZpZXcgTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy50b2tlbnMubGVuZ3RoIC0gMV0gfHwgMDtcbn07XG5cbi8qKlxuICogUGFyc2UgVGV4dCBUb2tlbnNcbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlVGV4dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYm9keSA9IHRoaXMudG9rZW4udGV4dDtcblxuICB3aGlsZSAodGhpcy5wZWVrKCkudHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgYm9keSArPSAnXFxuJyArIHRoaXMubmV4dCgpLnRleHQ7XG4gIH1cblxuICByZXR1cm4gdGhpcy5pbmxpbmUub3V0cHV0KGJvZHkpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBDdXJyZW50IFRva2VuXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS50b2sgPSBmdW5jdGlvbigpIHtcbiAgc3dpdGNoICh0aGlzLnRva2VuLnR5cGUpIHtcbiAgICBjYXNlICdzcGFjZSc6IHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY2FzZSAnaHInOiB7XG4gICAgICByZXR1cm4gJzxocj5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdoZWFkaW5nJzoge1xuICAgICAgcmV0dXJuICc8aCdcbiAgICAgICAgKyB0aGlzLnRva2VuLmRlcHRoXG4gICAgICAgICsgJyBpZD1cIidcbiAgICAgICAgKyB0aGlzLnRva2VuLnRleHQudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXlxcd10rL2csICctJylcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgICsgJzwvaCdcbiAgICAgICAgKyB0aGlzLnRva2VuLmRlcHRoXG4gICAgICAgICsgJz5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdjb2RlJzoge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KHRoaXMudG9rZW4udGV4dCwgdGhpcy50b2tlbi5sYW5nKTtcbiAgICAgICAgaWYgKGNvZGUgIT0gbnVsbCAmJiBjb2RlICE9PSB0aGlzLnRva2VuLnRleHQpIHtcbiAgICAgICAgICB0aGlzLnRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuLmVzY2FwZWQpIHtcbiAgICAgICAgdGhpcy50b2tlbi50ZXh0ID0gZXNjYXBlKHRoaXMudG9rZW4udGV4dCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPHByZT48Y29kZSdcbiAgICAgICAgKyAodGhpcy50b2tlbi5sYW5nXG4gICAgICAgID8gJyBjbGFzcz1cIidcbiAgICAgICAgKyB0aGlzLm9wdGlvbnMubGFuZ1ByZWZpeFxuICAgICAgICArIHRoaXMudG9rZW4ubGFuZ1xuICAgICAgICArICdcIidcbiAgICAgICAgOiAnJylcbiAgICAgICAgKyAnPidcbiAgICAgICAgKyB0aGlzLnRva2VuLnRleHRcbiAgICAgICAgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ3RhYmxlJzoge1xuICAgICAgdmFyIGJvZHkgPSAnJ1xuICAgICAgICAsIGhlYWRpbmdcbiAgICAgICAgLCBpXG4gICAgICAgICwgcm93XG4gICAgICAgICwgY2VsbFxuICAgICAgICAsIGo7XG5cbiAgICAgIC8vIGhlYWRlclxuICAgICAgYm9keSArPSAnPHRoZWFkPlxcbjx0cj5cXG4nO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhlYWRpbmcgPSB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pO1xuICAgICAgICBib2R5ICs9ICc8dGgnO1xuICAgICAgICBpZiAodGhpcy50b2tlbi5hbGlnbltpXSkge1xuICAgICAgICAgIGJvZHkgKz0gJyBzdHlsZT1cInRleHQtYWxpZ246JyArIHRoaXMudG9rZW4uYWxpZ25baV0gKyAnXCInO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gJz4nICsgaGVhZGluZyArICc8L3RoPlxcbic7XG4gICAgICB9XG4gICAgICBib2R5ICs9ICc8L3RyPlxcbjwvdGhlYWQ+XFxuJztcblxuICAgICAgLy8gYm9keVxuICAgICAgYm9keSArPSAnPHRib2R5PlxcbidcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnRva2VuLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvdyA9IHRoaXMudG9rZW4uY2VsbHNbaV07XG4gICAgICAgIGJvZHkgKz0gJzx0cj5cXG4nO1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgY2VsbCA9IHRoaXMuaW5saW5lLm91dHB1dChyb3dbal0pO1xuICAgICAgICAgIGJvZHkgKz0gJzx0ZCc7XG4gICAgICAgICAgaWYgKHRoaXMudG9rZW4uYWxpZ25bal0pIHtcbiAgICAgICAgICAgIGJvZHkgKz0gJyBzdHlsZT1cInRleHQtYWxpZ246JyArIHRoaXMudG9rZW4uYWxpZ25bal0gKyAnXCInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBib2R5ICs9ICc+JyArIGNlbGwgKyAnPC90ZD5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gJzwvdHI+XFxuJztcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gJzwvdGJvZHk+XFxuJztcblxuICAgICAgcmV0dXJuICc8dGFibGU+XFxuJ1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC90YWJsZT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdibG9ja3F1b3RlX3N0YXJ0Jzoge1xuICAgICAgdmFyIGJvZHkgPSAnJztcblxuICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT09ICdibG9ja3F1b3RlX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxibG9ja3F1b3RlPlxcbidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvYmxvY2txdW90ZT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdsaXN0X3N0YXJ0Jzoge1xuICAgICAgdmFyIHR5cGUgPSB0aGlzLnRva2VuLm9yZGVyZWQgPyAnb2wnIDogJ3VsJ1xuICAgICAgICAsIGJvZHkgPSAnJztcblxuICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT09ICdsaXN0X2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzwnXG4gICAgICAgICsgdHlwZVxuICAgICAgICArICc+XFxuJ1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC8nXG4gICAgICAgICsgdHlwZVxuICAgICAgICArICc+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnbGlzdF9pdGVtX3N0YXJ0Jzoge1xuICAgICAgdmFyIGJvZHkgPSAnJztcblxuICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT09ICdsaXN0X2l0ZW1fZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4udHlwZSA9PT0gJ3RleHQnXG4gICAgICAgICAgPyB0aGlzLnBhcnNlVGV4dCgpXG4gICAgICAgICAgOiB0aGlzLnRvaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxsaT4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L2xpPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2xvb3NlX2l0ZW1fc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfaXRlbV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8bGk+J1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC9saT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdodG1sJzoge1xuICAgICAgcmV0dXJuICF0aGlzLnRva2VuLnByZSAmJiAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgID8gdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dClcbiAgICAgICAgOiB0aGlzLnRva2VuLnRleHQ7XG4gICAgfVxuICAgIGNhc2UgJ3BhcmFncmFwaCc6IHtcbiAgICAgIHJldHVybiAnPHA+J1xuICAgICAgICArIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgICsgJzwvcD5cXG4nO1xuICAgIH1cbiAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgcmV0dXJuICc8cD4nXG4gICAgICAgICsgdGhpcy5wYXJzZVRleHQoKVxuICAgICAgICArICc8L3A+XFxuJztcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5cbmZ1bmN0aW9uIGVzY2FwZShodG1sLCBlbmNvZGUpIHtcbiAgcmV0dXJuIGh0bWxcbiAgICAucmVwbGFjZSghZW5jb2RlID8gLyYoPyEjP1xcdys7KS9nIDogLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgIC5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcbiAgICAucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZShyZWdleCwgb3B0KSB7XG4gIHJlZ2V4ID0gcmVnZXguc291cmNlO1xuICBvcHQgPSBvcHQgfHwgJyc7XG4gIHJldHVybiBmdW5jdGlvbiBzZWxmKG5hbWUsIHZhbCkge1xuICAgIGlmICghbmFtZSkgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXgsIG9wdCk7XG4gICAgdmFsID0gdmFsLnNvdXJjZSB8fCB2YWw7XG4gICAgdmFsID0gdmFsLnJlcGxhY2UoLyhefFteXFxbXSlcXF4vZywgJyQxJyk7XG4gICAgcmVnZXggPSByZWdleC5yZXBsYWNlKG5hbWUsIHZhbCk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxubm9vcC5leGVjID0gbm9vcDtcblxuZnVuY3Rpb24gbWVyZ2Uob2JqKSB7XG4gIHZhciBpID0gMVxuICAgICwgdGFyZ2V0XG4gICAgLCBrZXk7XG5cbiAgZm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB0YXJnZXQgPSBhcmd1bWVudHNbaV07XG4gICAgZm9yIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSkge1xuICAgICAgICBvYmpba2V5XSA9IHRhcmdldFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTWFya2VkXG4gKi9cblxuZnVuY3Rpb24gbWFya2VkKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICBpZiAoY2FsbGJhY2sgfHwgdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0O1xuICAgICAgb3B0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQgfHwge30pO1xuXG4gICAgdmFyIGhpZ2hsaWdodCA9IG9wdC5oaWdobGlnaHRcbiAgICAgICwgdG9rZW5zXG4gICAgICAsIHBlbmRpbmdcbiAgICAgICwgaSA9IDA7XG5cbiAgICB0cnkge1xuICAgICAgdG9rZW5zID0gTGV4ZXIubGV4KHNyYywgb3B0KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICB9XG5cbiAgICBwZW5kaW5nID0gdG9rZW5zLmxlbmd0aDtcblxuICAgIHZhciBkb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3V0LCBlcnI7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIG91dCA9IFBhcnNlci5wYXJzZSh0b2tlbnMsIG9wdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVyciA9IGU7XG4gICAgICB9XG5cbiAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG5cbiAgICAgIHJldHVybiBlcnJcbiAgICAgICAgPyBjYWxsYmFjayhlcnIpXG4gICAgICAgIDogY2FsbGJhY2sobnVsbCwgb3V0KTtcbiAgICB9O1xuXG4gICAgaWYgKCFoaWdobGlnaHQgfHwgaGlnaGxpZ2h0Lmxlbmd0aCA8IDMpIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuXG4gICAgZGVsZXRlIG9wdC5oaWdobGlnaHQ7XG5cbiAgICBpZiAoIXBlbmRpbmcpIHJldHVybiBkb25lKCk7XG5cbiAgICBmb3IgKDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgKGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgIGlmICh0b2tlbi50eXBlICE9PSAnY29kZScpIHtcbiAgICAgICAgICByZXR1cm4gLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGlnaGxpZ2h0KHRva2VuLnRleHQsIHRva2VuLmxhbmcsIGZ1bmN0aW9uKGVyciwgY29kZSkge1xuICAgICAgICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZSA9PT0gdG9rZW4udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRva2VuLnRleHQgPSBjb2RlO1xuICAgICAgICAgIHRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkodG9rZW5zW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBpZiAob3B0KSBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICAgIHJldHVybiBQYXJzZXIucGFyc2UoTGV4ZXIubGV4KHNyYywgb3B0KSwgb3B0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGUubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZC4nO1xuICAgIGlmICgob3B0IHx8IG1hcmtlZC5kZWZhdWx0cykuc2lsZW50KSB7XG4gICAgICByZXR1cm4gJzxwPkFuIGVycm9yIG9jY3VyZWQ6PC9wPjxwcmU+J1xuICAgICAgICArIGVzY2FwZShlLm1lc3NhZ2UgKyAnJywgdHJ1ZSlcbiAgICAgICAgKyAnPC9wcmU+JztcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnNcbiAqL1xuXG5tYXJrZWQub3B0aW9ucyA9XG5tYXJrZWQuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdCkge1xuICBtZXJnZShtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gIHJldHVybiBtYXJrZWQ7XG59O1xuXG5tYXJrZWQuZGVmYXVsdHMgPSB7XG4gIGdmbTogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBicmVha3M6IGZhbHNlLFxuICBwZWRhbnRpYzogZmFsc2UsXG4gIHNhbml0aXplOiBmYWxzZSxcbiAgc21hcnRMaXN0czogZmFsc2UsXG4gIHNpbGVudDogZmFsc2UsXG4gIGhpZ2hsaWdodDogbnVsbCxcbiAgbGFuZ1ByZWZpeDogJ2xhbmctJyxcbiAgc21hcnR5cGFudHM6IGZhbHNlXG59O1xuXG4vKipcbiAqIEV4cG9zZVxuICovXG5cbm1hcmtlZC5QYXJzZXIgPSBQYXJzZXI7XG5tYXJrZWQucGFyc2VyID0gUGFyc2VyLnBhcnNlO1xuXG5tYXJrZWQuTGV4ZXIgPSBMZXhlcjtcbm1hcmtlZC5sZXhlciA9IExleGVyLmxleDtcblxubWFya2VkLklubGluZUxleGVyID0gSW5saW5lTGV4ZXI7XG5tYXJrZWQuaW5saW5lTGV4ZXIgPSBJbmxpbmVMZXhlci5vdXRwdXQ7XG5cbm1hcmtlZC5wYXJzZSA9IG1hcmtlZDtcblxuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IG1hcmtlZDtcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG1hcmtlZDsgfSk7XG59IGVsc2Uge1xuICB0aGlzLm1hcmtlZCA9IG1hcmtlZDtcbn1cblxufSkuY2FsbChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMgfHwgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKTtcbn0oKSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpLFxyXG4gICAgaGxqcyA9IHJlcXVpcmUoJ2hpZ2hsaWdodC5qcycpLFxyXG4gICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gdWx0cmFtYXJrZWQsXHJcbiAgICBhbGlzZXMgPSBleHBvcnRzLmFsaWFzZXMgPSB7XHJcbiAgICAgICAgJ2pzJzogJ2phdmFzY3JpcHQnLFxyXG4gICAgICAgICdtZCc6ICdtYXJrZG93bicsXHJcbiAgICAgICAgJ2h0bWwnOiAneG1sJywgLy8gbmV4dCBiZXN0IHRoaW5nXHJcbiAgICAgICAgJ2phZGUnOiAnY3NzJyAvLyBuZXh0IGJlc3QgdGhpbmdcclxuICAgIH07XHJcblxyXG5mdW5jdGlvbiBtZXJnZShvYmopIHtcclxuICAgIHZhciBpID0gMSwgdGFyZ2V0LCBrZXk7XHJcblxyXG4gICAgZm9yKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgICAgICBmb3Ioa2V5IGluIHRhcmdldCl7XHJcbiAgICAgICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpe1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVsdHJhbWFya2VkKHNyYywgb3B0KSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCksXHJcbiAgICAgICAgYWxpYXNlcyA9IG9wdGlvbnMuYWxpYXNlcyB8fCBleHBvcnRzLmFsaWFzZXMsXHJcbiAgICAgICAgbm8gPSAnbm8taGlnaGxpZ2h0JztcclxuXHJcbiAgICBpZiAob3B0aW9ucy51bHRyYWxpZ2h0KXtcclxuICAgICAgICBvcHRpb25zLmxhbmdQcmVmaXggPSAndWx0cmFsaWdodC1sYW5nLSc7IC8vIHBsYWNlaG9sZGVyXHJcbiAgICAgICAgb3B0aW9ucy5oaWdobGlnaHQgPSBmdW5jdGlvbiAoY29kZSwgbGFuZykge1xyXG4gICAgICAgICAgICB2YXIgbG93ZXIgPSAobGFuZyB8fCBubykudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhsanMuaGlnaGxpZ2h0KGFsaWFzZXNbbG93ZXJdIHx8IGxvd2VyLCBjb2RlKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHt9IC8vIG1hcmtlZCB3aWxsIGtub3cgd2hhdCB0byBkby5cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0b2tlbnMgPSBtYXJrZWQubGV4ZXIoc3JjLCBvcHRpb25zKSxcclxuICAgICAgICByZXN1bHQgPSBtYXJrZWQucGFyc2VyKHRva2Vucywgb3B0aW9ucyk7XHJcblxyXG4gICAgaWYob3B0aW9ucy51bHRyYWxpZ2h0KXsgLy8gZml4IHRoZSBsYW5ndWFnZSBjbGFzcyB1c2luZyBjb21tb24gYWxpYXNlc1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cInVsdHJhbGlnaHQtbGFuZy0oW1xcdy1dKylcIi9pZywgZnVuY3Rpb24obWF0Y2gsIGxhbmcpe1xyXG4gICAgICAgICAgICB2YXIgbG93ZXIgPSBsYW5nLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhbGlhc2VzW2xvd2VyXSB8fCBsb3dlciB8fCBubztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAnXCInICsgcmVzdWx0ICsgJ1wiJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihvcHRpb25zLnVsdHJhc2FuaXRpemUpe1xyXG4gICAgICAgIHJlc3VsdCA9IHJlcXVpcmUoJy4vc2FuaXRpemVyLmpzJykocmVzdWx0KTtcclxuICAgIH1lbHNlIGlmKG9wdGlvbnMudWx0cmFzYW5pdGl6ZV9wYWdlZG93bil7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVxdWlyZSgnLi9zYW5pdGl6ZXItcGFnZWRvd24uanMnKShyZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbnVsdHJhbWFya2VkLnNldE9wdGlvbnMgPSBtYXJrZWQuc2V0T3B0aW9ucztcclxuIiwiLy8gdXNlZCB0byBzYW5pdGl6ZSBIVE1MIHdoaWxlIG5vdCBIVE1MIGVuY29kaW5nIGV2ZXJ5dGhpbmcuXHJcbi8vIGp1c3QgdXNpbmcgYSB3aGl0ZWxpc3QgYXBwcm9hY2guXHJcbi8vIGV4dHJhY3RlZCBmcm9tIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvcGFnZWRvd24vXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIHNhbml0aXplSHRtbChodG1sKSB7XHJcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC88W14+XSo+Py9naSwgc2FuaXRpemVUYWcpO1xyXG59XHJcblxyXG4vLyAodGFncyB0aGF0IGNhbiBiZSBvcGVuZWQvY2xvc2VkKSB8ICh0YWdzIHRoYXQgc3RhbmQgYWxvbmUpXHJcbnZhciBiYXNpY190YWdfd2hpdGVsaXN0ID0gL14oPFxcLz8oYnxibG9ja3F1b3RlfGNvZGV8ZGVsfGRkfGRsfGR0fGVtfGgxfGgyfGgzfGg0fGg1fGg2fGl8a2JkfGxpfG9sfHB8cHJlfHN8c3VwfHN1YnxzdHJvbmd8c3RyaWtlfHVsKT58PChicnxocilcXHM/XFwvPz4pJC9pO1xyXG5cclxuLy8gPGEgaHJlZj0ndXJsLi4uJyBvcHRpb25hbCB0aXRsZT58PC9hPlxyXG52YXIgYV93aGl0ZSA9IC9eKDxhXFxzaHJlZj0nKChodHRwcz98ZnRwKTpcXC9cXC98XFwvKVstQS1aYS16MC05KyZAI1xcLyU/PX5ffCE6LC47XFwoXFwpXSsnKFxcc3RpdGxlPSdbXic8Pl0rJyk/XFxzPz58PFxcL2E+KSQvaTtcclxuXHJcbi8vIDxpbWcgc3JjPSd1cmwuLi4nIG9wdGlvbmFsIHdpZHRoICBvcHRpb25hbCBoZWlnaHQgIG9wdGlvbmFsIGFsdCAgb3B0aW9uYWwgdGl0bGVcclxudmFyIGltZ193aGl0ZSA9IC9eKDxpbWdcXHNzcmM9JyhodHRwcz86XFwvXFwvfFxcLylbLUEtWmEtejAtOSsmQCNcXC8lPz1+X3whOiwuO1xcKFxcKV0rJyhcXHN3aWR0aD0nXFxkezEsM30nKT8oXFxzaGVpZ2h0PSdcXGR7MSwzfScpPyhcXHNhbHQ9J1teJzw+XSonKT8oXFxzdGl0bGU9J1teJzw+XSonKT9cXHM/XFwvPz4pJC9pO1xyXG5cclxudmFyIHdoaXRlbGlzdHMgPSBbXHJcbiAgICBiYXNpY190YWdfd2hpdGVsaXN0LFxyXG4gICAgYV93aGl0ZSxcclxuICAgIGltZ193aGl0ZVxyXG5dO1xyXG5cclxuZnVuY3Rpb24gc2FuaXRpemVUYWcodGFnKSB7XHJcbiAgICB2YXIgaTtcclxuICAgIGZvcihpID0gMDsgaSA8IHdoaXRlbGlzdHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKHRhZy5tYXRjaCh3aGl0ZWxpc3RzW2ldKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG59XHJcblxyXG4vLyBhdHRlbXB0IHRvIGJhbGFuY2UgSFRNTCB0YWdzIGluIHRoZSBodG1sIHN0cmluZ1xyXG4vLyBieSByZW1vdmluZyBhbnkgdW5tYXRjaGVkIG9wZW5pbmcgb3IgY2xvc2luZyB0YWdzXHJcbi8vIElNUE9SVEFOVDogd2UgKmFzc3VtZSogSFRNTCBoYXMgKmFscmVhZHkqIGJlZW4gXHJcbi8vIHNhbml0aXplZCBhbmQgaXMgc2FmZS9zYW5lIGJlZm9yZSBiYWxhbmNpbmchXHJcbmZ1bmN0aW9uIGJhbGFuY2VUYWdzKGh0bWwpIHtcclxuICAgIGlmIChodG1sID09PSAnJyl7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZSA9IC88XFwvP1xcdytbXj5dKihcXHN8JHw+KS9nO1xyXG5cclxuICAgIC8vIGNvbnZlcnQgZXZlcnl0aGluZyB0byBsb3dlciBjYXNlOyB0aGlzIG1ha2VzXHJcbiAgICAvLyBvdXIgY2FzZSBpbnNlbnNpdGl2ZSBjb21wYXJpc29ucyBlYXNpZXJcclxuICAgIHZhciB0YWdzID0gaHRtbC50b0xvd2VyQ2FzZSgpLm1hdGNoKHJlKTtcclxuXHJcbiAgICAvLyBubyBIVE1MIHRhZ3MgcHJlc2VudD8gbm90aGluZyB0byBkbzsgZXhpdCBub3dcclxuICAgIHZhciB0YWdjb3VudCA9ICh0YWdzIHx8IFtdKS5sZW5ndGg7XHJcbiAgICBpZiAodGFnY291bnQgPT09IDApe1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0YWduYW1lLCB0YWc7XHJcbiAgICB2YXIgaWdub3JlZHRhZ3MgPSAnPHA+PGltZz48YnI+PGxpPjxocj4nO1xyXG4gICAgdmFyIG1hdGNoO1xyXG4gICAgdmFyIHRhZ3BhaXJlZCA9IFtdO1xyXG4gICAgdmFyIHRhZ3JlbW92ZSA9IFtdO1xyXG4gICAgdmFyIG5lZWRzUmVtb3ZhbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIGxvb3AgdGhyb3VnaCBtYXRjaGVkIHRhZ3MgaW4gZm9yd2FyZCBvcmRlclxyXG4gICAgZm9yICh2YXIgY3RhZyA9IDA7IGN0YWcgPCB0YWdjb3VudDsgY3RhZysrKSB7XHJcbiAgICAgICAgdGFnbmFtZSA9IHRhZ3NbY3RhZ10ucmVwbGFjZSgvPFxcLz8oXFx3KykuKi8sICckMScpO1xyXG5cclxuICAgICAgICAvLyBza2lwIGFueSBhbHJlYWR5IHBhaXJlZCB0YWdzXHJcbiAgICAgICAgLy8gYW5kIHNraXAgdGFncyBpbiBvdXIgaWdub3JlIGxpc3Q7IGFzc3VtZSB0aGV5J3JlIHNlbGYtY2xvc2VkXHJcbiAgICAgICAgaWYgKHRhZ3BhaXJlZFtjdGFnXSB8fCBpZ25vcmVkdGFncy5zZWFyY2goJzwnICsgdGFnbmFtZSArICc+JykgPiAtMSl7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH0gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgdGFnID0gdGFnc1tjdGFnXTtcclxuICAgICAgICBtYXRjaCA9IC0xO1xyXG5cclxuICAgICAgICBpZiAoIS9ePFxcLy8udGVzdCh0YWcpKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGFuIG9wZW5pbmcgdGFnXHJcbiAgICAgICAgICAgIC8vIHNlYXJjaCBmb3J3YXJkcyAobmV4dCB0YWdzKSwgbG9vayBmb3IgY2xvc2luZyB0YWdzXHJcbiAgICAgICAgICAgIGZvciAodmFyIG50YWcgPSBjdGFnICsgMTsgbnRhZyA8IHRhZ2NvdW50OyBudGFnKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGFncGFpcmVkW250YWddICYmIHRhZ3NbbnRhZ10gPT09ICc8LycgKyB0YWduYW1lICsgJz4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBudGFnO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWF0Y2ggPT09IC0xKXtcclxuICAgICAgICAgICAgbmVlZHNSZW1vdmFsID0gdGFncmVtb3ZlW2N0YWddID0gdHJ1ZTsgLy8gbWFyayBmb3IgcmVtb3ZhbFxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0YWdwYWlyZWRbbWF0Y2hdID0gdHJ1ZTsgLy8gbWFyayBwYWlyZWQgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFuZWVkc1JlbW92YWwpe1xyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRlbGV0ZSBhbGwgb3JwaGFuZWQgdGFncyBmcm9tIHRoZSBzdHJpbmdcclxuICAgIGN0YWcgPSAwO1xyXG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZShyZSwgZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRhZ3JlbW92ZVtjdGFnXSA/ICcnIDogbWF0Y2g7XHJcbiAgICAgICAgY3RhZysrO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBodG1sO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGh0bWwpe1xyXG4gICAgdmFyIHNhbml0aXplZCA9IHNhbml0aXplSHRtbChodG1sKSxcclxuICAgICAgICBiYWxhbmNlZCA9IGJhbGFuY2VUYWdzKHNhbml0aXplZCk7XHJcblxyXG4gICAgcmV0dXJuIGJhbGFuY2VkO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBoZSA9IHJlcXVpcmUoJ2hlJyk7XHJcblxyXG4vKlxyXG4gKiBIVE1MIFBhcnNlciBCeSBNaXNrbyBIZXZlcnkgKG1pc2tvQGhldmVyeS5jb20pXHJcbiAqIGJhc2VkIG9uOiAgSFRNTCBQYXJzZXIgQnkgSm9obiBSZXNpZyAoZWpvaG4ub3JnKVxyXG4gKiBPcmlnaW5hbCBjb2RlIGJ5IEVyaWsgQXJ2aWRzc29uLCBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlXHJcbiAqIGh0dHA6Ly9lcmlrLmVhZS5uZXQvc2ltcGxlaHRtbHBhcnNlci9zaW1wbGVodG1scGFyc2VyLmpzXHJcbiAqXHJcbiAqIC8vIFVzZSBsaWtlIHNvOlxyXG4gKiBodG1sUGFyc2VyKGh0bWxTdHJpbmcsIHtcclxuICogICAgIHN0YXJ0OiBmdW5jdGlvbih0YWcsIGF0dHJzLCB1bmFyeSkge30sXHJcbiAqICAgICBlbmQ6IGZ1bmN0aW9uKHRhZykge30sXHJcbiAqICAgICBjaGFyczogZnVuY3Rpb24odGV4dCkge30sXHJcbiAqICAgICBjb21tZW50OiBmdW5jdGlvbih0ZXh0KSB7fVxyXG4gKiB9KTtcclxuICpcclxuICovXHJcblxyXG4vLyBSZWd1bGFyIEV4cHJlc3Npb25zIGZvciBwYXJzaW5nIHRhZ3MgYW5kIGF0dHJpYnV0ZXNcclxudmFyIFNUQVJUX1RBR19SRUdFWFAgPSAvXjxcXHMqKFtcXHc6LV0rKSgoPzpcXHMrW1xcdzotXSsoPzpcXHMqPVxccyooPzooPzpcIlteXCJdKlwiKXwoPzonW14nXSonKXxbXj5cXHNdKykpPykqKVxccyooXFwvPylcXHMqPi8sXHJcbiAgICBFTkRfVEFHX1JFR0VYUCA9IC9ePFxccypcXC9cXHMqKFtcXHc6LV0rKVtePl0qPi8sXHJcbiAgICBBVFRSX1JFR0VYUCA9IC8oW1xcdzotXSspKD86XFxzKj1cXHMqKD86KD86XCIoKD86W15cIl0pKilcIil8KD86JygoPzpbXiddKSopJyl8KFtePlxcc10rKSkpPy9nLFxyXG4gICAgQkVHSU5fVEFHX1JFR0VYUCA9IC9ePC8sXHJcbiAgICBCRUdJTkdfRU5EX1RBR0VfUkVHRVhQID0gL148XFxzKlxcLy8sXHJcbiAgICBDT01NRU5UX1JFR0VYUCA9IC88IS0tKC4qPyktLT4vZyxcclxuICAgIENEQVRBX1JFR0VYUCA9IC88IVxcW0NEQVRBXFxbKC4qPyldXT4vZyxcclxuICAgIFVSSV9SRUdFWFAgPSAvXigoZnRwfGh0dHBzPyk6XFwvXFwvfG1haWx0bzp8I3xcXC8pLyxcclxuICAgIE5PTl9BTFBIQU5VTUVSSUNfUkVHRVhQID0gLyhbXlxcIy1+fCB8IV0pL2c7IC8vIE1hdGNoIGV2ZXJ5dGhpbmcgb3V0c2lkZSBvZiBub3JtYWwgY2hhcnMgYW5kIFwiIChxdW90ZSBjaGFyYWN0ZXIpXHJcblxyXG5cclxuLy8gR29vZCBzb3VyY2Ugb2YgaW5mbyBhYm91dCBlbGVtZW50cyBhbmQgYXR0cmlidXRlc1xyXG4vLyBodHRwOi8vZGV2LnczLm9yZy9odG1sNS9zcGVjL092ZXJ2aWV3Lmh0bWwjc2VtYW50aWNzXHJcbi8vIGh0dHA6Ly9zaW1vbi5odG1sNS5vcmcvaHRtbC1lbGVtZW50c1xyXG5cclxuLy8gU2FmZSBWb2lkIEVsZW1lbnRzIC0gSFRNTDVcclxuLy8gaHR0cDovL2Rldi53My5vcmcvaHRtbDUvc3BlYy9PdmVydmlldy5odG1sI3ZvaWQtZWxlbWVudHNcclxudmFyIHZvaWRFbGVtZW50cyA9IG1ha2VNYXAoXCJhcmVhLGJyLGNvbCxocixpbWcsd2JyXCIpO1xyXG5cclxuLy8gRWxlbWVudHMgdGhhdCB5b3UgY2FuLCBpbnRlbnRpb25hbGx5LCBsZWF2ZSBvcGVuIChhbmQgd2hpY2ggY2xvc2UgdGhlbXNlbHZlcylcclxuLy8gaHR0cDovL2Rldi53My5vcmcvaHRtbDUvc3BlYy9PdmVydmlldy5odG1sI29wdGlvbmFsLXRhZ3NcclxudmFyIG9wdGlvbmFsRW5kVGFnQmxvY2tFbGVtZW50cyA9IG1ha2VNYXAoXCJjb2xncm91cCxkZCxkdCxsaSxwLHRib2R5LHRkLHRmb290LHRoLHRoZWFkLHRyXCIpLFxyXG4gICAgICAgIG9wdGlvbmFsRW5kVGFnSW5saW5lRWxlbWVudHMgPSBtYWtlTWFwKFwicnAscnRcIiksXHJcbiAgICAgICAgb3B0aW9uYWxFbmRUYWdFbGVtZW50cyA9IGV4dGVuZCh7fSwgb3B0aW9uYWxFbmRUYWdJbmxpbmVFbGVtZW50cywgb3B0aW9uYWxFbmRUYWdCbG9ja0VsZW1lbnRzKTtcclxuXHJcbi8vIFNhZmUgQmxvY2sgRWxlbWVudHMgLSBIVE1MNVxyXG52YXIgYmxvY2tFbGVtZW50cyA9IGV4dGVuZCh7fSwgb3B0aW9uYWxFbmRUYWdCbG9ja0VsZW1lbnRzLCBtYWtlTWFwKFwiYWRkcmVzcyxhcnRpY2xlLGFzaWRlLFwiICtcclxuICAgICAgICAgICAgICAgIFwiYmxvY2txdW90ZSxjYXB0aW9uLGNlbnRlcixkZWwsZGlyLGRpdixkbCxmaWd1cmUsZmlnY2FwdGlvbixmb290ZXIsaDEsaDIsaDMsaDQsaDUsaDYsXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJoZWFkZXIsaGdyb3VwLGhyLGlucyxtYXAsbWVudSxuYXYsb2wscHJlLHNjcmlwdCxzZWN0aW9uLHRhYmxlLHVsXCIpKTtcclxuXHJcbi8vIElubGluZSBFbGVtZW50cyAtIEhUTUw1XHJcbnZhciBpbmxpbmVFbGVtZW50cyA9IGV4dGVuZCh7fSwgb3B0aW9uYWxFbmRUYWdJbmxpbmVFbGVtZW50cywgbWFrZU1hcChcImEsYWJicixhY3JvbnltLGIsYmRpLGJkbyxcIiArXHJcbiAgICAgICAgICAgICAgICBcImJpZyxicixjaXRlLGNvZGUsZGVsLGRmbixlbSxmb250LGksaW1nLGlucyxrYmQsbGFiZWwsbWFwLG1hcmsscSxydWJ5LHJwLHJ0LHMsc2FtcCxzbWFsbCxcIiArXHJcbiAgICAgICAgICAgICAgICBcInNwYW4sc3RyaWtlLHN0cm9uZyxzdWIsc3VwLHRpbWUsdHQsdSx2YXJcIikpO1xyXG5cclxuXHJcbi8vIFNwZWNpYWwgRWxlbWVudHMgKGNhbiBjb250YWluIGFueXRoaW5nKVxyXG52YXIgc3BlY2lhbEVsZW1lbnRzID0ge307IC8vIG1ha2VNYXAoXCJzY3JpcHQsc3R5bGVcIilcclxuXHJcbnZhciB2YWxpZEVsZW1lbnRzID0gZXh0ZW5kKHt9LCB2b2lkRWxlbWVudHMsIGJsb2NrRWxlbWVudHMsIGlubGluZUVsZW1lbnRzLCBvcHRpb25hbEVuZFRhZ0VsZW1lbnRzKTtcclxuXHJcbi8vQXR0cmlidXRlcyB0aGF0IGhhdmUgaHJlZiBhbmQgaGVuY2UgbmVlZCB0byBiZSBzYW5pdGl6ZWRcclxudmFyIHVyaUF0dHJzID0gbWFrZU1hcChcImJhY2tncm91bmQsY2l0ZSxocmVmLGxvbmdkZXNjLHNyYyx1c2VtYXBcIik7XHJcbnZhciB2YWxpZEF0dHJzID0gZXh0ZW5kKHt9LCB1cmlBdHRycywgbWFrZU1hcChcclxuICAgICAgICAnYWJicixhbGlnbixhbHQsYXhpcyxiZ2NvbG9yLGJvcmRlcixjZWxscGFkZGluZyxjZWxsc3BhY2luZyxjbGFzcyxjbGVhciwnK1xyXG4gICAgICAgICdjb2xvcixjb2xzLGNvbHNwYW4sY29tcGFjdCxjb29yZHMsZGlyLGZhY2UsaGVhZGVycyxoZWlnaHQsaHJlZmxhbmcsaHNwYWNlLCcrXHJcbiAgICAgICAgJ2lzbWFwLGxhbmcsbGFuZ3VhZ2Usbm9ocmVmLG5vd3JhcCxyZWwscmV2LHJvd3Mscm93c3BhbixydWxlcywnK1xyXG4gICAgICAgICdzY29wZSxzY3JvbGxpbmcsc2hhcGUsc3BhbixzdGFydCxzdW1tYXJ5LHRhcmdldCx0aXRsZSx0eXBlLCcrXHJcbiAgICAgICAgJ3ZhbGlnbix2YWx1ZSx2c3BhY2Usd2lkdGgnKSk7XHJcblxyXG4vKipcclxuICogQGV4YW1wbGVcclxuICogaHRtbFBhcnNlcihodG1sU3RyaW5nLCB7XHJcbiAqICAgICBzdGFydDogZnVuY3Rpb24odGFnLCBhdHRycywgdW5hcnkpIHt9LFxyXG4gKiAgICAgZW5kOiBmdW5jdGlvbih0YWcpIHt9LFxyXG4gKiAgICAgY2hhcnM6IGZ1bmN0aW9uKHRleHQpIHt9LFxyXG4gKiAgICAgY29tbWVudDogZnVuY3Rpb24odGV4dCkge31cclxuICogfSk7XHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIHN0cmluZ1xyXG4gKiBAcGFyYW0ge29iamVjdH0gaGFuZGxlclxyXG4gKi9cclxuZnVuY3Rpb24gaHRtbFBhcnNlciggaHRtbCwgaGFuZGxlciApIHtcclxuICAgIHZhciBpbmRleCwgY2hhcnMsIG1hdGNoLCBzdGFjayA9IFtdLCBsYXN0ID0gaHRtbDtcclxuICAgIHN0YWNrLmxhc3RJdGVtID0gZnVuY3Rpb24oKSB7IHJldHVybiBzdGFja1sgc3RhY2subGVuZ3RoIC0gMSBdOyB9O1xyXG5cclxuICAgIHdoaWxlICggaHRtbCApIHtcclxuICAgICAgICBjaGFycyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSdyZSBub3QgaW4gYSBzY3JpcHQgb3Igc3R5bGUgZWxlbWVudFxyXG4gICAgICAgIGlmICggIXN0YWNrLmxhc3RJdGVtKCkgfHwgIXNwZWNpYWxFbGVtZW50c1sgc3RhY2subGFzdEl0ZW0oKSBdICkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ29tbWVudFxyXG4gICAgICAgICAgICBpZiAoIGh0bWwuaW5kZXhPZihcIjwhLS1cIikgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGh0bWwuaW5kZXhPZihcIi0tPlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGluZGV4ID49IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuY29tbWVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY29tbWVudCggaHRtbC5zdWJzdHJpbmcoIDQsIGluZGV4ICkgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwuc3Vic3RyaW5nKCBpbmRleCArIDMgKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZW5kIHRhZ1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBCRUdJTkdfRU5EX1RBR0VfUkVHRVhQLnRlc3QoaHRtbCkgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaCA9IGh0bWwubWF0Y2goIEVORF9UQUdfUkVHRVhQICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRjaCApIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcoIG1hdGNoWzBdLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2UoIEVORF9UQUdfUkVHRVhQLCBwYXJzZUVuZFRhZyApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzdGFydCB0YWdcclxuICAgICAgICAgICAgfSBlbHNlIGlmICggQkVHSU5fVEFHX1JFR0VYUC50ZXN0KGh0bWwpICkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBodG1sLm1hdGNoKCBTVEFSVF9UQUdfUkVHRVhQICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBtYXRjaCApIHtcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcoIG1hdGNoWzBdLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2UoIFNUQVJUX1RBR19SRUdFWFAsIHBhcnNlU3RhcnRUYWcgKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGNoYXJzICkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBodG1sLmluZGV4T2YoXCI8XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gaW5kZXggPCAwID8gaHRtbCA6IGh0bWwuc3Vic3RyaW5nKCAwLCBpbmRleCApO1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IGluZGV4IDwgMCA/IFwiXCIgOiBodG1sLnN1YnN0cmluZyggaW5kZXggKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlci5jaGFycyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5jaGFycyggaGUuZGVjb2RlKHRleHQpICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShuZXcgUmVnRXhwKFwiKC4qKTxcXFxccypcXFxcL1xcXFxzKlwiICsgc3RhY2subGFzdEl0ZW0oKSArIFwiW14+XSo+XCIsICdpJyksIGZ1bmN0aW9uKGFsbCwgdGV4dCl7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5cclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlKENPTU1FTlRfUkVHRVhQLCBcIiQxXCIpLlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2UoQ0RBVEFfUkVHRVhQLCBcIiQxXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyLmNoYXJzKXtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNoYXJzKCBoZS5kZWNvZGUodGV4dCkgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBwYXJzZUVuZFRhZyggXCJcIiwgc3RhY2subGFzdEl0ZW0oKSApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBodG1sID09IGxhc3QgKSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiUGFyc2UgRXJyb3I6IFwiICsgaHRtbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFzdCA9IGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xlYW4gdXAgYW55IHJlbWFpbmluZyB0YWdzXHJcbiAgICBwYXJzZUVuZFRhZygpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhcnRUYWcoIHRhZywgdGFnTmFtZSwgcmVzdCwgdW5hcnkgKSB7XHJcbiAgICAgICAgdGFnTmFtZSA9IGxvd2VyY2FzZSh0YWdOYW1lKTtcclxuICAgICAgICBpZiAoIGJsb2NrRWxlbWVudHNbIHRhZ05hbWUgXSApIHtcclxuICAgICAgICAgICAgd2hpbGUgKCBzdGFjay5sYXN0SXRlbSgpICYmIGlubGluZUVsZW1lbnRzWyBzdGFjay5sYXN0SXRlbSgpIF0gKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZUVuZFRhZyggXCJcIiwgc3RhY2subGFzdEl0ZW0oKSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIG9wdGlvbmFsRW5kVGFnRWxlbWVudHNbIHRhZ05hbWUgXSAmJiBzdGFjay5sYXN0SXRlbSgpID09IHRhZ05hbWUgKSB7XHJcbiAgICAgICAgICAgIHBhcnNlRW5kVGFnKCBcIlwiLCB0YWdOYW1lICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1bmFyeSA9IHZvaWRFbGVtZW50c1sgdGFnTmFtZSBdIHx8ICEhdW5hcnk7XHJcblxyXG4gICAgICAgIGlmICggIXVuYXJ5IClcclxuICAgICAgICAgICAgc3RhY2sucHVzaCggdGFnTmFtZSApO1xyXG5cclxuICAgICAgICB2YXIgYXR0cnMgPSB7fTtcclxuXHJcbiAgICAgICAgcmVzdC5yZXBsYWNlKEFUVFJfUkVHRVhQLCBmdW5jdGlvbihtYXRjaCwgbmFtZSwgZG91YmxlUXVvdGVkVmFsdWUsIHNpbmdsZVFvdXRlZFZhbHVlLCB1bnFvdXRlZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRvdWJsZVF1b3RlZFZhbHVlXHJcbiAgICAgICAgICAgICAgICB8fCBzaW5nbGVRb3V0ZWRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfHwgdW5xb3V0ZWRWYWx1ZVxyXG4gICAgICAgICAgICAgICAgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICBhdHRyc1tuYW1lXSA9IGhlLmRlY29kZSh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGhhbmRsZXIuc3RhcnQpIGhhbmRsZXIuc3RhcnQoIHRhZ05hbWUsIGF0dHJzLCB1bmFyeSApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlRW5kVGFnKCB0YWcsIHRhZ05hbWUgKSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IDAsIGk7XHJcbiAgICAgICAgdGFnTmFtZSA9IGxvd2VyY2FzZSh0YWdOYW1lKTtcclxuICAgICAgICBpZiAoIHRhZ05hbWUgKVxyXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxyXG4gICAgICAgICAgICBmb3IgKCBwb3MgPSBzdGFjay5sZW5ndGggLSAxOyBwb3MgPj0gMDsgcG9zLS0gKVxyXG4gICAgICAgICAgICAgICAgaWYgKCBzdGFja1sgcG9zIF0gPT0gdGFnTmFtZSApXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGlmICggcG9zID49IDAgKSB7XHJcbiAgICAgICAgICAgIC8vIENsb3NlIGFsbCB0aGUgb3BlbiBlbGVtZW50cywgdXAgdGhlIHN0YWNrXHJcbiAgICAgICAgICAgIGZvciAoIGkgPSBzdGFjay5sZW5ndGggLSAxOyBpID49IHBvczsgaS0tIClcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyLmVuZCkgaGFuZGxlci5lbmQoIHN0YWNrWyBpIF0gKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb3BlbiBlbGVtZW50cyBmcm9tIHRoZSBzdGFja1xyXG4gICAgICAgICAgICBzdGFjay5sZW5ndGggPSBwb3M7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogZGVjb2RlcyBhbGwgZW50aXRpZXMgaW50byByZWd1bGFyIHN0cmluZ1xyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmcgd2l0aCBkZWNvZGVkIGVudGl0aWVzLlxyXG4gKi8vKlxyXG52YXIgaGlkZGVuUHJlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XHJcbmZ1bmN0aW9uIGRlY29kZUVudGl0aWVzKHZhbHVlKSB7XHJcbiAgICBoaWRkZW5QcmUuaW5uZXJIVE1MPXZhbHVlLnJlcGxhY2UoLzwvZyxcIiZsdDtcIik7XHJcbiAgICByZXR1cm4gaGlkZGVuUHJlLmlubmVyVGV4dCB8fCBoaWRkZW5QcmUudGV4dENvbnRlbnQgfHwgJyc7XHJcbn0qL1xyXG5cclxuLyoqXHJcbiAqIEVzY2FwZXMgYWxsIHBvdGVudGlhbGx5IGRhbmdlcm91cyBjaGFyYWN0ZXJzLCBzbyB0aGF0IHRoZVxyXG4gKiByZXN1bHRpbmcgc3RyaW5nIGNhbiBiZSBzYWZlbHkgaW5zZXJ0ZWQgaW50byBhdHRyaWJ1dGUgb3JcclxuICogZWxlbWVudCB0ZXh0LlxyXG4gKiBAcGFyYW0gdmFsdWVcclxuICogQHJldHVybnMgZXNjYXBlZCB0ZXh0XHJcbiAqLy8qXHJcbmZ1bmN0aW9uIGVuY29kZUVudGl0aWVzKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUuXHJcbiAgICAgICAgcmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5cclxuICAgICAgICByZXBsYWNlKE5PTl9BTFBIQU5VTUVSSUNfUkVHRVhQLCBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICAgIHJldHVybiAnJiMnICsgdmFsdWUuY2hhckNvZGVBdCgwKSArICc7JztcclxuICAgICAgICB9KS5cclxuICAgICAgICByZXBsYWNlKC88L2csICcmbHQ7JykuXHJcbiAgICAgICAgcmVwbGFjZSgvPi9nLCAnJmd0OycpO1xyXG59Ki9cclxuXHJcbi8qKlxyXG4gKiBjcmVhdGUgYW4gSFRNTC9YTUwgd3JpdGVyIHdoaWNoIHdyaXRlcyB0byBidWZmZXJcclxuICogQHBhcmFtIHtBcnJheX0gYnVmIHVzZSBidWYuamFpbignJykgdG8gZ2V0IG91dCBzYW5pdGl6ZWQgaHRtbCBzdHJpbmdcclxuICogQHJldHVybnMge29iamVjdH0gaW4gdGhlIGZvcm0gb2Yge1xyXG4gKiAgICAgc3RhcnQ6IGZ1bmN0aW9uKHRhZywgYXR0cnMsIHVuYXJ5KSB7fSxcclxuICogICAgIGVuZDogZnVuY3Rpb24odGFnKSB7fSxcclxuICogICAgIGNoYXJzOiBmdW5jdGlvbih0ZXh0KSB7fSxcclxuICogICAgIGNvbW1lbnQ6IGZ1bmN0aW9uKHRleHQpIHt9XHJcbiAqIH1cclxuICovXHJcbmZ1bmN0aW9uIGh0bWxTYW5pdGl6ZVdyaXRlcihidWYpe1xyXG4gICAgdmFyIGlnbm9yZSA9IGZhbHNlO1xyXG4gICAgdmFyIG91dCA9IGJpbmQoYnVmLCBidWYucHVzaCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbih0YWcsIGF0dHJzLCB1bmFyeSl7XHJcbiAgICAgICAgICAgIHRhZyA9IGxvd2VyY2FzZSh0YWcpO1xyXG4gICAgICAgICAgICBpZiAoIWlnbm9yZSAmJiBzcGVjaWFsRWxlbWVudHNbdGFnXSkge1xyXG4gICAgICAgICAgICAgICAgaWdub3JlID0gdGFnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaWdub3JlICYmIHZhbGlkRWxlbWVudHNbdGFnXSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQoJzwnKTtcclxuICAgICAgICAgICAgICAgIG91dCh0YWcpO1xyXG4gICAgICAgICAgICAgICAgZm9yRWFjaChhdHRycywgZnVuY3Rpb24odmFsdWUsIGtleSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxrZXk9bG93ZXJjYXNlKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkQXR0cnNbbGtleV09PXRydWUgJiYgKHVyaUF0dHJzW2xrZXldIT09dHJ1ZSB8fCB2YWx1ZS5tYXRjaChVUklfUkVHRVhQKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0KCcgJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQoJz1cIicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQoaGUuZW5jb2RlKHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCgnXCInKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG91dCh1bmFyeSA/ICcvPicgOiAnPicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbmQ6IGZ1bmN0aW9uKHRhZyl7XHJcbiAgICAgICAgICAgICAgICB0YWcgPSBsb3dlcmNhc2UodGFnKTtcclxuICAgICAgICAgICAgICAgIGlmICghaWdub3JlICYmIHZhbGlkRWxlbWVudHNbdGFnXSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0KCc8LycpO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dCh0YWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dCgnPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRhZyA9PSBpZ25vcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZ25vcmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBjaGFyczogZnVuY3Rpb24oY2hhcnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpZ25vcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXQoaGUuZW5jb2RlKGNoYXJzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbi8vIHV0aWxpdGllc1xyXG5cclxuZnVuY3Rpb24gbWFrZU1hcChzdHIpe1xyXG4gICAgdmFyIG9iaiA9IHt9LCBpdGVtcyA9IHN0ci5zcGxpdCgnLCcpLCBpO1xyXG5cclxuICAgIGZvciAoIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKXtcclxuICAgICAgICBvYmpbIGl0ZW1zW2ldIF0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKGRzdCkge1xyXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgZm9yRWFjaChhcmdzLCBmdW5jdGlvbihvYmope1xyXG4gICAgICAgIGlmIChvYmogIT09IGRzdCkge1xyXG4gICAgICAgICAgICBmb3JFYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSl7XHJcbiAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkc3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xyXG4gIHZhciBrZXk7XHJcbiAgaWYgKG9iaikge1xyXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoa2V5ICE9PSAncHJvdG90eXBlJyAmJiBrZXkgIT09ICdsZW5ndGgnICYmIGtleSAhPT0gJ25hbWUnICYmIG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChvYmouZm9yRWFjaCAmJiBvYmouZm9yRWFjaCAhPT0gZm9yRWFjaCkge1xyXG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XHJcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgb2JqLmxlbmd0aDsga2V5Kyspe1xyXG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5mdW5jdGlvbiBiaW5kKHNlbGYsIGZuKSB7XHJcbiAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbiAgICB2YXIgY3VycnlBcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBbXTtcclxuICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmICEoZm4gaW5zdGFuY2VvZiBSZWdFeHApKSB7XHJcbiAgICByZXR1cm4gY3VycnlBcmdzLmxlbmd0aFxyXG4gICAgICA/IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgICAgPyBmbi5hcHBseShzZWxmLCBjdXJyeUFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSkpXHJcbiAgICAgICAgICAgIDogZm4uYXBwbHkoc2VsZiwgY3VycnlBcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgICA/IGZuLmFwcGx5KHNlbGYsIGFyZ3VtZW50cylcclxuICAgICAgICAgICAgOiBmbi5jYWxsKHNlbGYpO1xyXG4gICAgICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGluIElFLCBuYXRpdmUgbWV0aG9kcyBhcmUgbm90IGZ1bmN0aW9ucyBzbyB0aGV5IGNhbm5vdCBiZSBib3VuZCAobm90ZTogdGhleSBkb24ndCBuZWVkIHRvIGJlKVxyXG4gICAgcmV0dXJuIGZuO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGxvd2VyY2FzZSA9IGZ1bmN0aW9uKHN0cmluZyl7cmV0dXJuIHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnID8gc3RyaW5nLnRvTG93ZXJDYXNlKCkgOiBzdHJpbmc7fTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCl7XHJcbiAgICB2YXIgYnVmZmVyID0gW107XHJcblxyXG4gICAgaHRtbFBhcnNlcihodG1sLCBodG1sU2FuaXRpemVXcml0ZXIoYnVmZmVyKSk7XHJcblxyXG4gICAgcmV0dXJuIGJ1ZmZlci5qb2luKCcnKTtcclxufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZXR0aW5ncyA9IHsgbGluZUxlbmd0aDogNzIgfTtcbnZhciByZSA9IFJlZ0V4cDtcblxuZnVuY3Rpb24gQ29tbWFuZE1hbmFnZXIgKHBsdWdpbkhvb2tzLCBnZXRTdHJpbmcpIHtcbiAgdGhpcy5ob29rcyA9IHBsdWdpbkhvb2tzO1xuICB0aGlzLmdldFN0cmluZyA9IGdldFN0cmluZztcbn1cblxudmFyICQgPSBDb21tYW5kTWFuYWdlci5wcm90b3R5cGU7XG5cbiQucHJlZml4ZXMgPSAnKD86XFxcXHN7NCx9fFxcXFxzKj58XFxcXHMqLVxcXFxzK3xcXFxccypcXFxcZCtcXFxcLnw9fFxcXFwrfC18X3xcXFxcKnwjfFxcXFxzKlxcXFxbW15cXG5dXStcXFxcXTopJztcblxuJC51bndyYXAgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgdmFyIHR4dCA9IG5ldyByZSgnKFteXFxcXG5dKVxcXFxuKD8hKFxcXFxufCcgKyB0aGlzLnByZWZpeGVzICsgJykpJywgJ2cnKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UodHh0LCAnJDEgJDInKTtcbn07XG5cbiQud3JhcCA9IGZ1bmN0aW9uIChjaHVuaywgbGVuKSB7XG4gIHRoaXMudW53cmFwKGNodW5rKTtcbiAgdmFyIHJlZ2V4ID0gbmV3IHJlKCcoLnsxLCcgKyBsZW4gKyAnfSkoICt8JFxcXFxuPyknLCAnZ20nKSxcbiAgICB0aGF0ID0gdGhpcztcblxuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZShyZWdleCwgZnVuY3Rpb24gKGxpbmUsIG1hcmtlZCkge1xuICAgIGlmIChuZXcgcmUoJ14nICsgdGhhdC5wcmVmaXhlcywgJycpLnRlc3QobGluZSkpIHtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cbiAgICByZXR1cm4gbWFya2VkICsgJ1xcbic7XG4gIH0pO1xuXG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbn07XG5cbiQuZG9Cb2xkID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICByZXR1cm4gdGhpcy5kb0JvckkoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCAyLCB0aGlzLmdldFN0cmluZygnYm9sZGV4YW1wbGUnKSk7XG59O1xuXG4kLmRvSXRhbGljID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICByZXR1cm4gdGhpcy5kb0JvckkoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCAxLCB0aGlzLmdldFN0cmluZygnaXRhbGljZXhhbXBsZScpKTtcbn07XG5cbiQuZG9Cb3JJID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgblN0YXJzLCBpbnNlcnRUZXh0KSB7XG4gIGNodW5rLnRyaW1XaGl0ZXNwYWNlKCk7XG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9cXG57Mix9L2csICdcXG4nKTtcblxuICB2YXIgc3RhcnNCZWZvcmUgPSAvKFxcKiokKS8uZXhlYyhjaHVuay5iZWZvcmUpWzBdO1xuICB2YXIgc3RhcnNBZnRlciA9IC8oXlxcKiopLy5leGVjKGNodW5rLmFmdGVyKVswXTtcbiAgdmFyIHByZXZTdGFycyA9IE1hdGgubWluKHN0YXJzQmVmb3JlLmxlbmd0aCwgc3RhcnNBZnRlci5sZW5ndGgpO1xuXG4gIGlmICgocHJldlN0YXJzID49IG5TdGFycykgJiYgKHByZXZTdGFycyAhPSAyIHx8IG5TdGFycyAhPSAxKSkge1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKHJlKCdbKl17JyArIG5TdGFycyArICd9JCcsICcnKSwgJycpO1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShyZSgnXlsqXXsnICsgblN0YXJzICsgJ30nLCAnJyksICcnKTtcbiAgfSBlbHNlIGlmICghY2h1bmsuc2VsZWN0aW9uICYmIHN0YXJzQWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL14oWypfXSopLywgJycpO1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxzPykkLywgJycpO1xuICAgIHZhciB3aGl0ZXNwYWNlID0gcmUuJDE7XG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlICsgc3RhcnNBZnRlciArIHdoaXRlc3BhY2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFjaHVuay5zZWxlY3Rpb24gJiYgIXN0YXJzQWZ0ZXIpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IGluc2VydFRleHQ7XG4gICAgfVxuXG4gICAgdmFyIG1hcmt1cCA9IG5TdGFycyA8PSAxID8gJyonIDogJyoqJztcbiAgICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUgKyBtYXJrdXA7XG4gICAgY2h1bmsuYWZ0ZXIgPSBtYXJrdXAgKyBjaHVuay5hZnRlcjtcbiAgfVxufTtcblxuJC5zdHJpcExpbmtEZWZzID0gZnVuY3Rpb24gKHRleHQsIGRlZnNUb0FkZCkge1xuICB2YXIgcmVnZXggPSAvXlsgXXswLDN9XFxbKFxcZCspXFxdOlsgXFx0XSpcXG4/WyBcXHRdKjw/KFxcUys/KT4/WyBcXHRdKlxcbj9bIFxcdF0qKD86KFxcbiopW1wiKF0oLis/KVtcIildWyBcXHRdKik/KD86XFxuK3wkKS9nbTtcblxuICBmdW5jdGlvbiByZXBsYWNlciAoYWxsLCBpZCwgbGluaywgbmV3bGluZXMsIHRpdGxlKSB7XG4gICAgZGVmc1RvQWRkW2lkXSA9IGFsbC5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICBpZiAobmV3bGluZXMpIHtcbiAgICAgIGRlZnNUb0FkZFtpZF0gPSBhbGwucmVwbGFjZSgvW1wiKF0oLis/KVtcIildJC8sICcnKTtcbiAgICAgIHJldHVybiBuZXdsaW5lcyArIHRpdGxlO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlcik7XG59O1xuXG4kLmFkZExpbmtEZWYgPSBmdW5jdGlvbiAoY2h1bmssIGxpbmtEZWYpIHtcbiAgdmFyIHJlZk51bWJlciA9IDA7XG4gIHZhciBkZWZzVG9BZGQgPSB7fTtcbiAgY2h1bmsuYmVmb3JlID0gdGhpcy5zdHJpcExpbmtEZWZzKGNodW5rLmJlZm9yZSwgZGVmc1RvQWRkKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gdGhpcy5zdHJpcExpbmtEZWZzKGNodW5rLnNlbGVjdGlvbiwgZGVmc1RvQWRkKTtcbiAgY2h1bmsuYWZ0ZXIgPSB0aGlzLnN0cmlwTGlua0RlZnMoY2h1bmsuYWZ0ZXIsIGRlZnNUb0FkZCk7XG5cbiAgdmFyIGRlZnMgPSAnJztcbiAgdmFyIHJlZ2V4ID0gLyhcXFspKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopKFxcXVsgXT8oPzpcXG5bIF0qKT9cXFspKFxcZCspKFxcXSkvZztcblxuICBmdW5jdGlvbiBhZGREZWZOdW1iZXIgKGRlZikge1xuICAgIHJlZk51bWJlcisrO1xuICAgIGRlZiA9IGRlZi5yZXBsYWNlKC9eWyBdezAsM31cXFsoXFxkKylcXF06LywgJyAgWycgKyByZWZOdW1iZXIgKyAnXTonKTtcbiAgICBkZWZzICs9ICdcXG4nICsgZGVmO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGluayAod2hvbGVNYXRjaCwgYmVmb3JlLCBpbm5lciwgYWZ0ZXJJbm5lciwgaWQsIGVuZCkge1xuICAgIGlubmVyID0gaW5uZXIucmVwbGFjZShyZWdleCwgZ2V0TGluayk7XG4gICAgaWYgKGRlZnNUb0FkZFtpZF0pIHtcbiAgICAgIGFkZERlZk51bWJlcihkZWZzVG9BZGRbaWRdKTtcbiAgICAgIHJldHVybiBiZWZvcmUgKyBpbm5lciArIGFmdGVySW5uZXIgKyByZWZOdW1iZXIgKyBlbmQ7XG4gICAgfVxuICAgIHJldHVybiB3aG9sZU1hdGNoO1xuICB9XG5cbiAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UocmVnZXgsIGdldExpbmspO1xuXG4gIGlmIChsaW5rRGVmKSB7XG4gICAgYWRkRGVmTnVtYmVyKGxpbmtEZWYpO1xuICB9IGVsc2Uge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcbiAgfVxuXG4gIHZhciByZWZPdXQgPSByZWZOdW1iZXI7XG5cbiAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKHJlZ2V4LCBnZXRMaW5rKTtcblxuICBpZiAoY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL1xcbiokLywgJycpO1xuICB9XG4gIGlmICghY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxuKiQvLCAnJyk7XG4gIH1cblxuICBjaHVuay5hZnRlciArPSAnXFxuXFxuJyArIGRlZnM7XG5cbiAgcmV0dXJuIHJlZk91dDtcbn07XG5cbmZ1bmN0aW9uIHByb3Blcmx5RW5jb2RlZCAobGlua2RlZikge1xuICBmdW5jdGlvbiByZXBsYWNlciAod2hvbGVtYXRjaCwgbGluaywgdGl0bGUpIHtcbiAgICBsaW5rID0gbGluay5yZXBsYWNlKC9cXD8uKiQvLCBmdW5jdGlvbiAocXVlcnlwYXJ0KSB7XG4gICAgICByZXR1cm4gcXVlcnlwYXJ0LnJlcGxhY2UoL1xcKy9nLCAnICcpOyAvLyBpbiB0aGUgcXVlcnkgc3RyaW5nLCBhIHBsdXMgYW5kIGEgc3BhY2UgYXJlIGlkZW50aWNhbFxuICAgIH0pO1xuICAgIGxpbmsgPSBkZWNvZGVVUklDb21wb25lbnQobGluayk7IC8vIHVuZW5jb2RlIGZpcnN0LCB0byBwcmV2ZW50IGRvdWJsZSBlbmNvZGluZ1xuICAgIGxpbmsgPSBlbmNvZGVVUkkobGluaykucmVwbGFjZSgvJy9nLCAnJTI3JykucmVwbGFjZSgvXFwoL2csICclMjgnKS5yZXBsYWNlKC9cXCkvZywgJyUyOScpO1xuICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL1xcPy4qJC8sIGZ1bmN0aW9uIChxdWVyeXBhcnQpIHtcbiAgICAgIHJldHVybiBxdWVyeXBhcnQucmVwbGFjZSgvXFwrL2csICclMmInKTsgLy8gc2luY2Ugd2UgcmVwbGFjZWQgcGx1cyB3aXRoIHNwYWNlcyBpbiB0aGUgcXVlcnkgcGFydCwgYWxsIHBsdXNlcyB0aGF0IG5vdyBhcHBlYXIgd2hlcmUgb3JpZ2luYWxseSBlbmNvZGVkXG4gICAgfSk7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICB0aXRsZSA9IHRpdGxlLnRyaW0gPyB0aXRsZS50cmltKCkgOiB0aXRsZS5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZSgvXCIvZywgJ3F1b3Q7JykucmVwbGFjZSgvXFwoL2csICcmIzQwOycpLnJlcGxhY2UoL1xcKS9nLCAnJiM0MTsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICAgIH1cbiAgICByZXR1cm4gdGl0bGUgPyBsaW5rICsgJyBcIicgKyB0aXRsZSArICdcIicgOiBsaW5rO1xuICB9XG4gIHJldHVybiBsaW5rZGVmLnJlcGxhY2UoL15cXHMqKC4qPykoPzpcXHMrXCIoLispXCIpP1xccyokLywgcmVwbGFjZXIpO1xufVxuXG4kLmRvTGlua09ySW1hZ2UgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nLCBpc0ltYWdlKSB7XG4gIHZhciBiYWNrZ3JvdW5kO1xuICBjaHVuay50cmltV2hpdGVzcGFjZSgpO1xuICBjaHVuay5maW5kVGFncygvXFxzKiE/XFxbLywgL1xcXVsgXT8oPzpcXG5bIF0qKT8oXFxbLio/XFxdKT8vKTtcblxuICBpZiAoY2h1bmsuZW5kVGFnLmxlbmd0aCA+IDEgJiYgY2h1bmsuc3RhcnRUYWcubGVuZ3RoID4gMCkge1xuICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuc3RhcnRUYWcucmVwbGFjZSgvIT9cXFsvLCAnJyk7XG4gICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgdGhpcy5hZGRMaW5rRGVmKGNodW5rLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zdGFydFRhZyArIGNodW5rLnNlbGVjdGlvbiArIGNodW5rLmVuZFRhZztcbiAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuXG4gICAgaWYgKC9cXG5cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgICAgdGhpcy5hZGRMaW5rRGVmKGNodW5rLCBudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgaWYgKGlzSW1hZ2UpIHtcbiAgICAgIGlmICghdGhpcy5ob29rcy5pbnNlcnRJbWFnZURpYWxvZyhsaW5rRW50ZXJlZENhbGxiYWNrKSl7XG4gICAgICAgIHVpLnByb21wdCgncHJvbXB0LWltYWdlJywgbGlua0VudGVyZWRDYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVpLnByb21wdCgncHJvbXB0LWxpbmsnLCBsaW5rRW50ZXJlZENhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBsaW5rRW50ZXJlZENhbGxiYWNrIChsaW5rKSB7XG4gICAgaWYgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9ICgnICcgKyBjaHVuay5zZWxlY3Rpb24pLnJlcGxhY2UoLyhbXlxcXFxdKD86XFxcXFxcXFwpKikoPz1bW1xcXV0pL2csICckMVxcXFwnKS5zdWJzdHIoMSk7XG5cbiAgICAgIHZhciBsaW5rRGVmID0gJyBbOTk5XTogJyArIHByb3Blcmx5RW5jb2RlZChsaW5rKTtcbiAgICAgIHZhciBudW0gPSB0aGF0LmFkZExpbmtEZWYoY2h1bmssIGxpbmtEZWYpO1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBpc0ltYWdlID8gJyFbJyA6ICdbJztcbiAgICAgIGNodW5rLmVuZFRhZyA9ICddWycgKyBudW0gKyAnXSc7XG5cbiAgICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICAgIGlmIChpc0ltYWdlKSB7XG4gICAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gdGhhdC5nZXRTdHJpbmcoJ2ltYWdlZGVzY3JpcHRpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSB0aGF0LmdldFN0cmluZygnbGlua2Rlc2NyaXB0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcG9zdFByb2Nlc3NpbmcoKTtcbiAgfVxufTtcblxuJC5kb0F1dG9pbmRlbnQgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIHZhciBjb21tYW5kTWdyID0gdGhpcztcbiAgdmFyIGZha2VTZWxlY3Rpb24gPSBmYWxzZTtcblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZSgvKFxcbnxeKVsgXXswLDN9KFsqKy1dfFxcZCtbLl0pWyBcXHRdKlxcbiQvLCAnXFxuXFxuJyk7XG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxufF4pWyBdezAsM30+WyBcXHRdKlxcbiQvLCAnXFxuXFxuJyk7XG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oXFxufF4pWyBcXHRdK1xcbiQvLCAnXFxuXFxuJyk7XG5cbiAgaWYgKCFjaHVuay5zZWxlY3Rpb24gJiYgIS9eWyBcXHRdKig/OlxcbnwkKS8udGVzdChjaHVuay5hZnRlcikpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL15bXlxcbl0qLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gpIHtcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHdob2xlTWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG4gICAgZmFrZVNlbGVjdGlvbiA9IHRydWU7XG4gIH1cblxuICBpZiAoLyhcXG58XilbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSsuKlxcbiQvLnRlc3QoY2h1bmsuYmVmb3JlKSkge1xuICAgIGlmIChjb21tYW5kTWdyLmRvTGlzdCkge1xuICAgICAgY29tbWFuZE1nci5kb0xpc3QoY2h1bmspO1xuICAgIH1cbiAgfVxuICBpZiAoLyhcXG58XilbIF17MCwzfT5bIFxcdF0rLipcXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkpIHtcbiAgICBpZiAoY29tbWFuZE1nci5kb0Jsb2NrcXVvdGUpIHtcbiAgICAgIGNvbW1hbmRNZ3IuZG9CbG9ja3F1b3RlKGNodW5rKTtcbiAgICB9XG4gIH1cbiAgaWYgKC8oXFxufF4pKFxcdHxbIF17NCx9KS4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgaWYgKGNvbW1hbmRNZ3IuZG9Db2RlKSB7XG4gICAgICBjb21tYW5kTWdyLmRvQ29kZShjaHVuayk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGZha2VTZWxlY3Rpb24pIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLnNlbGVjdGlvbiArIGNodW5rLmFmdGVyO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9ICcnO1xuICB9XG59O1xuXG4kLmRvQmxvY2txdW90ZSA9IGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oXFxuKikoW15cXHJdKz8pKFxcbiopJC8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIG5ld2xpbmVzQmVmb3JlLCB0ZXh0LCBuZXdsaW5lc0FmdGVyKSB7XG4gICAgICBjaHVuay5iZWZvcmUgKz0gbmV3bGluZXNCZWZvcmU7XG4gICAgICBjaHVuay5hZnRlciA9IG5ld2xpbmVzQWZ0ZXIgKyBjaHVuay5hZnRlcjtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0pO1xuXG4gIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC8oPlsgXFx0XSopJC8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gsIGJsYW5rTGluZSkge1xuICAgICAgY2h1bmsuc2VsZWN0aW9uID0gYmxhbmtMaW5lICsgY2h1bmsuc2VsZWN0aW9uO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuXG4gIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eKFxcc3w+KSskLywgJycpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24gfHwgdGhpcy5nZXRTdHJpbmcoJ3F1b3RlZXhhbXBsZScpO1xuXG4gIHZhciBtYXRjaCA9ICcnO1xuICB2YXIgbGVmdE92ZXIgPSAnJztcbiAgdmFyIGxpbmU7XG5cbiAgaWYgKGNodW5rLmJlZm9yZSkge1xuICAgIHZhciBsaW5lcyA9IGNodW5rLmJlZm9yZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgaW5DaGFpbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBnb29kID0gZmFsc2U7XG4gICAgICBsaW5lID0gbGluZXNbaV07XG4gICAgICBpbkNoYWluID0gaW5DaGFpbiAmJiBsaW5lLmxlbmd0aCA+IDA7XG4gICAgICBpZiAoL14+Ly50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgICBpZiAoIWluQ2hhaW4gJiYgbGluZS5sZW5ndGggPiAxKVxuICAgICAgICAgIGluQ2hhaW4gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICgvXlsgXFx0XSokLy50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGdvb2QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ29vZCA9IGluQ2hhaW47XG4gICAgICB9XG4gICAgICBpZiAoZ29vZCkge1xuICAgICAgICBtYXRjaCArPSBsaW5lICsgJ1xcbic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0T3ZlciArPSBtYXRjaCArIGxpbmU7XG4gICAgICAgIG1hdGNoID0gJ1xcbic7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghLyhefFxcbik+Ly50ZXN0KG1hdGNoKSkge1xuICAgICAgbGVmdE92ZXIgKz0gbWF0Y2g7XG4gICAgICBtYXRjaCA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIGNodW5rLnN0YXJ0VGFnID0gbWF0Y2g7XG4gIGNodW5rLmJlZm9yZSA9IGxlZnRPdmVyO1xuXG4gIC8vIGVuZCBvZiBjaGFuZ2VcblxuICBpZiAoY2h1bmsuYWZ0ZXIpIHtcbiAgICBjaHVuay5hZnRlciA9IGNodW5rLmFmdGVyLnJlcGxhY2UoL15cXG4/LywgJ1xcbicpO1xuICB9XG5cbiAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKC9eKCgoXFxufF4pKFxcblsgXFx0XSopKj4oLitcXG4pKi4qKSsoXFxuWyBcXHRdKikqKS8sXG4gICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gpIHtcbiAgICAgIGNodW5rLmVuZFRhZyA9IHRvdGFsTWF0Y2g7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICApO1xuXG4gIHZhciByZXBsYWNlQmxhbmtzSW5UYWdzID0gZnVuY3Rpb24gKHVzZUJyYWNrZXQpIHtcblxuICAgIHZhciByZXBsYWNlbWVudCA9IHVzZUJyYWNrZXQgPyAnPiAnIDogJyc7XG5cbiAgICBpZiAoY2h1bmsuc3RhcnRUYWcpIHtcbiAgICAgIGNodW5rLnN0YXJ0VGFnID0gY2h1bmsuc3RhcnRUYWcucmVwbGFjZSgvXFxuKCg+fFxccykqKVxcbiQvLFxuICAgICAgICBmdW5jdGlvbiAodG90YWxNYXRjaCwgbWFya2Rvd24pIHtcbiAgICAgICAgICByZXR1cm4gJ1xcbicgKyBtYXJrZG93bi5yZXBsYWNlKC9eWyBdezAsM30+P1sgXFx0XSokL2dtLCByZXBsYWNlbWVudCkgKyAnXFxuJztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChjaHVuay5lbmRUYWcpIHtcbiAgICAgIGNodW5rLmVuZFRhZyA9IGNodW5rLmVuZFRhZy5yZXBsYWNlKC9eXFxuKCg+fFxccykqKVxcbi8sXG4gICAgICAgIGZ1bmN0aW9uICh0b3RhbE1hdGNoLCBtYXJrZG93bikge1xuICAgICAgICAgIHJldHVybiAnXFxuJyArIG1hcmtkb3duLnJlcGxhY2UoL15bIF17MCwzfT4/WyBcXHRdKiQvZ20sIHJlcGxhY2VtZW50KSArICdcXG4nO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKC9eKD8hWyBdezAsM30+KS9tLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuICAgIHRoaXMud3JhcChjaHVuaywgc2V0dGluZ3MubGluZUxlbmd0aCAtIDIpO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eL2dtLCAnPiAnKTtcbiAgICByZXBsYWNlQmxhbmtzSW5UYWdzKHRydWUpO1xuICAgIGNodW5rLnNraXBMaW5lcygpO1xuICB9IGVsc2Uge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IGNodW5rLnNlbGVjdGlvbi5yZXBsYWNlKC9eWyBdezAsM30+ID8vZ20sICcnKTtcbiAgICB0aGlzLnVud3JhcChjaHVuayk7XG4gICAgcmVwbGFjZUJsYW5rc0luVGFncyhmYWxzZSk7XG5cbiAgICBpZiAoIS9eKFxcbnxeKVsgXXswLDN9Pi8udGVzdChjaHVuay5zZWxlY3Rpb24pICYmIGNodW5rLnN0YXJ0VGFnKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLnN0YXJ0VGFnLnJlcGxhY2UoL1xcbnswLDJ9JC8sICdcXG5cXG4nKTtcbiAgICB9XG5cbiAgICBpZiAoIS8oXFxufF4pWyBdezAsM30+LiokLy50ZXN0KGNodW5rLnNlbGVjdGlvbikgJiYgY2h1bmsuZW5kVGFnKSB7XG4gICAgICBjaHVuay5lbmRUYWcgPSBjaHVuay5lbmRUYWcucmVwbGFjZSgvXlxcbnswLDJ9LywgJ1xcblxcbicpO1xuICAgIH1cbiAgfVxuXG4gIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuaG9va3MucG9zdEJsb2NrcXVvdGVDcmVhdGlvbihjaHVuay5zZWxlY3Rpb24pO1xuXG4gIGlmICghL1xcbi8udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14oPiAqKS8sXG4gICAgICBmdW5jdGlvbiAod2hvbGVNYXRjaCwgYmxhbmtzKSB7XG4gICAgICAgIGNodW5rLnN0YXJ0VGFnICs9IGJsYW5rcztcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSk7XG4gIH1cbn07XG5cbiQuZG9Db2RlID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuXG4gIHZhciBoYXNUZXh0QmVmb3JlID0gL1xcU1sgXSokLy50ZXN0KGNodW5rLmJlZm9yZSk7XG4gIHZhciBoYXNUZXh0QWZ0ZXIgPSAvXlsgXSpcXFMvLnRlc3QoY2h1bmsuYWZ0ZXIpO1xuXG4gIC8vIFVzZSAnZm91ciBzcGFjZScgbWFya2Rvd24gaWYgdGhlIHNlbGVjdGlvbiBpcyBvbiBpdHMgb3duXG4gIC8vIGxpbmUgb3IgaXMgbXVsdGlsaW5lLlxuICBpZiAoKCFoYXNUZXh0QWZ0ZXIgJiYgIWhhc1RleHRCZWZvcmUpIHx8IC9cXG4vLnRlc3QoY2h1bmsuc2VsZWN0aW9uKSkge1xuXG4gICAgY2h1bmsuYmVmb3JlID0gY2h1bmsuYmVmb3JlLnJlcGxhY2UoL1sgXXs0fSQvLFxuICAgICAgZnVuY3Rpb24gKHRvdGFsTWF0Y2gpIHtcbiAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gdG90YWxNYXRjaCArIGNodW5rLnNlbGVjdGlvbjtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSk7XG5cbiAgICB2YXIgbkxpbmVzQmFjayA9IDE7XG4gICAgdmFyIG5MaW5lc0ZvcndhcmQgPSAxO1xuXG4gICAgaWYgKC8oXFxufF4pKFxcdHxbIF17NCx9KS4qXFxuJC8udGVzdChjaHVuay5iZWZvcmUpKSB7XG4gICAgICBuTGluZXNCYWNrID0gMDtcbiAgICB9XG4gICAgaWYgKC9eXFxuKFxcdHxbIF17NCx9KS8udGVzdChjaHVuay5hZnRlcikpIHtcbiAgICAgIG5MaW5lc0ZvcndhcmQgPSAwO1xuICAgIH1cblxuICAgIGNodW5rLnNraXBMaW5lcyhuTGluZXNCYWNrLCBuTGluZXNGb3J3YXJkKTtcblxuICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9ICcgICAgJztcbiAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdjb2RlZXhhbXBsZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgvXlsgXXswLDN9XFxTL20udGVzdChjaHVuay5zZWxlY3Rpb24pKSB7XG4gICAgICAgIGlmICgvXFxuLy50ZXN0KGNodW5rLnNlbGVjdGlvbikpXG4gICAgICAgICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL14vZ20sICcgICAgJyk7XG4gICAgICAgIGVsc2UgLy8gaWYgaXQncyBub3QgbXVsdGlsaW5lLCBkbyBub3Qgc2VsZWN0IHRoZSBmb3VyIGFkZGVkIHNwYWNlczsgdGhpcyBpcyBtb3JlIGNvbnNpc3RlbnQgd2l0aCB0aGUgZG9MaXN0IGJlaGF2aW9yXG4gICAgICAgICAgY2h1bmsuYmVmb3JlICs9ICcgICAgJztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXig/OlsgXXs0fXxbIF17MCwzfVxcdCkvZ20sICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gVXNlIGJhY2t0aWNrcyAoYCkgdG8gZGVsaW1pdCB0aGUgY29kZSBibG9jay5cblxuICAgIGNodW5rLnRyaW1XaGl0ZXNwYWNlKCk7XG4gICAgY2h1bmsuZmluZFRhZ3MoL2AvLCAvYC8pO1xuXG4gICAgaWYgKCFjaHVuay5zdGFydFRhZyAmJiAhY2h1bmsuZW5kVGFnKSB7XG4gICAgICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICdgJztcbiAgICAgIGlmICghY2h1bmsuc2VsZWN0aW9uKSB7XG4gICAgICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdjb2RlZXhhbXBsZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjaHVuay5lbmRUYWcgJiYgIWNodW5rLnN0YXJ0VGFnKSB7XG4gICAgICBjaHVuay5iZWZvcmUgKz0gY2h1bmsuZW5kVGFnO1xuICAgICAgY2h1bmsuZW5kVGFnID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcbiAgICB9XG4gIH1cbn07XG5cbiQuZG9MaXN0ID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgaXNOdW1iZXJlZExpc3QpIHtcbiAgdmFyIHByZXZpb3VzSXRlbXNSZWdleCA9IC8oXFxufF4pKChbIF17MCwzfShbKistXXxcXGQrWy5dKVsgXFx0XSsuKikoXFxuLit8XFxuezIsfShbKistXS4qfFxcZCtbLl0pWyBcXHRdKy4qfFxcbnsyLH1bIFxcdF0rXFxTLiopKilcXG4qJC87XG4gIHZhciBuZXh0SXRlbXNSZWdleCA9IC9eXFxuKigoWyBdezAsM30oWyorLV18XFxkK1suXSlbIFxcdF0rLiopKFxcbi4rfFxcbnsyLH0oWyorLV0uKnxcXGQrWy5dKVsgXFx0XSsuKnxcXG57Mix9WyBcXHRdK1xcUy4qKSopXFxuKi87XG4gIHZhciBidWxsZXQgPSAnLSc7XG4gIHZhciBudW0gPSAxO1xuXG4gIGZ1bmN0aW9uIGdldEl0ZW1QcmVmaXggKCkge1xuICAgIHZhciBwcmVmaXg7XG4gICAgaWYgKGlzTnVtYmVyZWRMaXN0KSB7XG4gICAgICBwcmVmaXggPSAnICcgKyBudW0gKyAnLiAnO1xuICAgICAgbnVtKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcHJlZml4ID0gJyAnICsgYnVsbGV0ICsgJyAnO1xuICAgIH1cbiAgICByZXR1cm4gcHJlZml4O1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldFByZWZpeGVkSXRlbSAoaXRlbVRleHQpIHtcbiAgICBpZiAoaXNOdW1iZXJlZExpc3QgPT09IHZvaWQgMCkge1xuICAgICAgaXNOdW1iZXJlZExpc3QgPSAvXlxccypcXGQvLnRlc3QoaXRlbVRleHQpO1xuICAgIH1cblxuICAgIGl0ZW1UZXh0ID0gaXRlbVRleHQucmVwbGFjZSgvXlsgXXswLDN9KFsqKy1dfFxcZCtbLl0pXFxzL2dtLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZ2V0SXRlbVByZWZpeCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW1UZXh0O1xuICB9O1xuXG4gIGNodW5rLmZpbmRUYWdzKC8oXFxufF4pKlsgXXswLDN9KFsqKy1dfFxcZCtbLl0pXFxzKy8sIG51bGwpO1xuXG4gIGlmIChjaHVuay5iZWZvcmUgJiYgIS9cXG4kLy50ZXN0KGNodW5rLmJlZm9yZSkgJiYgIS9eXFxuLy50ZXN0KGNodW5rLnN0YXJ0VGFnKSkge1xuICAgIGNodW5rLmJlZm9yZSArPSBjaHVuay5zdGFydFRhZztcbiAgICBjaHVuay5zdGFydFRhZyA9ICcnO1xuICB9XG5cbiAgaWYgKGNodW5rLnN0YXJ0VGFnKSB7XG5cbiAgICB2YXIgaGFzRGlnaXRzID0gL1xcZCtbLl0vLnRlc3QoY2h1bmsuc3RhcnRUYWcpO1xuICAgIGNodW5rLnN0YXJ0VGFnID0gJyc7XG4gICAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcblsgXXs0fS9nLCAnXFxuJyk7XG4gICAgdGhpcy51bndyYXAoY2h1bmspO1xuICAgIGNodW5rLnNraXBMaW5lcygpO1xuXG4gICAgaWYgKGhhc0RpZ2l0cykge1xuICAgICAgY2h1bmsuYWZ0ZXIgPSBjaHVuay5hZnRlci5yZXBsYWNlKG5leHRJdGVtc1JlZ2V4LCBnZXRQcmVmaXhlZEl0ZW0pO1xuICAgIH1cbiAgICBpZiAoaXNOdW1iZXJlZExpc3QgPT0gaGFzRGlnaXRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgdmFyIG5MaW5lc1VwID0gMTtcblxuICBjaHVuay5iZWZvcmUgPSBjaHVuay5iZWZvcmUucmVwbGFjZShwcmV2aW91c0l0ZW1zUmVnZXgsXG4gICAgZnVuY3Rpb24gKGl0ZW1UZXh0KSB7XG4gICAgICBpZiAoL15cXHMqKFsqKy1dKS8udGVzdChpdGVtVGV4dCkpIHtcbiAgICAgICAgYnVsbGV0ID0gcmUuJDE7XG4gICAgICB9XG4gICAgICBuTGluZXNVcCA9IC9bXlxcbl1cXG5cXG5bXlxcbl0vLnRlc3QoaXRlbVRleHQpID8gMSA6IDA7XG4gICAgICByZXR1cm4gZ2V0UHJlZml4ZWRJdGVtKGl0ZW1UZXh0KTtcbiAgICB9KTtcblxuICBpZiAoIWNodW5rLnNlbGVjdGlvbikge1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdsaXRlbScpO1xuICB9XG5cbiAgdmFyIHByZWZpeCA9IGdldEl0ZW1QcmVmaXgoKTtcbiAgdmFyIG5MaW5lc0Rvd24gPSAxO1xuXG4gIGNodW5rLmFmdGVyID0gY2h1bmsuYWZ0ZXIucmVwbGFjZShuZXh0SXRlbXNSZWdleCwgZnVuY3Rpb24gKGl0ZW1UZXh0KSB7XG4gICAgbkxpbmVzRG93biA9IC9bXlxcbl1cXG5cXG5bXlxcbl0vLnRlc3QoaXRlbVRleHQpID8gMSA6IDA7XG4gICAgcmV0dXJuIGdldFByZWZpeGVkSXRlbShpdGVtVGV4dCk7XG4gIH0pO1xuICBjaHVuay50cmltV2hpdGVzcGFjZSh0cnVlKTtcbiAgY2h1bmsuc2tpcExpbmVzKG5MaW5lc1VwLCBuTGluZXNEb3duLCB0cnVlKTtcbiAgY2h1bmsuc3RhcnRUYWcgPSBwcmVmaXg7XG4gIHZhciBzcGFjZXMgPSBwcmVmaXgucmVwbGFjZSgvLi9nLCAnICcpO1xuICB0aGlzLndyYXAoY2h1bmssIHNldHRpbmdzLmxpbmVMZW5ndGggLSBzcGFjZXMubGVuZ3RoKTtcbiAgY2h1bmsuc2VsZWN0aW9uID0gY2h1bmsuc2VsZWN0aW9uLnJlcGxhY2UoL1xcbi9nLCAnXFxuJyArIHNwYWNlcyk7XG5cbn07XG5cbiQuZG9IZWFkaW5nID0gZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICBjaHVuay5zZWxlY3Rpb24gPSBjaHVuay5zZWxlY3Rpb24ucmVwbGFjZSgvKF5cXHMrfFxccyskKS9nLCAnJyk7XG5cbiAgaWYgKCFjaHVuay5zZWxlY3Rpb24pIHtcbiAgICBjaHVuay5zdGFydFRhZyA9ICcjIyAnO1xuICAgIGNodW5rLnNlbGVjdGlvbiA9IHRoaXMuZ2V0U3RyaW5nKCdoZWFkaW5nZXhhbXBsZScpO1xuICAgIGNodW5rLmVuZFRhZyA9ICcgIyMnO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBoZWFkZXJMZXZlbCA9IDA7XG5cbiAgY2h1bmsuZmluZFRhZ3MoLyMrWyBdKi8sIC9bIF0qIysvKTtcbiAgaWYgKC8jKy8udGVzdChjaHVuay5zdGFydFRhZykpIHtcbiAgICBoZWFkZXJMZXZlbCA9IHJlLmxhc3RNYXRjaC5sZW5ndGg7XG4gIH1cbiAgY2h1bmsuc3RhcnRUYWcgPSBjaHVuay5lbmRUYWcgPSAnJztcbiAgY2h1bmsuZmluZFRhZ3MobnVsbCwgL1xccz8oLSt8PSspLyk7XG4gIGlmICgvPSsvLnRlc3QoY2h1bmsuZW5kVGFnKSkge1xuICAgIGhlYWRlckxldmVsID0gMTtcbiAgfVxuICBpZiAoLy0rLy50ZXN0KGNodW5rLmVuZFRhZykpIHtcbiAgICBoZWFkZXJMZXZlbCA9IDI7XG4gIH1cblxuICBjaHVuay5zdGFydFRhZyA9IGNodW5rLmVuZFRhZyA9ICcnO1xuICBjaHVuay5za2lwTGluZXMoMSwgMSk7XG5cbiAgdmFyIGhlYWRlckxldmVsVG9DcmVhdGUgPSBoZWFkZXJMZXZlbCA9PSAwID8gMiA6IGhlYWRlckxldmVsIC0gMTtcbiAgaWYgKGhlYWRlckxldmVsVG9DcmVhdGUgPiAwKSB7XG4gICAgdmFyIGhlYWRlckNoYXIgPSBoZWFkZXJMZXZlbFRvQ3JlYXRlID49IDIgPyAnLScgOiAnPSc7XG4gICAgdmFyIGxlbiA9IGNodW5rLnNlbGVjdGlvbi5sZW5ndGg7XG4gICAgaWYgKGxlbiA+IHNldHRpbmdzLmxpbmVMZW5ndGgpIHtcbiAgICAgIGxlbiA9IHNldHRpbmdzLmxpbmVMZW5ndGg7XG4gICAgfVxuICAgIGNodW5rLmVuZFRhZyA9ICdcXG4nO1xuICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgY2h1bmsuZW5kVGFnICs9IGhlYWRlckNoYXI7XG4gICAgfVxuICB9XG59O1xuXG4kLmRvSG9yaXpvbnRhbFJ1bGUgPSBmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gIGNodW5rLnN0YXJ0VGFnID0gJy0tLS0tLS0tLS1cXG4nO1xuICBjaHVuay5zZWxlY3Rpb24gPSAnJztcbiAgY2h1bmsuc2tpcExpbmVzKDIsIDEsIHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1hbmRNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWkgPSByZXF1aXJlKCcuL3VpJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgnLi9wb3NpdGlvbicpO1xudmFyIFBhbmVsQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFuZWxDb2xsZWN0aW9uJyk7XG52YXIgVW5kb01hbmFnZXIgPSByZXF1aXJlKCcuL1VuZG9NYW5hZ2VyJyk7XG52YXIgVUlNYW5hZ2VyID0gcmVxdWlyZSgnLi9VSU1hbmFnZXInKTtcbnZhciBDb21tYW5kTWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tbWFuZE1hbmFnZXInKTtcbnZhciBQcmV2aWV3TWFuYWdlciA9IHJlcXVpcmUoJy4vUHJldmlld01hbmFnZXInKTtcbnZhciBIb29rQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vSG9va0NvbGxlY3Rpb24nKTtcblxudmFyIGRlZmF1bHRzU3RyaW5ncyA9IHtcbiAgYm9sZDogJ1N0cm9uZyA8c3Ryb25nPiBDdHJsK0InLFxuICBib2xkZXhhbXBsZTogJ3N0cm9uZyB0ZXh0JyxcbiAgY29kZTogJ0NvZGUgU2FtcGxlIDxwcmU+PGNvZGU+IEN0cmwrSycsXG4gIGNvZGVleGFtcGxlOiAnZW50ZXIgY29kZSBoZXJlJyxcbiAgaGVhZGluZzogJ0hlYWRpbmcgPGgxPi88aDI+IEN0cmwrSCcsXG4gIGhlYWRpbmdleGFtcGxlOiAnSGVhZGluZycsXG4gIGhlbHA6ICdNYXJrZG93biBFZGl0aW5nIEhlbHAnLFxuICBocjogJ0hvcml6b250YWwgUnVsZSA8aHI+IEN0cmwrUicsXG4gIGltYWdlOiAnSW1hZ2UgPGltZz4gQ3RybCtHJyxcbiAgaW1hZ2VkZXNjcmlwdGlvbjogJ2VudGVyIGltYWdlIGRlc2NyaXB0aW9uIGhlcmUnLFxuICBpdGFsaWM6ICdFbXBoYXNpcyA8ZW0+IEN0cmwrSScsXG4gIGl0YWxpY2V4YW1wbGU6ICdlbXBoYXNpemVkIHRleHQnLFxuICBsaW5rOiAnSHlwZXJsaW5rIDxhPiBDdHJsK0wnLFxuICBsaW5rZGVzY3JpcHRpb246ICdlbnRlciBsaW5rIGRlc2NyaXB0aW9uIGhlcmUnLFxuICBsaXRlbTogJ0xpc3QgaXRlbScsXG4gIG9saXN0OiAnTnVtYmVyZWQgTGlzdCA8b2w+IEN0cmwrTycsXG4gIHF1b3RlOiAnQmxvY2txdW90ZSA8YmxvY2txdW90ZT4gQ3RybCtRJyxcbiAgcXVvdGVleGFtcGxlOiAnQmxvY2txdW90ZScsXG4gIHJlZG86ICdSZWRvIC0gQ3RybCtZJyxcbiAgcmVkb21hYzogJ1JlZG8gLSBDdHJsK1NoaWZ0K1onLFxuICB1bGlzdDogJ0J1bGxldGVkIExpc3QgPHVsPiBDdHJsK1UnLFxuICB1bmRvOiAnVW5kbyAtIEN0cmwrWidcbn07XG5cbmZ1bmN0aW9uIEVkaXRvciAocG9zdGZpeCwgb3B0cykge1xuICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHsgLy9iYWNrd2FyZHMgY29tcGF0aWJsZSBiZWhhdmlvclxuICAgIG9wdGlvbnMgPSB7IGhlbHBCdXR0b246IG9wdGlvbnMgfTtcbiAgfVxuICBvcHRpb25zLnN0cmluZ3MgPSBvcHRpb25zLnN0cmluZ3MgfHwge307XG4gIGlmIChvcHRpb25zLmhlbHBCdXR0b24pIHtcbiAgICBvcHRpb25zLnN0cmluZ3MuaGVscCA9IG9wdGlvbnMuc3RyaW5ncy5oZWxwIHx8IG9wdGlvbnMuaGVscEJ1dHRvbi50aXRsZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRTdHJpbmcgKGlkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5zdHJpbmdzW2lkZW50aWZpZXJdIHx8IGRlZmF1bHRzU3RyaW5nc1tpZGVudGlmaWVyXTtcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGhvb2tzID0gc2VsZi5ob29rcyA9IG5ldyBIb29rQ29sbGVjdGlvbigpO1xuICB2YXIgcGFuZWxzO1xuXG4gIGhvb2tzLmFkZE5vb3AoJ29uUHJldmlld1JlZnJlc2gnKTtcbiAgaG9va3MuYWRkTm9vcCgncG9zdEJsb2NrcXVvdGVDcmVhdGlvbicpO1xuICBob29rcy5hZGRGYWxzZSgnaW5zZXJ0SW1hZ2VEaWFsb2cnKTtcblxuICBzZWxmLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocGFuZWxzKSB7XG4gICAgICByZXR1cm47IC8vIGFscmVhZHkgaW5pdGlhbGl6ZWRcbiAgICB9XG5cbiAgICBwYW5lbHMgPSBuZXcgUGFuZWxDb2xsZWN0aW9uKHBvc3RmaXgpO1xuXG4gICAgdmFyIGNvbW1hbmRNYW5hZ2VyID0gbmV3IENvbW1hbmRNYW5hZ2VyKGhvb2tzLCBnZXRTdHJpbmcpO1xuICAgIHZhciBwcmV2aWV3TWFuYWdlciA9IG5ldyBQcmV2aWV3TWFuYWdlcihwYW5lbHMsIGZ1bmN0aW9uICgpIHsgaG9va3Mub25QcmV2aWV3UmVmcmVzaCgpOyB9KTtcbiAgICB2YXIgdWlNYW5hZ2VyO1xuXG4gICAgdmFyIHVuZG9NYW5hZ2VyID0gbmV3IFVuZG9NYW5hZ2VyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHByZXZpZXdNYW5hZ2VyLnJlZnJlc2goKTtcbiAgICAgIGlmICh1aU1hbmFnZXIpIHsgLy8gbm90IGF2YWlsYWJsZSBvbiB0aGUgZmlyc3QgY2FsbFxuICAgICAgICB1aU1hbmFnZXIuc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcbiAgICAgIH1cbiAgICB9LCBwYW5lbHMpO1xuXG4gICAgdWlNYW5hZ2VyID0gbmV3IFVJTWFuYWdlcihwb3N0Zml4LCBwYW5lbHMsIHVuZG9NYW5hZ2VyLCBwcmV2aWV3TWFuYWdlciwgY29tbWFuZE1hbmFnZXIsIG9wdGlvbnMuaGVscEJ1dHRvbiwgZ2V0U3RyaW5nKTtcbiAgICB1aU1hbmFnZXIuc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcblxuICAgIHNlbGYucmVmcmVzaFByZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2aWV3TWFuYWdlci5yZWZyZXNoKHRydWUpO1xuICAgIH07XG4gICAgc2VsZi5yZWZyZXNoUHJldmlldygpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkaXRvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaWRlbnRpdHkgKHgpIHsgcmV0dXJuIHg7IH1cbmZ1bmN0aW9uIHJldHVybkZhbHNlICh4KSB7IHJldHVybiBmYWxzZTsgfVxuXG5mdW5jdGlvbiBIb29rQ29sbGVjdGlvbiAoKSB7XG59XG5cbkhvb2tDb2xsZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgY2hhaW46IGZ1bmN0aW9uIChuYW1lLCBmbikge1xuICAgIHZhciBvcmlnaW5hbCA9IHRoaXNbbmFtZV07XG4gICAgaWYgKCFvcmlnaW5hbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGhvb2sgJyArIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChvcmlnaW5hbCA9PT0gaWRlbnRpdHkpIHtcbiAgICAgIHRoaXNbbmFtZV0gPSBmbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1tuYW1lXSA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiBmbihvcmlnaW5hbCh4KSk7IH1cbiAgICB9XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gICAgaWYgKCF0aGlzW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gaG9vayAnICsgbmFtZSk7XG4gICAgfVxuICAgIHRoaXNbbmFtZV0gPSBmbjtcbiAgfSxcbiAgYWRkTm9vcDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aGlzW25hbWVdID0gaWRlbnRpdHk7XG4gIH0sXG4gIGFkZEZhbHNlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRoaXNbbmFtZV0gPSByZXR1cm5GYWxzZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb29rQ29sbGVjdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUGFuZWxDb2xsZWN0aW9uIChwb3N0Zml4KSB7XG4gIHRoaXMuYnV0dG9uQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Btay1idXR0b25zLScgKyBwb3N0Zml4KTtcbiAgdGhpcy5wcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Btay1wcmV2aWV3LScgKyBwb3N0Zml4KTtcbiAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbWstaW5wdXQtJyArIHBvc3RmaXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsQ29sbGVjdGlvbjtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG52YXIgcG9zaXRpb24gPSByZXF1aXJlKCcuL3Bvc2l0aW9uJyk7XG5cbmZ1bmN0aW9uIFByZXZpZXdNYW5hZ2VyIChwYW5lbHMsIHByZXZpZXdSZWZyZXNoQ2FsbGJhY2spIHtcbiAgdmFyIG1hbmFnZXJPYmogPSB0aGlzO1xuICB2YXIgdGltZW91dDtcbiAgdmFyIGVsYXBzZWRUaW1lO1xuICB2YXIgb2xkSW5wdXRUZXh0O1xuICB2YXIgbWF4RGVsYXkgPSAzMDAwO1xuICB2YXIgc3RhcnRUeXBlID0gJ2RlbGF5ZWQnOyAvLyBUaGUgb3RoZXIgbGVnYWwgdmFsdWUgaXMgJ21hbnVhbCdcblxuICAvLyBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byBlbGVtZW50c1xuICB2YXIgc2V0dXBFdmVudHMgPSBmdW5jdGlvbiAoaW5wdXRFbGVtLCBsaXN0ZW5lcikge1xuXG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEVsZW0sICdpbnB1dCcsIGxpc3RlbmVyKTtcbiAgICBpbnB1dEVsZW0ub25wYXN0ZSA9IGxpc3RlbmVyO1xuICAgIGlucHV0RWxlbS5vbmRyb3AgPSBsaXN0ZW5lcjtcblxuICAgIHV0aWwuYWRkRXZlbnQoaW5wdXRFbGVtLCAna2V5cHJlc3MnLCBsaXN0ZW5lcik7XG4gICAgdXRpbC5hZGRFdmVudChpbnB1dEVsZW0sICdrZXlkb3duJywgbGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBnZXREb2NTY3JvbGxUb3AgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcmVzdWx0ID0gMDtcblxuICAgIGlmICh3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgIHJlc3VsdCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICB9IGVsc2UgaWYgKGRvYy5kb2N1bWVudEVsZW1lbnQgJiYgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgIHJlc3VsdCA9IGRvYy5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jLmJvZHkpIHtcbiAgICAgIHJlc3VsdCA9IGRvYy5ib2R5LnNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBtYWtlUHJldmlld0h0bWwgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyByZWdpc3RlcmVkIHByZXZpZXcgcGFuZWxcbiAgICAvLyB0aGVyZSBpcyBub3RoaW5nIHRvIGRvLlxuICAgIGlmICghcGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdGV4dCA9IHBhbmVscy5pbnB1dC52YWx1ZTtcbiAgICBpZiAodGV4dCAmJiB0ZXh0ID09IG9sZElucHV0VGV4dCkge1xuICAgICAgcmV0dXJuOyAvLyBJbnB1dCB0ZXh0IGhhc24ndCBjaGFuZ2VkLlxuICAgIH0gZWxzZSB7XG4gICAgICBvbGRJbnB1dFRleHQgPSB0ZXh0O1xuICAgIH1cblxuICAgIHZhciBwcmV2VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgdGV4dCA9IHBhcnNlKHRleHQpO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBwcm9jZXNzaW5nIHRpbWUgb2YgdGhlIEhUTUwgY3JlYXRpb24uXG4gICAgLy8gSXQncyB1c2VkIGFzIHRoZSBkZWxheSB0aW1lIGluIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBlbGFwc2VkVGltZSA9IGN1cnJUaW1lIC0gcHJldlRpbWU7XG5cbiAgICBwdXNoUHJldmlld0h0bWwodGV4dCk7XG4gIH07XG5cbiAgLy8gc2V0VGltZW91dCBpcyBhbHJlYWR5IHVzZWQuICBVc2VkIGFzIGFuIGV2ZW50IGxpc3RlbmVyLlxuICB2YXIgYXBwbHlUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0VHlwZSAhPT0gJ21hbnVhbCcpIHtcblxuICAgICAgdmFyIGRlbGF5ID0gMDtcblxuICAgICAgaWYgKHN0YXJ0VHlwZSA9PT0gJ2RlbGF5ZWQnKSB7XG4gICAgICAgIGRlbGF5ID0gZWxhcHNlZFRpbWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWxheSA+IG1heERlbGF5KSB7XG4gICAgICAgIGRlbGF5ID0gbWF4RGVsYXk7XG4gICAgICB9XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChtYWtlUHJldmlld0h0bWwsIGRlbGF5KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldFNjYWxlRmFjdG9yID0gZnVuY3Rpb24gKHBhbmVsKSB7XG4gICAgaWYgKHBhbmVsLnNjcm9sbEhlaWdodCA8PSBwYW5lbC5jbGllbnRIZWlnaHQpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4gcGFuZWwuc2Nyb2xsVG9wIC8gKHBhbmVsLnNjcm9sbEhlaWdodCAtIHBhbmVsLmNsaWVudEhlaWdodCk7XG4gIH07XG5cbiAgdmFyIHNldFBhbmVsU2Nyb2xsVG9wcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAocGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHBhbmVscy5wcmV2aWV3LnNjcm9sbFRvcCA9IChwYW5lbHMucHJldmlldy5zY3JvbGxIZWlnaHQgLSBwYW5lbHMucHJldmlldy5jbGllbnRIZWlnaHQpICogZ2V0U2NhbGVGYWN0b3IocGFuZWxzLnByZXZpZXcpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAocmVxdWlyZXNSZWZyZXNoKSB7XG5cbiAgICBpZiAocmVxdWlyZXNSZWZyZXNoKSB7XG4gICAgICBvbGRJbnB1dFRleHQgPSAnJztcbiAgICAgIG1ha2VQcmV2aWV3SHRtbCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFwcGx5VGltZW91dCgpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnByb2Nlc3NpbmdUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBlbGFwc2VkVGltZTtcbiAgfTtcblxuICB2YXIgaXNGaXJzdFRpbWVGaWxsZWQgPSB0cnVlO1xuXG4gIC8vIElFIGRvZXNuJ3QgbGV0IHlvdSB1c2UgaW5uZXJIVE1MIGlmIHRoZSBlbGVtZW50IGlzIGNvbnRhaW5lZCBzb21ld2hlcmUgaW4gYSB0YWJsZVxuICAvLyAod2hpY2ggaXMgdGhlIGNhc2UgZm9yIGlubGluZSBlZGl0aW5nKSAtLSBpbiB0aGF0IGNhc2UsIGRldGFjaCB0aGUgZWxlbWVudCwgc2V0IHRoZVxuICAvLyB2YWx1ZSwgYW5kIHJlYXR0YWNoLiBZZXMsIHRoYXQgKmlzKiByaWRpY3Vsb3VzLlxuICB2YXIgaWVTYWZlUHJldmlld1NldCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgdmFyIHByZXZpZXcgPSBwYW5lbHMucHJldmlldztcbiAgICB2YXIgcGFyZW50ID0gcHJldmlldy5wYXJlbnROb2RlO1xuICAgIHZhciBzaWJsaW5nID0gcHJldmlldy5uZXh0U2libGluZztcbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocHJldmlldyk7XG4gICAgcHJldmlldy5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIGlmICghc2libGluZylcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChwcmV2aWV3KTtcbiAgICBlbHNlXG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHByZXZpZXcsIHNpYmxpbmcpO1xuICB9XG5cbiAgdmFyIG5vblN1Y2t5QnJvd3NlclByZXZpZXdTZXQgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIHBhbmVscy5wcmV2aWV3LmlubmVySFRNTCA9IHRleHQ7XG4gIH1cblxuICB2YXIgcHJldmlld1NldHRlcjtcblxuICB2YXIgcHJldmlld1NldCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgaWYgKHByZXZpZXdTZXR0ZXIpXG4gICAgICByZXR1cm4gcHJldmlld1NldHRlcih0ZXh0KTtcblxuICAgIHRyeSB7XG4gICAgICBub25TdWNreUJyb3dzZXJQcmV2aWV3U2V0KHRleHQpO1xuICAgICAgcHJldmlld1NldHRlciA9IG5vblN1Y2t5QnJvd3NlclByZXZpZXdTZXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcHJldmlld1NldHRlciA9IGllU2FmZVByZXZpZXdTZXQ7XG4gICAgICBwcmV2aWV3U2V0dGVyKHRleHQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcHVzaFByZXZpZXdIdG1sID0gZnVuY3Rpb24gKHRleHQpIHtcblxuICAgIHZhciBlbXB0eVRvcCA9IHBvc2l0aW9uLmdldFRvcChwYW5lbHMuaW5wdXQpIC0gZ2V0RG9jU2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAocGFuZWxzLnByZXZpZXcpIHtcbiAgICAgIHByZXZpZXdTZXQodGV4dCk7XG4gICAgICBwcmV2aWV3UmVmcmVzaENhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgc2V0UGFuZWxTY3JvbGxUb3BzKCk7XG5cbiAgICBpZiAoaXNGaXJzdFRpbWVGaWxsZWQpIHtcbiAgICAgIGlzRmlyc3RUaW1lRmlsbGVkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZ1bGxUb3AgPSBwb3NpdGlvbi5nZXRUb3AocGFuZWxzLmlucHV0KSAtIGdldERvY1Njcm9sbFRvcCgpO1xuXG4gICAgaWYgKHVhLmlzSUUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgZnVsbFRvcCAtIGVtcHR5VG9wKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCBmdWxsVG9wIC0gZW1wdHlUb3ApO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHNldHVwRXZlbnRzKHBhbmVscy5pbnB1dCwgYXBwbHlUaW1lb3V0KTtcbiAgICBtYWtlUHJldmlld0h0bWwoKTtcblxuICAgIGlmIChwYW5lbHMucHJldmlldykge1xuICAgICAgcGFuZWxzLnByZXZpZXcuc2Nyb2xsVG9wID0gMDtcbiAgICB9XG4gIH07XG5cbiAgaW5pdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aWV3TWFuYWdlcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5mdW5jdGlvbiBUZXh0YXJlYVN0YXRlIChwYW5lbHMsIGlzSW5pdGlhbFN0YXRlKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGlucHV0ID0gcGFuZWxzLmlucHV0O1xuXG4gIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXV0aWwuaXNWaXNpYmxlKGlucHV0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWlzSW5pdGlhbFN0YXRlICYmIGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBpbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuc2V0SW5wdXRTZWxlY3Rpb25TdGFydEVuZCgpO1xuICAgIHNlbGYuc2Nyb2xsVG9wID0gaW5wdXQuc2Nyb2xsVG9wO1xuICAgIGlmICghc2VsZi50ZXh0ICYmIGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IGlucHV0LnNlbGVjdGlvblN0YXJ0ID09PSAwKSB7XG4gICAgICBzZWxmLnRleHQgPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBzZWxmLnNldElucHV0U2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdXRpbC5pc1Zpc2libGUoaW5wdXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlucHV0LnNlbGVjdGlvblN0YXJ0ICE9PSB2b2lkIDAgJiYgIXVhLmlzT3BlcmEpIHtcbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICBpbnB1dC5zZWxlY3Rpb25TdGFydCA9IHNlbGYuc3RhcnQ7XG4gICAgICBpbnB1dC5zZWxlY3Rpb25FbmQgPSBzZWxmLmVuZDtcbiAgICAgIGlucHV0LnNjcm9sbFRvcCA9IHNlbGYuc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jLnNlbGVjdGlvbikge1xuICAgICAgaWYgKGRvYy5hY3RpdmVFbGVtZW50ICYmIGRvYy5hY3RpdmVFbGVtZW50ICE9PSBpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICB2YXIgcmFuZ2UgPSBpbnB1dC5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgLWlucHV0LnZhbHVlLmxlbmd0aCk7XG4gICAgICByYW5nZS5tb3ZlRW5kKCdjaGFyYWN0ZXInLCAtaW5wdXQudmFsdWUubGVuZ3RoKTtcbiAgICAgIHJhbmdlLm1vdmVFbmQoJ2NoYXJhY3RlcicsIHNlbGYuZW5kKTtcbiAgICAgIHJhbmdlLm1vdmVTdGFydCgnY2hhcmFjdGVyJywgc2VsZi5zdGFydCk7XG4gICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvblN0YXJ0RW5kID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghcGFuZWxzLmllQ2FjaGVkUmFuZ2UgJiYgKGlucHV0LnNlbGVjdGlvblN0YXJ0IHx8IGlucHV0LnNlbGVjdGlvblN0YXJ0ID09PSAwKSkge1xuICAgICAgc2VsZi5zdGFydCA9IGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgc2VsZi5lbmQgPSBpbnB1dC5zZWxlY3Rpb25FbmQ7XG4gICAgfSBlbHNlIGlmIChkb2Muc2VsZWN0aW9uKSB7XG4gICAgICBzZWxmLnRleHQgPSB1dGlsLmZpeEVvbENoYXJzKGlucHV0LnZhbHVlKTtcblxuICAgICAgdmFyIHJhbmdlID0gcGFuZWxzLmllQ2FjaGVkUmFuZ2UgfHwgZG9jLnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgdmFyIGZpeGVkUmFuZ2UgPSB1dGlsLmZpeEVvbENoYXJzKHJhbmdlLnRleHQpO1xuICAgICAgdmFyIG1hcmtlciA9ICdcXHgwNyc7XG4gICAgICB2YXIgbWFya2VkUmFuZ2UgPSBtYXJrZXIgKyBmaXhlZFJhbmdlICsgbWFya2VyO1xuICAgICAgcmFuZ2UudGV4dCA9IG1hcmtlZFJhbmdlO1xuICAgICAgdmFyIGlucHV0VGV4dCA9IHV0aWwuZml4RW9sQ2hhcnMoaW5wdXQudmFsdWUpO1xuXG4gICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1tYXJrZWRSYW5nZS5sZW5ndGgpO1xuICAgICAgcmFuZ2UudGV4dCA9IGZpeGVkUmFuZ2U7XG5cbiAgICAgIHNlbGYuc3RhcnQgPSBpbnB1dFRleHQuaW5kZXhPZihtYXJrZXIpO1xuICAgICAgc2VsZi5lbmQgPSBpbnB1dFRleHQubGFzdEluZGV4T2YobWFya2VyKSAtIG1hcmtlci5sZW5ndGg7XG5cbiAgICAgIHZhciBsZW4gPSBzZWxmLnRleHQubGVuZ3RoIC0gdXRpbC5maXhFb2xDaGFycyhpbnB1dC52YWx1ZSkubGVuZ3RoO1xuICAgICAgaWYgKGxlbikge1xuICAgICAgICByYW5nZS5tb3ZlU3RhcnQoJ2NoYXJhY3RlcicsIC1maXhlZFJhbmdlLmxlbmd0aCk7XG4gICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgIGZpeGVkUmFuZ2UgKz0gJ1xcbic7XG4gICAgICAgICAgc2VsZi5lbmQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByYW5nZS50ZXh0ID0gZml4ZWRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhbmVscy5pZUNhY2hlZFJhbmdlKSB7XG4gICAgICAgIHNlbGYuc2Nyb2xsVG9wID0gcGFuZWxzLmllQ2FjaGVkU2Nyb2xsVG9wO1xuICAgICAgfVxuICAgICAgcGFuZWxzLmllQ2FjaGVkUmFuZ2UgPSBudWxsO1xuICAgICAgc2VsZi5zZXRJbnB1dFNlbGVjdGlvbigpO1xuICAgIH1cbiAgfTtcblxuIHNlbGYucmVzdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi50ZXh0ICE9IHZvaWQgMCAmJiBzZWxmLnRleHQgIT0gaW5wdXQudmFsdWUpIHtcbiAgICAgIGlucHV0LnZhbHVlID0gc2VsZi50ZXh0O1xuICAgIH1cbiAgICBzZWxmLnNldElucHV0U2VsZWN0aW9uKCk7XG4gICAgaW5wdXQuc2Nyb2xsVG9wID0gc2VsZi5zY3JvbGxUb3A7XG4gIH07XG5cbiAgc2VsZi5nZXRDaHVua3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNodW5rID0gbmV3IENodW5rcygpO1xuICAgIGNodW5rLmJlZm9yZSA9IHV0aWwuZml4RW9sQ2hhcnMoc2VsZi50ZXh0LnN1YnN0cmluZygwLCBzZWxmLnN0YXJ0KSk7XG4gICAgY2h1bmsuc3RhcnRUYWcgPSAnJztcbiAgICBjaHVuay5zZWxlY3Rpb24gPSB1dGlsLmZpeEVvbENoYXJzKHNlbGYudGV4dC5zdWJzdHJpbmcoc2VsZi5zdGFydCwgc2VsZi5lbmQpKTtcbiAgICBjaHVuay5lbmRUYWcgPSAnJztcbiAgICBjaHVuay5hZnRlciA9IHV0aWwuZml4RW9sQ2hhcnMoc2VsZi50ZXh0LnN1YnN0cmluZyhzZWxmLmVuZCkpO1xuICAgIGNodW5rLnNjcm9sbFRvcCA9IHNlbGYuc2Nyb2xsVG9wO1xuICAgIHJldHVybiBjaHVuaztcbiAgfTtcblxuICBzZWxmLnNldENodW5rcyA9IGZ1bmN0aW9uIChjaHVuaykge1xuICAgIGNodW5rLmJlZm9yZSA9IGNodW5rLmJlZm9yZSArIGNodW5rLnN0YXJ0VGFnO1xuICAgIGNodW5rLmFmdGVyID0gY2h1bmsuZW5kVGFnICsgY2h1bmsuYWZ0ZXI7XG4gICAgc2VsZi5zdGFydCA9IGNodW5rLmJlZm9yZS5sZW5ndGg7XG4gICAgc2VsZi5lbmQgPSBjaHVuay5iZWZvcmUubGVuZ3RoICsgY2h1bmsuc2VsZWN0aW9uLmxlbmd0aDtcbiAgICBzZWxmLnRleHQgPSBjaHVuay5iZWZvcmUgKyBjaHVuay5zZWxlY3Rpb24gKyBjaHVuay5hZnRlcjtcbiAgICBzZWxmLnNjcm9sbFRvcCA9IGNodW5rLnNjcm9sbFRvcDtcbiAgfTtcblxuICBzZWxmLmluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dGFyZWFTdGF0ZTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgdWEgPSByZXF1aXJlKCcuL3VhJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIFRleHRhcmVhU3RhdGUgPSByZXF1aXJlKCcuL1RleHRhcmVhU3RhdGUnKTtcblxuZnVuY3Rpb24gVUlNYW5hZ2VyIChwb3N0Zml4LCBwYW5lbHMsIHVuZG9NYW5hZ2VyLCBwcmV2aWV3TWFuYWdlciwgY29tbWFuZE1hbmFnZXIsIGhlbHBPcHRpb25zLCBnZXRTdHJpbmcpIHtcbiAgdmFyIGlucHV0Qm94ID0gcGFuZWxzLmlucHV0O1xuICB2YXIgYnV0dG9ucyA9IHt9O1xuXG4gIG1ha2VTcHJpdGVkQnV0dG9uUm93KCk7XG5cbiAgdmFyIGtleUV2ZW50ID0gJ2tleWRvd24nO1xuICBpZiAodWEuaXNPcGVyYSkge1xuICAgIGtleUV2ZW50ID0gJ2tleXByZXNzJztcbiAgfVxuXG4gIHV0aWwuYWRkRXZlbnQoaW5wdXRCb3gsIGtleUV2ZW50LCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCgha2V5LmN0cmxLZXkgJiYgIWtleS5tZXRhS2V5KSB8fCBrZXkuYWx0S2V5IHx8IGtleS5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBrZXlDb2RlID0ga2V5LmNoYXJDb2RlIHx8IGtleS5rZXlDb2RlO1xuICAgIHZhciBrZXlDb2RlU3RyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgc3dpdGNoIChrZXlDb2RlU3RyKSB7XG4gICAgICBjYXNlICdiJzogZG9DbGljayhidXR0b25zLmJvbGQpOyBicmVhaztcbiAgICAgIGNhc2UgJ2knOiBkb0NsaWNrKGJ1dHRvbnMuaXRhbGljKTsgYnJlYWs7XG4gICAgICBjYXNlICdsJzogZG9DbGljayhidXR0b25zLmxpbmspOyBicmVhaztcbiAgICAgIGNhc2UgJ3EnOiBkb0NsaWNrKGJ1dHRvbnMucXVvdGUpOyBicmVhaztcbiAgICAgIGNhc2UgJ2snOiBkb0NsaWNrKGJ1dHRvbnMuY29kZSk7IGJyZWFrO1xuICAgICAgY2FzZSAnZyc6IGRvQ2xpY2soYnV0dG9ucy5pbWFnZSk7IGJyZWFrO1xuICAgICAgY2FzZSAnbyc6IGRvQ2xpY2soYnV0dG9ucy5vbGlzdCk7IGJyZWFrO1xuICAgICAgY2FzZSAndSc6IGRvQ2xpY2soYnV0dG9ucy51bGlzdCk7IGJyZWFrO1xuICAgICAgY2FzZSAnaCc6IGRvQ2xpY2soYnV0dG9ucy5oZWFkaW5nKTsgYnJlYWs7XG4gICAgICBjYXNlICdyJzogZG9DbGljayhidXR0b25zLmhyKTsgYnJlYWs7XG4gICAgICBjYXNlICd5JzogZG9DbGljayhidXR0b25zLnJlZG8pOyBicmVhaztcbiAgICAgIGNhc2UgJ3onOlxuICAgICAgICBpZiAoa2V5LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgZG9DbGljayhidXR0b25zLnJlZG8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRvQ2xpY2soYnV0dG9ucy51bmRvKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoa2V5LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBrZXkucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5ldmVudCkge1xuICAgICAgd2luZG93LmV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICB1dGlsLmFkZEV2ZW50KGlucHV0Qm94LCAna2V5dXAnLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKGtleS5zaGlmdEtleSAmJiAha2V5LmN0cmxLZXkgJiYgIWtleS5tZXRhS2V5KSB7XG4gICAgICB2YXIga2V5Q29kZSA9IGtleS5jaGFyQ29kZSB8fCBrZXkua2V5Q29kZTtcblxuICAgICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHZhciBmYWtlQnV0dG9uID0ge307XG4gICAgICAgIGZha2VCdXR0b24udGV4dE9wID0gYmluZENvbW1hbmQoJ2RvQXV0b2luZGVudCcpO1xuICAgICAgICBkb0NsaWNrKGZha2VCdXR0b24pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHVhLmlzSUUpIHtcbiAgICB1dGlsLmFkZEV2ZW50KGlucHV0Qm94LCAna2V5ZG93bicsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjb2RlID0ga2V5LmtleUNvZGU7XG4gICAgICBpZiAoY29kZSA9PT0gMjcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBmdW5jdGlvbiBkb0NsaWNrIChidXR0b24pIHtcbiAgICBpbnB1dEJveC5mb2N1cygpO1xuXG4gICAgaWYgKGJ1dHRvbi50ZXh0T3ApIHtcbiAgICAgIGlmICh1bmRvTWFuYWdlcikge1xuICAgICAgICB1bmRvTWFuYWdlci5zZXRDb21tYW5kTW9kZSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGUgPSBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMpO1xuXG4gICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNodW5rcyA9IHN0YXRlLmdldENodW5rcygpO1xuICAgICAgdmFyIG5vQ2xlYW51cCA9IGJ1dHRvbi50ZXh0T3AoY2h1bmtzLCBmaXh1cElucHV0QXJlYSk7XG5cbiAgICAgIGlmICghbm9DbGVhbnVwKSB7XG4gICAgICAgIGZpeHVwSW5wdXRBcmVhKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChidXR0b24uZXhlY3V0ZSkge1xuICAgICAgYnV0dG9uLmV4ZWN1dGUodW5kb01hbmFnZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpeHVwSW5wdXRBcmVhICgpIHtcbiAgICAgIGlucHV0Qm94LmZvY3VzKCk7XG5cbiAgICAgIGlmIChjaHVua3MpIHtcbiAgICAgICAgc3RhdGUuc2V0Q2h1bmtzKGNodW5rcyk7XG4gICAgICB9XG4gICAgICBzdGF0ZS5yZXN0b3JlKCk7XG4gICAgICBwcmV2aWV3TWFuYWdlci5yZWZyZXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldHVwQnV0dG9uIChidXR0b24sIGlzRW5hYmxlZCkge1xuICAgIHZhciBub3JtYWxZU2hpZnQgPSAnMHB4JztcbiAgICB2YXIgZGlzYWJsZWRZU2hpZnQgPSAnLTIwcHgnO1xuICAgIHZhciBoaWdobGlnaHRZU2hpZnQgPSAnLTQwcHgnO1xuICAgIHZhciBpbWFnZSA9IGJ1dHRvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3BhbicpWzBdO1xuICAgIGlmIChpc0VuYWJsZWQpIHtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gdGhpcy5YU2hpZnQgKyAnICcgKyBoaWdobGlnaHRZU2hpZnQ7XG4gICAgICB9O1xuICAgICAgYnV0dG9uLm9ubW91c2VvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGltYWdlLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IHRoaXMuWFNoaWZ0ICsgJyAnICsgbm9ybWFsWVNoaWZ0O1xuICAgICAgfTtcbiAgICAgIGJ1dHRvbi5vbm1vdXNlb3V0KCk7XG5cbiAgICAgIGlmICh1YS5pc0lFKSB7XG4gICAgICAgIGJ1dHRvbi5vbm1vdXNlZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZG9jLmFjdGl2ZUVsZW1lbnQgJiYgZG9jLmFjdGl2ZUVsZW1lbnQgIT09IHBhbmVscy5pbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYW5lbHMuaWVDYWNoZWRSYW5nZSA9IGRvY3VtZW50LnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgIHBhbmVscy5pZUNhY2hlZFNjcm9sbFRvcCA9IHBhbmVscy5pbnB1dC5zY3JvbGxUb3A7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICghYnV0dG9uLmlzSGVscCkge1xuICAgICAgICBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vbm1vdXNlb3V0KSB7XG4gICAgICAgICAgICB0aGlzLm9ubW91c2VvdXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9DbGljayh0aGlzKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW1hZ2Uuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gYnV0dG9uLlhTaGlmdCArICcgJyArIGRpc2FibGVkWVNoaWZ0O1xuICAgICAgYnV0dG9uLm9ubW91c2VvdmVyID0gYnV0dG9uLm9ubW91c2VvdXQgPSBidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kQ29tbWFuZCAobWV0aG9kKSB7XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXRob2QgPSBjb21tYW5kTWFuYWdlclttZXRob2RdO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgbWV0aG9kLmFwcGx5KGNvbW1hbmRNYW5hZ2VyLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU3ByaXRlZEJ1dHRvblJvdyAoKSB7XG4gICAgdmFyIGJ1dHRvbkJhciA9IHBhbmVscy5idXR0b25CYXI7XG4gICAgdmFyIG5vcm1hbFlTaGlmdCA9ICcwcHgnO1xuICAgIHZhciBkaXNhYmxlZFlTaGlmdCA9ICctMjBweCc7XG4gICAgdmFyIGhpZ2hsaWdodFlTaGlmdCA9ICctNDBweCc7XG5cbiAgICB2YXIgYnV0dG9uUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBidXR0b25Sb3cuaWQgPSAncG1rLWJ1dHRvbi1yb3ctJyArIHBvc3RmaXg7XG4gICAgYnV0dG9uUm93LmNsYXNzTmFtZSA9ICdwbWstYnV0dG9uLXJvdyc7XG4gICAgYnV0dG9uUm93ID0gYnV0dG9uQmFyLmFwcGVuZENoaWxkKGJ1dHRvblJvdyk7XG4gICAgdmFyIHhQb3NpdGlvbiA9IDA7XG5cbiAgICBmdW5jdGlvbiBtYWtlQnV0dG9uIChpZCwgdGl0bGUsIFhTaGlmdCwgdGV4dE9wKSB7XG4gICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbiAnICsgaWQ7XG4gICAgICBidXR0b24uc3R5bGUubGVmdCA9IHhQb3NpdGlvbiArICdweCc7XG4gICAgICB4UG9zaXRpb24gKz0gMjU7XG4gICAgICB2YXIgYnV0dG9uSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBidXR0b24uaWQgPSBpZCArICctJyArIHBvc3RmaXg7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoYnV0dG9uSW1hZ2UpO1xuICAgICAgYnV0dG9uLnRpdGxlID0gdGl0bGU7XG4gICAgICBidXR0b24uWFNoaWZ0ID0gWFNoaWZ0O1xuICAgICAgaWYgKHRleHRPcCkge1xuICAgICAgICBidXR0b24udGV4dE9wID0gdGV4dE9wO1xuICAgICAgfVxuICAgICAgc2V0dXBCdXR0b24oYnV0dG9uLCB0cnVlKTtcbiAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlU3BhY2VyIChudW0pIHtcbiAgICAgIHZhciBzcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgc3BhY2VyLmNsYXNzTmFtZSA9ICdwbWstc3BhY2VyIHBtay1zcGFjZXItJyArIG51bTtcbiAgICAgIHNwYWNlci5pZCA9ICdwbWstc3BhY2VyLScgKyBwb3N0Zml4ICsgJy0nICsgbnVtO1xuICAgICAgYnV0dG9uUm93LmFwcGVuZENoaWxkKHNwYWNlcik7XG4gICAgICB4UG9zaXRpb24gKz0gMjU7XG4gICAgfVxuXG4gICAgYnV0dG9ucy5ib2xkID0gbWFrZUJ1dHRvbigncG1rLWJvbGQtYnV0dG9uJywgZ2V0U3RyaW5nKCdib2xkJyksICcwcHgnLCBiaW5kQ29tbWFuZCgnZG9Cb2xkJykpO1xuICAgIGJ1dHRvbnMuaXRhbGljID0gbWFrZUJ1dHRvbigncG1rLWl0YWxpYy1idXR0b24nLCBnZXRTdHJpbmcoJ2l0YWxpYycpLCAnLTIwcHgnLCBiaW5kQ29tbWFuZCgnZG9JdGFsaWMnKSk7XG4gICAgbWFrZVNwYWNlcigxKTtcbiAgICBidXR0b25zLmxpbmsgPSBtYWtlQnV0dG9uKCdwbWstbGluay1idXR0b24nLCBnZXRTdHJpbmcoJ2xpbmsnKSwgJy00MHB4JywgYmluZENvbW1hbmQoZnVuY3Rpb24gKGNodW5rLCBwb3N0UHJvY2Vzc2luZykge1xuICAgICAgcmV0dXJuIHRoaXMuZG9MaW5rT3JJbWFnZShjaHVuaywgcG9zdFByb2Nlc3NpbmcsIGZhbHNlKTtcbiAgICB9KSk7XG4gICAgYnV0dG9ucy5xdW90ZSA9IG1ha2VCdXR0b24oJ3Btay1xdW90ZS1idXR0b24nLCBnZXRTdHJpbmcoJ3F1b3RlJyksICctNjBweCcsIGJpbmRDb21tYW5kKCdkb0Jsb2NrcXVvdGUnKSk7XG4gICAgYnV0dG9ucy5jb2RlID0gbWFrZUJ1dHRvbigncG1rLWNvZGUtYnV0dG9uJywgZ2V0U3RyaW5nKCdjb2RlJyksICctODBweCcsIGJpbmRDb21tYW5kKCdkb0NvZGUnKSk7XG4gICAgYnV0dG9ucy5pbWFnZSA9IG1ha2VCdXR0b24oJ3Btay1pbWFnZS1idXR0b24nLCBnZXRTdHJpbmcoJ2ltYWdlJyksICctMTAwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0xpbmtPckltYWdlKGNodW5rLCBwb3N0UHJvY2Vzc2luZywgdHJ1ZSk7XG4gICAgfSkpO1xuICAgIG1ha2VTcGFjZXIoMik7XG4gICAgYnV0dG9ucy5vbGlzdCA9IG1ha2VCdXR0b24oJ3Btay1vbGlzdC1idXR0b24nLCBnZXRTdHJpbmcoJ29saXN0JyksICctMTIwcHgnLCBiaW5kQ29tbWFuZChmdW5jdGlvbiAoY2h1bmssIHBvc3RQcm9jZXNzaW5nKSB7XG4gICAgICB0aGlzLmRvTGlzdChjaHVuaywgcG9zdFByb2Nlc3NpbmcsIHRydWUpO1xuICAgIH0pKTtcbiAgICBidXR0b25zLnVsaXN0ID0gbWFrZUJ1dHRvbigncG1rLXVsaXN0LWJ1dHRvbicsIGdldFN0cmluZygndWxpc3QnKSwgJy0xNDBweCcsIGJpbmRDb21tYW5kKGZ1bmN0aW9uIChjaHVuaywgcG9zdFByb2Nlc3NpbmcpIHtcbiAgICAgIHRoaXMuZG9MaXN0KGNodW5rLCBwb3N0UHJvY2Vzc2luZywgZmFsc2UpO1xuICAgIH0pKTtcbiAgICBidXR0b25zLmhlYWRpbmcgPSBtYWtlQnV0dG9uKCdwbWstaGVhZGluZy1idXR0b24nLCBnZXRTdHJpbmcoJ2hlYWRpbmcnKSwgJy0xNjBweCcsIGJpbmRDb21tYW5kKCdkb0hlYWRpbmcnKSk7XG4gICAgYnV0dG9ucy5ociA9IG1ha2VCdXR0b24oJ3Btay1oci1idXR0b24nLCBnZXRTdHJpbmcoJ2hyJyksICctMTgwcHgnLCBiaW5kQ29tbWFuZCgnZG9Ib3Jpem9udGFsUnVsZScpKTtcbiAgICBtYWtlU3BhY2VyKDMpO1xuICAgIGJ1dHRvbnMudW5kbyA9IG1ha2VCdXR0b24oJ3Btay11bmRvLWJ1dHRvbicsIGdldFN0cmluZygndW5kbycpLCAnLTIwMHB4JywgbnVsbCk7XG4gICAgYnV0dG9ucy51bmRvLmV4ZWN1dGUgPSBmdW5jdGlvbiAobWFuYWdlcikge1xuICAgICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgbWFuYWdlci51bmRvKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZWRvVGl0bGUgPSBnZXRTdHJpbmcodWEuaXNXaWRub3dzID8gJ3JlZG8nIDogJ3JlZG9tYWMnKTtcblxuICAgIGJ1dHRvbnMucmVkbyA9IG1ha2VCdXR0b24oJ3Btay1yZWRvLWJ1dHRvbicsIHJlZG9UaXRsZSwgJy0yMjBweCcsIG51bGwpO1xuICAgIGJ1dHRvbnMucmVkby5leGVjdXRlID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgIGlmIChtYW5hZ2VyKSB7XG4gICAgICAgIG1hbmFnZXIucmVkbygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoaGVscE9wdGlvbnMpIHtcbiAgICAgIHZhciBoZWxwQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHZhciBoZWxwQnV0dG9uSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBoZWxwQnV0dG9uLmFwcGVuZENoaWxkKGhlbHBCdXR0b25JbWFnZSk7XG4gICAgICBoZWxwQnV0dG9uLmNsYXNzTmFtZSA9ICdwbWstYnV0dG9uIHBtay1oZWxwLWJ1dHRvbic7XG4gICAgICBoZWxwQnV0dG9uLmlkID0gJ3Btay1oZWxwLWJ1dHRvbi0nICsgcG9zdGZpeDtcbiAgICAgIGhlbHBCdXR0b24uWFNoaWZ0ID0gJy0yNDBweCc7XG4gICAgICBoZWxwQnV0dG9uLmlzSGVscCA9IHRydWU7XG4gICAgICBoZWxwQnV0dG9uLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICBoZWxwQnV0dG9uLnRpdGxlID0gZ2V0U3RyaW5nKCdoZWxwJyk7XG4gICAgICBoZWxwQnV0dG9uLm9uY2xpY2sgPSBoZWxwT3B0aW9ucy5oYW5kbGVyO1xuXG4gICAgICBzZXR1cEJ1dHRvbihoZWxwQnV0dG9uLCB0cnVlKTtcbiAgICAgIGJ1dHRvblJvdy5hcHBlbmRDaGlsZChoZWxwQnV0dG9uKTtcbiAgICAgIGJ1dHRvbnMuaGVscCA9IGhlbHBCdXR0b247XG4gICAgfVxuXG4gICAgc2V0VW5kb1JlZG9CdXR0b25TdGF0ZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFVuZG9SZWRvQnV0dG9uU3RhdGVzICgpIHtcbiAgICBpZiAodW5kb01hbmFnZXIpIHtcbiAgICAgIHNldHVwQnV0dG9uKGJ1dHRvbnMudW5kbywgdW5kb01hbmFnZXIuY2FuVW5kbygpKTtcbiAgICAgIHNldHVwQnV0dG9uKGJ1dHRvbnMucmVkbywgdW5kb01hbmFnZXIuY2FuUmVkbygpKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5zZXRVbmRvUmVkb0J1dHRvblN0YXRlcyA9IHNldFVuZG9SZWRvQnV0dG9uU3RhdGVzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJTWFuYWdlcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1YSA9IHJlcXVpcmUoJy4vdWEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgVGV4dGFyZWFTdGF0ZSA9IHJlcXVpcmUoJy4vVGV4dGFyZWFTdGF0ZScpO1xuXG5mdW5jdGlvbiBVbmRvTWFuYWdlciAoY2FsbGJhY2ssIHBhbmVscykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB1bmRvU3RhY2sgPSBbXTtcbiAgdmFyIHN0YWNrUHRyID0gMDtcbiAgdmFyIG1vZGUgPSAnbm9uZSc7XG4gIHZhciBsYXN0U3RhdGU7XG4gIHZhciB0aW1lcjtcbiAgdmFyIGlucHV0U3RhdGU7XG5cbiAgZnVuY3Rpb24gc2V0TW9kZSAobmV3TW9kZSwgbm9TYXZlKSB7XG4gICAgaWYgKG1vZGUgIT0gbmV3TW9kZSkge1xuICAgICAgbW9kZSA9IG5ld01vZGU7XG4gICAgICBpZiAoIW5vU2F2ZSkge1xuICAgICAgICBzYXZlU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXVhLmlzSUUgfHwgbW9kZSAhPSAnbW92aW5nJykge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KHJlZnJlc2hTdGF0ZSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0U3RhdGUgPSBudWxsO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiByZWZyZXNoU3RhdGUgKGlzSW5pdGlhbFN0YXRlKSB7XG4gICAgaW5wdXRTdGF0ZSA9IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscywgaXNJbml0aWFsU3RhdGUpO1xuICAgIHRpbWVyID0gdm9pZCAwO1xuICB9XG5cbiAgc2VsZi5zZXRDb21tYW5kTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBtb2RlID0gJ2NvbW1hbmQnO1xuICAgIHNhdmVTdGF0ZSgpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dChyZWZyZXNoU3RhdGUsIDApO1xuICB9O1xuXG4gIHNlbGYuY2FuVW5kbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc3RhY2tQdHIgPiAxO1xuICB9O1xuXG4gIHNlbGYuY2FuUmVkbyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdW5kb1N0YWNrW3N0YWNrUHRyICsgMV07XG4gIH07XG5cbiAgc2VsZi51bmRvID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLmNhblVuZG8oKSkge1xuICAgICAgaWYgKGxhc3RTdGF0ZSkge1xuICAgICAgICBsYXN0U3RhdGUucmVzdG9yZSgpO1xuICAgICAgICBsYXN0U3RhdGUgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5kb1N0YWNrW3N0YWNrUHRyXSA9IG5ldyBUZXh0YXJlYVN0YXRlKHBhbmVscyk7XG4gICAgICAgIHVuZG9TdGFja1stLXN0YWNrUHRyXS5yZXN0b3JlKCk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBtb2RlID0gJ25vbmUnO1xuICAgIHBhbmVscy5pbnB1dC5mb2N1cygpO1xuICAgIHJlZnJlc2hTdGF0ZSgpO1xuICB9O1xuXG4gIHNlbGYucmVkbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi5jYW5SZWRvKCkpIHtcbiAgICAgIHVuZG9TdGFja1srK3N0YWNrUHRyXS5yZXN0b3JlKCk7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1vZGUgPSAnbm9uZSc7XG4gICAgcGFuZWxzLmlucHV0LmZvY3VzKCk7XG4gICAgcmVmcmVzaFN0YXRlKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2F2ZVN0YXRlICgpIHtcbiAgICB2YXIgY3VyclN0YXRlID0gaW5wdXRTdGF0ZSB8fCBuZXcgVGV4dGFyZWFTdGF0ZShwYW5lbHMpO1xuXG4gICAgaWYgKCFjdXJyU3RhdGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT0gJ21vdmluZycpIHtcbiAgICAgIGlmICghbGFzdFN0YXRlKSB7XG4gICAgICAgIGxhc3RTdGF0ZSA9IGN1cnJTdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxhc3RTdGF0ZSkge1xuICAgICAgaWYgKHVuZG9TdGFja1tzdGFja1B0ciAtIDFdLnRleHQgIT0gbGFzdFN0YXRlLnRleHQpIHtcbiAgICAgICAgdW5kb1N0YWNrW3N0YWNrUHRyKytdID0gbGFzdFN0YXRlO1xuICAgICAgfVxuICAgICAgbGFzdFN0YXRlID0gbnVsbDtcbiAgICB9XG4gICAgdW5kb1N0YWNrW3N0YWNrUHRyKytdID0gY3VyclN0YXRlO1xuICAgIHVuZG9TdGFja1tzdGFja1B0ciArIDFdID0gbnVsbDtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJldmVudEN0cmxZWiAoZXZlbnQpIHtcbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgdmFyIHl6ID0ga2V5Q29kZSA9PSA4OSB8fCBrZXlDb2RlID09IDkwO1xuICAgIHZhciBjdHJsID0gZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5O1xuICAgIGlmIChjdHJsICYmIHl6KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDdHJsWVogKGV2ZW50KSB7XG4gICAgdmFyIGhhbmRsZWQgPSBmYWxzZTtcbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmNoYXJDb2RlIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgdmFyIGtleUNvZGVDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2RlKTtcblxuICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgIHN3aXRjaCAoa2V5Q29kZUNoYXIudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICd5JzpcbiAgICAgICAgICBzZWxmLnJlZG8oKTtcbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBzZWxmLnVuZG8oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnJlZG8oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvdy5ldmVudCkge1xuICAgICAgICB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb2RlQ2hhbmdlIChldmVudCkge1xuICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBpZiAoKGtleUNvZGUgPj0gMzMgJiYga2V5Q29kZSA8PSA0MCkgfHwgKGtleUNvZGUgPj0gNjMyMzIgJiYga2V5Q29kZSA8PSA2MzIzNSkpIHtcbiAgICAgIHNldE1vZGUoJ21vdmluZycpO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSA4IHx8IGtleUNvZGUgPT0gNDYgfHwga2V5Q29kZSA9PSAxMjcpIHtcbiAgICAgIHNldE1vZGUoJ2RlbGV0aW5nJyk7XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09IDEzKSB7XG4gICAgICBzZXRNb2RlKCduZXdsaW5lcycpO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PSAyNykge1xuICAgICAgc2V0TW9kZSgnZXNjYXBlJyk7XG4gICAgfSBlbHNlIGlmICgoa2V5Q29kZSA8IDE2IHx8IGtleUNvZGUgPiAyMCkgJiYga2V5Q29kZSAhPSA5MSkge1xuICAgICAgc2V0TW9kZSgndHlwaW5nJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcnMgKCkge1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAna2V5cHJlc3MnLCBwcmV2ZW50Q3RybFlaKTtcbiAgICB1dGlsLmFkZEV2ZW50KHBhbmVscy5pbnB1dCwgJ2tleWRvd24nLCBoYW5kbGVDdHJsWVopO1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAna2V5ZG93bicsIGhhbmRsZU1vZGVDaGFuZ2UpO1xuICAgIHV0aWwuYWRkRXZlbnQocGFuZWxzLmlucHV0LCAnbW91c2Vkb3duJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2V0TW9kZSgnbW92aW5nJyk7XG4gICAgfSk7XG5cbiAgICBwYW5lbHMuaW5wdXQub25wYXN0ZSA9IGhhbmRsZVBhc3RlO1xuICAgIHBhbmVscy5pbnB1dC5vbmRyb3AgPSBoYW5kbGVQYXN0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVBhc3RlICgpIHtcbiAgICBpZiAodWEuaXNJRSB8fCAoaW5wdXRTdGF0ZSAmJiBpbnB1dFN0YXRlLnRleHQgIT0gcGFuZWxzLmlucHV0LnZhbHVlKSkge1xuICAgICAgaWYgKHRpbWVyID09IHZvaWQgMCkge1xuICAgICAgICBtb2RlID0gJ3Bhc3RlJztcbiAgICAgICAgc2F2ZVN0YXRlKCk7XG4gICAgICAgIHJlZnJlc2hTdGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIHNldEV2ZW50SGFuZGxlcnMoKTtcbiAgICByZWZyZXNoU3RhdGUodHJ1ZSk7XG4gICAgc2F2ZVN0YXRlKCk7XG4gIH07XG5cbiAgaW5pdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuZG9NYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdWx0cmFtYXJrZWQgPSByZXF1aXJlKCd1bHRyYW1hcmtlZCcpO1xuXG51bHRyYW1hcmtlZC5zZXRPcHRpb25zKHtcbiAgc21hcnRMaXN0czogdHJ1ZSxcbiAgdWx0cmFsaWdodDogdHJ1ZSxcbiAgdWx0cmFzYW5pdGl6ZTogdHJ1ZVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdWx0cmFtYXJrZWQ7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgdWkgPSByZXF1aXJlKCcuL3VpJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEVkaXRvciA9IHJlcXVpcmUoJy4vRWRpdG9yJyk7XG52YXIgbmV4dElkID0gMDtcblxuZnVuY3Rpb24gY29udmVydFRhYnMgKCkge1xuICB1dGlsLmFkZEV2ZW50RGVsZWdhdGUoZG9jLCAncG1rLWlucHV0JywgJ2tleWRvd24nLCB1aS5jb252ZXJ0VGFicyk7XG59XG5cbmZ1bmN0aW9uIHBvbnltYXJrIChjb250YWluZXIpIHtcbiAgdmFyIHBvc3RmaXggPSBuZXh0SWQrKztcbiAgbWFya3VwKGNvbnRhaW5lciwgcG9zdGZpeCk7XG4gIHZhciBlZGl0b3IgPSBuZXcgRWRpdG9yKHBvc3RmaXgpO1xuICBlZGl0b3IucnVuKCk7XG59XG5cbmZ1bmN0aW9uIG1hcmt1cCAoY29udGFpbmVyLCBwb3N0Zml4KSB7XG4gIHZhciBidXR0b25CYXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBwcmV2aWV3ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgaW5wdXQgPSBkb2MuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblxuICBidXR0b25CYXIuaWQgPSAncG1rLWJ1dHRvbnMtJyArIHBvc3RmaXg7XG4gIGJ1dHRvbkJhci5jbGFzc05hbWUgPSAncG1rLWJ1dHRvbnMnO1xuICBwcmV2aWV3LmlkID0gJ3Btay1wcmV2aWV3LScgKyBwb3N0Zml4O1xuICBwcmV2aWV3LmNsYXNzTmFtZSA9ICdwbWstcHJldmlldyc7XG4gIGlucHV0LmlkID0gJ3Btay1pbnB1dC0nICsgcG9zdGZpeDtcbiAgaW5wdXQuY2xhc3NOYW1lID0gJ3Btay1pbnB1dCc7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbkJhcik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dCk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwcmV2aWV3KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwb255bWFyaztcblxucG9ueW1hcmsuRWRpdG9yID0gRWRpdG9yO1xucG9ueW1hcmsuY29udmVydFRhYnMgPSBjb252ZXJ0VGFicztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIGdldFRvcCAoZWxlbSwgaXNJbm5lcikge1xuICB2YXIgcmVzdWx0ID0gZWxlbS5vZmZzZXRUb3A7XG4gIGlmICghaXNJbm5lcikge1xuICAgIHdoaWxlIChlbGVtID0gZWxlbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIHJlc3VsdCArPSBlbGVtLm9mZnNldFRvcDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIGdldEhlaWdodCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRIZWlnaHQgfHwgZWxlbS5zY3JvbGxIZWlnaHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRXaWR0aCAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLnNjcm9sbFdpZHRoO1xufTtcblxuZnVuY3Rpb24gZ2V0UGFnZVNpemUgKCkge1xuICB2YXIgc2Nyb2xsV2lkdGgsIHNjcm9sbEhlaWdodDtcbiAgdmFyIGlubmVyV2lkdGgsIGlubmVySGVpZ2h0O1xuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0ICYmIHNlbGYuc2Nyb2xsTWF4WSkge1xuICAgIHNjcm9sbFdpZHRoID0gZG9jLmJvZHkuc2Nyb2xsV2lkdGg7XG4gICAgc2Nyb2xsSGVpZ2h0ID0gc2VsZi5pbm5lckhlaWdodCArIHNlbGYuc2Nyb2xsTWF4WTtcbiAgfSBlbHNlIGlmIChkb2MuYm9keS5zY3JvbGxIZWlnaHQgPiBkb2MuYm9keS5vZmZzZXRIZWlnaHQpIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5LnNjcm9sbFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5LnNjcm9sbEhlaWdodDtcbiAgfSBlbHNlIHtcbiAgICBzY3JvbGxXaWR0aCA9IGRvYy5ib2R5Lm9mZnNldFdpZHRoO1xuICAgIHNjcm9sbEhlaWdodCA9IGRvYy5ib2R5Lm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIGlmIChzZWxmLmlubmVySGVpZ2h0KSB7XG4gICAgaW5uZXJXaWR0aCA9IHNlbGYuaW5uZXJXaWR0aDtcbiAgICBpbm5lckhlaWdodCA9IHNlbGYuaW5uZXJIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmRvY3VtZW50RWxlbWVudCAmJiBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgIGlubmVyV2lkdGggPSBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGlubmVySGVpZ2h0ID0gZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIH0gZWxzZSBpZiAoZG9jLmJvZHkpIHtcbiAgICBpbm5lcldpZHRoID0gZG9jLmJvZHkuY2xpZW50V2lkdGg7XG4gICAgaW5uZXJIZWlnaHQgPSBkb2MuYm9keS5jbGllbnRIZWlnaHQ7XG4gIH1cblxuICB2YXIgbWF4V2lkdGggPSBNYXRoLm1heChzY3JvbGxXaWR0aCwgaW5uZXJXaWR0aCk7XG4gIHZhciBtYXhIZWlnaHQgPSBNYXRoLm1heChzY3JvbGxIZWlnaHQsIGlubmVySGVpZ2h0KTtcbiAgcmV0dXJuIFttYXhXaWR0aCwgbWF4SGVpZ2h0LCBpbm5lcldpZHRoLCBpbm5lckhlaWdodF07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0VG9wOiBnZXRUb3AsXG4gIGdldEhlaWdodDogZ2V0SGVpZ2h0LFxuICBnZXRXaWR0aDogZ2V0V2lkdGgsXG4gIGdldFBhZ2VTaXplOiBnZXRQYWdlU2l6ZVxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBuYXYgPSB3aW5kb3cubmF2aWdhdG9yO1xudmFyIHVhID0gbmF2LnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xudmFyIHVhU25pZmZlciA9IHtcbiAgaXNJRTogL21zaWUvLnRlc3QodWEpLFxuICBpc0lFXzVvcjY6IC9tc2llIFs1Nl0vLnRlc3QodWEpLFxuICBpc09wZXJhOiAvb3BlcmEvLnRlc3QodWEpLFxuICBpc0Nocm9tZTogL2Nocm9tZS8udGVzdCh1YSksXG4gIGlzV2luZG93czogL3dpbi9pLnRlc3QobmF2LnBsYXRmb3JtKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1YVNuaWZmZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHByb21wdCAocGFydGlhbE5hbWUsIGNiKSB7XG4gIHZhciBib2R5ID0gJCgnYm9keScpO1xuICB2YXIgcGFydGlhbCA9IG5icnV0LnR0LnBhcnRpYWwocGFydGlhbE5hbWUsIHsgY29tcGxldGU6IGNvbXBsZXRlIH0pO1xuXG4gIHBhcnRpYWwuYXBwZW5kVG8oYm9keSk7XG5cbiAgZnVuY3Rpb24gY29tcGxldGUgKHRleHQpe1xuICAgIGlmICh0ZXh0ICE9PSBudWxsKXsgLy8gRml4ZXMgY29tbW9uIHBhc3RpbmcgZXJyb3JzLlxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXmh0dHA6XFwvXFwvKGh0dHBzP3xmdHApOlxcL1xcLy8sICckMTovLycpO1xuICAgICAgaWYgKHRleHRbMF0gIT09ICcvJyAmJiAhL14oPzpodHRwcz98ZnRwKTpcXC9cXC8vLnRlc3QodGV4dCkpe1xuICAgICAgICB0ZXh0ID0gJ2h0dHA6Ly8nICsgdGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYih0ZXh0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY29udmVydFRhYnMgKGUpIHtcbiAgdmFyIHRhID0gZS50YXJnZXQ7XG4gIHZhciBrZXlDb2RlID0gZS5jaGFyQ29kZSB8fCBlLmtleUNvZGU7XG4gIGlmIChrZXlDb2RlICE9PSA5KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICB2YXIgc3RhcnQgPSB0YS5zZWxlY3Rpb25TdGFydDtcbiAgdmFyIGVuZCA9IHRhLnNlbGVjdGlvbkVuZDtcbiAgdmFyIHZhbCA9IHRhLnZhbHVlO1xuICB2YXIgbGVmdCA9IHZhbC5zdWJzdHJpbmcoMCwgc3RhcnQpO1xuICB2YXIgcmlnaHQgPSB2YWwuc3Vic3RyaW5nKGVuZCk7XG5cbiAgdGEudmFsdWUgPSBsZWZ0ICsgJyAgICAnICsgcmlnaHQ7XG4gIHRhLnNlbGVjdGlvblN0YXJ0ID0gdGEuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyA0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJvbXB0OiBwcm9tcHQsXG4gIGNvbnZlcnRUYWJzOiBjb252ZXJ0VGFic1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNWaXNpYmxlIChlbGVtKSB7XG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdkaXNwbGF5JykgIT09ICdub25lJztcbiAgfSBlbHNlIGlmIChlbGVtLmN1cnJlbnRTdHlsZSkge1xuICAgIHJldHVybiBlbGVtLmN1cnJlbnRTdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXZlbnQgKGVsZW0sIHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgZWxlbS5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50RGVsZWdhdGUgKGVsZW0sIGNsYXNzTmFtZSwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxiJyArIGNsYXNzTmFtZSArICdcXGInKTtcblxuICBpZiAoZWxlbS5hdHRhY2hFdmVudCkge1xuICAgIGVsZW0uYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGRlbGVnYXRvcik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGRlbGVnYXRvciwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGRlbGVnYXRvciAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgZWxlbSA9IGUudGFyZ2V0O1xuICAgIGlmIChlbGVtLmNsYXNzTGlzdCkge1xuICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgZmlyZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWxlbS5jbGFzc05hbWUubWF0Y2gocmVnZXgpKSB7XG4gICAgICAgIGZpcmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXJlICgpIHtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudCAoZWxlbSwgZXZlbnQsIGxpc3RlbmVyKSB7XG4gIGlmIChlbGVtLmRldGFjaEV2ZW50KSB7XG4gICAgZWxlbS5kZXRhY2hFdmVudCgnb24nICsgZXZlbnQsIGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZml4RW9sQ2hhcnMgKHRleHQpIHtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxyL2csICdcXG4nKTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZFJlZ0V4cCAocmVnZXgsIHByZSwgcG9zdCkge1xuICBpZiAocHJlID09PSBudWxsIHx8IHByZSA9PT0gdm9pZCAwKSB7XG4gICAgcHJlID0gJyc7XG4gIH1cbiAgaWYgKHBvc3QgPT09IG51bGwgfHwgcG9zdCA9PT0gdm9pZCAwKSB7XG4gICAgcG9zdCA9ICcnO1xuICB9XG5cbiAgdmFyIHBhdHRlcm4gPSByZWdleC50b1N0cmluZygpO1xuICB2YXIgZmxhZ3M7XG5cbiAgcGF0dGVybiA9IHBhdHRlcm4ucmVwbGFjZSgvXFwvKFtnaW1dKikkLywgZnVuY3Rpb24gKHdob2xlTWF0Y2gsIGZsYWdzUGFydCkge1xuICAgIGZsYWdzID0gZmxhZ3NQYXJ0O1xuICAgIHJldHVybiAnJztcbiAgfSk7XG4gIHBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoLyheXFwvfFxcLyQpL2csICcnKTtcbiAgcGF0dGVybiA9IHByZSArIHBhdHRlcm4gKyBwb3N0O1xuICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1Zpc2libGU6IGlzVmlzaWJsZSxcbiAgYWRkRXZlbnQ6IGFkZEV2ZW50LFxuICBhZGRFdmVudERlbGVnYXRlOiBhZGRFdmVudERlbGVnYXRlLFxuICByZW1vdmVFdmVudDogcmVtb3ZlRXZlbnQsXG4gIGZpeEVvbENoYXJzOiBmaXhFb2xDaGFycyxcbiAgZXh0ZW5kUmVnRXhwOiBleHRlbmRSZWdFeHBcbn07XG4iXX0=
(70)
});
