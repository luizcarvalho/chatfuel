const _ = require('lodash');

async function asyncForEach(array, callback){
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function getFields(state, event, fields){
  // console.log(state.getOwnPropertyNames())
}

module.exports = {
  /**
 * @param {string} args.url - When request will be made
 * @param {string} args.method - get or post
 * @param {string} args.fields - All attributes with commas
 */
  sendRequest: (state, event, { url, method, fields }) => {
    debugger;
    getFields(state, event, fields);
    return { ...state }
  },

  verify_sign_in: async (state, event) => {
    // OPTIMIZE: get info in API
    return {
      ...state,
      signed_in: true
    };
  },

  setUserInput: async (state, event, args) => {
    Object.entries(args).forEach(([key, value]) => {
      event.bp.users.tag(event.user.id, key, value)
    });
    return { ...state, ...args }
  },
  // INPUT X
  getUserInput: async (state, event, args) => {
    let result = {}
    entries = Object.entries(args)
    await asyncForEach(Object.keys(args), async (key) => {
      console.log(key)
      result[key] =  await event.bp.users.getTag(event.user.id, key) // || default_value
      console.log(result[key])
    });

    return { ...state, ...result }
  },

  debug: async (state, event) => {
    console.log(event.raw)
    return {
      ...state
    }
  },

// --------------------------------------------- TRIVIA --------------------------------------------------
  startGame: state => {
    return {
      ...state, // we clone the existing state
      count: 0, // we then reset the number of questions asked to `0`
      score: 0, // and we reset the score to `0`
    }
  },

  sendRandomQuestion: async (state, event) => {
    // The `-random()` extension picks a random element in all the `trivia` Content Type
    // We also retrieve the message we just sent, notice that `event.reply` is asynchronous, so we need to `await` it
    const messageSent = await event.reply('#!trivia-random()')

    // We find the good answer
    const goodAnswer = _.find(messageSent.context.choices, { payload: 'TRIVIA_GOOD' })

    return {
      ...state, // We clone the state
      isCorrect: null, // We reset `isCorrect` (optional)
      count: state.count + 1, // We increase the number of questions we asked so far
      goodAnswer // We store the goodAnswer in the state, so that we can match the user's response against it
    }
  },

  render: async (state, event, args) => {
    if (!args.renderer) {
      throw new Error('Missing "renderer"')
    }

    await event.reply(args.renderer, args)
  },

  validateAnswer: (state, event) => {
    const isCorrect = event.text === state.goodAnswer.text
    return { ...state, isCorrect: isCorrect, score: isCorrect ? state.score + 1 : state.score }
  },



  /**
 * @param {string} args.name - Name of the tag.
 * @param {string} args.value - Value of the tag.
 */
  setUserTag: async (state, event, { name, value }) => {
    await event.bp.users.tag(event.user.id, name, value)
    return { ...state }
  },

  getUserTag: async (state, event, { name, into }) => {
    const value = await event.bp.users.getTag(event.user.id, name)
    return { ...state, [into]: value }
  }
}
