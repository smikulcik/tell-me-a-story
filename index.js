var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var natural = require("natural");
var wordnet = new natural.WordNet();
	var sprintf = require('sprintf');
var prompt = require('prompt');
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

var nouns = [];//["person", "man", "woman"];
var adjs = ["awesome", "terrible", "cool"];
var advs = ["slowly", "quickly", "superbly"];
var verbs = ["went", "did", "slay"];
prompt.start();

var tagger = new Tagger(lexicon_file, rules_file, default_category, function(error) {
	prompt.get(['sentence'], function (err, result) {
		var tagged = tagger.tag(result.sentence.split(" "));
		console.log(tagged);
		
		for(var i=0;i<tagged.length;i++){
			if(noun_types.indexOf(tagged[i][1]) > -1)
				nouns.push(tagged[i][0]);
			if(adj_types.indexOf(tagged[i][1]) > -1)
				adjs.push(tagged[i][0]);
			if(adv_types.indexOf(tagged[i][1]) > -1)
				advs.push(tagged[i][0]);
			if(verb_types.indexOf(tagged[i][1]) > -1)
				verbs.push(tagged[i][0]);
		}
		
		for(var i=0;i<nouns.length;i++){
			wordnet.lookup(nouns[i], function(results) {
				console.log(results[0]);
				results.forEach(function(result){
					result.synonyms.forEach(function(result) {
						nouns.push(result);
						console.log("SYN: " + result);
					});
				});
			});
		}
		
		console.log(sprintf(
			"Once upon a time a %(n1)s %(adv)s %(v)s the %(adj)s %(n2)s", 
			{
				"n1":nouns[Math.floor(nouns.length*Math.random())],
				"n2":nouns[Math.floor(nouns.length*Math.random())],
				"adj":adjs[Math.floor(adjs.length*Math.random())],
				"adv":advs[Math.floor(advs.length*Math.random())],
				"v": verbs[Math.floor(verbs.length*Math.random())]
			}));
	});
});
