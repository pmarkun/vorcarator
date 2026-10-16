const test=require('node:test');const assert=require('node:assert/strict');
require('../vocarator/theme.js');const c=VocaratorTheme;
test('both marker palettes meet normal-text contrast, including the small tag',()=>{for(const palette of Object.values(c.palettes))assert(c.contrast(c.parseColor(palette.ink),c.parseColor(palette.surface))>=4.5);});
test('parse transparent, hexadecimal and computed RGBA colors',()=>{assert.deepEqual(c.parseColor('transparent'),[0,0,0,0]);assert.deepEqual(c.parseColor('#fff'),[255,255,255,1]);assert.deepEqual(c.parseColor('#123456'),[18,52,86,1]);assert.deepEqual(c.parseColor('rgba(10, 20, 30, 0.5)'),[10,20,30,.5]);});
test('contrast uses linearized relative luminance',()=>assert.equal(c.contrast([255,255,255],[0,0,0]),21));
