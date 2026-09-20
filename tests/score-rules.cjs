const test=require('node:test');
const assert=require('node:assert/strict');
const {calculate}=require('../score-rules.js');
test('Hangman awards a solved word, handles Ñ and accents and reduces hint/error bonuses',()=>{
 const win={word:'niño',guesses:['N','I','Ñ','O'],hintUsed:false};
 assert.equal(calculate('hangman',win),180);
 assert.equal(calculate('hangman',{...win,hintUsed:true}),155);
 assert.equal(calculate('hangman',{...win,guesses:[...win.guesses,'Z']}),170);
 assert.equal(calculate('hangman',{word:'pingüino',guesses:['P','I','N','G','U','O'],hintUsed:false}),200);
 assert.equal(calculate('hangman',{...win,guesses:['N','I','O']}),0);
 assert.equal(calculate('hangman',{...win,guesses:[...win.guesses,'A','B','C','D','E','F']}),0);
 assert.equal(calculate('hangman',{...win,guesses:[...win.guesses,'N']}),0);
});
test('Creative activities have explicit requirements; repeating one action is not enough',()=>{
 assert.equal(calculate('artist',{colors:['#ff0000','#00ff00','#0000ff'],tools:['brush','star'],strokes:10}),50);
 assert.equal(calculate('artist',{colors:['#ffffff','#FFFFFF','#ffffff'],tools:['brush','star'],strokes:10}),0);
 assert.equal(calculate('artist',{colors:['#ff0000','#00ff00','#0000ff'],tools:['brush','brush'],strokes:10}),0);
 assert.equal(calculate('artist',{colors:['#ff0000','#00ff00','#0000ff'],tools:['brush','star'],strokes:9}),0);
 assert.equal(calculate('garden',{seed:'rose',water:2,sun:2}),25);
 assert.equal(calculate('garden',{seed:'rose',water:1,sun:2}),0);
 assert.equal(calculate('wardrobe',{outfit:{top:'tee-lilac',bottom:'jeans',shoes:'shoes-white'}}),30);
 assert.equal(calculate('wardrobe',{outfit:{dress:'dress-sun',shoes:'shoes-white'}}),30);
 assert.equal(calculate('wardrobe',{outfit:{dress:'dress-sun',top:'tee-lilac',shoes:'shoes-white'}}),0);
 assert.equal(calculate('salon',{stations:['hair','nails']}),20);
 assert.equal(calculate('salon',{stations:['hair','hair']}),0);
});
test('Invalid inputs cannot request arbitrary scores',()=>{
 for(const game of ['hangman','garden','artist','wardrobe','salon','unknown']){
  for(const value of [null,undefined,[],{points:999999},'test',{}])assert.equal(calculate(game,value),0);
 }
});
