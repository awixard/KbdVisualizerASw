var instrDefs

const toBeExported=
{
  instrumentDefs:{
    flutes: {
      fill:'rgb(60, 206, 255)',
      //fill:"#ffffff",
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',//HoneyDew',
      //noteLineStroke: 'Black',
      min:60, max:96
    },
    oboes:{
      fill:'rgb(187,9,142)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:58,max:91
    },
    englishHorns: {
      fill:'rgb(133,44,152)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:52, max:81
    },
    clarinets:{
      fill: 'rgb(148,177,177)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'DarkRed',
      min:50, max:94
    },
    bassoons: {
      fill: 'rgb(92,98,57)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:34, max:75
    },
    frenchHorns:{
      fill: 'rgb(255,128,0)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'Navy',
      min:34, max: 75
    },
    harp:{
      //fill:"#ffffff",
      fill: 'rgb(255,255,85)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'ForestGreen',
      //noteLineStroke: 'DarkRed',
      min:24, max:103
    },
    violins:{
      fill:'rgb(194,163,141)',
      borderStroke:'rgb(206, 203, 200)',
      noteLineStroke: 'MidnightBlue',
      min:55, max:103
    },
    violin:{
      fill:'rgb(194,163,141)',
      borderStroke:'rgb(206, 203, 200)',
      noteLineStroke: 'MidnightBlue',
      min:55, max:103
    },
    violinsI:{
      fill:'rgb(194,163,141)',
      borderStroke:'rgb(206, 203, 200)',
      noteLineStroke: 'MidnightBlue',
      min:55, max:103
    },
    violinsII:{
      fill:'rgb(194,163,141)',
      borderStroke: 'rgb(145, 143, 141)',
      noteLineStroke: 'MidnightBlue',
      min:55, max:103
    },
    violas: {
      fill: 'rgb(117,71,38)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'MintCream',
      min:48, max:91
    },
    cello:{
      fill:'rgb(150,14,14)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:36, max:76

    },
    cellos:{
      fill:'rgb(150,14,14)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:36, max:76
    },
    basses: {
      fill:'rgb(70,0,0)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'MintCream',
      min:28, max:67
    },
    ancientCymbals:{
      fill:'rgb(116,124,170)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'Navy',
      min:36, max:76 //????
    },
    timpani:{
      fill:'rgb(86, 89, 107)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:31, max:60
    },
    percussion:{
      fill:'rgb(86, 89, 107)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'White',
      min:26, max:83
    },
    trumpets:{
      fill:'rgb(156, 44, 15)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'PapayaWhip',
      min:55, max:82
    },
    piano:{
      fill:'rgb(16, 65, 44)',
      borderStroke: 'rgb(206, 203, 200)',
      noteLineStroke: 'rgb(206, 203, 200)',
      min:20, max:88
    }
  },
  noteInRange: function(noteVal, instrName){
    let instrSpec = instrDefs[instrName]
    return noteVal >= instrSpec.min && noteVal <= instrSpec.max
  }
}
instrDefs = toBeExported.instrumentDefs

for( anInstName in toBeExported.instrumentDefs){
  let o = toBeExported.instrumentDefs[anInstName]
  o.halfSteps = o.max-o.min 
}

module.exports = toBeExported