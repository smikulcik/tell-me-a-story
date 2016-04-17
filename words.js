var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var natural = require("natural");
var wordnet = new natural.WordNet();
	var sprintf = require('sprintf');
var Tagger = require("./node_modules/natural/lib/natural").BrillPOSTagger;


var base_folder = "./node_modules/natural/lib/natural/brill_pos_tagger";
var rules_file = base_folder + "/data/English/tr_from_posjs.txt";
var lexicon_file = base_folder + "/data/English/lexicon_from_posjs.json";
var default_category = 'N';


/**
CC Coord Conjuncn           and,but,or
NN Noun, sing. or mass      dog
CD Cardinal number          one,two
NNS Noun, plural            dogs
DT Determiner               the,some
NNP Proper noun, sing.      Edinburgh
EX Existential there        there
NNPS Proper noun, plural    Smiths
FW Foreign Word             mon dieu
PDT Predeterminer           all, both
IN Preposition              of,in,by
POS Possessive ending       ’s
JJ Adjective                big
PP Personal pronoun         I,you,she
JJR Adj., comparative       bigger
PP$ Possessive pronoun      my,one’s
JJS Adj., superlative       biggest
RB Adverb                   quickly
LS List item marker         1,One
RBR Adverb, comparative     faster
MD Modal                    can,should
RBS Adverb, superlative     fastest
RP Particle                 up,off
WP$ Possessive-Wh           whose
SYM Symbol                  +,%,&
WRB Wh-adverb               how,where
TO “to”                     to
$ Dollar sign               $
UH Interjection             oh, oops
# Pound sign                #
VB verb, base form          eat
" quote                     "
VBD verb, past tense        ate
VBG verb, gerund            eating
( Left paren                (
VBN verb, past part         eaten
) Right paren               )
VBP Verb, present           eat
, Comma                     ,
VBZ Verb, present           eats
. Sent-final punct          . ! ?
WDT Wh-determiner           which,that
: Mid-sent punct.           : ; —
WP Wh pronoun               who,what
**/
var noun_types = ['NN', 'NNS', 'NNP','NNPS','VBG'];;
var adj_types = ['JJ','JJS','JJR'];
var adv_types = ['RB','RBR'];
var verb_types = ['VB','VBD', 'VBN','VBP','VBZ']; // base, past, past part., present,

var s_patterns = [
	"A %(n)s %(adv)s %(v)s the %(adj)s %(n2)s",
	"However, when the %(n)s %(v)s the %(n2)s, a %(n3)s went to the %(n4)s %(adv)s",
	"As %(n)s %(v)s the %(adj)s %(n)s from its %(n2)s, %(past-v)s at its %(adv)s power %(v2)s from the %(n3)s into you own %(n4)s.",
	"The %(n)s would never forget what happened on that night.",
	"Under the command of Admiral %(n)s, you and %(adj)s %(n)s disembark to defend the galaxy from the %(adj2)s %(n2)s and their plan for %(v)s.",
	"Then from nowhere came the %(n)s of %(n2)s %(adj)s a %(v)s be made in his honor if the %(n3)s wished to %(v2)s.",
	"%(adv)s now! Make like a %(adj)s %(adj2)s %(n)s and %(v)s out of %(n)s.",
	"AWW FREAKING %(adv)s %(adj)s %(n)s. Why the %(adv2)s %(v)s does this happen to %(n)s! Forget my %(n)s.",
	"%(v)s it. %(v)s it. %(v)s it. %(v)s IT! WHY AREN'T YOU %(v)sING IT!",
	"You had a dream where %(n)s was %(v)s %(n2)s only to have a %(adj)s %(n3)s come and %(v2)s all over. Then for some reason you were %(v3)s a %(n4)s and %(n)s turned into a %(adj)s %(n5)s which was perfect since you needed something to %(v4)s %(n3)s because he was trying to %(v)s as well.",
	"%(n)! Use your %(adv)s %(v)s attack!...It's %(adv)s effective!",
	"I am your %(n)s's %(n2)s's %(adj)s %(v)s %(n3)s's %(n4)s...I forget where I was %(v2)sing with this...",
	"Hello, welcome to the world of %(n)s. My name is Prof. %(n2)s. People affectional %(v)s me as the %(n)s %(n3)s.",
	"So your %(n)s is, as described by you, a %(n2)s %(adj)s %(n)s ...neat...",
	"Once apon a time there was a %(n)s %(adj)s %(n2)s. He was so %(adj)s that everybody %(v)s. The End.",
	"Yo %(n)s so %(adj)s, that %(n2)s had to %(v)s their own %(n3)s out.",
	"You have activated my %(adj)s %(n)s card. Due to this you can no longer %(v)s any of your %(n2)s on your side of the %(n3)s.",
	"No, it can't %(v)s this way!",
	"I see what you %(v)s there. Thinking that %(v2)s %(n)s would make me not %(adj)s.",
	"Thank you for you purchase of 1,000 %(n)ss. We will not %(v)s why you need 1000 %(n)ss for just because we have your %(n2)s now so we don't care.",
];
var tagger = new Tagger(lexicon_file, rules_file, default_category, function(error) {
generateSentence("")//"The spider walked into the barnyard where the cows live.")
.then(function(result){console.log(result);});

});//tagger

