const blackKeys = [ false, true, false, true, false,false, true,false, true,false, true,false]
const helpers = {
	noteNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	noteNameFor: aNoteNr => noteNames[ aNoteNr % 12],
	get blackKeys(){ return blackKeys},
	isBlackKey: aNoteNr => blackKeys[ aNoteNr % 12],
	octaveFor: aNoteNr => Math.trunc(aNoteNr/12),
	noteOffsets: {'C':0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11},
	noteNrFor: (aNoteName, anOctave) => anOctave*12 + noteOffsets[aNoteName],

  deepCopy(data) { return JSON.parse(JSON.stringify(data))}, 
  compareDicts: function(newOnes, oldOnes){
		let result = {added:[], removed:[]}
		let newKeys = Object.keys(newOnes)
		let oldKeys = Object.keys(oldOnes)
	
		oldKeys.forEach( aKey=>{
			if (!newOnes[ aKey ]) result.removed.push( aKey );
		})
		newKeys.forEach( aKey=>{
			if (!oldOnes[ aKey ]) result.added.push( aKey )
		})
		return result
	},
	gebi: (anId) => document.getElementById(anId),
}
module.exports = helpers
