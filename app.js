const data = require('./data');

'use strict'

const args = process.argv

let output = []

function isEmpty(arr) {
  return (Array.isArray(arr) && arr.length)
}

function isFiltering(arg) {
  const cmd = arg.split("=");
  return (cmd[0] === '--filter' || cmd[0] === 'filter')
}

function isCounting(arg) {
  const cmd = arg.split("=");
  return (cmd[0] === '--count' || cmd[0] === 'count')
}

function isFilteringAndCounting(arg1, arg2) {
  return ((isFiltering(arg1) && isCounting(arg2)) || (isCounting(arg1) && isFiltering(arg2)))
}

// This function filters out every animal that does not match the string pattern
const removeNonMatching = (searchedStr, person) => {
  return person.animals.map((animal) => {
    if (animal.name.includes(searchedStr)) {
      return animal;
    }
  }).filter(e => e)
}

const filter = (searchedStr) => {
  newList = data.filter(q => {
    let newCountry = q
    newCountry.people = q.people.filter(p => {
      let newPerson = p
      newPerson.animals = removeNonMatching(searchedStr, p)

      // The 'animals' entry will be removed if there is nothing left inside
      return isEmpty(newPerson.animals)
    })

    // The 'people' entry will be removed if there is nothing left inside
    return (isEmpty(newCountry.people))
  });

  // prints out the filtered list if there is any match
  return (!isEmpty(newList)) ? 'Nothing found' : newList
}

const count = (list) => {
  const toCount = !isEmpty(list) ? data : list
  const newList = toCount.map((country) => {
    country.people.map((person) => {
      person.name = `${person.name} [${person.animals.length}]`
      return person
    })
    country.name = `${country.name} [${country.people.length}]`
    return country
  })
  return newList
}

// USAGE: node app.js --filter=[PATTERN] OR node app.js filter=[PATTERN]
// USAGE: node app.js --count OR node app.js count

try {

  // const cmd = args[2].split("=");
  if (args.length == 3) {
    if (isFiltering(args[2])) {
      const cmd = args[2].split("=");
      output = filter(cmd[1])
    } else if (isCounting(args[2])) {
      output = count()
    } else {
      console.log('Wrong arguments')
    }
  } else if (args.length == 4) {
    if (isFilteringAndCounting(args[2], args[3])) {
      isFiltering(args[3]) ? output = count(filter(args[3].split("=")[1])) : output = count(filter(args[4].split("=")[1]))
    } else {
      console.log('Wrong arguments')
    }

  } else {
    console.log('The number of arguments is wrong')
  }

  console.log((!isEmpty(output)) ? 'Nothing found' : JSON.stringify(output))
} catch (err) {
  throw err
}




module.exports = {
  count, filter
}