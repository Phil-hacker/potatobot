import * as db from '../utils/db.js';

console.log(db);
//create something
const bunnyId = await db.create('bunnyCounter')({numberOfBunnies: 1, id: 'bun1'});
console.log(bunnyId);

const updatedBunny = await db.update('bunnyCounter')({id: 'bun1'}, {numberOfBunnies: 2});
console.log(updatedBunny);

const bunnyCounter = await db.get('bunnyCounter')({id: 'bun1'});
console.log(bunnyCounter);

let bunListID = await db.create('listOfBunnies')({id: 'bunnyList1', bunnies: [{name: 'bun1'}, {name: 'bun2'}]});
console.log(bunListID);

const didUpdateBunList = await db.updateInList('listOfBunnies')({id: 'bunnyList1'},{"bunnies.0.name": 'bun0'});
console.log(didUpdateBunList);

const didRemoveBunList = await db.removeOneFromList('listOfBunnies')({id: 'bunnyList1'}, 'bunnies', {name: 'bun2'});
console.log(didRemoveBunList);

const bunList = await db.get('listOfBunnies')({id: 'bunnyList1'});
console.log(bunList);
