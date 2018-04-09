const _ = require('lodash')

module.exports = {
  id: 'quick_reply',
  title: 'Respostas Rápidas',
  renderer: '#quick_reply-question',

  jsonSchema: {
    title: 'Respostas Rápidas',
    description: 'Crie perguntas com respostas rápidas usando botões',
    type: 'object',
    required: ['question', 'answers'],
    properties: {
      question: {
        type: 'string',
        title: 'Question'
      },
      answers: {
        title: 'answers Answers',
        type: 'array',
        items: {
          title: 'Respostas rápidas',
          type: 'object',
          properties: {
            label: { "type": "string" },
            value: { "type": "string" }
          }
        }
      }
    }
  },

  uiSchema: {
    answers: {
      'ui:options': {
        orderable: false
      }
    }
  },

  computeData: formData => {
    const answers = formData.answers.map(answer => ({ payload: answer.value, text: answer.label }))

    return {
      question: formData.question,
      answers: answers
    }
  },

  computePreviewText: formData => 'Question: ' + formData.question,
  computeMetadata: null
}