var generateSentence = function(in_sent){
	return new Promise(function(resolve, reject){
		
		var nouns = [];//["person", "man", "woman"];
		var adjs = [];//["awesome", "terrible", "cool"];
		var advs = [];//["slowly", "quickly", "superbly"];
		var verbs = [];//["went", "did", "slay"];

		var addWords = function(list){
			
			var tagged = tagger.tag(list);
			//console.log(tagged);
			
			for(var i=0;i<tagged.length;i++){
				var word = tagged[i][0];
				var type = tagged[1]
				if(noun_types.indexOf(tagged[i][1]) > -1)
					nouns.push(tagged[i][0]);
				if(adj_types.indexOf(tagged[i][1]) > -1)
					adjs.push(tagged[i][0]);
				if(adv_types.indexOf(tagged[i][1]) > -1)
					advs.push(tagged[i][0]);
				if(verb_types.indexOf(tagged[i][1]) > -1)
					verbs.push(tagged[i][0]);
			}
		};
		var getSynonyms = function(){
			var promises = [];
			//noun
			for(var i=0;i<nouns.length;i++){
				promises.push(new Promise(function(resolve, reject){
					wordnet.lookup(nouns[i], function(results) {
						Promise.all(results.map(function(result){
							addWords(result.synonyms);
						})).then(function(){resolve()});
					});
				}));
			}
			//adjs
			for(var i=0;i<adjs.length;i++){
				promises.push(new Promise(function(resolve, reject){
					wordnet.lookup(adjs[i], function(results) {
						Promise.all(results.map(function(result){
							addWords(result.synonyms);
						})).then(function(){resolve()});
					});
				}));
			}
			//advs
			for(var i=0;i<advs.length;i++){
				promises.push(new Promise(function(resolve, reject){
					wordnet.lookup(advs[i], function(results) {
						Promise.all(results.map(function(result){
							addWords(result.synonyms);
						})).then(function(){resolve()});
					});
				}));
			}
			//verb
			for(var i=0;i<verbs.length;i++){
				promises.push(new Promise(function(resolve, reject){
					wordnet.lookup(verbs[i], function(results) {
						Promise.all(results.map(function(result){
							addWords(result.synonyms);
						})).then(function(){resolve()});
					});
				}));
			}
			return Promise.all(promises).then(function(){
				var p_list = [];
				if(nouns.length < 5){
					p_list.push(new Promise(function(res,rej){
						wordpos.randNoun({count:5}, function(result){
							nouns = nouns.concat(result);
							res();
						}, res);
					}));
				}
				if(adjs.length < 5){
					p_list.push(new Promise(function(res,rej){
						wordpos.randNoun({count:5}, function(result){
							adjs = adjs.concat(result);
							res();
						}, res);
					}));
				}
				if(advs.length < 5){
					p_list.push(new Promise(function(res,rej){
						wordpos.randNoun({count:5}, function(result){
							advs = advs.concat(result);
							res();
						}, res);
					}));
				}
				if(verbs.length < 5){
					p_list.push(new Promise(function(res,rej){
						wordpos.randNoun({count:5}, function(result){
							verbs = verbs.concat(result);
							res();
						}, res);
					}));
				}
				return Promise.all(p_list);
			});
		};
		addWords(in_sent.split(" "));
		getSynonyms().then(function(){
			var sent = sprintf(
				s_patterns[Math.floor(s_patterns.length*Math.random())], 
				{
					"n":nouns[Math.floor(nouns.length*Math.random())],
					"n2":nouns[Math.floor(nouns.length*Math.random())],
					"n3":nouns[Math.floor(nouns.length*Math.random())],
					"n4":nouns[Math.floor(nouns.length*Math.random())],
					"n5":nouns[Math.floor(nouns.length*Math.random())],
					"adj":adjs[Math.floor(adjs.length*Math.random())],
					"adj2":adjs[Math.floor(adjs.length*Math.random())],
					"adj3":adjs[Math.floor(adjs.length*Math.random())],
					"adj4":adjs[Math.floor(adjs.length*Math.random())],
					"adj5":adjs[Math.floor(adjs.length*Math.random())],
					"adv":advs[Math.floor(advs.length*Math.random())],
					"adv2":advs[Math.floor(advs.length*Math.random())],
					"adv3":advs[Math.floor(advs.length*Math.random())],
					"adv4":advs[Math.floor(advs.length*Math.random())],
					"adv5":advs[Math.floor(advs.length*Math.random())],
					"v": verbs[Math.floor(verbs.length*Math.random())],
					"v2": verbs[Math.floor(verbs.length*Math.random())],
					"v3": verbs[Math.floor(verbs.length*Math.random())],
					"v4": verbs[Math.floor(verbs.length*Math.random())],
					"v5": verbs[Math.floor(verbs.length*Math.random())]
				});
			sent = sent.replace(/_/g, " ");
			resolve(sent);
		});

	});//promise
};//generateSentence

module.exports = {
	"generateSentence": generateSentence
};